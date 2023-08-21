import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { PayrollService } from '../../services/payroll.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-sp-payment-review',
  templateUrl: './sp-payment-review.component.html',
  styleUrls: ['./sp-payment-review.component.scss'],
})
export class SpPaymentReviewComponent implements OnInit {
  isSubmitSuccessful: boolean = false;
  isLoadingComplete: boolean = true;
  isSelfAuth: boolean = false;

  selectedStopPaymentType: string = '';
  otpError: string = '';
  noAuthorError: string = '';
  url: string = '';
  userOtpValue: any = '';
  secAuthRef: string = '';

  authorsList: string[] = [];
  receiptObject: any = {};
  authDataObj: any;

  rootScopeData: RootScopeDeclare = RootScopeData;
  showAuthorization: boolean = false;
  isVendorPayment: boolean = false;
  saveReceiptObject:any;
  pdfData:any;
  refNo: any;

  constructor(
    private readonly router: Router,
    private readonly payrollService: PayrollService,
    private translateService: TranslateService, private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {
    this.isVendorPayment =
      this.router.url === '/payroll/vendor-stop-payment-review';
    if (this.rootScopeData.selectedInquiryForStopPayment) {
      this.selectedStopPaymentType = this.rootScopeData.selectedProxy;
    } else {
      this.cancelStopPaymentRequest();
    }
    this.url = systemproperty.termsAndConditionsForStopPayment;
    this.getStopPaymentAuthorizationDetails();
    this.authDataObj = {};
  }

  getStopPaymentAuthorizationDetails() {
    this.isLoadingComplete = false;
    this.payrollService
      .getStopPaymentAuthorizationDetails({
        unitId: this.rootScopeData.userInfo.UNIT_ID,
        accNo: this.rootScopeData.stopPaymentTransferDetails.accNo,
      })
      .subscribe(
        (response: any) => {
          this.isLoadingComplete = true;
          if (response.data.selfAuth == 'true') {
            this.isSelfAuth = true;
          }
          if (response.data.flexiAuth == 'true') {
            this.showAuthorization = true;
            this.authorsList = response.data.authList;
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  setSecondFactorValue(secondFactorValue: any): void {
    this.secAuthRef = secondFactorValue.data.secfRefNo;
  }

  getOtpValue(otp: string): void {
    if (otp) {
      // if (otp.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otp;
      this.submitStopPaymentRequest();
    } else {
      this.userOtpValue = '';
    }
  }

  setAuthorizationDetails(authDetails: any) {
    this.authDataObj = authDetails;
  }

  submitStopPaymentRequest(): void {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    this.isLoadingComplete = false;
    const fileData = this.rootScopeData.stopPaymentTransferDetails;
    this.payrollService
      .stopPaymentSubmit({
        odRefNo: fileData.referenceNum,
        FILENAME: fileData.fileName,
        FILEFORMATE: fileData.fileFormat,
        CAL: fileData.cal,
        SNBRECORDS: fileData.snbRecords,
        SNBAMT: fileData.snbAmt,
        OTHERBANKREC: fileData.otherBankRecs,
        BANKAMT: fileData.bankAmt,
        FEE: fileData.fee,
        TOTALRECS: fileData.totalRecs,
        TOTALAMT: fileData.totalAmt,
        TOTALFEE: fileData.totalFee,
        RECORDLIST: this.rootScopeData.selectedRecordsForReview,
        LEVEL: this.selectedStopPaymentType === 'file' ? 'file' : 'txn',
        SEL_PARSED_RULE_ID: this.authDataObj?.selectedAprover
          ? this.authDataObj.selectedAprover.PARSED_RULE_ID
          : '',
        SELECTION_FLAG: this.authDataObj?.selectedAprover ? 'Y' : 'N',
        USER_NUMBER_LIST: this.authDataObj?.selectedAprover?.OD_USER_NO
          ? `${this.authDataObj.selectedAprover.OD_USER_NO}%${this.authDataObj.selectedAprover.OD_ROLE_DESC}`
          : '',
        sefAuthFlag: this.isSelfAuth,
        fileSeqNo: this.rootScopeData.selectedInquiryForStopPayment.fileSeqNo,
        otp: this.userOtpValue,
        secRefAuth: this.secAuthRef,
      })
      .subscribe(
        (res) => {
          this.isLoadingComplete = true;
          this.refNo = res.dataValue.INPUT_REFERENCE_NO;
          this.constructReceiptData(res.dataValue, fileData);
          this.isSubmitSuccessful = true;
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  constructReceiptData(data: any, fileData: any) {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    const amount = currencyFormatPipeFilter.transform(
      fileData.amount.trim(),
      fileData.odTxnCy
    );
    this.receiptObject = {
      msg1: 'LBL_REQUEST_SUCCESSFULL',
      msg2:
        this.selectedStopPaymentType === 'file'
          ? 'LBL_STOP_PAYMENT_SUCCESS'
          : 'LBL_STOP_RECORD_PAYMENT_SUCCESS',
      referenceNumber: data.INPUT_REFERENCE_NO,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.loginID
                ? this.rootScopeData.userInfo.loginID
                : '',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: fileData.accNo,
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: fileData.nickName,
            },
          ],
        },
        {
          title: 'LBL_FILE_DETAILS',
          isTable: 'false',
          fieldDetails: [
            {
              dispKey: 'LBL_Transaction_Id',
              dataKey: fileData.uploadTransactionID,
            },
            {
              dispKey: 'LBL_FILE',
              dataKey: `${fileData.fileName}`,
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: `${amount} ${fileData.odTxnCy}`,
            },
          ],
        },
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey:
                this.authDataObj &&
                this.authDataObj.selectedAprover &&
                this.authDataObj.selectedAprover.AUTH_NAME
                  ? this.authDataObj.selectedAprover.AUTH_NAME
                  : 'LBL_NOT_PROVIDED',
            },
            {
              dispKey: 'LBL_NOTES_NEXT_APROVER',
              dataKey:
                !this.authDataObj || !this.authDataObj.aproveNote
                  ? 'LBL_NOT_PROVIDED'
                  : this.authDataObj.aproveNote,
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_UPLOAD_SUCCESSFUL"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_FILE_HAS_UPLOADED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.rootScopeData.userInfo.loginID
          ? this.rootScopeData.userInfo.loginID
          : '--'
        },
        {
          "subHead": "Account Number",
          "subValue": fileData.accNo ? fileData.accNo : '--'
        },
        {
          "subHead": "Short Name",
          "subValue": fileData.nickName ? fileData.nickName : '--'
        },
        {
          "subHead": "File Details",
          "subValue": ""
        },
        {
          "subHead": "Transaction Id",
          "subValue": fileData.uploadTransactionID
          ? fileData.uploadTransactionID
          : '--'
        },
        {
          "subHead": "File",
          "subValue": `${fileData.fileName}`
          ? `${fileData.fileName}`
          : '--'
        },
        {
          "subHead": "Amount",
          "subValue": `${amount} ${fileData.odTxnCy}`
          ? `${amount} ${fileData.odTxnCy}`
          : '--'
        }
      ],
      "pagecall":"stoppayment",
      "refNo":data.INPUT_REFERENCE_NO
    }

    if (this.rootScopeData.selectedRecordsForReview.length > 0) {
      this.receiptObject.receiptDetails.splice(2, 0, {
        isTable: 'false',
        fieldDetails: [
          {
            dispKey: 'LBL_RECORDS',
            dataKey: this.rootScopeData.selectedRecordsForReview.length,
          },
        ],
      });
    }

    this.isSelfAuth.toString() === 'true' &&
      this.receiptObject.receiptDetails.push({
        title: '',
        isTable: 'false',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: 'LBL_SUCCESS',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: data.OD_STATUS_DESC,
          },
        ],
      });
  }

  cancelStopPaymentRequest(): void {
    this.isVendorPayment
      ? this.router.navigate(['/payroll/vendor-stop-payment'])
      : this.router.navigate(['/payroll/stop-payment']);
  }

  downloadPdf(values:any)
      { 
      let SelectedType = values;
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      const fileData = this.rootScopeData.stopPaymentTransferDetails;
      let amount :any;
      if(fileData.amount){
        amount = currencyFormatPipeFilter.transform(
          fileData.amount.trim(),
          fileData.odTxnCy
        );
      }
  
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant("LBL_STOP_PAYMENT_RECEIPT"), x:80, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:0, val2:0, val3:0}, 
        { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_FILE_DETAILS'), y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_Transaction_Id'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_FILE'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:135},
        { type: 'text', value:this.rootScopeData.userInfo.loginID? this.rootScopeData.userInfo.loginID: '', y:75},
        { type: 'text', value:fileData.accNo ? fileData.accNo : '', y:85},
        { type: 'text', value:fileData.nickName ? fileData.nickName : '', y:95},
        { type: 'text', value:fileData.uploadTransactionID? fileData.uploadTransactionID : '', y:115},
        { type: 'text', value:`${fileData.fileName}`? `${fileData.fileName}` : '', y:125},
        { type: 'text', value:`${amount} ${fileData.odTxnCy}` ? `${amount} ${fileData.odTxnCy}` : '', y:135},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
        { type: 'text', value: this.refNo ? this.refNo : '', y:145},
        { type: 'heading', value:this.translateService.instant(this.selectedStopPaymentType === 'file'
        ? 'LBL_STOP_PAYMENT_SUCCESS'
        : 'LBL_STOP_RECORD_PAYMENT_SUCCESS'), y:155},
        
      ]
      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'stopPayment.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'stopPayment.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
}
