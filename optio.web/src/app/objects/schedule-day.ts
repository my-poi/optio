import { ScheduleDayError } from './schedule-day-error';

export interface ScheduleDay {
  d: Date;     // dzień grafiku
  h?: number;   // zaplanowane godziny
  m?: number;   // zaplanowane minuty
  s?: number;   // identyfikator zmiany
  x?: string;   // symbol zmiany
  v: boolean;  // urlop
  c: string;   // komentarz do dnia grafiku
  e: ScheduleDayError[];
  bt: number;  // tło pól czasu (godzin i minut)
  bx: number;  // tło pola zmiany
  ub: number;  // aktualizował (userId)
  u: Date;     // data aktualizacji
}
