import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  equals(x, y) {
    return JSON.stringify(x) === JSON.stringify(y);
  }

  isNullOrWhiteSpace(input) {
    return !input || !input.trim();
  }

  compare(a: any, b: any) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
}
