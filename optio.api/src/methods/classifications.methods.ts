import { RowDataPacket } from 'mysql2/promise';
import { OrganizationDatabase } from '../databases/organization.database';
import { queries } from '../queries';

export class ClassificationsMethods {
  constructor(private organizationDatabase: OrganizationDatabase) { }

  getClassifications() {
    return this.organizationDatabase.execute(queries['select-classifications'], []);
  }
}
