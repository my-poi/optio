import { Queries } from '../queries';
import { WorkTimeDatabase } from '../databases/work-time.database';

export class ShiftsMethods {
  constructor(private queries: Queries, private workTimeDatabase: WorkTimeDatabase) { }

  getShifts(callback: any) {
    const sql = this.queries.dictionary['select-shifts'];
    this.workTimeDatabase.query(sql, null, (results: any) => callback(results));
  }
}
