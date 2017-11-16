import { TestBed, inject } from '@angular/core/testing';

import { RibbonInfosService } from './ribbon-infos.service';

describe('RibbonInfosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RibbonInfosService]
    });
  });

  it('should be created', inject([RibbonInfosService], (service: RibbonInfosService) => {
    expect(service).toBeTruthy();
  }));
});
