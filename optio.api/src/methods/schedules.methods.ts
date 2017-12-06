import { RowDataPacket } from 'mysql2/promise';
import { Request } from 'express';
import { OrganizationDatabase } from '../databases/organization.database';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';
import { CompanyUnit } from '../objects/company-unit';
import { Employee } from '../objects/employee';
import { Classification } from '../objects/classification';

export class SchedulesMethods {
  constructor(
    private organizationDatabase: OrganizationDatabase,
    private workTimeDatabase: WorkTimeDatabase) { }

  async addSchedule(request: Request) {
    const userId = request.body.decoded.userId;
    const date = new Date();
    // tslint:disable-next-line:max-line-length
    const operationDateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const companyUnitId = Number(request.body.companyUnitId);
    const year = Number(request.body.year);
    const month = Number(request.body.month);
    const companyUnitRows = await this.organizationDatabase.execute(queries['select-company-units'], []);
    const companyUnitIdentifiers: number[] = [];
    companyUnitIdentifiers.push(companyUnitId);
    const companyUnits: CompanyUnit[] = companyUnitRows.map(row => {
      return new CompanyUnit(
        row.id,
        row.parentId,
        row.sortOrder,
        row.name,
        row.sign,
        row.phone1,
        row.phone2,
        row.fax,
        row.email,
        row.isExpanded,
        row.isClassified,
        row.isScheduled,
        row.isPosition,
        row.isHidden,
        row.createdBy,
        row.created,
        row.updatedBy,
        row.updated,
        row.children);
    });

    const classificationsRows: RowDataPacket[] = await this.organizationDatabase.
      execute(queries['select-classifications'], []);

    const classifications: Classification[] = classificationsRows.map(row => {
      return new Classification(row.employeeId, row.companyUnitId, row.validFrom, row.validTo, row.createdBy, row.created);
    });

    const employeesRows: RowDataPacket[] = await this.organizationDatabase.
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
        classifications.filter(x => x.employeeId === row.id)
      );
    });

    this.getCompanyUnitIdentifiers(companyUnitId, companyUnits, companyUnitIdentifiers);
    const employeeIdentifiers = employees.filter(x =>
      x.classifications &&
      x.classifications.find(y =>
        !y.validTo &&
        companyUnitIdentifiers.includes(y.companyUnitId))).
      sort((a, b) => this.compareFullName(a, b)).
      map(z => z.id);

    console.log(companyUnitIdentifiers);


    this.insertPlannedDays(employeeIdentifiers, year, month, userId, operationDateTime);
    this.insertWorkedDays(employeeIdentifiers, year, month, userId, operationDateTime);
    this.insertSchedules(companyUnitId, employeeIdentifiers, year, month, userId, operationDateTime);

    return 'OK';
  }

  compareFullName(a: any, b: any) {
    if (a.lastName + ' ' + a.firstName < b.lastName + ' ' + b.firstName) return -1;
    if (a.lastName + ' ' + a.firstName > b.lastName + ' ' + b.firstName) return 1;
    return 0;
  }

  getCompanyUnitIdentifiers(companyUnitId: number, companyUnits: CompanyUnit[], companyUnitIdentifiers: number[]) {
    const identifiers = companyUnits.filter(x => x.parentId === companyUnitId && !x.isScheduled && !x.isHidden).map(y => y.id);
    identifiers.forEach(x => {
      companyUnitIdentifiers.push(x);
      this.getCompanyUnitIdentifiers(x, companyUnits, companyUnitIdentifiers);
    });
  }

  async insertPlannedDays(employeeIdentifiers: number[], year: number, month: number, userId: number, operationDateTime: string) {
    let values = '';
    const daysInMonth = new Date(year, month, 0).getDate();

    employeeIdentifiers.forEach(employeeId => {
      for (let i = 1; i <= daysInMonth; i++) {
        values += `(${employeeId},'${year}-${month}-${i}',${userId},'${operationDateTime}'),`;
      }
    });

    let sql = `INSERT INTO PlannedDays
    (employeeId,
    day,
    updatedBy,
    updated)
    VALUES
    `;
    sql += values.slice(0, -1) + ';';
    await this.workTimeDatabase.execute(sql, []);
  }

  async insertWorkedDays(employeeIdentifiers: number[], year: number, month: number, userId: number, operationDateTime: string) {
    let values = '';
    const daysInMonth = new Date(year, month, 0).getDate();

    employeeIdentifiers.forEach(employeeId => {
      for (let i = 1; i <= daysInMonth; i++) {
        values += `(${employeeId},'${year}-${month}-${i}',${userId},'${operationDateTime}'),`;
      }
    });

    let sql = `INSERT INTO WorkedDays
    (employeeId,
    day,
    updatedBy,
    updated)
    VALUES
    `;
    sql += values.slice(0, -1) + ';';
    console.log(sql);
    await this.workTimeDatabase.execute(sql, []);
  }

  // tslint:disable-next-line:max-line-length
  async insertSchedules(companyUnitId: number, employeeIdentifiers: number[], year: number, month: number, userId: number, operationDateTime: string) {
    let values = '';
    let sortOrder = 1;

    employeeIdentifiers.forEach(employeeId => {
      values += `(${companyUnitId},${employeeId},${year},${month},${sortOrder},0,0,${userId},'${operationDateTime}'),`;
      sortOrder += 1;
    });

    let sql = `INSERT INTO Schedules
    (companyUnitId,
    employeeId,
    year,
    month,
    sortOrder,
    plannedIsLocked,
    workedIsLocked,
    createdBy,
    created)
    VALUES
    `;
    sql += values.slice(0, -1) + ';';
    await this.workTimeDatabase.execute(sql, []);
  }
}
