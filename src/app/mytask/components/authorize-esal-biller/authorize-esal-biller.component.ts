import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-authorize-esal-biller',
  templateUrl: './authorize-esal-biller.component.html',
  styleUrls: ['./authorize-esal-biller.component.scss']
})
export class AuthorizeEsalBillerComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  details: any;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  sefAuthFlag: any;
  showAuthorization: boolean = false;
  authOptions: any;
  authDataObj: any;
  pdfData:any;
  refNo: any;
  saveReceiptObject:any;
  constructor(private myTaskService:MyTaskService,private location: Location,private route: Router,private translateService: TranslateService, private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.details = this.rootScopeData.pendingActivitiesEsalBillerSummaryObj;
    this.checkSecfactorAuth();
  }

  onClickSubmit(){
    this.isLoadingCompelete = false;
    let authdata = {
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
    this.myTaskService.esalBillerAuthorizeApiCall(this.details, authdata).subscribe(
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
  constructReceiptData(refNumber: any) {
  this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_ESAL_BILLER_APPROVED",
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
        },
        {
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
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_ESAL_BILLER"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_ESAL_BILLER_APPROVED"),
      "keyValues": [
        {
          "subHead": "ESAL Biller Details",
          "subValue": ""
        },
        {
          "subHead": "PayerId",
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

  downloadPdf(values:any)
  { 
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant('LBL_AUTHORIZE_ESAL_BILLER_RECEIPT'), x:90, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_ESAL_BILLER_APPROVED'), y:115},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'AuthorizeEsalBiller.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'AuthorizeEsalBiller.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
  
  onBackArrowClick(){
    this.location.back();
  }

  initiateAnotherRequest(){
    this.route.navigate(['/mytask/billerManagement/esal-biller'])
  }

  checkSecfactorAuth() {
    let data = {
      gcif: "",
      cif: this.details.cifNo,
      productCode: this.details.productCode,
      subProdCode: this.details.subProdCode,
      funcCode: this.details.functionCode,
      amount: this.details.debit_AMOUNT,
      accNo: 0,
      pymntCurrency: this.details.pymntCurrency,
      debitCurrency: this.details.debitCurrency,
      referenceNo:this.details.referenceNumber
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
  cancel(){
    this.route.navigate(['/mytask/billerManagement/esal-biller'])
  }

}
