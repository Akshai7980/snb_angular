import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-reject-stop-payment',
  templateUrl: './reject-stop-payment.component.html',
  styleUrls: ['./reject-stop-payment.component.scss'],
})
export class RejectStopPaymentComponent implements OnInit {
  isLoadingComplete: boolean = true;
  receiptForm: boolean = false;
  receiptData: any;
  rejectReason: string = '';
  rejectReasonInvalid: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  rejectMsg = true;
  constructor(
    private location: Location,
    private readonly router: Router,
    private readonly myTaskService: MyTaskService,
    private translateService: TranslateService,private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {}

  initiateAnotherRequest(): void {
    this.router.navigate(['/mytask/Payroll/stop-payment']);
  }

  rejectStopPayment(): void {
    // this.rejectReasonInvalid = this.rejectReason ? false : true;
    if (!this.rejectReasonInvalid) {
      this.rejectReasonInvalid = false;
      this.isLoadingComplete = false;
      this.myTaskService
        .rejectStopPayment({
          referenceNo:
            this.rootScopeData.selectedInquiryForStopPayment.referenceNo,
          unitId: this.rootScopeData.userInfo.UNIT_ID,
          rejectReason: this.rejectReason,
        })
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;
            if (
              response &&
              response.dataValue &&
              response.dataValue.STATUS &&
              response.dataValue.STATUS === 'Success'
            ) {
              this.receiptForm = true;
              this.constructReceipt(response.dataValue.SELECTED_RECORDS);
              this.refNo = response.dataValue.SELECTED_RECORDS
            }
          },
          () => {
            this.receiptForm = false;
            this.isLoadingComplete = true;
          }
        );
    } else {
      this.rejectReasonInvalid = true;
    }
  }

  constructReceipt(referenceNumber: string): void {
    const selectedStopPayment =
      this.rootScopeData.selectedInquiryForStopPayment;
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.receiptData = {
      msg1: 'LBL_REQUEST_SUCCESSFULL',
      msg2:
        this.rootScopeData.selectedStopPaymentType === 'file'
          ? 'LBL_STOP_PAYMENT_REJECTED'
          : 'LBL_STOP_RECORD_PAYMENT_REJECTED',
      referenceNumber: referenceNumber,
      data: '',
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
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
      "pageheading": this.translateService.instant("LBL_REJECT_STOP_PAYMENT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.rootScopeData.selectedStopPaymentType === 'file'
      ? this.translateService.instant('LBL_STOP_PAYMENT_REJECTED')
      : this.translateService.instant('LBL_STOP_RECORD_PAYMENT_REJECTED'),
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
      "refNo":referenceNumber
    }
  }

  onBackArrowClick(): void {
    this.location.back();
  }

  validateRejectReason(): void {
    // this.rejectReasonInvalid = !(this.rejectReason && this.rejectReason.length);
    // this.rejectReasonInvalid = this.rejectReason ? false : true;
  }

  validateSpace(event: any): void {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
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
    { type: 'title', value:this.translateService.instant("LBL_REJECT_STOP_PAYMENT"), x:85, y:35},
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
    { type: 'heading', value: this.rootScopeData.selectedStopPaymentType === 'file' ? this.translateService.instant('LBL_STOP_PAYMENT_REJECTED') : this.translateService.instant('LBL_STOP_RECORD_PAYMENT_REJECTED'), y:155},
    
  ]

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Reject-StopPayment.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Reject-StopPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}
