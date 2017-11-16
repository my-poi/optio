import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureRibbon } from './structure.ribbon';

describe('StructureRibbon', () => {
  let component: StructureRibbon;
  let fixture: ComponentFixture<StructureRibbon>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureRibbon ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureRibbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
