import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { getPdf, logoprint } from 'src/app/utility/common-utility';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';

@Component({
  selector: 'app-standing-order-detail-layout',
  templateUrl: './standing-order-detail-layout.component.html',
  styleUrls: ['./standing-order-detail-layout.component.scss']
})
export class StandingOrderDetailLayoutComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowHistoryParams = {};
  printSection: string = '';
  logo :string ="";
  arrayofExecutionDetails: any;
  pdfData:any;
  standingOrderData: any;
  standingOrderDetails: any;
  paymentDetails: any;
  shownPrint:boolean=false;
  isshowndetailsPrint :boolean=true;
  pdfType:string="save";
  saveReceiptObject:any;
  constructor(private location: Location,private translateService:TranslateService,private transactionService: TransactionInquiryService, private downloadAsPdf:downloadAsPdf,) {
    this.logo = logoprint();
    this.setWorkFlowAndHistoryParams();
    this.getExecutuionDetails();
  }

  ngOnInit(): void {
    this.printSection="standingOrderInquiryPrinSection";
    if (!this.rootScopeData.standingOrderDetails) {
      this.location.back();
    }
    this.standingOrderData = this.rootScopeData.standingOrderDetails.summary;
    this.standingOrderDetails = this.rootScopeData.standingOrderDetails.details;
    this.paymentDetails = this.rootScopeData.standingOrderDetails.paymentDetails;
    this.sendDataForPrintandPdf();
  }

  setWorkFlowAndHistoryParams(): void {
  
    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.standingOrderDetails.summary.siRefNo,
      productCode:"PAYMNT",
      subProductCode:"RECPAY",
      functionCode:"RECUR",
    };
  }

  getExecutuionDetails(){
  
    let params = {
      refNo: this.rootScopeData.standingOrderDetails.summary.siRefNo
    }
    this.transactionService.getStandingOrderTXNDetails(params).subscribe((res:any)=>{
      if(res.data){
        let txnDetailsData = res.data;
        if(res.data.length){
          this.arrayofExecutionDetails = {
            "data": txnDetailsData,
            "fieldDetails": [
              {
                headKey : "LBL_REF_NUMBER",
                data: "siTxnRefNo"
              },
              {
                headKey : "LBL_DEBIT_ACCOUNT",
                data: "debitAccount"
              },
              {
                headKey : "LBL_DEBIT_AMT",
                data: "debitAmount"
              },
              {
                headKey : "LBL_CURRENCY",
                data: "siCurrency"
              },
              {
                headKey : "LBL_BENEFICIARY_ACCOUNT",
                data: "benefAcNo"
              },
              {
                headKey : "LBL_EXECUTION_DATE",
                data: "executionDate"
              },
              {
                headKey: "LBL_STATUS",
                data: "status"
              }
            ]
          };
        }
        else{
          this.arrayofExecutionDetails = '';
        }
      }
      else{
        this.arrayofExecutionDetails = '';
      }
     
    })
  }

  back(): void {
    this.location.back();
  } 

  selectDetailsPagePrint(){
    this.printPdf('standingOrderInquiryPrinSection','print');
  }

  sendDataForPrintandPdf(){
    let currencyFormat=new CurrencyFormatPipe()
    this.standingOrderData = this.rootScopeData.standingOrderDetails.summary;
    this.standingOrderDetails = this.rootScopeData.standingOrderDetails.details;
    this.paymentDetails = this.rootScopeData.standingOrderDetails.paymentDetails;
    let Amount =  currencyFormat.transform(this.standingOrderDetails.siAmount , this.standingOrderDetails.sicurrency) +" "+(this.standingOrderDetails.sicurrency?this.standingOrderDetails.sicurrency:"--");
    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_STANDINGORDER_TRANSFER_SUMMARY"),
      "subHeading": this.translateService.instant("LBL_TRANSFER_DETAILS"),
      "Description": "--",
      "keyValues": [
        {
          "subHead": "Credit Account Number",
          "subValue": this.standingOrderData.benefAcNo ? this.standingOrderData.benefAcNo : "--"
        },
        {
          "subHead": "Credit Account Name",
          "subValue": this.standingOrderData.benefName && this.standingOrderData.benefName.trim() !== "" ? this.standingOrderData.benefName : "--" 
        },
        {
          "subHead": "Debit Account Number",
          "subValue": this.standingOrderData.debitAccount ? this.standingOrderData.debitAccount :"--"
        },
        {
          "subHead": "Debit Account Name",
          "subValue": this.paymentDetails.res_Account_Name && this.paymentDetails.res_Account_Name.trim() !== "" ? this.paymentDetails.res_Account_Name : "--"
        },
        {
          "subHead": "Amount",
          "subValue": Amount?Amount: "--"
        },
        {
          "subHead": "Payment Start Date",
          "subValue": this.standingOrderDetails.firstPymtDate ? this.standingOrderDetails.firstPymtDate : "--"
        },
        {
          "subHead": "Payment Ends on/with",
          "subValue": this.standingOrderDetails.lastPymtDate ? this.standingOrderDetails.lastPymtDate : "--"
        },
        {
          "subHead": "Frequency",
          "subValue": this.standingOrderDetails.frequency ? this.standingOrderDetails.frequency:"--"
        },
        {
          "subHead": "Transaction Type",
          "subValue": this.standingOrderData.pymtType ? this.standingOrderData.pymtType : "--"
        }
      ],
      "pagecall":"standingordertransferdetails",
      "refNo":this.standingOrderData.siRefNo ? this.standingOrderData.siRefNo : "--"
    }
  }

  printPdf(id:any,printType:any) {
    let currencyFormat=new CurrencyFormatPipe()
    this.standingOrderData = this.rootScopeData.standingOrderDetails.summary;
    this.standingOrderDetails = this.rootScopeData.standingOrderDetails.details;
    this.paymentDetails = this.rootScopeData.standingOrderDetails.paymentDetails;
    let Amount =  currencyFormat.transform(this.standingOrderDetails.siAmount , this.standingOrderDetails.sicurrency) +" "+(this.standingOrderDetails.sicurrency?this.standingOrderDetails.sicurrency:"--");
    this.pdfData = 
    [
      { type:'setFontSize', size:11},
      { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
      { type:'setTextColor', val1:0, val2:0, val3:0},
      { type: 'title', value:"Standing order Transfer", x:85, y:35},
      { type:'setFontSize', size:10},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type:'setFontSize', size:10},
      { type: 'setFillColor', val1:128, val2:128, val3:128},
      { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
      { type:'setTextColor', val1:255, val2:255, val3:255},
      { type:'setFontSize', size:10},
      { type: 'heading', value:'Transfer Details', y:55},
      { type:'setTextColor', val1:0, val2:0, val3:0}, 
      { type:'setFontSize', size:9},
      { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
      { type: 'heading', value:this.translateService.instant('Credit Account Number'), y:65},
      { type: 'text', value:this.standingOrderData.benefAcNo ? this.standingOrderData.benefAcNo : "--", y:65},
      { type: 'heading', value:this.translateService.instant('Credit Account Name'), y:75},
      { type: 'text', value:this.standingOrderData.benefName && this.standingOrderData.benefName.trim() !== "" ? this.standingOrderData.benefName : "--" , y:75},
      { type: 'heading', value:this.translateService.instant('Debit Account Number'), y:85},
      {type:'text', value:this.standingOrderData.debitAccount ? this.standingOrderData.debitAccount :"--", y:85},
      { type: 'heading', value:this.translateService.instant('Debit Account Name'), y:95},
      {type:'text', value:this.paymentDetails.res_Account_Name && this.paymentDetails.res_Account_Name.trim() !== "" ? this.paymentDetails.res_Account_Name : "--", y:95},
      { type: 'heading', value:this.translateService.instant('Amount'), y:105},
      { type: 'text', value: Amount ? Amount : "--" , y:105},
      { type: 'heading', value:this.translateService.instant('LBL_PAYMENT_START_DATE'), y:115},
      {type:'text', value: this.standingOrderDetails.firstPymtDate ? this.standingOrderDetails.firstPymtDate : "--", y:115},
      { type: 'heading', value:this.translateService.instant('LBL_PAYMENT_ENDS_ON_WITH'), y:125},
      {type:'text', value:this.standingOrderDetails.lastPymtDate ? this.standingOrderDetails.lastPymtDate : "--", y:125},
      { type: 'heading', value:this.translateService.instant('LBL_FREQUENCY'), y:135},
      {type:'text', value:this.standingOrderDetails.frequency ? this.standingOrderDetails.frequency:"--", y:135},
      { type: 'heading', value:this.translateService.instant('Transaction Type'), y:145},
      { type: 'text', value: this.standingOrderData.pymtType ? this.standingOrderData.pymtType : "--" , y:145},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:155},
      { type: 'text', value: this.standingOrderData.siRefNo ? this.standingOrderData.siRefNo : "--", y:155},
    ]

    this.pdfData.push(
      { type: printType, value:'standingOrderDetails.pdf'}
    )
   this.downloadAsPdf.downloadpdf(this.pdfData);
}
  }


