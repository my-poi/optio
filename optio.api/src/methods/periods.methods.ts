import { RowDataPacket } from 'mysql2/promise';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class PeriodsMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  getPeriods() {
    return this.workTimeDatabase.execute(queries['select-periods'], []);
  }
}
