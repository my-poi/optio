import { Injectable } from '@angular/core';
import { CalendarItem } from '../objects/calendar-item';

@Injectable()
export class CalendarService {
  items: CalendarItem[];

  constructor() {
    const monthNames = [
      'styczeń', 'luty', 'marzec',
      'kwiecień', 'maj', 'czerwiec',
      'lipiec', 'sierpień', 'wrzesień',
      'październik', 'listopad', 'grudzień'
    ];
    const currentYear = new Date().getFullYear();
    this.items = new Array<CalendarItem>();
    for (let y = 2016; y <= currentYear + 1; y++) {
      const year = new CalendarItem(y.toString(), y, y === currentYear, undefined, undefined);
      year.children  = new Array<CalendarItem>();
      for (let m = 1; m <= 12; m++) {
        const month = new CalendarItem(monthNames[m - 1], m, false, year, undefined);
        year.children.push(month);
      }
      this.items.push(year);
    }
  }
}
