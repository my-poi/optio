import { PlannedDay } from '../objects/planned-day';
import { Shift } from '../objects/shift';
import { TimeSpan } from '../objects/time-span';
import { ShiftDuration } from '../objects/shift-duration';

export class ScheduleValidator {
  validateScheduleDayDailyBreak(
    plannedDay: PlannedDay,
    employeePlannedDays: PlannedDay[],
    shifts: Shift[]): boolean {
    if (!plannedDay.shiftId || plannedDay.shiftId >= 40) return false;

    const currentDay = new Date(plannedDay.day);
    const previousDay = new Date(currentDay);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousPlannedDay = employeePlannedDays.find(x =>
      new Date(x.day).getTime() === previousDay.getTime());

    if (!previousPlannedDay) return false;
    if (!previousPlannedDay.shiftId) return false;

    const previousWorkDayShift = shifts.find(x => x.id === previousPlannedDay.shiftId);
    const previousWorkDayShiftDuration = this.getShiftDuration(previousDay, previousWorkDayShift!.durations);
    const previousStartHours = Number(previousWorkDayShiftDuration!.start.substring(0, 2));
    const previousStartMinutes = Number(previousWorkDayShiftDuration!.start.substring(3, 5));
    const previousWorkDayStartingTime = new TimeSpan(0, previousStartHours, previousStartMinutes);

    const currentWorkDayShift = shifts.find(x => x.id === plannedDay.shiftId);
    const currentWorkDayShiftDuration = this.getShiftDuration(currentDay, currentWorkDayShift!.durations);
    const currentStartHours = Number(currentWorkDayShiftDuration!.start.substring(0, 2));
    const currentStartMinutes = Number(currentWorkDayShiftDuration!.start.substring(3, 5));
    const currentWorkDayStartingTime = new TimeSpan(0, currentStartHours, currentStartMinutes);

    const minutesDifference = currentWorkDayStartingTime.totalMinutes() - previousWorkDayStartingTime.totalMinutes();
    return minutesDifference < 0;
  }

  getShiftDuration(day: Date, durations: ShiftDuration[]): ShiftDuration {
    const dayTime = new Date(day).getTime();
    const duration = durations.filter(x =>
      dayTime >= new Date(x.validFrom).getTime() &&
      dayTime <= this.getShiftValidToDate(x.validTo).getTime())[0];
    return duration;
  }

  getShiftValidToDate(validTo: Date): Date {
    return validTo === null ? new Date(9999, 12, 31) : new Date(validTo);
  }

  validateWeekBreakAndHourlyLimit(lastWeekDay: Date, employeePlannedDays: PlannedDay[], shifts: Shift[]) {
    const firstWeekDay = new Date(lastWeekDay);
    firstWeekDay.setDate(firstWeekDay.getDate() - 6);
    const hasWeekBreak = this.validateWeekBreak(firstWeekDay, employeePlannedDays, shifts);
    const hasWeekHourlyLimit = this.validateWeekHourlyLimit(firstWeekDay, employeePlannedDays);
    return { hasWeekBreak: hasWeekBreak, hasWeekHourlyLimit: hasWeekHourlyLimit };
  }

  validateWeekBreak(lastWeekDay: Date, employeePlannedDays: PlannedDay[], shifts: Shift[]) {
    const testedPlannedDays = this.getTestedPlannedDays(lastWeekDay, employeePlannedDays);

    if (!testedPlannedDays) return true;

    let breakStart = this.getBreakStart(new Date(lastWeekDay), employeePlannedDays, shifts);

    const isValid = testedPlannedDays.some(plannedDay => {
      const validateDayWeekBreak = this.validateDayWeekBreak(plannedDay, breakStart, shifts);
      if (validateDayWeekBreak.isValid) return true;
      breakStart = validateDayWeekBreak.breakStart;
      return false;
    });

    return isValid;
  }

  validateDayWeekBreak(plannedDay: PlannedDay, breakStart: Date, shifts: Shift[]) {
    let isValid = false;
    const newStart = new Date(plannedDay.day);
    newStart.setHours(0, 0, 0);

    if (plannedDay.shiftId) {
      const plannedDayShift = shifts.find(x => x.id === plannedDay.shiftId);
      const plannedDayShiftDuration = this.getShiftDuration(plannedDay.day, plannedDayShift!.durations);
      const plannedDayStartHours = Number(plannedDayShiftDuration!.start.substring(0, 2));
      const plannedDayStartMinutes = Number(plannedDayShiftDuration!.start.substring(3, 5));

      newStart.setHours(plannedDayStartHours, plannedDayStartMinutes, 0);
      const difference = newStart.getTime() - breakStart.getTime();
      const resultInMinutes = Math.round(difference / 60000);
      if (resultInMinutes >= 2100) isValid = true;

      breakStart = new Date(plannedDay.day);
      const h = plannedDay.hours || 0;
      const m = plannedDay.minutes || 0;
      breakStart.setHours(plannedDayStartHours + h, plannedDayStartMinutes + m, 0);
    } else {
      newStart.setDate(newStart.getDate() + 1);
      const difference = newStart.getTime() - breakStart.getTime();
      const resultInMinutes = Math.round(difference / 60000);
      if (resultInMinutes >= 2100) isValid = true;
    }

    return { isValid: isValid, breakStart: breakStart };
  }

  validateWeekHourlyLimit(firstWeekDay: Date, employeePlannedDays: PlannedDay[]) {
    const testedPlannedDays = this.getTestedPlannedDays(firstWeekDay, employeePlannedDays);

    if (!testedPlannedDays) return true;

    const result = new TimeSpan();

    testedPlannedDays.forEach((testedPlannedDay: PlannedDay) => {
      result.addHours(testedPlannedDay.hours || 0);
      result.addMinutes(testedPlannedDay.minutes || 0);
    });

    return result.totalMinutes() <= 2880;
  }

  getTestedPlannedDays(firstWeekDay: Date, employeePlannedDays: PlannedDay[]) {
    const testedPlannedDays: PlannedDay[] = [];
    const testedDay = new Date(firstWeekDay);

    for (let i = 1; i <= 7; i++) {
      const testedPlannedDay = employeePlannedDays.find(plannedDay => {
        const y = testedDay.getFullYear();
        const m = String(testedDay.getMonth() + 1);
        const d = String(testedDay.getDate());
        return plannedDay.day.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      });

      if (!testedPlannedDay) return null;
      testedPlannedDays.push(testedPlannedDay);
      testedDay.setDate(testedDay.getDate() + 1);
    }

    return testedPlannedDays;
  }

  getBreakStart(day: Date, employeePlannedDays: PlannedDay[], shifts: Shift[]): Date {
    const breakStart = new Date(day);
    breakStart.setHours(0, 0, 0);
    const beforeDay = new Date(day);
    beforeDay.setDate(beforeDay.getDate() - 1);

    const beforePlannedDay = employeePlannedDays.find(x => {
      const y = beforeDay.getFullYear();
      const m = String(beforeDay.getMonth() + 1);
      const d = String(beforeDay.getDate());
      return x.day.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    });

    if (beforePlannedDay) {
      const shiftId = beforePlannedDay.shiftId || 0;
      if (shiftId >= 1 && shiftId <= 20) {
        const beforePlannedDayShift = shifts.find(x => x.id === beforePlannedDay.shiftId);
        const beforePlannedDayShiftDuration = this.getShiftDuration(beforePlannedDay.day, beforePlannedDayShift!.durations);
        const beforePlannedDayStartHours = Number(beforePlannedDayShiftDuration!.start.substring(0, 2));
        const beforePlannedDayStartMinutes = Number(beforePlannedDayShiftDuration!.start.substring(3, 5));
        const beforePlannedDayShiftStart = new TimeSpan(0, beforePlannedDayStartHours, beforePlannedDayStartMinutes);
        beforePlannedDayShiftStart.addHours(beforePlannedDay.hours || 0);
        beforePlannedDayShiftStart.addMinutes(beforePlannedDay.minutes || 0);
        let beforePlannedDayShiftEndMinutes = beforePlannedDayShiftStart.totalMinutes();
        if (beforePlannedDayShiftEndMinutes > 1440) {
          beforePlannedDayShiftEndMinutes -= 1440;
          breakStart.setMinutes(beforePlannedDayShiftEndMinutes);
        }
      }
    }

    const plannedDay = employeePlannedDays.find(x => {
      const y = day.getFullYear();
      const m = String(day.getMonth() + 1);
      const d = String(day.getDate());
      return x.day.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    });

    if (plannedDay) {
      const shiftId = plannedDay.shiftId || 0;
      if (shiftId >= 1 && shiftId <= 20) {
        const plannedDayShift = shifts.find(x => x.id === plannedDay.shiftId);
        const plannedDayShiftDuration = this.getShiftDuration(plannedDay.day, plannedDayShift!.durations);
        const plannedDayStartHours = Number(plannedDayShiftDuration!.start.substring(0, 2));
        const plannedDayStartMinutes = Number(plannedDayShiftDuration!.start.substring(3, 5));
        const plannedDayShiftStart = new TimeSpan(0, plannedDayStartHours, plannedDayStartMinutes);
        plannedDayShiftStart.addHours(plannedDay.hours || 0);
        plannedDayShiftStart.addMinutes(plannedDay.minutes || 0);
        const plannedDayShiftEndMinutes = plannedDayShiftStart.totalMinutes();
        breakStart.setMinutes(plannedDayShiftEndMinutes);
      }
    }

    return breakStart;
  }
}
