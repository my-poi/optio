import * as fs from 'fs';
import * as path from 'path';

export const queries: { [key: string]: string } = {};
const queryNames = [
  'insert-planned-days',
  'insert-schedules',
  'insert-worked-days',
  'select-classifications',
  'select-company-unit-schedules',
  'select-company-units',
  'select-employee-schedules',
  'select-employees-by-id',
  'select-employees',
  'select-holiday-types',
  'select-holidays',
  'select-period-definitions',
  'select-periods',
  'select-planned-days',
  'select-schedules',
  'select-shift-durations',
  'select-shifts',
  'select-vacations-by-employee',
  'select-vacations',
  'update-planned-day',
  'update-schedule'
];

queryNames.forEach(queryName => {
  const sql = fs.readFileSync(path.join(__dirname, 'sql/', queryName + '.sql'), 'utf8');
  queries[queryName] = sql;
});
