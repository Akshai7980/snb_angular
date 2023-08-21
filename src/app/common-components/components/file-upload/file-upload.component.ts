import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';

export interface fileDetails {
  title: string;
  size: string;
  format: string;
  checkSum: string;
  typeValidFlag: boolean;
  fileSizeValidFlag: boolean
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  
  uploadedFileName: any;
  showInvalidFileError = false;
  filemanager_addfile: any;
  isLoadingCompelete: boolean = true;
  deleteImgSection: boolean = false;
  fileUploadResponse: any;
  @Input() uploadInput : any;
  // @Input() supportedFileTypes: any;
  // @Input() supportedFileSize: any;
  @Output() titleCreated = new EventEmitter<fileDetails>();
  @ViewChild('fileFieldType') fileFieldType: any;
  fileFormat: string = '';
  fileChecksum: string = '';
  fileSize: string = '';
  fileSizeValidFlag: boolean = true;
  fileExtension: string = '';
  fileByteSize: any;
  fileActualName:string = '';
  invalidFileBackEndErrorMessage:string="";

  constructor(private commonService: CommonService) { }

  ngOnInit(): void { }

  selectFile(event: any): any {
    if (event.target.files[0]) {
      this.filemanager_addfile = event.target.files[0];
      this.fileActualName = this.filemanager_addfile.name;
      this.fileExtension = this.filemanager_addfile.name.slice(
        this.fileActualName.lastIndexOf('.') + 1,
        this.fileActualName.length
      )
      const isFileFormatValid = this.uploadInput.supportedFileTypes?.includes(this.fileExtension);
      const fileNamePattern = /^[a-zA-Z0-9]+([a-zA-Z0-9_-\s])+[a-zA-Z0-9]$/;
      const isFileNameValid = fileNamePattern.test(
        this.filemanager_addfile.name.slice(
          0,
          this.filemanager_addfile.name.lastIndexOf('.')
        )
      );

      let calc = event.target.files[0].size;
      calc = (calc / 1024);
      this.fileByteSize=calc.toString();
      this.fileSize = (calc / 1000).toFixed(6).toString();
      this.fileFormat = event.target.files[0].type;
      if (Math.round(calc / 1000) >= this.uploadInput.supportedFileSize) {
        this.fileSizeValidFlag = true;
      } else {
        this.fileSizeValidFlag = false;
      }
      const valid = isFileFormatValid && isFileNameValid && !this.fileSizeValidFlag;
      if (valid) {
        this.deleteImgSection = true;
      } else {
        this.deleteImgSection = false;
      }
      this.isLoadingCompelete = false;
      if (valid) {
        let formData: any = new FormData();
        formData.append(
          'bulkfile',
          this.filemanager_addfile,
          this.fileActualName
        );
        this.commonService.fileUpload(formData).subscribe(
          (response) => {
            this.isLoadingCompelete = true;
            this.fileUploadResponse = response;
            if (response.success === 'true') {
              this.showInvalidFileError = false;
              this.fileChecksum = response?.lChecksum;
              
              // const requestData = {
              //   title: response?.fileToRename,
              //   size: this.fileByteSize || '',
              //   format: this.fileExtension,
              //   checkSum: response?.lChecksum,
              //   typeValidFlag: isFileFormatValid,
              //   fileSizeValidFlag: this.fileSizeValidFlag,
              //   isFileNameValid: isFileNameValid,
              //   fileActualName:this.fileActualName
              // }
              // this.titleCreated.emit(requestData);
              const requestData = {
                  title: response?.fileToRename,
                  typeValidFlag: isFileFormatValid,
                  isFileNameValid: isFileNameValid
                }
              this.fileUploadEmit(requestData);
            } else {
              if(response?.OD_STATUS === "2"){
                this.invalidFileBackEndErrorMessage=response?.OD_STATUS_DESC
              }
              this.showInvalidFileError = true;           
              this.deleteImgSection = false;   
            }
          },
          (error) => { this.isLoadingCompelete = true;            
            this.deleteImgSection = false;
          }
        );
      } else {
        this.isLoadingCompelete = true;
        // const requestData = {
        //   title: this.filemanager_addfile.name ? this.filemanager_addfile.name : '',
        //   size: this.fileByteSize || '',
        //   format: this.fileExtension,
        //   checkSum: this.fileChecksum,
        //   typeValidFlag: isFileFormatValid,
        //   fileSizeValidFlag: this.fileSizeValidFlag,
        //   isFileNameValid: isFileNameValid,
        //   fileActualName:this.fileActualName
        // }
        const requestData = {
          typeValidFlag: isFileFormatValid,
          isFileNameValid: isFileNameValid
        }
      this.fileUploadEmit(requestData);
        // this.titleCreated.emit(requestData);
      }

    }
    this.fileFieldType.nativeElement.value = "";
  }

  fileUploadEmit(param:any){
  const requestData = {
    title: param.title ? param.title : '',
    size: this.fileByteSize || '',
    format: this.fileExtension,
    checkSum: this.fileChecksum,
    typeValidFlag: param.typeValidFlag,
    fileSizeValidFlag: this.fileSizeValidFlag,
    isFileNameValid: param.isFileNameValid,
    fileActualName:this.fileActualName
  }
  //console.log(requestData,"TEST::::")
    this.titleCreated.emit(requestData);
  }

  removeUpload() {
    this.filemanager_addfile = "";

    const requestData = {
      title: this.filemanager_addfile.name,
      // size: this.fileSize,
      // format: this.fileFormat,
      // checkSum: this.fileChecksum,
      typeValidFlag: true,
      // fileSizeValidFlag: false,
      isFileNameValid: true
    }
    this.fileUploadEmit(requestData);
    // this.titleCreated.emit(requestData);
    
    const requestObject = {
      originalFileName: this.fileUploadResponse.originalFileName,
      fileToRename: this.fileUploadResponse.fileToRename,
      lChecksum: this.fileUploadResponse.lChecksum,
      attachmentRefNumber: this.fileUploadResponse.attachmentRefNumber
    };
    this.isLoadingCompelete = false;
    this.commonService.deleteFile(requestObject).subscribe(
      (response) => {
        this.isLoadingCompelete = true;
        if (response.STATUS === 'SUCCESS') {
          this.deleteImgSection = true;
        }
        else {
          this.deleteImgSection = false;
        }
      },
      (error) => { this.isLoadingCompelete = true; }
    );
  }
}
