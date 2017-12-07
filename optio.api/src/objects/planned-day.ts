export class PlannedDay {
  d: Date;     // dzień grafiku
  h: number;   // zaplanowane godziny
  m: number;   // zaplanowane minuty
  s: number;   // identyfikator zmiany
  x: string;   // symbol zmiany
  v: boolean;  // urlop
  c: string;   // komentarz do dnia grafiku
  bt: number;  // tło pól czasu (godzin i minut)
  bx: number;  // tło pola zmiany
  ub: number;  // aktualizował (userId)
  u: Date;     // data aktualizacji

  constructor(
    day: Date,
    plannedHours: number,
    plannedMinutes: number,
    shiftId: number,
    shiftSign: string,
    isVacation: boolean,
    comment: string,
    timeBackground: number,
    shiftBackground: number,
    updatedBy: number,
    updated: Date) {
      this.d = day;
      this.h = plannedHours;
      this.m = plannedMinutes;
      this.s = shiftId;
      this.x = shiftSign;
      this.v = isVacation;
      this.c = comment;
      this.bt = timeBackground;
      this.bx = shiftBackground;
      this.ub = updatedBy;
      this.u = updated;
  }
}
