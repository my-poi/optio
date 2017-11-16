import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  equals(x, y) {
    return JSON.stringify(x) === JSON.stringify(y);
  }

  isNullOrWhiteSpace(input) {
    return !input || !input.trim();
  }
}
