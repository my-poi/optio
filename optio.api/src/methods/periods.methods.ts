import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class PeriodsMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  async getPeriods() {
    return await this.workTimeDatabase.execute(queries['select-periods'], []);
  }
}
