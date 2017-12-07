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

    const periodDefinitionRows = await this.workTimeDatabase.execute(queries['select-period-definitions'], []);
    const periodDefinitions = JSON.parse(JSON.stringify(periodDefinitionRows));

    const currentMonthPeriodDefinition = periodDefinitions.find((x: PeriodDefinition) => x.month === month);
    const currentPeriodMonths = periodDefinitions.
      filter((x: PeriodDefinition) => x.period === currentMonthPeriodDefinition.period).
      sort((a: PeriodDefinition, b: PeriodDefinition) => tools.compare(a.sortOrder, b.sortOrder));

    const firstMonth: number = currentPeriodMonths[0].month;
    const from = new Date(year, firstMonth - 1, 1, 0, 0, 0, 0);
    const to = new Date(year, month, 0, 23, 59, 59, 59);
    if (firstMonth === month) from.setMonth(from.getMonth() - 1);
    if (firstMonth > month) from.setFullYear(from.getFullYear() - 1);

    // console.log('from: ' + from);
    // console.log('to: ' + to);

    const scheduleEmployeeRows = await this.organizationDatabase.
      query(queries['select-employees-by-id'], [[scheduleEmployeeIdentifiers]]);
    const scheduleEmployees = JSON.parse(JSON.stringify(scheduleEmployeeRows));

    const shiftRows = await this.workTimeDatabase.
      query(queries['select-shifts'], []);
    const shifts = JSON.parse(JSON.stringify(shiftRows));

    const employeeScheduleRows = await this.workTimeDatabase.
      query(queries['select-employee-schedules'], [[scheduleEmployeeIdentifiers], from, to]);
    const employeeSchedules = JSON.parse(JSON.stringify(employeeScheduleRows));

    const plannedDayRows = await this.workTimeDatabase.
      query(queries['select-planned-days'], [[scheduleEmployeeIdentifiers], from, to]);
    const plannedDays = JSON.parse(JSON.stringify(plannedDayRows));

    const holidayRows = await this.workTimeDatabase.
      query(queries['select-holidays'], []);
    const holidays = JSON.parse(JSON.stringify(holidayRows));

    const vacationRows = await this.workTimeDatabase.
      query(queries['select-vacations'], []);
    const holidays = JSON.parse(JSON.stringify(holidayRows));

    const schedules = employeeSchedules.map((schedule: Schedule) => {
      const employee: Employee = scheduleEmployees.find((x: Employee) => x.id === schedule.employeeId);
      const daysInMonth = new Date(schedule.year, schedule.month, 0).getDate();
      const scheduleFrom = new Date(schedule.year, schedule.month - 1, 1, 0, 0, 0, 0);
      const scheduleTo = new Date(schedule.year, schedule.month, 0, 23, 59, 59, 59);
      const schedulePlannedDays: PlannedDay[] = plannedDays.filter((x: PlannedDay) =>
        x.employeeId === schedule.employeeId &&
        new Date(x.day).getTime() >= scheduleFrom.getTime() &&
        new Date(x.day).getTime() <= scheduleTo.getTime());
      const scheduleDays = this.getScheduleDays(schedulePlannedDays, shifts, holidays);
      // console.log('from: ' + scheduleFrom);
      // console.log('to: ' + scheduleTo);
      return new EmployeeSchedule(
        schedule.employeeId,
        `${employee.lastName} ${employee.firstName}`,
        schedule.year,
        schedule.month,
        29 <= daysInMonth,
        30 <= daysInMonth,
        31 === daysInMonth,
        schedulePlannedDays.map(x => x.hours).reduce((a, b) => a + b, 0),
        schedulePlannedDays.map(x => x.minutes).reduce((a, b) => a + b, 0),
        1,
        1,
        1,
        1,
        1,
        1,
        schedule.createdBy,
        schedule.created,
        scheduleDays);
    });

    return schedules;
  }

  getMonthlyDays() {

  }

  getScheduleDays(schedulePlannedDays: PlannedDay[], shifts: Shift[], holidays: Holiday[]): ScheduleDay[] {
    const results: ScheduleDay[] = schedulePlannedDays.map(x => {
      const shift = shifts.find((s: Shift) => s.id === x.shiftId);
      return new ScheduleDay(
        x.day,
        x.hours,
        x.minutes,
        x.shiftId,
        shift ? shift.sign : '',
        true,
        x.comment,
        this.getTimeBackground(x.day, x.comment, holidays),
        1,
        x.updatedBy,
        x.updated);
    });
    return results;
  }

  getVacation() {

  }

  getTimeBackground(day: Date, comment: string, holidays: Holiday[]): number {
    const dayDate = new Date(day);
    if (comment) return 2;
    if (dayDate.getDay() === 6 || dayDate.getDay() === 0) return 1;
    if (holidays.find(x => new Date(x.dayOff).getTime() === dayDate.getTime())) return 1;
    return 0;
  }
}
