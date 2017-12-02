import { RowDataPacket } from 'mysql2/promise';
import { Queries } from '../queries';
import { OrganizationDatabase } from '../databases/organization.database';
import { Classification } from '../objects/classification';
import { Employee } from '../objects/employee';

export class EmployeesMethods {
  constructor(private queries: Queries, private organizationDatabase: OrganizationDatabase) { }

  async getEmployees() {
    const employeesRows: RowDataPacket[] = await this.organizationDatabase.
      execute(this.queries.dictionary['select-employees'], []);
    const classificationsRows: RowDataPacket[] = await this.organizationDatabase.
      execute(this.queries.dictionary['select-classifications'], []);

    const classifications: Classification[] = classificationsRows.map(row => {
      return new Classification(row.employeeId, row.companyUnitId, row.validFrom, row.validTo, row.createdBy, row.created);
    });

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

    return employees;
  }
}
