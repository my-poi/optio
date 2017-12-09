import { Component, Output, EventEmitter } from '@angular/core';
import { ButtonsService } from '../../services/buttons.service';
import { RibbonInfosService } from '../../services/ribbon-infos.service';

@Component({
  selector: 'app-structure-ribbon',
  templateUrl: './structure.ribbon.html',
  styleUrls: ['./structure.ribbon.css']
})
export class StructureRibbon {
  @Output() showTabEvent = new EventEmitter<any>();

  constructor(public buttonsService: ButtonsService,
    public ribbonInfosService: RibbonInfosService) {}

  showTab(tabName: string, isNew: boolean) {
    this.showTabEvent.emit({tabName, isNew});
  }
}
