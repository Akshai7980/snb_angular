import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-authorize-qtl',
  templateUrl: './authorize-qtl.component.html',
  styleUrls: ['./authorize-qtl.component.scss']
})
export class AuthorizeQtlComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  sefAuthFlag: any;
  showAuthorization: boolean = false;
  authOptions: any;
  authDataObj: any;
  saveReceiptObject:any;
  rejectMsg : boolean = false;
  constructor(private myTaskService:MyTaskService, private location: Location,private route: Router,private translateService : TranslateService) { 
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
            this.constructReceiptData(response.dataValue.INTERNAL_REFERENCE_NO,response.dataValue);
            this.receiptForm = true;
          }
         
        },
        error =>{
          this.isLoadingCompelete = true;
      
        }
      )
  }

  constructReceiptData(refNumber: any, data : any) {
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
    let message2 :any;
    let rejectReasonFromAPi : any;
    let journalId :any;
    this.rejectMsg = false;
    let showAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message2 = "LBL_ITL_APPROVED";
      journalId = data.JOURNAL_ID
    }else if(data.TXN_STATUS=== "RH"){
      message2 = "LBL_ITL_REJECTED";
      this.rejectMsg = true;
      rejectReasonFromAPi = data.OD_REJECT_REASON;
    }else if(data.TXN_STATUS=== "IO"){
      message2 = "LBL_ITL_MSG_IO";
      showAuth = true;
    }else if(data.TXN_STATUS=== "AO"){
      message2 = "LBL_ITL_SUBMITTED_AO";
    }else{
      message2 = "LBL_ITL_APPROVED";
    }
    this.receiptData = {
      "msg1":"LBL_CONFIRMATION",
      "msg2":"LBL_ITL_APPROVED",
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
    if(showAuth){
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

}
