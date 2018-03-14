import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScatterData } from 'plotly.js/lib/core';
import { JsonLayout, JsonOptions, JsonTrace, Layout, Options, Trace } from "../../../models";
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

    update() {
        this.getOptions();
        this.getData();
        this.getLayout();
    }

    getData() {
        return this.http
            .get('localhost:3001/api/data')
            .retry(this.connectionRetries)
            .timeout(this.connectionTimeout)
            .map((response: Response) =>
                response.json() || {}
            )
            // .catch(this.handleError)
            .subscribe(data => {
                if(data) {
                    const map = new Map<number, Trace[]>();
                    const val = Trace.parseTraces(data as JsonTrace[]);
                    map.set(0, val);
                    this._data.next(map);
                }
                console.log(data);
            });
    }

    getOptions(){
        return this.http
            .get('localhost:3001/api/options')
            .retry(this.connectionRetries)
            .timeout(this.connectionTimeout)
            .map((response: Response) =>
                response.json() || {}
            )
            // .catch(this.handleError)
            .subscribe((data) => {
                if(data) {
                    const map = new Map<number, Options>();
                    const val = Options.parseOptions(data as JsonOptions);
                    map.set(0, val);
                    this._options.next(map);
                }
                console.log(data);
            });
    }

    getLayout(){
        return this.http
            .get('localhost:3001/api/layout')
            .retry(this.connectionRetries)
            .timeout(this.connectionTimeout)
            .map((response: Response) =>
                response.json() || {}
            )
            // .catch(this.handleError)
            .subscribe((data) => {
                if(data) {
                    const map = new Map<number, Layout>();
                    const val = Layout.parseLayout(data as JsonLayout);
                    map.set(0, val);
                    this._layout.next(map);
                }
                console.log(data);
            });
    }

    requestData(userInput: string, datasetId: number){
        return this.http
            .post('localhost:3001/api', {userinput: userInput, datasetid: datasetId})
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
