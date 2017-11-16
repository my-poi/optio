import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationsRibbon } from './vacations.ribbon';

describe('VacationsRibbon', () => {
  let component: VacationsRibbon;
  let fixture: ComponentFixture<VacationsRibbon>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacationsRibbon ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationsRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
