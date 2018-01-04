import { DataService } from '../../services/data.service';
import { InfosService } from '../../services/infos.service';
import { ScheduleDay } from '../../objects/schedule-day';
import { ShiftDuration } from '../../objects/shift-duration';
import { TimeSpan } from '../../objects/time-span';

export class ScheduleValidator {
  private scheduleDayErrors = [
    { 'id': 1, 'error': '- naruszono dobę pracowniczą' },
    { 'id': 2, 'error': '- nie zaplanowano 35 godzinnej przerwy tygodniowej' },
    { 'id': 3, 'error': '- przekroczono limit 48 godzin pracy w tygodniu' }
  ];

  constructor(private dataService: DataService, private infosService: InfosService) { }

  private showErrors(scheduleDay: ScheduleDay) {
    const errors = scheduleDay.e.map(x => x.error);
    this.infosService.scheduleInfo = errors.join('\n');
  }

  validateHasDayTimeValue(scheduleDay: ScheduleDay) {
    if (!scheduleDay.h && !scheduleDay.m) this.clearDay(scheduleDay);
  }

  validateDailyLimit(scheduleDay: ScheduleDay) {
    const planned = new TimeSpan(0, scheduleDay.h || 0, scheduleDay.m || 0);
    if (planned.totalMinutes() <= 0 || planned.totalMinutes() > 720) this.clearDay(scheduleDay);
  }

  private clearDay(scheduleDay: ScheduleDay) {
    scheduleDay.h = null;
    scheduleDay.m = null;
    scheduleDay.s = null;
    scheduleDay.x = null;
  }

  validateDailyBreak(scheduleDay: ScheduleDay, employeeScheduleDays: ScheduleDay[]) {
    this.clearDayError(scheduleDay, 1);
    this.validateScheduleDayDailyBreak(scheduleDay, employeeScheduleDays);

    const nextDay = new Date(scheduleDay.d);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextScheduleDay = employeeScheduleDays.find(x =>
      new Date(x.d).getTime() === nextDay.getTime());

    if (nextScheduleDay) {
      this.clearDayError(nextScheduleDay, 1);
      this.validateScheduleDayDailyBreak(nextScheduleDay, employeeScheduleDays);
    }

    this.showErrors(scheduleDay);
  }

  private clearDayError(scheduleDay: ScheduleDay, errorId: number) {
    const error = scheduleDay.e.find(x => x.id === errorId);
    if (error) {
      const day = new Date(scheduleDay.d);
      const weekDay = day.getDay() === 6 || day.getDay() === 0;
      let holiday = false;
      if (!weekDay) holiday = this.dataService.holidays.find(h =>
        new Date(h.dayOff).getTime() ===
        day.getTime()) !== undefined;

      const i = scheduleDay.e.indexOf(error);
      scheduleDay.e.splice(i, 1);

      if (scheduleDay.e.length === 0) {
        scheduleDay.bx = 0;
        if (weekDay || holiday) scheduleDay.bx = 1;
        if (scheduleDay.v) scheduleDay.bx = 2;
      }
    }
  }

  private validateScheduleDayDailyBreak(scheduleDay: ScheduleDay, scheduleDays: ScheduleDay[]) {
    if (!scheduleDay.s || scheduleDay.s >= 40) return;

    const currentDay = new Date(scheduleDay.d);
    const previousDay = new Date(currentDay);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousScheduleDay = scheduleDays.find(x =>
      new Date(x.d).getTime() === previousDay.getTime());

    if (!previousScheduleDay) return;
    if (!previousScheduleDay.s) return;

    const previousWorkDayStartingTime = this.getWorkDayStartingTime(previousScheduleDay, previousDay);
    const currentWorkDayStartingTime = this.getWorkDayStartingTime(scheduleDay, currentDay);
    const minutesDifference = currentWorkDayStartingTime.totalMinutes() - previousWorkDayStartingTime.totalMinutes();

    if (minutesDifference < 0) {
      scheduleDay.bx = 3;
      scheduleDay.e.push(this.scheduleDayErrors[0]);
      this.showErrors(scheduleDay);
    }
  }

  private getWorkDayStartingTime(scheduleDay: ScheduleDay, day: Date) {
    const shift = this.dataService.shifts.find(x => x.id === scheduleDay.s);
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

  validateWeekBreakAndHourlyLimit(year: number, month: number, periodStartDate: Date, scheduleDays: ScheduleDay[]) {
    const firstMonthDay = new Date(year, month - 1, 1, 0, 0, 0);
    const firstWeekDay = this.getFirstWeekDay(firstMonthDay, periodStartDate);

    for (let i = 1; i <= 6; i++) {
      if (i !== 1 && firstWeekDay.getMonth() + 1 !== month) return;
      const weekScheduleDays = this.getWeekScheduleDays(firstWeekDay, scheduleDays);
      if (!weekScheduleDays) return;
      this.validateWeekBreak(firstWeekDay, weekScheduleDays, scheduleDays);
      this.validateWeekHourlyLimit(weekScheduleDays);
      firstWeekDay.setDate(firstWeekDay.getDate() + 7);
    }
  }

  private getFirstWeekDay(day: Date, periodStartDate: Date) {
    const testedDay = new Date(day);
    testedDay.setHours(0, 0, 0);
    const timeDifference = testedDay.getTime() - periodStartDate.getTime();
    const daysDifference = timeDifference / 86400000;
    const remainder = daysDifference % 7;
    const firstWeekDay = new Date(day);
    firstWeekDay.setHours(0, 0, 0);
    firstWeekDay.setDate(firstWeekDay.getDate() - remainder);
    return firstWeekDay;
  }

  private getWeekScheduleDays(firstWeekDay: Date, scheduleDays: ScheduleDay[]) {
    const weekScheduleDays: ScheduleDay[] = [];
    const day = new Date(firstWeekDay);

    for (let i = 1; i <= 7; i++) {
      const scheduleDay = this.getScheduleDay(day, scheduleDays);
      if (!scheduleDay) return null;
      weekScheduleDays.push(scheduleDay);
      day.setDate(day.getDate() + 1);
    }

    return weekScheduleDays;
  }

  private validateWeekBreak(firstWeekDay: Date, weekScheduleDays: ScheduleDay[], scheduleDays: ScheduleDay[]) {
    let breakStart = this.getBreakStart(firstWeekDay, scheduleDays);

    const isValid = weekScheduleDays.some(scheduleDay => {
      const validateDayWeekBreak = this.validateDayWeekBreak(scheduleDay, breakStart);
      if (validateDayWeekBreak.isValid) return true;
      breakStart = validateDayWeekBreak.breakStart;
      return false;
    });

    const lastWeekScheduleDay = weekScheduleDays[weekScheduleDays.length - 1];

    if (lastWeekScheduleDay) {
      this.clearDayError(lastWeekScheduleDay, 2);

      if (!isValid) {
        lastWeekScheduleDay.bx = 3;
        lastWeekScheduleDay.e.push(this.scheduleDayErrors[1]);
      }
    }
  }

  private validateDayWeekBreak(scheduleDay: ScheduleDay, breakStart: Date) {
    let isValid = false;
    const newStart = new Date(scheduleDay.d);
    newStart.setHours(0, 0, 0);

    if (scheduleDay.s) {
      const scheduleDayShift = this.dataService.shifts.find(x => x.id === scheduleDay.s);
      const scheduleDayShiftDuration = this.getShiftDuration(scheduleDay.d, scheduleDayShift!.durations);
      const scheduleDayStartHours = Number(scheduleDayShiftDuration.start.substring(0, 2));
      const scheduleDayStartMinutes = Number(scheduleDayShiftDuration.start.substring(3, 5));

      newStart.setHours(scheduleDayStartHours, scheduleDayStartMinutes, 0);
      const difference = newStart.getTime() - breakStart.getTime();
      const resultInMinutes = Math.round(difference / 60000);
      if (resultInMinutes >= 2100) isValid = true;

      breakStart = new Date(scheduleDay.d);
      const h = scheduleDay.h || 0;
      const m = scheduleDay.m || 0;
      breakStart.setHours(scheduleDayStartHours + h, scheduleDayStartMinutes + m, 0);
    } else {
      newStart.setDate(newStart.getDate() + 1);
      const difference = newStart.getTime() - breakStart.getTime();
      const resultInMinutes = Math.round(difference / 60000);
      if (resultInMinutes >= 2100) isValid = true;
    }

    return { isValid: isValid, breakStart: breakStart };
  }

  private validateWeekHourlyLimit(weekScheduleDays: ScheduleDay[]) {
    const result = new TimeSpan();

    weekScheduleDays.forEach((scheduleDay: ScheduleDay) => {
      result.addHours(scheduleDay.h || 0);
      result.addMinutes(scheduleDay.m || 0);
    });

    const lastWeekScheduleDay = weekScheduleDays[weekScheduleDays.length - 1];

    if (lastWeekScheduleDay) {
      this.clearDayError(lastWeekScheduleDay, 3);

      if (result.totalMinutes() > 2880) {
        lastWeekScheduleDay.bx = 3;
        lastWeekScheduleDay.e.push(this.scheduleDayErrors[2]);
      }
    }
  }

  private getBreakStart(firstWeekDay: Date, scheduleDays: ScheduleDay[]): Date {
    const breakStart = new Date(firstWeekDay);
    breakStart.setHours(0, 0, 0);
    const beforeDay = new Date(firstWeekDay);
    beforeDay.setDate(beforeDay.getDate() - 1);

    const beforeScheduleDay = this.getScheduleDay(beforeDay, scheduleDays);

    if (beforeScheduleDay) {
      const shiftId = beforeScheduleDay.s || 0;
      if (shiftId >= 1 && shiftId <= 20) {
        let shiftEndMinutes = this.getShiftEndMinutes(shiftId, beforeScheduleDay);
        if (shiftEndMinutes > 1440) {
          shiftEndMinutes -= 1440;
          breakStart.setMinutes(shiftEndMinutes);
        }
      }
    }

    const scheduleDay = this.getScheduleDay(firstWeekDay, scheduleDays);

    if (scheduleDay) {
      const shiftId = scheduleDay.s || 0;
      if (shiftId >= 1 && shiftId <= 20) {
        const shiftEndMinutes = this.getShiftEndMinutes(shiftId, beforeScheduleDay);
        breakStart.setMinutes(shiftEndMinutes);
      }
    }

    return breakStart;
  }

  private getScheduleDay(day: Date, scheduleDays: ScheduleDay[]) {
    return scheduleDays.find(x => {
      const y = day.getFullYear();
      const m = String(day.getMonth() + 1);
      const d = String(day.getDate());
      return x.d.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    });
  }

  private getShiftEndMinutes(shiftId: number, scheduleDay: ScheduleDay) {
    const shift = this.dataService.shifts.find(x => x.id === shiftId);
    const duration = this.getShiftDuration(scheduleDay.d, shift!.durations);
    const startHours = Number(duration.start.substring(0, 2));
    const startMinutes = Number(duration.start.substring(3, 5));
    const result = new TimeSpan(0, startHours, startMinutes);
    result.addHours(scheduleDay.h || 0);
    result.addMinutes(scheduleDay.m || 0);
    return result.totalMinutes();
  }
}
