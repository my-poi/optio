import { Queries } from '../queries';
import { WorkTime } from '../databases/work-time';

export class ShiftsMethods {
  constructor(private queries: Queries, private workTime: WorkTime) { }

  getShifts(callback: any) {
    const sql = this.queries.dictionary['select-shifts'];
    this.workTime.query(sql, null, (results: any) => callback(results));
  }
}
