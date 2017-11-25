import * as fs from 'fs';
import * as path from 'path';
import { Query } from './objects/query';

export class Queries {
  dictionary: { [key: string]: string } = {};

  constructor() { this.load(); }

  load() {
    const queryNames = [
      'select-shifts',
      'select-shift-durations'
    ];

    queryNames.forEach(queryName => {
      const sql = fs.readFileSync(path.join(__dirname, 'sql/', queryName + '.sql'), 'utf8');
      this.dictionary[queryName] = sql;
    });
  }
}
