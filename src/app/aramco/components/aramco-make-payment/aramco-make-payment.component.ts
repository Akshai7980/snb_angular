import { Component, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { AramcoService } from '../../services/aramco.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-aramco-make-payment',
  templateUrl: './aramco-make-payment.component.html',
  styleUrls: ['./aramco-make-payment.component.scss']
})
export class AramcoMakePaymentComponent implements OnInit {
  debitDataObj: any;
  selectedDebitObj: any;
  isLoadingCompelete = true;
  isProceed = false;
  selectedTo: any;
  receiptData: any;
  authDataObj: any;
  amountDetailsObj:any;
  hideAll=false;
  total='';
  cashField:any;
  creditFiled:any
  pmtType="paymentType";
  resetRemain=false;
  secAuthRef:any;
  amountToPass=''
  amount=0;
  toDisplayFields=[]
  errorMsg=''
  errorCode:any
  authOptions: any = [];
  otpError: string = "";
  userOtpValue: any;
  fromAccountDetails: any;
  currentDate: any;
  paymentSubProduct: any;
  paymentFunctionCode: any;
  dataSourceDailyLimit: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  isDailyLimitActive: boolean = false;
  remitterId: any;
  invoiceDetailsArray: any=[];
  creditToEntitlementTabs:any;
  showAuthorization: boolean = false;
  showAuthentication: boolean = false;
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
  checkAmountValid: boolean = false;
  rejectMsg: boolean = false;
  additionalDetailsObj:any;
  additionalObjdata: any;
  constructor(private translateService: TranslateService,private aramcoService: AramcoService, private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.getDebitData();
    this.url = systemproperty.termsAndConditionsForStopPayment;
  }
  getDebitData() {
    this.isLoadingCompelete = false;
    this.aramcoService.getDebitLookUp().subscribe((debData: any) => {
      this.isLoadingCompelete = true;
      if (debData) {
        let debitData = debData.DATA.ALL_RECORDS;
        
        for (let i in debitData) {         
          let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = debitData[i].OD_CCY_CODE;
          let convtd_amount ='';
          if(crntAvail_amount && convtd_ccy){
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
             convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
             debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
             debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }               
        } 

        this.debitDataObj = {
          "title": "LBL_FROM",
          "data": debitData,
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
              "dataKey": "LIAS_NAME"
            },
            {
              "dispKey": "LBL_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
              "dataKeySupport":"OD_CCY_CODE"
            }
          ]
        };
      }
    }, error => {
      this.isLoadingCompelete = true;
    })
  }

  getDatas(event: any, field: any) {
    switch (field) {
      case 'debitTo':     
      let debitValue = event;
      this.checkAramcoToCreditEntitlements(debitValue);        
        this.getDailyLimit();
        this.isDailyLimitActive = true;
        if (event === 'iconClick') {
          this.reset();
          this.isDailyLimitActive = false;
        }else{
          if(Number(amountUnFormat(event.CURR_AVAIL_BAL_AMT))<= 0){
            this.reset();
            this.rootScopeData.validationErrorToast = true;
            this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
          }else{
            this.selectedDebitObj = event;
          }
        }
        break;
      case 'to':
        this.selectedTo = event;
        this.resetRemain=false;
        if(this.pmtType==='credit'){
          this.selectedTo.forEach((ele: any)=>{
             let selectDebit = this.selectedDebitObj;
             let amt;
            if(ele.equivalentCurrency === this.selectedDebitObj.OD_CCY_CODE){
              amt = ele.equivalentAmount;
              this.amount = this.amount + Number(amt)
            }else if(ele.invoiceCurrency === this.selectedDebitObj.OD_CCY_CODE){
              amt = ele.amount;
              this.amount = this.amount + Number(amt)
            }

            // let amt=ele.amount;
            // this.amount=this.amount+Number(amt);
          });
          this.amountToPass=this.amount+'';
          //this.getAuthorizationData(this.amountToPass);
        } else {
          this.amountToPass = this.selectedTo[0].amount + '';
          // this.getAuthorizationData(this.amountToPass);
        }
        break;
      case 'authorization':
        this.authDataObj = event;
        break;
      case 'amountObj':
        this.amountDetailsObj = event;
        break;
      case 'paymentType':
        this.pmtType = event;
        this.selectedDebitObj.pmttype = this.pmtType;
        break;
      case 'reset':
        this.resetRemain = event;
        if(this.resetRemain){
          this.isProceed=false;
          this.selectedTo=null;
          this.amountDetailsObj=null;
          this.amount=0;
          this.isDailyLimitActive = false;
        }
        break;
    }
  }

  getAuthorizationData(amt: any) {
    this.isLoadingCompelete = false;
    this.selectedDebitObj.pmttype = this.pmtType;
    if(this.pmtType==="credit"){
      this.selectedDebitObj.funCode="ARTXN"
      this.selectedDebitObj.subCode="ARAMCOPAY"
      this.selectedDebitObj.debitCurrency="SAR"
    }else{
      this.selectedDebitObj.funCode="ARDTXN"
      this.selectedDebitObj.subCode="ARCODIRPAY"
      this.selectedDebitObj.debitCurrency="SAR"
    }
    this.aramcoService.getAuthData(this.selectedDebitObj, amt).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      if (res.data.selfAuth == "true") {
        this.showAuthentication = true;
      }
      if (res.data.flexiAuth == "true") {
        this.showAuthorization = true;
        this.authOptions = res.data.authList;
      }
      
    }, (error: any) => {
      this.isLoadingCompelete = true;
    });
  }

  reset() {
    this.selectedDebitObj=null
    this.selectedTo=null
    this.receiptData=null
    this.authDataObj=null
    this.amountDetailsObj=null
    this.hideAll=false
    this.isLoadingCompelete = false
    this.isProceed = false;
    this.debitDataObj=null;
    this.getDebitData();
    this.amount=0;
    this.isDailyLimitActive = false;
    this.rootScopeData.changeHeading = "Make Payment"
  }
  proceedNext() {
    if(this.pmtType === 'cash') {
      this.proceedNextCash();
    }else {
      this.proceedNextCredit();
    }
      this.initReqParam.accNo=this.selectedDebitObj  && this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : "";
      // this.initReqParam.amt=this.amountToPass ? parseFloat(this.getUnformattedCurrency(this.grandTotal, this.biller_CCY))+"" : "";
      this.initReqParam.amt=this.amountToPass;
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode=this.pmtType === 'cash' ? 'ARCODIRPAY' : 'ARAMCOPAY';
      this.initReqParam.cif=this.selectedDebitObj  && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
      this.initReqParam.unitId=this.selectedDebitObj  && this.selectedDebitObj.UNIT_ID ? this.selectedDebitObj.UNIT_ID : "";
  }

  additionalObj(value: any) {
    this.additionalObjdata = value;
  }
  proceedNextCash() {
    if(this.amountDetailsObj)
    {      
      let convertedTransferAmount = parseFloat(amountUnFormat(this.amountDetailsObj?.transferAmt))+''; 
      this.getAuthorizationData(convertedTransferAmount);     
      this.amountDetailsObj.transferAmt = convertedTransferAmount;
      this.amountToPass = convertedTransferAmount;
      this.isProceed = true;
      this.rootScopeData.changeHeading = 'Review';
    }
  }
  proceedNextCredit() {
    if(this.amountDetailsObj !== undefined || this.amountDetailsObj !== null || this.amountDetailsObj !== "" || this.pmtType === 'cash' || this.amountDetailsObj.transferAmt !== '') {
      if(Number(this.amountDetailsObj?.transferAmt) === 0 ) {
        this.isProceed = false;
        return;
      } else if (Number(this.amount) > Number(this.amountDetailsObj?.transferAmt)) {
        this.isProceed = false;
        return;
      }
    }
    if(this.amountDetailsObj || this.pmtType=='credit'){
      let convertedTransferAmount = parseFloat(amountUnFormat(this.amountDetailsObj?.transferAmt))+''; 
      this.getAuthorizationData(convertedTransferAmount); 
      this.isProceed = true;
      this.rootScopeData.changeHeading = 'Review';
    } else {
      this.isProceed = false;
      return;
    }
    if(!this.amountDetailsObj){
      this.errorMsg="LBL_PLEASE_PROVIDE_AMOUNT";
    }
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getRemitterId(remitterId:any){
    this.remitterId = remitterId;
  }

  getOtpValue(otpValue: any) {
    if(otpValue){
      // if (otpValue.length === 4) this.otpError = '';
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.submit();
    }else{
      this.userOtpValue = "";
    }
  }

  additionalDetailsReceived(additionalDetailsObj: any) {
    this.additionalDetailsObj = additionalDetailsObj;
  }

  submit() {
    // if (!this.authDataObj) {
    //   this.errorCode = "LBL_PLS_SELECT_AUTH";
    // }
    if(this.showAuthentication === true){
      if (!this.userOtpValue ) {
        this.otpError = "LBL_PLS_ENTER_OTP";
        return;
      } else if (this.userOtpValue.length < 4) {
        this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
        return;
      }
    }
    
    this.invoiceDetailsArray = [];
    let invoiceParams={
      "INVOICE_NO": "",
      "INVOICE_DATE": "",
      "INVOICE_DUE_DATE": "",
      "INVOICE_AMT": "",
      "AMT_IN_DEBIT_CCY":"",
      "INVOICE_CCY":"",
      "EQUIVALENT_CCY":""
  }
  let invoiceObject:any;
    for(let i=0;i<this.selectedTo.length;i++){
      invoiceParams.INVOICE_CCY = this.selectedTo[i].invoiceCurrency ? this.selectedTo[i].invoiceCurrency:'';
      invoiceParams.EQUIVALENT_CCY = this.selectedTo[i].equivalentCurrency ? this.selectedTo[i].equivalentCurrency:'';
      invoiceParams.INVOICE_NO = this.selectedTo[i].number ? this.selectedTo[i].number:'';
      invoiceParams.INVOICE_DATE = this.selectedTo[i].date ? this.selectedTo[i].date:'';
      invoiceParams.INVOICE_DUE_DATE = this.selectedTo[i].dueDate ? this.selectedTo[i].dueDate:'';
      invoiceParams.INVOICE_AMT = this.selectedTo[i].amount ? this.selectedTo[i].amount:'';
      invoiceParams.AMT_IN_DEBIT_CCY = this.selectedTo[i].equivalentAmount ? this.selectedTo[i].equivalentAmount:'';
      invoiceObject = invoiceParams;
      this.invoiceDetailsArray.push(invoiceObject)
    }
    const params = {
      paymentDetails : this.additionalObjdata && this.additionalObjdata.paymentDetails ? this.additionalObjdata.paymentDetails :'',
      customerRef: this.additionalObjdata && this.additionalObjdata.customerRef ? this.additionalObjdata.customerRef : '',
      debitDetails: this.selectedDebitObj,
      creditDetails: this.selectedTo,
      totalAmount: this.amountToPass,
      authoriZationDetails: this.authDataObj,
      paymentType: this.pmtType,
      amountDetails: this.amountDetailsObj,
      otp: this.userOtpValue,
      dailyLimit: this.rootScopeData.dailyLimit,
      remitterId: this.remitterId,
      invoiceDetails: this.invoiceDetailsArray,
      otpRef: this.secAuthRef,
      usedPayLimit: this.dataSourceDailyLimit.usedPayLimit + '',
      shortName : this.selectedTo[0].shortName ? this.selectedTo[0].shortName :'',
      addtoLib : this.selectedTo[0].addtoLibrary ? this.selectedTo[0].addtoLibrary :'',
      subProdcode : this.pmtType === 'cash' ? 'ARCODIRPAY' : 'ARAMCOPAY',
      functionId : this.pmtType === 'cash' ? 'ARDTXN' :'ARTXN',
      AUTH_TYPE_O :this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    };
    this.isLoadingCompelete = false;
    //debugger;
    this.aramcoService.submitAramcoPayment(params).subscribe((data: any) => {
      this.isLoadingCompelete = true;
      if (data.dataValue.OD_STATUS_DESC ==="Success") {
        this.refNo = data.dataValue.INPUT_REFERENCE_NO;
        this.constructReceiptData(data.dataValue.INPUT_REFERENCE_NO, data.dataValue)
        this.hideAll = true
      }else{
        this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
        // this.otpError="LBL_PLEASE_ENTER_VALID_OTP";
      }
    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  constructReceiptData(refNumber: any,data:any) {
    if(this.amountDetailsObj){
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      let convrtd_amt= currencyFormatPipeFilter.transform(this.amountDetailsObj.debitAmount,this.amountDetailsObj.currencyCode);
      this.total=convrtd_amt+" "+this.amountDetailsObj.currencyCode
    }
    if(this.pmtType==="cash"){
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      let payamt=currencyFormatPipeFilter.transform(this.amountDetailsObj.transferAmt,this.amountDetailsObj.currencyCode);
      let currencyCodeForRec = this.amountDetailsObj.currencyCode ? this.amountDetailsObj.currencyCode : "SAR";
      this.selectedTo[0].amt=payamt+" "+currencyCodeForRec
      this.cashField=[
         {
           "dispKey" : "LBL_REMITTER_ID",
           "dataKey": "OD_ACC_NO"
         },
         {
           "dispKey": "LBL_AMOUNT",
           "dataKey": "amt"
         }
       ]
    
   }
   else{
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    // let payamt=currencyFormatPipeFilter.transform(this.amountDetailsObj.transferAmt,this.amountDetailsObj.currencyCode);
    // this.selectedTo[0].amount=payamt+" "+this.amountDetailsObj.currencyCode
    // let equivalentamount=currencyFormatPipeFilter.transform(this.selectedTo[0].equivalentAmountinUSD,this.selectedTo[0].equivalentCurrency);
    // let currencValue = this.selectedTo[0].equivalentCurrency ? this.selectedTo[0].equivalentCurrency : "SAR";
    let invoiceAmt : any
    let currencValue : any
    
    for(let i=0;i< this.selectedTo.length;i++){
      invoiceAmt = currencyFormatPipeFilter.transform(this.selectedTo[i].amount,this.selectedTo[i].invoiceCurrency);
      currencValue = this.selectedTo[i].invoiceCurrency ? this.selectedTo[i].invoiceCurrency : "SAR";
      this.selectedTo[i].amount=invoiceAmt+" "+currencValue
    }
     this.creditFiled=[
       {
         "dispKey": "LBL_INVOICE_NUMBER",
         "dataKey": "number"
       },
       {
         "dispKey": "LBL_DUE_DATE",
         "dataKey": "dueDate"
       },
      //  {
      //    "dispKey": "LBL_AMOUNT",
      //    "dataKey": "equivalentAmount"
      //  },
       {
         "dispKey": "LBL_INVOICE_AMOUNT",
         "dataKey": "amount"
       },

     ]
   }
   let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
   Object.assign(this.selectedDebitObj, { USER_ID: userId })
   let flexiAuth ={
    "title": "LBL_AUTHORIZATION",
    "isTable": "false",
    "data": '',
    "fieldDetails": [
      {
        "dispKey": "LBL_Next_Approver",
        "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.selectedAprover.AUTH_NAME ? 'Not Provided' : this.authDataObj.selectedAprover.AUTH_NAME
      },
      {
        "dispKey": "LBL_ADD_NEXT_APROVER",
        "dataKey": !this.authDataObj ? 'Not Provided' : !this.authDataObj.aproveNote ? 'Not Provided':this.authDataObj.aproveNote
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
      // "msg2": "LBL_ARAMCO_PMT_PENDNG_FR_APPROVAL_MSG",
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
          "data": this.selectedTo,
          "fieldDetails": this.pmtType==="cash"?this.cashField:this.creditFiled
        },
        {
          "title": "",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_DEBIT_AMT",
              "dataKey": this.total
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
        "buttonLabel": "LBL_INITIATE_ANOTHER_REQUEST"
      },
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    }

    if (this.pmtType ==="cash") {
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
            "subHead": "Action by",
            "subValue": this.selectedDebitObj.USER_ID ?  this.selectedDebitObj.USER_ID : "--"
          },
          {
            "subHead": "Account Number",
            "subValue": this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO :"--"
          },
          {
            "subHead": "Nick name",
            "subValue": this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME:"--"
          },
          {
            "subHead": "To",
            "subValue": ""
          },
          {
            "subHead": "Remitter Id",
            "subValue": this.selectedTo[0].OD_ACC_NO ?  this.selectedTo[0].OD_ACC_NO : "--"
          },
          {
            "subHead": "Amount",
            "subValue": this.selectedTo[0].amt ? this.selectedTo[0].amt :"--"
          },
        ],
        "pagecall":"aramcocash",
        "refNo":refNumber
      }
    }
    else{
      let sadadArray : any = [];
    for(let i = 0; i < this.selectedTo.length; i++){
      let obj = {
        "Invoice Number": this.selectedTo[i].number,
        "Due Date" : this.selectedTo[i].dueDate,
        "Amount": this.selectedTo[i].amount
      }
      sadadArray.push(obj)
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
            "subHead": "Action by",
            "subValue": this.selectedDebitObj.USER_ID ?  this.selectedDebitObj.USER_ID : "--"
          },
          {
            "subHead": "Account Number",
            "subValue": this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO :"--"
          },
          {
            "subHead": "Short Name",
            "subValue": this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME:"--"
          },
          {
            "subHead": "To",
            "subValue": ""
          },
          // {
          //   "subHead": "Invoice Number",
          //   "subValue": this.selectedTo[0].number ?  this.selectedTo[0].number : "--"
          // },
          // {
          //   "subHead": "Due Date",
          //   "subValue": this.selectedTo[0].dueDate ? this.selectedTo[0].dueDate :"--"
          // },
          // {
          //   "subHead": "Amount",
          //   "subValue": this.selectedTo[0].equivalentAmount ? this.selectedTo[0].equivalentAmount :"--"
          // },
          {
            "subHead": "Debit Amount",
            "subValue" : this.total ? this.total : "--"
          }
        ],
        "pagecall":"aramcopayment",
        "ArrayData": sadadArray,
        "refNo":refNumber
      }
    }

    if(this.showAuthorization && checkAuth){
      this.receiptData.receiptDetails.push(flexiAuth); 
    }
  }
  initAramcoPayment(){
    this.rootScopeData.changeHeading = "Make Payment";
    this.reset()
  }

  getDailyLimit() {
    this.isLoadingCompelete = true;
    let reqObj = {
      debitCountryCode:"",
      debitUnitId:"",
      debitAvailableBalance:"", 
      debitCurrencyCode:"",
      debitCifNo:"",
      debitPortalAccNo:"",
      beneAccNo:"",
      valueDate:"",
      subProduct:"",
      functionCode:""
    };
    reqObj.debitCountryCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].REQ_COUNTRY_CODE ? this.fromAccountDetails[0].REQ_COUNTRY_CODE : "";
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.debitAvailableBalance = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT ? this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT : "";
    reqObj.debitCurrencyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
    reqObj.beneAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.valueDate = this.currentDate ? this.currentDate : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";
    this.isLoadingCompelete = false;
    this.aramcoService.getDailyLimitApiCall(reqObj).subscribe((resp: any) => {
      this.isLoadingCompelete = true;
        if (resp) {
          this.dataSourceDailyLimit = resp.data && resp.data[1] ? resp.data[1] : "";
          this.rootScopeData.dailyLimit = this.dataSourceDailyLimit;
        }  
      }, (error: any) => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
      });
  }

  checkAramcoToCreditEntitlements(selectDebitAcc :any)
  {
    this.isLoadingCompelete = false;
    let selectedAccnum = selectDebitAcc.OD_PORTAL_ACC_NO
    this.aramcoService.getCreditTabEntitlements(selectedAccnum).subscribe((resp: any) => {
      this.isLoadingCompelete = true;
        if (resp) {
         if(resp.data.dire_payment === 'Y')
         {
           this.creditToEntitlementTabs = true;
         }
         else{
          this.creditToEntitlementTabs = false;
         }
        }  
      }, (error: any) => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
      });
  }
  downloadPdf(values:any)
  { 
    let SelectedType = values;
    let selectDebit = this.selectedDebitObj;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant('LBL_ARAMCO_PAYMENT_RECEIPT'), x:80, y:35},
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
    { type: 'text', value:this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : '', y:75},
    { type: 'text', value:this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '', y:85},
    { type: 'text', value:this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : '', y:95},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:155},
    { type: 'text', value: this.refNo ? this.refNo : '', y:155},
    { type: 'heading', value:this.translateService.instant('LBL_ESAL_PAYER_ADDED_IS_INT_SUCCESS'), y:165},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
  ]
  if (this.pmtType ==="cash") {
    this.pdfData.push(
      { type: 'heading', value:this.translateService.instant('LBL_REMITTER_ID'), y:115},
      { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:125},
      { type: 'text', value:this.selectedTo[0].OD_ACC_NO? this.selectedTo[0].OD_ACC_NO : '', y:115},
      { type: 'text', value:this.selectedTo[0].amt? this.selectedTo[0].amt : '', y:125},
      { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:135},
      { type: 'text', value:this.total? this.total : '', y:135},
    )
  }
  else{
    this.pdfData.push(
    { type: 'heading', value:this.translateService.instant('LBL_INVOICE_NUMBER'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_DUE_DATE'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:135},
    { type: 'text', value:this.selectedTo[0].number? this.selectedTo[0].number+"" : '', y:115},
    { type: 'text', value:this.selectedTo[0].dueDate? this.selectedTo[0].dueDate : '', y:125},
    { type: 'text', value:this.selectedTo[0].equivalentAmount? this.selectedTo[0].equivalentAmount : '', y:135},
    { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
    { type: 'text', value:this.total? this.total : '', y:145},
    )
  }
  //   this.pdfData.push(
  //     { type: 'save', value:'ARAMCO.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'ARAMCO.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'ARAMCO.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
getAuthType(val: any) {
  this.authType = val
}

canProceedForm(eve:any){
  this.checkAmountValid = eve;
}
}
