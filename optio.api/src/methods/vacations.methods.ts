import { RowDataPacket } from 'mysql2/promise';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class VacationsMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  async getVacations() {
    return await this.workTimeDatabase.execute(queries['select-vacations'], []);
  }
}
