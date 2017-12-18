import { DataService } from '../../services/data.service';
import { InfosService } from '../../services/infos.service';
import { EmployeeSchedule } from '../../objects/employee-schedule';
import { ScheduleDay } from '../../objects/schedule-day';
import { ShiftDuration } from '../../objects/shift-duration';
import { TimeSpan } from '../../objects/time-span';

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

  validateDailyBreak(employeeScheduleDays: ScheduleDay[], scheduleDay: ScheduleDay) {
    employeeScheduleDays.forEach(x => {
      this.clearDayErrors(x);
      this.validateScheduleDayDailyBreak(x, employeeScheduleDays);
    });
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
    const previousWorkDayShiftDuration = this.getShiftDuration(previousWorkDayShift.durations, previousDay);
    const previousStartHours = Number(previousWorkDayShiftDuration.start.substring(0, 2));
    const previousStartMinutes = Number(previousWorkDayShiftDuration.start.substring(3, 5));
    const previousWorkDayStartingTime = new TimeSpan(0, previousStartHours, previousStartMinutes);

    const currentWorkDayShift = this.dataService.shifts.find(x => x.id === scheduleDay.s);
    const currentWorkDayShiftDuration = this.getShiftDuration(currentWorkDayShift.durations, previousDay);
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

  getShiftDuration(durations: ShiftDuration[], day: Date): ShiftDuration {
    const dayTime = new Date(day).getTime();
    return durations.find(x => dayTime >= new Date(x.validFrom).getTime() && dayTime <= this.getShiftValidToDate(x.validTo).getTime());
  }

  getShiftValidToDate(validTo): Date {
    return validTo === null ? new Date(9999, 12, 31) : new Date(validTo);
  }
}
