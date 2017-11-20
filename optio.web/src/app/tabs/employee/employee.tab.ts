import { Component, Output, EventEmitter } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { Employee } from '../../objects/employee';

@Component({
  selector: 'app-employee-tab',
  templateUrl: './employee.tab.html',
  styleUrls: ['./employee.tab.css']
})
export class EmployeeTab {
  @Output() hideTabEvent = new EventEmitter<any>();
  original: Employee;
  edited = new Employee();
  isNew: boolean;
  validateMessage: string;

  constructor(private globalService: GlobalService) {}

  load(employee: Employee, isNew: boolean) {
    this.original = employee;
    this.edited = JSON.parse(JSON.stringify(employee));
    this.isNew = isNew;
    this.validateMessage = '';
  }

  validate() {
    if (!this.globalService.equals(this.original, this.edited)) {
      if (!this.validateData()) return;
      if (!this.isNew) {
        this.original.firstName = this.edited.firstName;
        this.original.lastName = this.edited.lastName;
        this.original.phone1 = this.edited.phone1;
        this.original.phone2 = this.edited.phone2;
        this.original.email = this.edited.email;
        console.log('save');
      }

      if (this.isNew) {
        this.edited.id = 44;
        this.edited.fullName = this.edited.lastName + ' ' + this.edited.firstName;
        console.log('add new');
      }

      this.hideTabEvent.emit({tabName: 'employee'});
    } else {
      console.log('only close');
      this.hideTabEvent.emit({tabName: 'employee'});
    }
  }

  validateData() {
    this.validateMessage = '';
    if (this.globalService.isNullOrWhiteSpace(this.edited.lastName)) this.validateMessage += 'Nazwisko - pole jest wymagane.\n';
    if (this.globalService.isNullOrWhiteSpace(this.edited.firstName)) this.validateMessage += 'Imię - pole jest wymagane.\n';
    return !this.validateMessage;
  }
}
