import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { StructureTab } from './tabs/structure/structure.tab';
import { CompanyUnitTab } from './tabs/company-unit/company-unit.tab';
import { EmployeeTab } from './tabs/employee/employee.tab';
import { SchedulesTab } from './tabs/schedules/schedules.tab';
import { ScheduleTab } from './tabs/schedule/schedule.tab';
import { ShiftsModal } from './modals/shifts/shifts.modal';
import { BrowserService } from './services/browser.service';
import { DataService } from './services/data.service';
import { DisabledButtonsService } from './services/disabled-buttons.service';
import { GlobalService } from './services/global.service';
import { RibbonInfosService } from './services/ribbon-infos.service';
import { Http } from '@angular/http';
import { CompanyUnit } from './objects/company-unit';
import { Employee } from './objects/employee';

@Component({
  selector: 'app-root',
  providers: [
    BrowserService,
    DataService,
    DisabledButtonsService,
    GlobalService,
    RibbonInfosService
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(StructureTab) structureTab: StructureTab;
  @ViewChild(CompanyUnitTab) companyUnitTab: CompanyUnitTab;
  @ViewChild(EmployeeTab) employeeTab: EmployeeTab;
  @ViewChild(SchedulesTab) schedulesTab: SchedulesTab;
  @ViewChild(ScheduleTab) scheduleTab: ScheduleTab;
  @ViewChild(ShiftsModal) shiftsModal: ShiftsModal;
  contentHeight = window.innerHeight - 151;
  tabs;
  activeTabId = 1;

  constructor(private http: Http,
    private browserService: BrowserService,
    private dataService: DataService,
    private globalService: GlobalService) {
  }

  async ngOnInit() {
    await this.dataService.load();
    await this.http.get('assets/tabs.json').subscribe(res => this.tabs = res.json());
    this.browserService.detect();
  }

  tabChange() {
    console.log(this.activeTabId);
  }

  showTab(event) {
    this.tabs.forEach(x => { if (x.main) x.disabled = true; });
    const tab = this.tabs.find(x => x.name === event.tabName);
    tab.hidden = false;
    this.activeTabId = this.tabs.indexOf(tab) + 1;

    if (event.tabName === 'companyUnit') {
      if (event.isNew) {
        tab.title = 'Nowa komórka';
        this.companyUnitTab.load(new CompanyUnit, true);
      } else {
        tab.title = this.structureTab.selectedCompanyUnit.name;
        this.companyUnitTab.load(this.structureTab.selectedCompanyUnit, false);
      }
    }

    if (event.tabName === 'employee') {
      if (event.isNew) {
        tab.title = 'Nowy pracownik';
        this.employeeTab.load(new Employee, true);
      } else {
        tab.title = this.structureTab.selectedEmployee.fullName;
        this.employeeTab.load(this.structureTab.selectedEmployee, false);
      }
    }

    if (event.tabName === 'schedule') {
      tab.title = String.format('{0} - grafik na {1} {2}',
      this.schedulesTab.selectedSchedule.path,
      this.schedulesTab.selectedCalendarItem.name,
      this.schedulesTab.selectedCalendarItem.parent.name);
      this.scheduleTab.load();
    }
  }

  hideTab(event) {
    this.tabs.forEach(x => { if (x.main) x.disabled = false; });
    const tab = this.tabs.find(x => x.name === event.tabName);
    const parent = this.tabs.find(x => x.name === tab.parent);
    tab.hidden = true;
    this.activeTabId = parent.id;
  }

  showShifts() {
    this.shiftsModal.open();
  }
}
