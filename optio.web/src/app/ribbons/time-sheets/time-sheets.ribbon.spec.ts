import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetsRibbon } from './time-sheets.ribbon';

describe('TimeSheetsRibbon', () => {
  let component: TimeSheetsRibbon;
  let fixture: ComponentFixture<TimeSheetsRibbon>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetsRibbon ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetsRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
