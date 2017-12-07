import { RowDataPacket } from 'mysql2/promise';
import { Request } from 'express';
import { OrganizationDatabase } from '../databases/organization.database';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';
import * as tools from '../tools';
import { CompanyUnit } from '../objects/company-unit';
import { Employee } from '../objects/employee';
import { Classification } from '../objects/classification';
import { PeriodDefinition } from '../objects/period-definition';
import { Schedule } from '../objects/schedule';
import { EmployeeSchedule } from '../objects/employee-schedule';
import { PlannedDay } from '../objects/planned-day';
import { ScheduleDay } from '../objects/schedule-day';
import { Shift } from '../objects/shift';
import { Holiday } from '../objects/holiday';
import { Vacation } from '../objects/vacation';
import { Period } from '../objects/period';
import { TimeSpan } from '../objects/time-span';

export class SchedulesMethods {
  constructor(
    private organizationDatabase: OrganizationDatabase,
    private workTimeDatabase: WorkTimeDatabase) { }

  async addSchedule(request: Request) {
    const userId = request.body.decoded.userId;
    const date = new Date();
    const companyUnitId = Number(request.body.companyUnitId);
    const year = Number(request.body.year);
    const month = Number(request.body.month);
    const companyUnitRows = await this.organizationDatabase.execute(queries['select-company-units'], []);
    let companyUnitIdentifiers: number[] = [];
    const companyUnits = JSON.parse(JSON.stringify(companyUnitRows));
    const classificationsRows = await this.organizationDatabase.
      execute(queries['select-classifications'], []);
    const classifications = JSON.parse(JSON.stringify(classificationsRows));
    const employeesRows = await this.organizationDatabase.
      execute(queries['select-employees'], []);
    const employees: Employee[] = employeesRows.map(row => {
      return new Employee(
        row.id,
        row.firstName,
        row.lastName,
        row.phone1,
        row.phone2,
        row.fax,
        row.email,
        row.photo,
        row.createdBy,
        row.created,
        row.updatedBy,
        row.updated,
        classifications.filter((x: Classification) => x.employeeId === row.id)
      );
    });

    companyUnitIdentifiers = this.getCompanyUnitIdentifiers(companyUnitId, companyUnits);
    companyUnitIdentifiers.push(companyUnitId);

    const employeeIdentifiers = employees.filter(x =>
      x.classifications &&
      x.classifications.find(y =>
        !y.validTo &&
        companyUnitIdentifiers.includes(y.companyUnitId))).
      sort((a: Employee, b: Employee) => tools.compare(a.lastName + a.firstName, b.lastName + b.firstName)).
      map(z => z.id);

    const dayValues = this.getDayValues(employeeIdentifiers, year, month, userId);
    const queryList = [
      {
        sql: queries['insert-planned-days'],
        values: [dayValues]
      },
      {
        sql: queries['insert-worked-days'],
        values: [dayValues]
      },
      {
        sql: queries['insert-schedules'],
        values: [this.getScheduleValues(companyUnitId, employeeIdentifiers, year, month, userId)]
      }
    ];

    await this.workTimeDatabase.transaction(queryList);
    return { success: true };
  }

  getCompanyUnitIdentifiers(companyUnitId: number, companyUnits: CompanyUnit[]): any {
    const childIds = companyUnits.filter(x => x.parentId === companyUnitId && !x.isScheduled && !x.isHidden).map(y => y.id);
    childIds.forEach(c => this.getCompanyUnitIdentifiers(c, companyUnits));
    return childIds;
  }

  getDayValues(employeeIdentifiers: number[], year: number, month: number, userId: number) {
    const values: any[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    employeeIdentifiers.forEach(employeeId => {
      for (let i = 1; i <= daysInMonth; i++) {
        values.push([employeeId, `${year}-${month}-${i}`]);
      }
    });

    return values;
  }

  getScheduleValues(companyUnitId: number, employeeIdentifiers: number[], year: number, month: number, userId: number) {
    const values: any[] = [];
    let sortOrder = 1;
    const operationDateTime = new Date();

    employeeIdentifiers.forEach(employeeId => {
      values.push([companyUnitId, employeeId, year, month, sortOrder, 0, 0, userId, operationDateTime]);
      sortOrder += 1;
    });

    return values;
  }

  async getSchedules(request: Request) {
    const year = Number(request.params.year);
    const month = Number(request.params.month);
    return await this.workTimeDatabase.execute(queries['select-schedules'], [year, month]);
  }

  async getSchedule(request: Request) {
    const companyUnitId = Number(request.params.companyUnitId);
    const year = Number(request.params.year);
    const month = Number(request.params.month);

    const currentCompanyUnitScheduleRows = await this.workTimeDatabase.
      execute(queries['select-company-unit-schedules'], [companyUnitId, year, month]);
    const currentCompanyUnitSchedules = JSON.parse(JSON.stringify(currentCompanyUnitScheduleRows));
    const scheduleEmployeeIdentifiers = currentCompanyUnitSchedules.map((x: Schedule) => x.employeeId);

    if (scheduleEmployeeIdentifiers.length === 0) return { success: false };

    const periodDefinitionRows = await this.workTimeDatabase.
      execute(queries['select-period-definitions'], []);
    const periodDefinitions = JSON.parse(JSON.stringify(periodDefinitionRows));

    const periodRows = await this.workTimeDatabase.
      execute(queries['select-periods'], []);
    const periods = JSON.parse(JSON.stringify(periodRows));

    const currentMonthPeriodDefinition = periodDefinitions.find((x: PeriodDefinition) => x.month === month);
    const currentPeriodMonths = periodDefinitions.
      filter((x: PeriodDefinition) => x.period === currentMonthPeriodDefinition.period).
      sort((a: PeriodDefinition, b: PeriodDefinition) => tools.compare(a.sortOrder, b.sortOrder));

    const firstMonth: number = currentPeriodMonths[0].month;
    const periodStartDate = new Date(year, firstMonth - 1, 1, 0, 0, 0, 0);
    const from = new Date(year, firstMonth - 1, 1, 0, 0, 0, 0);
    const to = new Date(year, month, 0, 23, 59, 59, 59);
    if (firstMonth === month) from.setMonth(from.getMonth() - 1);
    if (firstMonth > month) from.setFullYear(from.getFullYear() - 1);

    let periodMinutesLimit = 0;
    currentPeriodMonths.forEach((x: PeriodDefinition) => {
      const periodYear = firstMonth > x.month ? year - 1 : year;
      const hours = periods.find((period: Period) =>
        period.year === periodYear && period.month === x.month).
        map((y: Period) => y.hours);
      periodMinutesLimit += hours * 60;
    });

    console.log(periodMinutesLimit);

    // console.log('from: ' + from);
    // console.log('to: ' + to);

    const scheduleEmployeeRows = await this.organizationDatabase.
      query(queries['select-employees-by-id'], [[scheduleEmployeeIdentifiers]]);
    const scheduleEmployees = JSON.parse(JSON.stringify(scheduleEmployeeRows));

    const shiftRows = await this.workTimeDatabase.
      execute(queries['select-shifts'], []);
    const shifts = JSON.parse(JSON.stringify(shiftRows));

    const employeeScheduleRows = await this.workTimeDatabase.
      query(queries['select-employee-schedules'], [[scheduleEmployeeIdentifiers], from, to]);
    const employeeSchedules = JSON.parse(JSON.stringify(employeeScheduleRows));

    const plannedDayRows = await this.workTimeDatabase.
      query(queries['select-planned-days'], [[scheduleEmployeeIdentifiers], from, to]);
    const plannedDays = JSON.parse(JSON.stringify(plannedDayRows));

    const holidayRows = await this.workTimeDatabase.
      execute(queries['select-holidays'], []);
    const holidays = JSON.parse(JSON.stringify(holidayRows));

    const vacationRows = await this.workTimeDatabase.
      query(queries['select-vacations-by-employee'], [[scheduleEmployeeIdentifiers]]);
    const vacations = JSON.parse(JSON.stringify(vacationRows));

    const schedules = employeeSchedules.map((schedule: Schedule) => {
      const employee: Employee = scheduleEmployees.find((x: Employee) => x.id === schedule.employeeId);
      const daysInMonth = new Date(schedule.year, schedule.month, 0).getDate();
      const scheduleFrom = new Date(schedule.year, schedule.month - 1, 1, 0, 0, 0, 0);
      const scheduleTo = new Date(schedule.year, schedule.month, 0, 23, 59, 59, 59);
      const schedulePlannedDays: PlannedDay[] = plannedDays.filter((x: PlannedDay) =>
        x.employeeId === schedule.employeeId &&
        new Date(x.day).getTime() >= scheduleFrom.getTime() &&
        new Date(x.day).getTime() <= scheduleTo.getTime());
      const employeeVacations = vacations.filter((x: Vacation) => x.employeeId === schedule.employeeId);
      const scheduleDays = this.getScheduleDays(schedulePlannedDays, shifts, holidays, employeeVacations);
      // console.log('from: ' + scheduleFrom);
      // console.log('to: ' + scheduleTo);
      const employeePeriodPlannedDays = plannedDays.filter((plannedDay: PlannedDay) =>
        plannedDay.employeeId === schedule.employeeId &&
        new Date(plannedDay.day).getTime() >= periodStartDate.getTime() &&
        new Date(plannedDay.day).getTime() <= to.getTime());
      const monthlyHours = schedulePlannedDays.map(x => x.hours).reduce((a, b) => a + b, 0);
      const monthlyMinutes = schedulePlannedDays.map(x => x.minutes).reduce((a, b) => a + b, 0);
      const totalHours = employeePeriodPlannedDays.map((x: PlannedDay) => x.hours).reduce((a: number, b: number) => a + b, 0);
      const totalMinutes = employeePeriodPlannedDays.map((x: PlannedDay) => x.minutes).reduce((a: number, b: number) => a + b, 0);
      return new EmployeeSchedule(
        schedule.employeeId,
        `${employee.lastName} ${employee.firstName}`,
        schedule.year,
        schedule.month,
        29 <= daysInMonth,
        30 <= daysInMonth,
        31 === daysInMonth,
        monthlyHours,
        monthlyMinutes,
        this.getMonthlyDays(schedulePlannedDays),
        this.getMonthlyBackground(monthlyHours, monthlyMinutes, year, month, periods),
        totalHours,
        totalMinutes,
        this.getTotalDays(employeePeriodPlannedDays),
        this.getTotalBackground(totalHours, totalMinutes, periodMinutesLimit),
        schedule.createdBy,
        schedule.created,
        scheduleDays);
    });

    return schedules;
  }

  getMonthlyDays(plannedDays: PlannedDay[]): number {
    let result = 0;
    plannedDays.forEach(x => {
      if (x.shiftId && x.shiftId >= 1 && x.shiftId <= 20) result += 1;
    });
    return result;
  }

  getMonthlyBackground(monthlyHours: number, monthlyMinutes: number, year: number, month: number, periods: Period[]): number {
    const monthlyTime = new TimeSpan(0, monthlyHours, monthlyMinutes);
    const monhtlyLimit = periods.find(x => x.year === year && x.month === month);
    if (monhtlyLimit) {
      const monthlyMinutesLimit = monhtlyLimit.hours * 60;
      if (monthlyTime.totalMinutes() === monthlyMinutesLimit) return 2;
      if (monthlyTime.totalMinutes() > monthlyMinutesLimit) return 4;
    }
    return 0;
  }

  getTotalBackground(totalHours: number, totalMinutes: number, periodMinutesLimit: number): number {
    const totalTime = new TimeSpan(0, totalHours, totalMinutes);
    if (totalTime.totalMinutes() === periodMinutesLimit) return 2;
    if (totalTime.totalMinutes() > periodMinutesLimit) return 4;
    return 0;
  }

  getTotalDays(employeePeriodPlannedDays: PlannedDay[]): number {
    let result = 0;
    employeePeriodPlannedDays.forEach(x => {
      if (x.shiftId && x.shiftId >= 1 && x.shiftId <= 20) result += 1;
    });
    return result;
  }

  getScheduleDays(schedulePlannedDays: PlannedDay[], shifts: Shift[], holidays: Holiday[], employeeVacations: Vacation[]): ScheduleDay[] {
    const results: ScheduleDay[] = schedulePlannedDays.map(plannedDay => {
      const shift = shifts.find((s: Shift) => s.id === plannedDay.shiftId);
      const day = new Date(plannedDay.day);
      day.setHours(0, 0, 0, 0);
      const vacation = this.hasVacation(day, employeeVacations);
      const weekDay = day.getDay() === 6 || day.getDay() === 0;
      const holiday = holidays.find(h => new Date(h.dayOff).getTime() === day.getTime()) !== undefined;
      return new ScheduleDay(
        plannedDay.day,
        plannedDay.hours,
        plannedDay.minutes,
        plannedDay.shiftId,
        shift ? shift.sign : '',
        vacation,
        plannedDay.comment,
        this.getTimeBackground(plannedDay.comment, weekDay, holiday),
        this.getShiftBackground(vacation, weekDay, holiday),
        plannedDay.updatedBy,
        plannedDay.updated);
    });
    return results;
  }

  hasVacation(day: Date, employeeVacations: Vacation[]): boolean {
    const dayTime = day.getTime();
    const result = employeeVacations.find(x =>
      new Date(x.start).getTime() <= dayTime &&
      new Date(x.finish).getTime() >= dayTime);
    return result !== undefined;
  }

  getTimeBackground(comment: string, weekDay: boolean, holiday: boolean): number {
    if (comment) return 2;
    if (weekDay) return 1;
    if (holiday) return 1;
    return 0;
  }

  getShiftBackground(vacation: boolean, weekDay: boolean, holiday: boolean): number {
    if (vacation) return 2;
    if (weekDay) return 1;
    if (holiday) return 1;
    return 0;
  }
}
