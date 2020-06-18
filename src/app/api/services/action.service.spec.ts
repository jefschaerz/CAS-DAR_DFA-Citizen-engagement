import { TestBed } from '@angular/core/testing';

import { IssueActionService } from './issue-action.service';

describe('IssueActionService', () => {
  let service: IssueActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
