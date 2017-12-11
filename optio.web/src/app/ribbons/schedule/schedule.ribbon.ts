import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonsService } from '../../services/buttons.service';
import { InfosService } from '../../services/infos.service';

@Component({
  selector: 'app-schedule-ribbon',
  templateUrl: './schedule.ribbon.html',
  styleUrls: ['./schedule.ribbon.css']
})
export class ScheduleRibbon {
  @Output() validateDataEvent = new EventEmitter<any>();
  @Output() employeeScheduleMoveUpEvent = new EventEmitter<any>();
  @Output() employeeScheduleMoveDownEvent = new EventEmitter<any>();

  constructor(public buttonsService: ButtonsService,
    public infosService: InfosService) {}

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
