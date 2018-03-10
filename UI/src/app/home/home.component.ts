import { Component, OnInit, ViewChild } from '@angular/core';
import { ScatterData } from 'plotly.js/lib/core';
import { TextInputComponent } from "../text-input/text-input.component";
import { ChartComponent } from "../chart";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    @ViewChild("textInput") textInput: TextInputComponent;
    @ViewChild("chart") chart: ChartComponent;

    graphIsEmpty: boolean;
    datasets: Array<DATASET>;
    dataset: DATASET;
    readonly defaultDataset: DATASET = new DATASET(-1, "Choose a dataset");

    constructor () {
        this.graphIsEmpty = true;
        this.datasets = Array<DATASET>();
        this.dataset = this.defaultDataset;
    }

    ngOnInit() {
        //TODO get from backend
        this.datasets.push(this.defaultDataset);
        this.datasets.push(new DATASET(0, "Dataset 1"));
        this.datasets.push(new DATASET(1, "Dataset 2"));
    }

    /**
     * is called by the plot button or hitting "Enter"
     */
    public plotGraph () {
        //TODO
        // call plot in the graph
        console.log("Plot was pressed");
        this.chart.plot();
        this.graphIsEmpty = false;
    }

    /**
     * Disable method for button
     */
    public shouldDisablePlotButton() {
        return (this.textIsEmpty() || (this.dataset === this.defaultDataset));
    }

    /**
     * Disable method for button
     */
    public shouldDisableClearButton() {
        return (this.textIsEmpty() && this.graphIsEmpty);
    }

    /**
     * gets from the text-input component, if the text-flied is empty
     */
    public textIsEmpty () {
        return this.textInput.textIsEmpty();
    }

    /**
     * is called by the clear button
     */
    public clearAll() {
        console.log("Clear was pressed");
        this.graphIsEmpty = true;
        this.chart.reset();
        this.textInput.clear();
        this.dataset = this.defaultDataset;


        this.data = null;
        this.layout = null;
    }


    /**********************************
     * Example plot
     *****************************************/
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

    data = [this.trace1, this.trace2];

}

export class DATASET {

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    id: number;
    name: string;
}