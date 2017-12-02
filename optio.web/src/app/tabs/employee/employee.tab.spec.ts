import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTab } from './employee.tab';

describe('EmployeeTab', () => {
  let component: EmployeeTab;
  let fixture: ComponentFixture<EmployeeTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTab ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
