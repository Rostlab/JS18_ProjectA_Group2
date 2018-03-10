import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { TextInputComponent } from './text-input/text-input.component';
import { ChartComponent } from './chart/chart.component';

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
            imports: [ FormsModule ],
            declarations: [TestComponent, AppComponent, HomeComponent, TextInputComponent, ChartComponent]
        });
    });
    beforeEach(async(() => {
        TestBed.compileComponents();
    }));
    it('##testing app.component parts', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const el:any = fixture.debugElement.nativeElement as HTMLElement;
        expect(el.querySelector('p').textContent).toBe('Very simple setup.');
    }));
});