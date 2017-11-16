import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeCardsTab } from './time-cards.tab';

describe('TimeCardsTab', () => {
  let component: TimeCardsTab;
  let fixture: ComponentFixture<TimeCardsTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeCardsTab ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeCardsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
