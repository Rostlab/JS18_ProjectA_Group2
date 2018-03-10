import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
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
            declarations: [TestComponent, AppComponent]
        });
    });
    beforeEach(async(() => {
        TestBed.compileComponents();
    }));
    
});
