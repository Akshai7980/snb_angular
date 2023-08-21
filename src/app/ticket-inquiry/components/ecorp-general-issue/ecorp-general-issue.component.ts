import { Component, Input, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TicketServiceService } from '../../services/ticket-service.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { mobileNumberValidation } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-ecorp-general-issue',
  templateUrl: './ecorp-general-issue.component.html',
  styleUrls: ['./ecorp-general-issue.component.scss'],
})
export class EcorpGeneralIssueComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  accountData: any;
  fromAccountsObject: any;
  norecordflag: boolean = false;
  isLoadingCompelete: boolean = true;
  mobileNo: any;
  description: any;
  uploadInput: any;
  fileData: any;
  convertedBase64Format: any;
  fileSizeValidationErrorMessage: boolean = false;
  fileTypeValidationErrorMessage: boolean = false;
  fileNameValidationErrorMessage: boolean = false;
  showEcorpDetails: boolean = false;
  showEcoprReview: boolean = false;
  hideDebitLookupData: boolean = true;
  reviewLabel: boolean = true;
  ecropGeneralDetails: any;
  ecorpGeneralBrowseDetails: any;
  ecropAccDetails: any;
  showTitle :boolean = true;
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    showMsg: 'true',
    showIcon: 'true',
  };
  constructor(private readonly ecorpService: TicketServiceService) {}

  ngOnInit() {
    this.getAccountList();
    this.toUploadInput();
  }

  getAccountList() {
    this.norecordflag = false;
    this.ecorpService.getAccountList().subscribe(
      (response: any) => {
        this.isLoadingCompelete = true;
        this.accountData = response.DATA.ALL_RECORDS;
        if (this.accountData && this.accountData.length > 0) {
          this.isLoadingCompelete = true;
          this.fromAccountsObject = {
            title: 'LBL_ACCOUNT',
            data: this.accountData,
            fieldDetails: [
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'LIAS_NAME',
              },
              {
                dispKey: 'LBL_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE_AMOUNT',
                dataKey: 'CURR_AVAIL_BAL_AMOUNT_NEW',
                dataKeySupport: 'OD_CCY_CODE',
              },
            ],
          };
        }
      },
      () => {
        this.isLoadingCompelete = false;
        this.norecordflag = true;
      }
    );
  }
  onFromAccountSelection(account: any) {
    if (account == 'iconClick') {
      this.fromAccountsObject = '';
      this.getAccountList();
      this.showEcorpDetails = false;
      this.showEcoprReview = false;
      this.mobileNo = '';
      this.description = '';
      this.ecorpGeneralBrowseDetails = {};
    } else {
      this.fromAccountsObject[0] = account;
      this.showEcorpDetails = true;
      this.ecropAccDetails = account;
    }
  }

  onFileAdded(eventData: any) {
    this.fileData = eventData;
    const fileData = JSON.stringify(this.fileData);
    this.convertedBase64Format = btoa(fileData);

    this.fileTypeValidationErrorMessage = eventData.typeValidFlag
      ? false
      : true;
    this.fileSizeValidationErrorMessage = eventData.fileSizeValidFlag
      ? true
      : false;
    this.fileNameValidationErrorMessage = eventData.isFileNameValid
      ? false
      : true;

    if (
      systemproperty.ecorpGeneralissueSupportedFileTypes.includes(
        eventData.format
      )
    ) {
      this.ecorpGeneralBrowseDetails = {
        uploadData: eventData,
        convertedBase64Format: this.convertedBase64Format,
      };
    }
  }

  toUploadInput() {
    this.uploadInput = {
      uploadFileTitle: 'Upload File',
      supportedFileTypes: systemproperty.ecorpGeneralissueSupportedFileTypes,
      supportedFileSize: systemproperty.benUploadSupportedFileSize,
    };
  }

  cancel() {
    this.fromAccountsObject = '';
    this.getAccountList();
    this.showEcorpDetails = false;
    this.showEcoprReview = false;
    this.mobileNo = '';
    this.description = '';
    this.ecorpGeneralBrowseDetails = {};
  }

  proceedToReview() {
    this.showEcoprReview = true;
    this.showEcorpDetails = false;
    this.showTitle = false;
    
    this.ecropGeneralDetails = {
      mobile: this.mobileNo,
      describtionDetails: this.description,
      uploadData: this.ecorpGeneralBrowseDetails && this.ecorpGeneralBrowseDetails.uploadData ? this.ecorpGeneralBrowseDetails.uploadData: "" ,
      convertedBase64Format:
        this.ecorpGeneralBrowseDetails && this.ecorpGeneralBrowseDetails.convertedBase64Format ? this.ecorpGeneralBrowseDetails.convertedBase64Format : "" ,
      ecropAccDetails: this.ecropAccDetails
    };
  }

  allowNumbersOnly(value: any): boolean {
    return mobileNumberValidation(value);
  }

  hideDebitLookup(hideDebitLookup: any) {
    if (hideDebitLookup === true) {
      this.hideDebitLookupData = false;
      this.reviewLabel = false;
    }
  }

  backToform(cancelBtn:any){
   if(cancelBtn === true){
    this.fromAccountsObject = '';
    this.getAccountList();
    this.showEcorpDetails = false;
    this.showEcoprReview = false;
    this.mobileNo = '';
    this.description = '';
    this.ecorpGeneralBrowseDetails = {};
   }
  }
}
