import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsModal } from './shifts.modal';

describe('ShiftsModal', () => {
  let component: ShiftsModal;
  let fixture: ComponentFixture<ShiftsModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftsModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
