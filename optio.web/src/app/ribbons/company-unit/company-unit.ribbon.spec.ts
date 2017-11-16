import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUnitRibbon } from './company-unit.ribbon';

describe('CompanyUnitRibbon', () => {
  let component: CompanyUnitRibbon;
  let fixture: ComponentFixture<CompanyUnitRibbon>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyUnitRibbon ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUnitRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
