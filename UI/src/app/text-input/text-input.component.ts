import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {

    textInput: string;
    @Output() plot = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    @Input() set clear(val: boolean) {
        if (val) {
            this.textInput = "";
        }
    }

    public plotGraph() {
        //TODO
        this.plot.emit(/*processed query*/);
    }

}
