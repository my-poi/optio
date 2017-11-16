import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCardsRibbon } from './time-cards.ribbon';

describe('TimeCardsRibbon', () => {
  let component: TimeCardsRibbon;
  let fixture: ComponentFixture<TimeCardsRibbon>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeCardsRibbon ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeCardsRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
