import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from 'src/app/payroll/services/payroll.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-authorize-stop-payment',
  templateUrl: './authorize-stop-payment.component.html',
  styleUrls: ['./authorize-stop-payment.component.scss'],
})
export class AuthorizeStopPaymentComponent implements OnInit {
  isLoadingComplete: boolean = true;
  receiptForm: boolean = false;
  receiptData: any;
  authorsList: any[] = [];
  authDataObj: any;
  showAuthorization: boolean = true;
  authError: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  isSelfAuth: boolean = false;
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  rejectMsg : boolean = false;
  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly myTaskService: MyTaskService,
    private readonly payrollService: PayrollService,
    private translateService: TranslateService,private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {
    if (this.rootScopeData.selectedInquiryForStopPayment) {
      this.isLoadingComplete = false;
      this.payrollService
        .getStopPaymentAuthorizationDetails({
          unitId: this.rootScopeData.userInfo.UNIT_ID,
          accNo: this.rootScopeData.selectedInquiryForStopPayment.accNo,
        })
        .subscribe(
          (authorDetails: any) => {
            this.isLoadingComplete = true;
            this.authorsList = authorDetails.data.authList;
            this.isSelfAuth = authorDetails.data.selfAuth;
          },
          () => {
            this.isLoadingComplete = true;
            this.authorsList = [];
            this.isSelfAuth = false;
          }
        );
    }
  }

  initiateAnotherRequest(): void {
    this.router.navigate(['/mytask/Payroll/stop-payment']);
  }

  authorizationDetails(authorDetails: any): void {
    this.authDataObj = authorDetails;
  }

  authorizeStopPayment(): void {
    this.isLoadingComplete = false;
    this.myTaskService
      .authorizeStopPayment({
        referenceNo:
          this.rootScopeData.selectedInquiryForStopPayment.referenceNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID,
        authorId:
          this.authDataObj && this.authDataObj.selectedAprover
            ? this.authDataObj.selectedAprover.PARSED_RULE_ID
            : '',
        selfAuth: this.isSelfAuth,
        note: this.authDataObj ? this.authDataObj.aproveNote : '',
      })
      .subscribe(
        (response: any) => {
          this.isLoadingComplete = true;
          this.constructReceipt(response.dataValue);
          this.refNo = response.dataValue.SELECTED_RECORDS
        },
        () => {
          this.receiptForm = false;
          this.isLoadingComplete = true;
        }
      );
  }

  constructReceipt(successResponse: any): void {
    const selectedStopPayment =
      this.rootScopeData.selectedInquiryForStopPayment;
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    let flexiAuth = {
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey: this.authDataObj
            ? this.authDataObj.selectedAprover.AUTH_NAME
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey:
            !this.authDataObj || this.authDataObj.aproveNote === ''
              ? 'LBL_NOT_PROVIDED'
              : this.authDataObj.aproveNote,
        },
      ],
    }
    let message1 : any;
    let message2 :any;
    let rejectReasonFromAPi : any;
    let journalId :any;
    this.rejectMsg = false;
    let showAuth : boolean = false;
    if(successResponse.TXN_STATUS=== "AH"){
      message1 = "LBL_REQUEST_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED";
      journalId = successResponse.JOURNAL_ID
    }else if(successResponse.TXN_STATUS=== "RH"){
      message1 = "LBL_REQUEST_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      this.rejectMsg = true;
      rejectReasonFromAPi = successResponse.OD_REJECT_REASON;
    }else if(successResponse.TXN_STATUS=== "IO"){
      message1 = "LBL_REQUEST_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED_AND_SENT_FOR_ADDITIONAL_APPROVAL";
      showAuth = true;
    }else if(successResponse.TXN_STATUS=== "AO"){
      message1 = "LBL_REQUEST_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_REQUEST_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED";
    }
    
    this.receiptData = {
      // msg1: 'LBL_REQUEST_SUCCESSFULL',
      // msg2:
      //   this.rootScopeData.selectedStopPaymentType === 'file'
      //     ? 'LBL_STOP_PAYMENT_SUCCESS'
      //     : 'LBL_STOP_RECORD_PAYMENT_SUCCESS',
      "msg1":message1,
      "msg2":message2,
      "journalId":journalId ? journalId : "",
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      referenceNumber: successResponse.SELECTED_RECORDS,
      successResponse: '',
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: selectedStopPayment.makerName,
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: selectedStopPayment.accNo,
            },
          ],
        },
        {
          title: 'LBL_FILE_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Transaction_Id',
              dataKey: selectedStopPayment.uploadTransactionID,
            },
            {
              dispKey: 'LBL_FILE',
              dataKey: selectedStopPayment.fileName,
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: `${currencyFormatPipeFilter.transform(
                selectedStopPayment.totalAmt,
                selectedStopPayment.odTxnCy
              )} ${selectedStopPayment.odTxnCy}`,
            },
          ],
        },
        // {
        //   title: 'LBL_AUTHORIZATION',
        //   isTable: 'false',
        //   data: '',
        //   fieldDetails: [
        //     {
        //       dispKey: 'LBL_Next_Approver',
        //       dataKey: this.authDataObj
        //         ? this.authDataObj.selectedAprover.AUTH_NAME
        //         : 'LBL_NOT_PROVIDED',
        //     },
        //     {
        //       dispKey: 'LBL_ADD_NEXT_APROVER',
        //       dataKey:
        //         !this.authDataObj || this.authDataObj.aproveNote === ''
        //           ? 'LBL_NOT_PROVIDED'
        //           : this.authDataObj.aproveNote,
        //     },
        //   ],
        // },
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
    if (showAuth) {
      this.receiptData.receiptDetails.push(flexiAuth);
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_STOP_PAYMENT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.rootScopeData.selectedStopPaymentType === 'file'
      ? this.translateService.instant('LBL_STOP_PAYMENT_SUCCESS')
      : this.translateService.instant('LBL_STOP_RECORD_PAYMENT_SUCCESS'),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": selectedStopPayment.makerName ? selectedStopPayment.makerName : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": selectedStopPayment.accNo ? selectedStopPayment.accNo : "--"
        },
        {
          "subHead": "File Details",
          "subValue": ""
        },
        {
          "subHead": "Transaction Id",
          "subValue": selectedStopPayment.uploadTransactionID
        },
        {
          "subHead": "File",
          "subValue": selectedStopPayment.fileName
        },
        {
          "subHead": "Amount",
          "subValue": `${currencyFormatPipeFilter.transform(
            selectedStopPayment.totalAmt,
            selectedStopPayment.odTxnCy
          )} ${selectedStopPayment.odTxnCy}`
        }
      ],
      "pagecall":"stoppayauth",
      "refNo":successResponse.SELECTED_RECORDS
    }

    this.isSelfAuth.toString() === 'true' &&
      this.receiptData.receiptDetails.push({
        title: '',
        isTable: 'false',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: 'LBL_SUCCESS',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: successResponse.OD_STATUS_DESC,
          },
        ],
      });
    this.receiptForm = true;
  }
  onBackArrowClick(): void {
    this.location.back();
  }
  downloadPdf(values:any)
  { 
  let SelectedType = values;
  const currencyFormatPipeFilter = new CurrencyFormatPipe();
  let Amt = `${currencyFormatPipeFilter.transform( this.rootScopeData.selectedInquiryForStopPayment.totalAmt,
    this.rootScopeData.selectedInquiryForStopPayment.odTxnCy )} ${this.rootScopeData.selectedInquiryForStopPayment.odTxnCy}`
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_STOP_PAYMENT"), x:85, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_FILE_DETAILS'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_Transaction_Id'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_FILE'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:125},
    { type: 'text', value: this.rootScopeData.selectedInquiryForStopPayment.makerName ?  this.rootScopeData.selectedInquiryForStopPayment.makerName : '', y:75},
    { type: 'text', value:this.rootScopeData.selectedInquiryForStopPayment.accNo ? this.rootScopeData.selectedInquiryForStopPayment.accNo : '--' , y:85},
    { type: 'text', value:this.rootScopeData.selectedInquiryForStopPayment.uploadTransactionID ? this.rootScopeData.selectedInquiryForStopPayment.uploadTransactionID : '--' , y:105},
    { type: 'text', value:this.rootScopeData.selectedInquiryForStopPayment.fileName ? this.rootScopeData.selectedInquiryForStopPayment.fileName : '--' , y:115},
    { type: 'text', value: Amt ? Amt : '--' , y:125},
   
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNo? this.refNo : '', y:145},
    { type: 'heading', value: this.rootScopeData.selectedStopPaymentType === 'file' ? this.translateService.instant('LBL_STOP_PAYMENT_SUCCESS') : this.translateService.instant('LBL_STOP_RECORD_PAYMENT_SUCCESS'), y:155},
    
  ]

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Authorize-StopPayment.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Authorize-StopPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}
