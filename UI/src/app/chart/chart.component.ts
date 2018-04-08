import { Component, OnInit } from '@angular/core';
import { Data, Layout, Options, Trace } from "../../../models";
import * as Plotly from 'plotly.js';

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
            alert("Error @ Chart Component: Wrong input");
        } else {
            Plotly.newPlot("plot", this.data, this.layout, this.options);
        }
    };

    //TODO: Needs to improve
    update(actions){
        actions.forEach((task) => {
            if (task.action === 'updateStyle') {
                Plotly.restyle("plot", task.value, task.trace);
            } else if (task.action === 'updateLayout') {
                Plotly.relayout("plot", task.value);
            } else if (task.action === 'updateData') {
                while (this.data.length) {
                    Plotly.deleteTraces("plot", 0);
                }
                Plotly.addTraces("plot", task.value);
            }
        });
    };

    public getData(){
        return new Data(this.data, this.layout, this.options);
    }
}
