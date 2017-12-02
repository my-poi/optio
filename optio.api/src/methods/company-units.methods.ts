import { RowDataPacket } from 'mysql2/promise';
import { Queries } from '../queries';
import { OrganizationDatabase } from '../databases/organization.database';

export class CompanyUnitsMethods {
  constructor(private queries: Queries, private organizationDatabase: OrganizationDatabase) { }

  async getCompanyUnits() {
    return this.organizationDatabase.execute(this.queries.dictionary['select-company-units'], []);
  }
}
