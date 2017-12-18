import { DataService } from '../../services/data.service';
import { InfosService } from '../../services/infos.service';
import { EmployeeSchedule } from '../../objects/employee-schedule';
import { ScheduleDay } from '../../objects/schedule-day';
import { ShiftDuration } from '../../objects/shift-duration';
import { TimeSpan } from '../../objects/time-span';
import { startTimeRange } from '@angular/core/src/profile/wtf_impl';

export class ScheduleValidator {
  constructor(private dataService: DataService, private infosService: InfosService) { }

  validateHasDayTimeValue(scheduleDay: ScheduleDay) {
    if (!scheduleDay.h && !scheduleDay.m) this.clearDay(scheduleDay);
  }

  validateDailyLimit(scheduleDay: ScheduleDay) {
    const planned = new TimeSpan(0, scheduleDay.h, scheduleDay.m);
    if (planned.totalMinutes() <= 0 || planned.totalMinutes() > 720) this.clearDay(scheduleDay);
  }

  clearDay(scheduleDay: ScheduleDay) {
    scheduleDay.s = null;
    scheduleDay.h = null;
    scheduleDay.m = null;
    scheduleDay.x = null;
  }

  validateDailyBreak(scheduleDay: ScheduleDay, employeeScheduleDays: ScheduleDay[]) {
    this.clearDayErrors(scheduleDay);
    this.validateScheduleDayDailyBreak(scheduleDay, employeeScheduleDays);

    const nextDay = new Date(scheduleDay.d);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextScheduleDay = employeeScheduleDays.find(x =>
      new Date(x.d).getTime() === nextDay.getTime());

    if (nextScheduleDay) {
      this.clearDayErrors(nextScheduleDay);
      this.validateScheduleDayDailyBreak(nextScheduleDay, employeeScheduleDays);
    }

    this.infosService.scheduleInfo = scheduleDay.e;
  }

  clearDayErrors(scheduleDay: ScheduleDay) {
    const day = new Date(scheduleDay.d);
    const weekDay = day.getDay() === 6 || day.getDay() === 0;
    let holiday = false;
    if (!weekDay) holiday = this.dataService.holidays.find(h =>
      new Date(h.dayOff).getTime() ===
      day.getTime()) !== undefined;

    scheduleDay.e = '';
    scheduleDay.bx = 0;
    if (weekDay || holiday) scheduleDay.bx = 1;
    if (scheduleDay.v) scheduleDay.bx = 2;
  }

  validateScheduleDayDailyBreak(scheduleDay: ScheduleDay, employeeScheduleDays: ScheduleDay[]) {
    if (!scheduleDay.s) return;

    const currentDay = new Date(scheduleDay.d);
    const previousDay = new Date(currentDay);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousScheduleDay = employeeScheduleDays.find(x =>
      new Date(x.d).getTime() === previousDay.getTime());

    if (!previousScheduleDay) return;
    if (!previousScheduleDay.s) return;

    const previousWorkDayShift = this.dataService.shifts.find(x => x.id === previousScheduleDay.s);
    const previousWorkDayShiftDuration = this.getShiftDuration(previousDay, previousWorkDayShift.durations);
    const previousStartHours = Number(previousWorkDayShiftDuration.start.substring(0, 2));
    const previousStartMinutes = Number(previousWorkDayShiftDuration.start.substring(3, 5));
    const previousWorkDayStartingTime = new TimeSpan(0, previousStartHours, previousStartMinutes);

    const currentWorkDayShift = this.dataService.shifts.find(x => x.id === scheduleDay.s);
    const currentWorkDayShiftDuration = this.getShiftDuration(currentDay, currentWorkDayShift.durations);
    const currentStartHours = Number(currentWorkDayShiftDuration.start.substring(0, 2));
    const currentStartMinutes = Number(currentWorkDayShiftDuration.start.substring(3, 5));
    const currentWorkDayStartingTime = new TimeSpan(0, currentStartHours, currentStartMinutes);
    const minutesDifference = currentWorkDayStartingTime.totalMinutes() - previousWorkDayStartingTime.totalMinutes();

    if (minutesDifference < 0) {
      scheduleDay.bx = 3;
      scheduleDay.e += '- naruszono dobę pracowniczą\n';
      this.infosService.scheduleInfo = scheduleDay.e;
    }
  }

  getShiftDuration(day: Date, durations: ShiftDuration[]): ShiftDuration {
    const dayTime = new Date(day).getTime();
    const duration = durations.find(x =>
      dayTime >= new Date(x.validFrom).getTime() &&
      dayTime <= this.getShiftValidToDate(x.validTo).getTime());
    return duration;
  }

  getShiftValidToDate(validTo): Date {
    return validTo === null ? new Date(9999, 12, 31) : new Date(validTo);
  }

  validateWeekBreak(scheduleDay: ScheduleDay, employeeScheduleDays: ScheduleDay[], option: number) {
    // Walidacja w obrębie siedmiu dni:
    // option 1 - w dowolnym miejscu grafiku
    // option 2 - z pierwszym dniem okresu rozliczeniowego

    let result = false;
    const testedDay = new Date(scheduleDay.d);
    testedDay.setDate(testedDay.getDate() - 6);

    for (let i = 1; i <= 7; i++) {
      const employeeScheduleDay = employeeScheduleDays.find(x =>
        new Date(x.d).getTime() === testedDay.getTime());

      const breakStart = new Date(testedDay);
      breakStart.setHours(0, 0, 0);
      if (!result) {
        this.detectBeforeDayShiftEnd(testedDay, breakStart, employeeScheduleDays);
        result = this.validateSevenDaysWeekBreak(testedDay, breakStart, employeeScheduleDays);
      }
      testedDay.setDate(testedDay.getDate() + 1);
    }

    if (!result) {
      scheduleDay.bx = 3;
      scheduleDay.e += '- nie zaplanowano 35 godzinnej przerwy tygodniowej\n';
      this.infosService.scheduleInfo = scheduleDay.e;
    }
  }

  detectBeforeDayShiftEnd(testedDay: Date, breakStart: Date, employeeScheduleDays: ScheduleDay[]) {
    const beforeDay = new Date(testedDay);
    beforeDay.setDate(beforeDay.getDate() - 1);

    const beforeScheduleDay = employeeScheduleDays.find(x =>
      new Date(x.d).getTime() === beforeDay.getTime());

    if (beforeScheduleDay && beforeScheduleDay.s >= 1 && beforeScheduleDay.s <= 20) {
      const beforeScheduleDayShift = this.dataService.shifts.find(x => x.id === beforeScheduleDay.s);
      const beforeScheduleDayShiftDuration = this.getShiftDuration(beforeScheduleDay.d, beforeScheduleDayShift.durations);
      const beforeScheduleDayStartHours = Number(beforeScheduleDayShiftDuration.start.substring(0, 2));
      const beforeScheduleDayStartMinutes = Number(beforeScheduleDayShiftDuration.start.substring(3, 5));
      const beforeScheduleDayShiftStart = new TimeSpan(0, beforeScheduleDayStartHours, beforeScheduleDayStartMinutes);
      beforeScheduleDayShiftStart.addHours(beforeScheduleDay.h);
      beforeScheduleDayShiftStart.addMinutes(beforeScheduleDay.m);
      let beforeScheduleDayShiftEndMinutes = beforeScheduleDayShiftStart.totalMinutes();
      if (beforeScheduleDayShiftEndMinutes > 1440) {
        beforeScheduleDayShiftEndMinutes -= 1440;
        breakStart.setMinutes(beforeScheduleDayShiftEndMinutes);
      }
    }
  }

  validateSevenDaysWeekBreak(testedDay: Date, breakStart: Date, employeeScheduleDays: ScheduleDay[]) {
    const day = new Date(testedDay);

    for (let i = 1; i <= 7; i++) {
      const scheduleDay = employeeScheduleDays.find(x =>
        new Date(x.d).getTime() === day.getTime());

      if (scheduleDay.s) {
        const scheduleDayShift = this.dataService.shifts.find(x => x.id === scheduleDay.s);
        const scheduleDayShiftDuration = this.getShiftDuration(scheduleDay.d, scheduleDayShift.durations);
        const scheduleDayStartHours = Number(scheduleDayShiftDuration.start.substring(0, 2));
        const scheduleDayStartMinutes = Number(scheduleDayShiftDuration.start.substring(3, 5));

        const newStart = new Date(scheduleDay.d);
        newStart.setHours(scheduleDayStartHours, scheduleDayStartMinutes, 0);
        const difference = newStart.getTime() - breakStart.getTime();
        const resultInMinutes = Math.round(difference / 60000);

        if (resultInMinutes >= 2100) return true;

        breakStart = new Date(scheduleDay.d);
        breakStart.setHours(scheduleDayStartHours + scheduleDay.h, scheduleDayStartMinutes + scheduleDay.m, 0);
      } else {
        const newStart = new Date(scheduleDay.d);
        newStart.setDate(newStart.getDate() + 1);
        newStart.setHours(0, 0, 0);
        const difference = newStart.getTime() - breakStart.getTime();
        const resultInMinutes = Math.round(difference / 60000);
        if (resultInMinutes >= 2100) return true;
      }

      day.setDate(day.getDate() + 1);
    }

    return false;
  }
}
