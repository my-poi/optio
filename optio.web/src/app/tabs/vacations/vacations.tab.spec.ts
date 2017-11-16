import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationsTab } from './vacations.tab';

describe('VacationsTab', () => {
  let component: VacationsTab;
  let fixture: ComponentFixture<VacationsTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacationsTab ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
