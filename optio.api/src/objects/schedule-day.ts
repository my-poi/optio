import { ScheduleDayError } from './schedule-day-error';

export class ScheduleDay {
  d: Date;                 // dzień grafiku
  h: number | null;        // zaplanowane godziny
  m: number | null;        // zaplanowane minuty
  s: number | null;        // identyfikator zmiany
  x: string | null;        // symbol zmiany
  v: boolean;              // urlop
  c: string;               // komentarz do dnia grafiku
  e: ScheduleDayError[];   // błędy
  bt: number;              // tło pól czasu (godzin i minut)
  bx: number;              // tło pola zmiany
  ub: number;              // aktualizował (userId)
  u: Date;                 // data aktualizacji

  constructor(
    day: Date,
    plannedHours: number | null,
    plannedMinutes: number | null,
    shiftId: number | null,
    shiftSign: string | null,
    isVacation: boolean,
    comment: string,
    errors: ScheduleDayError[],
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
      this.e = errors;
      this.bt = timeBackground;
      this.bx = shiftBackground;
      this.ub = updatedBy;
      this.u = updated;
  }
}
