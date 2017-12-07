import { RowDataPacket } from 'mysql2/promise';
import { OrganizationDatabase } from '../databases/organization.database';
import { queries } from '../queries';
import { Classification } from '../objects/classification';
import { Employee } from '../objects/employee';

export class EmployeesMethods {
  constructor(private organizationDatabase: OrganizationDatabase) { }

  async getEmployees() {
    const employeesRows = await this.organizationDatabase.
      execute(queries['select-employees'], []);
    const classificationsRows = await this.organizationDatabase.
      execute(queries['select-classifications'], []);
    const classifications = JSON.parse(JSON.stringify(classificationsRows));
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

    return employees;
  }
}
