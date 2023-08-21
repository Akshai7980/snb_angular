import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
@Component({
  selector: 'app-authorize-aramco-payment',
  templateUrl: './authorize-aramco-payment.component.html',
  styleUrls: ['./authorize-aramco-payment.component.scss']
})
export class AuthorizeAramcoPaymentComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  aramcoDetails: any;
  aramcoInvoiceDetails:any;
  autherizationDetailsObj: any;
  authListArray: any = [];
  showAuthorization = false;
  showAuthentication = false;
  authError: string = "";
  authType: any
  displayedColumns= ['invoiceNumber', 'valueDate', 'dueOn', 'invoiceAmount', 'amountInSar'];
  sefAuthFlag:any
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  constructor(private commonService:CommonService,private myTaskService:MyTaskService, private location: Location,private route: Router, private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) {
  }

  ngOnInit(): void {
    this.getAramcoDetails();
  }

  getAramcoDetails(){
    this.isLoadingCompelete = false;
    this.commonService.aramcoDetailsAPICall(this.rootScopeData.myTasksARAMCOSummaryObject.ref_NO).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      // debugger;
      this.aramcoDetails = res.data;
      this.aramcoInvoiceDetails = res.data.invoiceTxns;
      this.checkSecfactorAuth();
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

  onClickSubmit(){
    let params={
      refNumber:this.rootScopeData.myTasksARAMCOSummaryObject.ref_NO,
      productCode:this.rootScopeData.myTasksARAMCOSummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTasksARAMCOSummaryObject.subprcode,
      action:this.rootScopeData.myTasksARAMCOSummaryObject.function_ID,
      versionNumber:this.rootScopeData.myTasksARAMCOSummaryObject.version_NO,
      hostCode:this.rootScopeData.myTasksARAMCOSummaryObject.host_TXN_CODE,
      PARSED_RULE_ID:this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover
                    ? this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID
                    : '',
    SELECTION_FLAG:this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover ? 'Y' : '',
    sefAuthFlag: this.sefAuthFlag,
    USER_NUMBER_LIST: this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover
                      ? this.autherizationDetailsObj.selectedAprover.OD_USER_NO
                      : '',
    remarks: !this.autherizationDetailsObj ? '' : !this.autherizationDetailsObj.aproveNote ? '':this.autherizationDetailsObj.aproveNote

    }
    this.isLoadingCompelete = false;
      this.myTaskService.aramcoPaymentsAuthorizeApiCall(params).subscribe(
        response =>{
          this.isLoadingCompelete = true;         
          if(response.dataValue.STATUS === "Success"){
            this.constructReceiptData(response.dataValue.SELECTED_RECORDS);
            this.refNo = response.dataValue.SELECTED_RECORDS;
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
      
        }
      )
  }

  constructReceiptData(refNumber: any) {
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.aramcoInvoiceDetails.forEach((element:any) => {
      element.formattedInvoiceAmt = currencyFormatPipeFilter.transform(element.invoiceAmount.trim(), element.currency) + " " + element.currency;
    });
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_ARAMCO_PAYMENT_APPROVED",
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
        },
        {
          "title": 'LBL_AUTHORIZATION',
          "isTable": 'false',
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_Next_Approver",
              "dataKey": !this.autherizationDetailsObj ? 'Not Provided' : !this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? 'Not Provided' : this.autherizationDetailsObj.selectedAprover.AUTH_NAME
            },
            {
              "dispKey": "LBL_ADD_NEXT_APROVER",
              "dataKey": !this.autherizationDetailsObj ? 'Not Provided' : !this.autherizationDetailsObj.aproveNote ? 'Not Provided':this.autherizationDetailsObj.aproveNote
            },
          ],
        },
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
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_ARAMCO_PAYMENT"),
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
      this.route.navigate(['/mytask/payment/single-payments'])
    }
    else if(this.rootScopeData.paymentActiveTabName === 'sadad'){
      this.route.navigate(['/mytask/sadad/sadadsinglepayment'])
    }
  }

  checkSecfactorAuth() {
    let reqObj = {
      amount: "",
      gcif: "",
      accNo: "",
      debitCurrency: "",
      pymntCurrency: "", //?????
      subProdCode: "",
      debitUnitId:"",
      funcCode:"",
      productCode:"",
      referenceNo:"",
    }
    reqObj.amount = this.aramcoDetails ? this.aramcoDetails.paymentAmount : "";
    reqObj.gcif = this.rootScopeData.myTasksARAMCOSummaryObject.gcif;
    reqObj.accNo = this.rootScopeData.myTasksARAMCOSummaryObject.acc_NO;
    reqObj.debitCurrency = this.aramcoDetails ? this.aramcoDetails.debitCcy : "";
    reqObj.pymntCurrency = this.aramcoDetails ? this.aramcoDetails.debitCcy : "";
    reqObj.debitUnitId = this.aramcoDetails ? this.aramcoDetails.unitId : "";
    reqObj.referenceNo = this.aramcoDetails ? this.aramcoDetails.referenceNo : "";
    reqObj.productCode = this.aramcoDetails ? this.aramcoDetails.productCode : "";
    reqObj.subProdCode = this.rootScopeData.myTasksARAMCOSummaryObject.subprcode==='ARCODIRPAY'?'ARCODIRPAY':"ARAMCOPAY";
    reqObj.funcCode = "ARTXN";

    this.myTaskService.checkAuthorizationData(reqObj).subscribe((response: any) => {
      if (response) {       
        this.sefAuthFlag = response.data.selfAuth    
        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.authListArray = response.data.authList;
        }
      }
    }, error => {

    }

    )
  }

  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }

  onSecondFactorValue(authValue: any) {
    let vAuthvalue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
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
    { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_ARAMCO_PAYMENT"), x:80, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_ARAMCO_PAYMENT_APPROVED'), y:145},
    
  ]

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Authorize-Aramcopayment.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Authorize-Aramcopayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
cancel(){
  this.route.navigate(['/mytask/payment/single-payments'])
}
}
