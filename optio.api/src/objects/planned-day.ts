export class PlannedDay {
  employeeId: number;
  day: Date;
  hours: number;
  minutes: number;
  shiftId: number;
  comments: string;
  updatedBy: number;
  updated: Date;

  constructor(
    employeeId: number,
    day: Date,
    hours: number,
    minutes: number,
    shiftId: number,
    comments: string,
    updatedBy: number,
    updated: Date) {
      this.employeeId = employeeId;
      this.day = day;
      this.hours = hours;
      this.minutes = minutes;
      this.shiftId = shiftId;
      this.comments = comments;
      this.updatedBy = updatedBy;
      this.updated = updated;
  }
}
