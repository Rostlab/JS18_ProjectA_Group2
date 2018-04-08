import { TestBed, inject, async } from '@angular/core/testing';
import { BackendConnectorService } from './backend-connector.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Columns, Data, Dataset, Layout, ModeType, Options, PlotType, QueryResponse, Trace } from "../../../models";

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

    fit('should get data to plot from the API via GET for bar chart', () => {
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

        const dummytrace = new Trace(dummyPosts.plot_type as PlotType);
        dummytrace.x = dummyPosts.delta;
        dummytrace.y = dummyPosts.y;
        const dummyQueryResponse: Data = new Data([dummytrace], new Layout(dummyPosts.title), new Options());

        service.getData("DummyPlotRequest", "DatasetName").subscribe((posts: Data) => {
            expect(posts).toEqual(dummyQueryResponse);
        });

        const request = httpMock.expectOne(request => request.url === '/api/plot');

        expect(request.request.url).toEqual('/api/plot');
        expect(request.request.method).toEqual('GET');

        request.flush(dummyPosts);
    });

    fit('should get data to plot from the API via GET for histogram', () => {
        const dummyPosts: QueryResponse = {
            x: [1,2,3],
            x_title: "X",
            y: [4,5,6],
            y_title: "Y",
            plot_type: "histogram",
            delta: [1,3,5],
            delta_title: "D",
            title: "Tit"
        };

        const dummytrace = new Trace(dummyPosts.plot_type as PlotType);
        dummytrace.x = dummyPosts.y;
        const dummyQueryResponse: Data = new Data([dummytrace], new Layout(dummyPosts.title), new Options());

        service.getData("DummyPlotRequest", "DatasetName").subscribe((posts: Data) => {
            expect(posts).toEqual(dummyQueryResponse);
        });

        const request = httpMock.expectOne(request => request.url === '/api/plot');

        expect(request.request.url).toEqual('/api/plot');
        expect(request.request.method).toEqual('GET');

        request.flush(dummyPosts);
    });

    fit('should get data to plot from the API via GET for pie chart', () => {
        const dummyPosts: QueryResponse = {
            x: [1,2,3],
            x_title: "X",
            y: [4,5,6],
            y_title: "Y",
            plot_type: "pie",
            delta: [1,3,5],
            delta_title: "D",
            title: "Tit"
        };

        const dummytrace = new Trace(dummyPosts.plot_type as PlotType);
        dummytrace.labels = dummyPosts.delta;
        dummytrace.values = dummyPosts.y;
        const dummyQueryResponse: Data = new Data([dummytrace], new Layout(dummyPosts.title), new Options());

        service.getData("DummyPlotRequest", "DatasetName").subscribe((posts: Data) => {
            expect(posts).toEqual(dummyQueryResponse);
        });

        const request = httpMock.expectOne(request => request.url === '/api/plot');

        expect(request.request.url).toEqual('/api/plot');
        expect(request.request.method).toEqual('GET');

        request.flush(dummyPosts);
    });

    fit('should get data to plot from the API via GET for scatter chart', () => {
        const dummyPosts: QueryResponse = {
            x: [1,2,3],
            x_title: "X",
            y: [4,5,6],
            y_title: "Y",
            plot_type: "scatter",
            delta: [1,3,5],
            delta_title: "D",
            title: "Tit"
        };

        const dummytrace = new Trace(dummyPosts.plot_type as PlotType);
        const dummylayout = new Layout(dummyPosts.title);
        dummytrace.x = dummyPosts.x;
        dummytrace.y = dummyPosts.y;
        dummylayout.yaxis = {title: dummyPosts.y_title, showgrid: true};
        dummylayout.xaxis = {title: dummyPosts.x_title, showgrid: true};
        dummytrace.text = dummyPosts.delta;
        dummytrace.mode = 'markers' as ModeType;
        const dummyQueryResponse: Data = new Data([dummytrace], dummylayout, new Options());

        service.getData("DummyPlotRequest", "DatasetName").subscribe((posts: Data) => {
            expect(posts).toEqual(dummyQueryResponse);
        });

        const request = httpMock.expectOne(request => request.url === '/api/plot');

        expect(request.request.url).toEqual('/api/plot');
        expect(request.request.method).toEqual('GET');

        request.flush(dummyPosts);
    });

    fit('should get data to plot from the API via GET for line chart', () => {
        const dummyPosts: QueryResponse = {
            x: [1,2,3],
            x_title: "X",
            y: [4,5,6],
            y_title: "Y",
            plot_type: "line",
            delta: [1,3,5],
            delta_title: "D",
            title: "Tit"
        };

        const dummytrace = new Trace(dummyPosts.plot_type as PlotType);
        const dummylayout = new Layout(dummyPosts.title);
        dummytrace.x = dummyPosts.x;
        dummytrace.y = dummyPosts.y;
        dummylayout.yaxis = {title: dummyPosts.y_title, showgrid: true};
        dummylayout.xaxis = {title: dummyPosts.x_title, showgrid: true};
        dummytrace.text = dummyPosts.delta;
        const dummyQueryResponse: Data = new Data([dummytrace], dummylayout, new Options());

        service.getData("DummyPlotRequest", "DatasetName").subscribe((posts: Data) => {
            expect(posts).toEqual(dummyQueryResponse);
        });

        const request = httpMock.expectOne(request => request.url === '/api/plot');

        expect(request.request.url).toEqual('/api/plot');
        expect(request.request.method).toEqual('GET');

        request.flush(dummyPosts);
    });

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
                type: 'bar',
                mode: 'lines',
                text: [""],
            }],
            layout: {
                title: "",
                xaxis: "",
                yaxis: ""
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

    fit('should upload file to the API via POST', () => {
        const dummyPosts: any = {
            filename: 'Value 1'
        };

        service.fileUpload(new File([], "DummyFilename")).subscribe(event => {
            expect(event).toEqual(dummyPosts);
        });

        const request = httpMock.expectOne(request => request.url === '/api/upload');

        expect(request.request.url).toEqual('/api/upload');
        expect(request.request.method).toEqual('POST');

        request.flush(dummyPosts);
    });

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
