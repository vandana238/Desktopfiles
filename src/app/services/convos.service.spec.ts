import { TestBed } from '@angular/core/testing';

import { ConvosService } from './convos.service';

describe('ConvosService', () => {
  let service: ConvosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
