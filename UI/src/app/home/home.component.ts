import {Component, EventEmitter, OnInit} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    clear = new EventEmitter<boolean>();
    textIsEmpty: boolean;
    graphIsEmpty: boolean;

    constructor () {
        this.textIsEmpty = true;
        this.graphIsEmpty = true;
    }

    ngOnInit() {
    }

    /**
     * is called by the plot button or hitting "Enter"
     */
    public plotGraph () {
        //TODO
        // call plot in the graph
        console.log("Plot was pressed");
        this.graphIsEmpty = false;
    }

    /**
     * Disable method for button
     */
    public shouldDisablePlotButton() {
        return !(this.textEmpty);
    }

    /**
     * Disable method for button
     */
    public shouldDisableClearButton() {
        return (this.textEmpty && this.graphIsEmpty);
    }

    /**
     * gets from the text-input component, if the text-flied is empty
     */
    public textEmpty () {
        //TODO
        this.textIsEmpty = false;
    }

    /**
     * is called by the clear button
     */
    public clearAll() {
        console.log("Clear was pressed");
        this.graphIsEmpty = true;
        this.clear.emit(true);
    }



}
