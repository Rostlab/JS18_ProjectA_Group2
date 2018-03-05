import { Component } from '@angular/core';
import * as Plotly from 'plotly.js/lib/core';
import { ScatterData, Layout, PlotlyHTMLElement, newPlot } from 'plotly.js/lib/core';

@Component({
    selector: 'my-app',
    templateUrl: 'template/app.component.html',
    styleUrls: ['css/app.index.css']
})
export class AppComponent { 
    
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
    
    data: any = [this.trace1, this.trace2];
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
    options: any;
 
    ngOnInit() {
        console.log("ngOnInit AppComponent");
        console.log(this.data);
        console.log(this.layout);
 
        Plotly.newPlot('myPlotlyDiv', this.data, this.layout, this.options);
    }   
}