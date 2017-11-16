import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-company-unit-ribbon',
  templateUrl: './company-unit.ribbon.html',
  styleUrls: ['./company-unit.ribbon.css']
})
export class CompanyUnitRibbon {
  @Output() validateDataEvent = new EventEmitter<any>();
  @Output() hideTabEvent = new EventEmitter<any>();

  validateData(tabName: string) {
    this.validateDataEvent.emit({tabName});
  }

  hideTab(tabName: string) {
    this.hideTabEvent.emit({tabName});
  }
}
