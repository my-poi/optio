import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTab } from './schedule.tab';

describe('ScheduleTab', () => {
  let component: ScheduleTab;
  let fixture: ComponentFixture<ScheduleTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleTab ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
