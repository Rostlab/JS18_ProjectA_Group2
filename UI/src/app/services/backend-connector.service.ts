import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScatterData } from 'plotly.js/lib/core';
import { Data, JsonData, Layout, Options, Trace } from "../../../models";
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BackendConnectorService {
    private readonly connectionRetries = 3;
    private readonly connectionTimeout = 100000;


    private _data: BehaviorSubject<Map<number, Trace[]>> = new BehaviorSubject<Map<number, Trace[]>>(new Map());
    private _options: BehaviorSubject<Map<number, Options>> = new BehaviorSubject<Map<number, Options>>(new Map());
    private _layout: BehaviorSubject<Map<number, Layout>> = new BehaviorSubject<Map<number, Layout>>(new Map());
    public data: Observable<Map<number, Trace[]>> = this._data.asObservable();
    public options: Observable<Map<number, Options>> = this._options.asObservable();
    public layout: Observable<Map<number, Layout>> = this._layout.asObservable();

    constructor(private http: HttpClient) {
    }

    public update() {
        this.getData();
    }

    private getData() {
        return this.http
            .get('localhost:3001/api')
            .retry(this.connectionRetries)
            .timeout(this.connectionTimeout)
            .map((response: Response) =>
                response.json() || {}
            )
            // .catch(this.handleError)
            .subscribe(data => {
                if(data) {
                    const val = Data.parseData(data as JsonData);
                    this.parseData(val.traces);
                    this.parseLayout(val.layout);
                    this.parseOptions(val.options);
                }
                console.log(data);
            });
    }

    private parseData(data: Trace[]){
        const map = new Map<number, Trace[]>();
        map.set(0, data);
        this._data.next(map);
    }

    private parseOptions(data: Options){
        const map = new Map<number, Options>();
        map.set(0, data);
        this._options.next(map);
    }

    private parseLayout(data: Layout){
        const map = new Map<number, Layout>();
        map.set(0, data);
        this._layout.next(map);
    }

    public requestData(userInput: string, datasetId: number){
        return this.http
            .post('localhost:3001/api', JSON.stringify({userinput: userInput, datasetid: datasetId}))
            .retry(this.connectionRetries)
            .timeout(this.connectionTimeout)
            .map((response: Response) =>
                response.json()
            )
            .subscribe((data) => {
                console.log(data);
            });
    }


    /**********************************
     * Example plot
     *****************************************/
    /*trace1:any = {
        x: [1998, 2000, 2001, 2002],
        y: [10, 15, 13, 17],
        type: 'scatter'
    } as ScatterData;

    trace2 = {
        x: [1999, 2000, 2001, 2002],
        y: [16, 5, 11, 9],
        type: 'scatter'
    } as ScatterData;

    layout: any = {
        title: 'Sales Growth',
        xaxis: {
            title: 'Year',
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: 'Percent',
            showline: false
        }
    };

    data = [this.trace1, this.trace2];*/

}
