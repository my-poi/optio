import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRibbon } from './employee.ribbon';

describe('EmployeeRibbon', () => {
  let component: EmployeeRibbon;
  let fixture: ComponentFixture<EmployeeRibbon>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRibbon ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
