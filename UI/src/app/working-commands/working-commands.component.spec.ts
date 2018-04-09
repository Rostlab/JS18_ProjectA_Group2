import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingCommandsComponent } from "./working-commands.component";

import { FormsModule } from '@angular/forms';

describe('WorkingCommandsComponent', () => {
    let component: WorkingCommandsComponent;
    let fixture: ComponentFixture<WorkingCommandsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                WorkingCommandsComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WorkingCommandsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    fit('should create', () => {
        expect(component).toBeTruthy();
    });
});
