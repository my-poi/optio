import { Component, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DisabledButtonsService } from '../../services/disabled-buttons.service';
import { GlobalService } from '../../services/global.service';
import { RibbonInfosService } from '../../services/ribbon-infos.service';
import { Http } from '@angular/http';
import { PeriodDefinition } from '../../objects/period-definition';
import { ScheduleDay } from '../../objects/schedule-day';
import { Schedule } from '../../objects/schedule';
import { TimeSpan } from '../../objects/time-span';
import { ShiftDuration } from '../../objects/shift-duration';

@Component({
  selector: 'app-schedule-tab',
  templateUrl: './schedule.tab.html',
  styleUrls: ['./schedule.tab.css']
})
export class ScheduleTab {
  @Output() hideTabEvent = new EventEmitter<any>();
  scheduleTableBodyHeight = window.innerHeight - 242;
  year = 2017;
  month = 4;
  monthlyLimit: number;
  periodLimit: number;
  currentPeriodMonths: PeriodDefinition[];
  schedules: Schedule[];
  schedule: Schedule[];
  header: Schedule;
  selected: Schedule;
  original: Schedule;

  constructor(private http: Http,
    private dataService: DataService,
    private disabledButtonsService: DisabledButtonsService,
    private globalService: GlobalService,
    private ribbonInfosService: RibbonInfosService) { }

  load() {
    this.http.get('assets/test-data/schedules.json').subscribe(res => {
      this.schedules = res.json();
      this.schedule = this.schedules.filter(x => x.year === this.year && x.month === this.month);
      this.header = this.schedule[0];
      this.select(this.schedule[0]);
      this.setPeriodData();
      console.log('schedule loaded');
    });
  }

  select(employeeSchedule) {
    if (this.selected && this.selected.employeeId === employeeSchedule.employeeId) return;
    if (this.selected && this.selected.employeeId !== employeeSchedule.employeeId) this.saveScheduleIfChanged();
    this.selected = employeeSchedule;
    this.setOriginalCopy(employeeSchedule);
    this.ribbonInfosService.scheduleInfo = this.selected.employeeName;
    this.setButtons();
  }

  setButtons() {
    this.disabledButtonsService.employeeScheduleMoveUp = this.schedule.indexOf(this.selected) === 0;
    this.disabledButtonsService.employeeScheduleMoveDown = this.schedule.indexOf(this.selected) === this.schedule.length - 1;
  }

  saveScheduleIfChanged() {
    if (this.selected && this.isChanged(this.selected)) console.log('zapisuję: ' + this.selected.employeeName);
  }

  isChanged(employeeSchedule) {
    return !this.globalService.equals(employeeSchedule, this.original);
  }

  setOriginalCopy(employeeSchedule) {
    this.original = JSON.parse(JSON.stringify(employeeSchedule));
  }

  setPeriodData() {
    let limit = 0;
    const monthDefinition = this.dataService.periodDefinitions.filter(x => x.month === this.month)[0];
    const periodMonths = this.dataService.periodDefinitions.filter(x => x.period === monthDefinition.period);

    this.monthlyLimit = this.dataService.periods.filter(x =>
      x.year === this.year && x.month === this.month)[0].hours;

    periodMonths.forEach(x => {
      const periodMonth = this.dataService.periods.filter(y =>
        y.year === this.year && y.month === x.month)[0];
      limit += periodMonth.hours;
    });

    this.periodLimit = limit;

    this.currentPeriodMonths = this.dataService.periodDefinitions.filter(x =>
      x.period === monthDefinition.period &&
      x.sortOrder <= monthDefinition.sortOrder);

    console.log(this.monthlyLimit);
    console.log(this.periodLimit);
    this.currentPeriodMonths.forEach(x => {
      console.log(x.month);
    });
  }

  hourChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setHour(scheduleDay);
    this.setSummaryData(employeeId);
  }

  minuteChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setMinute(scheduleDay);
    this.setSummaryData(employeeId);
  }

  shiftChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setShift(scheduleDay);
    this.setSummaryData(employeeId);
  }

  setHour(scheduleDay: ScheduleDay) {
    setTimeout(() => {
      scheduleDay.h = scheduleDay.h.replace(/\D/g, '');

      if (!scheduleDay.x || scheduleDay.s === 40 || scheduleDay.s === 41 || scheduleDay.s === 42) {
        scheduleDay.h = null;
        return;
      }

      if (parseInt(scheduleDay.h, 10) < 1 || parseInt(scheduleDay.h, 10) > 12) scheduleDay.h = null;
      if (!scheduleDay.h && !scheduleDay.m) this.clearDay(scheduleDay);
      this.validateDailyLimit(scheduleDay);
    });
  }

  setMinute(scheduleDay: ScheduleDay) {
    setTimeout(() => {
      scheduleDay.m = scheduleDay.m.replace(/\D/g, '');

      if (!scheduleDay.x || scheduleDay.s === 40 || scheduleDay.s === 41 || scheduleDay.s === 42) {
        scheduleDay.m = null;
        return;
      }

      if (parseInt(scheduleDay.m, 10) < 1 || parseInt(scheduleDay.m, 10) > 59) scheduleDay.m = null;
      if (!scheduleDay.h && !scheduleDay.m) this.clearDay(scheduleDay);
      this.validateDailyLimit(scheduleDay);
    });
  }

  setShift(scheduleDay) {
    setTimeout(() => {
      if (!scheduleDay.x) {
        this.clearDay(scheduleDay);
        return;
      }

      const shift = this.dataService.shifts.filter(x => x.isValid && x.sign.startsWith(scheduleDay.x.toUpperCase()))[0];

      if (!shift) {
        this.clearDay(scheduleDay);
        return;
      }

      if (shift.id === 40 || shift.id === 41 || shift.id === 42) {
        scheduleDay.t = null;
        scheduleDay.h = null;
        scheduleDay.m = null;
      }

      if (shift.id === 42) scheduleDay.x = 'D5';

      if (shift.id <= 20) {
        const shiftDuration: ShiftDuration = this.getShiftDuration(shift.durations, scheduleDay.d);
        scheduleDay.t = null;
        scheduleDay.s = null;
        scheduleDay.h = shiftDuration.hours > 0 ? shiftDuration.hours : null;
        scheduleDay.m = shiftDuration.minutes > 0 ? shiftDuration.minutes : null;
      }

      scheduleDay.s = shift.id;
    });
  }

  getShiftDuration(durations: ShiftDuration[], day: Date): ShiftDuration {
    const dayTime = new Date(day).getTime();
    return durations.filter(x => {
      return dayTime >= new Date(x.validFrom).getTime() && dayTime <= this.getShiftValidToDate(x.validTo).getTime();
    })[0];
  }

  getShiftValidToDate(validTo): Date {
    return validTo === null ? new Date(9999, 12, 31) : new Date(validTo);
  }

  validateDailyLimit(scheduleDay) {
    const planned = new TimeSpan(0, scheduleDay.h, scheduleDay.m);
    if (planned.totalMinutes() <= 0 || planned.totalMinutes() > 720) this.clearDay(scheduleDay);
  }

  clearDay(scheduleDay: ScheduleDay) {
    scheduleDay.t = null;
    scheduleDay.s = null;
    scheduleDay.h = null;
    scheduleDay.m = null;
    scheduleDay.x = null;
  }

  setSummaryData(employeeId: number) {
    setTimeout(() => {
      const schedule = this.schedule.filter(x => x.employeeId === employeeId)[0];
      this.calculateMonth(schedule);
      this.calculateTotal(schedule);
      this.setMonthlyBackground(schedule);
      this.setTotalBackground(schedule);
    });
  }

  calculateMonth(schedule: Schedule) {
    let hours = 0;
    let minutes = 0;
    let days = 0;

    schedule.sd.forEach(x => {
      hours += Number(x.h);
      minutes += Number(x.m);
      if (x.s === 40 || x.s === 41 || x.s === 42) return;
      if (x.x) days += 1;
    });

    const planned = new TimeSpan(0, hours, minutes);
    schedule.monthlyHours = planned.totalHours();
    schedule.monthlyMinutes = planned.minutes();
    schedule.monthlyDays = days;
  }

  calculateTotal(schedule: Schedule) {
    let hours = 0;
    let minutes = 0;
    let days = 0;

    this.currentPeriodMonths.forEach(x => {
      const periodMonthSchedule = this.schedules.filter(y =>
        y.employeeId === schedule.employeeId &&
        y.year === this.year &&
        y.month === x.month)[0];

      periodMonthSchedule.sd.forEach(z => {
        hours += Number(z.h);
        minutes += Number(z.m);
        if (z.s === 40 || z.s === 41 || z.s === 42) return;
        if (z.x) days += 1;
      });
    });

    const total = new TimeSpan(0, hours, minutes);
    schedule.totalHours = total.totalHours();
    schedule.totalMinutes = total.minutes();
    schedule.totalDays = days;
  }

  setMonthlyBackground(schedule: Schedule) {
    const planned = new TimeSpan(0, schedule.monthlyHours, schedule.monthlyMinutes);
    schedule.monthlyBackground = 1;
    if (planned.totalMinutes() === this.monthlyLimit * 60) schedule.monthlyBackground = 2;
    if (planned.totalMinutes() > this.monthlyLimit * 60) schedule.monthlyBackground = 4;
  }

  setTotalBackground(schedule: Schedule) {
    const total = new TimeSpan(0, schedule.totalHours, schedule.totalMinutes);
    schedule.totalBackground = 1;
    if (total.totalMinutes() === this.periodLimit * 60) schedule.totalBackground = 2;
    if (total.totalMinutes() > this.periodLimit * 60) schedule.totalBackground = 4;
  }

  validate() {
    this.saveScheduleIfChanged();
    this.schedules = [];
    this.schedule = [];
    this.header = null;
    this.selected = null;
    this.original = null;
    this.hideTabEvent.emit({ tabName: 'schedule' });
  }

  move(array: any[], element: any, delta: number) {
    const index = array.indexOf(element);
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex === array.length) return;
    const indexes = [index, newIndex].sort();
    array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]);
  }

  employeeScheduleMoveUp() {
    this.move(this.schedule, this.selected, -1);
    this.setButtons();
  }

  employeeScheduleMoveDown() {
    this.move(this.schedule, this.selected, 1);
    this.setButtons();
  }
}
