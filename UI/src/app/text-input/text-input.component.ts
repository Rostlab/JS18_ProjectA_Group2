import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {

    textInput: string;
    @Output() plot = new EventEmitter();

    constructor() {}


    ngOnInit() {
        this.clear();
    }

    clear() {
        this.textInput = "";
    }

    plotGraph() {
        //TODO
        this.plot.emit(/*processed query*/);
    }

    textIsEmpty() {
        return (this.textInput === "");
    }

}
