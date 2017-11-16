import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUnitTab } from './company-unit.tab';

describe('CompanyUnitTab', () => {
  let component: CompanyUnitTab;
  let fixture: ComponentFixture<CompanyUnitTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyUnitTab ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUnitTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
