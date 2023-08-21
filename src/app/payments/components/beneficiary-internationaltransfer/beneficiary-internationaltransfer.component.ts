import { Component, OnInit } from '@angular/core';
import {RootScopeDeclare} from '../../../rootscope-declare';
import {RootScopeData} from '../../../rootscope-data';
import {PaymentsServiceService} from '../../services/payments-service.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-beneficiary-internationaltransfer',
  templateUrl: './beneficiary-internationaltransfer.component.html',
  styleUrls: ['./beneficiary-internationaltransfer.component.scss']
})
export class BeneficiaryInternationaltransferComponent implements OnInit {

rootScopeData: RootScopeDeclare = RootScopeData;
accountCountry="";
currency="";
hideAll=false;
receiptData:any;
isLoadingCompelete = true;
country: any=[];
showOtherInformation: boolean = false;
bankName = "";
branchName = "";
bankCity="";
SwiftCode="";
countryCode: any;
currencyCode: any;
accountNumberValidationFlag: boolean = false;
accountDataToPass: any;
accNum: any;
fullNameValidationFlag: boolean = false;
beneFullName: any;
beneShortName: any;
shortNameValidationFlag: boolean = false;
secAuthRef: any;
userOtpValue: any;
isOtpValid:any;
clearingCode: any;
beneDetails: any;
setAccountdetailsClearFlag: boolean = false;
shortNameDuplicateFlag: boolean = false;
currencyDataFromAPI: any;
enteredSwiftCode: any;
swiftCodeValidationFlag: boolean = false;
routerCodeValidationFlag: boolean = false;
accErrMsgs:any
isSwiftCodeValidate: boolean = false;
ccy:any
url:string='';
iBanorNot:string='';
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
currencyValidationFlag: boolean = false;
pdfData: any;
  refNo: any;
  beneCity: any;
  beneState: any;
  beneAddress: any;
  cityValidationFlag: boolean = false;
  addressValidationFlag: boolean = false;
  stateValidationFlag: boolean = false;
  localCountryList: any;
  enableValidateSwiftCode: boolean = false;
  checkBeneBankDetails: boolean = false;
  ibanLength:string="";
  pageCall:any;
  checkCountryIbanValidation: any;
  bankRouteCodeValidate: boolean = false;
  saveReceiptObject: any;
  txnStatus :any;
  rejectMsg: boolean =false;
  beneCountry: any;
  countryValidationFlag: boolean = false;
constructor(public paymentservice:PaymentsServiceService, private downloadAsPdf:downloadAsPdf, private translateService: TranslateService) { 
  this.rootScopeData.paymentActiveTabName = 'international';
  this.pageCall = 'beneficiary'
}

ngOnInit(): void {
  this.getCountry();
  if(this.accountCountry){
    for(let i=0;i<=this.country.length;i++){
      if(this.accountCountry === this.country[i].countryName){
        this.countryCode = this.country[i].countryCode;
        this.currencyCode = this.country[i].ccyCode;
      }
    }
  }
  this.url = systemproperty.termsAndConditionsForPayments;
}

getCountry(){
  let params={
    moduleId:"COUNTRYLKPIFT",
    unitId:this.rootScopeData.userInfo.UNIT_ID
  }
  this.paymentservice.getCountry(params).subscribe(
    (response:any)=>{
      this.isLoadingCompelete = true;
      // this.country = response.data;
      //Balaji code
      this.country = this.localCountryList = response.data;

      this.getCurrency();
      // this.accountCountry = response.data[0].countryName;
    },
    (error:any) =>{
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      }
  )
}

getCurrency(){
  this.isLoadingCompelete = false;
  let params={
    unitId:this.rootScopeData.userInfo.UNIT_ID,
    countryCode:this.countryCode,
    paymentMode:"TELTRF",
  }
  this.paymentservice.getCurrency(params).subscribe(
    (response:any)=>{
      this.isLoadingCompelete = true;
      this.currencyDataFromAPI = response.data[0].transactionCcy;
    },
    (error:any) =>{
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      }
  )
}
onCountrySelect(){
  this.accountDataToPass = {};
  this.enableValidateSwiftCode = false;
  this.bankRouteCodeValidate = false;
  this.showOtherInformation = this.accountCountry ? true:false;
  this.localCountryList.forEach((element:any) => {
      if(this.accountCountry === element.countryName){
        this.countryCode=element.countryCode
        this.checkCountryIbanValidation = element.clearCodeInq;
        if(element.clearCodeInq === "Y"){
          this.isSwiftCodeValidate = true;
          this.checkBeneBankDetails = true;
          this.iBanorNot = "Y";
          this.bankRouteCodeValidate = true;
        }else{
          this.isSwiftCodeValidate = false;
          this.checkBeneBankDetails = false;
          this.iBanorNot="N";
          this.bankRouteCodeValidate = false;
        }
      }
      
  });
}
onAccountNumberEnter(data:any){
this.accNum = data;
if(data){
  let params={
    accNumber:data,
    paymentMode:"TELTRF",
    unitId:this.rootScopeData.userInfo.UNIT_ID,
    country:this.accountCountry,
    countryCode:this.countryCode,
    currency:this.ccy
  }
  this.isLoadingCompelete = false;
  this.accountNumberValidationFlag = false;
  this.showbeneCreationInValid=false;
  this.accNumInvalid=false;
  if(this.checkCountryIbanValidation === "Y"){
    this.paymentservice.validateAccountNumber(params).subscribe(
      (response:any)=>{
        this.isLoadingCompelete = true;
        if(response.data.HOST_RESP === "SUCCESS"){
        if(response.data.IBAN_VALID === "0"){
          this.showbeneCreationInValid = false;
          this.accNumInvalid=true
          this.accountNumberValidationFlag = false;
          // this.accErrMsgs="LBL_ACC_NO_ERR_MSG"
        }else if(response.data.IBAN_VALID === "2"){
          this.accountNumberValidationFlag = false;
          this.accNumInvalid=false
          this.showbeneCreationInValid = true;
        }else{
          this.accountNumberValidationFlag = false;
          this.showbeneCreationInValid = false;
          this.accNumInvalid=false
          var reqData = {
            ibanAccount : data,
            countryCode : this.countryCode
          }
          if(this.checkBeneBankDetails === true){
            this.paymentservice.bankVerify(reqData).subscribe((res:any)=>{
              if(res.data.bicCode){
                this.bankName = res.data.institutionName;
                this.branchName = res.data.branch;
                this.bankCity = res.data.city;
                // this.SwiftCode = response.data[0].bankDetails[0].swiftCode;

                this.accountDataToPass={
                  bankName:res.data.institutionName,
                  branchName:res.data.branch,
                  bankCity:res.data.city,
                  bicCode: res.data.bicCode,
                  accNo: data
                }
                this.enteredSwiftCode = res.data.bicCode
                this.enableValidateSwiftCode = true;
                this.bankRouteCodeValidate = true;
              }else{
                this.enableValidateSwiftCode = false;
                this.bankRouteCodeValidate = false;
              }
            })
          }
          
        }
      }else{
        this.showbeneCreationInValid = false;
        this.accNumInvalid=true
        this.accountNumberValidationFlag = false;
      }
      },
      (error:any) =>{
        this.isLoadingCompelete = true;
        }
    )
  }else{
    this.isLoadingCompelete = true;
  }
  
}else{
  this.accountNumberValidationFlag = true;
  this.showbeneCreationInValid = false;
  this.accNumInvalid=false
  this.accErrMsgs="LBL_PLEASE_ENTER_ACC_NUMBER"
}
}

onRoutingCodeEnter(data:any){
  this.enableValidateSwiftCode = false;
   this.clearingCode = data;
   let pageCall = 'N';
   //New Implementation for route Code validation//
   this.paymentservice.validateSwiftCode(this.clearingCode,this.countryCode,pageCall).subscribe(
    (response:any)=>{
      this.isLoadingCompelete = true;
        if(response.data[0].bankDetails.length === 0){
          this.routerCodeValidationFlag = true;
        }else{
          this.routerCodeValidationFlag = false;
          
          this.bankName = response.data[0].bankDetails[0].bankDescription;
          this.branchName = response.data[0].bankDetails[0].branchName;
          this.bankCity = response.data[0].bankDetails[0].address2;
          this.SwiftCode = response.data[0].bankDetails[0].swiftCode;
          
            this.isSwiftCodeValidate = true;
            this.swiftCodeValidationFlag = false;
            if(this.SwiftCode){
              this.enableValidateSwiftCode = true;
            }else{
              this.enableValidateSwiftCode = false;
            }
            this.enteredSwiftCode = response.data[0].bankDetails[0].swiftCode
          
          this.accountDataToPass={
            bankName:this.bankName,
            branchName:this.branchName,
            bankCity:this.bankCity,
            bicCode:this.SwiftCode
        } 
      }
    },
    (error:any) =>{
      this.isLoadingCompelete = true;
    }
  )
   //New Implementation for route Code validation//

}
onSwiftCodeEnter(data:any){
  this.bankRouteCodeValidate = false;
  this.enteredSwiftCode = data;
  this.validateSwiftCodeApi();
}
validateSwiftCodeApi(){
  if(this.enteredSwiftCode){
  this.isLoadingCompelete = false;
  let pageCall = 'Y';
  this.paymentservice.validateSwiftCode(this.enteredSwiftCode,this.countryCode,pageCall).subscribe(
    (response:any)=>{
      this.isLoadingCompelete = true;
        if(response.data[0].bankDetails.length === 0){
          this.isSwiftCodeValidate = false;
          this.swiftCodeValidationFlag = true;
          this.bankRouteCodeValidate = false;
        }else{
          this.isSwiftCodeValidate = true;
          this.swiftCodeValidationFlag = false;
          this.bankRouteCodeValidate = true;
          this.bankName = response.data[0].bankDetails[0].bankDescription;
          this.branchName = response.data[0].bankDetails[0].branchName;
          this.bankCity = response.data[0].bankDetails[0].address2;
          this.accountDataToPass={
            bankName:this.bankName,
            branchName:this.branchName,
            bankCity:this.bankCity
        } 
      }
    },
    (error:any) =>{
      this.isLoadingCompelete = true;
    }
  )
}else{
  this.swiftCodeValidationFlag = true;
}
}
getEnteredValues(data:any){
    this.beneFullName = data.fullName;
    this.beneShortName = data.shortName;
    this.beneDetails = data;
    this.beneCity = data.city;
    this.beneState = data.state;
    this.beneAddress = data.address;
    this.beneCountry = data.country
}
proceedNxt(){
  //debugger;
  if(this.accNum && this.beneFullName && this.beneShortName && this.beneCity && this.beneState && this.beneAddress && this.beneCountry && (this.enteredSwiftCode || this.clearingCode) && !this.shortNameDuplicateFlag &&!this.accountNumberValidationFlag &&!this.showbeneCreationInValid && !this.accNumInvalid){    
    this.initReqParam.accNo=this.accNum?this.accNum:"";
      this.initReqParam.amt="0";
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode='BENE';
      this.initReqParam.cif=this.accNum?this.accNum:"";
      this.initReqParam.unitId="IGTBSA";
      this.initReqParam.type = "TELTRF";
    this.rootScopeData.changeAddBeneficiaryReviewMode = true;
    this.rootScopeData.changeAddBeneficiaryHeading = true;
  }
}

validateBeneShortName(){
  if(this.accNum){
    if(this.accountNumberValidationFlag){
      // this.accErrMsgs="LBL_ACC_NO_ERR_MSG"
    }
  }
  else{
    this.accountNumberValidationFlag = this.accNum && !this.showbeneCreationInValid &&!this.accNumInvalid ? false:true;
    this.accErrMsgs=this.accNum?'':"LBL_PLEASE_ENTER_ACC_NUMBER"
  }

  if(this.currency){
    this.currencyValidationFlag = false;
  }else{
    this.currencyValidationFlag = true;
    return;
  }
  // this.accountNumberValidationFlag = this.accNum ? false:true;
  if(this.iBanorNot === 'N')
  {
    if(this.clearingCode || this.enteredSwiftCode){
       this.swiftCodeValidationFlag = false;
       this.routerCodeValidationFlag = false;
    }
    else{
      this.swiftCodeValidationFlag = this.enteredSwiftCode ?  false:true;
    }    
  }
  else{
    this.swiftCodeValidationFlag = this.enteredSwiftCode ?  false:true;
  }
  this.fullNameValidationFlag = this.beneFullName ? false:true;
  this.shortNameValidationFlag = this.beneShortName ? false:true;
  this.countryValidationFlag = this.beneCountry ? false : true;
  this.cityValidationFlag = this.beneCity ? false:true;
  this.stateValidationFlag = this.beneState ? false:true;
  this.addressValidationFlag = this.beneAddress ? false:true;
  let shortnameParams={
    accNumber:this.accNum,
    shortName:this.beneShortName,
    paymentValue:"TELTRF"
  }
  if(!this.shortNameValidationFlag){
  this.isLoadingCompelete = false;
  this.paymentservice.validateShortName(shortnameParams).subscribe((response:any) => {
    this.isLoadingCompelete = true;
    if (response.data.HOST_RESP[0] === "SUCCESS") {
     this.shortNameDuplicateFlag = false;
     this.proceedNxt();
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
submit(){
  let day=new Date().getDate();
  let month=(new Date().getMonth()+1)>9?(new Date().getMonth()+1):"0"+(new Date().getMonth()+1)
  let year=new Date().getFullYear()
  let date=day+"/"+month+"/"+year
  let submitParams={
    accNumber:this.accNum,
    shortName:this.beneShortName,
    accName:this.beneFullName,
    currency:this.currency,//Currency field to be passed
    bankName:this.bankName,
    beneCombo:"International Fund Transfer",
    branchName:this.branchName,
    country:this.accountCountry,
    countryCode:this.countryCode,
    paymentValue:"TELTRF",
    bankCity:this.bankCity,
    swiftCode:this.enteredSwiftCode ? this.enteredSwiftCode :'',
    clearingCode:this.clearingCode ? this.clearingCode :'',
    beneCountry:this.beneDetails.country,
    beneCountryCode:this.beneDetails.countryCode,
    beneCity:this.beneDetails.city,
    beneState:this.beneDetails.state,
    beneAddress:this.beneDetails.address,
    benePostalCode:this.beneDetails.postalCode,
    benePhoneNumber:this.beneDetails.phoneNumber,
    otp:this.userOtpValue,
    otpRef:this.secAuthRef,
    cif_no:"",
    inp_debit_acc_no:"TELTRF",
    inp_debit_amt:"0",
    inp_deb_org_acc_no:"TELTRF",
    inp_mode:"TELTRF",
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
          this.userOtpValue = "";
          this.secAuthRef = "";
          this.isOtpValid = "";
          this.rootScopeData.hideBeneficiaryToggle = true;
          this.refNo = response.dataValue.INPUT_REFERENCE_NO;
          this.txnStatus = response.dataValue.TXN_STATUS;
          this.constructReceiptData(response.dataValue.INPUT_REFERENCE_NO, response.dataValue);
      }
      else{
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

onClickCancel(){
  this.hideAll=false;
  this.showOtherInformation = false;
  this.accountNumberValidationFlag = false;
  this.swiftCodeValidationFlag = false;
  this.routerCodeValidationFlag = false;
  this.accountCountry="";
  this.accNum = "";
  this.beneFullName = "";
  this.beneShortName = "";
  this.enteredSwiftCode = "";
  // this.accountDataToPass = "";
  this.beneCity = "";
  this.beneState = "";
  this.beneAddress = "";
  this.setAccountdetailsClearFlag = true;
  this.rootScopeData.changeAddBeneficiaryReviewMode = false;
  this.rootScopeData.changeAddBeneficiaryHeading = false;
  this.rootScopeData.hideBeneficiaryToggle = false;
}

initiateAnotherRegistration(){
  this.onClickCancel();
}
onClickReviewCancel(){
  this.rootScopeData.changeAddBeneficiaryReviewMode = true;
}
constructReceiptData(refNumber: any,data:any) {
    let beneReceiptData={
      accNumber:this.accNum,
      country:this.accountCountry,
      currency:this.currency
    }
    let beneficiaryAccData={
      fullName:this.beneFullName,
      shortName:this.beneShortName,
      country:this.beneDetails.country,
      city:this.beneDetails.city,
      state:this.beneDetails.state,
      address:this.beneDetails.address
    }
    // debugger
    // let showCallBackComponentFlag = this.rootScopeData.callBackOTPEntitlement.beneRegistrationCallBack === 'Y' ? true:false;
    let showCallBackComponentFlag = (this.txnStatus === 'AO' || this.txnStatus === 'RA') && this.rootScopeData.userInfo.ivrAuthentication === 'Y' ? true:false;
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
    "subProductCode":"TELTRF",
    "beneFullName":beneficiaryAccData.fullName,
    "receiptDetails": [
      {
        "title": "LBL_ACCOUNT_DETAILS",
        "isTable": "false",
        "data": beneReceiptData,
        
        "fieldDetails": [
          {
            "dispKey": "LBL_ACC_NUMBER",
            "dataKey": beneReceiptData.accNumber
          },
          {
            "dispKey": "LBL_COUNTRY",
            "dataKey": beneReceiptData.country
          },
          {
            "dispKey": "LBL_CURRENCY",
            "dataKey": beneReceiptData.currency
          }
        ]
      },
      {
        "title": "LBL_BENEFICIARY_DETAILS",
        "isTable": "false",
        "data": beneficiaryAccData,
        
        "fieldDetails": [
          {
            "dispKey": "LBL_FULL_NAME",
            "dataKey": beneficiaryAccData.fullName
          },
          {
            "dispKey": "LBL_SHORT_NAME",
            "dataKey": beneficiaryAccData.shortName
          },
          {
            "dispKey": "LBL_COUNTRY",
            "dataKey": beneficiaryAccData.country
          },
          {
            "dispKey": "LBL_CITY",
            "dataKey": beneficiaryAccData.city
          },
          {
            "dispKey": "LBL_STATE",
            "dataKey": beneficiaryAccData.state
          },
          {
            "dispKey": "LBL_ADDRESS",
            "dataKey": beneficiaryAccData.address
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
        "subHead": "Account Details",
        "subValue": ""
      },
      {
        "subHead": "Account Number",
        "subValue": beneReceiptData.accNumber ? beneReceiptData.accNumber : "--"
      },
      {
        "subHead": "Country",
        "subValue": beneReceiptData.country ? beneReceiptData.country : "--"
      },
      {
        "subHead": "Currency",
        "subValue": beneReceiptData.currency ? beneReceiptData.currency : "--"
      },
      {
        "subHead": "Beneficiary Details",
        "subValue": ""
      },
      {
        "subHead": "Full Name",
        "subValue": beneficiaryAccData.fullName ? beneficiaryAccData.fullName :"--"
      },
      {
        "subHead": "Short Name",
        "subValue": beneficiaryAccData.shortName ? beneficiaryAccData.shortName : "--"
      },
      {
        "subHead": "To Country",
        "subValue": beneficiaryAccData.country ? beneficiaryAccData.country : "--"
      },
      {
        "subHead": "City",
        "subValue": beneficiaryAccData.city ? beneficiaryAccData.city : "--"
      },
      {
        "subHead": "State",
        "subValue": beneficiaryAccData.state ? beneficiaryAccData.state : "--"
      },
      {
        "subHead": "Address",
        "subValue": beneficiaryAccData.address ? beneficiaryAccData.address : "--"
      },
      {
        "subHead": "Reject Reason",
        "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
      }
    ],
    "pagecall":"beneficiaryinternational",
    "refNo":refNumber
  }
  }

  onCurrencySelect(){
    this.currencyValidationFlag = false;
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
        { type: 'heading', value:this.translateService.instant('LBL_ACCOUNT_DETAILS'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_COUNTRY'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_CURRENCY'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_BENEFICIARY_DETAILS'), y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_FULL_NAME'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_COUNTRY'), y:135},
        { type: 'text', value:this.accNum ? this.accNum : '', y:75},
        { type: 'text', value:this.accountCountry ? this.accountCountry : '', y:85},
        { type: 'text', value:this.currency ? this.currency+"" : '', y:95},
        { type: 'text', value:this.beneFullName ? this.beneFullName : '', y:115},
        { type: 'text', value:this.beneShortName ? this.beneShortName: '', y:125},
        { type: 'text', value:this.beneDetails.country ? this.beneDetails.country : '', y:135},
        {type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
        { type: 'text', value:this.refNo ? this.refNo : '', y:145},
        { type: 'heading', value:this.translateService.instant('LBL_BENE_REG_IS_INT_SUCCESS'), y:155}

      ]

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'BeneficiaryInternational.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'BeneficiaryInternational.pdf'}
       )
      }
     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }

  //balajicode
  searchCountry(event: any) {
    const searchValue: string = event?.target?.value;
    this.country = this.localCountryList;
    this.country = this.country.filter((eachCountry: any) =>
      (eachCountry?.countryName as string)?.toLowerCase().includes(searchValue?.toLowerCase()))
  }

  resetCountryInput(event: any) {
    const blurredValue: string = event?.target?.value;
    const countryFound = this.country.filter((eachCountry: any) =>
      (eachCountry?.countryName as string)?.toLowerCase() === blurredValue?.toLowerCase());
      // if(countryFound?.length >= 0){       
      //   let countryCode = countryFound[0]?.countryCode;        
      //   this.paymentservice.getIFTIBANvalidationApiCall(countryCode).subscribe(
      //     (response:any)=>{
      //       this.isLoadingCompelete = true;
      //       this.ibanLength = response.IBAN_LENGTH;
      //     },
      //     (error:any) =>{
      //       this.isLoadingCompelete = true;
      //       this.rootScopeData.showSystemError = true;
      //       }
      //   )
      // }
    if (countryFound?.length > 0) {
      this.accountCountry = countryFound[0]?.countryName;
      this.onCountrySelect();
    } else {
      this.accountCountry = "";
      this.onCountrySelect();
    }
  }

  getCancelBtnClick(){
    this.initiateAnotherRegistration();
  }
}

