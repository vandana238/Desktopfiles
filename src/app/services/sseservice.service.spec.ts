import { TestBed } from '@angular/core/testing';

import { SseserviceService } from './sseservice.service';

describe('SseserviceService', () => {
  let service: SseserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
