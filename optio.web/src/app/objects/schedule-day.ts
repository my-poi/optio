import { ScheduleDayError } from './schedule-day-error';

export interface ScheduleDay {
  d: Date;                  // dzień grafiku
  h: number | null;         // zaplanowane godziny
  m: number | null;         // zaplanowane minuty
  s: number | null;         // identyfikator zmiany
  x: string | null;         // symbol zmiany
  v: boolean;               // urlop
  c: string | null;         // komentarz do dnia grafiku
  e: ScheduleDayError[];    // błędy
  bt: number;               // tło pól czasu (godzin i minut)
  bx: number;               // tło pola zmiany
  ub: number;               // aktualizował (userId)
  u: Date;                  // data aktualizacji
}
