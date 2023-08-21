import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-authorize-sadad-biller',
  templateUrl: './authorize-sadad-biller.component.html',
  styleUrls: ['./authorize-sadad-biller.component.scss']
})
export class AuthorizeSadadBillerComponent implements OnInit {

  rootScopeData:RootScopeDeclare=RootScopeData;
  details: any;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  contactDetails:any;
  summarydetails:any;
  sefAuthFlag: any;
  showAuthorization: boolean = false;
  authOptions: any;
  authDataObj: any;
  pdfData:any;
  refNo: any;
  saveReceiptObject:any;
  constructor(private myTaskService:MyTaskService,private location: Location,private route: Router,private translateService: TranslateService, private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.details = this.rootScopeData.pendingActivitiesSadadBillerDetailsObj;
    this.summarydetails=this.rootScopeData.pendingActivitiesSadadBillerSummaryObj;
    this.checkAuthorization();
  }

  onClickSubmit(){
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
      functionCode:this.details.functionCode,
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
      authRef: "",
      otp: "",
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
      remarks: !this.authDataObj ? '' : !this.authDataObj.aproveNote ? '':this.authDataObj.aproveNote,
      selectedRec : selectedRecords
    }
   
      this.isLoadingCompelete = false;
      this.myTaskService.sadadBillerApproveApi(params).subscribe(
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
      "msg2":"LBL_SADAD_BILLER_APPROVED",
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
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_ESAL_BILLER_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_SADAD_BILLER_APPROVED"),
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
    { type: 'title', value:this.translateService.instant('LBL_AUTHORIZE_SADAD_BILLER_RECEIPT'), x:90, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_BILLER_APPROVED'), y:115},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'AuthorizeSadadBiller.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'AuthorizeSadadBiller.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
  
  onBackArrowClick(){
    this.location.back();
  }
  onSecondFactorValue(authValue: any) {
    let vAuthvalue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    this.userOtpValue = otpValue;
  }

  initiateAnotherRequest(){
    this.route.navigate(['/mytask/sadad-billers'])
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj =  autherizationDetailsObj;
  }

  checkAuthorization(){
    var sadad_bulk = this.summarydetails;
    let data = {
      gcif: "",  
      cif: sadad_bulk.cif_values,
      productCode: sadad_bulk.productCode,
      subProdCode: sadad_bulk.subProdCode,
      funcCode: sadad_bulk.functionCode, 
      amount: 0,
      accNo: sadad_bulk.accountNo,
      pymntCurrency: sadad_bulk.pymntCurrency, 
      debitCurrency: sadad_bulk.debitCurrency,
      referenceNo:sadad_bulk.lib_ref_no
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
  cancel(){
    this.route.navigate(['/mytask/sadad-billers'])
  }

}
