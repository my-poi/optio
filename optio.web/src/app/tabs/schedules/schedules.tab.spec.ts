import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesTab } from './schedules.tab';

describe('SchedulesTab', () => {
  let component: SchedulesTab;
  let fixture: ComponentFixture<SchedulesTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulesTab ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
