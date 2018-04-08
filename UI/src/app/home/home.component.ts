import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TextInputComponent } from "../text-input/text-input.component";
import { ChartComponent } from "../chart/chart.component";
import { BackendConnectorService } from "../services";
import { Dataset, Data, Columns } from '../../../models';

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
    readonly defaultDataset: Dataset = new Dataset(0, "Choose a dataset");
    readonly errorText: string = "OOPS!! Something Went Wrong!! ";
    columns: Columns;
    error: string = "";
    err_: boolean = false;
    plot_: boolean = false;


    constructor(private backendConnector: BackendConnectorService) {
        this.graphIsEmpty = true;
        this.datasets = Array<Dataset>();
        this.dataset = this.defaultDataset;
    }

    ngOnInit() {
        //Add default option        
        this.datasets.push(this.defaultDataset);

        this.backendConnector.getDatabaseTables().subscribe(event => this.initSelectionList(event),
            err => {
                this.error = this.errorText;//err.message;
                this.err_ = true;

            });
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
            const that = this;
            this.backendConnector.getData(this.textInput.getTextInput(), this.dataset.name)
                .subscribe((data: Data) => {
                    if (data) {
                        that.chart.data = data.traces;
                        that.chart.options = data.options;
                        that.chart.layout = data.layout;
                        that.graphIsEmpty = false;
                        this.plot_ = true;
                        that.chart.reset();
                        that.chart.plot();

                    }
                }, err => {
                    this.error = this.errorText;//err.message;
                    this.err_ = true;
                });
        }
    }

    public updateGraph() {
        if (!this.shouldDisableUpdateButton()) {
            const that = this;
            this.backendConnector.update(this.textInputUpdate.getTextInput(), this.chart.getData())
                .subscribe((res) => {
                    if (res) {
                        that.chart.update(res);
                    }
                }, err => {
                    this.error = this.errorText;//err.message;
                    this.err_ = true;
                });
        }
    }

    public getColumns() {
        this.backendConnector.getColumns(this.dataset.name).subscribe(
            value => {
                this.columns = value;
            }, err => {
                this.error = this.errorText;//err.message;

                this.err_ = true;
            });
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
        this.graphIsEmpty = true;
        this.chart.reset();
        this.textInput.clear();
        this.textInputUpdate.clear();
        this.dataset = this.defaultDataset;
        this.columns = null;
    }

    private initSelectionList(data) {
        var tables = data.tables;

        //Add tables into dataset.
        var id = 1;
        for (let table of tables) {
            this.datasets.push(new Dataset(id, table));
            id++;
        }
    }
}
