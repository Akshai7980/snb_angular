import { Component, Input, OnInit } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { TranslateService } from '@ngx-translate/core';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
@Component({
  selector: 'app-sadad-payments',
  templateUrl: './sadad-payments.component.html',
  styleUrls: ['./sadad-payments.component.scss']
})
export class SadadPaymentsComponent implements OnInit {
  selectedDebitObj: any;
  grandTotal: any
  creditObjArray: any = []
  debitDataObj: any
  authDataObj: any
  isProceed = false
  hideArrow = true
  isLoadingCompelete = false;
  numberOfClick = 0
  additionalreadOly = true;
  hideAll = false
  receiptData: any;
  regBillerDataObj: any;
  debitData: any;
  billergroupsfromApi: any = [];
  billerNamefromApi: any = [];
  billeroptions: any;
  filteredbillerOptions: any;
  searchShownFlag = true;
  dataSourceDailyLimit: any
  rootScopeData: RootScopeDeclare = RootScopeData;
  paymentDate: any;
  additionalObjdata: any;
  secAuthRef:any;
  userOtpValue:any;
  otpError: string = "";
  showCreditTo = false;
  showAuthorization = false;
  showAuthentication = false;
  showdetails =false;
  showDailyLimit = false;
  regBillerData:any;
  DebitClearFlag=false;
  authListArray: any = [];
  authError: string = "";
  biller_CCY:any;
  creditToSelected:any;
  filterflag:string ="";
  filterArray: any = [];
  url:string='';
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:""
  }
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  authType: any;
  rejectMsg : boolean = false;
  constructor(private translateService: TranslateService,private sadadService: SadadPaymentService, private curencyPipe: CurrencyFormatPipe, private downloadAsPdf:downloadAsPdf) {
    this.rootScopeData.changeHeading = 'LBL_SADAD';
    this.rootScopeData.advSearchCurrentPage = 'sadadPayments'
   }

  ngOnInit(): void {
    this.isLoadingCompelete = true;
    this.getDebitData();
    var today = new Date();
    this.paymentDate = "" + today.getDate().toString().padStart(2, "0") + "/" + (today.getMonth() + 1).toString().padStart(2, "0") + "/" + today.getFullYear();

    let defaultPassingObj ={  
      "filterField": "",
      "filterConstraint": "contains",
      "filterValue": "",
    }
    this.filterArray =[defaultPassingObj];
    this.url = systemproperty.termsAndConditionsForStopPayment;
  }

  getUnformattedCurrency(amount: string, currency: string): string {
    const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
    return `${unformattedAmountPipeFilter.transform(amount, currency)} ${currency}`;
  }
  getDisplayStatus(val: any, comp: any) {
    switch (comp) {
      // case 'debit':
      //   this.selectedDebitObj = val;
      //   this.getDailyLimit();
      //   break;
      case 'credit':
        this.isProceed =false;
        this.additionalreadOly =true;
        this.creditObjArray = val;
        break;
      case 'total':
        this.grandTotal = val;
        break;
      // case 'authorization':
      //   this.authDataObj = val;
      //   break;
    }

  }
  afterFromAccountSelection(fromAccount: any) {
    if(this.rootScopeData.changeHeading === "LBL_REVIEW"){
      return;
    }
    this.creditObjArray = "";
    this.isProceed =false;
    this.additionalreadOly = true;
    if (fromAccount == 'iconClick') {
      this.showCreditTo = false;
      this.showdetails = false;
      this.showDailyLimit = false;
      this.creditToSelected.forEach((element: any) => {
        element.IS_SELECTED = false;
        element.billerdueDate = "";
        element.billerAmount = "";
      })
    
    } else {
      if(Number(amountUnFormat(fromAccount.CURR_AVAIL_BAL_AMT))<=0){
        this.rootScopeData.validationErrorToast = true;
        this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
        this.showCreditTo = false;
        this.showdetails = false;
        this.showDailyLimit = false;
        this.DebitClearFlag=true;
        this.getDebitData();
      }else{
        this.showCreditTo = true;
        this.showdetails = true;
        this.selectedDebitObj = fromAccount;
        this.showDailyLimit = true;
        this.getDailyLimit();
      }
    }
  }
  creditSelected(selectedRecords:any){
    this.creditToSelected = selectedRecords;
  }
  additionalObj(value: any) {
    this.additionalObjdata = value;
  }
  getDisplayArrowStatus(val: any) {
    this.hideArrow = (val)
  }
  getDebitData() {
    this.isLoadingCompelete = false;
    // this.rootScopeData.changeHeading = "";
    this.sadadService.getSadadDebitApiCall().subscribe((debData: any) => {
      if (debData) {
        // this.isLoadingCompelete = true;
        this.debitData = debData.DATA.ALL_RECORDS;
        //
        for (let i in this.debitData) {
          let crntAvail_amount = this.debitData[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = this.debitData[i].OD_CCY_CODE;
          let convtd_amount = '';
          if (crntAvail_amount && convtd_ccy) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            this.debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
            this.debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }
        }
        this.debitDataObj = {
          "title": "LBL_FROM",
          "accdetails":"LBL_ACCOUNT_DETAILS",
          "data": this.debitData,
          "fieldDetails": [
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "ALIAS_NAME"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_FULL_NAME",
              "dataKey": "OD_ACC_NAME"
            },
            {
              "dispKey": "LBL_ACCOUNT_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
              "dataKeySupport": "OD_CCY_CODE"
            }
          ]
        };

      }
    }, error => {
      // this.isLoadingCompelete = true;
    })
    this.getcreditinfo();
  }
  getDailyLimit() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitAvailableBalance: "",
      debitCurrencyCode: "",
      debitCifNo: "",
      debitPortalAccNo: "",
      beneAccNo: "", //?????
      valueDate: "", //from where ????
      subProduct: "SADADPAY",
      functionCode: ""
    }
    reqObj.debitAvailableBalance = this.selectedDebitObj && this.selectedDebitObj.CURR_AVAIL_BAL_AMT ? this.selectedDebitObj.CURR_AVAIL_BAL_AMT : "";
    reqObj.debitCurrencyCode = this.selectedDebitObj && this.selectedDebitObj.OD_CCY_CODE ? this.selectedDebitObj.OD_CCY_CODE : "";
    reqObj.debitCifNo = this.selectedDebitObj && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.selectedDebitObj && this.selectedDebitObj.OD_PORTAL_ACC_NO ? this.selectedDebitObj.OD_PORTAL_ACC_NO : "";
    reqObj.beneAccNo = this.selectedDebitObj && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
    reqObj.valueDate = this.paymentDate ? this.paymentDate : "";
    this.sadadService.getDailyLimitApiCall(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        this.dataSourceDailyLimit = response.data && response.data[1] ? response.data[1] : "";
        this.rootScopeData.dailyLimit = this.dataSourceDailyLimit;
      }
    }, error => {
      this.isLoadingCompelete = true;
    }
    )
  }
  getcreditinfo() {
    this.isLoadingCompelete = false;

    /****Enable Filter and Pass Params****/

    let params = {     
      filterArray: this.filterArray,
      flag :this.filterflag,
       fromRow:"",
       toRow:""
    };
   
    this.sadadService.getSadadBillerInfoForCreatePayment(params).subscribe((creditData: any) => {
      if (creditData) {
        this.showCreditTo = true;
        
        this.regBillerData = creditData.data;

        // Negative amount disabled as pown said - 11-03-2023
        this.regBillerData.forEach((element : any)=> {
          if(parseFloat(element.amountDue) < 0){
            element.disabled = true;
          }else{
            element.disabled = false;
          }
        });

        for (let i in this.regBillerData) {  
          // debugger       
          let crntAvail_amount = this.regBillerData[i].minAmount;
          let convrtd_MaxAmount = this.regBillerData[i].maxAmount;
          let convtd_ccy = this.regBillerData[i].currency;
          let crntAvail_dueAmount = this.regBillerData[i].amountDue;
          this.biller_CCY = this.regBillerData[i].currency;
          let convtd_amount ='';
          let convert_maxAmount ='';
          if(crntAvail_amount && convtd_ccy){
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
             convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
             this.regBillerData[i].minAmount = convtd_amount;
            //  this.regBillerData[i].amountDue = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
          }      
          if(convrtd_MaxAmount && convtd_ccy){
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convert_maxAmount = currencyFormatPipeFilter.transform(convrtd_MaxAmount.trim(), convtd_ccy);
             this.regBillerData[i].maxAmount = convert_maxAmount;
          } 
          if(crntAvail_dueAmount){
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            this.regBillerData[i].amountDue = currencyFormatPipeFilter.transform(crntAvail_dueAmount.trim(), convtd_ccy);
            this.regBillerData[i].due = currencyFormatPipeFilter.transform(crntAvail_dueAmount.trim(), convtd_ccy);
          }        
        } 
         debugger
        this.regBillerDataObj = {
          "title": "LBL_TO",
          "data": this.regBillerData
        };
     
        this.isLoadingCompelete = true;
      }
    }, error => {
      this.showCreditTo = false;
      this.isLoadingCompelete = true;
    })
  }
  getBillergroup() {
    this.isLoadingCompelete = false;
    this.sadadService.getSadadBillerGroupsApiCall().subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billergroupsfromApi = data.data;
      }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }
  billergroupSelect(value: any) {
    let billergroupSelectedData = value;
    this.getBillerName(billergroupSelectedData.billerGroupCode, billergroupSelectedData.billergroupId);
  }
  getBillerName(grpcode: any, grpId: any) {
    this.isLoadingCompelete = false;
    this.sadadService.getSadadBillerNamesApiCall(grpcode, grpId).subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billerNamefromApi = data.data;
      }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }
  billerNameSelect(value: any) {
    let billerNameSelectedData = value;
  }
  proceedNext() {
    this.numberOfClick = this.numberOfClick + 1;
    this.additionalreadOly = false
    this.isProceed = true;
    this.rootScopeData.changeHeading = "LBL_REVIEW";
    this.initReqParam.accNo=this.selectedDebitObj  && this.selectedDebitObj.OD_PORTAL_ACC_NO ? this.selectedDebitObj.OD_PORTAL_ACC_NO : "";
    this.initReqParam.amt=this.grandTotal ? parseFloat(this.getUnformattedCurrency(this.grandTotal, this.biller_CCY))+"" : "";
    this.initReqParam.pdroductCode="PAYMNT";
    this.initReqParam.subPrdCode='SADADPAY';
    this.initReqParam.cif=this.selectedDebitObj  && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
    this.initReqParam.unitId=this.selectedDebitObj  && this.selectedDebitObj.UNIT_ID ? this.selectedDebitObj.UNIT_ID : "";
    
    this.checkSecfactorAuth();
  }
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }
  checkSecfactorAuth() {
    this.isLoadingCompelete = false;
    let reqObj = {
      paymentAmount:"",
      debitCifNo:"", 
      debitPortalAccNo:"",
      debitCurrencyCode:"",
      beneCurrencyCode:"", //?????
      vsubprdtcode :"SADADPAY",
      funCode:'SADTXN'
    }
    reqObj.debitCifNo = this.selectedDebitObj  && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.selectedDebitObj  && this.selectedDebitObj.OD_PORTAL_ACC_NO ? this.selectedDebitObj.OD_PORTAL_ACC_NO : "";
    reqObj.debitCurrencyCode = this.selectedDebitObj && this.selectedDebitObj.OD_CCY_CODE ? this.selectedDebitObj.OD_CCY_CODE : "";
    for (let i in this.creditObjArray) {  
    reqObj.beneCurrencyCode =this.creditObjArray && this.creditObjArray[i].currency ? this.creditObjArray[i].currency : "";
    }
    reqObj.paymentAmount = this.grandTotal;
    this.sadadService.selfAuthCheck(reqObj).subscribe((response: any) => {
        if(response){
          this.isLoadingCompelete = true;
          if (response.data.selfAuth == "true") {
            this.showAuthentication = true;
          }
          if (response.data.flexiAuth == "true") {
            this.showAuthorization = true;
            this.authListArray = response.data.authList;
          }
        }
      }, error => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
      }

    )
  }
  autherizationDetailsReceived(autherizationDetailsObj:any) {
    this.authDataObj = autherizationDetailsObj;
  }
  getOtpValue(otpValue: any) {
    if(otpValue){
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onSubmit();
    }else{
      this.userOtpValue = "";
      this.otpError = "LBL_PLS_ENTER_OTP";
    }
  }
  cancel_Click(){
    this.DebitClearFlag=true;
    this.selectedDebitObj=[];
    // this.afterFromAccountSelection('iconClick');
    this.getDebitData();
    this.selectedDebitObj = false;
    this.showAuthentication = false;
    this.showAuthorization = false;
    this.showdetails = false;;
    this.rootScopeData.changeHeading = 'LBL_SADAD';
  }
  credit_Cancel_Click(value:any){
    this.showCreditTo = value;
    this.DebitClearFlag=true;
    this.showDailyLimit = false;
    // this.afterFromAccountSelection('iconClick');
    this.getDebitData();
    this.selectedDebitObj = false;
  }
  onSubmit() {
    let isOtpValid = true;
    // if(this.showAuthentication && !this.userOtpValue){
    //   isOtpValid = false;
    //   this.otpError = "LBL_PLS_ENTER_OTP";
    // }
    if(!this.userOtpValue || this.userOtpValue.length !== 4){
      isOtpValid = false;
      this.otpError = "LBL_PLS_ENTER_OTP";
      return;
    }
    let reqObj = {
      authRuleId:"",
      authUserNo:"",
      authUserLevel:"",
      selectionFlag:"",
      userNoList:"",
      approverNote:"",
      paymentDetails:"",
      customerRef:"",
      maxIndTxnLimit:"",
      usedPayLimit:"",
      totalAmount: "",
      valueDate:"",
      otp: "",
      otpRef: "",
      AUTH_TYPE_O:""
    }
    reqObj.authRuleId  = this.authDataObj && this.authDataObj.selectedAprover && this.authDataObj.selectedAprover.PARSED_RULE_ID ? this.authDataObj.selectedAprover.PARSED_RULE_ID : "";
    reqObj.authUserNo  = this.authDataObj && this.authDataObj.selectedAprover && this.authDataObj.selectedAprover.OD_USER_NO ? this.authDataObj.selectedAprover.OD_USER_NO : "";
    reqObj.authUserLevel  = this.authDataObj && this.authDataObj.selectedAprover && this.authDataObj.selectedAprover.OD_LEVEL ? this.authDataObj.selectedAprover.OD_LEVEL : "";
    reqObj.selectionFlag = reqObj.authUserNo ? 'Y' : 'N';
    reqObj.userNoList = reqObj.authUserNo && reqObj.authUserLevel ? reqObj.authUserNo+'%'+reqObj.authUserLevel : "";
    reqObj.approverNote  = this.authDataObj && this.authDataObj.aproveNote ? this.authDataObj.aproveNote : "";

    reqObj.paymentDetails = this.additionalObjdata && this.additionalObjdata.paymentDetails ? this.additionalObjdata.paymentDetails : "";
    reqObj.customerRef = this.additionalObjdata && this.additionalObjdata.customerRef ? this.additionalObjdata.customerRef : "";
    reqObj.maxIndTxnLimit =  this.dataSourceDailyLimit &&  this.dataSourceDailyLimit.maxIndTxnLimit ? this.dataSourceDailyLimit.maxIndTxnLimit : ""; 
    reqObj.usedPayLimit = this.dataSourceDailyLimit && this.dataSourceDailyLimit.usedPayLimit ? this.dataSourceDailyLimit.usedPayLimit : "";
    reqObj.totalAmount = this.grandTotal ? parseFloat(this.getUnformattedCurrency(this.grandTotal, this.biller_CCY))+"" : "";
    reqObj.valueDate = this.paymentDate ? this.paymentDate : "";

    reqObj.otp = this.userOtpValue ? this.userOtpValue : '';
    reqObj.otpRef = this.secAuthRef ? this.secAuthRef : '';
    reqObj.AUTH_TYPE_O = this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': '';
    
    let selectedDataValues: any = [];
    if (this.creditObjArray) {
      for (let i = 0; i < this.creditObjArray.length; i++) {
        let selectedValues = {
          "BILLER_NAME": this.creditObjArray[i].billerName,
          "BILLER_ID": String(this.creditObjArray[i].billerId),
          "BILLER_NICKNAME": this.creditObjArray[i].nickName,
          "BILLER_GROUP": this.creditObjArray[i].billerGroupName,
          "BILLER_GROUP_ID": this.creditObjArray[i].billerGroupName,
          "PAYMENT_TYPE": this.creditObjArray[i].paymentType,
          "STATUS": this.creditObjArray[i].statusDesc,
          "DUE_DATE": this.creditObjArray[i].billerdueDate,
          "SUBSCRIBER_ID": String(this.creditObjArray[i].billAccount),
          "SERVICE_TYPE":this.creditObjArray[i].serviceType,
          "BILL_NO":this.creditObjArray[i].billNo ? this.creditObjArray[i].billNo : "" ,
          "AMOUNT": parseFloat(this.getUnformattedCurrency(this.creditObjArray[i].billerAmount,this.creditObjArray[i].currency))+""
        }
        selectedDataValues.push(selectedValues)
      }
    }
    debugger
    if(isOtpValid){
      this.isLoadingCompelete = false;
      this.sadadService.submitSadadsPayment(selectedDataValues,this.selectedDebitObj,reqObj).subscribe(responseobject => {
        this.isLoadingCompelete = true;
        if(responseobject.dataValue.OD_STATUS_DESC === "Success") {
          this.rootScopeData.changeHeading = "";
          this.refNo = responseobject.dataValue.INPUT_REFERENCE_NO;
          this.constructReceiptData(responseobject.dataValue.INPUT_REFERENCE_NO, responseobject.dataValue);
          this.clearAuthData();
          this.hideAll = true;
        }
        // if(responseobject.dataValue.OD_STATUS_DESC === "Failed") {
        //   this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        // }
        else{
          this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
          // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
          // this.rootScopeData.showSystemError = true;
        }
      },
        error => {
          this.isLoadingCompelete = true;
        })
    }

  }
  clearAuthData(){
    this.authDataObj = "";
    this.userOtpValue = "";
    this.otpError = "";
    this.authError = "";
  }
  initAnotherPayment(){
    this.DebitClearFlag= true;   
    this.hideAll = false;
    this.showCreditTo = false;
    this.showdetails = false;
    this.showAuthentication = false;
    this.showAuthorization = false;
    this.getDebitData();
    this.selectedDebitObj = false;
    this.rootScopeData.changeHeading = 'LBL_SADAD';
  }
  constructReceiptData(refNumber: any, data:any) {
    let approver = this.authDataObj && this.authDataObj.selectedAprover && this.authDataObj.selectedAprover.AUTH_NAME ? this.authDataObj.selectedAprover.AUTH_NAME :this.translateService.instant("LBL_NOT_PROVIDED");
    let approverNote = this.authDataObj && this.authDataObj.aproveNote ? this.authDataObj.aproveNote :this.translateService.instant("LBL_NOT_PROVIDED");
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.selectedDebitObj, { USER_ID: userId })
    this.biller_CCY = this.biller_CCY ? this.biller_CCY : "SAR";
    let flexiAuth = {
      "title": "LBL_AUTHORIZATION",
      "isTable": "false",
      "fieldDetails": [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": approver
        },
        {
          "dispKey": "LBL_ADD_NEXT_APROVER",
          "dataKey": approverNote
        }
      ]
    }
    this.rejectMsg=false;
    var message1 : any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    let checkAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_PAYMENT_SUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }else if(data.TXN_STATUS=== "RH" || data.TXN_STATUS=== "RE"){
      message1 = "LBL_PAYMENT_UNSUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = data.OD_REJECT_REASON;
      this.rejectMsg=true;
    }else if(data.TXN_STATUS=== "RA"){
      message1 = "LBL_PAYMENT_SUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
      checkAuth = true;
    }else if(data.TXN_STATUS=== "RN"){
      message1 = "LBL_PAYMENT_UNSUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_GENERAL_TRSFR__IS_INT_SUCCESS";
    }else{
      message1 = "LBL_PAYMENT_SUCCESSFULL"
      message2 = "LBL_GENERAL_TRSFR__IS_INT_SUCCESS";
    }
    this.receiptData = {
      "msg1": message1,
      // "msg2": "LBL_PAYMENT_APPROVAL",
      "msg2": message2,
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "true",
          "data": [this.selectedDebitObj],

          "fieldDetails": [
            {
              "dispKey": "LBL_ACTION_BY",
              "dataKey": "USER_ID"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_SHORT_NAME",
              "dataKey": "ALIAS_NAME"
            }
          ]
        },
        {
          "title": "LBL_TO",
          "isTable": "true",
          "data": this.creditObjArray,
          "fieldDetails": [
            {
              "dispKey": "LBL_BILLER_NAME",
              "dataKey": "billerGroup"
            },
            {
              "dispKey": "LBL_SUBCRIBER_ID",
              "dataKey": "billAccount"
            },
            {
              "dispKey": "LBL_AMOUNT",
              "dataKey": "billerAmount",
              "dataKeySupport": "currency" 
            }
          ]
        },
        {
          "title": "",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_DEBIT_AMT",
              "dataKey": this.grandTotal + ' ' + this.biller_CCY
            },
            {
              "dispKey": "LBL_VALUE_DATE",
              "dataKey": this.paymentDate
            }
          ]
        },
      ],
      "printButton": {
        "buttonLabel": "LBL_PRINT_RECEIPT",
        "buttonIcon": "./assets/images/PrinterIcon.png"
      },
      "saveButton": {
        "buttonLabel": "LBL_SAVE_RECEIPT",
        "buttonIcon": "./assets/images/saveReceipt.svg"
      },
      "initiateButton": {
        "buttonLabel": "LBL_MAKE_ANOTHER_PAY"
      },
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    };
    if(approver && this.showAuthorization && checkAuth){
      this.receiptData.receiptDetails.push(flexiAuth);
    }
    let sadadArray : any = [];
    for(let i = 0; i < this.creditObjArray.length; i++){
      let obj = {
        "Biller Name": this.creditObjArray[i].billerGroup,
        "Subscriber ID" : this.creditObjArray[i].billAccount,
        "Amount": this.creditObjArray[i].billerAmount +" "+ this.creditObjArray[i].currency
      }
      sadadArray.push(obj)
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant(message1),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant(message2) ,
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue":this.selectedDebitObj.USER_ID
        },
        {
          "subHead": "Account Number",
          "subValue":this.selectedDebitObj.OD_ACC_NO
        },
        {
          "subHead": "Nickname",
          "subValue":this.selectedDebitObj.ALIAS_NAME
        },
        {
          "subHead": "To",
          "subValue": ""
        },
        // {
        //   "subHead": "Biller Name",
        //   "subValue":  this.creditObjArray[0].billerGroup
        // },
        // {
        //   "subHead": "Subscriber ID",
        //   "subValue":  this.creditObjArray[0].billAccount
        // },
        // {
        //   "subHead": 'Amount',
        //   "subValue":  this.creditObjArray[0].billerAmount +" "+this.creditObjArray[0].currency
        // },
        {
          "subHead": 'Debit Amount',
          "subValue":  this.grandTotal + ' ' + this.biller_CCY
        }
      ],
      "ArrayData": sadadArray,
      "pagecall":"sadadaramco",
      "refNo":refNumber
    }

  }


  getFilterValues(filterArrayList:any)
  {

    this.filterflag ='Y';
    this.filterArray =filterArrayList;
    this.regBillerData =[];
    //console.log(this.filterArray);
     this.getcreditinfo()
  }

  downloadPdf(values:any)
      { 

        let SelectedType = values;
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_SADAD_RECEIPT'), x:90, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_TO'), y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_INVOICE_NUMBER'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_DUE_DATE'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:135},
        { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
        { type: 'heading', value:this.translateService.instant('LBL_VALUE_DATE'), y:155},
        { type: 'text', value:this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : '', y:75},
        { type: 'text', value:this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '', y:85},
        { type: 'text', value:this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : '', y:95},
        { type: 'text', value:this.creditObjArray[0].billerGroup? this.creditObjArray[0].billerGroup : '', y:115},
        { type: 'text', value:this.creditObjArray[0].billerdueDate ? this.creditObjArray[0].billerdueDate : '', y:125},
        { type: 'text', value: this.creditObjArray[0].billerAmount + ' ' + this.creditObjArray[0].currency ?  this.creditObjArray[0].billerAmount + ' ' + this.creditObjArray[0].currency : '', y:135},
        { type: 'text', value: this.grandTotal + ' ' + this.biller_CCY ?  this.grandTotal + ' ' + this.biller_CCY : '', y:145},
        { type: 'text', value: this.paymentDate ?  this.paymentDate : '', y:155},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:165},
        { type: 'text', value: this.refNo ? this.refNo : '', y:165},
        { type: 'heading', value:this.translateService.instant('LBL_SADAD_PAYMENT_IS_INT_SUCCESS'), y:175},
        
      ]

      //   this.pdfData.push(
      //     { type: 'save', value:'Sadad.pdf'}
      //  )

       if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'Sadad.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'Sadad.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
  getAuthType(val: any) {
    this.authType = val
  }

}
