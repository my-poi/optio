import { Component } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { DataService } from '../../services/data.service';
import { ButtonsService } from '../../services/buttons.service';
import { InfosService } from '../../services/infos.service';
import { CalendarItem } from '../../objects/calendar-item';
import { CompanyUnitSchedule } from '../../objects/company-unit-schedule';

@Component({
  selector: 'app-schedules-tab',
  templateUrl: './schedules.tab.html',
  styleUrls: ['./schedules.tab.css'],
  providers: [CalendarService]
})
export class SchedulesTab {
  calendarHeight = window.innerHeight - 201;
  schedulesTableWidth = window.innerWidth - 212;
  schedulesTableBodyHeight = window.innerHeight - 279;
  calendarOptions = {allowDrop: false};
  foundSchedules: CompanyUnitSchedule[];
  schedulesFilter = '';
  selectedCalendarItem: CalendarItem;
  selectedSchedule?: CompanyUnitSchedule;

  constructor(public calendarService: CalendarService,
    private dataService: DataService,
    private buttonsService: ButtonsService,
    private infosService: InfosService) {}

  onInitialized(tree: any) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentRoot = tree.treeModel.roots.find((x: any) => x.data.value === currentYear);
    const currentChild = currentRoot.children.find((x: any) => x.data.value === currentMonth + 1);
    currentChild.toggleActivated();
  }

  onActivate(node: any) {
    this.schedulesFilter = '';
    this.selectedCalendarItem = node.data;
    this.deselectSchedule();
    this.loadSchedules();
    this.infosService.schedulesInfo = '';
  }

  loadSchedules() {
    if (this.selectedCalendarItem.parent) {
      const year = this.selectedCalendarItem.parent.value;
      const month = this.selectedCalendarItem.value;
      this.dataService.loadSchedules(year, month, () => {
        this.foundSchedules = this.dataService.schedules;
        if (this.foundSchedules.length > 0) this.selectSchedule(this.foundSchedules[0]);
        else this.selectedSchedule = undefined;
        this.buttonsService.schedulesAdd = false;
        this.buttonsService.schedulesEdit = !this.selectedSchedule;
        this.buttonsService.schedulesLock = !this.selectedSchedule;
      });
    } else {
      this.buttonsService.schedulesAdd = true;
      this.buttonsService.schedulesEdit = true;
      this.buttonsService.schedulesLock = true;
      this.foundSchedules = [];
    }
  }

  filterSchedules() {
    const result = this.dataService.schedules.filter(x => {
      if (x.companyUnitPath.toLowerCase().indexOf(this.schedulesFilter.toLocaleLowerCase()) >= 0) return true;
      return false;
    });

    this.foundSchedules = result.slice();
    this.deselectSchedule();
    if (this.foundSchedules.length > 0) this.selectSchedule(this.foundSchedules[0]);
    else this.selectedSchedule = undefined;
    this.buttonsService.schedulesEdit = !this.selectedSchedule;
    this.buttonsService.schedulesLock = !this.selectedSchedule;
  }

  selectSchedule(schedule: CompanyUnitSchedule) {
    if (!this.selectedSchedule) this.selectedSchedule = new CompanyUnitSchedule();
    this.deselectSchedule();
    this.selectedSchedule = schedule;
    this.selectedSchedule.isSelected = true;
  }

  deselectSchedule() {
    if (this.selectedSchedule) this.selectedSchedule.isSelected = false;
  }
}
