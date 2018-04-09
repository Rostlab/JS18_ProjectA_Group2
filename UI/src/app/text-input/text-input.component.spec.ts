import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TextInputComponent } from './text-input.component';
import { FormsModule } from '@angular/forms';
import { By } from "@angular/platform-browser";

describe('TextInputComponent', () => {
    let component: TextInputComponent;
    let fixture: ComponentFixture<TextInputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                TextInputComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    fit('should create', () => {
        expect(component).toBeTruthy();
    });

    fit('clear text', () => {
        const testext: string = "test";
        component.textInput = testext;
        fixture.detectChanges();
        expect(component.textInput).toEqual(testext);
        component.clear();
        fixture.detectChanges();
        expect(component.textInput).toEqual("");
    });

    fit('hitting enter plots the graph', fakeAsync(() => {
        spyOn(component.plot, 'emit');

        component.plotGraph();
        fixture.detectChanges();
        tick();
        expect(component.plot.emit).toHaveBeenCalled();
    }));

    fit('test textIsEmpty()', () => {
        component.textInput = "test";
        fixture.detectChanges();
        expect(component.textIsEmpty()).toBeFalsy();

        component.textInput = "";
        fixture.detectChanges();
        expect(component.textIsEmpty()).toBeTruthy();
    });

    fit('gets correct input', () => {
        const testext: string = "test";
        component.textInput = testext;
        expect(component.getTextInput()).toEqual(testext);
    });

    fit('hitting Enter in text field triggers plotGraph()', fakeAsync(() => {
        spyOn(component, 'plotGraph');

        fixture.debugElement.query(By.css('#text-input-area')).triggerEventHandler('keyup.enter', null);

        fixture.detectChanges();
        tick();
        expect(component.plotGraph).toHaveBeenCalled();
    }));
});
