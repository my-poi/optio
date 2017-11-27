import { RowDataPacket } from 'mysql2/promise';
import { Queries } from '../queries';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { Shift } from '../objects/shift';
import { ShiftDuration } from '../objects/shift-duration';

export class ShiftsMethods {
  constructor(private queries: Queries, private workTimeDatabase: WorkTimeDatabase) { }

  async getShifts() {
    const shiftRows: RowDataPacket[] = await this.workTimeDatabase.execute(this.queries.dictionary['select-shifts'], []);
    const shiftDurationRows: RowDataPacket[] = await this.workTimeDatabase.execute(this.queries.dictionary['select-shift-durations'], []);

    const shiftDurations: ShiftDuration[] = shiftDurationRows.map(row => {
      return new ShiftDuration(row.shiftId, row.validFrom, row.validTo, row.start, row.finish, row.hours, row.minutes);
    });

    const shifts: Shift[] = shiftRows.map(row => {
      const durations = shiftDurations.filter(x => x.shiftId === row.id);
      const current = durations.filter(x => !x.validTo)[0] || null;
      return new Shift(row.id, row.sign, row.isValid, durations, current);
    });

    return shifts;
  }
}
