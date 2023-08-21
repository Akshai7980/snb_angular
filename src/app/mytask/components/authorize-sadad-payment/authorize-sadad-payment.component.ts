import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-components/services/common.service';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-authorize-sadad-payment',
  templateUrl: './authorize-sadad-payment.component.html',
  styleUrls: ['./authorize-sadad-payment.component.scss']
})
export class AuthorizeSadadPaymentComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  details: any;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  sadadDetails: any;
  sadadBillerDetails: any;
  paymentCCY: any;
  autherizationDetailsObj: any;
  authListArray: any = [];
  showAuthorization = false;
  showAuthentication = false;
  authError: string = "";
  authType: any
  displayedColumns= ['nickName', 'name', 'subscriberId', 'dueDate', 'amount'];
  authDataObj: any;
  sefAuthFlag: any;
  authOptions: any;
  pdfData: any;
  saveReceiptObject:any;
  rejectMsg : boolean = false;
  constructor(private commonService:CommonService,private myTaskService:MyTaskService, private location: Location,private route: Router, private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { 
  }

  ngOnInit(): void {
    this.getSadadDetails();
    this.checkSecfactorAuth();
    // this.checkAuthorization();
  }

  getSadadDetails(){
    this.isLoadingCompelete = false;
    this.commonService.sadadDetailsAPICall(this.rootScopeData.myTaskSADADSummaryObject.ref_NO).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.sadadDetails = res.data;
      this.sadadBillerDetails = res.data.selectedBillers;
      this.paymentCCY = res.data.paymentCcy;
      
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

  onClickSubmit(){
    let params={
      refNumber:this.rootScopeData.myTaskSADADSummaryObject.ref_NO,
      productCode:this.rootScopeData.myTaskSADADSummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTaskSADADSummaryObject.subprcode,
      action:this.rootScopeData.myTaskSADADSummaryObject.function_ID,
      versionNumber:this.rootScopeData.myTaskSADADSummaryObject.version_NO,
      hostCode:this.rootScopeData.myTaskSADADSummaryObject.host_TXN_CODE,
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
      this.isLoadingCompelete = false;
      this.myTaskService.sadadPaymentsAuthorizeApiCall(params).subscribe(
        response =>{
          this.isLoadingCompelete = true;         
          if(response.dataValue.STATUS === "Success"){
            this.constructReceiptData(this.rootScopeData.myTaskSADADSummaryObject.ref_NO, response.dataValue);
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
      
        }
      )
  }

  constructReceiptData(refNumber: any,data:any) {
    let flexiAuth = {
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
      "msg1":message1,
      "msg2":message2,
      "journalId":journalId ? journalId : "",
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      "referenceNumber":refNumber,
      "receiptDetails": [
        {
            "title": "LBL_FROM",
            "isTable": "false",
            "data": this.sadadDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_ACCOUNT_NAME",
                "dataKey": this.sadadDetails.debitAccName
              },
              {
                  "dispKey": "LBL_ACC_NUMBER",
                  "dataKey": this.sadadDetails.debitAccNo
              },
              {
                  "dispKey": "LBL_BANK",
                  "dataKey": this.sadadDetails.debitBank
              }
            ]
        },
        {
            "title": "LBL_PAY_TO",
            "isTable": "true",
            "data": this.sadadBillerDetails,
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
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_SADAD_PAYMENT_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_SADAD_PAYMENT_APPROVED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Account Name",
          "subValue": this.sadadDetails.debitAccName ? this.sadadDetails.debitAccName : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.sadadDetails.debitAccNo ? this.sadadDetails.debitAccNo : "--"
        },
        {
          "subHead": "Bank Name",
          "subValue": this.sadadDetails.debitBank ? this.sadadDetails.debitBank : "--"
        },
        {
          "subHead": "Pay To",
          "subValue": ""
        },
        {
          "subHead": "Subscriber ID",
          "subValue": this.sadadBillerDetails[0].subscriberID ? this.sadadBillerDetails[0].subscriberID : "--"
        },
        {
          "subHead": "Biller Name",
          "subValue": this.sadadBillerDetails[0].billerName ? this.sadadBillerDetails[0].billerName : "--"
        },
        {
          "subHead": "Due Date",
          "subValue": this.sadadBillerDetails[0].dueDate ? this.sadadBillerDetails[0].dueDate : "--"
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
    let sadadData = this.rootScopeData.myTaskSADADSummaryObject
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

  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }

  onSecondFactorValue(authValue: any) {
    let vAuthvalue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj =  autherizationDetailsObj;
  }

  checkAuthorization(){
    //console.log(this.rootScopeData.myTaskSADADSummaryObject)
    var SADAD = this.rootScopeData.myTaskSADADSummaryObject
    let data = {
      gcif: "",  //
      cif: SADAD.cifValues,
      productCode: SADAD.product,
      subProdCode: SADAD.subProduct,
      // funcCode: SADAD.INPUT_FUNCTION_CODE,  //
      amount: SADAD,  //
      accNo: SADAD.accountNo,
      // pymntCurrency: SADAD.CURRENCY,  //
      // debitCurrency: SADAD.INPUT_DEBIT_CURRENCY,  //
      referenceNo:SADAD.odRefNo
    }
    this.myTaskService.checkAuthorizationData(data).subscribe((res)=>{

      if (res) {
        this.sefAuthFlag = res.data.selfAuth
        if (res.data.flexiAuth === "true") {
          this.showAuthorization = true;
          this.authOptions = res.data.authList;
        }
        // this.isLoadingCompelete = true;
      }
    }, error => {
      // this.isLoadingCompelete = true;
    })
  }
  downloadPdf(values:any)
  { 
  let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_SADAD_PAYMENT"), x:80, y:35},
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
    { type: 'text', value:this.sadadDetails.debitAccName ? this.sadadDetails.debitAccName : '--', y:75},
    { type: 'text', value:this.sadadDetails.debitAccNo ? this.sadadDetails.debitAccNo : '--', y:85},
    { type: 'text', value:this.sadadDetails.debitBank ? this.sadadDetails.debitBank : '--', y:95},
    { type: 'text', value:this.sadadBillerDetails[0].subscriberID ? this.sadadBillerDetails[0].subscriberID : '--', y:115},
    { type: 'text', value:this.sadadBillerDetails[0].billerName ? this.sadadBillerDetails[0].billerName : '--', y:125},
    { type: 'text', value:this.sadadBillerDetails[0].dueDate ? this.sadadBillerDetails[0].dueDate : '--', y:135},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.rootScopeData.myTaskSADADSummaryObject.ref_NO? this.rootScopeData.myTaskSADADSummaryObject.ref_NO : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_PAYMENT_APPROVED'), y:155},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Authorize-SadadPayment.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Authorize-SadadPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
cancel(){
  this.route.navigate(['/mytask/payment/single-payments'])
}

}
