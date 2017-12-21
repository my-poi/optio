export class ScheduleHeaderDay {
  d: Date;     // dzień grafiku
  bw: number;  // tło tygodni
  bd: number;  // tło dni

  constructor(d: Date, weekBackground: number, dayBackground: number) {
    this.d = d;
    this.bw = weekBackground;
    this.bd = dayBackground;
  }
}
