import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CompanyUnit } from '../objects/company-unit';
import { Employee } from '../objects/employee';
import { HolidayType } from '../objects/holiday-type';
import { Holiday } from '../objects/holiday';
import { CompanyUnitSchedule } from '../objects/company-unit-schedule';
import { PeriodDefinition } from '../objects/period-definition';
import { Period } from '../objects/period';
import { Shift } from '../objects/shift';
import { TimeSheet } from '../objects/time-sheet';

@Injectable()
export class DataService {
  companyUnits: CompanyUnit[];
  employees: Employee[];
  companyUnitSchedules: CompanyUnitSchedule[];
  holidayTypes: HolidayType[];
  holidays: Holiday[];
  periodDefinitions: PeriodDefinition[];
  periods: Period[];
  shifts: Shift[];
  timeSheets: TimeSheet[];

  constructor(private http: Http) {
    this.http.get('assets/test-data/company-units.json').subscribe(res => this.companyUnits = res.json());
    this.http.get('assets/test-data/employees.json').subscribe(res => this.employees = res.json());
    this.http.get('assets/test-data/company-unit-schedules.json').subscribe(res => this.companyUnitSchedules = res.json());
    this.http.get('https://optio.xyz/api/data/holiday-types/get-holiday-types').subscribe(res => this.holidayTypes = res.json());
    this.http.get('https://optio.xyz/api/data/holidays/get-holidays').subscribe(res => this.holidays = res.json());
    this.http.get('https://optio.xyz/api/data/period-definitions/get-period-definitions').subscribe(res => this.periodDefinitions = res.json());
    this.http.get('https://optio.xyz/api/data/periods/get-periods').subscribe(res => this.periods = res.json());
    this.http.get('https://optio.xyz/api/data/shifts/get-shifts').subscribe(res => this.shifts = res.json());
    this.http.get('assets/test-data/time-sheets.json').subscribe(res => this.timeSheets = res.json());
  }
}
