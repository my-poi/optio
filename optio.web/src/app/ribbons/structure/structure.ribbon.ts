import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonsService } from '../../services/buttons.service';
import { InfosService } from '../../services/infos.service';

@Component({
  selector: 'app-structure-ribbon',
  templateUrl: './structure.ribbon.html',
  styleUrls: ['./structure.ribbon.css']
})
export class StructureRibbon {
  @Output() showTabEvent = new EventEmitter<any>();

  constructor(public buttonsService: ButtonsService,
    public infosService: InfosService) {}

  showTab(tabName: string, isNew: boolean) {
    this.showTabEvent.emit({tabName, isNew});
  }
}
