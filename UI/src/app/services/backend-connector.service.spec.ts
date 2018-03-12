import { TestBed, inject } from '@angular/core/testing';

import { BackendConnectorService } from './backend-connector.service';

describe('BackendConnectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendConnectorService]
    });
  });

  it('should be created', inject([BackendConnectorService], (service: BackendConnectorService) => {
    expect(service).toBeTruthy();
  }));
});
