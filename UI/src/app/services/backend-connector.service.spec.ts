import { TestBed, inject, async } from '@angular/core/testing';
import { BackendConnectorService } from './backend-connector.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Columns, Data, Dataset, QueryResponse } from "../../../models";

describe('BackendConnectorService', () => {
    let service: BackendConnectorService;
    let httpMock: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                BackendConnectorService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(BackendConnectorService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    fit('should be created', inject([BackendConnectorService], (service: BackendConnectorService) => {
        expect(service).toBeTruthy();
    }));

    /*fit('should get data to plot from the API via GET', () => {
        const dummyPosts: QueryResponse = {
            x: [1,2,3],
            x_title: "X",
            y: [4,5,6],
            y_title: "Y",
            plot_type: "bar",
            delta: [1,3,5],
            delta_title: "D",
            title: "Tit"
        };
        const dummyQueryResponse: Data = {
            traces: [{
                type: "bar",
                x: [1,2,3],
                xaxis: "X",
                y: [4,5,6],
                yaxis: "Y",
                labels: [1,2,3],
                values: [4,5,6]
            }],
            layout: {},
            options: {}
        };

        service.getData("DummyPlotRequest", "DatasetName").subscribe((posts: Data) => {
            console.log(dummyQueryResponse);
            expect(posts).toBe(dummyQueryResponse);
        });

        const request = httpMock.expectOne(request => request.url === '/api/plot');

        expect(request.request.url).toEqual('/api/plot');
        expect(request.request.method).toEqual('GET');

        request.flush(dummyPosts);
    });*/

    fit('should get update from the API via GET', () => {
        const dummyResponse: any[] = [
            {action: "", value: "", trace: []},
            {action: "", value: "", trace: []}
        ];
        const dummyChart: Data = {
            traces: [{
                x: [],
                y: [],
                xaxis: "",
                yaxis: "",
                values: [],
                labels: [],
                type: 'bar'
            }],
            layout: {
            },
            options: {
            }
        };

        service.update("DummyChangeRequest", dummyChart).subscribe((posts: any[]) => {
            expect(posts.length).toEqual(2);
            expect(posts).toEqual(dummyResponse);
        });

        const request = httpMock.expectOne(request => request.url === 'https://js2018-group4.azurewebsites.net/api/nlp');

        expect(request.request.url).toEqual('https://js2018-group4.azurewebsites.net/api/nlp');
        expect(request.request.method).toEqual('POST');

        request.flush(dummyResponse);
    });

    /*fit('should upload file to the API via POST', () => {
        const dummyPosts: any = {
            filename: 'Value 1'
        };

        service.fileUpload(new File([], "DummyFilename")).subscribe(event => {
            expect(event).toEqual(dummyPosts);
        });

        const request = httpMock.expectOne(request => request.url === '/api/getTables');

        expect(request.request.url).toEqual('/api/getTables');
        expect(request.request.method).toEqual('POST');

        request.flush(dummyPosts);
    });*/

    fit('should retrieve names of data tables from the API via GET', () => {
        const dummyPosts: Dataset[] = [
            {id: 1, name:'Dataset 1'},
            {id: 2, name:'Dataset 2'}
        ];

        service.getDatabaseTables().subscribe(posts => {
            expect(posts.length).toBe(2);
            expect(posts).toEqual(dummyPosts);
        });

        const request = httpMock.expectOne(request => request.url === '/api/getTables');

        expect(request.request.url).toEqual('/api/getTables');
        expect(request.request.method).toEqual('GET');

        request.flush(dummyPosts);
    });

    fit('should get columns from the API via GET', () => {
        const dummyPosts: Columns = {
            columns:[
                'Value 1',
                'Value 2'
            ]
        };

        service.getColumns("testTable").subscribe(posts => {
            expect(posts).toEqual(dummyPosts);
        });

        const request = httpMock.expectOne(request => request.url === '/api/columns');

        expect(request.request.url).toEqual('/api/columns');
        expect(request.request.method).toEqual('GET');

        request.flush(dummyPosts);
    });
});
