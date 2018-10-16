import { TestBed, inject } from '@angular/core/testing';

import { RogspLibService } from './ro-gsp-lib.service';

describe('RogspLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RogspLibService]
    });
  });

  it('should be created', inject([RogspLibService], (service: RogspLibService) => {
    expect(service).toBeTruthy();
  }));
});
