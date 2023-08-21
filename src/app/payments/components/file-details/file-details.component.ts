import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { PaymentsServiceService } from '../../services/payments-service.service';
import { TemplateGuidelineComponent } from '../template-guideline/template-guideline.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss'],
})
export class FileDetailsComponent implements OnInit {
  file_size: string = '';
  fileSizeValidationErrorMessage: boolean = false;
  fileTypeValidationErrorMessage: boolean = false;
  fileNameValidationErrorMessage: boolean = false;
  uploadInput: any;
  templateName: any = '';
  templeteNamesList: any;
  isLoadingCompelete: boolean = true;
  showNextSection: boolean = false;
  makerDate: string = '';
  filename: any;
  actualFileName: any;
  fileFormat: any;
  fileChecksum: any;
  proceedBtnShow: boolean = false;
  downloadTemplateData: any;
  templateNames: any;
  templateId: any;
  unitId: any;
  templateData = {
    templateName: '',
    templateId: '',
    fileName: '',
    actualFileName: '',
    unitId: '',
    refNo: '',
    file_size: '',
    fileChecksum: '',
    proceedBtn: false,
  };
  subscriptions: Subscription[] = [];

  @Output() proceedBtn = new EventEmitter();
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    public dialog: MatDialog,
    public paymentServices: PaymentsServiceService
  ) { }

  ngOnInit() {
    this.getTemplateName();

    const date = new Date();
    const currentDateNumber =
      date.getFullYear() +
      '-' +
      ('0' + date.getMonth()).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2);
    const time =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    this.makerDate = currentDateNumber + ' ' + time;

    this.uploadInput = {
      uploadFileTitle: 'Upload File',
      supportedFileTypes: systemproperty.benUploadSupportedFileType,
      supportedFileSize: systemproperty.benUploadSupportedFileSize,
    };
  }

  //azax loader
  //template name section
  getTemplateName() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.isLoadingCompelete = false;
    const tempName = this.paymentServices.getTemplateName(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data.templateDetails) {
          this.isLoadingCompelete = true;
          this.templeteNamesList = res.data.templateDetails;
        } else {
          this.isLoadingCompelete = false;
        }
      },
      (error) => {
        this.isLoadingCompelete = false;
      }
    );
    this.subscriptions.push(tempName);
  }

  openDialog() {
    this.dialog.open(TemplateGuidelineComponent, {
      height: '450px',
      width: '845px',
      data: this.templateData,
    });
  }

  onSelectedTemplateName(event: any, type: any) {
    if (event) {
      this.showNextSection = true;
      this.templateNames = type.templateName;
      this.templateId = type.templateId;
      this.unitId = type.unitId;

      this.templateData = {
        templateName: this.templateNames,
        templateId: this.templateId,
        fileName: this.filename,
        actualFileName: this.actualFileName,
        unitId: this.unitId,
        refNo: '',
        file_size: this.file_size, //format
        fileChecksum: this.fileChecksum,
        proceedBtn: this.proceedBtnShow,
      };
      this.downloadTemplateData = {
        flag: 'BENEUP',
        moduleId: 'BENTMPDOWNLD',
        subPdt: 'BENEUP',
        templateId: type.templateId,
        exportType: 'csv',
        type:this.templateName
      };
    }
  }

  onFileAdded(eventData: any) {
    this.filename = eventData.title;
    this.actualFileName = eventData.fileActualName;
    this.file_size = eventData.size;
    this.fileFormat = eventData.format;
    this.fileChecksum = eventData.checkSum;
    this.fileTypeValidationErrorMessage = eventData.typeValidFlag
      ? false
      : true;
    this.fileSizeValidationErrorMessage = eventData.fileSizeValidFlag
      ? true
      : false;
    this.fileNameValidationErrorMessage = eventData.isFileNameValid
      ? false
      : true;
    this.templateData = {
      templateName: this.templateNames,
      templateId: this.templateId,
      fileName: this.filename,
      actualFileName: this.actualFileName,
      unitId: this.unitId,
      refNo: '',
      file_size: this.file_size,
      fileChecksum: this.fileChecksum,
      proceedBtn: this.proceedBtnShow,
    };

    if (
      this.filename &&
      !this.fileSizeValidationErrorMessage &&
      !this.fileTypeValidationErrorMessage &&
      !this.fileNameValidationErrorMessage
    ) {
      this.proceedBtnShow = true;
    } else {
      this.proceedBtnShow = false;
    }
  }

  resetAll() {
    this.templateName = '';
    this.showNextSection = false;
    this.fileTypeValidationErrorMessage = false;
    this.fileSizeValidationErrorMessage = false;
  }

  proceedFn() {
    const params = {
      FILE_NAME: this.filename,
      MAKER_DATE: this.makerDate,
      TEMPLATE_ID: this.templateId,
      FILE_SIZE: this.file_size,
      ACTUAL_FILE_NAME: this.actualFileName,
      CRC_SUM: this.fileChecksum,
    };
    this.isLoadingCompelete = false;

    const proceed = this.paymentServices.benProceed(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        if (res) {
          this.templateData = {
            templateName: this.templateNames,
            templateId: this.templateId,
            fileName: this.filename,
            actualFileName: this.actualFileName,
            unitId: this.unitId,
            file_size: this.file_size,
            fileChecksum: this.fileChecksum,
            refNo: res.data.REFERENCE_NUM,
            proceedBtn: this.proceedBtnShow,
          };
          this.proceedBtn.emit(this.templateData);
        }
      },
      (error) => {
        this.isLoadingCompelete = false;
      }
    );
    this.subscriptions.push(proceed);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
