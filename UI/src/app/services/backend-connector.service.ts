import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Trace, Layout, Options, Data} from '../../../models'
import {PlotType} from '../../../models/Types'

import 'rxjs/Rx';
import {QueryResponse} from "../../../models/QueryResponse";

@Injectable()
export class BackendConnectorService {

    constructor(private http: HttpClient) {
    }

    private createPlotData(queryResponse: QueryResponse) {
        if (queryResponse) {
            const trace = new Trace(queryResponse.plot_type as PlotType);
            trace.x = queryResponse.x;
            trace.xaxis = queryResponse.x_title;
            trace.y = queryResponse.y;
            trace.yaxis = queryResponse.y_title;
            trace.labels = queryResponse.x;
            trace.values = queryResponse.y;

            const layout = new Layout(queryResponse.title);

            const options = new Options();
            return new Data([trace], layout, options);

        }

    }

    public getData(userInput: string, datasetName: string) {

        return this.http.get('/api/nlptodata',
            {
                params: {
                    userquery: userInput,
                    dataset: datasetName
                }
            }).map((queryResponse: QueryResponse) => {
            return this.createPlotData(queryResponse);

        })
    }


    /*
     server response.
     {
     "columnA": {
     "0": "55",
     "1": "80",
     "2": "65",
     "3": "60",
     "4": "60.25",
     "5": "57.12"
     },
     "columnB": {
     "0": "Admin Offices",
     "1": "Executive Office",
     "2": "IT/IS",
     "3": "Production       ",
     "4": "Sales",
     "5": "Software Engineering"
     },
     "columnC": {},
     "plotType": "bar",
     "nlp_out": {
     "intent": {
     "name": "plot",
     "confidence": 0.9391686826624535
     },
     "entities": [
     {
     "start": 5,
     "end": 8,
     "value": "bar",
     "entity": "plot_type",
     "extractor": "ner_crf"
     },
     {
     "start": 18,
     "end": 25,
     "value": "maximum",
     "entity": "operation_x",
     "extractor": "ner_crf"
     },
     {
     "start": 26,
     "end": 34,
     "value": "pay rate",
     "entity": "x",
     "extractor": "ner_crf"
     },
     {
     "start": 35,
     "end": 38,
     "value": "group",
     "entity": "operation_y",
     "extractor": "ner_crf",
     "processors": [
     "ner_synonyms"
     ]
     },
     {
     "start": 39,
     "end": 49,
     "value": "department",
     "entity": "y",
     "extractor": "ner_crf"
     }
     ],
     "intent_ranking": [
     {
     "name": "plot",
     "confidence": 0.9391686826624535
     },
     {
     "name": "no_plot",
     "confidence": 0.06083131733754637
     }
     ],
     "text": "plot bar chart of maximum pay rate per department"
     },
     "userQuery": "plot bar chart of maximum pay rate per department",
     "kquery": {
     "__knexUid": "__knexUid1",
     "method": "select",
     "options": {},
     "timeout": false,
     "cancelOnTimeout": false,
     "bindings": [],
     "__knexQueryUid": "6a8d1ec8-9e74-496d-892c-362e152349d3",
     "sql": "select `Pay Rate` as `columnA`, max(`Pay Rate`) as `columnA`, `Department` as `columnB` from `core_data` group by `Department`"
     },
     "matched_columns": [
     "Pay Rate",
     "Department",
     null
     ]
     }
     */

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
