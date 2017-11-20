import { Component } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { DataService } from '../../services/data.service';
import { DisabledButtonsService } from '../../services/disabled-buttons.service';
import { RibbonInfosService } from '../../services/ribbon-infos.service';
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
  selectedSchedule: CompanyUnitSchedule;

  constructor(public calendarService: CalendarService,
    private dataService: DataService,
    private disabledButtonsService: DisabledButtonsService,
    private ribbonInfosService: RibbonInfosService) {}

  onInitialized(tree) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentRoot = tree.treeModel.roots.filter(x => x.data.value === currentYear)[0];
    const currentChild = currentRoot.children.filter(x => x.data.value === currentMonth)[0];
    currentChild.toggleActivated();
  }

  onActivate(node) {
    this.schedulesFilter = '';
    this.deselectSchedule();
    this.loadSchedules();
    this.selectedCalendarItem = node.data;
    const info = node.data.dateFrom() + '\n' + node.data.dateTo() + '\n' + node.data.name;
    this.ribbonInfosService.schedulesInfo = info;
  }

  loadSchedules() {
    this.foundSchedules = this.dataService.companyUnitSchedules;
    if (this.foundSchedules.length > 0) this.selectSchedule(this.foundSchedules[0]);
    else this.selectedSchedule = null;
    this.disabledButtonsService.scheduleEdit = !this.selectedSchedule;
  }

  filterSchedules() {
    const result = this.dataService.companyUnitSchedules.filter(x => {
      if (x.path.toLowerCase().indexOf(this.schedulesFilter.toLocaleLowerCase()) >= 0) return true;
      return false;
    });

    this.foundSchedules = result.slice();
    this.deselectSchedule();
    if (this.foundSchedules.length > 0) this.selectSchedule(this.foundSchedules[0]);
    else this.selectedSchedule = null;
    this.disabledButtonsService.scheduleEdit = !this.selectedSchedule;
  }

  selectSchedule(schedule) {
    if (!this.selectedSchedule) this.selectedSchedule = new CompanyUnitSchedule();
    this.deselectSchedule();
    this.selectedSchedule = schedule;
    this.selectedSchedule.isSelected = true;
  }

  deselectSchedule() {
    if (this.selectedSchedule) this.selectedSchedule.isSelected = false;
  }
}
