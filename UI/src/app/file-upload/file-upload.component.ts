import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
import {FormGroup, NgForm} from '@angular/forms';
import {BackendConnectorService} from "../services";
import {Dataset} from '../../../models';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit, OnDestroy {
    fileSelected: boolean = true;
    statusFormGroup: FormGroup;
    fileToUpload: File  = null;
    fileUploadSub: any;

    @ViewChild('myInput') myFileInput: any;


    constructor(private fileUploadService: BackendConnectorService) {}

    ngOnInit() {
        this.statusFormGroup = new FormGroup({});
    }

    @Input() dataList;

    ngOnDestroy() {
        if (this.fileUploadSub){
            this.fileUploadSub.unsubscribe();
        }
    }

    handleSubmit(event:any, statusNgForm:NgForm, statusFormGroup: FormGroup){
        event.preventDefault();
        if (statusNgForm.submitted){
            let submittedData = statusFormGroup.value;
            console.log(submittedData);

            this.fileUploadSub = this.fileUploadService.fileUpload(this.fileToUpload, submittedData)
                .subscribe(
                    event=>{ this.handleResponse(event); },
                    error=>{
                        console.log( error.error);
                    });

            statusNgForm.resetForm({});
        }
    }

    handleResponse(response){
        if(response.fileName){
            var fileName = response.fileName;

            //Insert new file into dataset selection list
            var id = this.dataList[this.dataList.length - 1].id + 1;
            this.dataList.push(new Dataset(id, fileName));
            window.alert(response.fileName+" has been uploaded to database!");
        }else{
            window.alert(response.Error);
        }
    }


    handleFileInput(files: FileList) {
        let fileItem = files.item(0);
        console.log("file input has changed. The file is", fileItem);
        this.fileToUpload = fileItem;

        //If file was selected enable submit button else disable
        this.fileSelected = !fileItem;
    }

    handleCancel() {
        this.fileSelected = true;
    }
}
