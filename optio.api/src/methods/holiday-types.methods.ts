import { RowDataPacket } from 'mysql2/promise';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class HolidayTypesMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  async getHolidayTypes() {
    return await this.workTimeDatabase.execute(queries['select-holiday-types'], []);
  }
}
