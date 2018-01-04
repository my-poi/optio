export class PlannedDay {
  employeeId: number;
  day: Date;
  hours: number | null;
  minutes: number | null;
  shiftId: number | null;
  comment: string | null;
  updatedBy: number;
  updated: Date;

  constructor(
    employeeId: number,
    day: Date,
    hours: number | null,
    minutes: number | null,
    shiftId: number | null,
    comment: string | null,
    updatedBy: number,
    updated: Date) {
      this.employeeId = employeeId;
      this.day = day;
      this.hours = hours;
      this.minutes = minutes;
      this.shiftId = shiftId;
      this.comment = comment;
      this.updatedBy = updatedBy;
      this.updated = updated;
  }
}
