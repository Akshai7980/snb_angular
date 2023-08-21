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
  selector: 'app-reject-esal-payment',
  templateUrl: './reject-esal-payment.component.html',
  styleUrls: ['./reject-esal-payment.component.scss']
})
export class RejectEsalPaymentComponent implements OnInit {
  rejectreason:string = '';
  isrejectreasonValid:boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  refNum: any;
  isLoadingCompelete = true;
  esalDetails: any;
  esalBillerDetails: any;
  receiptForm: boolean = false;
  receiptData: any;
  paymentCCY: any;
  displayedColumns= ['nickName', 'name', 'subscriberId', 'dueDate', 'amount'];
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  rejectMsg = true;
  constructor(private router:Router,private myTaskService:MyTaskService,private commonService:CommonService,private location: Location, private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.refNum = this.rootScopeData.myTasksESALSummaryObject.ref_NO;
    this.getEsalDetails();
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

  textArea_Click(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  onClickSubmit(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
    if(!this.isrejectreasonValid){
      this.isLoadingCompelete = false;
      this.myTaskService.esalPaymentsRejectApiCall(this.esalDetails,this.rejectreason,this.rootScopeData.myTasksESALSummaryObject).subscribe(
        (response:any) =>{
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
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_ESAL_PAYMENT_REJECTED",
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
      "pageheading": this.translateService.instant("LBL_REJECT_ESAL_PAYMENT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_ESAL_PAYMENT_REJECTED"),
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
    { type: 'title', value:this.translateService.instant("LBL_REJECT_ESAL_PAYMENT"), x:80, y:35},
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
    { type: 'text', value:this.esalDetails.debitAccName ? this.esalDetails.debitAccName : '--', y:75},
    { type: 'text', value:this.esalDetails.debitAccNo ? this.esalDetails.debitAccNo : '--', y:85},
    { type: 'text', value:this.esalDetails.debitBank ? this.esalDetails.debitBank : '--', y:95},
    { type: 'text', value:this.esalBillerDetails[0].subscriberID ? this.esalBillerDetails[0].subscriberID : '--', y:115},
    { type: 'text', value:this.esalBillerDetails[0].billerName ? this.esalBillerDetails[0].billerName : '--', y:125},
    { type: 'text', value:this.esalBillerDetails[0].dueDate ? this.esalBillerDetails[0].dueDate : '--', y:135},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNo? this.refNo : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_ESAL_PAYMENT_REJECTED'), y:155},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Reject-EsalPayment.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Reject-EsalPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}
