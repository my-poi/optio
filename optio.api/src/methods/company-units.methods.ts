import { OrganizationDatabase } from '../databases/organization.database';
import { queries } from '../queries';

export class CompanyUnitsMethods {
  constructor(private organizationDatabase: OrganizationDatabase) { }

  async getCompanyUnits() {
    return await this.organizationDatabase.execute(queries['select-company-units'], []);
  }
}
