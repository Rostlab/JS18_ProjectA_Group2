import { TestBed, inject } from '@angular/core/testing';

import { BackendConnectorService } from './backend-connector.service';
import { HttpClientModule } from '@angular/common/http';

describe('BackendConnectorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [BackendConnectorService]
        });
    });

    fit('should be created', inject([BackendConnectorService], (service: BackendConnectorService) => {
        expect(service).toBeTruthy();
    }));
});
