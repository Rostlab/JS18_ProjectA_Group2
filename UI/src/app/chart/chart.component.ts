import { Component, Input, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js/lib/core';
import { Layout, Options, Trace } from "../../../models";

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    data: Trace[];
    layout: Layout;
    options: Options;

    reset() {
        Plotly.purge("plot");
    };

    plot() {
        if ((this.layout === undefined) || (this.data === undefined) || (this.options === undefined)) {
            alert("Wrong input");
        } else {
            console.log(this.data);
            Plotly.newPlot("plot", this.data, this.layout, this.options);
        }
    };
}
