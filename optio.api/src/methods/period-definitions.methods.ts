import { RowDataPacket } from 'mysql2/promise';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';

export class PeriodDefinitionsMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  getPeriodDefinitions() {
    return this.workTimeDatabase.execute(queries['select-period-definitions'], []);
  }
}
