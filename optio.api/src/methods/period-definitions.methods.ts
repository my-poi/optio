import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class PeriodDefinitionsMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  async getPeriodDefinitions() {
    return await this.workTimeDatabase.execute(queries['select-period-definitions'], []);
  }
}
