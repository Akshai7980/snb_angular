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
  selector: 'app-reject-sadad-moi-refund-req',
  templateUrl: './reject-sadad-moi-refund-req.component.html',
  styleUrls: ['./reject-sadad-moi-refund-req.component.scss']
})
export class RejectSadadMoiRefundReqComponent implements OnInit {
  rejectreason:string = '';
  isrejectreasonValid:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  sadadMoiRefundReqDetails: any;
  sadadMoiRefundReqDynamicValues: any;
  refNum: any;
  pdfData: any;
  refNo:any;
  saveReceiptObject:any;
  rejectMsg = true;
  constructor(private router:Router,private myTaskService:MyTaskService,private commonService:CommonService,private location: Location,  private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.refNum = this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject.ref_NO;
    this.getSadadMoiRefundReqDetails();
  }

  getSadadMoiRefundReqDetails(){
    this.isLoadingCompelete = false;
    this.commonService.sadadMOIRefundReqDetailsAPICall(this.refNum).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.sadadMoiRefundReqDetails = res.data[0];
      this.sadadMoiRefundReqDynamicValues = res.data[0].parameters;
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
      this.myTaskService.sadadMoiRefundRequestRejectApiCall(this.sadadMoiRefundReqDetails,this.rejectreason,this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject).subscribe(
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
      "msg2":"LBL_SADAD_MOI_REFUND_REQUEST_REJECTED",
      "referenceNumber":refNumber,
      "receiptDetails": [
        {
            "title": "",
            "isTable": "false",
            "data": this.sadadMoiRefundReqDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_BILLER_NAME",
                "dataKey": this.sadadMoiRefundReqDetails.billerName
              },
              {
                  "dispKey": "LBL_SERVICE_TYPE",
                  "dataKey": this.sadadMoiRefundReqDetails.serviceType
              },
              {
                  "dispKey": "LBL_AMOUNT",
                  "dataKey": this.sadadMoiRefundReqDetails.paymentAmount+' '+this.sadadMoiRefundReqDetails.paymentCcy
              }
            ]
        },
        {
            "title": " ",
            "isTable": "false",
            "data": this.sadadMoiRefundReqDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_VALUE_DATE",
                "dataKey": this.sadadMoiRefundReqDetails.valueDate
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
      "pageheading": this.translateService.instant("LBL_REJECT_SADAD_MOI_REFUND_PAYMENT_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_SADAD_MOI_REFUND_REQUEST_REJECTED"),
      "keyValues": [
        {
          "subHead": "Biller Name",
          "subValue": this.sadadMoiRefundReqDetails.billerName ? this.sadadMoiRefundReqDetails.billerName : '--'
        },
        {
          "subHead": "Debit Account Number",
          "subValue": this.sadadMoiRefundReqDetails.debitAccNo ? this.sadadMoiRefundReqDetails.debitAccNo : '--'
        },
        {
          "subHead": "Service Type",
          "subValue": this.sadadMoiRefundReqDetails.serviceType ? this.sadadMoiRefundReqDetails.serviceType : "--"
        },
        {
          "subHead": "Date",
          "subValue": this.sadadMoiRefundReqDetails.valueDate ? this.sadadMoiRefundReqDetails.valueDate : '--'
        },
        {
          "subHead": "Amount",
          "subValue": this.sadadMoiRefundReqDetails.paymentAmount ? this.sadadMoiRefundReqDetails.paymentAmount+' '+this.sadadMoiRefundReqDetails.paymentCcy : '--'
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
    { type: 'title', value:this.translateService.instant("LBL_REJECT_SADAD_MOI_REFUND_REQUEST"), x:80, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_SERVICE_TYPE'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_VALUE_DATE'), y:95},
    { type: 'text', value:this.sadadMoiRefundReqDetails.billerName ? this.sadadMoiRefundReqDetails.billerName : '--', y:65},
    { type: 'text', value:this.sadadMoiRefundReqDetails.serviceType ? this.sadadMoiRefundReqDetails.serviceType : '--', y:75},
    { type: 'text', value:this.sadadMoiRefundReqDetails.paymentAmount+' '+this.sadadMoiRefundReqDetails.paymentCcy ? this.sadadMoiRefundReqDetails.paymentAmount+' '+this.sadadMoiRefundReqDetails.paymentCcy : '--', y:85},
    { type: 'text', value:this.sadadMoiRefundReqDetails.valueDate ? this.sadadMoiRefundReqDetails.valueDate : '--', y:95},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
    { type: 'text', value: this.refNo? this.refNo : '', y:115},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_MOI_REFUND_REQUEST_REJECTED'), y:125},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Rejected-SadadMoiRefund.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Rejected-SadadMoiRefund.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}
