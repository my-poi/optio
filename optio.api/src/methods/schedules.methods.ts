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
    const companyUnitId = Number(request.body.companyUnitId);
    const year = Number(request.body.year);
    const month = Number(request.body.month);
    const companyUnitRows = await this.organizationDatabase.execute(queries['select-company-units'], []);
    let companyUnitIdentifiers: number[] = [];
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

    companyUnitIdentifiers = this.getCompanyUnitIdentifiers(companyUnitId, companyUnits);
    companyUnitIdentifiers.push(companyUnitId);

    const employeeIdentifiers = employees.filter(x =>
      x.classifications &&
      x.classifications.find(y =>
        !y.validTo &&
        companyUnitIdentifiers.includes(y.companyUnitId))).
      sort((a, b) => this.compareFullName(a, b)).
      map(z => z.id);

    const queryList: { sql: string, values: any }[] = [];
    const dayValues = this.getDayValues(employeeIdentifiers, year, month, userId);

    queryList.push({
      sql: queries['insert-planned-days'],
      values: [dayValues]
    });

    queryList.push({
      sql: queries['insert-worked-days'],
      values: [dayValues]
    });

    queryList.push({
      sql: queries['insert-schedules'],
      values: [this.getScheduleValues(companyUnitId, employeeIdentifiers, year, month, userId)]
    });

    await this.workTimeDatabase.transaction(queryList);
    return 'OK';
  }

  compareFullName(a: any, b: any) {
    if (a.lastName + ' ' + a.firstName < b.lastName + ' ' + b.firstName) return -1;
    if (a.lastName + ' ' + a.firstName > b.lastName + ' ' + b.firstName) return 1;
    return 0;
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
}
