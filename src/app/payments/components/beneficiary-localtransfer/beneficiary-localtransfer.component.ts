import { Component, OnInit } from '@angular/core';
import {RootScopeDeclare} from '../../../rootscope-declare';
import {RootScopeData} from '../../../rootscope-data';
import {PaymentsServiceService} from '../../services/payments-service.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-beneficiary-localtransfer',
  templateUrl: './beneficiary-localtransfer.component.html',
  styleUrls: ['./beneficiary-localtransfer.component.scss']
})
export class BeneficiaryLocaltransferComponent implements OnInit {
  isProceed=false;
  hideAll=false
  receiptData: any;
  sadadService: any;
  isLoadingCompelete = true;
  country: any;
  countryCode: any;
  accNumber:any;
  shortName:any;
  fullName:any;
  currency: any;
  bankName: any;
  branchName: any;
  showBankName: boolean = false;
  showAccountNumberInvalid: boolean = false;
  showShortNameInvalid: boolean = false;
  showFullNameInvalid:boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  bankCity: any;
  SwiftCode: any;
  shortNameDuplicateFlag: boolean = false;
  accErrMsg:any
  url:string='';
  txnStatus :any;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:"",
    type: ""
  }
  showbeneCreationInValid:boolean=false
  accNumInvalid:boolean=false;
  pdfData: any;
  refNo: any;
  showAccountNumberInvalidError: boolean = false;
  showAccNumNCBError: boolean = false;
  pageCall:any;
  isProceedBtnShow:boolean=true;
  saveReceiptObject: any;
  rejectMsg: boolean = false;
  constructor(public paymentservice:PaymentsServiceService, private downloadAsPdf:downloadAsPdf, private translateService: TranslateService) { 
    this.rootScopeData.paymentActiveTabName = 'local';
    this.pageCall = 'beneficiary'
  }

ngOnInit(): void {
  this.getCountry();
  this.url = systemproperty.termsAndConditionsForPayments;
}
getCountry(){
  let params={
    moduleId:"COUNTRYLKPDFT",
    unitId:this.rootScopeData.userInfo.UNIT_ID
  }
  this.paymentservice.getCountry(params).subscribe(
    (response:any)=>{
      this.isLoadingCompelete = true;
      this.country = response.data[0].countryName;
      this.countryCode = response.data[0].countryCode;
    },
    (error:any) =>{
      this.isLoadingCompelete = true;
      }
  )
}

validateAccountNumber(){
  this.showAccNumNCBError = false;
  this.showAccountNumberInvalidError = false;
  if(this.accNumber){
    if(this.accNumber.includes("SA") === true || this.accNumber.includes("sa") === true){
      this.accNumber = this.accNumber.substring(2);
    }
    let params={
      accNumber:`SA${this.accNumber}`,
      paymentMode:"BKSRNT",
      unitId:this.rootScopeData.userInfo.UNIT_ID,
      country:"SAUDI ARABIA",
      countryCode:"SA",
      currency:"SAR"
    }
    this.isLoadingCompelete = false;
    this.showAccountNumberInvalid = false;
    this.accNumInvalid=false;
    this.paymentservice.validateAccountNumber(params).subscribe(
      (response:any)=>{
        this.isLoadingCompelete = true;
        if(response.data.HOST_RESP === "SUCCESS"){
          if(response.data.IBAN_VALID==="2"){
            this.showBankName = false;
            this.showbeneCreationInValid = true;
            this.showAccountNumberInvalid = false;
            this.accNumInvalid=false
            this.showAccountNumberInvalidError = false;
            this.isProceedBtnShow=false
            this.showAccNumNCBError = false;
          }else if(response.data.IBAN_VALID==="0"){
            this.showBankName = false;
            this.showbeneCreationInValid=false;
            this.showAccountNumberInvalid = true;
            this.accNumInvalid=false;
            // this.accErrMsg="LBL_ACC_NO_ERR_MSG"
            this.showAccountNumberInvalidError = true;
            this.isProceedBtnShow=false
            this.showAccNumNCBError = false;
          }else if(response.data.IBAN_VALID==="3"){
            this.showBankName = false;
            this.showbeneCreationInValid=false;
            this.showAccountNumberInvalid = true;
            this.accNumInvalid=false;
            // this.accErrMsg="LBL_AACOUNT_NUMBER_IS_NCB";
            this.showAccNumNCBError = true;
            this.showAccountNumberInvalidError = false;
           this.isProceedBtnShow=false
          }else{
            this.showBankName = true;
            this.showbeneCreationInValid=false;
            this.showAccountNumberInvalid=false;
            this.accNumInvalid=false;
            this.showAccNumNCBError = false;
            this.showAccountNumberInvalidError = false;
            this.currency = response.data.BENE_CURRENCY;
            this.bankName = response.data.BANK_NAME;
            this.branchName = response.data.BRANCH_NAME;
            this.bankCity = response.data.BANK_ADDRESS;
            this.SwiftCode = response.data.SWIFT_CODE;
          }
        }else{
          this.showBankName = false;
          this.showbeneCreationInValid=false;
          this.showAccountNumberInvalid = true;
          this.accNumInvalid=false
          // this.accErrMsg="LBL_ACC_NO_ERR_MSG";
          this.showAccountNumberInvalidError = true;
          this.showAccNumNCBError = false;
          if(response.data.HOST_RESP === "FAILURE"){
            if(response.data.SWIFT_CODE.includes("NCB") === true || response.data.SWIFT_CODE.includes("ncb") === true){
              this.showBankName = false;
              this.showbeneCreationInValid=false;
              this.showAccountNumberInvalid = true;
              this.accNumInvalid=false;
              // this.accErrMsg="LBL_AACOUNT_NUMBER_IS_NCB"
              this.showAccNumNCBError = true;
              this.showAccountNumberInvalidError = false;
              this.isProceedBtnShow=false;
            }            
          }
        }
      },
      (error:any) =>{
        this.isLoadingCompelete = true;
        }
    )
  }else{
    this.showAccountNumberInvalid = false;
    this.showbeneCreationInValid=false;
    this.accNumInvalid=true
    // this.accErrMsg="LBL_PLEASE_ENTER_ACC_NUMBER"
    this.showBankName = false;
  }
  
}

validateBeneShortName(){
  if(this.accNumber){
    if(this.showAccountNumberInvalid){
      this.showbeneCreationInValid=false;
      // this.accErrMsg="LBL_ACC_NO_ERR_MSG"
      this.showAccNumNCBError = false;
      this.showAccountNumberInvalidError = true;
    }
  }
  else{
    this.accNumInvalid = this.accNumber && !this.showbeneCreationInValid && !this.showAccountNumberInvalid ? false:true;
    // this.accErrMsg=this.accNumber?'':"LBL_PLEASE_ENTER_ACC_NUMBER"
  }
  // this.showAccountNumberInvalid = this.accNumber ? false:true;
  this.showShortNameInvalid = this.shortName ? false : true;
  this.showFullNameInvalid = this.fullName ? false:true;
  let shortnameParams={
    // accNumber:this.accNumber,
    accNumber:`SA${this.accNumber}`,
    shortName:this.shortName,
    paymentValue:"BKSRNT"
  }
  if(!this.showShortNameInvalid){
  this.isLoadingCompelete = false;
  this.paymentservice.validateShortName(shortnameParams).subscribe((response:any) => {
    this.isLoadingCompelete = true;
    if (response.data.HOST_RESP[0] === "SUCCESS") {
     this.shortNameDuplicateFlag = false;
     this.proceedNext();
    }
    if (response.data.HOST_RESP[0] === "FAILURE") {
      this.shortNameDuplicateFlag = true;
    }
  }, error => {
    this.isLoadingCompelete = true;
    this.shortNameDuplicateFlag = false;
  })
 }
}

onEnterShortName(){
  this.showShortNameInvalid = this.shortName ? false:true;
}

onEnterFullName(){
  this.showFullNameInvalid = this.fullName ? false:true;
}

proceedNext(){
  if(!this.showAccountNumberInvalid && !this.showShortNameInvalid && !this.showFullNameInvalid && !this.shortNameDuplicateFlag && !this.showbeneCreationInValid && !this.accNumInvalid){
    this.initReqParam.accNo=this.accNumber?`SA${this.accNumber}`:"";
      this.initReqParam.amt="0";
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode='BENE';
      this.initReqParam.cif=this.accNumber?`SA${this.accNumber}`:"";
      this.initReqParam.unitId="IGTBSA";
      this.initReqParam.type = "BKSRNT";
    this.isProceed=true;
    this.rootScopeData.changeAddBeneficiaryHeading = true;
  }
}
allowAlphabetsAndSpaceOnly(event:any){
  var charCode = event.keyCode;
  if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 32 ){
    return true;
  }else{
    return false;
  }
}
initiateAnotherRegistration(){
  this.hideAll = false;
  this.isProceed = false;
  this.accNumber = "";
  this.shortName = "";
  this.fullName = "";
  this.showBankName = false;
  this.rootScopeData.hideBeneficiaryToggle = false;
  this.rootScopeData.changeAddBeneficiaryHeading = false;
}
onClickCancel(){
  this.initiateAnotherRegistration();
}
submit(){
  let day=new Date().getDate();
  let month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):"0"+(new Date().getMonth()+1)
  let year=new Date().getFullYear()
  let date=day+"/"+month+"/"+year
let submitParams={
  // accNumber:this.accNumber,
  accNumber:`SA${this.accNumber}`,
  shortName:this.shortName,
  accName:this.fullName,
  currency:this.currency,
  bankName:this.bankName,
  beneCombo:"Domestic Fund Transfer",
  branchName:this.branchName,
  bankCity:this.bankCity,
  swiftCode:this.SwiftCode,
  country:this.country,
  countryCode:this.countryCode,
  paymentValue:"BKSRNT",
  clearingCode:"",
  beneCountry:"",
  beneCountryCode:"",
  beneCity:"",
  beneState:"",
  beneAddress:"",
  benePostalCode:"",
  benePhoneNumber:"",
  otp:this.userOtpValue,
  otpRef:this.secAuthRef,
  cif_no:"",
  inp_debit_acc_no:"BKSRNT",
  inp_debit_amt:"0",
  inp_deb_org_acc_no:"BKSRNT",
  inp_mode:"BKSRNT",
  od_subPrdt_code:"BENE",
  pay_amt:"0",
  req_cntry_code:"",
  trans_flag:"Y",
  inp_value_date:date
  }
  // if(this.rootScopeData.userInfo.isSingleUser === 'Y' && this.rootScopeData.userInfo.isSoloCorporate === 'Y'){
     if(!this.userOtpValue || this.userOtpValue.length !== 4){
        this.isOtpValid = "LBL_PLS_ENTER_OTP";
        return;
      }
  // }
  this.isLoadingCompelete = false;
  this.paymentservice.submitPayment(submitParams).subscribe((response:any) => {
    this.isLoadingCompelete = true;
    if (response.dataValue.OD_STATUS_DESC == "Success") {
        this.hideAll=true;
        this.rootScopeData.hideBeneficiaryToggle = true;
        this.userOtpValue = "";
        this.secAuthRef = "";
        this.isOtpValid = "";
        this.refNo = response.dataValue.INPUT_REFERENCE_NO;
        this.txnStatus = response.dataValue.TXN_STATUS
        this.constructReceiptData(response.dataValue.INPUT_REFERENCE_NO,response.dataValue);
    }else{
      this.isOtpValid ="LBL_PLEASE_ENTER_VALID_OTP";
    }
  }, error => {
    this.isLoadingCompelete = true;
  })
}
onSecondFactorValue(authValue: any) {
  let vAuthvalue = authValue;
  this.secAuthRef = authValue.data.secfRefNo;
}

getOtpValue(otpValue: any) {
  // this.userOtpValue = otpValue;
  if (otpValue) {
    this.isOtpValid = "";
    this.userOtpValue = otpValue;
    this.submit();
  } else {
    this.userOtpValue = "";
    this.isOtpValid = "LBL_PLS_ENTER_OTP";

  }
}
constructReceiptData(refNumber: any, data:any) {
  let beneReceiptData={
    // accNumber:this.accNumber,
    accNumber:`SA${this.accNumber}`,
    shortName:this.shortName,
    currency:this.currency? this.currency : "SAR"
  }
  // let showCallBackComponentFlag = this.rootScopeData.callBackOTPEntitlement.beneRegistrationCallBack === 'Y' ? true:false;
  let showCallBackComponentFlag = (this.txnStatus === 'AO' || this.txnStatus === 'RA') && (this.rootScopeData.userInfo.ivrAuthentication === 'Y') ? true:false;
  let showDisplayedMsg ;
  // if(this.txnStatus === 'RN'){
  //   showDisplayedMsg = "LBL_BENEFICIARY_CREATION_FAILED_DUE_TO_RULE_NOT_FOUND";
  //  }
  //  else if(this.txnStatus === 'RE'){
  //   showDisplayedMsg = "LBL_BENEFICIARY_CREATION_FAILED_DUE_TO_ENTITLEMENT";
  //  }
  //  else{
  //   showDisplayedMsg = "LBL_BENE_REG_IS_INT_SUCCESS"
  //  }

   this.rejectMsg=false;
    var message1 :any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    // let journalId :any;
    let checkAuth : boolean = false;
    if(this.txnStatus=== "AH"){
      message1 = "LBL_BENE_REG_SUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
      // journalId = data.JOURNAL_ID;
    }else if(this.txnStatus=== "RH" || this.txnStatus=== "RE"){
      message1 = "LBL_BENE_REG_UNSUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = data.OD_REJECT_REASON;
      this.rejectMsg = true;
    }else if(this.txnStatus=== "RA"){
      message1 = "LBL_BENE_REG_SUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
      checkAuth = true;
    }else if(this.txnStatus=== "RN"){
      message1 = "LBL_BENE_REG_UNSUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(this.txnStatus=== "AO"){
      message1 = "LBL_BENE_REG_SUCCESSFUL";
      message2 = "LBL_BENE_REG_IS_INT_SUCCESS";
    }else{
      message1 = "LBL_BENE_REG_SUCCESSFUL";
      message2 = "LBL_BENE_REG_IS_INT_SUCCESS";
    }
this.receiptData = {
  "msg1": message1,
  // "msg2": "LBL_BENE_REG_PENDNG_FR_APPROVAL_MSG",
  "msg2": message2,
  "referenceNumber": refNumber,
  "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
  "showCallBackComponent":showCallBackComponentFlag,
  "subProductCode":"BKSRNT",
  "beneFullName":this.fullName,
  "receiptDetails": [
    {
      "title": "LBL_FROM",
      "isTable": "false",
      "data": beneReceiptData,
      
      "fieldDetails": [
        {
          "dispKey": "LBL_ACC_NUMBER",
          "dataKey": beneReceiptData.accNumber
        },
        {
          "dispKey": "LBL_SHORT_NAME",
          "dataKey": beneReceiptData.shortName
        },
        {
          "dispKey": "LBL_CURRENCY",
          "dataKey": beneReceiptData.currency
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
      "buttonLabel":"LBL_INITIATE_ANOTHER_REG"
    },
    "finishButton":{
      "buttonLabel":"LBL_FINISH",
      "buttonPath":"/dashboard"
    }
}

this.saveReceiptObject = {
  "pageheading": this.translateService.instant(message1),
  "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
  "Description": this.translateService.instant(message2),
  "keyValues": [
    {
      "subHead": "From",
      "subValue": ""
    },
    {
      "subHead": "Account Number",
      "subValue": beneReceiptData.accNumber ? beneReceiptData.accNumber : "--"
    },
    {
      "subHead": "Nickname",
      "subValue": beneReceiptData.shortName ? beneReceiptData.shortName : "--"
    },
    {
      "subHead": "Currency",
      "subValue": beneReceiptData.currency ? beneReceiptData.currency : "--"
    },
    {
      "subHead": "Reject Reason",
      "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
    }
  ],
  "pagecall":"beneficiary",
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
        { type: 'title', value:this.translateService.instant('LBL_BENEFICIARY_REGISTRATION_RECEIPT'), x:75, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_CURRENCY'), y:95},
        { type: 'text', value:this.accNumber ? `SA${this.accNumber}`: '', y:75},
        // { type: 'text', value:this.accNumber ? this.accNumber: '', y:75},
        { type: 'text', value:this.shortName ? this.shortName : '', y:85},
        { type: 'text', value:this.currency ? this.currency : '', y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:105},
        { type: 'text', value:this.refNo ? this.refNo : '', y:105},
        { type: 'heading', value:this.translateService.instant('LBL_BENE_REG_IS_INT_SUCCESS'), y:115},

      ]

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'BeneficiaryLocal.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'BeneficiaryLocal.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }

  onPasteEvent(event:any)
  {
    let pastedAccNum;
    let clipboardData = event;
    pastedAccNum = clipboardData;
    if(pastedAccNum){
      if(pastedAccNum.includes("SA") === true || pastedAccNum.includes("sa") === true){
        this.accNumber = pastedAccNum.substring(2);
      }      
    }  
    
  }

  getCancelBtnClick(){
    this.initiateAnotherRegistration();
  }
}
