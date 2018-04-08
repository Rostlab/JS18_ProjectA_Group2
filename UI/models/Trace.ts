import * as Plotly from 'plotly.js';
import {Datum} from 'plotly.js';
import {PlotType, ModeType} from './Types'

export class Trace implements Plotly.Data {
    x: Datum[] | Datum[][];
    y: Datum[] | Datum[][];
    xaxis: string;
    yaxis: string;
    values: Datum[] | Datum[][];
    labels: Datum[] | Datum[][];
    type: PlotType;
    mode:ModeType;
    text:string[];

    constructor(type: PlotType) {
        this.type = type;
    }
}
