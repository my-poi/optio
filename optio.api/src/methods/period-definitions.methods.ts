import { RowDataPacket } from 'mysql2/promise';
import { Queries } from '../queries';
import { WorkTimeDatabase } from '../databases/work-time.database';

export class PeriodDefinitionsMethods {
  constructor(private queries: Queries, private workTimeDatabase: WorkTimeDatabase) { }

  async getPeriodDefinitions() {
    return this.workTimeDatabase.execute(this.queries.dictionary['select-period-definitions'], []);
  }
}
