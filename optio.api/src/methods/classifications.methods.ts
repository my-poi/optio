import { OrganizationDatabase } from '../databases/organization.database';
import { queries } from '../queries';

export class ClassificationsMethods {
  constructor(private organizationDatabase: OrganizationDatabase) { }

  async getClassifications() {
    return await this.organizationDatabase.execute(queries['select-classifications'], []);
  }
}
