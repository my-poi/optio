import * as fs from 'fs';
import * as path from 'path';
import { Query } from './objects/query';

export class Queries {
  list: Query[] = [];

  generate() {
    const queries = [
      'select-shifts',
      'select-shift-durations'
    ]
    
    queries.forEach(queryName => {
      const sql = fs.readFileSync(path.join(__dirname, 'sql/', queryName + '.sql'), 'utf8');
      this.list.push(new Query(queryName, sql));
    });
  }

  getSql(name: string) {
    return this.list.filter(query => query.name === name)[0].sql;
  }
}
