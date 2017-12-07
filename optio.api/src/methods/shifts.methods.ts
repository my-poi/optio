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
    const shiftDurations = JSON.parse(JSON.stringify(shiftDurationRows));
    const shifts: Shift[] = shiftRows.map(row => {
      const durations = shiftDurations.filter((x: ShiftDuration) => x.shiftId === row.id);
      const current = durations.find((x: ShiftDuration) => !x.validTo);
      return new Shift(row.id, row.sign, row.isValid, durations, current);
    });

    return shifts;
  }
}
