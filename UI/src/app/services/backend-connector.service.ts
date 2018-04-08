import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScatterData } from 'plotly.js/lib/core';
import { Columns, Data, Dataset, Layout, Options, PlotType, QueryResponse, Trace } from "../../../models";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class BackendConnectorService {

    constructor(private http: HttpClient) {
    }

    private createPlotData(queryResponse: QueryResponse) {
        if (queryResponse) {
            const trace = new Trace(queryResponse.plot_type as PlotType);
            const layout = new Layout(queryResponse.title);
            if(queryResponse.plot_type ==='histogram'){
                trace.x = queryResponse.y;
            }else if(queryResponse.plot_type == 'pie'){
                trace.labels = queryResponse.delta;
                trace.values = queryResponse.y;
            }
            else if(queryResponse.plot_type == 'bar'){
                trace.x = queryResponse.delta;
                trace.y = queryResponse.y;
            }
            else{
                trace.x = queryResponse.x;
                trace.y = queryResponse.y;
                layout.yaxis = {title :queryResponse.y_title, showgrid:true};
                layout.xaxis = {title :queryResponse.x_title, showgrid:true};
                trace.text = queryResponse.delta;
                if(queryResponse.plot_type == 'scatter'){
                    trace.mode='markers' as ModeType;
                }
            }

            const options = new Options();
            return new Data([trace], layout, options);

        }

    }

    public getData(userInput: string, datasetName: string) {

        return this.http.get('/api/plot',
            {
                params: {
                    userquery: userInput,
                    dataset: datasetName
                }
            }).map((queryResponse: QueryResponse) => {
            return this.createPlotData(queryResponse);

        })
    }

    public update(userInput: string, data: Data) {

        return this.http.post('https://js2018-group4.azurewebsites.net/api/nlp',
            {
                sentence: userInput,
                data: data.traces,
                layout: data.layout
            }).catch(error => Observable.throw(error));
    };

    public fileUpload(fileItem: File, extraData?: object): any {
        const apiCreateEndpoint = '/api/upload';
        const formData: FormData = new FormData();

        formData.append('fileItem', fileItem, fileItem.name);
        if (extraData) {
            for (let key in extraData) {
                // iterate and set other form data
                formData.append(key, extraData[key])
            }
        }
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        return this.http.post(apiCreateEndpoint, formData,
            {
                headers: headers
            })
            .map((res: Response) => {
                return res;
            })
            .catch(error => Observable.throw(error));
    };

    public getDatabaseTables() {
        const apiCreateEndpoint = '/api/getTables';
        return this.http.get<Dataset[]>(apiCreateEndpoint)
            .catch(error => Observable.throw(error));
    }

    public getColumns(table: string) {
        const apiGetColumnsEndpoint = '/api/columns';
        return this.http.get<Columns>(apiGetColumnsEndpoint,
            {
                params: {
                    dataset: table
                }
            })
            .map((columns: Columns) => {
                return columns;
            })
            .catch(error => Observable.throw(error));
    }
}
