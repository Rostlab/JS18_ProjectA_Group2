import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TextInputComponent } from "../text-input";
import { ChartComponent } from "../chart";
import { BackendConnectorService } from "../services";
import { Dataset } from '../../../models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {

    @ViewChild("textInput") textInput: TextInputComponent;
    @ViewChild("chart") chart: ChartComponent;

    data: any[];
    options: any;

    graphIsEmpty: boolean;
    datasets: Array<Dataset>;
    dataset: Dataset;
    readonly defaultDataset: Dataset = new Dataset(-1, "Choose a dataset");

    constructor (private backendConnector: BackendConnectorService) {
        this.graphIsEmpty = true;
        this.datasets = Array<Dataset>();
        this.dataset = this.defaultDataset;
    }

    ngOnInit() {
        //TODO get from backend
        this.datasets.push(this.defaultDataset);
        this.datasets.push(new Dataset(0, "Dataset 1"));
        this.datasets.push(new Dataset(1, "Dataset 2"));
    }

    ngAfterViewInit() {
    }

    /**
     * is called by the plot button or hitting "Enter"
     */
    public plotGraph () {
        //TODO
        // call plot in the graph
        if (!this.shouldDisablePlotButton()) {
            console.log("Plot was pressed");
            console.log(this.textInput.getTextInput());
            console.log(this.dataset.name);
            this.chart.plot();
            this.graphIsEmpty = false;
        }
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
    }
}
