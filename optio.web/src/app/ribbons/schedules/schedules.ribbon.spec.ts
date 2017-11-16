import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesRibbon } from './schedules.ribbon';

describe('SchedulesRibbon', () => {
  let component: SchedulesRibbon;
  let fixture: ComponentFixture<SchedulesRibbon>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulesRibbon ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
