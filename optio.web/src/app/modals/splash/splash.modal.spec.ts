import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplashModal } from './splash.modal';

describe('SplashModal', () => {
  let component: SplashModal;
  let fixture: ComponentFixture<SplashModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplashModal ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
