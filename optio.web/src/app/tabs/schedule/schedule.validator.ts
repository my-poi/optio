import { DataService } from '../../services/data.service';
import { InfosService } from '../../services/infos.service';
import { EmployeeSchedule } from '../../objects/employee-schedule';
import { ScheduleDay } from '../../objects/schedule-day';
import { TimeSpan } from '../../objects/time-span';

export class ScheduleValidator {
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

  validateDailyBreak(
    scheduleDay: ScheduleDay,
    dataService: DataService,
    infosService: InfosService,
    header: EmployeeSchedule,
    employeeScheduleDays: ScheduleDay[]) {
    employeeScheduleDays.forEach(x =>
      this.validateScheduleDayDailyBreak(
        x,
        dataService,
        infosService,
        header,
        employeeScheduleDays));
  }

  validateScheduleDayDailyBreak(
    scheduleDay: ScheduleDay,
    dataService: DataService,
    infosService: InfosService,
    header: EmployeeSchedule,
    employeeScheduleDays: ScheduleDay[]) {
    const currentDay = new Date(scheduleDay.d);
    this.clearDayErrors(scheduleDay, currentDay, header, infosService);

    if (!scheduleDay.s) return;

    const previousDay = new Date(currentDay);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousScheduleDay = employeeScheduleDays.find(x =>
      new Date(x.d).getTime() === previousDay.getTime());

    if (!previousScheduleDay) return;
    if (!previousScheduleDay.s) return;

    const previousWorkDayShift = dataService.shifts.find(x => x.id === previousScheduleDay.s);
    const previousStartHours = Number(previousWorkDayShift.current.start.substring(0, 2));
    const previousStartMinutes = Number(previousWorkDayShift.current.start.substring(3, 5));
    const previousWorkDayStartingTime = new TimeSpan(0, previousStartHours, previousStartMinutes);

    const currentWorkDayShift = dataService.shifts.find(x => x.id === scheduleDay.s);
    const currentStartHours = Number(currentWorkDayShift.current.start.substring(0, 2));
    const currentStartMinutes = Number(currentWorkDayShift.current.start.substring(3, 5));
    const currentWorkDayStartingTime = new TimeSpan(0, currentStartHours, currentStartMinutes);
    const minutesDifference = currentWorkDayStartingTime.totalMinutes() - previousWorkDayStartingTime.totalMinutes();

    if (minutesDifference < 0) {
      scheduleDay.bx = 3;
      scheduleDay.e += '- naruszono dobę pracowniczą';
      infosService.scheduleInfo = scheduleDay.e;
    }
  }

  clearDayErrors(scheduleDay: ScheduleDay, currentDay: Date, header: EmployeeSchedule, infosService: InfosService) {
    const headerDay = header.sd.find(x =>
      new Date(x.d).getTime() === currentDay.getTime());

    if (headerDay) {
      scheduleDay.bx = 0;
      scheduleDay.e = '';
      if (headerDay.bx === 1) scheduleDay.bx = 1;
      if (scheduleDay.v) scheduleDay.bx = 2;
      infosService.scheduleInfo = scheduleDay.e;
    }
  }
}
