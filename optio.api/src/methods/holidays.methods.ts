import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class HolidaysMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  async getHolidays() {
    return await this.workTimeDatabase.execute(queries['select-holidays'], []);
  }
}
