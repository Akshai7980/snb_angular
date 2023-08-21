import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
// import { getPdf } from 'src/app/utility/common-utility';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { getPdf, logoprint } from 'src/app/utility/common-utility';
import { Router } from '@angular/router';
@Component({
  selector: 'app-single-transfer-detail-layout',
  templateUrl: './single-transfer-detail-layout.component.html',
  styleUrls: ['./single-transfer-detail-layout.component.scss'],
})
export class SingleTransferDetailLayoutComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowHistoryParams = {};
  printSection: string = '';
  pdfData:any;
  // logo ="assets/images/snb-logo-print.png";
  logo :string ="";
  transferSummary: any;
  transferDetails: any;
  debitDetails: any;
  shownPrint:boolean=false;
  isshowndetailsPrint :boolean=true;
  pdfType:string="save";
  saveReceiptObject:any;
  constructor(private location: Location,private translateService:TranslateService, private downloadAsPdf:downloadAsPdf,private router: Router) {
    this.logo = logoprint();
    this.setWorkFlowAndHistoryParams()
    this.transferSummary = this.rootScopeData.transactionInquiry.summary;
  }

  ngOnInit(): void {
    this.printSection="singleTransferInquiryPrinSection";
    if (!this.rootScopeData.transactionInquiry) {
      this.location.back();
    }
    this.transferDetails = this.rootScopeData.transactionInquiry.details;
    this.debitDetails = this.rootScopeData.transactionInquiry.paymentDetails;
    this.sendDataForPrintandPdf();
  }

  sendDataForPrintandPdf(){
    let currencyFormat=new CurrencyFormatPipe()
    let Amount = (currencyFormat.transform(this.transferSummary.paymentAmt , this.transferSummary.payment_CURRENCY)) +" "+ (this.transferSummary.payment_CURRENCY?this.transferSummary.payment_CURRENCY:'' );
    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_SINGLE_TRANSFER_SUMMARY"),
      "subHeading": this.translateService.instant("LBL_TRANSFER_DETAILS"),
      "Description": this.transferSummary.odStatus ? this.transferSummary.odStatus : "--",
      "keyValues": [
        {
          "subHead": "Credit Account Number",
          "subValue": this.transferSummary.benefAccNo ? this.transferSummary.benefAccNo : "--"
        },
        {
          "subHead": "Credit Account Name",
          "subValue": this.transferSummary.benefName && this.transferSummary.benefName.trim() !== "" ? this.transferSummary.benefName : "--"
        },
        {
          "subHead": "Debit Account Number",
          "subValue": this.transferDetails.debitNumber ? this.transferDetails.debitNumber : "--"
        },
        {
          "subHead": "Debit Account Name",
          "subValue": this.debitDetails.res_Account_Name && this.debitDetails.res_Account_Name.trim() !== "" ? this.debitDetails.res_Account_Name : "--"
        },
        {
          "subHead": "Amount",
          "subValue": Amount?Amount: "--"
        },
        {
          "subHead": "Transaction Date",
          "subValue": this.transferSummary.valueDate ? this.transferSummary.valueDate : "--"
        },
        {
          "subHead": "Transaction Type",
          "subValue": this.transferDetails.paymentTypeDesc ? this.transferDetails.paymentTypeDesc : "--"
        },
        {
          "subHead": "Purpose",
          "subValue": this.transferDetails.secPurposeCodeDesc ? this.transferDetails.secPurposeCodeDesc : "--"
        },
        {
          "subHead": "Relationship",
          "subValue": this.transferDetails.relCodeDesc ? this.transferDetails.relCodeDesc : "--"
        },
        {
          "subHead": "Fee",
          "subValue": this.transferDetails.chargeAmt ? this.transferDetails.chargeAmt.concat("SAR") : "--"
        },
        {
          "subHead": "VAT",
          "subValue": this.transferDetails.vatAmt ? this.transferDetails.vatAmt.concat("SAR") : "--"
        },
        {
          "subHead": "Journal ID",
          "subValue": this.transferDetails.journalId ? this.transferDetails.journalId : "--"
        },
        {
          "subHead": "Reject Reason",
          "subValue": this.transferDetails.rejectReason ? this.transferDetails.rejectReason : "--"
        }
      ],
      "pagecall":"singletransferdetails",
      "refNo":this.transferSummary.ref_NO ? this.transferSummary.ref_NO : ''
    }
  }

  setWorkFlowAndHistoryParams(): void {
    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.transactionInquiry.summary.referenceNo,
      productCode:
        this.rootScopeData.transactionInquiry.summary.product_CODE,
      subProductCode:
        this.rootScopeData.transactionInquiry.summary.subProductCode,
      functionCode:
        this.rootScopeData.transactionInquiry.summary.function_ID,
      
    };
  }

  back(): void {
    this.rootScopeData.backToPagination.resFlag = 'Y';
    this.rootScopeData.backToPagination.resFlagForService = 'Y';
    this.router.navigate(['/transactionInquiry/singleTransfer'])
    // this.location.back();
  }

  selectDetailsPagePrint(){
    this.printPdf('singleTransferInquiryPrinSection','print');
  }


  printPdf(id:any ,printtype:any) {

    let currencyFormat=new CurrencyFormatPipe()
    let Amount = (currencyFormat.transform(this.transferSummary.paymentAmt , this.transferSummary.payment_CURRENCY)) +" "+ (this.transferSummary.payment_CURRENCY?this.transferSummary.payment_CURRENCY:'' );
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:"Single Transfer Summary", x:85, y:35},
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
        { type: 'text', value:this.transferSummary.benefAccNo ? this.transferSummary.benefAccNo : "--", y:65},
        { type: 'heading', value:this.translateService.instant('Credit Account Name'), y:75},
        { type: 'text', value:this.transferSummary.benefName && this.transferSummary.benefName.trim() !== "" ? this.transferSummary.benefName : "--", y:75},
        { type: 'heading', value:this.translateService.instant('Debit Account Number'), y:85},
        { type: 'text', value:this.transferDetails.debitNumber ? this.transferDetails.debitNumber : "--", y:85},
        { type: 'heading', value:this.translateService.instant('Debit Account Name'), y:95},
        { type: 'text', value:this.debitDetails.res_Account_Name && this.debitDetails.res_Account_Name.trim() !== "" ? this.debitDetails.res_Account_Name : "--", y:95},
        { type: 'heading', value:this.translateService.instant('Amount'), y:105},
        { type: 'text', value:Amount?Amount: "--", y:105},
        { type: 'heading', value:this.translateService.instant('Transaction Date'), y:115},
        { type: 'text', value:this.transferSummary.txnDate ? this.transferSummary.txnDate : "--", y:115},
        { type: 'heading', value:this.translateService.instant('Transaction Type'), y:125},
        { type: 'text', value:this.transferDetails.paymentTypeDesc ? this.transferDetails.paymentTypeDesc : "--", y:125},
        { type: 'heading', value:this.translateService.instant('Purpose'), y:135},
        { type: 'text', value:this.transferDetails.secPurposeCodeDesc ? this.transferDetails.secPurposeCodeDesc : "--", y:135},
        { type: 'heading', value:this.translateService.instant('Relationship'), y:145},
        { type: 'text', value:this.transferDetails.relCodeDesc ? this.transferDetails.relCodeDesc : "--", y:145},
        { type: 'heading', value:this.translateService.instant('Fee'), y:155},
        { type: 'text', value:this.transferDetails.chargeAmt ? this.transferDetails.chargeAmt.concat("SAR") : "--", y:155},
        { type: 'heading', value:this.translateService.instant('VAT'), y:165},
        { type: 'text', value:this.transferDetails.vatAmt ? this.transferDetails.vatAmt.concat("SAR") : "--", y:165},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:175},
        { type: 'text', value: this.transferSummary.ref_NO ? this.transferSummary.ref_NO : '', y:175},
        { type: 'heading', value:this.translateService.instant('LBL_STATUS'), y:185},
        { type: 'text', value: this.transferSummary.odStatus ? this.transferSummary.odStatus : "--" , y:185}
      ]

      this.pdfData.push(
        { type: printtype, value:'singleTransferDetails.pdf'}
      )
     this.downloadAsPdf.downloadpdf(this.pdfData);
  }

}
