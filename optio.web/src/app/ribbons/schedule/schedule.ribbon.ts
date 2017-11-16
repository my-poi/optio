import { Component, Output, EventEmitter } from '@angular/core';
import { DisabledButtonsService } from '../../services/disabled-buttons.service';
import { RibbonInfosService } from '../../services/ribbon-infos.service';

@Component({
  selector: 'app-schedule-ribbon',
  templateUrl: './schedule.ribbon.html',
  styleUrls: ['./schedule.ribbon.css']
})
export class ScheduleRibbon {
  @Output() validateDataEvent = new EventEmitter<any>();
  @Output() employeeScheduleMoveUpEvent = new EventEmitter<any>();
  @Output() employeeScheduleMoveDownEvent = new EventEmitter<any>();

  constructor(public disabledButtonsService: DisabledButtonsService,
    public ribbonInfosService: RibbonInfosService) {}

  validateData(tabName: string) {
    this.validateDataEvent.emit({tabName});
  }

  employeeScheduleMoveUp() {
    this.employeeScheduleMoveUpEvent.emit();
  }

  employeeScheduleMoveDown() {
    this.employeeScheduleMoveDownEvent.emit();
  }
}
