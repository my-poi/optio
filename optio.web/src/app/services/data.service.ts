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
import { Classification } from '../objects/classification';

@Injectable()
export class DataService {
  apiBaseUrl = 'https://optio.xyz/api/';
  companyUnits: CompanyUnit[];
  hierarchicalCompanyUnits: CompanyUnit[];
  employees: Employee[];
  companyUnitSchedules: CompanyUnitSchedule[];
  holidayTypes: HolidayType[];
  holidays: Holiday[];
  periodDefinitions: PeriodDefinition[];
  periods: Period[];
  shifts: Shift[];
  timeSheets: TimeSheet[];

  constructor(private http: Http) {
    this.load();
  }

  load() {
    this.http.get('assets/test-data/company-units.json').subscribe(response =>
      this.companyUnits = response.json());
    this.http.get('assets/test-data/employees.json').subscribe(response =>
      this.employees = response.json());
    this.http.get('assets/test-data/company-unit-schedules.json').subscribe(response =>
      this.companyUnitSchedules = response.json());
    this.http.get(this.apiBaseUrl + 'data/holiday-types/get-holiday-types').subscribe(response =>
      this.holidayTypes = response.json());
    this.http.get(this.apiBaseUrl + 'data/holidays/get-holidays').subscribe(response =>
      this.holidays = response.json());
    this.http.get(this.apiBaseUrl + 'data/period-definitions/get-period-definitions').subscribe(response =>
      this.periodDefinitions = response.json());
    this.http.get(this.apiBaseUrl + 'data/periods/get-periods').subscribe(response =>
      this.periods = response.json());
    this.http.get(this.apiBaseUrl + 'data/shifts/get-shifts').subscribe(response =>
      this.shifts = response.json());
    this.http.get('assets/test-data/time-sheets.json').subscribe(response =>
      this.timeSheets = response.json());
  }

  // const companyUnitRows: RowDataPacket[] = await this.organizationDatabase.execute(this.queries.dictionary['select-company-units'], []);
  
  //     const companyUnits: CompanyUnit[] = companyUnitRows.map(row => {
  //       return new CompanyUnit(
  //         row.id,
  //         row.parentId,
  //         row.sortOrder,
  //         row.name,
  //         row.sign,
  //         row.phone1,
  //         row.phone2,
  //         row.fax,
  //         row.email,
  //         row.isExpanded,
  //         row.isClassified,
  //         row.isScheduled,
  //         row.isPosition,
  //         row.isHidden,
  //         row.createdBy,
  //         row.created,
  //         row.updatedBy,
  //         row.updated,
  //         []);
  //     });
  
  getHierarchicalCompanyUnits(companyUnits: CompanyUnit[]) {
    
  }
}
