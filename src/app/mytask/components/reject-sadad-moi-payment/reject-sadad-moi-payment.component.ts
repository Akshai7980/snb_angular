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
  selector: 'app-reject-sadad-moi-payment',
  templateUrl: './reject-sadad-moi-payment.component.html',
  styleUrls: ['./reject-sadad-moi-payment.component.scss']
})
export class RejectSadadMoiPaymentComponent implements OnInit {
  rejectreason:string = '';
  isrejectreasonValid:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  sadadMoiDetails: any;
  sadadMoiDynamicValues: any;
  refNum: any;
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  rejectMsg = true;
  constructor(private router:Router,private myTaskService:MyTaskService,private commonService:CommonService,private location: Location, private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.refNum = this.rootScopeData.myTaskSADADMOISummaryObject.ref_NO;
    this.getSadadMoiDetails();
  }

  getSadadMoiDetails(){
    this.isLoadingCompelete = false;
    this.commonService.sadadMOIDetailsAPICall(this.refNum).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.sadadMoiDetails = res.data[0];
      this.sadadMoiDynamicValues = res.data[0].parameters;
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
      this.myTaskService.sadadMoiPaymentsRejectApiCall(this.sadadMoiDetails,this.rejectreason,this.rootScopeData.myTaskSADADMOISummaryObject).subscribe(
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
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_SADAD_MOI_PAYMENT_REJECTED",
      "referenceNumber":refNumber,
      "receiptDetails": [
        {
            "title": "",
            "isTable": "false",
            "data": this.sadadMoiDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_BILLER_NAME",
                "dataKey": this.sadadMoiDetails.billerName
              },
              {
                "dispKey": "LBL_DEBIT_ACCOUNT_NUMBER",
                "dataKey": this.sadadMoiDetails.debitAccNo
              },
              {
                  "dispKey": "LBL_SERVICE_TYPE",
                  "dataKey": this.sadadMoiDetails.serviceType
              }
            ]
        },
        {
            "title": " ",
            "isTable": "false",
            "data": this.sadadMoiDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_VALUE_DATE",
                "dataKey": this.sadadMoiDetails.valueDate
              },
              {
                  "dispKey": "LBL_AMOUNT",
                  "dataKey": this.sadadMoiDetails.paymentAmount+' '+this.sadadMoiDetails.paymentCcy
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
      "pageheading": this.translateService.instant("LBL_REJECT_SADAD_MOI_PAYMENT_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_SADAD_MOI_PAYMENT_REJECTED"),
      "keyValues": [
        {
          "subHead": "Biller Name",
          "subValue": this.sadadMoiDetails.billerName ? this.sadadMoiDetails.billerName : '--'
        },
        {
          "subHead": "Debit Account Number",
          "subValue": this.sadadMoiDetails.debitAccNo ? this.sadadMoiDetails.debitAccNo : '--'
        },
        {
          "subHead": "Service Type",
          "subValue": this.sadadMoiDetails.serviceType ? this.sadadMoiDetails.serviceType : "--"
        },
        {
          "subHead": "Date",
          "subValue": this.sadadMoiDetails.valueDate ? this.sadadMoiDetails.valueDate : '--'
        },
        {
          "subHead": "Amount",
          "subValue": this.sadadMoiDetails.paymentAmount ? this.sadadMoiDetails.paymentAmount+' '+this.sadadMoiDetails.paymentCcy : '--'
        }
      ],
      "pagecall":"sadadmoipayauth",
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
    { type: 'title', value:this.translateService.instant("LBL_REJECT_SADAD_MOI_PAYMENT"), x:80, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_BILLER_NAME'), y:65},
    { type: 'heading', value:this.translateService.instant('LBL_DEBIT_ACCOUNT_NUMBER'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_SERVICE_TYPE'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_VALUE_DATE'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:105},
    { type: 'text', value:this.sadadMoiDetails.billerName ? this.sadadMoiDetails.billerName : '--', y:65},
    { type: 'text', value:this.sadadMoiDetails.debitAccNo ? this.sadadMoiDetails.debitAccNo : '--', y:75},
    { type: 'text', value:this.sadadMoiDetails.serviceType ? this.sadadMoiDetails.serviceType : '--', y:85},
    { type: 'text', value:this.sadadMoiDetails.valueDate ? this.sadadMoiDetails.valueDate : '--', y:95},
    { type: 'text', value:this.sadadMoiDetails.paymentAmount+' '+this.sadadMoiDetails.paymentCcy ? this.sadadMoiDetails.paymentAmount+' '+this.sadadMoiDetails.paymentCcy : '--', y:105},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
    { type: 'text', value: this.refNo? this.refNo : '', y:115},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_MOI_PAYMENT_REJECTED'), y:125},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'rejected-SadadMoiPayment.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'rejected-SadadMoiPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}
