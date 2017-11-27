export interface ScheduleDay {
  d: Date;     // dzień grafiku
  t: string;   // zaplanowany czas
  h: string;   // zaplanowane godziny
  m: string;   // zaplanowane minuty
  s: number;   // identyfikator zmiany
  x: string;   // symbol zmiany
  v: boolean;  // urlop
  c: string;   // komentarz do dnia grafiku
  bt: number;  // tło pól czasu (godzin i minut)
  bx: number;  // tło pola zmiany
  ub: number;  // aktualizował (userId)
  u: Date;     // data aktualizacji
}
