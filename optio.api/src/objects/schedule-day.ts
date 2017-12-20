import { ScheduleDayError } from './schedule-day-error';

export class ScheduleDay {
  d: Date;     // dzień grafiku
  h: number;   // zaplanowane godziny
  m: number;   // zaplanowane minuty
  s: number;   // identyfikator zmiany
  x: string;   // symbol zmiany
  v: boolean;  // urlop
  c: string;   // komentarz do dnia grafiku
  e: ScheduleDayError[];
  bt: number;  // tło pól czasu (godzin i minut)
  bx: number;  // tło pola zmiany
  bw: number;  // tło tygodni
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
    errors: ScheduleDayError[],
    timeBackground: number,
    shiftBackground: number,
    weekBackground: number,
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
      this.bw = weekBackground;
      this.ub = updatedBy;
      this.u = updated;
  }
}
