import { TestBed } from '@angular/core/testing';

import { ViewexpireService } from './viewexpire.service';

describe('ViewexpireService', () => {
  let service: ViewexpireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewexpireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
