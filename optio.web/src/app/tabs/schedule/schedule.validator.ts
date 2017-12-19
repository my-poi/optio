import { DataService } from '../../services/data.service';
import { InfosService } from '../../services/infos.service';
import { EmployeeSchedule } from '../../objects/employee-schedule';
import { ScheduleDay } from '../../objects/schedule-day';
import { ShiftDuration } from '../../objects/shift-duration';
import { TimeSpan } from '../../objects/time-span';
import { startTimeRange } from '@angular/core/src/profile/wtf_impl';

export class ScheduleValidator {
  private scheduleDayErrors = [
    {'id': 1, 'error': '- naruszono dobę pracowniczą'},
    {'id': 2, 'error': '- nie zaplanowano 35 godzinnej przerwy tygodniowej'},
    {'id': 3, 'error': '- przekroczono limit 48 godzin pracy w tygodniu'}
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
      scheduleDay.bx = 0;
      if (weekDay || holiday) scheduleDay.bx = 1;
      if (scheduleDay.v) scheduleDay.bx = 2;
    }
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
      scheduleDay.e.push(this.scheduleDayErrors[0]);
      this.showErrors(scheduleDay);
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

  validateWeekBreak(year: number, month: number, scheduleDay: ScheduleDay, employeeScheduleDays: ScheduleDay[], option: number) {
    // Walidacja w obrębie siedmiu dni:
    // option 1 - w dowolnym miejscu grafiku
    // option 2 - z pierwszym dniem okresu rozliczeniowego

    const checkedDay = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      this.validateSevenDaysWeekBreak(checkedDay, scheduleDay, employeeScheduleDays);
      checkedDay.setDate(checkedDay.getDate() + 1);
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

  validateSevenDaysWeekBreak(checkedDay: Date, scheduleDay: ScheduleDay, employeeScheduleDays: ScheduleDay[]) {
    let result = false;
    const testedDay = new Date(checkedDay);
    testedDay.setDate(testedDay.getDate() - 6);
    let breakStart = new Date(testedDay);
    this.detectBeforeDayShiftEnd(testedDay, breakStart, employeeScheduleDays);

    // sprawdzić!
    const checkedScheduleDay = employeeScheduleDays.find(x => {
      const y = checkedDay.getFullYear();
      const m = String(checkedDay.getMonth() + 1);
      const d = String(checkedDay.getDate());
      return x.d.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    });

    this.clearDayError(checkedScheduleDay, 2);
    console.log('checkedScheduleDay: ' + checkedScheduleDay.d);

    for (let i = 1; i <= 7; i++) {
      const testedScheduleDay = employeeScheduleDays.find(x => {
        const y = testedDay.getFullYear();
        const m = String(testedDay.getMonth() + 1);
        const d = String(testedDay.getDate());
        return x.d.toString() === `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      });

      if (testedScheduleDay) {
        const newStart = new Date(testedScheduleDay.d);

        if (testedScheduleDay.s) {
          const scheduleDayShift = this.dataService.shifts.find(x => x.id === testedScheduleDay.s);
          const scheduleDayShiftDuration = this.getShiftDuration(testedScheduleDay.d, scheduleDayShift.durations);
          const scheduleDayStartHours = Number(scheduleDayShiftDuration.start.substring(0, 2));
          const scheduleDayStartMinutes = Number(scheduleDayShiftDuration.start.substring(3, 5));

          newStart.setHours(scheduleDayStartHours, scheduleDayStartMinutes, 0);
          const difference = newStart.getTime() - breakStart.getTime();
          const resultInMinutes = Math.round(difference / 60000);

          if (resultInMinutes >= 2100) {
            result = true;
          }

          breakStart = new Date(testedScheduleDay.d);
          breakStart.setHours(scheduleDayStartHours + testedScheduleDay.h, scheduleDayStartMinutes + testedScheduleDay.m, 0);
        } else {
          newStart.setDate(newStart.getDate() + 1);
          const difference = newStart.getTime() - breakStart.getTime();
          const resultInMinutes = Math.round(difference / 60000);
          if (resultInMinutes >= 2100) {
            result = true;
          }
        }
      }

      testedDay.setDate(testedDay.getDate() + 1);
    }

    if (!result) {
      checkedScheduleDay.bx = 3;
      checkedScheduleDay.e.push(this.scheduleDayErrors[1]);
      if (scheduleDay.d === checkedScheduleDay.d) this.showErrors(checkedScheduleDay);
    }
  }
}
