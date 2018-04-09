import * as Plotly from 'plotly.js';

export class Layout implements Partial<Plotly.Layout>{
    title: string;
    xaxis: any;
    yaxis: any;
    constructor(title: string) {
        // this.title=title;
    }
}
