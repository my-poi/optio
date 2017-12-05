import { RowDataPacket } from 'mysql2/promise';
import { OrganizationDatabase } from '../databases/organization.database';
import { queries } from '../queries';

export class CompanyUnitsMethods {
  constructor(private organizationDatabase: OrganizationDatabase) { }

  getCompanyUnits() {
    return this.organizationDatabase.execute(queries['select-company-units'], []);
  }
}
