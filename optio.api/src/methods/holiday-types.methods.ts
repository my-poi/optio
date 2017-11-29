import { RowDataPacket } from 'mysql2/promise';
import { Queries } from '../queries';
import { WorkTimeDatabase } from '../databases/work-time.database';

export class HolidayTypesMethods {
  constructor(private queries: Queries, private workTimeDatabase: WorkTimeDatabase) { }

  async getHolidayTypes() {
    return this.workTimeDatabase.execute(this.queries.dictionary['select-holiday-types'], []);
  }
}
