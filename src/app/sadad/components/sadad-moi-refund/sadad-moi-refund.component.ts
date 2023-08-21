import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-sadad-moi-refund',
  templateUrl: './sadad-moi-refund.component.html',
  styleUrls: ['./sadad-moi-refund.component.scss']
})
export class SadadMoiRefundComponent implements OnInit {
  isLoadingCompelete = false;
  debitDataObj: any
  isChecked = "rfReq"
  selectedDebitObj: any
  hideAll = false;
  payToObject: any;
  additionalreadOly = true;
  editData = false;
  addtionalData = { date: null, paymentDetails: '', customerRef: '' }
  isProceed = false;
  moreTransaction = false
  grandTotal: any
  receiptData: any;
  transferData: any = []
  authDataObj: any
  transferTotal = 0;
  dataSorceToPass: any;
  hideContent = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  index = -1;
  sadadMoiFrom:any=[]
  setReadContent=false;
  showBasket=false;
  basketData:any;
  finalBasketData:any
  dynamicParamsForPayload: any = [];
  // billerInfoArr: any;
  // billerRefInfoArr: any;
  authOptions: any;
  refDebitDataObj: any;
  otpError: string = "";
  userOtpValue: any;
  secAuthRef: any;
  sadadReferenceId: any;
  feeReferenceId: any;
  showAuthentication = false;
  showAuthorization = false;
  noRecordFoundInfoObj: any;
  routeDetailScreen:any;
  paymentDate: any;
  dataSourceDailyLimit: any;
  showDailyLimit = false;
  debitAmtReceipt:any;
  makePayment:string = "LBL_MAKE_PYMNT"
  refundReq:string = "LBL_REFUND_REQUEST"
  additionalObjdata: any;
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
  rejectMsg:boolean = false;
  constructor(private translateService: TranslateService,private sadadService: SadadPaymentService, private router: Router, private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.displayContent('rfReq')
    this.url = systemproperty.termsAndConditionsForStopPayment;
  }

  appendDynamicFieldinPayload(dynamicParams: any) {
    this.dynamicParamsForPayload = dynamicParams;
  }

  getDisplayStatus(val: any, comp: any) {
    switch (comp) {
      case 'debitTo':
        if (val ==='iconClick') {
          this.reset();
          this.showDailyLimit = false;
        }else{
          this.selectedDebitObj = val;
          this.showDailyLimit = true;
          this.getDailyLimit();
        }
        break;
      case 'payTo':
        this.payToObject = val;
        if (this.rootScopeData.sadadReset) {
          this.addtionalData = { date: null, paymentDetails: '', customerRef: '' }
          this.additionalreadOly = true;
          this.isProceed = false;
          this.rootScopeData.sadadReset=false;
        }
        this.getAuthApproverDetails();
        break;
      case 'authorization':
        this.authDataObj = val
        break;
      case 'basket':
        this.finalBasketData=val;
        // console.log(val)
        this.transferData=val
        if(this.rootScopeData.basketEdit!=-1){
          this.editRecord(this.rootScopeData.basketEdit)
        }
        break;
    }
  }
  
  displayContent(value: any) {
    this.isChecked = value
    if(this.isChecked == 'mkpmt'){
      this.router.navigate(['sadad/sadadMoi']);
    }else if(this.isChecked == 'rfReq') {
      this.router.navigate(['sadad/sadadRefund']);
      this.getRefundDebitData();
    }
  }
  proceedNext() {
    if (this.isChecked != 'rfReq') {
      if (this.moreTransaction && !this.isProceed) {
        this.getTotalAndTransferObj(this.payToObject)
        this.hideContent = true
        this.showBasket=true
      }else{
        this.additionalreadOly = false
      }
      if (this.editData) {
        this.showBasket=true
        this.hideContent = false;
        // this.rootScopeData.sadadMoiFromRest=true
        this.rootScopeData.sadadMoreTransactionBtn=false
      }
    }
    this.rootScopeData.changeHeading = "LBL_REVIEW"
    this.additionalreadOly = false;
    this.initReqParam.accNo=this.selectedDebitObj  && this.selectedDebitObj.OD_PORTAL_ACC_NO ? this.selectedDebitObj.OD_PORTAL_ACC_NO : "";
    this.initReqParam.amt=this.payToObject && this.payToObject[0].amt ? this.payToObject[0].amt : "0";
    this.initReqParam.pdroductCode="PAYMNT";
    this.initReqParam.subPrdCode='SADMOIRF';
    this.initReqParam.cif=this.selectedDebitObj  && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
    this.initReqParam.unitId=this.selectedDebitObj  && this.selectedDebitObj.UNIT_ID ? this.selectedDebitObj.UNIT_ID : "";
    
    this.isProceed = true;
  }

  getFeesInqData(data:any){
    this.feeReferenceId = data.data.feeReferenceId
    this.sadadReferenceId = data.data.sadadReferenceId
  }

  onSubmit() {
    if (!this.userOtpValue || this.userOtpValue.length !== 4) {
      this.otpError = "LBL_PLS_ENTER_OTP";
      return;
    }
    this.isLoadingCompelete = false;
    this.grandTotal = this.payToObject[0].amt
    this.debitAmtReceipt = this.payToObject[0].receiptAmt
      let reqObj = {
        authUserNo:"",
        selectionFlag:"",
        paymentDetails:"",
        customerRef:"",
        totalAmount: "",
        billerCode: "",
        maxIndTxnLimit: "",
        usedPayLimit: "",
        availPayLimit: "",
        feeReferenceId:"",
        sadadReferenceId:"",
        userOtpValue:"",
        subProductCode:"",
        functionCode:"",
        AUTH_TYPE_O:""
      }
      reqObj.authUserNo  = this.authDataObj && this.authDataObj.selectedAprover && this.authDataObj.selectedAprover.OD_USER_NO ? this.authDataObj.selectedAprover.OD_USER_NO : "";
      reqObj.selectionFlag = reqObj.authUserNo ? 'Y' : 'N';
      reqObj.paymentDetails = this.addtionalData && this.addtionalData.paymentDetails ? this.addtionalData.paymentDetails : "";
      reqObj.customerRef = this.addtionalData && this.addtionalData.customerRef ? this.addtionalData.customerRef : "";
      reqObj.totalAmount = this.grandTotal ? this.grandTotal : "";
      reqObj.maxIndTxnLimit =  this.dataSourceDailyLimit &&  String(this.dataSourceDailyLimit.maxIndTxnLimit) ? String(this.dataSourceDailyLimit.maxIndTxnLimit) : ""; 
      reqObj.usedPayLimit = this.dataSourceDailyLimit && String(this.dataSourceDailyLimit.usedPayLimit) ? String(this.dataSourceDailyLimit.usedPayLimit) : "";
      reqObj.availPayLimit = this.dataSourceDailyLimit && String(this.dataSourceDailyLimit.availPayLimit) ? String(this.dataSourceDailyLimit.availPayLimit) : "";
      reqObj.feeReferenceId = String(this.feeReferenceId) ? String(this.feeReferenceId): "";
      reqObj.sadadReferenceId = String(this.sadadReferenceId) ? String(this.sadadReferenceId): "";
      reqObj.userOtpValue = this.userOtpValue ? this.userOtpValue: "";
      reqObj.subProductCode="SADMOIRF";
      reqObj.functionCode="SAMIRF";
      reqObj.AUTH_TYPE_O = this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
      let selectedDataValues: any = [];
      debugger
      if (this.payToObject) {
        for (let i = 0; i < this.payToObject.length; i++) {
          let selectedValues = {
            "BILLER_NAME": this.payToObject[i].biller,
            "SERVICE_TYPE": this.payToObject[i].serviceType,
            "AMOUNT": String(this.payToObject[i].amt),
            "BILLER_ID": this.payToObject[i].billerId,
            "SERVICE_CODE":this.payToObject[i].serviceCode,
            "DYNAMIC_DATA": this.payToObject[i].dynamicObject,
          }
          selectedDataValues.push(selectedValues)
        }
      }
    this.sadadService.getSadadMoiRefundSubmit(selectedDataValues,this.selectedDebitObj,reqObj,this.secAuthRef, this.dynamicParamsForPayload).subscribe(responseobject => {
      this.isLoadingCompelete = true;
      if (responseobject.dataValue.OD_STATUS_DESC === "Success") {
        this.refNo = responseobject.dataValue.INPUT_REFERENCE_NO;
        this.constructReceiptData(responseobject.dataValue.INPUT_REFERENCE_NO, responseobject.dataValue);
        
      }else{
        this.hideAll = false;
        this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
        // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
      }
    },
    error => {
      this.hideAll = false;
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
    })
  }
  constructReceiptData(refNumber: any, dataValue:any) {
    let data: any=[];
    let approver = this.authDataObj && this.authDataObj.selectedAprover && this.authDataObj.selectedAprover.AUTH_NAME ? this.authDataObj.selectedAprover.AUTH_NAME : "Not Provided";
    let approverNote = this.authDataObj && this.authDataObj.aproveNote ? this.authDataObj.aproveNote : "Not Provided";
    if(this.moreTransaction){
      this.finalBasketData.forEach((element:any) => {
        data.push(element.from)
      });
    }
    if(this.moreTransaction){
      let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(data, { USER_ID: userId })
    }else{
      let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.selectedDebitObj, { USER_ID: userId })
    }
    let flexiAuth = {
      "title": "LBL_AUTHORIZATION",
      "isTable": "false",
      "data": '',
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
    if(dataValue.TXN_STATUS=== "AH"){
      message1 = "LBL_PAYMENT_SUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }else if(dataValue.TXN_STATUS=== "RH" || dataValue.TXN_STATUS=== "RE"){
      message1 = "LBL_PAYMENT_UNSUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = dataValue.OD_REJECT_REASON;
      this.rejectMsg=true;
    }else if(dataValue.TXN_STATUS=== "RA"){
      message1 = "LBL_PAYMENT_SUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
      checkAuth = true;
    }else if(dataValue.TXN_STATUS=== "RN"){
      message1 = "LBL_PAYMENT_UNSUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(dataValue.TXN_STATUS=== "AO"){
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_GENERAL_TRSFR__IS_INT_SUCCESS";
    }else{
      message1 = "LBL_PAYMENT_SUCCESSFULL"
      message2 = "LBL_GENERAL_TRSFR__IS_INT_SUCCESS";
    }
    this.receiptData = {
      "msg1": message1,
      // "msg2": "LBL_SADAD_MOI_REFND_REQ_PENDNG_FR_APPROVAL_MSG",
      "msg2": message2,
      "referenceNumber": refNumber,
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "true",
          "data": this.moreTransaction?data:[this.selectedDebitObj],
          // "data": [this.selectedDebitObj],

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
          "isTable": "false",
          "data": this.payToObject,
          "fieldDetails": [
            {
              "dispKey": "LBL_BILLER",
              "dataKey": this.payToObject[0].biller
            },
            {
              "dispKey": "LBL_SERVICE_TYPE",
              "dataKey": this.payToObject[0].serviceType
            },
            {
              "dispKey":this.dynamicParamsForPayload[0].englishName,
              "dataKey":this.dynamicParamsForPayload[0].value
            }
          ]
        },
        // {
        //   "title": "",
        //   "isTable": "false",
        //   "data": '',
        //   "fieldDetails": [
        //     {
        //       "dispKey": "LBL_DEBIT_AMT",
        //       "dataKey": this.debitAmtReceipt
        //     }
        //   ]
        // },
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
        "buttonLabel": "LBL_INITIATE_REFUND_REQ"
      },
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    }
    if(approver && this.showAuthorization && checkAuth){
      this.receiptData.receiptDetails.push(flexiAuth);
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
          "subValue": this.moreTransaction?data:this.selectedDebitObj.USER_ID
        },
        {
          "subHead": "Account Number",
          "subValue": this.moreTransaction?data:this.selectedDebitObj.OD_ACC_NO
        },
        {
          "subHead": "Nickname",
          "subValue": this.moreTransaction?data:this.selectedDebitObj.ALIAS_NAME
        },
        {
          "subHead": "To",
          "subValue": ""
        },
        {
          "subHead": "Biller",
          "subValue": this.payToObject[0].biller
        },
        {
          "subHead": "Service Type",
          "subValue": this.payToObject[0].serviceType
        }
      ],
      "pagecall":"sadadmoirefund",
      "refNo":refNumber
    }

    this.hideAll = true;
    this.rootScopeData.changeHeading = " ";
    this.isLoadingCompelete = true;
  }
  reset() {
    this.debitDataObj = null;
    this.refDebitDataObj = null;
    this.selectedDebitObj=null;
    this.payToObject=null;
    this.isProceed=false;
    this.additionalreadOly=true
    this.addtionalData={ date: null, paymentDetails: '', customerRef: '' }
    this.editData=false;
    this.moreTransaction=false;
    this.transferData=[];
    this.dataSorceToPass=[]
    this.rootScopeData.sadadMoiFromRest=false;
    this.rootScopeData.sadadReset=false
    this.showBasket=false;
    this.hideContent=false
    this.getRefundDebitData();
    this.hideAll=false;
    this.rootScopeData.changeHeading = " ";
    this.showDailyLimit = false;
  }
  addMoreTransaction() {
    this.rootScopeData.sadadMoiFromRest=false
    this.getTotalAndTransferObj(this.payToObject)
    this.moreTransaction = true;
    this.selectedDebitObj = null;
    this.payToObject = null;
    this.debitDataObj = null;
    this.refDebitDataObj = null;
    this.getRefundDebitData();
    if(!this.editData){
      this.additionalreadOly=true;
      this.editData=false
    }
    this.editData=false
    this.additionalreadOly=true;
    this.addtionalData = { date: null, paymentDetails: '', customerRef: '' }
  }
  getTotalAndTransferObj(obj: any) {
    let formatType = obj[0].amt.slice(-3);
    let amt = obj[0].amt.replace(/([a-zA-Z])/g, '');
    this.transferTotal = this.transferTotal + Number(amt)
    obj[0].from = this.selectedDebitObj;
    obj[0].FULL_NAME =this.selectedDebitObj.FULL_NAME
    obj[0].additionalData = this.addtionalData;
    obj[0].DEB_AMT = obj[0].amt;
    if (this.editData) {
      this.transferData[this.index] = (obj[0]);
    }
    else {
      this.transferData.push(obj[0])
    } 
    this.getBasket()
  }
  deleteRecord(i: any) {
    this.transferTotal = 0
    this.transferData.splice(i, 1);
    this.transferData.forEach((ele: any) => {
      let formatType = ele.amt.slice(-3);
      let amt = ele.amt.replace(/([a-zA-Z])/g, '');
      this.transferTotal = this.transferTotal + Number(amt)
    })
    if (this.transferData.length == 0) {
        this.reset();
      this.dataSorceToPass = []
    } else {
      this.dataSorceToPass = this.transferData;
    }
  }
  editRecord(i: any) {
    this.editData = true;
    this.hideContent = false
    this.isProceed = false
    this.addtionalData = this.transferData[i].additionalData
    this.sadadMoiFrom = this.debitDataObj
    this.sadadMoiFrom = this.refDebitDataObj;
    this.rootScopeData.sadadMoreTransactionBtn=false
    this.sadadMoiFrom["data"] = [this.transferData[i].from]
    this.payToObject = [this.transferData[i]]
    this.selectedDebitObj = this.transferData[i].from
    this.index = i;
    this.showBasket=false
      this.getRefundDebitData();
  }
  getBasket(){
    this.basketData = {
      "title": "LBL_FROM",
      "data": this.transferData,
      "fieldDetails": [
        {
          "dispKey": "LBL_FROM",
          "dataKey": "FULL_NAME"
        },
        {
          "dispKey": "LBL_TO",
          "dataKey": "biller"
        },
        {
          "dispKey": "LBL_DESCRIPTION",
          "dataKey": "nationalId",
          "dataKeySupport":"National ID"
        },
        {
          "dispKey": "LBL_AMOUNT",
          "dataKey": "amt"
        },
        {
          "dispKey": "LBL_DEBIT_AMT",
          "dataKey": "DEB_AMT"
        }
      ]
    };
  }

  getAuthApproverDetails() {
    this.isLoadingCompelete = false;
    let reqObj = {
      paymentAmount:"",
      debitCifNo:"", 
      debitPortalAccNo:"",
      debitCurrencyCode:"",
      vsubprdtcode :"SADMOIRF",
      unitID:"",
      funCode:'SAMIRF'
    }
    reqObj.debitCifNo = this.selectedDebitObj  && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.selectedDebitObj  && this.selectedDebitObj.OD_PORTAL_ACC_NO ? this.selectedDebitObj.OD_PORTAL_ACC_NO : "";
    reqObj.debitCurrencyCode = this.selectedDebitObj && this.selectedDebitObj.OD_CCY_CODE ? this.selectedDebitObj.OD_CCY_CODE : "";
    reqObj.paymentAmount = this.payToObject && this.payToObject[0].amt ? this.payToObject[0].amt : "0";
    reqObj.unitID = this.selectedDebitObj && this.selectedDebitObj.UNIT_ID ? this.selectedDebitObj.UNIT_ID : "";
    this.sadadService.selfAuthCheck(reqObj).subscribe((res: any) => {
	  this.isLoadingCompelete = true;
      if (res && res.data) {
        if (res.data.selfAuth == "true") {
          this.showAuthentication = true;
        }
        if (res.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.authOptions = res.data.authList;
        }
      }
    }, error => {
      this.isLoadingCompelete = true;
    })
  }

  getRefundDebitData() {
    this.sadadService.getSadadMOIRefDebitApiCall().subscribe((debData: any) => {
      if (debData) {
        this.isLoadingCompelete = true;
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
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "ALIAS_NAME"
            },
            {
              "dispKey": "LBL_FULL_NAME",
              "dataKey": "OD_ACC_NAME"
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
  
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onSubmit();
    } else {
      this.userOtpValue = "";
      this.otpError = "LBL_PLS_ENTER_OTP";
    }
  }
  autherizationDetailsReceived(autherizationDetailsObj:any) {
    this.authDataObj = autherizationDetailsObj;
  }

  getDailyLimit() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitAvailableBalance: "",
      debitCurrencyCode: "",
      debitCifNo: "",
      debitPortalAccNo: "",
      valueDate: "",
      subProduct: "SADADPAY",
      functionCode: ""
    }
    reqObj.debitAvailableBalance = this.selectedDebitObj && this.selectedDebitObj.CURR_AVAIL_BAL_AMT ? this.selectedDebitObj.CURR_AVAIL_BAL_AMT : "";
    reqObj.debitCurrencyCode = this.selectedDebitObj && this.selectedDebitObj.OD_CCY_CODE ? this.selectedDebitObj.OD_CCY_CODE : "";
    reqObj.debitCifNo = this.selectedDebitObj && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.selectedDebitObj && this.selectedDebitObj.OD_PORTAL_ACC_NO ? this.selectedDebitObj.OD_PORTAL_ACC_NO : "";
    reqObj.valueDate = this.paymentDate ? this.paymentDate : "";
    this.sadadService.getDailyLimitApiCall(reqObj).subscribe((response: any) => {
    this.isLoadingCompelete = true;
      if (response) {
        this.dataSourceDailyLimit = response.data && response.data[1] ? response.data[1] : "";
        this.rootScopeData.dailyLimit = this.dataSourceDailyLimit;
      }
    }, error => {
      this.isLoadingCompelete = true;
    }
    )
  }
  initSadadRefundMoi(){
    this.reset();
    this.router.navigate(['sadad/sadadRefund'])
  }
  additionalObj(value: any) {
    this.additionalObjdata = value;
  }
  downloadPdf(values:any)
  { 
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant('LBL_SADAD_MOI_RECEIPT'), x:90, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_BILLER'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_SERVICE_TYPE'), y:125},
    { type: 'heading', value:this.translateService.instant(this.dynamicParamsForPayload[0].englishName), y:135},
    { type: 'text', value:this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : '', y:75},
    { type: 'text', value:this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '', y:85},
    { type: 'text', value:this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : '', y:95},
    { type: 'text', value:this.payToObject[0].biller ? this.payToObject[0].biller : '', y:115},
    { type: 'text', value: this.payToObject[0].serviceType ?  this.payToObject[0].serviceType : '', y:125},
    { type: 'text', value:this.dynamicParamsForPayload[0].value ? this.dynamicParamsForPayload[0].value : '', y:135},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNo ? this.refNo : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_MOI_REFND_REQ_IS_INT_SUCCESS'), y:155},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'SadadMOIrefund.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'SadadMOIrefund.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
getAuthType(val: any) {
  this.authType = val
}
}
