export class ShiftDuration {
  shiftId: number;
  validFrom: Date;
  validTo: Date;
  start: string;
  finish: string;
  hours: number;
  minutes: number;

  constructor(shiftId: number, validFrom: Date, validTo: Date, start: string, finish: string, hours: number, minutes: number) {
    this.shiftId = shiftId;
    this.validFrom = validFrom;
    this.validTo = validTo;
    this.start = start;
    this.finish = finish;
    this.hours = hours;
    this.minutes = minutes;
  }
}
