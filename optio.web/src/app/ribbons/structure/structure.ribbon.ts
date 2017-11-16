import { Component, Output, EventEmitter } from '@angular/core';
import { DisabledButtonsService } from '../../services/disabled-buttons.service';
import { RibbonInfosService } from '../../services/ribbon-infos.service';

@Component({
  selector: 'app-structure-ribbon',
  templateUrl: './structure.ribbon.html',
  styleUrls: ['./structure.ribbon.css']
})
export class StructureRibbon {
  @Output() showTabEvent = new EventEmitter<any>();

  constructor(public disabledButtonsService: DisabledButtonsService,
    public ribbonInfosService: RibbonInfosService) {}

  showTab(tabName: string, isNew: boolean) {
    this.showTabEvent.emit({tabName, isNew});
  }
}
