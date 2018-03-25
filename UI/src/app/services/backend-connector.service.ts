import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScatterData } from 'plotly.js/lib/core';
import { Data, JsonData, Layout, Options, Trace } from "../../../models";
import { BehaviorSubject } from 'rxjs';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BackendConnectorService {
    private _data: BehaviorSubject<Map<number, Trace[]>> = new BehaviorSubject<Map<number, Trace[]>>(new Map());
    private _options: BehaviorSubject<Map<number, Options>> = new BehaviorSubject<Map<number, Options>>(new Map());
    private _layout: BehaviorSubject<Map<number, Layout>> = new BehaviorSubject<Map<number, Layout>>(new Map());
    public data: Observable<Map<number, Trace[]>> = this._data.asObservable();
    public options: Observable<Map<number, Options>> = this._options.asObservable();
    public layout: Observable<Map<number, Layout>> = this._layout.asObservable();

    constructor(private http: HttpClient) {
    }

    public getData(userInput: string, datasetName: string) {
        
        return this.http
            .get('http://localhost:3001/api/nlptodata', 
            {
                params: {
                    userquery: userInput,
                    dataset: datasetName
                }
            })
            .map((respose: Response) =>
                respose.json() || {}
            )
            .subscribe((data) => {
                console.log("Backendconnector" + data);
                if(data) {
                    const val = Data.parseData(data as JsonData);
                    this.parseData(val.traces);
                    this.parseLayout(val.layout);
                    this.parseOptions(val.options);
                }
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

   fileUpload(fileItem:File, extraData?:object):any{
      var apiCreateEndpoint = 'http://localhost:3001/api/upload';
      const formData: FormData = new FormData();

      formData.append('fileItem', fileItem, fileItem.name);
      if (extraData) {
        for(let key in extraData){
            // iterate and set other form data
          formData.append(key, extraData[key])
        }
      }
      var headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      return this.http.post(apiCreateEndpoint, formData, { headers: headers })
                 .map((res : Response) => { return res; })
                 .catch(error => Observable.throw(error));
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
