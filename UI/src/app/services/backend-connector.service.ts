import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs'
import { ScatterData } from 'plotly.js/lib/core';

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

    data = [this.trace1, this.trace2];

}
