import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TextInputComponent } from './text-input/text-input.component';
import {
    ChartComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    ScatterPlotComponent,
    HistogramComponent
} from './chart';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TextInputComponent,
        ChartComponent,
        LineChartComponent,
        BarChartComponent,
        PieChartComponent,
        ScatterPlotComponent,
        HistogramComponent
    ],
    imports: [
        BrowserModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
