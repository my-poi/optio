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
      scheduleDay.e += '- naruszono dobę pracowniczą';
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
    // option 2 - rozpoczynając od pierwszego dnia okresu rozliczeniowego

    const weekBreakStart = new TimeSpan();
    const startDay = new Date(scheduleDay.d);
    startDay.setDate(startDay.getDate() - 7);
    // let testedDay = new Date(scheduleDay.d);
    // testedDay.setDate(testedDay.getDate() - 6);

    const firstScheduleDay = employeeScheduleDays.find(x =>
      new Date(x.d).getTime() === startDay.getTime());

    if (firstScheduleDay && firstScheduleDay.s >= 1 && firstScheduleDay.s <= 20) {
      const firstScheduleDayShift = this.dataService.shifts.find(x => x.id === firstScheduleDay.s);
      const firstScheduleDayShiftDuration = this.getShiftDuration(firstScheduleDay.d, firstScheduleDayShift.durations);
      console.log(firstScheduleDayShiftDuration);
      const firstScheduleDayStartHours = Number(firstScheduleDayShiftDuration.start.substring(0, 2));
      const firstScheduleDayStartMinutes = Number(firstScheduleDayShiftDuration.start.substring(3, 5));
      const firstScheduleDayShiftStart = new TimeSpan(0, firstScheduleDayStartHours, firstScheduleDayStartMinutes);
      firstScheduleDayShiftStart.addHours(firstScheduleDay.h);
      firstScheduleDayShiftStart.addMinutes(firstScheduleDay.m);
      let firstScheduleDayShiftEndMinutes = firstScheduleDayShiftStart.totalMinutes();
      if (firstScheduleDayShiftEndMinutes > 1440) {
        firstScheduleDayShiftEndMinutes -= 1440;
        weekBreakStart.addMinutes(firstScheduleDayShiftEndMinutes);
        console.log(weekBreakStart.totalMinutes());
      }
    }

    // for (let i = 1; i < 8; i++) {
    //   const employeeScheduleDay = employeeScheduleDays.find(x =>
    //     new Date(x.d).getTime() === testedDay.getTime());


      

    //   console.log(employeeScheduleDay.d);
    //   testedDay.setDate(testedDay.getDate() + 1);
    //   if (i === 7) {
    //     testedDay = new Date(scheduleDay.d);
    //     testedDay.setDate(testedDay.getDate() - 6);
    //   }
    // }
  }
}
