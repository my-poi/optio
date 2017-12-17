import { Component, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../../services/data.service';
import { ButtonsService } from '../../services/buttons.service';
import { GlobalService } from '../../services/global.service';
import { InfosService } from '../../services/infos.service';
import { PeriodDefinition } from '../../objects/period-definition';
import { ScheduleDay } from '../../objects/schedule-day';
import { EmployeeSchedule } from '../../objects/employee-schedule';
import { TimeSpan } from '../../objects/time-span';
import { ShiftDuration } from '../../objects/shift-duration';
import { TimeSheetEmployee } from '../../objects/time-sheet-employee';

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
  currentPeriodMonths: PeriodDefinition[];
  monthlyMinutesLimit: number;
  periodMinutesLimit: number;
  schedules: EmployeeSchedule[];
  currentSchedule: EmployeeSchedule[];
  header: EmployeeSchedule;
  selectedEmployeeSchedule: EmployeeSchedule;
  originalEmployeeSchedule: EmployeeSchedule;
  selectedScheduleDay: ScheduleDay;
  employeeScheduleDays: ScheduleDay[];

  constructor(private http: Http,
    private dataService: DataService,
    private buttonsService: ButtonsService,
    private globalService: GlobalService,
    private infosService: InfosService) { }

  load(companyUnitId: number, year: number, month: number) {
    this.year = year;
    this.month = month;
    this.dataService.loadSchedule(companyUnitId, year, month, (results) => {
      this.schedules = results;
      this.currentSchedule = this.schedules.
        filter(x => x.year === this.year && x.month === this.month).
        sort((a: EmployeeSchedule, b: EmployeeSchedule) => this.globalService.compare(a.sortOrder, b.sortOrder));
      const firstSchedule = this.currentSchedule[0];
      this.header = firstSchedule;
      this.selectFirstSchedule(firstSchedule);
      this.setPeriodData();
      console.log('schedule loaded');
    });
  }

  selectFirstSchedule(firstSchedule: EmployeeSchedule) {
    this.selectedEmployeeSchedule = firstSchedule;
    this.selectEmployeeScheduleDays();
    this.setOriginalCopy(firstSchedule);
    this.setButtons();
  }

  select(employeeSchedule: EmployeeSchedule) {
    if (this.selectedEmployeeSchedule.employeeId === employeeSchedule.employeeId) return;
    if (this.selectedEmployeeSchedule.employeeId !== employeeSchedule.employeeId) this.saveScheduleIfChanged();
    this.selectedEmployeeSchedule = employeeSchedule;
    this.selectEmployeeScheduleDays();
    this.setOriginalCopy(employeeSchedule);
    this.setButtons();
  }

  selectDay(scheduleDay: ScheduleDay) {
    this.infosService.scheduleInfo = scheduleDay.e;
  }

  selectEmployeeScheduleDays() {
    this.employeeScheduleDays = [];
    const employeeSchedules = this.schedules.filter(x => x.employeeId === this.selectedEmployeeSchedule.employeeId);
    const scheduleDays = employeeSchedules.map(x => x.sd);
    scheduleDays.forEach((x: ScheduleDay[]) => {
      x.forEach(day => this.employeeScheduleDays.push(day));
    });
  }

  setButtons() {
    this.buttonsService.employeeScheduleMoveUp = this.currentSchedule.indexOf(this.selectedEmployeeSchedule) === 0;
    this.buttonsService.employeeScheduleMoveDown =
      this.currentSchedule.indexOf(this.selectedEmployeeSchedule) ===
      this.currentSchedule.length - 1;
  }

  saveScheduleIfChanged() {
    if (this.isChanged(this.selectedEmployeeSchedule))
      this.dataService.updateSchedule(this.selectedEmployeeSchedule, (response) => console.log(response));
  }

  isChanged(employeeSchedule: EmployeeSchedule) {
    return !this.globalService.equals(employeeSchedule, this.originalEmployeeSchedule);
  }

  setOriginalCopy(employeeSchedule: EmployeeSchedule) {
    this.originalEmployeeSchedule = JSON.parse(JSON.stringify(employeeSchedule));
  }

  setPeriodData() {
    let minutesLimit = 0;
    const monthDefinition = this.dataService.periodDefinitions.find(x => x.month === this.month);
    const periodMonths = this.dataService.periodDefinitions.filter(x => x.period === monthDefinition.period);

    this.monthlyMinutesLimit = this.dataService.periods.find(x =>
      x.year === this.year && x.month === this.month).hours * 60;

    this.currentPeriodMonths = this.dataService.periodDefinitions.filter(x =>
      x.period === monthDefinition.period &&
      x.sortOrder <= monthDefinition.sortOrder);

    periodMonths.forEach(x => {
      const year = x.month > this.month ? this.year - 1 : this.year;
      const period = this.dataService.periods.find(y =>
        y.year === year && y.month === x.month);
      minutesLimit += period.hours * 60;
    });

    this.periodMinutesLimit = minutesLimit;
  }

  hourChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setHour(scheduleDay, () => {
      this.checkDayHasTimeValue(scheduleDay);
      this.validateDailyLimit(scheduleDay);
      this.setSummaryData(employeeId);
      this.setUpdatedBy(scheduleDay);
    });
  }

  minuteChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setMinute(scheduleDay, () => {
      this.checkDayHasTimeValue(scheduleDay);
      this.validateDailyLimit(scheduleDay);
      this.setSummaryData(employeeId);
      this.setUpdatedBy(scheduleDay);
    });
  }

  shiftChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setShift(scheduleDay, () => {
      this.validateDailyBreak(scheduleDay);
      this.setSummaryData(employeeId);
      this.setUpdatedBy(scheduleDay);
    });
  }

  setHour(scheduleDay: ScheduleDay, callback) {
    setTimeout(() => {
      scheduleDay.h = Number(scheduleDay.h.toString().replace(/\D/g, ''));

      if (!scheduleDay.s || scheduleDay.s >= 40) {
        scheduleDay.h = null;
        callback();
        return;
      }

      if (scheduleDay.h < 1 || scheduleDay.h > 12) scheduleDay.h = null;
      callback();
    });
  }

  setMinute(scheduleDay: ScheduleDay, callback) {
    setTimeout(() => {
      scheduleDay.m = Number(scheduleDay.m.toString().replace(/\D/g, ''));

      if (!scheduleDay.s || scheduleDay.s >= 40) {
        scheduleDay.m = null;
        callback();
        return;
      }

      if (scheduleDay.m < 1 || scheduleDay.m > 59) scheduleDay.m = null;
      callback();
    });
  }

  checkDayHasTimeValue(scheduleDay: ScheduleDay) {
    if (!scheduleDay.h && !scheduleDay.m) this.clearDay(scheduleDay);
  }

  validateDailyLimit(scheduleDay: ScheduleDay) {
    const planned = new TimeSpan(0, scheduleDay.h, scheduleDay.m);
    if (planned.totalMinutes() <= 0 || planned.totalMinutes() > 720) this.clearDay(scheduleDay);
  }

  validateDailyBreak(scheduleDay: ScheduleDay) {
    const currentDay = new Date(scheduleDay.d);
    this.clearDayErrors(scheduleDay, currentDay);

    if (!scheduleDay.s) return;

    const previousDay = new Date(currentDay);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousScheduleDay = this.employeeScheduleDays.find(x =>
      new Date(x.d).getTime() === previousDay.getTime());

    if (!previousScheduleDay) return;
    if (!previousScheduleDay.s) return;

    const previousWorkDayShift = this.dataService.shifts.find(x => x.id === previousScheduleDay.s);
    const previousStartHours = Number(previousWorkDayShift.current.start.substring(0, 2));
    const previousStartMinutes = Number(previousWorkDayShift.current.start.substring(3, 5));
    const previousWorkDayStartingTime = new TimeSpan(0, previousStartHours, previousStartMinutes);

    const currentWorkDayShift = this.dataService.shifts.find(x => x.id === scheduleDay.s);
    const currentStartHours = Number(currentWorkDayShift.current.start.substring(0, 2));
    const currentStartMinutes = Number(currentWorkDayShift.current.start.substring(3, 5));
    const currentWorkDayStartingTime = new TimeSpan(0, currentStartHours, currentStartMinutes);
    const minutesDifference = currentWorkDayStartingTime.totalMinutes() - previousWorkDayStartingTime.totalMinutes();

    if (minutesDifference < 0) {
      scheduleDay.bx = 3;
      scheduleDay.e += '- naruszono dobę pracowniczą';
      this.infosService.scheduleInfo = scheduleDay.e;
    }
  }

  clearDayErrors(scheduleDay: ScheduleDay, currentDay: Date) {
    const headerDay = this.header.sd.find(x =>
      new Date(x.d).getTime() === currentDay.getTime());

    scheduleDay.bx = 0;
    scheduleDay.e = '';
    if (headerDay.bx === 1) scheduleDay.bx = 1;
    if (scheduleDay.v) scheduleDay.bx = 2;
    this.infosService.scheduleInfo = scheduleDay.e;
  }

  setShift(scheduleDay, callback) {
    setTimeout(() => {
      if (!scheduleDay.x) {
        this.clearDay(scheduleDay);
        callback();
        return;
      }

      const shift = this.dataService.shifts.find(x => x.isValid && x.sign.startsWith(scheduleDay.x.toUpperCase()));

      if (!shift) {
        this.clearDay(scheduleDay);
        callback();
        return;
      }

      if (shift.id >= 40) {
        scheduleDay.h = null;
        scheduleDay.m = null;
      }

      if (shift.id === 42) scheduleDay.x = 'D5';

      if (shift.id <= 20) {
        const shiftDuration: ShiftDuration = this.getShiftDuration(shift.durations, scheduleDay.d);
        scheduleDay.h = shiftDuration.hours > 0 ? shiftDuration.hours : null;
        scheduleDay.m = shiftDuration.minutes > 0 ? shiftDuration.minutes : null;
      }

      scheduleDay.s = shift.id;
      callback();
    });
  }

  setUpdatedBy(scheduleDay: ScheduleDay) {
    scheduleDay.ub = sessionStorage.userId;
    scheduleDay.u = new Date();
  }

  getShiftDuration(durations: ShiftDuration[], day: Date): ShiftDuration {
    const dayTime = new Date(day).getTime();
    return durations.find(x => dayTime >= new Date(x.validFrom).getTime() && dayTime <= this.getShiftValidToDate(x.validTo).getTime());
  }

  getShiftValidToDate(validTo): Date {
    return validTo === null ? new Date(9999, 12, 31) : new Date(validTo);
  }

  clearDay(scheduleDay: ScheduleDay) {
    scheduleDay.s = null;
    scheduleDay.h = null;
    scheduleDay.m = null;
    scheduleDay.x = null;
  }

  setSummaryData(employeeId: number) {
    setTimeout(() => {
      const employeeSchedule = this.currentSchedule.find(x => x.employeeId === employeeId);
      this.calculateMonth(employeeSchedule);
      this.calculateTotal(employeeSchedule);
      this.setMonthlyBackground(employeeSchedule);
      this.setTotalBackground(employeeSchedule);
    });
  }

  calculateMonth(employeeSchedule: EmployeeSchedule) {
    let hours = 0;
    let minutes = 0;
    let days = 0;

    employeeSchedule.sd.forEach(x => {
      hours += Number(x.h);
      minutes += Number(x.m);
      if (x.s && x.s >= 1 && x.s <= 20) days += 1;
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
      const year = x.month > this.month ? this.year - 1 : this.year;
      const periodMonthSchedule = this.schedules.find(y =>
        y.employeeId === employeeSchedule.employeeId &&
        y.year === year &&
        y.month === x.month);

      if (periodMonthSchedule) {
        periodMonthSchedule.sd.forEach(z => {
          hours += Number(z.h);
          minutes += Number(z.m);
          if (z.s && z.s >= 1 && z.s <= 20) days += 1;
        });
      }
    });

    const total = new TimeSpan(0, hours, minutes);
    employeeSchedule.totalHours = total.totalHours();
    employeeSchedule.totalMinutes = total.minutes();
    employeeSchedule.totalDays = days;
  }

  setMonthlyBackground(employeeSchedule: EmployeeSchedule) {
    const planned = new TimeSpan(0, employeeSchedule.monthlyHours, employeeSchedule.monthlyMinutes);
    employeeSchedule.monthlyBackground = 1;
    if (planned.totalMinutes() === this.monthlyMinutesLimit) employeeSchedule.monthlyBackground = 2;
    if (planned.totalMinutes() > this.monthlyMinutesLimit) employeeSchedule.monthlyBackground = 4;
  }

  setTotalBackground(employeeSchedule: EmployeeSchedule) {
    const total = new TimeSpan(0, employeeSchedule.totalHours, employeeSchedule.totalMinutes);
    employeeSchedule.totalBackground = 1;
    if (total.totalMinutes() === this.periodMinutesLimit) employeeSchedule.totalBackground = 2;
    if (total.totalMinutes() > this.periodMinutesLimit) employeeSchedule.totalBackground = 4;
  }

  employeeScheduleMoveUp() {
    this.move(this.currentSchedule, this.selectedEmployeeSchedule, -1);
    this.setButtons();
  }

  employeeScheduleMoveDown() {
    this.move(this.currentSchedule, this.selectedEmployeeSchedule, 1);
    this.setButtons();
  }

  move(array: any[], element: any, delta: number) {
    const index = array.indexOf(element);
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= array.length) return;
    array[index] = array[newIndex];
    array[newIndex] = element;
  }

  close() {
    this.saveScheduleIfChanged();
    this.schedules = [];
    this.currentSchedule = [];
    this.header = null;
    this.selectedEmployeeSchedule = null;
    this.originalEmployeeSchedule = null;
    this.hideTabEvent.emit({ tabName: 'schedule' });
  }
}
