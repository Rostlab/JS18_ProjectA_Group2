import { TestBed, inject } from '@angular/core/testing';

import { BackendConnectorService } from './backend-connector.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {Dataset} from "../../../models";

describe('BackendConnectorService', () => {
    let service: BackendConnectorService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BackendConnectorService]
        });

        service = TestBed.get(BackendConnectorService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    fit('should be created', inject([BackendConnectorService], (service: BackendConnectorService) => {
        expect(service).toBeTruthy();
    }));

    it('should retrieve names of data tables from the API via GET', () => {
        const dummyPosts: Dataset[] = [
            {id: 1, name:'Dataset 1'},
            {id: 2, name:'Dataset 2'}
        ];

        service.getDatabaseTables().subscribe(posts => {
            expect(posts.length).toBe(2);
            expect(posts).toEqual(dummyPosts);
        });

        const request = httpMock.expectOne('/api/getTables');

        expect(request.request.url).toEqual('/api/getTables');
        expect(request.request.method).toEqual('GET');
        // expect(request.request.headers.get('Content-Type')).toEqual('application/json');

        request.flush(dummyPosts);
    });

    it('should upload file to the API via POST', () => {
        const dummyPosts: Dataset[] = [
            {id: 1, name:'Dataset 1'},
            {id: 2, name:'Dataset 2'}
        ];

        service.getDatabaseTables().subscribe(posts => {
            expect(posts.length).toBe(2);
            expect(posts).toEqual(dummyPosts);
        });

        const request = httpMock.expectOne('/api/getTables');

        expect(request.request.url).toEqual('/api/getTables');
        expect(request.request.method).toEqual('GET');
        // expect(request.request.headers.get('Content-Type')).toEqual('application/json');

        request.flush(dummyPosts);
    });
});
