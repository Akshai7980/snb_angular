import { Component, OnInit } from '@angular/core';

import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-reject-sadad-biller',
  templateUrl: './reject-sadad-biller.component.html',
  styleUrls: ['./reject-sadad-biller.component.scss']
})
export class RejectSadadBillerComponent implements OnInit {

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
    //debugger
    this.details = this.rootScopeData.pendingActivitiesSadadBillerDetailsObj;
    this.summarydetails=this.rootScopeData.pendingActivitiesSadadBillerSummaryObj
    
  }

  textArea_Click(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  onClickSubmit(){
    // this.isrejectreasonValid = this.rejectreason ? false : true;
    //debugger
    let selectedRecords = [{
      "TXN_REF_NUM": this.summarydetails.lib_ref_no,
      "PRODUCT": "PAYMNT",
      "SUB_PRODUCT": "SADLIBR",
      "ACTION": "SADLB",
      "INPUT_HOST_CODE": "SADAD",
      "INPUT_VER_NO": "1"
    }]  
    let params={
      lib_ref_no:this.summarydetails.lib_ref_no,
      functionCode:this.summarydetails.functionCode,
      BillerCode:this.summarydetails.BillerCode,
      billerGroup:this.summarydetails.billerGroup,
      SubscriberID:this.summarydetails.SubscriberID,
      nickName:this.summarydetails.nickName,
      BillerName:this.summarydetails.BillerName,
      BillerGroupCode:this.summarydetails.BillerGroupCode,
      enableAutoPay:this.summarydetails.enableAutoPay,
      cif_values:this.summarydetails.cif_values,
      userNo:this.summarydetails.userNo,
      gcif:this.summarydetails.gcif,
      remarks:this.rejectreason,
      selectedRec : selectedRecords
    }
    if(!this.isrejectreasonValid){
      this.isLoadingCompelete = false;
      this.myTaskService.sadadBillerRejectApi(params).subscribe(
        response =>{
          this.isLoadingCompelete = true;
          let vdata:any = [];
          vdata = response;          
          if(vdata.dataValue.STATUS === "Success"){
            this.refNo = params.lib_ref_no;
            this.constructReceiptData(params.lib_ref_no);
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
    let beneficiaryDetails={
      billername:this.summarydetails.BillerName,
      subscriberId:this.summarydetails.SubscriberID,
      billergroup :this.summarydetails.billerGroup
     }
     this.contactDetails={
      "title": "LBL_SADAD_BILLER_DETAILS",
      "isTable": "false",
      "data": this.summarydetails,
      "fieldDetails":
      [
      {
        "dispKey": "LBL_BILLER_GROUP",
        "dataKey": this.summarydetails.billerGroup
      },
      {
        "dispKey": "LBL_BILLER_NAME",
        "dataKey": this.summarydetails.BillerName
      },
      {
        "dispKey": "LBL_SUBSCRIBER_ID",
        "dataKey": this.summarydetails.SubscriberID
      }
    ]
  }

  
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_SADAD_BILLER_REJECTED",
      "referenceNumber":refNumber,
      "authorizeButtonRouterPath":"/mytask/sadad-billers",
      "finishButtonRouterPath":"/dashboard",
      "receiptDetails": [
        {
            "title": "LBL_SADAD_BILLER_DETAILS",
            "isTable": "false",
            "data": beneficiaryDetails,
            "fieldDetails":[
              {
                "dispKey": "LBL_BILLER_NAME",
                "dataKey": beneficiaryDetails.billername
              },
              {
                  "dispKey": "LBL_SUBSCRIBER_ID",
                  "dataKey": beneficiaryDetails.subscriberId
              },
              {
                  "dispKey": "LBL_BILLER_GROUP",
                  "dataKey": beneficiaryDetails.billergroup
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
      "pageheading": this.translateService.instant("LBL_REJECT_SADAD_BILLER_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_SADAD_BILLER_REJECTED"),
      "keyValues": [
        {
          "subHead": "Sadad Biller Details",
          "subValue": ""
        },
        {
          "subHead": "Biller Name",
          "subValue": beneficiaryDetails.billername 
          ? beneficiaryDetails.billername : "--"
        },
        {
          "subHead": "Subscriber ID",
          "subValue": beneficiaryDetails.subscriberId 
          ? beneficiaryDetails.subscriberId : "--"
        },
        {
          "subHead": "Biller Group",
          "subValue": beneficiaryDetails.billergroup
          ? beneficiaryDetails.billergroup : "--"
        }
      ],
      "pagecall":"sadadbiller",
      "refNo":refNumber
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
    { type: 'title', value:this.translateService.instant('LBL_REJECT_SADAD_BILLER_RECEIPT'), x:90, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_BILLER_DETAILS'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_BILLER_NAME'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_SUBSCRIBER_ID'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_BILLER_GROUP'), y:95},
    // { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    // { type: 'heading', value:this.translateService.instant('LBL_TO'), y:105},
    // { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    // { type: 'heading', value:this.translateService.instant('LBL_PREPAID_CARD'), y:105},
    // { type: 'heading', value:this.translateService.instant('LBL_PER_SNB_RECORD'), y:115},
    // { type: 'heading', value:this.translateService.instant('LBL_PER_SARIE_RECORD'), y:125},
    { type: 'text', value:this.summarydetails.BillerName? this.summarydetails.BillerName : "--", y:75},
    { type: 'text', value:this.summarydetails.SubscriberID?this.summarydetails.SubscriberID:'--', y:85},
    { type: 'text', value:this.summarydetails.billerGroup?this.summarydetails.billerGroup:'--', y:95},
    // { type: 'text', value:this.onboardingFeeDetails.prepaidCards? this.onboardingFeeDetails.prepaidCards:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:105},
    // { type: 'text', value: this.onboardingFeeDetails.perSNBrecord?this.onboardingFeeDetails.perSNBrecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:115},
    // { type: 'text', value:this.onboardingFeeDetails.perSarieRecord?this.onboardingFeeDetails.perSarieRecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:125},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:105},
    { type: 'text', value: this.refNo ? this.refNo : '', y:105},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_BILLER_REJECTED'), y:115},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'RejectSadadBiller.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'RejectSadadBiller.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}

  onBackArrowClick(){
    this.location.back();
  }
  initiateAnotherRequest(){
    this.router.navigate(['/mytask/sadad-billers'])
  }

}
