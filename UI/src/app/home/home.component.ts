import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {TextInputComponent} from "../text-input";
import {ChartComponent} from "../chart";
import {BackendConnectorService} from "../services";
import {Dataset, Data} from '../../../models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements AfterViewInit, OnInit {

    @ViewChild("textInput") textInput: TextInputComponent;
    @ViewChild("textInputUpdate") textInputUpdate: TextInputComponent;
    @ViewChild("chart") chart: ChartComponent;


    graphIsEmpty: boolean;
    datasets: Array<Dataset>;
    dataset: Dataset;
    readonly defaultDataset: Dataset = new Dataset(-1, "Choose a dataset");

    constructor(private backendConnector: BackendConnectorService) {
        this.graphIsEmpty = true;
        this.datasets = Array<Dataset>();
        this.dataset = this.defaultDataset;
    }

    ngOnInit() {
        //TODO get from backend
        this.datasets.push(this.defaultDataset);
        this.datasets.push(new Dataset(0, "core_data"));
        this.datasets.push(new Dataset(1, "Another_Kaggle_Dataset"));
    }

    ngAfterViewInit() {

    }

    /**
     * is called by the plot button or hitting "Enter"
     */
    public plotGraph() {
        //TODO
        // call plot in the graph
        if (!this.shouldDisablePlotButton()) {
            console.log("Plot was pressed");
            console.log(this.textInput.getTextInput());
            console.log(this.dataset.name);
            const that = this;
            this.backendConnector.getData(this.textInput.getTextInput(), this.dataset.name)
                .subscribe((data: Data) => {
                    console.log("Backendconnector" + data);
                    if (data) {
                        that.chart.data = data.traces;
                        that.chart.options = data.options;
                        that.chart.layout = data.layout;
                        that.graphIsEmpty = false;
                        that.chart.reset();
                        that.chart.plot();
                    }
                });
        }
    }

    public updateGraph() {
        if (!this.shouldDisableUpdateButton()) {
            console.log("Update was pressed");
            const that = this;
            this.backendConnector.update(this.textInputUpdate.getTextInput(), this.chart.getData())
                .subscribe((res) => {
                    console.log("Backendconnector" + res);
                    if (res) {
                        that.chart.update(res);
                    }
                });
        }
    }


    /**
     * Disable method for button
     */
    public shouldDisablePlotButton() {
        return (this.textIsEmpty(this.textInput) || (this.dataset === this.defaultDataset));
    }

    /**
     * Disable method for button
     */
    public shouldDisableUpdateButton() {
        return (this.textIsEmpty(this.textInputUpdate) || this.graphIsEmpty);
    }

    /**
     * Disable method for button
     */
    public shouldDisableClearButton() {
        return (this.textIsEmpty(this.textInput) && this.textIsEmpty(this.textInputUpdate) && this.graphIsEmpty && (this.dataset === this.defaultDataset));
    }

    /**
     * Disable method for update text field
     */
    public disableUpdateTextField() {
        return this.graphIsEmpty;
    }

    /**
     * gets from the text-input component, if the text-flied is empty
     */
    public textIsEmpty(textInput: TextInputComponent) {
        return textInput.textIsEmpty();
    }

    /**
     * is called by the clear button
     */
    public clearAll() {
        console.log("Clear was pressed");
        this.graphIsEmpty = true;
        this.chart.reset();
        this.textInput.clear();
        this.textInputUpdate.clear();
        this.dataset = this.defaultDataset;
    }
}
