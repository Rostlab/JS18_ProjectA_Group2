import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { TextInputComponent } from './text-input';
import { ChartComponent } from './chart/chart.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';

@Component({
    selector: 'test',
    template: `
    <app-root></app-root>
    `
})
class TestComponent {
}
describe('##Testing app.component', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ FormsModule, NgHttpLoaderModule ],
            declarations: [TestComponent, AppComponent, HomeComponent, TextInputComponent, ChartComponent, FileUploadComponent]
        });
    });
    beforeEach(async(() => {
        TestBed.compileComponents();
    }));
    
});
