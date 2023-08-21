import { Component, OnInit } from '@angular/core';
import { RootScopeDeclare } from '../../../rootscope-declare';
import { RootScopeData } from '../../../rootscope-data';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
@Component({
  selector: 'app-add-sadad-biller',
  templateUrl: './add-sadad-biller.component.html',
  styleUrls: ['./add-sadad-biller.component.scss']
})
export class AddSadadBillerComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;

  receiptData: any;
  isProceed = false;
  finalsubmit = false;
  proceed = false;
  ShowAddSadadbiller: boolean = true;
  validationFlag = false;
  clearForm=false;
  isLoadingCompelete: boolean = true;
  submitParams: any;
  refNum: any;
  secAuthRef: any;
  otpError: any;
  userOtpValue: any;
  authType: any;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:""
  }
  pdfData: any;
  pageCall:any;
  isAuthentication: boolean = false;
  sadadBiller = "sadadBiller";
  showCallback: boolean = false;
  hideSelectionInput: boolean =true;
  saveReceiptObject:any;
  rejectMsg: boolean = false;
  showAuthentication: boolean = false;
  showAuthorization: boolean = false;
  authorError: string = '';
  authorizationDetails = {
    authorizer: '',
    note: '',
  };
  url:string='';
  authorsList: any;
  authDetails: any;
  constructor(private sadadService:SadadPaymentService, private downloadAsPdf:downloadAsPdf,private readonly translateService: TranslateService) { }

  ngOnInit(): void {
    this.pageCall = "sadadBiller";
    this.url = systemproperty.termsAndConditionsForStopPayment;
  }



  proceednext() {
    this.validationFlag = true;
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode="SADLIBR";
      this.initReqParam.unitId="IGTBSA";
  }


  clearClick(){
    this.clearForm = true;
    this.rootScopeData.addSadadBillerReviewMode = false;
    // this.proceed = false;
    //   this.finalsubmit = false;
    //   this.ShowAddSadadbiller=false;
  }

  proceedNextScreen(value: any) {
    if (value == 'Y') {
      
      // this.showCallback = true;
      // this.proceed = true;
      this.isAuthentication = true;
      this.finalsubmit = true;
      this.rootScopeData.addSadadBillerReviewMode = true;
     
    }
  }

  initAnotherBiller(){
    this.validationFlag = false;
    this.showCallback = false;
    this.proceed = false;
    this.hideSelectionInput = true;
    this.finalsubmit = false;
    this.rootScopeData.addSadadBillerReviewMode = false;
    this.isProceed = false
    this.ShowAddSadadbiller = true;

  }
  getInquiryData(event:any){
    this.initReqParam.accNo=event.accountId+""
    this.initReqParam.cif=event.accountId+""
    this.initReqParam.amt=event.balance
  }
  getSubmitParams(params:any){
    this.submitParams = params;
    this.showCallback = this.submitParams.billerCode === 'STC Pay' ? true:false;
    this.hideSelectionInput = false;
    if(this.showCallback === false){
      this.selfAuthCheck();
      this.proceed = true;
    }
  }
  onSubmit() {
    this.isLoadingCompelete = false;
    this.submitParams.AUTH_TYPE_O = this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    if (this.authDetails && this.authDetails) {
      this.submitParams.authRuleId = this.authDetails.OD_RULE_PARSE_ID ? this.authDetails.OD_RULE_PARSE_ID : "";
      this.submitParams.authUserNo = this.authDetails.OD_USER_NO ? this.authDetails.OD_USER_NO : "";
      this.submitParams.authUserLevel = this.authDetails.OD_LEVEL ? this.authDetails.OD_LEVEL : "";
      this.submitParams.selectionFlag = this.submitParams.authUserNo ? 'Y' : 'N';
      this.submitParams.userNoList = this.submitParams.authUserNo && this.submitParams.authUserLevel ? this.submitParams.authUserNo + '%' + this.submitParams.authUserLevel : "";
    }
    this.submitParams.approverNote = this.authorizationDetails && this.authorizationDetails.note ? this.authorizationDetails.note : "";
    if(!this.userOtpValue || this.userOtpValue.length !== 4){
      this.isLoadingCompelete = true;
      this.otpError = "LBL_PLS_ENTER_OTP";
      return;
    }else {
      this.submitParams.otp = this.userOtpValue?this.userOtpValue:'';
      this.submitParams.otpRef = this.secAuthRef?this.secAuthRef:'';
    }
    this.sadadService.submitAddSadadBiller(this.submitParams).subscribe(
      (data:any) => {
        this.isLoadingCompelete = true;
        if(data.dataValue.OD_STATUS_DESC === "Failed"){
          this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
          // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        }
        else if(data.dataValue.OD_STATUS_DESC == 'Success')
        {
          this.refNum = data.dataValue.INPUT_REFERENCE_NO;
          this.isProceed = true;
          this.isAuthentication = true;
          this.ShowAddSadadbiller = false;
          this.constructReceiptData(this.refNum,data.dataValue)
        }      

      }, (error:any) => {
        this.isLoadingCompelete = true;
      }
    )
  
  }

  constructReceiptData(refNumber: any,data :any) {

    let showCallBackComponentFlag = false;

    let flexiAuth ={
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey:
            this.authorizationDetails &&
            this.authorizationDetails.authorizer
              ? this.authorizationDetails.authorizer
              : 'Not Provided',
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey:
            this.authorizationDetails && this.authorizationDetails.note
              ? this.authorizationDetails.note
              : 'Not Provided',
        },
      ],
    }

    // var message2 :any;
    // var rejectReasonFromAPi : any;
    // let journalId :any;
    // if(data.TXN_STATUS=== "AH"){
    //   message2 = "LBL_REG_BILLER_PROCESSED_IS_INT_SUCCESS";
    //   journalId = data.JOURNAL_ID;
    // }else if(data.TXN_STATUS=== "RH"){
    //   message2 = "LBL_REG_BILLER_PROCESSED_IS_REJECTED";
    //   rejectReasonFromAPi = data.OD_REJECT_REASON;
    // }else{
    //   message2 = "LBL_REG_BILLER_READY_TO_AUTHORIZE_IS_INT_SUCCESS";
    // }

    this.rejectMsg=false;
    var message1 :any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    // let journalId :any;
    let checkAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_BILLER_REGISTRATION_SUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
      // journalId = data.JOURNAL_ID;
    }else if(data.TXN_STATUS=== "RH" || data.TXN_STATUS=== "RE"){
      message1 = "LBL_BILLER_REGISTRATION_UNSUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = data.OD_REJECT_REASON;
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "RA"){
      message1 = "LBL_BILLER_REGISTRATION_SUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
      checkAuth = true;
    }else if(data.TXN_STATUS=== "RN"){
      message1 = "LBL_BILLER_REGISTRATION_UNSUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_BILLER_REGISTRATION_SUCCESSFUL";
      message2 = "LBL_REG_BILLER_READY_TO_AUTHORIZE_IS_INT_SUCCESS";
    }else{
      message1 = "LBL_BILLER_REGISTRATION_SUCCESSFUL";
      message2 = "LBL_REG_BILLER_READY_TO_AUTHORIZE_IS_INT_SUCCESS";
    }

    this.receiptData = {
      "msg1": message1,
      // "msg2": "LBL_REG_BILLER_READY_TO_AUTHORIZE",
      "msg2": message2,
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      "showCallBackComponent":showCallBackComponentFlag,
      "subProductCode":"SADLIBR",
      "beneFullName":this.submitParams.nickName,
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          "title": "LBL_BILL_DETAILS",
          "isTable": "false",
          "data": "this.submitParams",
          "fieldDetails": [
            {
              "dispKey": "LBL_BILLER_GROUP",
              "dataKey": this.submitParams.billerGroupname
            },
            {
              "dispKey": "LBL_BILLER_COMPANY",
              "dataKey": this.submitParams.billerCompany
            },
            {
              "dispKey": "LBL_SUBSCRIBER_ID",
              "dataKey": this.submitParams.subscriberId
            },
            {
              "dispKey": "LBL_SHORT_NAME",
              "dataKey": this.submitParams.nickName
            },
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
        "buttonLabel":"LBL_INITIATE_ANOTHER_BILLER"
      },
      "finishButton":{
        "buttonLabel":"LBL_FINISH",
        "buttonPath":"/dashboard"
    }
    };

    if(this.showAuthorization && checkAuth){
      this.receiptData.receiptDetails.push(flexiAuth);
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant(message1),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant(message2),
      "keyValues": [
        {
          "subHead": "Sadad Biller Details",
          "subValue": ""
        },
        {
          "subHead": "Biller Name",
          "subValue": this.submitParams.billerCompany ? this.submitParams.billerCompany :"--"
        },
        {
          "subHead": "Subscriber ID",
          "subValue": this.submitParams.subscriberId ? this.submitParams.subscriberId:"--"
        },
        {
          "subHead": "Biller Group",
          "subValue": this.submitParams.billerGroupname ?  this.submitParams.billerGroupname : "--"
        },
        {
          "subHead": "Short Name",
          "subValue": this.submitParams.nickName ?  this.submitParams.nickName : "--"
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        }
      ],
      "pagecall":"sadadbiller",
      "refNo":refNumber
    }

    this.rootScopeData.nicknameValidationCheck = false;
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if(otpValue){
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onSubmit();
    }else{
      this.userOtpValue = "";
    }
  }
  getAuthType(val:any){
    this.authType=val
    }
    downloadPdf(values:any)
      { 
        let SelectedType = values;
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_SADAD_BILLER_RECEIPT'), x:85, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_BILL_DETAILS'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_BILLER_GROUP'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_BILLER_COMPANY'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_SUBSCRIBER_ID'), y:95},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:105},
        { type: 'text', value:this.submitParams.billerGroupname ? this.submitParams.billerGroupname : '', y:75},
        { type: 'text', value:this.submitParams.billerCompany ? this.submitParams.billerCompany : '', y:85},
        { type: 'text', value:this.submitParams.subscriberId? this.submitParams.subscriberId : '', y:95},
        { type: 'text', value:this.submitParams.nickName ? this.submitParams.nickName : '', y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
        { type: 'text', value: this.refNum ? this.refNum : '', y:115},
        { type: 'heading', value:this.translateService.instant('LBL_REG_BILLER_READY_TO_AUTHORIZE_IS_INT_SUCCESS'), y:125},
        
      ]

      //   this.pdfData.push(
      //     { type: 'save', value:'SADADbiller.pdf'}
      //  )
      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'SADADbiller.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'SADADbiller.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }

  clearEvent(event:any){
    this.clearForm = event;
    this.rootScopeData.addSadadBillerReviewMode = false;
    this.proceed = false;
    this.hideSelectionInput = true;
    this.showCallback = false;
    this.isAuthentication = false;
    this.finalsubmit = false;
    this.validationFlag = false;
    this.rootScopeData.nicknameValidationCheck = false;
  }

  getCancelBtnClick(){
    this.initAnotherBiller();
  }

  callBackSuccess(){
    this.selfAuthCheck();
    this.proceed = true;
  }

  selfAuthCheck(){
    let reqObj = {
      debitCifNo:"",
      vsubprdtcode:"SADLIBR",
      funCode:"SADLB",
      paymentAmount:"0",
      debitPortalAccNo:"",
      debitCurrencyCode:"",
      unitID:"IGTBSA"
    }
    // this.checkFlexiAuth = false;
    this.sadadService.selfAuthCheck(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        if (response.data.selfAuth == "true") {
          this.showAuthentication = true;
        }
        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          // this.checkFlexiAuth = true;
          this.authorsList = response.data.authList;
        }
      }
    }, error => {
      this.isLoadingCompelete = true;
    });
  }

  setAuthorizationData(authorDetails: any): void {
    this.authDetails = authorDetails.selectedAprover;
    this.authorizationDetails.authorizer =
      authorDetails.selectedAprover.AUTH_NAME;
    this.authorizationDetails.note = authorDetails.aproveNote;
  }

  getCanelBtnClick(){
    this.initAnotherBiller();
  }
}


