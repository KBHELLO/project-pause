import { TestBed } from '@angular/core/testing';

import { HxService } from './hx.service';

describe('HxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HxService = TestBed.get(HxService);
    expect(service).toBeTruthy();
  });
});
