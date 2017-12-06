import * as fs from 'fs';
import * as path from 'path';

export const queries: { [key: string]: string } = {};
const queryNames = [
  'insert-planned-day',
  'insert-schedule',
  'insert-worked-day',
  'select-classifications',
  'select-company-units',
  'select-employees',
  'select-holiday-types',
  'select-holidays',
  'select-period-definitions',
  'select-periods',
  'select-shift-durations',
  'select-shifts'
];

queryNames.forEach(queryName => {
  const sql = fs.readFileSync(path.join(__dirname, 'sql/', queryName + '.sql'), 'utf8');
  queries[queryName] = sql;
});
