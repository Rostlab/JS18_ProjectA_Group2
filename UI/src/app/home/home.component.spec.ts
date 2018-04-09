import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { TextInputComponent } from '../text-input/text-input.component';
import { ChartComponent } from '../chart/chart.component';
import { BackendConnectorService } from "../services";
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Columns, Dataset } from "../../../models";
import { WorkingCommandsComponent } from "../working-commands/working-commands.component";
import { By } from "@angular/platform-browser";

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

    fit('shouldDisablePlotButton(): text field empty and not default dataset', () => {
        component.textInput.textInput = "";
        component.dataset = new Dataset(-5, "Test");
        fixture.detectChanges();
        expect(component.shouldDisablePlotButton()).toBeTruthy();
    });

    fit('shouldDisablePlotButton(): text field not empty and not default dataset', () => {
        component.dataset = new Dataset(-5, "Test");
        component.textInput.textInput = "test";
        fixture.detectChanges();
        expect(component.shouldDisablePlotButton()).toBeFalsy();
    });

    fit('shouldDisablePlotButton(): text field not empty and default dataset', () => {
        component.textInput.textInput = "test";
        component.dataset = component.defaultDataset;
        fixture.detectChanges();
        expect(component.shouldDisablePlotButton()).toBeTruthy();
    });

    fit('shouldDisablePlotButton(): text field empty and default dataset', () => {
        component.dataset = component.defaultDataset;
        component.textInput.textInput = "";
        fixture.detectChanges();
        expect(component.shouldDisablePlotButton()).toBeTruthy();
    });

    fit('shouldDisableUpdateButton(): text field empty and graph empty', () => {
        component.textInputUpdate.textInput = "";
        component.graphIsEmpty = false;
        fixture.detectChanges();
        expect(component.shouldDisableUpdateButton()).toBeTruthy();
    });

    fit('shouldDisableUpdateButton(): text field not empty and graph empty', () => {
        component.graphIsEmpty = false;
        component.textInputUpdate.textInput = "test";
        fixture.detectChanges();
        expect(component.shouldDisableUpdateButton()).toBeFalsy();
    });

    fit('shouldDisableUpdateButton(): text field not empty and graph not empty', () => {
        component.textInputUpdate.textInput = "test";
        component.graphIsEmpty = true;
        fixture.detectChanges();
        expect(component.shouldDisableUpdateButton()).toBeTruthy();
    });

    fit('shouldDisableUpdateButton(): text field empty and graph not empty', () => {
        component.graphIsEmpty = true;
        component.textInputUpdate.textInput = "";
        fixture.detectChanges();
        expect(component.shouldDisableUpdateButton()).toBeTruthy();
    });

    fit('shouldDisableClearButton(): not text input, default dataset selected, no graph plotted', () => {
        component.textInput.textInput = "";
        component.textInputUpdate.textInput = "";
        component.graphIsEmpty = true;
        component.dataset = component.defaultDataset;
        fixture.detectChanges();
        expect(component.shouldDisableClearButton()).toBeTruthy();
    });

    fit('shouldDisableClearButton(): not text input, default dataset selected, no graph plotted, but text in update field', () => {
        component.textInput.textInput = "";
        component.textInputUpdate.textInput = "test";
        component.graphIsEmpty = true;
        component.dataset = component.defaultDataset;
        fixture.detectChanges();
        expect(component.shouldDisableClearButton()).toBeFalsy();
    });

    fit('shouldDisableClearButton(): not text input, default dataset selected, no graph plotted, but text in plot field', () => {
        component.textInput.textInput = "test";
        component.textInputUpdate.textInput = "";
        component.graphIsEmpty = true;
        component.dataset = component.defaultDataset;
        fixture.detectChanges();
        expect(component.shouldDisableClearButton()).toBeFalsy();
    });

    fit('shouldDisableClearButton(): not text input, default dataset selected, but graph plotted', () => {
        component.textInput.textInput = "";
        component.textInputUpdate.textInput = "";
        component.graphIsEmpty = false;
        component.dataset = component.defaultDataset;
        fixture.detectChanges();
        expect(component.shouldDisableClearButton()).toBeFalsy();
    });

    fit('shouldDisableClearButton(): not text input, no graph plotted, but not default dataset selected', () => {
        component.textInput.textInput = "";
        component.textInputUpdate.textInput = "";
        component.graphIsEmpty = true;
        component.dataset = new Dataset(-5, "test");
        fixture.detectChanges();
        expect(component.shouldDisableClearButton()).toBeFalsy();
    });

    fit('shouldDisableClearButton(): mixture of all', () => {
        component.textInput.textInput = "test";
        component.textInputUpdate.textInput = "test";
        component.graphIsEmpty = false;
        component.dataset = new Dataset(-5, "test");
        fixture.detectChanges();
        expect(component.shouldDisableClearButton()).toBeFalsy();

        component.textInput.textInput = "test";
        component.textInputUpdate.textInput = "test";
        component.graphIsEmpty = true;
        component.dataset = component.defaultDataset;
        fixture.detectChanges();
        expect(component.shouldDisableClearButton()).toBeFalsy();
    });

    fit('disableUpdateTextField()', () => {
        component.graphIsEmpty = true;
        fixture.detectChanges();
        expect(component.disableUpdateTextField()).toBeTruthy();

        component.graphIsEmpty = false;
        fixture.detectChanges();
        expect(component.disableUpdateTextField()).toBeFalsy();
    });

    fit('textIsEmpty()', () => {
        let textInput = new TextInputComponent();
        textInput.textInput = "";
        fixture.detectChanges();
        expect(component.textIsEmpty(textInput)).toBeTruthy();

        textInput.textInput = "test";
        fixture.detectChanges();
        expect(component.textIsEmpty(textInput)).toBeFalsy();
    });

    fit('clearAll()', () => {
        component.graphIsEmpty = false;
        component.textInput.textInput = "test";
        component.textInputUpdate.textInput = "test";
        component.dataset = new Dataset(-5, "test");
        component.columns = new Columns(["test", "test"]);

        component.clearAll();
        fixture.detectChanges();
        expect(component.graphIsEmpty).toBeTruthy();
        expect(component.textInput.textInput).toEqual("");
        expect(component.textInputUpdate.textInput).toEqual("");
        expect(component.dataset).toEqual(component.defaultDataset);
        expect(component.columns).toEqual(null);
    });

    fit('clearAll(): test on already empty values', () => {
        component.graphIsEmpty = true;
        component.textInput.textInput = "";
        component.textInputUpdate.textInput = "";
        component.dataset = component.defaultDataset;
        component.columns = null;

        component.clearAll();
        fixture.detectChanges();
        expect(component.graphIsEmpty).toBeTruthy();
        expect(component.textInput.textInput).toEqual("");
        expect(component.textInputUpdate.textInput).toEqual("");
        expect(component.dataset).toEqual(component.defaultDataset);
        expect(component.columns).toEqual(null);
    });

    fit('hitting plot button triggers plotGraph()', fakeAsync(() => {
        spyOn(component, 'plotGraph');

        fixture.debugElement.query(By.css('#plotButton')).triggerEventHandler('click', null);

        fixture.detectChanges();
        tick();
        expect(component.plotGraph).toHaveBeenCalled();
    }));

    fit('hitting update button triggers updateGraph()', fakeAsync(() => {
        spyOn(component, 'updateGraph');

        fixture.debugElement.query(By.css('#updateButton')).triggerEventHandler('click', null);

        fixture.detectChanges();
        tick();
        expect(component.updateGraph).toHaveBeenCalled();
    }));

    fit('hitting reset button triggers clearAll()', fakeAsync(() => {
        spyOn(component, 'clearAll');

        fixture.debugElement.query(By.css('#resetButton')).triggerEventHandler('click', null);

        fixture.detectChanges();
        tick();
        expect(component.clearAll).toHaveBeenCalled();
    }));

    fit('hitting Enter in garph text field triggers plotGraph()', fakeAsync(() => {
        spyOn(component, 'plotGraph');

        fixture.debugElement.query(By.css('#text-input')).triggerEventHandler('plot', null);

        fixture.detectChanges();
        tick();
        expect(component.plotGraph).toHaveBeenCalled();
    }));

    fit('hitting Enter in update text field triggers updateGraph()', fakeAsync(() => {
        spyOn(component, 'updateGraph');

        fixture.debugElement.query(By.css('#text-input-update')).triggerEventHandler('plot', null);

        fixture.detectChanges();
        tick();
        expect(component.updateGraph).toHaveBeenCalled();
    }));
});
