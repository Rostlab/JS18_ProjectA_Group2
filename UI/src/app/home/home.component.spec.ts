import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { TextInputComponent } from '../text-input';
import { ChartComponent } from '../chart/chart.component';
import { BackendConnectorService } from "../services";
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { WorkingCommandsComponent } from "../working-commands/working-commands.component";

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientModule,
                ReactiveFormsModule
            ],
            declarations: [
                HomeComponent,
                TextInputComponent,
                ChartComponent,
                FileUploadComponent,
                WorkingCommandsComponent
            ],
            providers: [
                BackendConnectorService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    fit('should create', () => {
        expect(component).toBeTruthy();
    });
});
