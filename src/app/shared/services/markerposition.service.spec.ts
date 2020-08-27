import { TestBed } from '@angular/core/testing';
import { MarkerPositionService } from './markerposition.service';

describe('MarkerPositionService', () => {
  let service: MarkerPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkerPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
