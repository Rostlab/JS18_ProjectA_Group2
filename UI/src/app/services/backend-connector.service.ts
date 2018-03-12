import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs'
import { ScatterData } from 'plotly.js/lib/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Data, Options } from '../../../models';

@Injectable()
export class BackendConnectorService {
    private readonly connectionRetries = 3;
    private readonly connectionTimeout = 100000;

    constructor(private http: HttpClient) {
    }

    getData() {
        return this.http
            .get('httpUrl')
            .retry(this.connectionRetries)
            .timeout(this.connectionTimeout)
            .map((response: Response) =>
                response.json()
            )
            // .catch(this.handleError)
            .subscribe((data) => {
                console.log(data);
                if (data) {
                    const map = new Map<number, Data[]>();
                    Data.parseDatas(data as JsonData[]).forEach(d => {
                        if (!map.has(d.id)) {
                            map.set(d.id, []);
                        }
                        map.get(d.id).push(d);
                    });
                    this._latestID.next(map);
                }
            });
    }

    getOptions(){
        return this.http
            .get('httpUrl')
            .retry(this.connectionRetries)
            .timeout(this.connectionTimeout)
            .map((response: Response) =>
                response.json()
            )
            // .catch(this.handleError)
            .subscribe((data) => {
                console.log(data);
            });
    }



    /**********************************
     * Example plot
     *****************************************/
    trace1:any = {
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

    data2 = [this.trace1, this.trace2];


    ////////////////////////////////////////////////
    /*

    private getLatestIdFromBackend() {
        const httpRequest = this.getLatestId(this.endpoint, this.getSourceQuery()).subscribe(data => {
            if (data) {
                const map = new Map<number, Data[]>();
                Data.parseDatas(data as JsonData[]).forEach(d => {
                    if (!map.has(d.id)) {
                        map.set(d.id, []);
                    }
                    map.get(d.id).push(d);
                });
                this._latestID.next(map);
            }
        });
    }

    public getLatestId(endpoint: string, searchQueryParam: SearchQuery): Observable<Object> {
        const searchQuery = new URLSearchParams();

        if (searchQueryParam['source'] !== undefined) {
            searchQuery.append('source', searchQueryParam['source']);
        }

        const uri = "/latestDataById";

        return this.httpService.get(endpoint + uri, searchQuery, false);
    }*/


}
