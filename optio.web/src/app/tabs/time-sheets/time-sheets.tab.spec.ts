import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetsTab } from './time-sheets.tab';

describe('TimeSheetsTab', () => {
  let component: TimeSheetsTab;
  let fixture: ComponentFixture<TimeSheetsTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetsTab ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
