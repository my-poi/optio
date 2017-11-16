import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from './modules/modal/modal.module';
import { NgbTabsetModule } from './modules/tabset/tabset.module';
import { TreeModule } from 'angular-tree-component';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { AppComponent } from './app.component';

// Extensions
import './extensions/array';
import './extensions/string';

// Directives
import { DraggableDirective } from './directives/draggable.directive';
import { DroppableDirective } from './directives/droppable.directive';

// Ribbons
import { CompanyUnitRibbon } from './ribbons/company-unit/company-unit.ribbon';
import { EmployeeRibbon } from './ribbons/employee/employee.ribbon';
import { ScheduleRibbon } from './ribbons/schedule/schedule.ribbon';
import { SchedulesRibbon } from './ribbons/schedules/schedules.ribbon';
import { StructureRibbon } from './ribbons/structure/structure.ribbon';
import { TimeCardsRibbon } from './ribbons/time-cards/time-cards.ribbon';
import { TimeSheetsRibbon } from './ribbons/time-sheets/time-sheets.ribbon';
import { VacationsRibbon } from './ribbons/vacations/vacations.ribbon';

// Tabs
import { CompanyUnitTab } from './tabs/company-unit/company-unit.tab';
import { EmployeeTab } from './tabs/employee/employee.tab';
import { ScheduleTab } from './tabs/schedule/schedule.tab';
import { SchedulesTab } from './tabs/schedules/schedules.tab';
import { StructureTab } from './tabs/structure/structure.tab';
import { TimeCardsTab } from './tabs/time-cards/time-cards.tab';
import { TimeSheetsTab } from './tabs/time-sheets/time-sheets.tab';
import { VacationsTab } from './tabs/vacations/vacations.tab';

// Modals
import { PeriodsModal } from './modals/periods/periods.modal';
import { ShiftsModal } from './modals/shifts/shifts.modal';
import { SplashModal } from './modals/splash/splash.modal';

@NgModule({
  declarations: [
    AppComponent,
    DraggableDirective,
    DroppableDirective,
    CompanyUnitRibbon,
    EmployeeRibbon,
    ScheduleRibbon,
    SchedulesRibbon,
    StructureRibbon,
    TimeCardsRibbon,
    TimeSheetsRibbon,
    VacationsRibbon,
    CompanyUnitTab,
    EmployeeTab,
    ScheduleTab,
    SchedulesTab,
    StructureTab,
    TimeCardsTab,
    TimeSheetsTab,
    VacationsTab,
    PeriodsModal,
    ShiftsModal,
    SplashModal
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    NgbModalModule.forRoot(),
    NgbTabsetModule.forRoot(),
    TreeModule,
    NgxDnDModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
