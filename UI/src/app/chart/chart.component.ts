import { Component, Input, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js';
import { Layout, Options, Trace } from "../../../models";
import {Data} from "../../../models/Data";
import {lab} from "d3-color";

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

    @Input() data: Trace[];
    @Input() layout: Layout;
    @Input() options: Options;

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

    //TODO: Needs to improve
    public getData(){
        return new Data(this.data, this.layout, this.options);
    }
}
