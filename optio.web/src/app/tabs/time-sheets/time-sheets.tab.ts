import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Http } from '@angular/http';
import { TimeSheet } from '../../objects/time-sheet';
import { TimeSheetEmployee } from '../../objects/time-sheet-employee';

@Component({
  selector: 'app-time-sheets-tab',
  templateUrl: './time-sheets.tab.html',
  styleUrls: ['./time-sheets.tab.css']
})
export class TimeSheetsTab {
  timeSheetEmployeesWidth = window.innerWidth - 450;
  timeSheetEmployeesHeight = window.innerHeight - 201;
  employeesHeight = window.innerHeight - 261;
  timeSheets: TimeSheet[];
  timeSheetEmployees: any[];
  otherEmployees: any[];
  selectedTimeSheet: TimeSheet;
  selectedEmployee: TimeSheetEmployee;

  constructor(public http: Http,
    public dataService: DataService) {
    this.timeSheets = dataService.timeSheets;
    this.selectedTimeSheet = this.timeSheets[0];
    this.loadEmployees();
  }

  loadEmployees() {
    this.http.get('assets/test-data/time-sheet-employees.json').subscribe(res => {
      this.timeSheetEmployees = res.json();
      this.selectedEmployee = this.timeSheetEmployees[0];
      const employeeIds = this.timeSheetEmployees.map(x => x.id);
      this.otherEmployees = this.dataService.employees.filter(employee =>
        employeeIds.every(id => id !== employee.id)).map(x =>
          new Object({id: x.id, fullName: x.fullName}));
    });
  }

  selectTimeSheet(timeSheet: TimeSheet) {
    this.selectedTimeSheet = timeSheet;
    // console.log(timeSheet);
  }

  selectEmployee(employee: TimeSheetEmployee) {
    this.selectedEmployee = employee;
    // console.log(employee);
  }

  dropTimeSheetEmployees(source: string, employeeId: number) {
    console.log(String.format('dropTimeSheet source: {0}, employee {1}', source, employeeId));
  }

  dropOtherEmployees(source: string, employeeId: number) {
    console.log(String.format('dropOther source: {0}, employee {1}', source, employeeId));
  }
}
