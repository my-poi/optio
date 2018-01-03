import { Component, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from '../../services/data.service';
import { ButtonsService } from '../../services/buttons.service';
import { GlobalService } from '../../services/global.service';
import { InfosService } from '../../services/infos.service';
import { PeriodDefinition } from '../../objects/period-definition';
import { ScheduleHeader } from '../../objects/schedule-header';
import { ScheduleHeaderDay } from '../../objects/schedule-header-day';
import { ScheduleDay } from '../../objects/schedule-day';
import { EmployeeSchedule } from '../../objects/employee-schedule';
import { TimeSpan } from '../../objects/time-span';
import { ShiftDuration } from '../../objects/shift-duration';
import { TimeSheetEmployee } from '../../objects/time-sheet-employee';
import { ScheduleValidator } from './schedule.validator';

@Component({
  selector: 'app-schedule-tab',
  templateUrl: './schedule.tab.html',
  styleUrls: ['./schedule.tab.css']
})
export class ScheduleTab {
  @Output() hideTabEvent = new EventEmitter<any>();
  scheduleTableBodyHeight = window.innerHeight - 245;
  year: number;
  month: number;
  daysInMonth: number;
  currentPeriodMonths: PeriodDefinition[];
  periodStartDate: Date;
  monthlyMinutesLimit: number;
  periodMinutesLimit: number;
  schedules: EmployeeSchedule[];
  currentSchedule: EmployeeSchedule[];
  header: ScheduleHeader;
  selectedEmployeeSchedule: EmployeeSchedule;
  originalEmployeeSchedule: EmployeeSchedule;
  selectedScheduleDay: ScheduleDay;
  employeeScheduleDays: ScheduleDay[];
  validator = new ScheduleValidator(this.dataService, this.infosService);

  constructor(private http: Http,
    private dataService: DataService,
    private buttonsService: ButtonsService,
    private globalService: GlobalService,
    private infosService: InfosService) { }

  load(companyUnitId: number, year: number, month: number) {
    this.year = year;
    this.month = month;
    this.daysInMonth = new Date(this.year, this.month, 0).getDate();
    this.dataService.loadSchedule(companyUnitId, year, month, (results) => {
      this.schedules = results;
      this.currentSchedule = this.schedules.
        filter(x => x.year === this.year && x.month === this.month).
        sort((a: EmployeeSchedule, b: EmployeeSchedule) => this.globalService.compare(a.sortOrder, b.sortOrder));
      const firstSchedule = this.currentSchedule[0];
      this.selectFirstSchedule(firstSchedule);
      this.setPeriodData();
      this.setHeader(firstSchedule);
      this.infosService.scheduleInfo = '';
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
    this.showErrors(scheduleDay);
  }

  showErrors(scheduleDay: ScheduleDay) {
    const errors = scheduleDay.e.map(x => x.error);
    this.infosService.scheduleInfo = errors.join('\n');
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
      x.sortOrder <= monthDefinition.sortOrder).
      sort((a: PeriodDefinition, b: PeriodDefinition) =>
        this.globalService.compare(a.sortOrder, b.sortOrder));

    periodMonths.forEach(x => {
      const year = x.month > this.month ? this.year - 1 : this.year;
      const period = this.dataService.periods.find(y =>
        y.year === year && y.month === x.month);
      minutesLimit += period.hours * 60;
    });

    this.periodMinutesLimit = minutesLimit;

    const firstMonth: number = this.currentPeriodMonths[0].month;
    this.periodStartDate = new Date(this.year, firstMonth - 1, 1, 0, 0, 0);
    if (firstMonth > this.month) this.periodStartDate.setFullYear(this.periodStartDate.getFullYear() - 1);
  }

  setHeader(firstSchedule: EmployeeSchedule) {
    this.header = new ScheduleHeader();
    this.header.hd = [];
    firstSchedule.sd.forEach(x => {
      this.header.hd.push(new ScheduleHeaderDay(
        x.d,
        this.getWeekBackground(x.d),
        this.getDayBackground(x.d)));
    });
  }

  getWeekBackground(day: Date) {
    const testedDay = new Date(day);
    testedDay.setHours(0, 0, 0);
    const timeDifference = testedDay.getTime() - this.periodStartDate.getTime();
    const daysDifference = timeDifference / 86400000;
    const remainder = daysDifference % 14;
    if (remainder <= 6) return 0;
    return 1;
  }

  getDayBackground(day: Date) {
    const testedDay = new Date(day);
    const weekDay = testedDay.getDay() === 6 || testedDay.getDay() === 0;
    let holiday = false;
    if (!weekDay) holiday = this.dataService.holidays.find(h => new Date(h.dayOff).getTime() === testedDay.getTime()) !== undefined;
    if (weekDay) return 1;
    if (holiday) return 1;
    return 0;
  }

  hourChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setHour(scheduleDay, () => {
      this.validator.validateHasDayTimeValue(scheduleDay);
      this.validateAndSetRestData(employeeId, scheduleDay);
    });
  }

  minuteChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setMinute(scheduleDay, () => {
      this.validator.validateHasDayTimeValue(scheduleDay);
      this.validateAndSetRestData(employeeId, scheduleDay);
    });
  }

  shiftChanged(employeeId: number, scheduleDay: ScheduleDay) {
    this.setShift(scheduleDay, () => {
      this.validateAndSetRestData(employeeId, scheduleDay);
    });
  }

  validateAndSetRestData(employeeId: number, scheduleDay: ScheduleDay) {
    this.validator.validateDailyBreak(scheduleDay, this.employeeScheduleDays);
    this.validator.validateWeekBreak(this.year, this.month, this.periodStartDate, this.employeeScheduleDays);
    this.validator.validateWeekHourlyLimit(this.year, this.month, this.periodStartDate, this.employeeScheduleDays);
    this.setSummaryData(employeeId);
    this.setUpdatedBy(scheduleDay);
    this.showErrors(scheduleDay);
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

  setShift(scheduleDay: ScheduleDay, callback) {
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
        const shiftDuration: ShiftDuration = this.getShiftDuration(scheduleDay.d, shift.durations);
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
