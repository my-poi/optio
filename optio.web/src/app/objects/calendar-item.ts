import * as moment from 'moment';

export class CalendarItem {
  name: string;
  value: number;
  isExpanded: boolean;
  parent?: CalendarItem;
  children?: CalendarItem[];

  constructor(name: string, value: number, isExpanded: boolean, parent?: CalendarItem, children?: CalendarItem[]) {
    this.name = name;
    this.value = value;
    this.isExpanded = isExpanded;
    this.parent = parent;
    this.children = children;
  }

  dateFrom(): Date {
    if (this.parent) return new Date(this.parent.value, this.value, 1);
    else return new Date(this.value, 0, 1);
  }

  dateTo(): Date {
    if (this.parent) return moment().year(this.parent.value).month(this.value).date(1).hours(0).minutes(0).seconds(0).add(1, 'M').toDate();
    else return new Date(this.value + 1, 0, 1);
  }
}
