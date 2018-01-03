import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  equals(x: any, y: any) {
    return JSON.stringify(x) === JSON.stringify(y);
  }

  isNullOrWhiteSpace(input: any) {
    return !input || !input.trim();
  }

  compare(a: any, b: any) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
}
