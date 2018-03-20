import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpErrorResponse, HttpEvent } from '@angular/common/http';

import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { BackendConnectorService } from "../services";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit, OnDestroy {
    fileSelected: boolean = true;
    statusFormGroup: FormGroup;
    fileToUpload: File  = null;
    uploadProgress:number = 0;
    uploadComplete:boolean = false;
    uploadingProgressing:boolean = false;
    fileUploadSub: any;
    serverResponse: any;

    @ViewChild('myInput') myFileInput: any;


    constructor(private fileUploadService: BackendConnectorService) {}

    ngOnInit() {
      this.statusFormGroup = new FormGroup({});
    }

    ngOnDestroy() {
        if (this.fileUploadSub){
            this.fileUploadSub.unsubscribe();
        }
    }

    handleProgress(event){
      if (event.type === HttpEventType.DownloadProgress) {
        this.uploadingProgressing =true
        this.uploadProgress = Math.round(100 * event.loaded / event.total)
      }

      if (event.type === HttpEventType.UploadProgress) {
        this.uploadingProgressing =true
        this.uploadProgress = Math.round(100 * event.loaded / event.total)
      }

      if (event.type === HttpEventType.Response) {
        // console.log(event.body);
        this.uploadComplete = true;
        this.serverResponse = event.body;
      }
    }



    handleSubmit(event:any, statusNgForm:NgForm, statusFormGroup: FormGroup){
      event.preventDefault()
      if (statusNgForm.submitted){

          let submittedData = statusFormGroup.value;

          this.fileUploadSub = this.fileUploadService.fileUpload(
                this.fileToUpload, 
                submittedData).subscribe(
                    event=>this.handleProgress(event), 
                    error=>{
                        console.log("Server error")
                    });

          statusNgForm.resetForm({})
      }
  }


    handleFileInput(files: FileList) {
        let fileItem = files.item(0);
        console.log("file input has changed. The file is", fileItem);
        this.fileToUpload = fileItem;
        
        //If file was selected enable submit button else disable
        this.fileSelected = fileItem ? false : true;
    }

    handleCancel() {
        this.fileSelected = true;
    }
}