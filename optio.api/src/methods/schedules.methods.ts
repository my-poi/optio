import { RowDataPacket } from 'mysql2/promise';
import { Request } from 'express';
import { OrganizationDatabase } from '../databases/organization.database';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';
import { CompanyUnit } from '../objects/company-unit';
import { Employee } from '../objects/employee';
import { Classification } from '../objects/classification';
import { PeriodDefinition } from '../objects/period-definition';
import { Schedule } from '../objects/schedule';

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
      sort((a: Employee, b: Employee) => this.compare(a.lastName + a.firstName, b.lastName + b.firstName)).
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

    const scheduleEmployeeRows = await this.workTimeDatabase.
      execute(queries['select-schedule-employees'], [companyUnitId, year, month]);
    const scheduleEmployees = JSON.parse(JSON.stringify(scheduleEmployeeRows));
    const employeeIdentifiers = scheduleEmployees.map((x: Schedule) => x.employeeId);
    if (employeeIdentifiers.length === 0) return { success: false };
    const periodDefinitionRows = await this.workTimeDatabase.execute(queries['select-period-definitions'], []);
    const periodDefinitions = JSON.parse(JSON.stringify(periodDefinitionRows));
    const monthDefinition = periodDefinitions.find((x: PeriodDefinition) => x.month === month);
    const periodMonths = periodDefinitions.
      filter((x: PeriodDefinition) => x.period === monthDefinition.period).
      sort((a: PeriodDefinition, b: PeriodDefinition) => this.compare(a.sortOrder, b.sortOrder));
    const firstMonth: number = periodMonths[0].month;
    const from = new Date(year, firstMonth - 1, 1);
    const to = new Date(year, month, 0);
    if (firstMonth === month) from.setMonth(from.getMonth() - 1);
    if (firstMonth > month) from.setFullYear(from.getFullYear() - 1);

    const plannedDayRows = await this.workTimeDatabase.query(
      queries['select-planned-days'], [[employeeIdentifiers], from, to]);
    const plannedDays = JSON.parse(JSON.stringify(plannedDayRows));
    // console.log(plannedDays);


    return { success: true, result: plannedDays };
  }

  compare(a: any, b: any) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
}
