import { RowDataPacket } from 'mysql2/promise';
import { Queries } from '../queries';
import { WorkTimeDatabase } from '../databases/work-time.database';

export class HolidaysMethods {
  constructor(private queries: Queries, private workTimeDatabase: WorkTimeDatabase) { }

  async getHolidays() {
    return this.workTimeDatabase.execute(this.queries.dictionary['select-holidays'], []);
  }
}
