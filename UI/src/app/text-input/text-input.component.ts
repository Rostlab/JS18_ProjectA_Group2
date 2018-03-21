import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {

    textInput: string;
    defaultText: string;

    @Input() isPlotTextInput: boolean;
    @Output() plot = new EventEmitter();

    constructor() {

    }


    ngOnInit() {
        this.clear();
        if (this.isPlotTextInput) {
            this.defaultText = "Type a command in natural language to plot a graph.";
        } else {
            this.defaultText = "Type a command in natural language to update the graph.";
        }
    }

    clear() {
        this.textInput = "";
    }

    plotGraph() {
        this.plot.emit();
    }

    textIsEmpty() {
        return (this.textInput === "");
    }

    getTextInput() {
        return this.textInput;
    }
}
