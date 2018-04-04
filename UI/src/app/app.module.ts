import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


import { HttpClientModule } from "@angular/common/http";
//import { NgxSelectModule } from 'ngx-select-ex';

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
    HistogramComponent//,
    //NgxSelectModule
} from './chart';
import { BackendConnectorService } from "./services";
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';


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
        NgHttpLoaderModule,
        ReactiveFormsModule
    ],
    providers: [BackendConnectorService],
    bootstrap: [AppComponent]
})
export class AppModule { }
