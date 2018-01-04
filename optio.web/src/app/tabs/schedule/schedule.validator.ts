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

  showErrors(scheduleDay: ScheduleDay) {
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

  clearDay(scheduleDay: ScheduleDay) {
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

  clearDayError(scheduleDay: ScheduleDay, errorId: number) {
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

  validateScheduleDayDailyBreak(scheduleDay: ScheduleDay, employeeScheduleDays: ScheduleDay[]) {
    if (!scheduleDay.s || scheduleDay.s >= 40) return;

    const currentDay = new Date(scheduleDay.d);
    const previousDay = new Date(currentDay);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousScheduleDay = employeeScheduleDays.find(x =>
      new Date(x.d).getTime() === previousDay.getTime());

    if (!previousScheduleDay) return;
    if (!previousScheduleDay.s) return;

    const previousWorkDayShift = this.dataService.shifts.find(x => x.id === previousScheduleDay.s);
    const previousWorkDayShiftDuration = this.getShiftDuration(previousDay, previousWorkDayShift!.durations);
    const previousStartHours = Number(previousWorkDayShiftDuration.start.substring(0, 2));
    const previousStartMinutes = Number(previousWorkDayShiftDuration.start.substring(3, 5));
    const previousWorkDayStartingTime = new TimeSpan(0, previousStartHours, previousStartMinutes);

    const currentWorkDayShift = this.dataService.shifts.find(x => x.id === scheduleDay.s);
    const currentWorkDayShiftDuration = this.getShiftDuration(currentDay, currentWorkDayShift!.durations);
    const currentStartHours = Number(currentWorkDayShiftDuration.start.substring(0, 2));
    const currentStartMinutes = Number(currentWorkDayShiftDuration.start.substring(3, 5));
    const currentWorkDayStartingTime = new TimeSpan(0, currentStartHours, currentStartMinutes);

    const minutesDifference = currentWorkDayStartingTime.totalMinutes() - previousWorkDayStartingTime.totalMinutes();

    if (minutesDifference < 0) {
      scheduleDay.bx = 3;
      scheduleDay.e.push(this.scheduleDayErrors[0]);
      this.showErrors(scheduleDay);
    }
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

  validateWeekBreakAndHourlyLimit(year: number, month: number, periodStartDate: Date, employeeScheduleDays: ScheduleDay[]) {
    const firstMonthDay = new Date(year, month - 1, 1, 0, 0, 0);
    const firstWeekDay = this.getFirstWeekDay(firstMonthDay, periodStartDate);

    for (let i = 1; i <= 6; i++) {
      if (i !== 1 && firstWeekDay.getMonth() + 1 !== month) return;
      const scheduleDays = this.getScheduleDays(firstWeekDay, employeeScheduleDays);
      if (!scheduleDays) return;
      this.validateWeekBreak(firstWeekDay, scheduleDays, employeeScheduleDays);
      this.validateWeekHourlyLimit(scheduleDays);
      firstWeekDay.setDate(firstWeekDay.getDate() + 7);
    }
  }

  getFirstWeekDay(day: Date, periodStartDate: Date) {
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

  getScheduleDays(firstWeekDay: Date, employeeScheduleDays: ScheduleDay[]) {
    const scheduleDays: ScheduleDay[] = [];
    const day = new Date(firstWeekDay);

    for (let i = 1; i <= 7; i++) {
      const scheduleDay = employeeScheduleDays.find(x => {
        const y = day.getFullYear();
        const m = String(day.getMonth() + 1);
        const d = String(day.getDate());
        return x.d.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      });

      if (!scheduleDay) return null;
      scheduleDays.push(scheduleDay);
      day.setDate(day.getDate() + 1);
    }

    return scheduleDays;
  }

  validateWeekBreak(firstWeekDay: Date, scheduleDays: ScheduleDay[], employeeScheduleDays: ScheduleDay[]) {
    let breakStart = this.getBreakStart(firstWeekDay, scheduleDays, employeeScheduleDays);

    const isValid = scheduleDays.some(scheduleDay => {
      const validateDayWeekBreak = this.validateDayWeekBreak(scheduleDay, breakStart);
      if (validateDayWeekBreak.isValid) return true;
      breakStart = validateDayWeekBreak.breakStart;
      return false;
    });

    const lastScheduleDay = scheduleDays[scheduleDays.length - 1];

    if (lastScheduleDay) {
      this.clearDayError(lastScheduleDay, 2);

      if (!isValid) {
        lastScheduleDay.bx = 3;
        lastScheduleDay.e.push(this.scheduleDayErrors[1]);
      }
    }
  }

  validateDayWeekBreak(scheduleDay: ScheduleDay, breakStart: Date) {
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

  validateWeekHourlyLimit(scheduleDays: ScheduleDay[]) {
    const result = new TimeSpan();

    scheduleDays.forEach((scheduleDay: ScheduleDay) => {
      result.addHours(scheduleDay.h || 0);
      result.addMinutes(scheduleDay.m || 0);
    });

    const lastScheduleDay = scheduleDays[scheduleDays.length - 1];

    if (lastScheduleDay) {
      this.clearDayError(lastScheduleDay, 3);

      if (result.totalMinutes() > 2880) {
        lastScheduleDay.bx = 3;
        lastScheduleDay.e.push(this.scheduleDayErrors[2]);
      }
    }
  }

  getBreakStart(day: Date, scheduleDays: ScheduleDay[], employeeScheduleDays: ScheduleDay[]): Date {
    const breakStart = new Date(day);
    breakStart.setHours(0, 0, 0);
    const beforeDay = new Date(day);
    beforeDay.setDate(beforeDay.getDate() - 1);

    const beforeScheduleDay = employeeScheduleDays.find(x => {
      const y = beforeDay.getFullYear();
      const m = String(beforeDay.getMonth() + 1);
      const d = String(beforeDay.getDate());
      return x.d.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    });

    if (beforeScheduleDay) {
      const s = beforeScheduleDay.s || 0;
      if (s >= 1 && s <= 20) {
        const beforeScheduleDayShift = this.dataService.shifts.find(x => x.id === s);
        const beforeScheduleDayShiftDuration = this.getShiftDuration(beforeScheduleDay.d, beforeScheduleDayShift!.durations);
        const beforeScheduleDayStartHours = Number(beforeScheduleDayShiftDuration.start.substring(0, 2));
        const beforeScheduleDayStartMinutes = Number(beforeScheduleDayShiftDuration.start.substring(3, 5));
        const beforeScheduleDayShiftStart = new TimeSpan(0, beforeScheduleDayStartHours, beforeScheduleDayStartMinutes);
        beforeScheduleDayShiftStart.addHours(beforeScheduleDay.h || 0);
        beforeScheduleDayShiftStart.addMinutes(beforeScheduleDay.m || 0);
        let beforeScheduleDayShiftEndMinutes = beforeScheduleDayShiftStart.totalMinutes();
        if (beforeScheduleDayShiftEndMinutes > 1440) {
          beforeScheduleDayShiftEndMinutes -= 1440;
          breakStart.setMinutes(beforeScheduleDayShiftEndMinutes);
        }
      }
    }

    const scheduleDay = scheduleDays.find(x => {
      const y = day.getFullYear();
      const m = String(day.getMonth() + 1);
      const d = String(day.getDate());
      return x.d.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    });

    if (scheduleDay) {
      const s = scheduleDay.s || 0;
      if (s >= 1 && s <= 20) {
        const scheduleDayShift = this.dataService.shifts.find(x => x.id === s);
        const scheduleDayShiftDuration = this.getShiftDuration(scheduleDay.d, scheduleDayShift!.durations);
        const scheduleDayStartHours = Number(scheduleDayShiftDuration.start.substring(0, 2));
        const scheduleDayStartMinutes = Number(scheduleDayShiftDuration.start.substring(3, 5));
        const scheduleDayShiftStart = new TimeSpan(0, scheduleDayStartHours, scheduleDayStartMinutes);
        scheduleDayShiftStart.addHours(scheduleDay.h || 0);
        scheduleDayShiftStart.addMinutes(scheduleDay.m || 0);
        const scheduleDayShiftEndMinutes = scheduleDayShiftStart.totalMinutes();
        breakStart.setMinutes(scheduleDayShiftEndMinutes);
      }
    }

    return breakStart;
  }
}
