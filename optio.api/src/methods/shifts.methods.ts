import { RowDataPacket } from 'mysql2/promise';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { queries } from '../queries';
import { Shift } from '../objects/shift';
import { ShiftDuration } from '../objects/shift-duration';

export class ShiftsMethods {
  constructor(private workTimeDatabase: WorkTimeDatabase) { }

  async getShifts() {
    const shiftRows: RowDataPacket[] = await this.workTimeDatabase.execute(queries['select-shifts'], []);
    const shiftDurationRows: RowDataPacket[] = await this.workTimeDatabase.execute(queries['select-shift-durations'], []);

    const shiftDurations: ShiftDuration[] = shiftDurationRows.map(row => {
      return new ShiftDuration(row.shiftId, row.validFrom, row.validTo, row.start, row.finish, row.hours, row.minutes);
    });

    const shifts: Shift[] = shiftRows.map(row => {
      const durations = shiftDurations.filter(x => x.shiftId === row.id);
      const current = durations.find(x => !x.validTo);
      return new Shift(row.id, row.sign, row.isValid, durations, current);
    });

    return shifts;
  }
}
