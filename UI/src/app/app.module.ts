import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TextInputComponent } from './text-input/text-input.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ChartComponent } from './chart/chart.component';
import { BackendConnectorService } from "./services";
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TextInputComponent,
        ChartComponent,
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
