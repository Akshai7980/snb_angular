import { Component, OnInit } from '@angular/core';
import { PaymentsServiceService } from '../../services/payments-service.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Subscription } from 'rxjs';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-upload-bulk-beneficiary',
  templateUrl: './upload-bulk-beneficiary.component.html',
  styleUrls: ['./upload-bulk-beneficiary.component.scss'],
})
export class UploadBulkBeneficiaryComponent implements OnInit {
  isUpload: boolean = false;
  showReview: boolean = false;
  showReceipt: boolean = false;
  receiptData: any;
  hideInitiateButton: boolean = false;
  makerDate: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  url: string = '';
  isLoadingCompelete: boolean = true;
  authData = {
    param1: '',
    param2: '',
    authName: '',
    authNote: '',
    totalRecord: '',
    successfulRecord: '',
    rejectedRecord: '',
    PARSED_RULE_ID: '',
    SELECTION_FLAG: '',
    sefAuthFlag: '',
    isSingleUser: false,
    AUTH_TYPE_O:''
  };
  uploadDetailsData = {
    fileName: ' ',
    actualFileName: '',
    templateName: '',
    templateId: '',
    unitId: '',
    refNo: '',
    file_size: '',
    fileChecksum: '',
  };
  subscriptions: Subscription[] = [];
  otpError: string = '';
  pageCall:string ="";
  saveReceiptObject: any;
  pdfData:any;
  constructor(private paymentsService: PaymentsServiceService,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { 
    this.pageCall = 'beneficiary'
  }

  ngOnInit() {
    this.url = systemproperty.termsAndConditionsLinkForBenUpload;

    this.isUpload = true;
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
  }

  backTofileDetails(event: any) {
    this.isUpload = event;
    this.showReview = !event;
  }

  showReviewfn(event: any) {
    this.showReview = event.proceedBtn;
    this.uploadDetailsData = {
      fileName: event.fileName,
      actualFileName: event.actualFileName,
      templateName: event.templateName,
      templateId: event.templateId,
      unitId: event.unitId,
      refNo: event.refNo,
      file_size: event.file_size,
      fileChecksum: event.fileChecksum,
    };
    this.isUpload = !event.proceedBtn;
  }

  showReceiptfn(event: any) {
    this.authData.param1 = event.param1;
    this.authData.param2 = event.param2;
    this.authData.authName = event.authName;
    this.authData.authNote = event.authNote;
    this.authData.totalRecord = event.totalRecord;
    this.authData.successfulRecord = event.successfulRecord;
    this.authData.rejectedRecord = event.rejectedRecord;
    this.authData.PARSED_RULE_ID = event.PARSED_RULE_ID;
    this.authData.SELECTION_FLAG = event.SELECTION_FLAG;
    this.authData.sefAuthFlag = event.sefAuthFlag;
    this.authData.isSingleUser = event.isSingleUser;
    this.authData.AUTH_TYPE_O = event.AUTH_TYPE_O;

    this.submitApi();

  }

  submitApi() {
    const pararms = {
      REFERENCE_NUM: this.uploadDetailsData.refNo,
      FILE_NAME: this.uploadDetailsData.fileName,
      MAKER_DATE: this.makerDate,
      TEMPLATE_ID: this.uploadDetailsData.templateId,
      FILE_SIZE: this.uploadDetailsData.file_size,
      ACTUAL_FILE_NAME: this.uploadDetailsData.actualFileName,
      CRC_SUM: this.uploadDetailsData.fileChecksum,
      PARAM2: this.authData.param2,
      PARAM1: this.authData.param1,

      USER_NUMBER_LIST: `${this.rootScopeData?.userInfo.userNo}%${this.rootScopeData?.userInfo.USER_TYPE}`,
      SEL_PARSED_RULE_ID: this.authData.PARSED_RULE_ID,
      SELECTION_FLAG: this.authData.SELECTION_FLAG,
      sefAuthFlag: this.authData.sefAuthFlag,
      AUTH_TYPE_O :  this.authData.AUTH_TYPE_O
    };
    this.isLoadingCompelete = false;
    this.paymentsService.benSubmit(pararms).subscribe(
      (res:any) => {
        this.isLoadingCompelete = true;
        // if (res.dataValue?.REFERENCE_NUM && res.dataValue?.STATUS === "SUCCESS") {
        //   this.showReceipt = true;
        //   this.showReview = false;

        //   this.constructReceiptData(this.uploadDetailsData.refNo);
        // }else if(res.dataValue?.STATUS === "FAILED"){
        //   this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        // }
        if (res && res.dataValue && res.dataValue.OD_STATUS_DESC === "Success") {
          this.showReceipt = true;
          this.showReview = false;

          this.constructReceiptData(this.uploadDetailsData.refNo);
        }else if(res && res.dataValue && res.dataValue.OD_STATUS_DESC === "Failure"){
          this.otpError = this.authData.AUTH_TYPE_O==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
          // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        }else{
          this.otpError = this.authData.AUTH_TYPE_O==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
          // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        }
        
      },
      (error) => {
        this.isLoadingCompelete = true;
        this.showReceipt = false;
      }
    );
  }

  constructReceiptData(referenceNo: string) {
    this.receiptData = {
      msg1: 'LBL_UPLOAD_SUCCESSFUL',
      msg2: 'LBL_BENEFICIARY_HAS_UPLOADED',
      referenceNumber: referenceNo,
      showCallBackComponent: true,
      receiptDetails: [
        {
          title: 'LBL_UPLOAD_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_TEMPLATE_NAME',
              dataKey: this.uploadDetailsData.templateName,
            },
            {
              dispKey: 'LBL_FILE_NAME',
              dataKey: this.uploadDetailsData.fileName,
            },
            {
              dispKey: '',
              dataKey: '',
            },
          ],
        },
        {
          title: 'LBL_FILE_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_TOTAL_RECAORDS',
              dataKey: this.authData.totalRecord,
            },
            {
              dispKey: 'LBL_SUCCESSFUL_RECORDS',
              dataKey: this.authData.successfulRecord,
            },
            {
              dispKey: 'LBL_REJECTED_RECORDS',
              dataKey: this.authData.rejectedRecord,
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
        buttonLabel: 'LBL_INITIATE_ANOTHER_UPLOAD',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    if (!this.authData.isSingleUser)
      this.receiptData.receiptDetails.push(
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: this.authData.authName,
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: this.authData.authNote,
            },
          ],
        },
      );

      this.saveReceiptObject = {
        "pageheading": this.translateService.instant("LBL_UPLOAD_SUCCESSFUL"),
        "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
        "Description": this.translateService.instant("LBL_BENEFICIARY_HAS_UPLOADED"),
        "keyValues": [
          {
            "subHead": "Upload Details",
            "subValue": ""
          },
          {
            "subHead": "Template Name",
            "subValue": this.uploadDetailsData.templateName
          },
          {
            "subHead": "File Name",
            "subValue": this.uploadDetailsData.fileName
          },
          {
            "subHead": "File Details",
            "subValue": ""
          },
          {
            "subHead": "Total Records",
            "subValue": this.authData.totalRecord
          },
          {
            "subHead": "Successful Records",
            "subValue": this.authData.successfulRecord
          },
          {
            "subHead": "Rejected Records",
            "subValue": this.authData.rejectedRecord
          }
        ],
        "pagecall":"bulkbeneficiary",
        "refNo":referenceNo
      }
  }

  initiateAnotherRequest() {
    this.isUpload = true;
    this.showReceipt = false;
    this.showReview = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  downloadPdf(values:any)
      { 
      let SelectedType = values;
      // let currencyFormatPipeFilter = new CurrencyFormatPipe();
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_UPLOAD_SUCCESSFUL'), x:90, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_UPLOAD_DETAILS'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_TEMPLATE_NAME'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_FILE_NAME'), y:85},
        // { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_FILE_DETAILS'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_TOTAL_RECAORDS'), y:105},
        { type: 'heading', value:this.translateService.instant('LBL_SUCCESSFUL_RECORDS'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_REJECTED_RECORDS'), y:125},
        // { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
        { type: 'text', value:this.uploadDetailsData.templateName ? this.uploadDetailsData.templateName : '', y:75},
        { type: 'text', value:this.uploadDetailsData.fileName ? this.uploadDetailsData.fileName : '', y:85},
        // { type: 'text', value:this.fromAccountDetails[0].ALIAS_NAME ? this.fromAccountDetails[0].ALIAS_NAME : '', y:95},
        { type: 'text', value:this.authData.totalRecord? this.authData.totalRecord : '', y:105},
        { type: 'text', value:this.authData.successfulRecord? this.authData.successfulRecord : '', y:115},
        { type: 'text', value:this.authData.rejectedRecord ? this.authData.rejectedRecord : '', y:125},
        // { type: 'text', value: currencyFormatPipeFilter.transform(this.debAmt, this.debitCcy) + ' ' + this.debitCcy ?  currencyFormatPipeFilter.transform(this.debAmt, this.debitCcy) + ' ' + this.debitCcy : '', y:145},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:135},
        { type: 'text', value: this.uploadDetailsData.refNo ? this.uploadDetailsData.refNo : '', y:135},
        { type: 'heading', value:this.translateService.instant('LBL_BENEFICIARY_HAS_UPLOADED'), y:145},
        
      ]
      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'UploadBulkBeneficiary.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'UploadBulkBeneficiary.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
}
