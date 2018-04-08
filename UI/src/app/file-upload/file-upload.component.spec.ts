import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadComponent } from './file-upload.component';
import { HttpClientModule } from "@angular/common/http";
import { BackendConnectorService } from "../services";
import { By } from "@angular/platform-browser";

describe('FileUploadComponent', () => {
    let component: FileUploadComponent;
    let fixture: ComponentFixture<FileUploadComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                HttpClientModule
            ],
            declarations: [
                FileUploadComponent
            ],
            providers: [
                BackendConnectorService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    fit('should create', () => {
        expect(component).toBeTruthy();
    });

    fit('cancel', () => {
       component.handleCancel();
       fixture.detectChanges();
       expect(component.fileSelected).toBeTruthy();
    });

    fit('clicking submit triggers handleSubmit()', fakeAsync(() => {
        spyOn(component, 'handleSubmit');

        fixture.debugElement.query(By.css('form.uploadForm')).triggerEventHandler('submit', null);

        fixture.detectChanges();
        tick();
        expect(component.handleSubmit).toHaveBeenCalled();
    }));
});
