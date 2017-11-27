import { Queries } from '../queries';
import { WorkTimeDatabase } from '../databases/work-time.database';
import { Shift } from '../objects/shift';
import { ShiftDuration } from '../objects/shift-duration';

export class ShiftsMethods {
  constructor(private queries: Queries, private workTimeDatabase: WorkTimeDatabase) { }

  async getShifts() {
    const shiftsData = await this.workTimeDatabase.execute(this.queries.dictionary['select-shifts'], []);
    const shiftDurationsData = await this.workTimeDatabase.execute(this.queries.dictionary['select-shift-durations'], []);
    const shiftDurations: ShiftDuration[] = [];
    const result: Shift[] = [];

    shiftDurationsData.forEach(row => {
      const shiftDuration = new ShiftDuration(row.shiftId, row.validFrom, row.start, row.finish, row.hours, row.minutes, row.validTo);
      shiftDurations.push(shiftDuration);
    });

    shiftsData.forEach(row => {
      const durations = shiftDurations.filter(x => x.shiftId === row.id);
      const current = durations.filter(x => !x.validTo)[0] || null;
      const shift = new Shift(row.id, row.sign, row.isValid, durations, current);
      result.push(shift);
    });

    return result;
  }
}
