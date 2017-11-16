import { TestBed, inject } from '@angular/core/testing';

import { DisabledButtonsService } from './disabled-buttons.service';

describe('DisabledButtonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisabledButtonsService]
    });
  });

  it('should be created', inject([DisabledButtonsService], (service: DisabledButtonsService) => {
    expect(service).toBeTruthy();
  }));
});
