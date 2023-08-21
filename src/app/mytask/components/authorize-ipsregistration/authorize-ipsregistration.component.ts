import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-authorize-ipsregistration',
  templateUrl: './authorize-ipsregistration.component.html',
  styleUrls: ['./authorize-ipsregistration.component.scss']
})
export class AuthorizeIPSRegistrationComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  authDataObj: any;
  sefAuthFlag: any;
  showAuthorization: boolean = false;
  authOptions: any;
  pdfData: any;
  refNumber:any;
  saveReceiptObject:any;
  rejectMsg : boolean = false;
  constructor(private myTaskService:MyTaskService, private location: Location,private route: Router, private downloadAsPdf:downloadAsPdf,
    private translateService: TranslateService) { 
  }

  ngOnInit(): void {
    this.checkAuthorization();
  }

 onClickSubmit(){
    let params={
      refNumber:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.REF_NO,
      productCode:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_PRODUCT_CODE,
      subProductCode:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_SUBPROD_CODE,
      action:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_FUNCTION_ID,
      versionNumber:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_VERSION_NO,
      hostCode:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACTION,
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
      this.myTaskService.ipsRegDeRegAndQTLAuthorizeAPICall(params).subscribe(
        (response:any) =>{
          this.isLoadingCompelete = true;         
          if(response.dataValue.STATUS === "Success"){
            this.constructReceiptData(response.dataValue.INTERNAL_REFERENCE_NO ,response.dataValue);
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
      
        }
      )
  }

  constructReceiptData(refNumber: any ,data :any) {
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
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED";
      journalId = data.JOURNAL_ID
    }else if(data.TXN_STATUS=== "RH"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_UNSUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      this.rejectMsg = true;
      rejectReasonFromAPi = data.OD_REJECT_REASON;
    }else if(data.TXN_STATUS=== "IO"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED_AND_SENT_FOR_ADDITIONAL_APPROVAL";
      showAuth = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_INSTANT_TRNSFR_MNGMNT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED";
    }
    
      // if(data.TXN_STATUS=== "AH"){
      //   journalId = data.JOURNAL_ID
      // }


    this.refNumber = refNumber;
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
            "data": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject,
            "fieldDetails":[
              {
                "dispKey": "LBL_ACCOUNT_NAME",
                "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME
              },
              {
                  "dispKey": "LBL_ACC_NUMBER",
                  "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO
              },
              {
                  "dispKey": "LBL_NICKNAME",
                  "dataKey": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME
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
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_INSTANT_TRANSFER_REGISTRATION_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant(message2),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Account Name",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME 
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO 
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME
          ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME : "--"
        }
      ],
      "pagecall":"IPSRegAuth",
      "refNo":refNumber
    }
  }

  onBackArrowClick(){
    this.location.back();
  }

  initiateAnotherRequest(){
    this.route.navigate(['/mytask/instantTransferManagement'])
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj =  autherizationDetailsObj;
  }

  checkAuthorization(){
    // console.log(this.rootScopeData.pendingActivitiesInstantTransferSummaryObject)
    var IPSData = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject
    let data = {
      gcif: "",
      cif: IPSData.CIF_NO,
      productCode: IPSData.OD_PRODUCT_CODE,
      subProdCode: IPSData.OD_SUBPROD_CODE,
      funcCode: IPSData.OD_FUNCTION_ID,
      amount: 0, //
      accNo: IPSData.ACC_NO,
      pymntCurrency: IPSData.PAYMENTCURRENCY,
      debitCurrency: IPSData.DEBITCURRENCY,
      referenceNo:IPSData.REF_NO
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

  downloadPdf(values:any)
  { 
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:"Your IPS Registration is approved", x:80, y:35},
    { type:'setFontSize', size:10},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setFontSize', size:10},
    { type: 'setFillColor', val1:128, val2:128, val3:128},
    { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
    { type:'setTextColor', val1:255, val2:255, val3:255},
    { type:'setFontSize', size:10},
    { type: 'heading', value:'IPS Details', y:55},
    { type:'setFontSize', size:9},
    { type:'setTextColor', val1:0, val2:0, val3:0}, 
    { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_ACCOUNT_NAME'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},    
    { type: 'text', value:  this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME : '--', y:75},
    { type: 'text', value:  this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO : '--', y:85},
    { type: 'text', value: this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME ?this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME : '--', y:95},
    
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:105},
    { type: 'text', value: this.refNumber ? this.refNumber : '', y:105},
    { type: 'heading', value:this.translateService.instant('LBL_IPS_REG_APPROVED'), y:115},
    
  ]


  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'AuthorizeIPSRegisteration.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'AuthorizeIPSRegisteration.pdf'}
   )
  }
  //   this.pdfData.push(
  //     { type: 'save', value:'AuthorizePayrollFileUpload.pdf'}
  //  )

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
cancel(){
  this.route.navigate(['/mytask/instantTransferManagement'])
}
}
