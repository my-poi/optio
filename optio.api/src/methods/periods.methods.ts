import { RowDataPacket } from 'mysql2/promise';
import { Queries } from '../queries';
import { WorkTimeDatabase } from '../databases/work-time.database';

export class PeriodsMethods {
  constructor(private queries: Queries, private workTimeDatabase: WorkTimeDatabase) { }

  getPeriods() {
    return this.workTimeDatabase.execute(this.queries.dictionary['select-periods'], []);
  }
}
