import * as fs from 'fs';
import * as path from 'path';

export class Queries {
  dictionary: { [key: string]: string } = {};

  constructor()  {
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
