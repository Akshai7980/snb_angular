import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { MyTaskService } from '../../services/my-task.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-authorize-cheque-book-request',
  templateUrl: './authorize-cheque-book-request.component.html',
  styleUrls: ['./authorize-cheque-book-request.component.scss']
})
export class AuthorizeChequeBookRequestComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  details: any;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  showAuthorization: boolean = false;
  authOptions: any;
  authDataObj: any;
  sefAuthFlag: any;
  pdfData: any;
  saveReceiptObject:any;
  constructor(private myTaskService:MyTaskService,private location: Location,private route: Router,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { 
  }

  ngOnInit(): void {
    this.details = this.rootScopeData.chequeBookDetailsObject;
    this.checkAuthorization();
  }

  onClickSubmit(){
    let params={
      refNumber:this.details.INPUT_REFERENCE_NO,
      productCode:this.details.INPUT_PRODUCT,
      subProductCode:this.details.INPUT_SUB_PRODUCT,
      action:this.details.INPUT_FUNCTION_CODE,
      versionNumber:this.details.INPUT_VER_NO,
      hostCode:this.details.hostTxnCode,
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
      remarks: !this.authDataObj ? '' : !this.authDataObj.aproveNote ? '':this.authDataObj.aproveNote
    }
    // if(!this.userOtpValue || this.userOtpValue.length !== 4){
    //   this.isOtpValid = "LBL_PLS_ENTER_OTP";
    //   return;
    // }else {
    //   // params.authRef = this.secAuthRef;
    //   // params.otp = this.userOtpValue;
    //   //sending empty value for otp and reference num
    //     params.authRef = '';
    //     params.otp = '';
    // }
      this.isLoadingCompelete = false;
      this.myTaskService.chequeBookRequestApproveApiCall(params).subscribe(
        response =>{
          this.isLoadingCompelete = true;
          let vdata:any = [];
          vdata = response;          
          if(vdata.dataValue.STATUS === "Success"){
            this.constructReceiptData(this.rootScopeData.pendingActivitiesServiceRequestObject.ref_NO);
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
      "msg2":"LBL_CHEQUE_BOOK_APPROVED",
      "referenceNumber":refNumber,
      "authorizeButtonRouterPath":"/mytask/serviceRequest",
      "finishButtonRouterPath":"/dashboard",
      "receiptDetails": [
        {
            "title": "LBL_FROM",
            "isTable": "false",
            "data": this.rootScopeData.chequeBookDetailsObject,
            "fieldDetails":[
              {
                "dispKey": "LBL_ACTION_BY",
                "dataKey": this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : ''
              },
              {
                  "dispKey": "LBL_ACC_NUMBER",
                  "dataKey": this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO
              },
              {
                  "dispKey": "LBL_NICKNAME",
                  "dataKey": this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME
              }
            ]
        },
        {
            "title": "LBL_CHEQUE_BOOK_DETAILS",
            "isTable": "false",
            "data": this.rootScopeData.chequeBookDetailsObject,
            "fieldDetails":[
              {
                "dispKey": "LBL_CHEQUE_BOOK_TYPE",
                "dataKey": this.rootScopeData.chequeBookDetailsObject.NO_BK
              },
              {
                  "dispKey": "LBL_NO_OF_BOOKS",
                  "dataKey": this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE
              },
              {
                "dispKey": "LBL_COLLECTION_BRANCH",
                "dataKey": this.rootScopeData.chequeBookDetailsObject.CHE_DEL +" : "+ this.rootScopeData.chequeBookDetailsObject.COL
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
      "pageheading": this.translateService.instant("LBL_CHQ_REQ_SUCCESS"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_CHEQUE_APPROVAL_REQUEST_IS_INT_SUCCESS"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '--'
        },
        {
          "subHead": "Account Number",
          "subValue": this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO ? this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO : "--"
        },
        {
          "subHead": "Nickname",
          "subValue": this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME ? this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME : "--"
        },
        {
          "subHead": "Cheque Book Details",
          "subValue": ""
        },
        {
          "subHead": "Cheque Book Type",
          "subValue": this.rootScopeData.chequeBookDetailsObject.NO_BK ? this.rootScopeData.chequeBookDetailsObject.NO_BK : "--"
        },
        {
          "subHead": "Number of book(s)",
          "subValue": this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE ? this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE : "--"
        },
        {
          "subHead": "Collection Branch",
          "subValue": this.rootScopeData.chequeBookDetailsObject.CHE_DEL ? this.rootScopeData.chequeBookDetailsObject.CHE_DEL :"--" 
          +" : "+ this.rootScopeData.chequeBookDetailsObject.COL ? this.rootScopeData.chequeBookDetailsObject.COL : "--"
        },
      ],
      "pagecall":"chequebookrequest",
      "refNo":refNumber
    }
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
    this.route.navigate(['/mytask/serviceRequest'])
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj =  autherizationDetailsObj;
  }

  checkAuthorization(){
    // console.log(this.rootScopeData.chequeBookDetailsObject)
    var chequeData = this.rootScopeData.chequeBookDetailsObject
    let data = {
      gcif: "",
      cif: chequeData.CIF_NO,
      productCode: chequeData.INPUT_PRODUCT,
      subProdCode: chequeData.INPUT_SUB_PRODUCT,
      funcCode: chequeData.INPUT_FUNCTION_CODE,
      amount: chequeData.INPUT_DEBIT_AMOUNT,
      accNo: chequeData.INPUT_DEBIT_ACC_NO,
      pymntCurrency: chequeData.CURRENCY,
      debitCurrency: chequeData.INPUT_DEBIT_CURRENCY,
      referenceNo:chequeData.INPUT_REFERENCE_NO
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
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_CHEQUEBOOK_REQ"), x:80, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},
        { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_BOOK_DETAILS'), y:105},
        { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_BOOK_TYPE'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_NO_OF_BOOKS'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_COLLECTION_BRANCH'), y:135},
        { type: 'text', value:this.rootScopeData.userInfo.loginID? this.rootScopeData.userInfo.loginID : '', y:75},
        { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO? this.rootScopeData.chequeBookDetailsObject.DEBIT_ACCOUNT_NO : '', y:85},
        { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME? this.rootScopeData.chequeBookDetailsObject.ACCOUNT_NICKNAME : '', y:95},
        { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE? this.rootScopeData.chequeBookDetailsObject.CUST_CHEQUE_TYPE : '', y:115},
        { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.NO_BK? this.rootScopeData.chequeBookDetailsObject.NO_BK : '', y:125},
        { type: 'text', value:this.rootScopeData.chequeBookDetailsObject.CHE_DEL+" : "+ this.rootScopeData.chequeBookDetailsObject.COL , y:135},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
        { type: 'text', value: this.rootScopeData.pendingActivitiesServiceRequestObject.ref_NO? this.rootScopeData.pendingActivitiesServiceRequestObject.ref_NO : '', y:145},
        { type: 'heading', value:this.translateService.instant('LBL_CHEQUE_BOOK_APPROVED'), y:155},
        
      ]
      // debugger;

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'Authorize-SingleTransfer.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'Authorize-SingleTransfer.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
  cancel(){
    this.route.navigate(['/mytask/serviceRequest'])
  }

}
