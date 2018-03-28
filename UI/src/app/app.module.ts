import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TextInputComponent } from './text-input';
import { FileUploadComponent } from './file-upload/file-upload.component';
import {
    ChartComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    ScatterPlotComponent,
    HistogramComponent
} from './chart';
import { BackendConnectorService } from "./services";

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
        HistogramComponent,
		FileUploadComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [BackendConnectorService],
    bootstrap: [AppComponent]
})
export class AppModule { }
