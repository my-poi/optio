import { Component, Output, EventEmitter } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CompanyUnit } from '../../objects/company-unit';

@Component({
  selector: 'app-company-unit-tab',
  templateUrl: './company-unit.tab.html',
  styleUrls: ['./company-unit.tab.css']
})
export class CompanyUnitTab {
  @Output() hideTabEvent = new EventEmitter<any>();
  original: CompanyUnit;
  edited = new CompanyUnit();
  isNew: boolean;
  validateMessage: string;

  constructor(public globalService: GlobalService) {}

  load(companyUnit: CompanyUnit, isNew: boolean) {
    this.original = companyUnit;
    this.edited = JSON.parse(JSON.stringify(companyUnit));
    this.isNew = isNew;
    this.validateMessage = '';
  }

  validate() {
    if (!this.globalService.equals(this.original, this.edited)) {
      if (!this.validateData()) return;
      if (!this.isNew) {
        this.original.name = this.edited.name;
        this.original.sign = this.edited.sign;
        this.original.phone1 = this.edited.phone1;
        this.original.phone2 = this.edited.phone2;
        this.original.fax = this.edited.fax;
        this.original.email = this.edited.email;
        this.original.isClassified = this.edited.isClassified;
        this.original.isScheduled = this.edited.isScheduled;
        this.original.isPosition = this.edited.isPosition;
        console.log('save');
      }

      if (this.isNew) {
        this.edited.id = 44;
        console.log('add new');
      }

      this.hideTabEvent.emit({tabName: 'companyUnit'});
    } else {
      console.log('only close');
      this.hideTabEvent.emit({tabName: 'companyUnit'});
    }
  }

  validateData() {
    this.validateMessage = '';
    if (this.globalService.isNullOrWhiteSpace(this.edited.name)) this.validateMessage += 'Nazwa - pole jest wymagane.\n';
    return !this.validateMessage;
  }
}
