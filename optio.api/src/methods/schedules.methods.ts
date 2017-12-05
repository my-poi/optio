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
    // 1. pobież id pracowników wskazanej komórki pomijając te gałęzie, które mają/mogą mieć własne grafiki
    // 2. dodaj dni planu oraz przepracowanych zgodnie ze wskazanym rokiem i miesiącem (od 1 do ostatniego dnia)
    // 3. dodaj rekord grafiku dla komórki organizacyjnej

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


    this.getChildIdentifiers(companyUnitId, companyUnits, companyUnitIdentifiers);
    const employeeIdentifiers = employees.filter(x =>
      x.classifications &&
      x.classifications.find(y =>
        !y.validTo &&
        companyUnitIdentifiers.includes(y.companyUnitId))).map(z => z.id);

    console.log(JSON.stringify(employeeIdentifiers));
    return companyUnitIdentifiers;
  }

  getChildIdentifiers(companyUnitId: number, companyUnits: CompanyUnit[], companyUnitIdentifiers: number[]) {
    const identifiers = companyUnits.filter(x =>
      x.parentId === companyUnitId && !x.isScheduled && !x.isHidden).map(y => y.id);
    identifiers.forEach(x => companyUnitIdentifiers.push(x));
    identifiers.forEach(x => this.getChildIdentifiers(x, companyUnits, companyUnitIdentifiers));
  }
}
