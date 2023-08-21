import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/common-components/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-reject-sadad-payment',
  templateUrl: './reject-sadad-payment.component.html',
  styleUrls: ['./reject-sadad-payment.component.scss']
})
export class RejectSadadPaymentComponent implements OnInit {
  rejectreason:string = '';
  isrejectreasonValid:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  details: any;
  receiptForm: boolean = false;
  sadadBillerDetails: any;
  sadadDetails: any;
  paymentCCY: any;
  pdfData: any;
  saveReceiptObject:any;
  rejectMsg = true;
  displayedColumns= ['nickName', 'name', 'subscriberId', 'dueDate', 'amount'];

  constructor(private router:Router,private myTaskService:MyTaskService,private commonService:CommonService,private location: Location,  private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.getSadadDetails();
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

  textArea_Click(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  onClickSubmit(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
    let params={
      refNumber:this.rootScopeData.myTaskSADADSummaryObject.ref_NO,
      productCode:this.rootScopeData.myTaskSADADSummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTaskSADADSummaryObject.subprcode,
      action:this.rootScopeData.myTaskSADADSummaryObject.function_ID,
      versionNumber:this.rootScopeData.myTaskSADADSummaryObject.version_NO,
      hostCode:this.rootScopeData.myTaskSADADSummaryObject.host_TXN_CODE,
    }
    if(!this.isrejectreasonValid){
      this.isLoadingCompelete = false;
      this.myTaskService.sadadPaymentsRejectApiCall(params,this.rejectreason).subscribe(
        (response:any) =>{
          this.isLoadingCompelete = true;         
          if(response.dataValue.STATUS === "Success"){
            this.constructReceiptData(this.rootScopeData.myTaskSADADSummaryObject.ref_NO);
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
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_SADAD_PAYMENT_REJECTED",
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
      "pageheading": this.translateService.instant("LBL_REJECT_SADAD_PAYMENT_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_SADAD_PAYMENT_REJECTED"),
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
      this.router.navigate(['/mytask/payment/single-payments'])
    }
    else if(this.rootScopeData.paymentActiveTabName === 'sadad'){
      this.router.navigate(['/mytask/sadad/sadadsinglepayment'])
    }
  }
  downloadPdf(values:any)
  { 
  let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_REJECT_SADAD_PAYMENT"), x:80, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.rootScopeData.myTaskSADADSummaryObject.ref_NO? this.rootScopeData.myTaskSADADSummaryObject.ref_NO : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_PAYMENT_REJECTED'), y:155},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Rejected-SadadPayment.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Rejected-SadadPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}
