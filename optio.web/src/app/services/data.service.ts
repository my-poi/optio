import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { config } from '../config';
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
import { EmployeeSchedule } from '../objects/employee-schedule';

@Injectable()
export class DataService {
  companyUnits: CompanyUnit[];
  hierarchicalCompanyUnits: CompanyUnit[] = [];
  employees: Employee[];
  schedules: CompanyUnitSchedule[];
  holidayTypes: HolidayType[];
  holidays: Holiday[];
  periodDefinitions: PeriodDefinition[];
  periods: Period[];
  shifts: Shift[];
  timeSheets: TimeSheet[];

  constructor(private http: Http) { }

  getOptions() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('token', sessionStorage.token);
    return { headers: headers };
  }

  loadStartData(callback) {
    // do usunięcia!
    this.http.get('assets/test-data/time-sheets.json', this.getOptions()).subscribe(response =>
      this.timeSheets = response.json());

    this.http.get(config.apiBaseUrl + 'data/start/get-start-data', this.getOptions()).subscribe(response => {
      const results = response.json();
      this.companyUnits = results.companyUnits;
      this.setHierarchicalCompanyUnits();
      this.employees = results.employees;
      this.setAdditionalEmployeesData();
      this.holidayTypes = results.holidayTypes;
      this.holidays = results.holidays;
      this.periodDefinitions = results.periodDefinitions;
      this.periods = results.periods;
      this.shifts = results.shifts;
      callback();
    });
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

  loadSchedules(year: number, month: number, callback) {
    this.http.get(config.apiBaseUrl + `data/schedules/get-schedules/${year}/${month}`, this.getOptions()).subscribe(response => {
      this.schedules = response.json();
      callback();
    });
  }

  loadSchedule(companyUnitId: number, year: number, month: number, callback: any) {
    this.http.get(config.apiBaseUrl + `data/schedules/get-schedule/${companyUnitId}/${year}/${month}`,
      this.getOptions()).subscribe(response => callback(response.json()));
  }

  updateSchedule(schedule: EmployeeSchedule, callback) {
    const body = { schedule: JSON.stringify(schedule) };
    this.http.put(config.apiBaseUrl + 'data/schedules/update-schedule', body, this.getOptions()).subscribe(response => {
      callback(response);
    });
  }
}
