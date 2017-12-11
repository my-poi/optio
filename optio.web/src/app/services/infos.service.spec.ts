import { TestBed, inject } from '@angular/core/testing';

import { InfosService } from './infos.service';

describe('InfosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfosService]
    });
  });

  it('should be created', inject([InfosService], (service: InfosService) => {
    expect(service).toBeTruthy();
  }));
});
