import { TestBed, inject } from '@angular/core/testing';

import { PaginationServiceService } from './pagination-service.service';

describe('PaginationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginationServiceService]
    });
  });

  it('should be created', inject([PaginationServiceService], (service: PaginationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
