import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodsModal } from './periods.modal';

describe('PeriodsModal', () => {
  let component: PeriodsModal;
  let fixture: ComponentFixture<PeriodsModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodsModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
