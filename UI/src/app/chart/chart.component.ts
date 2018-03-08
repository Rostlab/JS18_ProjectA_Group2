import {Component, Input, OnInit} from '@angular/core';
import * as Plotly from 'plotly.js/lib/core';

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

    @Input() data: any;
    @Input() layout: any;
    @Input() options: any;

    reset() {
        Plotly.purge("plot");
    };

    plot() {
        Plotly.newPlot("plot", this.data, this.layout, this.options);
    };

    /*plot() {
        if(this.userInput === "Draw bar chart"){
            this.plotTitle = this.userInput;
            this.displayTitle = true;
            this.drawBarChart();
        }else{
            window.alert("wrong input");
        }
    };

    drawBarChart() {
        var div = document.getElementById("plot");
        Plotly.plot(div, [{
            x:[1,2,3,4,5],
            y:[1,2,4,8,16],
            type:'bar'
        }]);
    };*/
}
