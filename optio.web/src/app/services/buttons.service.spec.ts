import { TestBed, inject } from '@angular/core/testing';

import { ButtonsService } from './buttons.service';

describe('ButtonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ButtonsService]
    });
  });

  it('should be created', inject([ButtonsService], (service: ButtonsService) => {
    expect(service).toBeTruthy();
  }));
});
