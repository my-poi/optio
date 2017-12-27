import { PlannedDay } from '../objects/planned-day';
import { Shift } from '../objects/shift';
import { TimeSpan } from '../objects/time-span';
import { ShiftDuration } from '../objects/shift-duration';
import { ScheduleDay } from '../objects/schedule-day';

export class ScheduleValidator {
  validateScheduleDayDailyBreak(
    plannedDay: PlannedDay,
    employeePlannedDays: PlannedDay[],
    shifts: Shift[]): boolean {
    const currentDay = new Date(plannedDay.day);
    let previousWorkDayStartingTime;
    let currentWorkDayStartingTime;

    if (!plannedDay.shiftId) return false;

    const previousDay = new Date(currentDay);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousPlannedDay = employeePlannedDays.find(x =>
      new Date(x.day).getTime() === previousDay.getTime());

    if (!previousPlannedDay) return false;
    if (!previousPlannedDay.shiftId) return false;

    const previousWorkDayShift = shifts.find(x => x.id === previousPlannedDay.shiftId);
    if (previousWorkDayShift) {
      if (previousWorkDayShift.durations) {
        const previousWorkDayShiftDuration = this.getShiftDuration(previousDay, previousWorkDayShift.durations);
        if (previousWorkDayShiftDuration) {
          const previousStartHours = Number(previousWorkDayShiftDuration.start.substring(0, 2));
          const previousStartMinutes = Number(previousWorkDayShiftDuration.start.substring(3, 5));
          previousWorkDayStartingTime = new TimeSpan(0, previousStartHours, previousStartMinutes);
        }
      }
    }

    const currentWorkDayShift = shifts.find(x => x.id === plannedDay.shiftId);
    if (currentWorkDayShift) {
      if (currentWorkDayShift.durations) {
        const currentWorkDayShiftDuration = this.getShiftDuration(currentDay, currentWorkDayShift.durations);
        if (currentWorkDayShiftDuration) {
          const currentStartHours = Number(currentWorkDayShiftDuration.start.substring(0, 2));
          const currentStartMinutes = Number(currentWorkDayShiftDuration.start.substring(3, 5));
          currentWorkDayStartingTime = new TimeSpan(0, currentStartHours, currentStartMinutes);
        }
      }
    }

    let minutesDifference = 0;

    if (previousWorkDayStartingTime && currentWorkDayStartingTime)
      minutesDifference = currentWorkDayStartingTime.totalMinutes() - previousWorkDayStartingTime.totalMinutes();

    if (minutesDifference < 0) return true;
    else return false;
  }

  getShiftDuration(day: Date, durations: ShiftDuration[]) {
    const dayTime = new Date(day).getTime();
    const duration = durations.find(x =>
      dayTime >= new Date(x.validFrom).getTime() &&
      dayTime <= this.getShiftValidToDate(x.validTo).getTime());
    return duration;
  }

  getShiftValidToDate(validTo: Date): Date {
    return validTo === null ? new Date(9999, 12, 31) : new Date(validTo);
  }

  validateWeekBreak(lastWeekDay: Date, employeePlannedDays: PlannedDay[], shifts: Shift[]) {
    const firstWeekDay = new Date(lastWeekDay);
    firstWeekDay.setDate(firstWeekDay.getDate() - 6);
    const hasWeekBreak = this.validateSevenDaysWeekBreak(firstWeekDay, employeePlannedDays, shifts);
    return hasWeekBreak;
  }

  validateWeekHourlyLimit(lastWeekDay: Date, employeePlannedDays: PlannedDay[]) {
    const firstWeekDay = new Date(lastWeekDay);
    firstWeekDay.setDate(firstWeekDay.getDate() - 6);
    const hasWeekHourlyLimit = this.validateSevenDaysWeekHourlyLimit(firstWeekDay, employeePlannedDays);
    return hasWeekHourlyLimit;
  }

  validateSevenDaysWeekBreak(firstWeekDay: Date, employeePlannedDays: PlannedDay[], shifts: Shift[]) {
    const testedPlannedDays = this.getTestedPlannedDays(firstWeekDay, employeePlannedDays);

    if (!testedPlannedDays) return true;

    let breakStart = this.getBreakStart(new Date(firstWeekDay), employeePlannedDays, shifts);
    let result = false;

    testedPlannedDays.forEach(testedPlannedDay => {
      const newStart = new Date(testedPlannedDay.day);
      newStart.setHours(0, 0, 0);

      if (testedPlannedDay.shiftId) {
        const plannedDayShift = shifts.find(x => x.id === testedPlannedDay.shiftId);
        if (plannedDayShift && plannedDayShift.durations) {
          const plannedDayShiftDuration = this.getShiftDuration(testedPlannedDay.day, plannedDayShift.durations);
          if (plannedDayShiftDuration) {
            const plannedDayStartHours = Number(plannedDayShiftDuration.start.substring(0, 2));
            const plannedDayStartMinutes = Number(plannedDayShiftDuration.start.substring(3, 5));

            newStart.setHours(plannedDayStartHours, plannedDayStartMinutes, 0);
            const difference = newStart.getTime() - breakStart.getTime();
            const resultInMinutes = Math.round(difference / 60000);

            // console.log(
            //   'Zaplanowano zmianę:' + '\n' +
            //   'breakStart: ' + breakStart + '\n' +
            //   'testedScheduleDay: ' + testedPlannedDay.day + '\n' +
            //   'resultInMinutes: ' + resultInMinutes);

            if (resultInMinutes >= 2100) result = true;

            breakStart = new Date(testedPlannedDay.day);
            breakStart.setHours(plannedDayStartHours + testedPlannedDay.hours, plannedDayStartMinutes + testedPlannedDay.minutes, 0);
          }
        }
      } else {
        newStart.setDate(newStart.getDate() + 1);
        const difference = newStart.getTime() - breakStart.getTime();
        const resultInMinutes = Math.round(difference / 60000);

        // console.log(
        //   'Dzień wolny: ' + '\n' +
        //   'breakStart: ' + breakStart + '\n' +
        //   'testedScheduleDay: ' + testedPlannedDay.day + '\n' +
        //   'resultInMinutes: ' + resultInMinutes);

        if (resultInMinutes >= 2100) result = true;
      }
    });

    return result;
  }

  validateSevenDaysWeekHourlyLimit(firstWeekDay: Date, employeePlannedDays: PlannedDay[]) {
    const testedDay = new Date(firstWeekDay);
    const testedPlannedDays = this.getTestedPlannedDays(firstWeekDay, employeePlannedDays);

    if (!testedPlannedDays) return true;

    const result = new TimeSpan();

    testedPlannedDays.forEach((testedPlannedDay: PlannedDay) => {
      result.addHours(testedPlannedDay.hours);
      result.addMinutes(testedPlannedDay.minutes);
    });

    if (result.totalMinutes() > 2880) return false;
    return true;
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

    if (beforePlannedDay && beforePlannedDay.shiftId >= 1 && beforePlannedDay.shiftId <= 20) {
      const beforePlannedDayShift = shifts.find(x => x.id === beforePlannedDay.shiftId);
      if (beforePlannedDayShift && beforePlannedDayShift.durations) {
        const beforePlannedDayShiftDuration = this.getShiftDuration(beforePlannedDay.day, beforePlannedDayShift.durations);
        if (beforePlannedDayShiftDuration) {
          const beforePlannedDayStartHours = Number(beforePlannedDayShiftDuration.start.substring(0, 2));
          const beforePlannedDayStartMinutes = Number(beforePlannedDayShiftDuration.start.substring(3, 5));
          const beforePlannedDayShiftStart = new TimeSpan(0, beforePlannedDayStartHours, beforePlannedDayStartMinutes);
          beforePlannedDayShiftStart.addHours(beforePlannedDay.hours);
          beforePlannedDayShiftStart.addMinutes(beforePlannedDay.minutes);
          let beforePlannedDayShiftEndMinutes = beforePlannedDayShiftStart.totalMinutes();
          if (beforePlannedDayShiftEndMinutes > 1440) {
            beforePlannedDayShiftEndMinutes -= 1440;
            breakStart.setMinutes(beforePlannedDayShiftEndMinutes);
          }
        }
      }
    }

    const plannedDay = employeePlannedDays.find(x => {
      const y = day.getFullYear();
      const m = String(day.getMonth() + 1);
      const d = String(day.getDate());
      return x.day.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    });

    if (plannedDay && plannedDay.shiftId >= 1 && plannedDay.shiftId <= 20) {
      const plannedDayShift = shifts.find(x => x.id === plannedDay.shiftId);
      if (plannedDayShift && plannedDayShift.durations) {
        const plannedDayShiftDuration = this.getShiftDuration(plannedDay.day, plannedDayShift.durations);
        if (plannedDayShiftDuration) {
          const plannedDayStartHours = Number(plannedDayShiftDuration.start.substring(0, 2));
          const plannedDayStartMinutes = Number(plannedDayShiftDuration.start.substring(3, 5));
          const plannedDayShiftStart = new TimeSpan(0, plannedDayStartHours, plannedDayStartMinutes);
          plannedDayShiftStart.addHours(plannedDay.hours);
          plannedDayShiftStart.addMinutes(plannedDay.minutes);
          const plannedDayShiftEndMinutes = plannedDayShiftStart.totalMinutes();
          breakStart.setMinutes(plannedDayShiftEndMinutes);
        }
      }
    }

    return breakStart;
  }
}