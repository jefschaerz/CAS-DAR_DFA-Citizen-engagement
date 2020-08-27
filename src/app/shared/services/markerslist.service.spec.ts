import { TestBed } from '@angular/core/testing';

import { MarkerslistService } from './markerslist.service';

describe('MakerslistService', () => {
  let service: MarkerslistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkerslistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
