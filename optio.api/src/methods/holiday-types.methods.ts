import { RowDataPacket } from 'mysql2/promise';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class HolidayTypesMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  getHolidayTypes() {
    return this.workTimeDatabase.execute(queries['select-holiday-types'], []);
  }
}
