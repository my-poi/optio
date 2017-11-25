import { Queries } from '../queries';
import { WorkTime } from '../databases/work-time';

export class ShiftsMethods {
  constructor(private queries: Queries, private workTime: WorkTime) { }

  getShifts(callback: any) {
    this.workTime.query(this.queries.dictionary['select-shifts'], null, (results: any) => callback(results));
  }
}
