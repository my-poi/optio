import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleRibbon } from './schedule.ribbon';

describe('ScheduleRibbon', () => {
  let component: ScheduleRibbon;
  let fixture: ComponentFixture<ScheduleRibbon>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleRibbon ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
