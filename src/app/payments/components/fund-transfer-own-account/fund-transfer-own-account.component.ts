import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PaymentsServiceService } from '../../services/payments-service.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe'
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { TranslateService } from '@ngx-translate/core';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fund-transfer-own-account',
  templateUrl: './fund-transfer-own-account.component.html',
  styleUrls: ['./fund-transfer-own-account.component.scss']
})
export class FundTransferOwnAccountComponent implements OnInit {
  paymentName: string = "Own Account Transfer";
  paymentSubProduct: string = "BKSIFT";
  paymentFunctionCode: string = "CRIFT";
  paymentProduct: string = "PAYMNT";
  transactionType: string = "DEBIT";
  transactionInputType: string = "INPUT_DEBIT_AMOUNT";
  moduleId: string = "PAYMNTINIT";
  inputAction: string = "SAVE_TXN";
  inputTransactStatus: string = "RA";
  inputVersionNum: string = "1";
  url:string='';
  rootScopeData: RootScopeDeclare = RootScopeData
  isLoadingCompelete = false;

  showBeneData = false;
  fromAccountDetails: any = [];
  debitAccountDetailsObj: any;
  debitData: any;
  DebitClearFlag = false;

  toAccountDetails: any = [];
  beneAccountDetailsObj: any;
  beneData: any;
  BeneClearFlag = false;

  showDetails = false;
  initiateScreen = true;
  showAmtDetInitiateScreen = true;
  showAddDetInitiateScreen = true;
  showReceiptForm = false;
  showAuthorization = false;
  showAuthentication = false;
  shownSearchFlag = true;

  receiptData: any;
  checkExchangeRateValidationFlag:any;

  paymentCurrency: any;
  paymentAmount: any;
  formattedPaymentAmount: any;
  additionalDetailsObj: any;
  autherizationDetailsObj: any;
  additionalDetailsErrorObj: any = {
    purposeError: "",
    relationshipError: "",
    valueDateError: ""
  };
  paymentAmtObj: any = {
    amount: "",
    currency: "",
    amountError: "",
    currencyError: "",
    exchangeRate: "",
    fee: "",
    vat: "",
    ccy: "",
    debitAmount: "",
    debitCurrency: ""
  }
  currentDate: any;
  dataSourcePurpose: any
  dataSourceDailyLimit: any
  secAuthRef: any;
  userOtpValue: any;
  otpError: string = "";
  authError: string = "";
  payeeType: string = "Existing";
  //for Edit
  editmode: string = "";
  //debitCurrency:any;
  exchangeRate: any;
  pdfData: any;
  maxDate = new Date();
  minDate = new Date();
  relationshipArray: any = [];
  purposeOfTransferArray: any = [];
  currencyArray: any = [];
  authListArray: any = [];
  rateRefNo: any;
  chargeAmount: any;
  vatAmount: any;
  purposeCode: any;
  categoryCode:any;
  relationShipCode: any;
  businessDates: any;
  debAmt: any;
  param = {
    moduleId: "BUSINESSDAYLIST",
    transactionType: "SARIE"
  }
  exeDateError = false
  exeDetailsObj: any
  chargesParam: any = {
    moduleId: "GETFLDDATA",
    txnType: "IMMEDIATE"
  }
  feeCharge: any
  vatCharge: any
  exeCCY :any;
  ccyCode: any
  disable=false;
  exchangeStatus:any
  paymentCurrencyForRecipt: any;
  debitCcy:any;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:"",
    ccy:""
  }
  insufficientError : boolean = true
  norecordflag: boolean = false;
  amountValidationFlag:boolean=false
  noRecordFoundInfoObj!: { msg: string; btnLabel: string; btnLink: string; showBtn: string; showMsg: string; showIcon: string; };
  beneTitleForEmpty: any;
  refNo:any;
  beneAccountNameFromDetailsService: any;
  checkFlexiAuth: boolean = false;
  transferType: string = "Y";
  authType: any
  saveReceiptObject:any;
  rejectMsg : boolean = false;
  isHideTimer: boolean = false;
  constructor(private translateService: TranslateService,private paymentService: PaymentsServiceService,private downloadAsPdf:downloadAsPdf,private datePipe:DatePipe) {
    this.rootScopeData.lhsActiveComp = '';
    this.rootScopeData.paymentActiveTabName = '';
  }

  ngOnInit(): void {
    this.rootScopeData.lhsActiveComp = 'fundTransfer';
    this.rootScopeData.paymentActiveTabName = 'BKSIFT';
    this.rootScopeData.changeHeading = "Make Payment";
    this.rootScopeData.hideTabs = false;
    if (this.rootScopeData.ownAccountCloneTransactionObject.clone === "Y") {
      this.isLoadingCompelete = true;
      this.rootScopeData.changeHeading = "Make Payment";
      this.rootScopeData.hideTabs = true;
      this.getCloneDebitAccount();
      this.maxDate.setDate(this.minDate.getDate() + 13);
      var today = new Date();
      this.currentDate = "" + today.getDate().toString().padStart(2, "0") + "/" + (today.getMonth() + 1).toString().padStart(2, "0") + "/" + today.getFullYear();

    } 
    else if(this.rootScopeData.SelectedaccountsSummaryObject){
      this.isLoadingCompelete = true;
      this.rootScopeData.changeHeading = "Make Payment";
      this.rootScopeData.hideTabs = true;
      this.getCloneDebitAccount();
    }
    else {
      this.isLoadingCompelete = true;
      this.getPaymentDebitAccount();
      this.maxDate.setDate(this.minDate.getDate() + 13);
      var today = new Date();
      this.currentDate = "" + today.getDate().toString().padStart(2, "0") + "/" + (today.getMonth() + 1).toString().padStart(2, "0") + "/" + today.getFullYear();
    }
    this.url = systemproperty.termsAndConditionsForPayments;
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_RECORDS_FOUND",
      "btnLabel": "",
      "btnLink": "",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
  }

  getPaymentDebitAccount() {
    this.norecordflag = false;
    this.isLoadingCompelete = false;
    let reqObj = {
      moduleId: "PMTACCLKPOWN"
    }
    this.paymentService.getPaymentDebitAccountApiCall(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        this.debitData = response.DATA.ALL_RECORDS;
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

        this.debitAccountDetailsObj = {
          "title": "LBL_FROM",
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
              "dispKey": "LBL_STATUS",
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
      this.isLoadingCompelete = true;
    })
  }

  getBeneInfo() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitCifNo: ""
    }
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";

    this.paymentService.getPaymentOwnBeneAccountApiCall(reqObj).subscribe((response: any) => {
      if (response && response.DATA.ALL_RECORDS && response.DATA.ALL_RECORDS != 0) {
        this.showBeneData = true;
        this.isLoadingCompelete = true;
        this.norecordflag = false;
        this.beneData = response.DATA.ALL_RECORDS;
        for (let i in this.beneData) {
          let crntAvail_amount = this.beneData[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = this.beneData[i].OD_CCY_CODE;
          let convtd_amount = '';
          if (crntAvail_amount && convtd_ccy) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            this.beneData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
            this.beneData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }
        }
        this.beneAccountDetailsObj = {
          "title": "LBL_TO",
          "data": this.beneData,
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
              "dispKey": "LBL_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
              "dataKeySupport": "OD_CCY_CODE"
            }
          ]
        };
        this.getDailyLimit();
      }else{
        this.beneTitleForEmpty = "LBL_TO";
        this.showBeneData = false;
        this.norecordflag = true;
        this.isLoadingCompelete = true;
      }
    }, error => {
      this.showBeneData = false;
      this.isLoadingCompelete = true;
      this.beneTitleForEmpty = "LBL_TO";
      this.showBeneData = false;
      this.norecordflag = true;
      this.isLoadingCompelete = true;
    })
  }

  afterFromAccountSelection(fromAccount: any) {
    if (this.rootScopeData.changeHeading === "Review") {
      return;
    }
    this.chargesParam.unitId = fromAccount && fromAccount.UNIT_ID
      ? fromAccount.UNIT_ID
      : '';
    this.chargesParam.debAccNo = fromAccount && fromAccount.OD_ACC_NO
      ? fromAccount.OD_ACC_NO
      : '';

    this.chargesParam.cif = fromAccount && fromAccount.COD_CORECIF
      ? fromAccount.COD_CORECIF
      : '';

    this.chargesParam.accCcy = fromAccount && fromAccount.OD_CCY_CODE
      ? fromAccount.OD_CCY_CODE
      : '';
    //this.rootScopeData.dailyLimit = "";
    this.norecordflag = false;
    if (fromAccount == 'iconClick') {
      if(this.rootScopeData.ownAccountCloneTransactionObject){
        this.debitAccountDetailsObj = "";
        this.getPaymentDebitAccount();
      }
      this.exchangeStatus='F';
      this.isHideTimer = true;
      this.showBeneData = false;
      this.showDetails = false;
      this.rootScopeData.hideTabs = false;
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
      this.clearAmountData();
    } else {
      //this.paymentAmtObj.currency = fromAccount && fromAccount.OD_CCY_CODE ? fromAccount.OD_CCY_CODE : "";
      this.fromAccountDetails[0] = fromAccount;
      this.getBeneInfo();
      this.rootScopeData.hideTabs = true;
      this.DebitClearFlag = false;
    }
  }

  afterToAccountSelection(toAccount: any) {
    if (this.rootScopeData.changeHeading === "Review") {
      return;
    }
    this.isLoadingCompelete = false;
    let detparams = {
      "OD_ACC_NO": toAccount.OD_ACC_NO,
      "COD_CORECIF": toAccount.COD_CORECIF,
      "REQ_COUNTRY_CODE": toAccount.REQ_COUNTRY_CODE,
      "UNIT_ID": toAccount.UNIT_ID
    }
    this.paymentService.getAccountDetails(detparams).subscribe((res:any)=>{
      this.beneAccountNameFromDetailsService = res.DATA.ACC_DETAILS
    })

    this.businessDates = [{
      "swiftFlag": "01",
      "businessDay": this.currentDate,
      "sarieFlag": "",
      "sequanceDay": "0001"
     }];
     this.getExexCharges(this.chargesParam);
    // this.paymentService.getBusinessDates(this.param).subscribe((res: any) => {
    //   this.isLoadingCompelete = true;
    //   if (res.dataValue) {
    //     this.getExexCharges(this.chargesParam);
    //     this.businessDates = res.dataValue.businessDaysList;
    //   }
    // }, error => {
    //   this.isLoadingCompelete = true;
    // })
    //this.rootScopeData.dailyLimit = "";
    this.BeneClearFlag = false;
    if (toAccount == 'iconClick') {
      this.exchangeStatus='F';
      this.isHideTimer = true;
      this.showDetails = false;
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
      this.clearAmountData();
    } else {
      let beneAccNo = toAccount && toAccount.OD_ACC_NO ? toAccount.OD_ACC_NO : "";
      let debitAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "";
      let debitCcy = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
      let beneCcy = toAccount && toAccount.OD_CCY_CODE ? toAccount.OD_CCY_CODE : "";
      this.paymentAmtObj.currency = toAccount && toAccount.OD_CCY_CODE ? toAccount.OD_CCY_CODE : "";
      if (!beneCcy) {
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_BENE_CURR_NOT_AVAILABLE";
        return;
      } else if (debitAccNo === beneAccNo) {
        this.BeneClearFlag = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_SAME_ACCOUNT";
        return;
      }
      this.currencyArray = [];
      if (debitCcy && debitCcy && debitCcy !== beneCcy) {
        this.currencyArray.push(debitCcy, beneCcy);
      } else {
        this.currencyArray.push(debitCcy);
      }
      this.showDetails = true;
      this.toAccountDetails[0] = toAccount;
      //this.getPaymentPurpose();
      this.getPurpose();
    }
  }

  getDailyLimit() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitCountryCode: "",
      debitUnitId: "",
      debitAvailableBalance: "",
      debitCurrencyCode: "",
      debitCifNo: "",
      debitPortalAccNo: "",
      beneAccNo: "",
      valueDate: "",
      subProduct: "",
      functionCode: ""
    }
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

    this.paymentService.getDailyLimitApiCall(reqObj).subscribe((response: any) => {
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

  getPurpose() {
    let params = {
      subProduct: this.paymentSubProduct,
      functionCode: this.paymentFunctionCode
    }
    this.isLoadingCompelete = false;
    this.purposeOfTransferArray = [];
    this.paymentService.getPurposeOfTransferApiCall(params).subscribe((response: any) => {
      if (response && response.data) {
        this.isLoadingCompelete = true;
        this.purposeOfTransferArray = response.data[0].purposeOfTransfer;
      }
    }, error => {
      this.isLoadingCompelete = true;
    }
    )
  }

  getRelationship() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitUnitId: "",
      purposeCode: ""
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.purposeCode = this.purposeCode ? this.purposeCode : "";
    this.relationshipArray = [];
    this.paymentService.getRelationshipApiCall(reqObj).subscribe((response: any) => {
      if (response && response.data) {
        this.isLoadingCompelete = true;
        this.relationshipArray = response.data;
      }
    }, error => {
      this.isLoadingCompelete = true;
    }
    )
  }

  getPaymentPurpose() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitUnitId: "",
      subProduct: ""
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";

    this.paymentService.getPaymentPurposeApiCall(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        this.dataSourcePurpose = response.data[0].purposeOfTransfer;
      }
    }, error => {
      this.isLoadingCompelete = true;
    }
    )
  }

  paymentDetailsReceived(paymentDetailsObj: any) {
    this.paymentAmount = paymentDetailsObj.amount.trim();
    let amount = Number(this.paymentAmount);
    // this.paymentCurrency = paymentDetailsObj.currency;
    this.paymentCurrencyForRecipt = paymentDetailsObj.currency;
    if (amount) {
      this.chargesParam.amount = amount + ""

      this.debAmt = amount
      this.paymentAmtObj.amountError = "";
      this.debitCcy = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
      this.paymentCurrency = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      this.formattedPaymentAmount = currencyFormatPipeFilter.transform(amount, 'SAR');
      this.paymentAmtObj.amount = this.formattedPaymentAmount;

      let strUnformatAmount: any = [];
      strUnformatAmount = this.paymentAmount.match(/([^.]+)/);
      let amountLength = strUnformatAmount[0].toString().length;
      if (amountLength <= 13) {
        //let beneCcyCode = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
        let debitCcyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
        //debugger;
        if (this.paymentCurrency && this.paymentCurrency != debitCcyCode) {
          this.transactionType = "CREDIT";
          this.transactionInputType = "INPUT_CREDIT_AMOUNT";
          this.getExchangeRate();
        } else {
          this.paymentAmtObj.exchangeRate = "";
          this.transactionType = "DEBIT";
          this.transactionInputType = "INPUT_DEBIT_AMOUNT";

          if(Number(amount) < Number(amountUnFormat(this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT))){
            this.amountValidationFlag = false; 
            this.insufficientError = false;
          }
          else{
            this.amountValidationFlag = true;
            this.paymentAmtObj.amountError = 'LBL_INSUFFICIENT_BALANCE';
            this.insufficientError = true;
          }
        }
      } else {
        this.paymentAmount = "";
        this.formattedPaymentAmount = "";
        this.paymentAmtObj.amountError = "LBL_PROVIDE_VALID_AMOUNT";
      }
    } else {
      this.paymentAmount = "";
      this.paymentAmtObj.exchangeRate = "";
    }

    this.chargesParam.amount =  this.debAmt;
    this.getExexCharges(this.chargesParam);
  }

  getExchangeRate() {
    this.isLoadingCompelete = false;
    let debitCcyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
//debugger;
    if (debitCcyCode != this.paymentCurrencyForRecipt) {
      this.transactionType = "CREDIT";
      this.transactionInputType = "INPUT_CREDIT_AMOUNT";
    } else {
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
    }
    let reqObj = {
      transactionType: "",
      transactionInputType: "",
      paymentAmount: "",
      debitCountryCode: "",
      debitCifNo: "",
      debitAccNo: "",
      debitCurrencyCode: "",
      beneCurrencyCode: "",
      debitUnitId: "",
      paymentCurrency: "",
      subProduct: "",
      functionCode: ""
    }
    reqObj.transactionType = this.transactionType ? this.transactionType : "";
    reqObj.transactionInputType = this.transactionInputType ? this.transactionInputType : "";
    reqObj.paymentAmount = this.paymentAmount ? this.paymentAmount : "";
    reqObj.debitCountryCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].REQ_COUNTRY_CODE ? this.fromAccountDetails[0].REQ_COUNTRY_CODE : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.debitAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "";
    reqObj.debitCurrencyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    reqObj.beneCurrencyCode = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.paymentCurrency = this.paymentCurrency ? this.paymentCurrency : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";
    this.paymentService.getExchangeRateApiCall(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        this.paymentAmtObj.exchangeRate = response.data && response.data[0] && response.data[0].conversionMessage ? response.data[0].conversionMessage : "";
        this.paymentAmtObj.debitAmount = response.data && response.data[0] && response.data[0].paymentAmt ? response.data[0].paymentAmt : "";
        this.paymentAmtObj.debitCurrency = response.data && response.data[0] && response.data[0].creditCcy ? response.data[0].creditCcy : "";
        this.rateRefNo = response.data && response.data[0] && response.data[0].rateRefNo ? response.data[0].rateRefNo : "";
        
        //TargetAmount Added
        this.debAmt = response.data && response.data[0] && response.data[0].targetAmount ? response.data[0].targetAmount : "";;
          // this.ccyCode = this.paymentCurrencyForRecipt;
        this.exchangeStatus="S";
        if(Number(this.debAmt) < Number(amountUnFormat(this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT))){
          this.amountValidationFlag = false; 
          this.insufficientError = false;
        }
        else{
          this.amountValidationFlag = true;
          this.paymentAmtObj.amountError = 'LBL_INSUFFICIENT_BALANCE';
          this.insufficientError = true;
        }
          if(this.paymentAmtObj && this.paymentAmtObj.exchangeRate && this.rateRefNo){
            this.checkExchangeRateValidationFlag = true;
            this.disable = false;
          }
          else{            
           this.checkExchangeRateValidationFlag = false
            this.disable=true;
            this.rootScopeData.showSystemError = true;
            this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_FETCH_THE_RATES";
          }

          if(this.paymentCurrencyForRecipt == this.debitCcy)
          {
            this.debAmt = this.paymentAmount
          }
          else{
            this.debAmt = response.data && response.data[0] && response.data[0].targetAmount ? response.data[0].targetAmount : "";
          }
      }
    }, error => {
      this.isLoadingCompelete = true;
      this.paymentAmtObj.exchangeRate = "";
      this.exchangeStatus="F";
      this.disable = true
        this.checkExchangeRateValidationFlag = false
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_FETCH_THE_RATES";
    }
    )
  }

  currencyDetailsReceived(paymentDetailsObj: any) {
    this.paymentCurrencyForRecipt = paymentDetailsObj.currency;
    // this.paymentCurrency = paymentDetailsObj.currency;
    let paymentAmount = paymentDetailsObj.amount.trim();
    if(!paymentDetailsObj.amount)
    {
      this.debAmt='';
      this.exchangeStatus=''
    }
    this.paymentCurrency = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
    let debitCcyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
   //debugger
    if (this.paymentCurrency) {
      this.paymentAmtObj.currencyError = "";     
      if (paymentAmount && this.paymentCurrency != debitCcyCode) {
         this.getExchangeRate();
      } else {
        this.paymentAmtObj.exchangeRate = "";
      }
    } else {
      this.paymentAmtObj.exchangeRate = "";
    }
  }

  additionalDetailsReceived(additionalDetailsObj: any) {
    this.additionalDetailsObj = additionalDetailsObj;
  }

  getPurposeCode(data: any) {
    this.purposeCode = data;
    this.getRelationship();
  }

  getRelationShipCode(data: any) {
    this.relationShipCode = data;
  }

  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }

  submit() {
    let isAmountValid = true;
    let isCurrencyValid = true;
    //let isPurposeValid = true;
    //let isRelationshipValid = true;
    let isValueDateValid = true;
    if (!this.paymentAmount) {
      isAmountValid = false;
      this.paymentAmtObj.amountError = "LBL_PROVIDE_VALID_AMOUNT";
    }
    if (!this.paymentAmtObj.currency) {
      isCurrencyValid = false;
      this.paymentAmtObj.currencyError = "LBL_PROVIDE_VALID_CURRENCY";
    }
    if (!this.additionalDetailsObj) {
      //isPurposeValid = false;
      // this.additionalDetailsErrorObj.purposeError = "LBL_PLEASE_SELECT_PURPOSE";
      // this.additionalDetailsErrorObj.relationshipError = "LBL_PLEASE_SELECT_RELATIONSHIP";
      this.additionalDetailsErrorObj.valueDateError = "LBL_PROVIDE_VALUE_DATE";
    } else {
      // if(!this.additionalDetailsObj.purpose){
      //   isPurposeValid = false;
      //   this.additionalDetailsErrorObj.purposeError = "LBL_PLEASE_SELECT_PURPOSE";
      // }
      // if(!this.additionalDetailsObj.relationship){
      //   isRelationshipValid = false;
      //   this.additionalDetailsErrorObj.relationshipError = "LBL_PLEASE_SELECT_RELATIONSHIP";
      // }
      if (!this.additionalDetailsObj.valueDate) {
        isValueDateValid = false;
        this.additionalDetailsErrorObj.valueDateError = "LBL_PROVIDE_VALUE_DATE";
      }
    }
    if (this.exeDetailsObj && this.exeDetailsObj.type === "Scheduled") {
      if (typeof (this.exeDetailsObj.date) === "string") {
        this.exeDateError = true
      } else {
        this.exeDateError = false
      }
    }

    if (isAmountValid && isCurrencyValid && isValueDateValid && !this.exeDateError) {
      this.initReqParam.accNo=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "";
      this.initReqParam.amt=this.paymentAmount ? this.paymentAmount : "";
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode=this.paymentSubProduct ? this.paymentSubProduct : "";
      this.initReqParam.cif=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
      this.initReqParam.unitId=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
      this.initReqParam.ccy=this.paymentAmtObj && this.paymentAmtObj.currency ? this.paymentAmtObj.currency : "";

      this.checkSecfactorAuth();
      this.getCharges();
      this.rootScopeData.changeHeading = "Review";
      this.showAmtDetInitiateScreen = false;
      this.showAddDetInitiateScreen = false;
      this.initiateScreen = false;
      this.showDetails = true;
      this.authError = "";
    }
  }

  getCharges() {
    this.isLoadingCompelete = false;
    let reqObj = {
      paymentAmount: "",
      debitUnitId: "",
      debitCifNo: "",
      debitPortalAccNo: "",
      paymentCurrency: "",
      subProduct: "",
      functionCode: ""
    }
    reqObj.paymentAmount = this.paymentAmount ? this.paymentAmount : "";
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
    reqObj.paymentCurrency = this.paymentCurrency ? this.paymentCurrency : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";

    this.paymentService.getChargesApiCall(reqObj).subscribe((response: any) => {
      if (response && response.data) {
        this.isLoadingCompelete = true;
        let fee = response.data[0] && response.data[0].chargeInfo && response.data[0].chargeInfo[0] && response.data[0].chargeInfo[0].charge ? response.data[0].chargeInfo[0].charge : "";
        let vat = response.data[0] && response.data[0].chargeInfo && response.data[0].chargeInfo[0] && response.data[0].chargeInfo[0].tax ? response.data[0].chargeInfo[0].tax : "";
        let ccy = response.data[0] && response.data[0].chargeInfo && response.data[0].chargeInfo[0] && response.data[0].chargeInfo[0].ccy ? response.data[0].chargeInfo[0].ccy : "";
        if (this.paymentAmount && fee && vat && ccy) {
          this.chargeAmount = fee;
          this.vatAmount = vat;
          let currencyFormatPipeFilter = new CurrencyFormatPipe();
          //let debitAmount = Number(this.paymentAmount) + Number(this.paymentAmtObj.fee) + Number(this.paymentAmtObj.vat);
          //this.paymentAmtObj.debitAmount = currencyFormatPipeFilter.transform(debitAmount, ccy);
          this.paymentAmtObj.fee = currencyFormatPipeFilter.transform(fee, ccy);
          this.paymentAmtObj.vat = currencyFormatPipeFilter.transform(vat, ccy);
          this.paymentAmtObj.ccy = ccy;
        }
      }
    }, error => {
      this.isLoadingCompelete = true;
    }
    )
  }

  checkSecfactorAuth() {
    this.isLoadingCompelete = false;
    let reqObj = {
      paymentAmount: "",
      debitCifNo: "",
      debitPortalAccNo: "",
      debitCurrencyCode: "",
      beneCurrencyCode: "",
      paymentCurrency: "",
      subProduct: "",
      functionCode: ""
    }
    reqObj.paymentAmount = this.paymentAmount ? this.paymentAmount : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
    reqObj.debitCurrencyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    reqObj.beneCurrencyCode = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
    reqObj.paymentCurrency = this.paymentAmtObj && this.paymentAmtObj.currency ? this.paymentAmtObj.currency : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";


    this.checkFlexiAuth = false;
    this.paymentService.selfAuthCheck(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        if (response.data.selfAuth == "true") {
          this.showAuthentication = true;
        }
        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.checkFlexiAuth = true;
          this.authListArray = response.data.authList;
        }
      }
    }, error => {
      this.isLoadingCompelete = true;
    }

    )
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onSubmitReceipt();
    } else {
      this.userOtpValue = "";
    }
  }

  modify() {
    this.rootScopeData.changeHeading = "Make Payment";
    this.initiateScreen = true;
    this.showAmtDetInitiateScreen = true;
    this.showAddDetInitiateScreen = true;
    this.showAuthorization = false;
    this.checkFlexiAuth = false;
    this.showAuthentication = false;
    this.clearAuthData();
  }

  cancel() {
    this.exchangeStatus='F';
    this.isHideTimer = true;
    this.initGenerateStatement();
  }

  clearAmountData() {
    this.paymentCurrency = "";
    this.paymentAmount = "";
    this.paymentAmtObj.amount = "";
    this.paymentAmtObj.currency = ""
    this.paymentAmtObj.exchangeRate = "";
    this.paymentAmtObj.debitCurrency = "";
    this.debAmt='';
  }

  clearAuthData() {
    this.autherizationDetailsObj = "";
    this.userOtpValue = "";
    this.otpError = "";
    this.authError = "";
  }

  clearAdditionalData() {
    this.additionalDetailsObj = "";
  }

  initGenerateStatement() {
    this.clearAmountData();
    this.getPaymentDebitAccount();
    this.DebitClearFlag = true;
    this.rootScopeData.changeHeading = "Make Payment";
    this.rootScopeData.ownAccountCloneTransactionObject = '';
    this.rootScopeData.hideTabs = false;
    this.showReceiptForm = false;
    this.initiateScreen = true;
    this.showAmtDetInitiateScreen = true;
    this.showAddDetInitiateScreen = true;
    this.showBeneData = false;
    this.showDetails = false;
    this.showAuthentication = false;
    this.showAuthorization = false;
    this.checkFlexiAuth = false;
   

  }

  onSubmitReceipt() {
    let isOtpValid = true;
    let isAuthorizationValid = true;

    if (this.showAuthentication ) {
      if (!this.userOtpValue || this.userOtpValue.length !== 4) {
        this.otpError = "LBL_PLS_ENTER_OTP";
        isOtpValid = false;
        return;
      }
    }
    /*if(this.showAuthorization && (!this.autherizationDetailsObj || !this.autherizationDetailsObj.selectedAprover)){
      isAuthorizationValid = false;
      this.authError = "LBL_PLS_SELECT_AUTH";
    }*/

    if (isOtpValid) {
      /*if(this.editDetails.type == "amend") {
  this.moduletype = "TXNRECALLAMEND";
  this.inputTypeAction = "SAVE_TXN";
  this.inputTypeTransactStatus = "RA";
  }*/
      this.rootScopeData.dailyLimit = "";
      this.isLoadingCompelete = false;
      let reqObj = {
        moduleId: "",
        inputAction: "",
        inputTransactStatus: "",
        debitUnitId: "",
        paymentAmount: "",
        payeeType: "",
        editmode: "",
        transactionType: "",
        maxIndTxnLimit: "",
        usedPayLimit: "",
        valueDate: "",
        narration: "",
        rateRefNo: "",
        chargeAmount: "",
        vatAmount: "",
        inputVersionNum: "",
        paymentName: "",
        subProduct: "",
        functionCode: "",
        debitAvailableBalance: "",
        debitCurrencyCode: "",
        debitCifNo: "",
        debitPortalAccNo: "",
        debitAccName: "",
        debitAccNo: "",
        debitCountryCode: "",
        beneBank: "",
        beneBranch: "",
        beneAccType: "",
        beneCountry: "",
        beneAccName: "",
        beneCurrencyCode: "",
        beneAccNo: "",
        beneSwiftCode: "",
        beneBankCode: "",
        authRuleId: "",
        authUserNo: "",
        authUserLevel: "",
        selectionFlag: "",
        userNoList: "",
        approverNote: "",
        purposeCode: "",
        categoryCode:"",
        relationshipCode: "",
        otp: "",
        otpRef: "",
        exeType: "",
        INPUT_MODE:"",
        INPUT_REFERENCE_NO:"",
        AUTH_TYPE_O:""
      }
      reqObj.moduleId = this.moduleId ? this.moduleId : "";
      reqObj.inputAction = this.inputAction ? this.inputAction : "";
      reqObj.inputTransactStatus = this.inputTransactStatus ? this.inputTransactStatus : "";
      reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
      reqObj.paymentAmount = this.paymentAmount ? this.paymentAmount : "";
      reqObj.payeeType = this.payeeType ? this.payeeType : "";
      reqObj.editmode = this.editmode ? this.editmode : "";
      reqObj.transactionType = this.transactionType ? this.transactionType : "";
      reqObj.maxIndTxnLimit = this.dataSourceDailyLimit && this.dataSourceDailyLimit.maxIndTxnLimit ? this.dataSourceDailyLimit.maxIndTxnLimit : "";
      reqObj.usedPayLimit = this.dataSourceDailyLimit && this.dataSourceDailyLimit.usedPayLimit ? this.dataSourceDailyLimit.usedPayLimit : "";
      reqObj.valueDate = this.exeDetailsObj && this.exeDetailsObj.valueDate ? this.exeDetailsObj.valueDate : "";
      // reqObj.valueDate = this.additionalDetailsObj && this.additionalDetailsObj.valueDate ? this.additionalDetailsObj.valueDate : "";
      reqObj.narration = this.additionalDetailsObj && this.additionalDetailsObj.narration ? this.additionalDetailsObj.narration : "";
      reqObj.rateRefNo = this.rateRefNo ? this.rateRefNo : "";
      // reqObj.chargeAmount = this.chargeAmount ? this.chargeAmount : "";
      reqObj.chargeAmount = this.exeDetailsObj.fee ? this.exeDetailsObj.fee : "";
      // reqObj.vatAmount = this.exeDetailsObj.vat ? this.exeDetailsObj.vat : "";
      reqObj.exeType = this.exeDetailsObj && this.exeDetailsObj.type ? (this.exeDetailsObj.type).toUpperCase() : "";
      reqObj.vatAmount = this.vatAmount ? this.vatAmount : "";
      reqObj.inputVersionNum = this.inputVersionNum ? this.inputVersionNum : "";
      reqObj.paymentName = this.paymentName ? this.paymentName : "";
      reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
      reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";
      reqObj.purposeCode = this.purposeCode ? this.purposeCode : "";
      reqObj.categoryCode = this.categoryCode ? this.categoryCode : "";
      reqObj.relationshipCode = this.relationShipCode ? this.relationShipCode : "";

      reqObj.debitAvailableBalance = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT ? this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT : "";
      reqObj.debitCurrencyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
      reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
      reqObj.debitPortalAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
      reqObj.debitAccName = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_ACC_NAME ? this.fromAccountDetails[0].OD_ACC_NAME : "";
      reqObj.debitAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "";
      reqObj.debitCountryCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].REQ_COUNTRY_CODE ? this.fromAccountDetails[0].REQ_COUNTRY_CODE : "";

      reqObj.beneBank = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].BANKNAME ? this.toAccountDetails[0].BANKNAME : "";
      reqObj.beneBranch = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].BRANCH_NAME ? this.toAccountDetails[0].BRANCH_NAME : "";
      reqObj.beneAccType = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_ACC_TYPE_2 ? this.toAccountDetails[0].OD_ACC_TYPE_2 : "";
      reqObj.beneCountry = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].COUNTRY ? this.toAccountDetails[0].COUNTRY : "";
      reqObj.beneAccName = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_ACC_NAME ? this.toAccountDetails[0].OD_ACC_NAME : "";
      reqObj.beneCurrencyCode = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
      reqObj.beneAccNo = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_ACC_NO ? this.toAccountDetails[0].OD_ACC_NO : "";

      reqObj.authRuleId = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID ? this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID : "";
      reqObj.authUserNo = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.OD_USER_NO ? this.autherizationDetailsObj.selectedAprover.OD_USER_NO : "";
      reqObj.authUserLevel = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.OD_LEVEL ? this.autherizationDetailsObj.selectedAprover.OD_LEVEL : "";
      reqObj.selectionFlag = reqObj.authUserNo ? 'Y' : 'N';
      reqObj.userNoList = reqObj.authUserNo && reqObj.authUserLevel ? reqObj.authUserNo + '%' + reqObj.authUserLevel : "";
      reqObj.approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : "";

      reqObj.otp = this.userOtpValue ? this.userOtpValue : '';
      reqObj.otpRef = this.secAuthRef ? this.secAuthRef : '';
      reqObj.AUTH_TYPE_O = this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
      if(this.rootScopeData.ownAccountCloneTransactionObject.edit === "Y"){
        reqObj.INPUT_MODE = "EDIT_CONFORM_SUBMIT";
        reqObj.INPUT_REFERENCE_NO = this.rootScopeData.ownAccountCloneTransactionObject.ref_NO;
      }else{
        reqObj.INPUT_MODE = "CONFORM_SUBMIT";
      }

      this.paymentService.submitMakePaymentApiCall(reqObj).subscribe((response: any) => {
        this.isLoadingCompelete = true;
        if (response) {
          if (response.dataValue.OD_STATUS_DESC === "Failed") {
            this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
            // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
          } else {
            this.showAuthorization = false;
            this.showAuthentication = false;
            this.rootScopeData.changeHeading = "";
            this.rootScopeData.ownAccountCloneTransactionObject = '';
            let refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
            this.refNo = refNo;
            this.constructReceiptData(refNo,response.dataValue);
            this.clearAuthData();
            this.clearAmountData();
            this.clearAdditionalData();
            this.showReceiptForm = true;
          }

        } else {
          this.rootScopeData.showSystemError = true;
        }
      }, error => {
        this.isLoadingCompelete = true;
      }
      )
    }
  }

  constructReceiptData(refNumber: any,data:any) {
    let date=this.datePipe.transform(new Date(),this.rootScopeData.userInfo.mDateFormat)
    let newDate=new Date()
    let hrs=newDate.getHours()>9?newDate.getHours():"0"+newDate.getHours();
    let min=newDate.getMinutes()>9?newDate.getMinutes():"0"+newDate.getMinutes();
    let sec= newDate.getSeconds()>9?newDate.getSeconds():"0"+newDate.getSeconds();
    let time=hrs>=12?"PM":"AM"
    let approver = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME : this.translateService.instant("LBL_NOT_PROVIDED");
    let approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : this.translateService.instant("LBL_NOT_PROVIDED");
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    let amt = currencyFormatPipeFilter.transform(this.exeDetailsObj.amt, this.debitCcy);
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.fromAccountDetails[0],{USER_ID:userId})
    let flexiAuth = {
      "title": "LBL_AUTHORIZATION",
      "isTable": "false",
      "fieldDetails": [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": approver
        },
        {
          "dispKey": "LBL_NOTES_NEXT_APROVER",
          "dataKey": approverNote
        }
      ]
    }
    this.rejectMsg=false;
    var message1 : any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    let journalId :any;
    let checkAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
      journalId = data.JOURNAL_ID;
    }else if(data.TXN_STATUS=== "RH" || data.TXN_STATUS=== "RE"){
      message1 = "LBL_PAYMENT_UNSUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = data.OD_REJECT_REASON;
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "RA"){
      message1 = "LBL_PAYMENT_SUCCESSFULL";
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
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_GENERAL_TRSFR__IS_INT_SUCCESS";
    }
    this.receiptData = {
      "msg1": message1,
      // "msg2": "LBL_OWN_TRSFR_PENDNG_FR_APPROVAL_MSG",
      "msg2": message2,
      "referenceNumber": refNumber,
      "journalId":journalId ? journalId : "",
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "true",
          "data": this.fromAccountDetails,
          "authorizeButtonRouterPath": "/accounts/generate-statement",
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
          "data": this.toAccountDetails,
          "fieldDetails": [
            {
              "dispKey": "LBL_BENEFICIARY",
              // "dataKey": "OD_ACC_NAME"
              "dataKey": this.toAccountDetails[0].OD_ACC_NAME 
              // "dataKey": this.beneAccountNameFromDetailsService.res_Account_Name
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              // "dataKey": "OD_ACC_NO"
              "dataKey": this.toAccountDetails[0].OD_ACC_NO
            },
            {
              "dispKey": "LBL_SHORT_NAME",
              // "dataKey": "ALIAS_NAME"
              "dataKey": this.toAccountDetails[0].ALIAS_NAME
            }
          ]
        },
        {
          "isTable": "false",
          "fieldDetails": [
            {
              "dispKey": "LBL_DEBIT_AMT",
              // "dataKey": this.formattedPaymentAmount + ' ' + this.fromAccountDetails[0].OD_CCY_CODE
              "dataKey": amt+ ' '+ this.debitCcy
            },
            {
              "dispKey": "LBL_EXECUTION_DETAILS",
              "dataKey": this.exeDetailsObj && this.exeDetailsObj.valueDate ? this.exeDetailsObj.valueDate : ""
            }
          ]
        }
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
    };
    if (approver && this.checkFlexiAuth && checkAuth) {
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
          "subValue": this.fromAccountDetails[0].USER_ID
        },
        {
          "subHead": "Account Number",
          "subValue": this.fromAccountDetails[0].OD_ACC_NO
        },
        {
          "subHead": "Short Name",
          "subValue": this.fromAccountDetails[0].ALIAS_NAME
        },
        {
          "subHead": "To",
          "subValue": ""
        },
        {
          "subHead": "Beneficiary",
          "subValue": this.toAccountDetails[0].OD_ACC_NAME
        },
        {
          "subHead": "To Account Number",
          "subValue": this.toAccountDetails[0].OD_ACC_NO
        },
        {
          "subHead": "To Short Name",
          "subValue": this.toAccountDetails[0].ALIAS_NAME
        },
        {
          "subHead": "Debit Amount",
          "subValue": amt+ ' '+ this.debitCcy
        },
        {
          "subHead": "Journal ID",
          "subValue": journalId ? journalId : "--"
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        }
      ],
      "pagecall":"payments",
      "refNo":refNumber
    }
  }
  getExexCharges(reqObj: any) {
    this.isLoadingCompelete = false;
    reqObj.subProd = "BKSIFT";
    reqObj.funCode = "CRIFT";
    this.paymentService.getExeCharges(reqObj).subscribe((exeRes: any) => {
      if (exeRes) {
        this.isLoadingCompelete = true;
        this.feeCharge = exeRes.data[0].chargeInfo[0].charge
        this.vatCharge = exeRes.data[0].chargeInfo[0].tax
        this.exeCCY = exeRes.data[0].chargeInfo[0].ccy
      }
    })
  }
  getExecutionDetails(event: any) {
    // console.log("event",event)
    this.exeDetailsObj = event
    this.chargesParam.txnType = (this.exeDetailsObj.type).toUpperCase()
    if (this.exeDetailsObj.callflag == true) {
      this.getExexCharges(this.chargesParam);
    }
  }

  getCloneDebitAccount() {
    this.isLoadingCompelete = false;
    let reqObj = {
      moduleId: "PMTACCLKPOWN"
    }
    this.paymentService.getPaymentDebitAccountApiCall(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        this.debitData = response.DATA.ALL_RECORDS;
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
        if(this.rootScopeData.ownAccountCloneTransactionObject.debitAccNo){
          for (let i = 0; i < this.debitData.length; i++) {
            if (this.rootScopeData.ownAccountCloneTransactionObject.debitAccNo === this.debitData[i].OD_ACC_NO) {
              this.fromAccountDetails[0] = this.debitData[i];
              this.getCloneBeneInfo();
            }
          }
        }
        else if(this.rootScopeData.accountsSummaryObject.OD_ACC_NO) {
          for (let i = 0; i < this.debitData.length; i++) {
            if (this.rootScopeData.accountsSummaryObject.OD_ACC_NO === this.debitData[i].OD_ACC_NO) {
              this.fromAccountDetails[0] = this.debitData[i];
             this.afterFromAccountSelection(this.fromAccountDetails[0])
            }
          }
        }
        this.debitAccountDetailsObj = {
          "title": "LBL_FROM",
          "data": this.fromAccountDetails,
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
              "dispKey": "LBL_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey":this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
              "dataKeySupport": "OD_CCY_CODE"
            }
          ]
        };
      }
    }, error => {
      this.isLoadingCompelete = true;
    })
  }

  getCloneBeneInfo() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitCifNo: ""
    }
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";

    this.paymentService.getPaymentOwnBeneAccountApiCall(reqObj).subscribe((response: any) => {
      if (response) {
        this.showBeneData = true;
        this.isLoadingCompelete = true;
        this.beneData = response.DATA.ALL_RECORDS;
        for (let i in this.beneData) {
          let crntAvail_amount = this.beneData[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = this.beneData[i].OD_CCY_CODE;
          let convtd_amount = '';
          if (crntAvail_amount && convtd_ccy) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            this.beneData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
            this.beneData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }
        }
        this.getDailyLimit();
        for (let i = 0; i < this.beneData.length; i++) {
          if (this.rootScopeData.ownAccountCloneTransactionObject.benefAccNo === this.beneData[i].OD_ACC_NO) {
            this.toAccountDetails[0] = this.beneData[i];
            let detparams = {
              "OD_ACC_NO": this.toAccountDetails[0].OD_ACC_NO,
              "COD_CORECIF": this.toAccountDetails[0].COD_CORECIF,
              "REQ_COUNTRY_CODE": this.toAccountDetails[0].REQ_COUNTRY_CODE,
              "UNIT_ID": this.toAccountDetails[0].UNIT_ID
            }
            this.paymentService.getAccountDetails(detparams).subscribe((res:any)=>{
              this.beneAccountNameFromDetailsService = res.DATA.ACC_DETAILS
            })
          }
        }

      this.beneAccountDetailsObj = {
        "title": "LBL_TO",
        "data": this.toAccountDetails,
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
            "dispKey": "LBL_STATUS",
            "dataKey": "STATUS"
          },
          {
            "dispKey": "LBL_BALANCE",
            "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
            "dataKeySupport": "OD_CCY_CODE"
          }
        ]
      };
      let debitCcy = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
      this.currencyArray = [];
      this.currencyArray.push(debitCcy)
      this.showDetails = true;
      this.paymentAmtObj.amount =  this.rootScopeData.ownAccountCloneTransactionObject.paymentAmt.trim();
      this.paymentAmtObj.currency = debitCcy;
      this.paymentDetailsReceived(this.paymentAmtObj)
      this.businessDates = [{
        "swiftFlag": "01",
        "businessDay": this.currentDate,
        "sarieFlag": "",
        "sequanceDay": "0001"
       }];
       this.getExexCharges(this.chargesParam);
      // this.paymentService.getBusinessDates(this.param).subscribe((res: any) => {
      //   this.isLoadingCompelete = true;
      //   if (res.dataValue) {
      //     this.getExexCharges(this.chargesParam);
      //     this.businessDates = res.dataValue.businessDaysList;
      //   }
      // }, error => {
      //   this.isLoadingCompelete = true;
      // })
    }
     
    }, error => {
      this.showBeneData = false;
      this.isLoadingCompelete = true;
    })
  }
  getStatus(event:any){
    if(this.checkExchangeRateValidationFlag){
      this.disable=event
    }
  }
  downloadPdf(values:any){
    let SelectedType = values;
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_OWN_TRANSFER_RECEIPT'), x:85, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setFontSize', size:10},
        { type: 'setDrawColor', val:128},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:'0', val2:'0', val3:'0'}, 
        { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_TO'), y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_BENEFICIARY'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:135},
        { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
        { type: 'text', value:this.fromAccountDetails[0].USER_ID ? this.fromAccountDetails[0].USER_ID : '', y:75},
        { type: 'text', value:this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : '', y:85},
        { type: 'text', value:this.fromAccountDetails[0].ALIAS_NAME ? this.fromAccountDetails[0].ALIAS_NAME : '', y:95},
        { type: 'text', value:this.toAccountDetails[0].OD_ACC_NAME? this.toAccountDetails[0].OD_ACC_NAME : '', y:115},
        { type: 'text', value:this.toAccountDetails[0].OD_ACC_NO? this.toAccountDetails[0].OD_ACC_NO : '', y:125},
        { type: 'text', value:this.toAccountDetails[0].ALIAS_NAME ? this.toAccountDetails[0].ALIAS_NAME : '', y:135},
        { type: 'text', value: currencyFormatPipeFilter.transform(this.exeDetailsObj.amt, this.debitCcy) + ' ' + this.debitCcy ?  currencyFormatPipeFilter.transform(this.exeDetailsObj.amt, this.debitCcy) + ' ' + this.debitCcy : '', y:145},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:155},
        { type: 'text', value: this.refNo ? this.refNo : '', y:155},
        { type: 'heading', value:this.translateService.instant('LBL_OWN_TRSFR__IS_INT_SUCCESS'), y:165},
        
      ]
      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'ownTransfer.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'ownTransfer.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
     
  
  }
  getAuthType(val: any) {
    this.authType = val
  }
}

