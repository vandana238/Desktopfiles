import { TestBed } from '@angular/core/testing';

import { QuickresponseService } from './quickresponse.service';

describe('QuickresponseService', () => {
  let service: QuickresponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuickresponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
