import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-authorize-esal-payment',
  templateUrl: './authorize-esal-payment.component.html',
  styleUrls: ['./authorize-esal-payment.component.scss']
})
export class AuthorizeEsalPaymentComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  refNum: any;
  isLoadingCompelete = true;
  esalDetails: any;
  esalBillerDetails: any;
  receiptForm: boolean = false;
  receiptData: any;
  paymentCCY: any;
  displayedColumns= ['nickName', 'name', 'subscriberId', 'dueDate', 'amount'];
  sefAuthFlag: any;
  showAuthorization: boolean = false;
  authOptions: any;
  authDataObj: any;
  pdfData: any;
  saveReceiptObject:any;
  rejectMsg : boolean = false;
  constructor(private commonService:CommonService,private myTaskService:MyTaskService, private location: Location,private route: Router, private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { 
  }

  ngOnInit(): void {
    this.refNum = this.rootScopeData.myTasksESALSummaryObject.ref_NO;
    this.getEsalDetails();
    this.checkSecfactorAuth();
  }

  getEsalDetails(){
    this.isLoadingCompelete = false;
    this.commonService.esalDetailsAPICall(this.refNum).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.esalDetails = res.data;
      this.esalBillerDetails = res.data.selectedBillers;
      this.paymentCCY = res.data.paymentCcy;
      
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

  onClickSubmit(){
      this.isLoadingCompelete = false;
      let authdataObjKeys = {
        PARSED_RULE_ID:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.OD_RULE_PARSE_ID
          : '',
      SELECTION_FLAG:
        this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
      sefAuthFlag: this.sefAuthFlag,
      USER_NUMBER_LIST: this.authDataObj && this.authDataObj.selectedAprover
      ? this.authDataObj.selectedAprover.OD_USER_NO
      : '',
      remarks: !this.authDataObj ? '' : !this.authDataObj.aproveNote ? '':this.authDataObj.aproveNote
      }
      this.myTaskService.esalPaymentsAuthorizeApiCall(this.esalDetails,this.rootScopeData.myTasksESALSummaryObject,authdataObjKeys).subscribe(
        response =>{
          this.isLoadingCompelete = true;         
          if(response.dataValue.STATUS === "Success"){
            this.constructReceiptData(response.dataValue.SELECTED_RECORDS,response.dataValue);
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
      
        }
      )
  }

  constructReceiptData(refNumber: any,data :any) {
    let flexiAuth= {
        "title": 'LBL_AUTHORIZATION',
        "isTable": 'false',
        "data": '',
        "fieldDetails": [
          {
            "dispKey": "LBL_Next_Approver",
            "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.selectedAprover.AUTH_NAME ? 'Not Provided' : this.authDataObj.selectedAprover.AUTH_NAME
          },
          {
            "dispKey": "LBL_ADD_NEXT_APROVER",
            "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.aproveNote ? 'Not Provided':this.authDataObj.aproveNote
          },
        ],
      }
    let message1 : any;
    let message2 :any;
    let rejectReasonFromAPi : any;
    let journalId :any;
    this.rejectMsg = false;
    let showAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED";
      journalId = data.JOURNAL_ID
    }else if(data.TXN_STATUS=== "RH"){
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      this.rejectMsg = true;
      rejectReasonFromAPi = data.OD_REJECT_REASON;
    }else if(data.TXN_STATUS=== "IO"){
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED_AND_SENT_FOR_ADDITIONAL_APPROVAL";
      showAuth = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED";
    }
    this.receiptData = {
      // "msg1":"LBL_CONFIRMATION",
      // "msg2":"LBL_ESAL_PAYMENT_APPROVED",
      "msg1":message1,
      "msg2":message2,
      "journalId":journalId ? journalId : "",
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      "referenceNumber":refNumber,
      "receiptDetails": [
        {
            "title": "LBL_FROM",
            "isTable": "false",
            "data": this.esalDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_ACCOUNT_NAME",
                "dataKey": this.esalDetails.debitAccName
              },
              {
                  "dispKey": "LBL_ACC_NUMBER",
                  "dataKey": this.esalDetails.debitAccNo
              },
              {
                  "dispKey": "LBL_BANK",
                  "dataKey": this.esalDetails.debitBank
              }
            ]
        },
        {
            "title": "LBL_PAY_TO",
            "isTable": "true",
            "data": this.esalBillerDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_SUBSCRIBER_ID",
                "dataKey": "subscriberID"
              },
              {
                  "dispKey": "LBL_BILLER_NAME",
                  "dataKey": "billerName"
              },
              {
                "dispKey": "LBL_DUE_DATE",
                "dataKey": "dueDate"
            }
            ]
        },
        // {
        //   "title": 'LBL_AUTHORIZATION',
        //   "isTable": 'false',
        //   "data": '',
        //   "fieldDetails": [
        //     {
        //       "dispKey": "LBL_Next_Approver",
        //       "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.selectedAprover.AUTH_NAME ? 'Not Provided' : this.authDataObj.selectedAprover.AUTH_NAME
        //     },
        //     {
        //       "dispKey": "LBL_ADD_NEXT_APROVER",
        //       "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.aproveNote ? 'Not Provided':this.authDataObj.aproveNote
        //     },
        //   ],
        // },
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
    if (showAuth) {
      this.receiptData.receiptDetails.push(flexiAuth);
    }
    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_ESAL_PAYMENT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_ESAL_PAYMENT_APPROVED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Account Name",
          "subValue": this.esalDetails.debitAccName ? this.esalDetails.debitAccName : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.esalDetails.debitAccNo ? this.esalDetails.debitAccNo : "--"
        },
        {
          "subHead": "Bank Name",
          "subValue": this.esalDetails.debitBank ? this.esalDetails.debitBank : "--"
        },
        {
          "subHead": "Pay To",
          "subValue": ""
        },
        {
          "subHead": "Subscriber ID",
          "subValue": this.esalBillerDetails[0].subscriberID ? this.esalBillerDetails[0].subscriberID : "--"
        },
        {
          "subHead": "Biller Name",
          "subValue": this.esalBillerDetails[0].billerName ? this.esalBillerDetails[0].billerName : "--"
        },
        {
          "subHead": "Due Date",
          "subValue": this.esalBillerDetails[0].dueDate ? this.esalBillerDetails[0].dueDate : "--"
        }
      ],
      "pagecall":"esalpayauth",
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
    let sadadData = this.rootScopeData.myTasksESALSummaryObject;
    let data = {
      gcif: "",
      cif: sadadData.cif_no,
      productCode: sadadData.product_CODE,
      subProdCode: sadadData.subprcode,
      funcCode: sadadData.function_ID,
      amount: sadadData.debit_AMOUNT,
      accNo: sadadData.debit_ACC_NO,
      pymntCurrency: sadadData.payment_CURRENCY,
      debitCurrency: sadadData.debit_CURRENCY,
      referenceNo:sadadData.ref_NO
    }
    this.myTaskService.checkAuthorizationData(data).subscribe((res)=>{

      if (res) {
        this.sefAuthFlag = res.data.selfAuth
        if (res.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.authOptions = res.data.authList;
        }
        // this.isLoadingCompelete = true;
      }
    }, error => {
      // this.isLoadingCompelete = true;
    })
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj =  autherizationDetailsObj;
  }
  downloadPdf(values:any)
  { 
  let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_ESAL_PAYMENT"), x:80, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_ACCOUNT_NAME'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_BANK'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_PAY_TO'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_SUBSCRIBER_ID'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_BILLER_NAME'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_DUE_DATE'), y:135},
    { type: 'text', value:this.esalDetails.debitAccName ? this.esalDetails.debitAccName : '--', y:75},
    { type: 'text', value:this.esalDetails.debitAccNo ? this.esalDetails.debitAccNo : '--', y:85},
    { type: 'text', value:this.esalDetails.debitBank ? this.esalDetails.debitBank : '--', y:95},
    { type: 'text', value:this.esalBillerDetails[0].subscriberID ? this.esalBillerDetails[0].subscriberID : '--', y:115},
    { type: 'text', value:this.esalBillerDetails[0].billerName ? this.esalBillerDetails[0].billerName : '--', y:125},
    { type: 'text', value:this.esalBillerDetails[0].dueDate ? this.esalBillerDetails[0].dueDate : '--', y:135},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNum? this.refNum : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_ESAL_PAYMENT_APPROVED'), y:155},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Authorize-EsalPayment.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Authorize-EsalPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
cancel(){
  this.route.navigate(['/mytask/payment/single-payments'])
}

}
