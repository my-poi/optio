import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-employee-ribbon',
  templateUrl: './employee.ribbon.html',
  styleUrls: ['./employee.ribbon.css']
})
export class EmployeeRibbon {
  @Output() validateDataEvent = new EventEmitter<any>();
  @Output() hideTabEvent = new EventEmitter<any>();

  validateData(tabName: string) {
    this.validateDataEvent.emit({tabName});
  }

  hideTab(tabName: string) {
    this.hideTabEvent.emit({tabName});
  }
}
