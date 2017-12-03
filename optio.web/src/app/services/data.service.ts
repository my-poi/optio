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
  companyUnits: CompanyUnit[] = [];
  hierarchicalCompanyUnits: CompanyUnit[] = [];
  employees: Employee[] = [];
  companyUnitSchedules: CompanyUnitSchedule[] = [];
  holidayTypes: HolidayType[] = [];
  holidays: Holiday[] = [];
  periodDefinitions: PeriodDefinition[] = [];
  periods: Period[] = [];
  shifts: Shift[] = [];
  timeSheets: TimeSheet[] = [];

  constructor(private http: Http) { }

  async load() {
    await this.http.get(this.apiBaseUrl + 'data/company-units/get-company-units').subscribe(response => {
      this.companyUnits = response.json();
      this.setHierarchicalCompanyUnits();
    });
    await this.http.get(this.apiBaseUrl + 'data/employees/get-employees').subscribe(response => {
      this.employees = response.json();
      this.setAdditionalEmployeesData();
    });
    await this.http.get('assets/test-data/company-unit-schedules.json').subscribe(response =>
      this.companyUnitSchedules = response.json());
    await this.http.get(this.apiBaseUrl + 'data/holiday-types/get-holiday-types').subscribe(response =>
      this.holidayTypes = response.json());
    await this.http.get(this.apiBaseUrl + 'data/holidays/get-holidays').subscribe(response =>
      this.holidays = response.json());
    await this.http.get(this.apiBaseUrl + 'data/period-definitions/get-period-definitions').subscribe(response =>
      this.periodDefinitions = response.json());
    await this.http.get(this.apiBaseUrl + 'data/periods/get-periods').subscribe(response =>
      this.periods = response.json());
    await this.http.get(this.apiBaseUrl + 'data/shifts/get-shifts').subscribe(response =>
      this.shifts = response.json());
    await this.http.get('assets/test-data/time-sheets.json').subscribe(response =>
      this.timeSheets = response.json());
  }

  setHierarchicalCompanyUnits() {
    const companyUnits = this.companyUnits.filter(x => !x.isHidden);
    const root = companyUnits[0];
    const allEmployees = new CompanyUnit();

    this.setChildren(root, companyUnits);
    allEmployees.id = 0;
    allEmployees.name = 'Wszyscy pracownicy';
    this.hierarchicalCompanyUnits.push(root);
    this.hierarchicalCompanyUnits.push(allEmployees);
  }

  setChildren(parent: CompanyUnit, companyUnits: CompanyUnit[]) {
    const children = companyUnits.filter(x => parent !== null && x.parentId === parent.id);
    parent.children = children;
    children.forEach(x => this.setChildren(x, companyUnits));
  }

  setAdditionalEmployeesData() {
    this.employees.forEach(employee => {
      if (employee.classifications.length > 0)
        employee.companyUnitId = employee.classifications.find(x => !x.validTo).companyUnitId;
      else employee.companyUnitId = 0;
      employee.fullName = String.format('{0} {1}', employee.lastName, employee.firstName);
    });
  }
}
