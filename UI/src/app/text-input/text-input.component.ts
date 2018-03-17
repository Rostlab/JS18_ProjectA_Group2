import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {

    textInput: string;
    @Output() plot = new EventEmitter();

    constructor() {
    }


    ngOnInit() {
        this.clear();
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
