import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-reject-esal-biller',
  templateUrl: './reject-esal-biller.component.html',
  styleUrls: ['./reject-esal-biller.component.scss']
})
export class RejectEsalBillerComponent implements OnInit {

  rejectreason:string = '';
  isrejectreasonValid:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  details: any;
  receiptForm: boolean = false;
  contactDetails:any;
  summarydetails:any;
  pdfData:any;
  refNo: any;
  saveReceiptObject:any;
  constructor(private router:Router,private myTaskService:MyTaskService,private location: Location,private translateService: TranslateService, private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.details = this.rootScopeData.pendingActivitiesEsalBillerSummaryObj;
  }

  textArea_Click(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  onClickSubmit(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
    if(!this.isrejectreasonValid){
      this.isLoadingCompelete = false;
      this.myTaskService.esalBillerRejectApiCall(this.details,this.rejectreason).subscribe(
        response =>{
          this.isLoadingCompelete = true;
          let vdata:any = [];
          vdata = response;          
          if(vdata.dataValue.STATUS === "Success"){
            this.refNo = vdata.dataValue.INTERNAL_REFERENCE_NO;
            this.constructReceiptData(vdata.dataValue.INTERNAL_REFERENCE_NO);
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
      "msg2":"LBL_ESAL_BILLER_REJECTED",
      "referenceNumber":refNumber,
      "receiptDetails": [
        {
            "title": "LBL_ESAL_BILLER_DET",
            "isTable": "false",
            "data": this.details,
            "fieldDetails":[
              {
                "dispKey": "LBL_PAYER_ID",
                "dataKey": this.details.payerId
              },
              {
                  "dispKey": "LBL_PAYER_SHORT_NAME",
                  "dataKey": this.details.shortName
              },
              {
                  "dispKey": "LBL_PAYER_FULL_NAME",
                  "dataKey": this.details.payerFullName
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
      "pageheading": this.translateService.instant("LBL_REJECT_ESAL_BILLER"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_ESAL_BILLER_REJECTED"),
      "keyValues": [
        {
          "subHead": "ESAL Biller Details",
          "subValue": ""
        },
        {
          "subHead": "Payer ID",
          "subValue": this.details.payerId ? this.details.payerId : "--"
        },
        {
          "subHead": "Payer Short Name",
          "subValue": this.details.shortName ? this.details.shortName : "--"
        },
        {
          "subHead": "Payer Full Name",
          "subValue": this.details.payerFullName ? this.details.payerFullName : "--"
        }
      ],
      "pagecall":"esalbiller",
      "refNo":refNumber
    }
   
  }

  onBackArrowClick(){
    this.location.back();
  }
  initiateAnotherRequest(){
    this.router.navigate(['/mytask/billerManagement/esal-biller'])
  }

  downloadPdf(values:any)
  { 
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant('LBL_REJECT_ESAL_BILLER_RECEIPT'), x:90, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_ESAL_BILLER_DET'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_PAYER_ID'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_PAYER_SHORT_NAME'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_PAYER_FULL_NAME'), y:95},
    // { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    // { type: 'heading', value:this.translateService.instant('LBL_TO'), y:105},
    // { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    // { type: 'heading', value:this.translateService.instant('LBL_PREPAID_CARD'), y:105},
    // { type: 'heading', value:this.translateService.instant('LBL_PER_SNB_RECORD'), y:115},
    // { type: 'heading', value:this.translateService.instant('LBL_PER_SARIE_RECORD'), y:125},
    { type: 'text', value:this.details.payerId? this.details.payerId : "--", y:75},
    { type: 'text', value:this.details.shortName?this.details.shortName:'--', y:85},
    { type: 'text', value:this.details.payerFullName?this.details.payerFullName:'--', y:95},
    // { type: 'text', value:this.onboardingFeeDetails.prepaidCards? this.onboardingFeeDetails.prepaidCards:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:105},
    // { type: 'text', value: this.onboardingFeeDetails.perSNBrecord?this.onboardingFeeDetails.perSNBrecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:115},
    // { type: 'text', value:this.onboardingFeeDetails.perSarieRecord?this.onboardingFeeDetails.perSarieRecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:125},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:105},
    { type: 'text', value: this.refNo ? this.refNo : '', y:105},
    { type: 'heading', value:this.translateService.instant('LBL_ESAL_BILLER_REJECTED'), y:115},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'RejectEsalBiller.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'RejectEsalBiller.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}

}
