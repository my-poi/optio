import { Component, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../../services/data.service';
import { DisabledButtonsService } from '../../services/disabled-buttons.service';
import { GlobalService } from '../../services/global.service';
import { RibbonInfosService } from '../../services/ribbon-infos.service';
import { PeriodDefinition } from '../../objects/period-definition';
import { ScheduleDay } from '../../objects/schedule-day';
import { EmployeeSchedule } from '../../objects/employee-schedule';
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
  year: number;
  month: number;
  monthlyLimit: number;
  periodLimit: number;
  currentPeriodMonths: PeriodDefinition[];
  employeeSchedules: EmployeeSchedule[];
  employeeSchedule: EmployeeSchedule[];
  header: EmployeeSchedule;
  selectedEmployeeSchedule: EmployeeSchedule;
  originalEmployeeSchedule: EmployeeSchedule;

  constructor(private http: Http,
    private dataService: DataService,
    private disabledButtonsService: DisabledButtonsService,
    private globalService: GlobalService,
    private ribbonInfosService: RibbonInfosService) { }

  load(companyUnitId: number, year: number, month: number) {
    this.year = year;
    this.month = month;
    this.dataService.loadSchedule(companyUnitId, year, month, (results) => {
      this.employeeSchedules = results;
      this.employeeSchedule = this.employeeSchedules.filter(x => x.year === this.year && x.month === this.month);
      this.header = this.employeeSchedule[0];
      this.select(this.employeeSchedule[0]);
      this.setPeriodData();
      console.log('schedule loaded');
    });
  }

  select(employeeSchedule) {
    if (this.selectedEmployeeSchedule && this.selectedEmployeeSchedule.employeeId === employeeSchedule.employeeId) return;
    if (this.selectedEmployeeSchedule && this.selectedEmployeeSchedule.employeeId !==
      employeeSchedule.employeeId) this.saveScheduleIfChanged();
    this.selectedEmployeeSchedule = employeeSchedule;
    this.setOriginalCopy(employeeSchedule);
    this.ribbonInfosService.scheduleInfo = this.selectedEmployeeSchedule.employeeName;
    this.setButtons();
  }

  setButtons() {
    this.disabledButtonsService.employeeScheduleMoveUp = this.employeeSchedule.indexOf(this.selectedEmployeeSchedule) === 0;
    this.disabledButtonsService.employeeScheduleMoveDown =
      this.employeeSchedule.indexOf(this.selectedEmployeeSchedule) ===
      this.employeeSchedule.length - 1;
  }

  saveScheduleIfChanged() {
    if (this.selectedEmployeeSchedule && this.isChanged(this.selectedEmployeeSchedule))
      console.log('zapisuję: ' + this.selectedEmployeeSchedule.employeeName);
  }

  isChanged(employeeSchedule) {
    return !this.globalService.equals(employeeSchedule, this.originalEmployeeSchedule);
  }

  setOriginalCopy(employeeSchedule) {
    this.originalEmployeeSchedule = JSON.parse(JSON.stringify(employeeSchedule));
  }

  setPeriodData() {
    let limit = 0;
    const monthDefinition = this.dataService.periodDefinitions.find(x => x.month === this.month);
    const periodMonths = this.dataService.periodDefinitions.filter(x => x.period === monthDefinition.period);

    this.monthlyLimit = this.dataService.periods.find(x =>
      x.year === this.year && x.month === this.month).hours;

    periodMonths.forEach(x => {
      const periodMonth = this.dataService.periods.find(y =>
        y.year === this.year && y.month === x.month);
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

      const shift = this.dataService.shifts.find(x => x.isValid && x.sign.startsWith(scheduleDay.x.toUpperCase()));

      if (!shift) {
        this.clearDay(scheduleDay);
        return;
      }

      if (shift.id === 40 || shift.id === 41 || shift.id === 42) {
        scheduleDay.h = null;
        scheduleDay.m = null;
      }

      if (shift.id === 42) scheduleDay.x = 'D5';

      if (shift.id <= 20) {
        const shiftDuration: ShiftDuration = this.getShiftDuration(shift.durations, scheduleDay.d);
        scheduleDay.s = null;
        scheduleDay.h = shiftDuration.hours > 0 ? shiftDuration.hours : null;
        scheduleDay.m = shiftDuration.minutes > 0 ? shiftDuration.minutes : null;
      }

      scheduleDay.s = shift.id;
    });
  }

  getShiftDuration(durations: ShiftDuration[], day: Date): ShiftDuration {
    const dayTime = new Date(day).getTime();
    return durations.find(x => dayTime >= new Date(x.validFrom).getTime() && dayTime <= this.getShiftValidToDate(x.validTo).getTime());
  }

  getShiftValidToDate(validTo): Date {
    return validTo === null ? new Date(9999, 12, 31) : new Date(validTo);
  }

  validateDailyLimit(scheduleDay) {
    const planned = new TimeSpan(0, scheduleDay.h, scheduleDay.m);
    if (planned.totalMinutes() <= 0 || planned.totalMinutes() > 720) this.clearDay(scheduleDay);
  }

  clearDay(scheduleDay: ScheduleDay) {
    scheduleDay.s = null;
    scheduleDay.h = null;
    scheduleDay.m = null;
    scheduleDay.x = null;
  }

  setSummaryData(employeeId: number) {
    setTimeout(() => {
      const schedule = this.employeeSchedule.find(x => x.employeeId === employeeId);
      this.calculateMonth(schedule);
      this.calculateTotal(schedule);
      this.setMonthlyBackground(schedule);
      this.setTotalBackground(schedule);
    });
  }

  calculateMonth(employeeSchedule: EmployeeSchedule) {
    let hours = 0;
    let minutes = 0;
    let days = 0;

    employeeSchedule.sd.forEach(x => {
      hours += Number(x.h);
      minutes += Number(x.m);
      if (x.s === 40 || x.s === 41 || x.s === 42) return;
      if (x.x) days += 1;
    });

    const planned = new TimeSpan(0, hours, minutes);
    employeeSchedule.monthlyHours = planned.totalHours();
    employeeSchedule.monthlyMinutes = planned.minutes();
    employeeSchedule.monthlyDays = days;
  }

  calculateTotal(employeeSchedule: EmployeeSchedule) {
    let hours = 0;
    let minutes = 0;
    let days = 0;

    this.currentPeriodMonths.forEach(x => {
      const periodMonthSchedule = this.employeeSchedules.find(y =>
        y.employeeId === employeeSchedule.employeeId &&
        y.year === this.year &&
        y.month === x.month);

      periodMonthSchedule.sd.forEach(z => {
        hours += Number(z.h);
        minutes += Number(z.m);
        if (z.s === 40 || z.s === 41 || z.s === 42) return;
        if (z.x) days += 1;
      });
    });

    const total = new TimeSpan(0, hours, minutes);
    employeeSchedule.totalHours = total.totalHours();
    employeeSchedule.totalMinutes = total.minutes();
    employeeSchedule.totalDays = days;
  }

  setMonthlyBackground(employeeSchedule: EmployeeSchedule) {
    const planned = new TimeSpan(0, employeeSchedule.monthlyHours, employeeSchedule.monthlyMinutes);
    employeeSchedule.monthlyBackground = 1;
    if (planned.totalMinutes() === this.monthlyLimit * 60) employeeSchedule.monthlyBackground = 2;
    if (planned.totalMinutes() > this.monthlyLimit * 60) employeeSchedule.monthlyBackground = 4;
  }

  setTotalBackground(employeeSchedule: EmployeeSchedule) {
    const total = new TimeSpan(0, employeeSchedule.totalHours, employeeSchedule.totalMinutes);
    employeeSchedule.totalBackground = 1;
    if (total.totalMinutes() === this.periodLimit * 60) employeeSchedule.totalBackground = 2;
    if (total.totalMinutes() > this.periodLimit * 60) employeeSchedule.totalBackground = 4;
  }

  validate() {
    this.saveScheduleIfChanged();
    this.employeeSchedules = [];
    this.employeeSchedule = [];
    this.header = null;
    this.selectedEmployeeSchedule = null;
    this.originalEmployeeSchedule = null;
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
    this.move(this.employeeSchedule, this.selectedEmployeeSchedule, -1);
    this.setButtons();
  }

  employeeScheduleMoveDown() {
    this.move(this.employeeSchedule, this.selectedEmployeeSchedule, 1);
    this.setButtons();
  }
}
