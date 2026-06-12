import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { Client } from './client';

describe('Client', () => {
  let service: Client;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(Client);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
