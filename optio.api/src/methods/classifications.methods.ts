import { RowDataPacket } from 'mysql2/promise';
import { Queries } from '../queries';
import { OrganizationDatabase } from '../databases/organization.database';

export class ClassificationsMethods {
  constructor(private queries: Queries, private organizationDatabase: OrganizationDatabase) { }

  async getClassifications() {
    return this.organizationDatabase.execute(this.queries.dictionary['select-classifications'], []);
  }
}
