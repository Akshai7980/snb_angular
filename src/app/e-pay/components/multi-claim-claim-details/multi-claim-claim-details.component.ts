import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { mobileNumberValidation } from 'src/app/utility/common-utility';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { EpayServiceService } from '../../services/epay-service.service';

@Component({
  selector: 'app-multi-claim-claim-details',
  templateUrl: './multi-claim-claim-details.component.html',
  styleUrls: ['./multi-claim-claim-details.component.scss'],
})
export class MultiClaimClaimDetailsComponent implements OnInit {
  claimTypes: any = [];

  claimType: string = '';
  description: string = '';
  mobileNumber: any;
  errMsg: any = {
    mobileNumber: false,
    claimType: false
  };

  showErr: string = '';
  uploadInput: any = {
    uploadFileTitle: 'Upload File',
    supportedFileSize: systemproperty.payrollDetailSupportedFileSize,
    supportedFileTypes: systemproperty.excelFileFormats,
  };
  fileUploadedDetails: any;
  downloadTemplateData: any = {
    flag: 'EPYMCD',
    moduleId: 'TMPDOWNLD',
    subPdt: 'EPYMCD',
    exportType: 'xls',
  };
  uploadedFile: any;

  pageType: string = '';

  isLoadingComplete: boolean = true;

  @Output() cancelEmit: EventEmitter<any> = new EventEmitter();
  @Output() proceedEmit: EventEmitter<any> = new EventEmitter();

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private ePayService: EpayServiceService) {}

  ngOnInit(): void {
    this.getEPayClaimTypes();
  }

  getEPayClaimTypes() {
    this.isLoadingComplete = false;
    const data = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.ePayService.getEPayClaimTypes(data).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res?.data[0].financialClaimType.length > 0) {
          this.claimTypes = res?.data[0].financialClaimType;
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  allowNumbersOnly(value: any): boolean {
    return mobileNumberValidation(value);
  }

  onFileAdded(event: any) {
    this.showErr = '';
    this.uploadedFile = null;
    if (event.fileSizeValidFlag) {
      this.showErr = 'LBL_SADAD_BULK_PAYMENT_SUPPORTED_FILE_SIZE';
      return;
    } else if (!event.typeValidFlag) {
      this.showErr = 'LBL_XLS_SUPPORTED_FILE';
      return;
    } else if (!event.isFileNameValid) {
      this.showErr = 'LBL_INVALID_FILE_NAME';
      return;
    }
    if (event.title) this.uploadedFile = event;
  }

  toCancel() {
    this.cancelEmit.emit();
  }

  proceedNext() {
    this.errMsg = {
      mobileNumber: false,
      claimType: false
    };
    this.showErr = '';
    if (!this.mobileNumber) {
      this.errMsg.mobileNumber = true;
    }
    if (!this.claimType) {
      this.errMsg.claimType = true;
    }
    if (!this.uploadedFile) {
      this.showErr = 'LBL_UPLOAD_FILE_ERR';
    }
    if (this.errMsg.mobileNumber || this.errMsg.claimType || !this.uploadedFile) return;
    this.fileUploadedDetails = {
      flag: 'FILEDLD',
      moduleId: 'FILEDLD',
      fileName: this.uploadedFile.title,
      fileActualName: this.uploadedFile.fileActualName,
    };
    this.pageType = 'review';
    const data = {
      claimType: this.claimType,
      description: this.description,
      mobileNumber: this.mobileNumber,
      uploadedFile: this.uploadedFile,
    };
    this.proceedEmit.emit(data);
  }

  validateInput(field: any, key: string) {
    if (field && field.length > 0) {
      this.errMsg[key] = false;
    }
  }
}
