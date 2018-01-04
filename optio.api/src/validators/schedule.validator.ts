import { PlannedDay } from '../objects/planned-day';
import { Shift } from '../objects/shift';
import { TimeSpan } from '../objects/time-span';
import { ShiftDuration } from '../objects/shift-duration';

export class ScheduleValidator {
  validatePlannedDayDailyBreak(plannedDay: PlannedDay, plannedDays: PlannedDay[], shifts: Shift[]): boolean {
    if (!plannedDay.shiftId || plannedDay.shiftId >= 40) return false;

    const currentDay = new Date(plannedDay.day);
    const previousDay = new Date(currentDay);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousPlannedDay = plannedDays.find(x =>
      new Date(x.day).getTime() === previousDay.getTime());

    if (!previousPlannedDay) return false;
    if (!previousPlannedDay.shiftId) return false;

    const previousWorkDayStartingTime = this.getWorkDayStartingTime(previousPlannedDay, previousDay, shifts);
    const currentWorkDayStartingTime = this.getWorkDayStartingTime(plannedDay, currentDay, shifts);
    const minutesDifference = currentWorkDayStartingTime.totalMinutes() - previousWorkDayStartingTime.totalMinutes();

    return minutesDifference < 0;
  }

  private getWorkDayStartingTime(plannedDay: PlannedDay, day: Date, shifts: Shift[]) {
    const shift = shifts.find(x => x.id === plannedDay.shiftId);
    const duration = this.getShiftDuration(day, shift!.durations);
    const startHours = Number(duration.start.substring(0, 2));
    const startMinutes = Number(duration.start.substring(3, 5));
    return new TimeSpan(0, startHours, startMinutes);
  }

  private getShiftDuration(day: Date, durations: ShiftDuration[]): ShiftDuration {
    const dayTime = new Date(day).getTime();
    const duration = durations.filter(x =>
      dayTime >= new Date(x.validFrom).getTime() &&
      dayTime <= this.getShiftValidToDate(x.validTo).getTime())[0];
    return duration;
  }

  private getShiftValidToDate(validTo: Date): Date {
    return validTo === null ? new Date(9999, 12, 31) : new Date(validTo);
  }

  validateWeekBreakAndHourlyLimit(lastWeekDay: Date, plannedDays: PlannedDay[], shifts: Shift[]) {
    const firstWeekDay = new Date(lastWeekDay);
    firstWeekDay.setDate(firstWeekDay.getDate() - 6);
    const weekPlannedDays = this.getWeekPlannedDays(firstWeekDay, plannedDays);
    if (!weekPlannedDays) return;
    const hasWeekBreak = this.validateWeekBreak(firstWeekDay, weekPlannedDays, plannedDays, shifts);
    const hasWeekHourlyLimit = this.validateWeekHourlyLimit(weekPlannedDays);
    return { hasWeekBreak: hasWeekBreak, hasWeekHourlyLimit: hasWeekHourlyLimit };
  }

  private validateWeekBreak(firstWeekDay: Date, weekPlannedDays: PlannedDay[], plannedDays: PlannedDay[], shifts: Shift[]) {
    let breakStart = this.getBreakStart(firstWeekDay, plannedDays, shifts);

    const isValid = weekPlannedDays.some(plannedDay => {
      const validateDayWeekBreak = this.validateDayWeekBreak(plannedDay, breakStart, shifts);
      if (validateDayWeekBreak.isValid) return true;
      breakStart = validateDayWeekBreak.breakStart;
      return false;
    });

    return isValid;
  }

  private validateDayWeekBreak(plannedDay: PlannedDay, breakStart: Date, shifts: Shift[]) {
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
      const hours = plannedDay.hours || 0;
      const minutes = plannedDay.minutes || 0;
      breakStart.setHours(plannedDayStartHours + hours, plannedDayStartMinutes + minutes, 0);
    } else {
      newStart.setDate(newStart.getDate() + 1);
      const difference = newStart.getTime() - breakStart.getTime();
      const resultInMinutes = Math.round(difference / 60000);
      if (resultInMinutes >= 2100) isValid = true;
    }

    return { isValid: isValid, breakStart: breakStart };
  }

  private validateWeekHourlyLimit(weekPlannedDays: PlannedDay[]) {
    const result = new TimeSpan();

    weekPlannedDays.forEach((plannedDay: PlannedDay) => {
      result.addHours(plannedDay.hours || 0);
      result.addMinutes(plannedDay.minutes || 0);
    });

    return result.totalMinutes() <= 2880;
  }

  private getWeekPlannedDays(firstWeekDay: Date, plannedDays: PlannedDay[]) {
    const weekPlannedDays: PlannedDay[] = [];
    const day = new Date(firstWeekDay);

    for (let i = 1; i <= 7; i++) {
      const testedPlannedDay = this.getPlannedDay(day, plannedDays);
      if (!testedPlannedDay) return null;
      weekPlannedDays.push(testedPlannedDay);
      day.setDate(day.getDate() + 1);
    }

    return weekPlannedDays;
  }

  private getBreakStart(firstWeekDay: Date, plannedDays: PlannedDay[], shifts: Shift[]): Date {
    const breakStart = new Date(firstWeekDay);
    breakStart.setHours(0, 0, 0);
    const beforeDay = new Date(firstWeekDay);
    beforeDay.setDate(beforeDay.getDate() - 1);

    const beforePlannedDay = this.getPlannedDay(beforeDay, plannedDays);

    if (beforePlannedDay) {
      const shiftId = beforePlannedDay.shiftId || 0;
      if (shiftId >= 1 && shiftId <= 20) {
        let shiftEndMinutes = this.getShiftEndMinutes(shiftId, beforePlannedDay, shifts);
        if (shiftEndMinutes > 1440) {
          shiftEndMinutes -= 1440;
          breakStart.setMinutes(shiftEndMinutes);
        }
      }
    }

    const plannedDay = this.getPlannedDay(firstWeekDay, plannedDays);

    if (plannedDay) {
      const shiftId = plannedDay.shiftId || 0;
      if (shiftId >= 1 && shiftId <= 20) {
        const shiftEndMinutes = this.getShiftEndMinutes(shiftId, plannedDay, shifts);
        breakStart.setMinutes(shiftEndMinutes);
      }
    }

    return breakStart;
  }

  private getPlannedDay(day: Date, plannedDays: PlannedDay[]) {
    return plannedDays.find(x => {
      const y = day.getFullYear();
      const m = String(day.getMonth() + 1);
      const d = String(day.getDate());
      return x.day.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    });
  }

  private getShiftEndMinutes(shiftId: number, plannedDay: PlannedDay, shifts: Shift[]) {
    const shift = shifts.find(x => x.id === shiftId);
    const duration = this.getShiftDuration(plannedDay.day, shift!.durations);
    const startHours = Number(duration.start.substring(0, 2));
    const startMinutes = Number(duration.start.substring(3, 5));
    const result = new TimeSpan(0, startHours, startMinutes);
    result.addHours(plannedDay.hours || 0);
    result.addMinutes(plannedDay.minutes || 0);
    return result.totalMinutes();
  }
}
