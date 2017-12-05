import { RowDataPacket } from 'mysql2/promise';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class HolidaysMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  getHolidays() {
    return this.workTimeDatabase.execute(queries['select-holidays'], []);
  }
}
