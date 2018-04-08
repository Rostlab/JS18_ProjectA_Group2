import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { FormsModule } from '@angular/forms';
import { Data } from "../../../models";

describe('ChartComponent', () => {
    let component: ChartComponent;
    let fixture: ComponentFixture<ChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                ChartComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    fit('should create', () => {
        expect(component).toBeTruthy();
    });

    fit('reset', () => {
        const plot = document.getElementById('plot').textContent;
        component.reset();
        fixture.detectChanges();
        expect(plot).toEqual("");
    });

    fit('getData', () => {
        expect(component.getData()).toEqual(new Data(component.data, component.layout, component.options));
    });
});
