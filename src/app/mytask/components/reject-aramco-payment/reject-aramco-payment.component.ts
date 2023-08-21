import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
@Component({
  selector: 'app-reject-aramco-payment',
  templateUrl: './reject-aramco-payment.component.html',
  styleUrls: ['./reject-aramco-payment.component.scss']
})
export class RejectAramcoPaymentComponent implements OnInit {
  rejectreason:string = '';
  isrejectreasonValid:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  details: any;
  receiptForm: boolean = false;
  aramcoDetails: any;
  aramcoInvoiceDetails:any;
  displayedColumns= ['invoiceNumber', 'valueDate', 'dueOn', 'invoiceAmount', 'amountInSar'];
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  constructor(private router:Router,private myTaskService:MyTaskService,private commonService:CommonService,private location: Location, private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.getAramcoDetails();
  }

  getAramcoDetails(){
    this.isLoadingCompelete = false;
    this.commonService.aramcoDetailsAPICall(this.rootScopeData.myTasksARAMCOSummaryObject.ref_NO).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.aramcoDetails = res.data;
      this.aramcoInvoiceDetails = res.data.invoiceTxns;
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

  textArea_Click(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  onClickSubmit(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
    let params={
      refNumber:this.rootScopeData.myTasksARAMCOSummaryObject.ref_NO,
      productCode:this.rootScopeData.myTasksARAMCOSummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTasksARAMCOSummaryObject.subprcode,
      action:this.rootScopeData.myTasksARAMCOSummaryObject.function_ID,
      versionNumber:this.rootScopeData.myTasksARAMCOSummaryObject.version_NO,
      hostCode:this.rootScopeData.myTasksARAMCOSummaryObject.host_TXN_CODE,
    }
    if(!this.isrejectreasonValid){
      this.isLoadingCompelete = false;
      this.myTaskService.aramcoPaymentsRejectApiCall(params,this.rejectreason).subscribe(
        (response:any) =>{
          this.isLoadingCompelete = true;         
          if(response.dataValue.STATUS === "Success"){
            this.constructReceiptData(response.dataValue.INTERNAL_REFERENCE_NO);
            this.refNo = response.dataValue.INTERNAL_REFERENCE_NO;
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
      
        }
      )
    }
  }

  constructReceiptData(refNumber: any) {
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.aramcoInvoiceDetails.forEach((element:any) => {
      element.formattedInvoiceAmt = currencyFormatPipeFilter.transform(element.invoiceAmount.trim(), element.currency) + " " + element.currency;
    });
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_ARAMCO_PAYMENT_REJECTED",
      "referenceNumber":refNumber,
      "receiptDetails": [
        {
            "title": "",
            "isTable": "false",
            "data": this.aramcoDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_DEBIT_ACCOUNT_NUMBER",
                "dataKey": this.aramcoDetails.debitAccNo
              },
              {
                  "dispKey": "LBL_DEBIT_BANK",
                  "dataKey": this.aramcoDetails.debitBank
              },
              {
                  "dispKey": "LBL_REMITTER_ID",
                  "dataKey": this.aramcoDetails.remitterId
              }
            ]
        },
        {
            "title": "LBL_PAY_TO",
            "isTable": "true",
            "data": this.aramcoInvoiceDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_INVOICE_NUMBER",
                "dataKey": "invoiceNo"
              },
              {
                  "dispKey": "LBL_CAPITAL_DUE_ON",
                  "dataKey": "invoiceDueDate"
              },
              {
                "dispKey": "LBL_INVOICE_AMOUNT",
                "dataKey": "formattedInvoiceAmt"
            }
            ]
        }
      ],
        "printButton":{
              "buttonLabel":"LBL_PRINT_RECEIPT",
              "buttonIcon":"./assets/images/PrinterIcon.png"
          },
        "saveButton":{
              "buttonLabel":"LBL_SAVE_RECEIPT",
              "buttonIcon":"./assets/images/saveReceipt.svg"
          },
        "initiateButton":{
              "buttonLabel":"LBL_MAKE_ANOTHER_AUTHORIZATION"
          },
        "finishButton":{
              "buttonLabel":"LBL_FINISH",
              "buttonPath":"/dashboard"
    }
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_REJECT_ARAMCO_PAYMENT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_ARAMCO_PAYMENT_APPROVED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Debit Account Number",
          "subValue": this.aramcoDetails.debitAccNo ? this.aramcoDetails.debitAccNo: '--'
        },
        {
          "subHead": "Debit Bank",
          "subValue": this.aramcoDetails.debitBank ? this.aramcoDetails.debitBank: '--'
        },
        {
          "subHead": "Remitter ID",
          "subValue": this.aramcoDetails.remitterId ? this.aramcoDetails.remitterId: '--'
        },
        {
          "subHead": "Pay To",
          "subValue": ""
        },
        {
          "subHead": "Invoice Number",
          "subValue": this.aramcoInvoiceDetails[0].invoiceNo ? this.aramcoInvoiceDetails[0].invoiceNo: '--'
        },
        {
          "subHead": "Due On",
          "subValue": this.aramcoInvoiceDetails[0].invoiceDueDate ? this.aramcoInvoiceDetails[0].invoiceDueDate: '--'
        },
        {
          "subHead": "Invoice Amount",
          "subValue": this.aramcoInvoiceDetails[0].invoiceAmount ? this.aramcoInvoiceDetails[0].invoiceAmount: '--'
        }
      ],
      "pagecall":"aramcoauthorized",
      "refNo":refNumber
    }
  }

  onBackArrowClick(){
    this.location.back();
  }

  initiateAnotherRequest(){
    if(this.rootScopeData.paymentActiveTabName === 'payments'){
      this.router.navigate(['/mytask/payment/single-payments'])
    }
    else if(this.rootScopeData.paymentActiveTabName === 'sadad'){
      this.router.navigate(['/mytask/sadad/sadadsinglepayment'])
    }
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
    { type: 'title', value:this.translateService.instant("LBL_REJECT_ARAMCO_PAYMENT"), x:80, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_DEBIT_ACCOUNT_NUMBER'), y:65},
    { type: 'heading', value:this.translateService.instant('LBL_DEBIT_BANK'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_REMITTER_ID'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_PAY_TO'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_INVOICE_NUMBER'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_CAPITAL_DUE_ON'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_INVOICE_AMOUNT'), y:125},
    { type: 'text', value:this.aramcoDetails.debitAccNo ? this.aramcoDetails.debitAccNo : '--' , y:65},
    { type: 'text', value:this.aramcoDetails.debitBank ? this.aramcoDetails.debitBank : '--' , y:75},
    { type: 'text', value:this.aramcoDetails.remitterId ? this.aramcoDetails.remitterId : '--' , y:85},
    { type: 'text', value:this.aramcoInvoiceDetails[0].invoiceNo ? this.aramcoInvoiceDetails[0].invoiceNo : '--' , y:105},
    { type: 'text', value:this.aramcoInvoiceDetails[0].invoiceDueDate ? this.aramcoInvoiceDetails[0].invoiceDueDate : '--' , y:115},
    { type: 'text', value:this.aramcoInvoiceDetails[0].invoiceAmount ? this.aramcoInvoiceDetails[0].invoiceAmount : '--' , y:125},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:135},
    { type: 'text', value: this.refNo? this.refNo : '', y:135},
    { type: 'heading', value:this.translateService.instant('LBL_ARAMCO_PAYMENT_REJECTED'), y:145},
    
  ]

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Reject-Aramcopayment.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Reject-Aramcopayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}

}
