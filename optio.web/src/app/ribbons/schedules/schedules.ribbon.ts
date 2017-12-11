import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonsService } from '../../services/buttons.service';
import { InfosService } from '../../services/infos.service';

@Component({
  selector: 'app-schedules-ribbon',
  templateUrl: './schedules.ribbon.html',
  styleUrls: ['./schedules.ribbon.css']
})
export class SchedulesRibbon {
  @Output() showTabEvent = new EventEmitter<any>();
  @Output() showShiftsEvent = new EventEmitter();

  constructor(public buttonsService: ButtonsService,
    public infosService: InfosService) { }

  showTab(tabName: string, isNew: boolean) {
    this.showTabEvent.emit({tabName, isNew});
  }

  showShifts() {
    this.showShiftsEvent.emit();
  }
}
