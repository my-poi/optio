import { Queries } from '../queries';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { Shift } from '../objects/shift';
import { ShiftDuration } from '../objects/shift-duration';

export class ShiftsMethods {
  constructor(private queries: Queries, private workTimeDatabase: WorkTimeDatabase) { }

  async getShifts() {
    const shiftRows = await this.workTimeDatabase.execute(this.queries.dictionary['select-shifts'], []);
    const shiftDurationRows = await this.workTimeDatabase.execute(this.queries.dictionary['select-shift-durations'], []);
    const shiftDurations: ShiftDuration[] = [];
    const shifts: Shift[] = [];

    shiftDurationRows.forEach(row => {
      const shiftDuration = new ShiftDuration(row.shiftId, row.validFrom, row.validTo, row.start, row.finish, row.hours, row.minutes);
      shiftDurations.push(shiftDuration);
    });

    shiftRows.forEach(row => {
      const durations = shiftDurations.filter(x => x.shiftId === row.id);
      const current = durations.filter(x => !x.validTo)[0] || null;
      const shift = new Shift(row.id, row.sign, row.isValid, durations, current);
      shifts.push(shift);
    });

    return shifts;
  }
}
