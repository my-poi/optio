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
    const employeeIdentifiers = currentCompanyUnitSchedules.map((x: Schedule) => x.employeeId);
    if (employeeIdentifiers.length === 0) return { success: false };
    const periodDefinitionRows = await this.workTimeDatabase.execute(queries['select-period-definitions'], []);
    const periodDefinitions = JSON.parse(JSON.stringify(periodDefinitionRows));
    const monthDefinition = periodDefinitions.find((x: PeriodDefinition) => x.month === month);
    const periodMonths = periodDefinitions.
      filter((x: PeriodDefinition) => x.period === monthDefinition.period).
      sort((a: PeriodDefinition, b: PeriodDefinition) => tools.compare(a.sortOrder, b.sortOrder));
    const firstMonth: number = periodMonths[0].month;
    const from = new Date(year, firstMonth - 1, 1);
    const to = new Date(year, month, 0);
    if (firstMonth === month) from.setMonth(from.getMonth() - 1);
    if (firstMonth > month) from.setFullYear(from.getFullYear() - 1);

    const employeeRows = await this.organizationDatabase.
      query(queries['select-employees-by-id'], [[employeeIdentifiers]]);
    const employees = JSON.parse(JSON.stringify(employeeRows));

    const shiftRows = await this.workTimeDatabase.
      query(queries['select-shifts'], []);
    const shifts = JSON.parse(JSON.stringify(shiftRows));

    const allEmployeeScheduleRows = await this.workTimeDatabase.
      query(queries['select-employee-schedules'], [[employeeIdentifiers], from, to]);
    const allEmployeeSchedules = JSON.parse(JSON.stringify(allEmployeeScheduleRows));

    const plannedDayRows = await this.workTimeDatabase.query(
      queries['select-planned-days'], [[employeeIdentifiers], from, to]);
    const plannedDays = JSON.parse(JSON.stringify(plannedDayRows));

    // console.log('from: ' + from);
    // console.log('to: ' + to);

    const schedules = allEmployeeSchedules.map((schedule: Schedule) => {
      const employee: Employee = employees.find((x: Employee) => x.id === schedule.employeeId);
      const daysInMonth = new Date(schedule.year, schedule.month, 0).getDate();
      const scheduleFrom = new Date(schedule.year, schedule.month - 1, 1);
      const scheduleTo = new Date(schedule.year, schedule.month, 0);
      const schedulePlannedDays: PlannedDay[] = plannedDays.filter((x: PlannedDay) => x.day >= scheduleFrom && x.day <= scheduleTo);
      const scheduleDays = this.getScheduleDays(schedule.employeeId, scheduleFrom, scheduleTo, shifts, schedulePlannedDays);
      // console.log('from: ' + scheduleFrom);
      // console.log('to: ' + scheduleTo);
      console.log(schedulePlannedDays);
      console.log(scheduleDays);

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

  getScheduleDays(employeeId: number, from: Date, to: Date, shifts: Shift[], schedulePlannedDays: PlannedDay[]): ScheduleDay[] {
    const plannedDays = schedulePlannedDays.filter(x => x.employeeId === employeeId && x.day >= from && x.day <= to);
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
        1,
        1,
        x.updatedBy,
        x.updated);
    });
    return results;
  }
}
