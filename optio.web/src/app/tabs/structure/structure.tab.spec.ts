import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTab } from './structure.tab';

describe('StructureTab', () => {
  let component: StructureTab;
  let fixture: ComponentFixture<StructureTab>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureTab ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
