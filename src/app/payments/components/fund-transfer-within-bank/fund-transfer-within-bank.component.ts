import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PaymentsServiceService } from '../../services/payments-service.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe'
import { TranslateService } from '@ngx-translate/core';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { DatePipe } from '@angular/common';
import { amountUnFormat } from 'src/app/utility/amount-unformat';


@Component({
  selector: 'app-fund-transfer-within-bank',
  templateUrl: './fund-transfer-within-bank.component.html',
  styleUrls: ['./fund-transfer-within-bank.component.scss']
})
export class FundTransferWithinBankComponent implements OnInit {
  paymentName: string = "Own Account Transfer";
  paymentSubProduct: string = "BKSIBT";
  paymentFunctionCode: string = "CRIBT";
  paymentProduct: string = "PAYMNT";
  transactionType: string = "DEBIT";
  transactionInputType: string = "INPUT_DEBIT_AMOUNT";
  moduleId: string = "PAYMNTINIT";
  inputAction: string = "SAVE_TXN";
  inputTransactStatus: string = "RA";
  inputVersionNum: string = "1";

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
  pdfData: any;
  adhocBene: boolean = false; //???

  receiptData: any;

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

  maxDate = new Date();
  minDate = new Date();
  relationshipArray: any = [];
  purposeOfTransferArray: any = [];
  currencyArray: any = [];
  authListArray: any = [];
  rateRefNo: any;
  chargeAmount: any;
  vatAmount: any;

  country: any;
  countryCode: any;
  adhocObj: any = {
    adhocAccNo: "",
    adhocAccNoError: "",
    adhocFullName: "",
    adhocCurrency: "",
    adhocBankName: "",
    adhocBranchName: "",
    adhocBankCity: "",
    adhocSwiftCode: ""
  };
  purposeCode: any;
  relationShipCode: any;
  purposeData: any;

  businessDates: any;
  debAmt: any;
  param = {
    moduleId: "BUSINESSDAYLIST",
    transactionType: "SARIE"
  }
  exeDateError = false
  exeDetailsObj: any;
  chargesParam: any = {
    moduleId: "GETFLDDATA",
    txnType: "IMMEDIATE"
  }
  feeCharge: any
  vatCharge: any
  exeCCY :any;
  ccyCode: any
  isAccountNumberValid = true;
  disable=false;
  exchangeStatus:any
  url: string='';
  paymentCurrencyForRecipt: any;
  debitCcy:any
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
  noRecordFoundInfoObj!: { msg: string; btnLabel: string; btnLink: string; showBtn: string; showMsg: string; showIcon: string; };
  beneTitleForEmpty: any;
  refNo:any;
  amountValidationFlag:boolean=false
  checkFlexiAuth: boolean = false;
  transferType: string = "Y";
  authType: any;
  saveReceiptObject: any;
  rejectMsg : boolean = false;
  isHideTimer: boolean = false;
  constructor(private translateService: TranslateService,private paymentService: PaymentsServiceService,  private downloadAsPdf:downloadAsPdf,private datePipe:DatePipe) {
    this.rootScopeData.lhsActiveComp = 'fundTransfer';
    this.rootScopeData.paymentActiveTabName = 'BKSIBT';
  }

  ngOnInit(): void {
    if (this.rootScopeData.withinBankCloneTransactionObject.clone === "Y") { 
      this.isLoadingCompelete = true;
      this.rootScopeData.changeHeading = "Make Payment";
      this.rootScopeData.hideTabs = true;
      this.getClonePaymentDebitAccount();
      this.maxDate.setDate(this.minDate.getDate() + 13);
      var today = new Date();
      this.currentDate = "" + today.getDate().toString().padStart(2, "0") + "/" + (today.getMonth() + 1).toString().padStart(2, "0") + "/" + today.getFullYear();
    }
    else if(this.rootScopeData.SelectedaccountsSummaryObject){
      this.isLoadingCompelete = true;
      this.rootScopeData.changeHeading = "Make Payment";
      this.rootScopeData.hideTabs = true;
      this.getClonePaymentDebitAccount();
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
      moduleId: "PMTACCLKPTWB"
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
      debitUnitId: "",
      debitCifNo: "",
      subProduct: "",
      functionCode: ""
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";

    this.paymentService.getPaymentBeneAccountApiCall(reqObj).subscribe((response: any) => {
      if (response && response.data && response.data.length != 0) {
        this.showBeneData = true;
        this.norecordflag = false;
        this.isLoadingCompelete = true;
        this.beneData = response.data;
        this.beneAccountDetailsObj = {
          "title": "LBL_TO",
          "data": this.beneData,
          "fieldDetails": [
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "beneId"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "beneAccNo"
            },
            {
              "dispKey": "LBL_FULL_NAME",
              "dataKey": "beneaccName"
            },
            {
              "dispKey": "LBL_BANK_NAME",
              "dataKey": "bankName"
            },
            {
              "dispKey": "LBL_CURRENCY",
              "dataKey": "debitCcy"
            },
            {
              "dispKey": "LBL_STATUS",
              "dataKey": "callBackStatus"
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
      this.beneTitleForEmpty = "LBL_TO";
      this.showBeneData = false;
      this.norecordflag = true;
      this.isLoadingCompelete = true;
    })
  }

  afterFromAccountSelection(fromAccount: any) {

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

    if (this.rootScopeData.changeHeading === "Review") {
      return;
    }
    //this.rootScopeData.dailyLimit = "";
    this.adhocBene = false;
    this.norecordflag = false;
    if (fromAccount == 'iconClick') {
      if(this.rootScopeData.withinBankCloneTransactionObject){
        this.debitAccountDetailsObj = "";
        this.getPaymentDebitAccount();
      }
      this.exchangeStatus='F';
      this.isHideTimer = true;
      this.showBeneData = false;
      this.showDetails = false;
      this.rootScopeData.hideTabs = false;
      this.payeeType = "Existing";
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
      this.clearAmountData();
    } else {
      this.paymentAmtObj.currency = fromAccount && fromAccount.OD_CCY_CODE ? fromAccount.OD_CCY_CODE : "";
      this.fromAccountDetails[0] = fromAccount;
      this.getBeneInfo();
      this.rootScopeData.hideTabs = true;
      this.DebitClearFlag = false;
    }
  }

  afterToAccountSelection(toAccount: any) {
    // changes added
    //this.getBusinessDateAndChargesApi()
// debugger;
    this.getExexCharges(this.chargesParam);    
    this.businessDates = [{
    "swiftFlag": "01",
    "businessDay": this.currentDate,
    "sarieFlag": "",
    "sequanceDay": "0001"
   }];
    if (this.rootScopeData.changeHeading === "Review") {
      return;
    }
    //this.rootScopeData.dailyLimit = "";
    if (toAccount == 'iconClick') {
      this.exchangeStatus='F';
      this.isHideTimer = true;
      this.showDetails = false;
      this.beneAccountDetailsObj = "";
      this.payeeType = "Existing";
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
      this.clearAdhoc();
      this.clearAmountData();
      this.getBeneInfo();
    } else {
      if (toAccount && toAccount.debitCcy) {
        this.paymentAmtObj.currency = toAccount && toAccount.debitCcy ? toAccount.debitCcy : "";
        this.onSelectBeneSingleRecord(toAccount);
      } else {
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_BENE_CURR_NOT_AVAILABLE";
      }
    }
  }

  onSelectBeneSingleRecord(toAccount: any) {
    let debitCcy = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    let beneCcy = toAccount && toAccount.debitCcy ? toAccount.debitCcy : "";
    this.currencyArray = [];
    if (debitCcy && debitCcy && debitCcy !== beneCcy) {
      this.currencyArray.push(debitCcy, beneCcy);
    } else {
      this.currencyArray.push(debitCcy);
    }
    this.showDetails = true;

    this.toAccountDetails[0] = toAccount;
    // console.log(this.toAccountDetails[0])
    //this.getPaymentPurpose();
    this.getPurpose();
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
        // this.purposeOfTransferArray = response.data[0].purposeOfTransfer;
        this.purposeOfTransferArray = response.data;
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
      purposeCode: "",
      categoryCode: "",
      subPurposeCode: "",
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.purposeCode = this.purposeData.purposeCode ? this.purposeData.purposeCode : "";
    reqObj.categoryCode = this.purposeData.categoryCode ? this.purposeData.categoryCode : "";
    reqObj.subPurposeCode = this.purposeData.subPurposeCode ? this.purposeData.subPurposeCode : "";
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
    this.debitCcy = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    this.paymentCurrency = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].debitCcy ? this.toAccountDetails[0].debitCcy : "";
    if (amount) {
      this.chargesParam.amount = amount + ""

      this.debAmt = amount
      this.ccyCode = this.paymentCurrencyForRecipt;
      this.paymentAmtObj.amountError = "";
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      this.formattedPaymentAmount = currencyFormatPipeFilter.transform(amount, 'SAR');
      this.paymentAmtObj.amount = this.formattedPaymentAmount;

      let strUnformatAmount: any = [];
      strUnformatAmount = this.paymentAmount.match(/([^.]+)/);
      let amountLength = strUnformatAmount[0].toString().length;

      if (amountLength <= 13) {
        //let beneCcyCode = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
        let debitCcyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";

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
    reqObj.beneCurrencyCode = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].debitCcy ? this.toAccountDetails[0].debitCcy : "";
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
        this.debAmt = response.data && response.data[0] && response.data[0].targetAmount ? response.data[0].targetAmount : "";
        this.exchangeStatus="S"

        if(Number(this.debAmt) < Number(amountUnFormat(this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT))){
          this.amountValidationFlag = false; 
          this.insufficientError = false
        }
        else{
          this.amountValidationFlag = true;
          this.paymentAmtObj.amountError = 'LBL_INSUFFICIENT_BALANCE';
          this.insufficientError = true;
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
      this.exchangeStatus="F"
    }
    )
  }

  currencyDetailsReceived(paymentDetailsObj: any) {
    // this.paymentCurrency = paymentDetailsObj.currency;
    this.paymentCurrencyForRecipt = paymentDetailsObj.currency;
    let paymentAmount = paymentDetailsObj.amount.trim();
    if(!paymentDetailsObj.amount)
    {
      this.debAmt='';
      this.exchangeStatus=''
    }

    if (this.paymentCurrency) {
      this.paymentAmtObj.currencyError = "";
      this.paymentCurrency = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
      //let beneCcyCode = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].OD_CCY_CODE ? this.toAccountDetails[0].OD_CCY_CODE : "";
      let debitCcyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
      if (paymentAmount && this.paymentCurrency != debitCcyCode) {
        // this.getExchangeRate();
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
    this.purposeData = data;
    // this.purposeCode = data.subPurposeCode;
    this.getRelationship();
  }

  getRelationShipCode(data: any) {
    this.relationShipCode = data;
  }

  adhocDetailReceived(adhocObj: any) {
    this.adhocObj = adhocObj;
    if (this.adhocObj.adhocAccNo) {
      this.isLoadingCompelete = false;
      this.adhocObj.adhocAccNoError = "";
      let reqObj = {
        accNumber: "",
        paymentMode: "",
        unitId: "",
        country: "SAUDI ARABIA",
        countryCode: "SA",
        currency: "SAR"
      }
      reqObj.accNumber = this.adhocObj && this.adhocObj.adhocAccNo ? this.adhocObj.adhocAccNo : "";
      reqObj.paymentMode = this.paymentSubProduct ? this.paymentSubProduct : "";
      reqObj.unitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
      // reqObj.country = this.country ? this.country : "";
      // reqObj.countryCode = this.countryCode ? this.countryCode : "";

      this.paymentService.validateAccountNumber(reqObj).subscribe((response: any) => {
        this.isLoadingCompelete = true;
        if (response && response.data && response.data.HOST_RESP === "SUCCESS") {
          this.adhocObj.adhocFullName = response.data.BENE_NME ? response.data.BENE_NME : "";
          this.adhocObj.adhocCurrency = response.data.BENE_CURRENCY ? response.data.BENE_CURRENCY : "";
          this.adhocObj.adhocBankName = response.data.BANK_NAME ? response.data.BANK_NAME : "";
          this.adhocObj.adhocBranchName = response.data.BRANCH_NAME ? response.data.BRANCH_NAME : "";
          this.adhocObj.adhocBankCity = response.data.BANK_ADDRESS ? response.data.BANK_ADDRESS : "";
          this.adhocObj.adhocSwiftCode = response.data.SWIFT_CODE ? response.data.SWIFT_CODE : "";
          this.isAccountNumberValid = true;
        } else {
          this.isAccountNumberValid = false
        }
      }, (error: any) => {
        this.isLoadingCompelete = true;
      }
      )
    } else {
      this.clearAdhoc();
    }
  }

  proceedAdhoc() {
    let isAdhocValid = true;
    if (!this.adhocObj.adhocAccNo) {
      isAdhocValid = false;
      this.adhocObj.adhocAccNoError = "LBL_PROVIDE_ACC_NO";
    }
    if (!this.adhocObj || !this.adhocObj.adhocCurrency) {
      isAdhocValid = false;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_BENE_CURR_NOT_AVAILABLE";
    }
    if (isAdhocValid) {
      this.payeeType = "New";
      let beneAdhocData = [{
        // aliasName: "", //????
        beneAccNo: this.adhocObj.adhocAccNo,
        accName: this.adhocObj.adhocFullName,
        bankName: this.adhocObj.adhocBankName,
        debitCcy: this.adhocObj.adhocCurrency,
        STATUS: "", //???
        debitBranch: this.adhocObj.adhocBranchName,
        beneAccType: "Account"
      }]

      this.beneAccountDetailsObj = {
        "title": "LBL_TO",
        "data": beneAdhocData,
        "fieldDetails": [
          {
            "dispKey": "LBL_ACC_NUMBER",
            "dataKey": "beneAccNo"
          },
          {
            "dispKey": "LBL_FULL_NAME",
            "dataKey": "accName"
          },
          {
            "dispKey": "LBL_BANK_NAME",
            "dataKey": "bankName"
          },
          {
            "dispKey": "LBL_CURRENCY",
            "dataKey": "debitCcy"
          },
          {
            "dispKey": "LBL_STATUS",
            "dataKey": "STATUS"
          }
        ]
      };
      // this.beneAccountDetailsObj.data = beneAdhocData;
      this.adhocBene = false;
      this.showBeneData = true;
      this.onSelectBeneSingleRecord(beneAdhocData[0]);
    }
  }

  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }

  submit() {
    let isAmountValid = true;
    let isCurrencyValid = true;
    let isPurposeValid = true;
    let isRelationshipValid = true;
    // let isValueDateValid = true;
    if (!this.paymentAmount) {
      isAmountValid = false;
      this.paymentAmtObj.amountError = "LBL_PROVIDE_VALID_AMOUNT";
    }
    if (!this.paymentAmtObj.currency) {
      isCurrencyValid = false;
      this.paymentAmtObj.currencyError = "LBL_PROVIDE_VALID_CURRENCY";
    }
    if (!this.additionalDetailsObj) {
      isPurposeValid = false;
      this.additionalDetailsErrorObj.purposeError = "LBL_PLEASE_SELECT_PURPOSE";
      this.additionalDetailsErrorObj.relationshipError = "LBL_PLEASE_SELECT_RELATIONSHIP";
      // this.additionalDetailsErrorObj.valueDateError = "LBL_PROVIDE_VALUE_DATE";
    } else {
      if (!this.additionalDetailsObj.purpose) {
        isPurposeValid = false;
        this.additionalDetailsErrorObj.purposeError = "LBL_PLEASE_SELECT_PURPOSE";
      }
      if (!this.additionalDetailsObj.relationship) {
        isRelationshipValid = false;
        this.additionalDetailsErrorObj.relationshipError = "LBL_PLEASE_SELECT_RELATIONSHIP";
      }

    }
    // if(!this.additionalDetailsObj.valueDate){
    //   isValueDateValid = false;
    //   this.additionalDetailsErrorObj.valueDateError = "LBL_PROVIDE_VALUE_DATE";
    // }
    if (this.exeDetailsObj && this.exeDetailsObj.type === "Scheduled") {
      if (typeof (this.exeDetailsObj.date) === "string") {
        this.exeDateError = true
      } else {
        this.exeDateError = false
      }
    }

    if (isAmountValid && isCurrencyValid && !this.exeDateError && isPurposeValid && isRelationshipValid) {
      this.initReqParam.accNo=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "";
      this.initReqParam.amt=this.paymentAmount ? this.paymentAmount : "";
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode=this.paymentSubProduct ? this.paymentSubProduct : "";
      this.initReqParam.cif=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
      this.initReqParam.unitId=this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
      this.initReqParam.ccy=this.paymentAmtObj && this.paymentAmtObj.currency ? this.paymentAmtObj.currency : "";

      this.checkSecfactorAuth();
      // this.getCharges();
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
    reqObj.beneCurrencyCode = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].debitCcy ? this.toAccountDetails[0].debitCcy : "";
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

  showOneTimePayment() {
    // changes added
    this.getBusinessDateAndChargesApi()
    this.adhocObj.adhocAccNoError = "";
    let reqObj = {
      moduleId: "COUNTRYLKPTWB",
      unitId: this.rootScopeData.userInfo.UNIT_ID
    }
    this.paymentService.getCountry(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        this.adhocBene = true;
        this.showBeneData = false;
        this.country = response.data && response.data[0] && response.data[0].countryName ? response.data[0].countryName : "";
        this.countryCode = response.data && response.data[0] && response.data[0].countryCode ? response.data[0].countryCode : "";;
      }
    }, (error: any) => {
      this.isLoadingCompelete = true;
    }
    )
  }

  cancel() {
    this.exchangeStatus='F';
    this.isHideTimer = true;
    this.initGenerateStatement();
  }

  cancelAdhoc() {
    this.adhocBene = false;
    this.showBeneData = true;
    this.clearAdhoc();
  }

  clearAmountData() {
    this.paymentCurrency = "";
    this.paymentAmount = "";
    this.paymentAmtObj.amount = "";
    this.paymentAmtObj.currency = ""
    this.paymentAmtObj.exchangeRate = "";
    this.paymentAmtObj.debitCurrency = "";
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

  clearAdhoc() {
    this.adhocObj.adhocAccNo = "";
    this.adhocObj.adhocAccNoError = "";
    this.adhocObj.adhocFullName = "";
    this.adhocObj.adhocCurrency = "";
    this.adhocObj.adhocBankName = "";
    this.adhocObj.adhocBranchName = "";
    this.adhocObj.adhocBankCity = "";
    this.adhocObj.adhocSwiftCode = "";
  }

  initGenerateStatement() {
    this.clearAmountData();
    this.getPaymentDebitAccount();
    this.DebitClearFlag = true;
    this.rootScopeData.changeHeading = "Make Payment";
    this.rootScopeData.withinBankCloneTransactionObject = '';
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
    this.adhocBene = false;
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
        beneId: "",
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
        subPurposeCode: "",
        categoryCode: "",
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
      reqObj.paymentAmount = this.paymentAmount ? this.paymentAmount : "";
      reqObj.payeeType = this.payeeType ? this.payeeType : "";
      reqObj.editmode = this.editmode ? this.editmode : "";
      reqObj.transactionType = this.transactionType ? this.transactionType : "";
      reqObj.maxIndTxnLimit = this.dataSourceDailyLimit && this.dataSourceDailyLimit.maxIndTxnLimit ? this.dataSourceDailyLimit.maxIndTxnLimit : "";
      reqObj.usedPayLimit = this.dataSourceDailyLimit && this.dataSourceDailyLimit.usedPayLimit ? this.dataSourceDailyLimit.usedPayLimit : "";
      // reqObj.valueDate = this.additionalDetailsObj && this.additionalDetailsObj.valueDate ? this.additionalDetailsObj.valueDate : "";
      reqObj.valueDate = this.exeDetailsObj && this.exeDetailsObj.valueDate ? this.exeDetailsObj.valueDate : "";
      reqObj.narration = this.additionalDetailsObj && this.additionalDetailsObj.narration ? this.additionalDetailsObj.narration : "";
      reqObj.rateRefNo = this.rateRefNo ? this.rateRefNo : "";
      // reqObj.chargeAmount = this.chargeAmount ? this.chargeAmount : "";
      reqObj.chargeAmount = this.exeDetailsObj.fee ? this.exeDetailsObj.fee : "";
      // reqObj.vatAmount = this.vatAmount ? this.vatAmount : "";
      reqObj.exeType = this.exeDetailsObj && this.exeDetailsObj.type ? (this.exeDetailsObj.type).toUpperCase() : "";
      reqObj.vatAmount = this.exeDetailsObj.vat ? this.exeDetailsObj.vat : "";
      reqObj.inputVersionNum = this.inputVersionNum ? this.inputVersionNum : "";
      reqObj.paymentName = this.paymentName ? this.paymentName : "";
      reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
      reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";
      reqObj.purposeCode = this.purposeData.purposeCode ? this.purposeData.purposeCode : "";
      reqObj.subPurposeCode = this.purposeData.subPurposeCode ? this.purposeData.subPurposeCode : "";
      reqObj.categoryCode = this.purposeData.categoryCode ? this.purposeData.categoryCode : "";
      reqObj.relationshipCode = this.relationShipCode ? this.relationShipCode : "";

      reqObj.otp = this.userOtpValue ? this.userOtpValue : '';
      reqObj.otpRef = this.secAuthRef ? this.secAuthRef : '';
      reqObj.AUTH_TYPE_O = this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
      if(this.rootScopeData.withinBankCloneTransactionObject.edit === "Y"){
        reqObj.INPUT_MODE = "EDIT_CONFORM_SUBMIT";
        reqObj.INPUT_REFERENCE_NO = this.rootScopeData.withinBankCloneTransactionObject.ref_NO;
      }else{
        reqObj.INPUT_MODE = "CONFORM_SUBMIT";
      }

      if (this.fromAccountDetails && this.fromAccountDetails[0]) {
        reqObj.debitUnitId = this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
        reqObj.debitAvailableBalance = this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT ? this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT : "";
        reqObj.debitCurrencyCode = this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
        reqObj.debitCifNo = this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
        reqObj.debitPortalAccNo = this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
        reqObj.debitAccName = this.fromAccountDetails[0].OD_ACC_NAME ? this.fromAccountDetails[0].OD_ACC_NAME : "";
        reqObj.debitAccNo = this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "";
        reqObj.debitCountryCode = this.fromAccountDetails[0].REQ_COUNTRY_CODE ? this.fromAccountDetails[0].REQ_COUNTRY_CODE : "";
      }

      if (this.toAccountDetails && this.toAccountDetails[0]) {
        reqObj.beneBank = this.toAccountDetails[0].bankName ? this.toAccountDetails[0].bankName : "";
        reqObj.beneBranch = this.toAccountDetails[0].debitBranch ? this.toAccountDetails[0].debitBranch : "";
        reqObj.beneAccType = this.toAccountDetails[0].beneAccType ? this.toAccountDetails[0].beneAccType : "";
        reqObj.beneCountry = this.toAccountDetails[0].beneCntry ? this.toAccountDetails[0].beneCntry : "";
        reqObj.beneAccName = this.toAccountDetails[0].beneaccName ? this.toAccountDetails[0].beneaccName : "";
        reqObj.beneId = this.toAccountDetails[0].beneId ? this.toAccountDetails[0].beneId : "";
        reqObj.beneCurrencyCode = this.toAccountDetails[0].debitCcy ? this.toAccountDetails[0].debitCcy : "";
        reqObj.beneAccNo = this.toAccountDetails[0].beneAccNo ? this.toAccountDetails[0].beneAccNo : "";
      }

      if (this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover) {
        reqObj.authRuleId = this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID ? this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID : "";
        reqObj.authUserNo = this.autherizationDetailsObj.selectedAprover.OD_USER_NO ? this.autherizationDetailsObj.selectedAprover.OD_USER_NO : "";
        reqObj.authUserLevel = this.autherizationDetailsObj.selectedAprover.OD_LEVEL ? this.autherizationDetailsObj.selectedAprover.OD_LEVEL : "";
        reqObj.selectionFlag = reqObj.authUserNo ? 'Y' : 'N';
        reqObj.userNoList = reqObj.authUserNo && reqObj.authUserLevel ? reqObj.authUserNo + '%' + reqObj.authUserLevel : "";
      }
      reqObj.approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : "";


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
            let refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
            this.refNo = refNo;
            this.constructReceiptData(refNo,response.dataValue);
            this.clearAuthData();
            this.clearAmountData();
            this.clearAdditionalData();
            this.clearAdhoc();
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
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.fromAccountDetails[0],{USER_ID:userId})
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    let approver = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME : this.translateService.instant("LBL_NOT_PROVIDED");
    let approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : this.translateService.instant("LBL_NOT_PROVIDED");
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
    var message1 :any;
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
      // "msg2": "LBL_WITHIN_BNK_TRSGR_PENDNG_FR_ARROVAL_MSG",
      "msg2": message2,
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      "referenceNumber": refNumber,
      "journalId":journalId ? journalId : "",
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
              "dataKey": this.toAccountDetails[0].beneaccName
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": this.toAccountDetails[0].beneAccNo
            },
            {
              "dispKey": "LBL_SHORT_NAME",
              "dataKey": this.toAccountDetails[0].aliasName
            }
          ]
        },
        {
          "isTable": "false",
          "fieldDetails": [
            {
              "dispKey": "LBL_DEBIT_AMT",
              "dataKey": currencyFormatPipeFilter.transform(this.exeDetailsObj.amt, this.debitCcy) + ' ' + this.debitCcy
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
          "subValue": this.toAccountDetails[0].beneaccName
        },
        {
          "subHead": "To Account Number",
          "subValue": this.toAccountDetails[0].beneAccNo
        },
        {
          "subHead": 'To Short Name',
          "subValue": this.toAccountDetails[0].aliasName
        },
        {
          "subHead": "Debit Amount",
          "subValue": currencyFormatPipeFilter.transform(this.exeDetailsObj.amt, this.debitCcy) + ' ' + this.debitCcy
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
    reqObj.subProd = "BKSIBT";
    reqObj.funCode = "CRIBT";
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
    this.exeDetailsObj = event
    this.chargesParam.txnType = (this.exeDetailsObj.type).toUpperCase()
    if (this.exeDetailsObj.callflag == true) {
      this.getExexCharges(this.chargesParam);
    }
  }
  // changes added
  getBusinessDateAndChargesApi() {
    this.isLoadingCompelete = false
    this.paymentService.getBusinessDates(this.param).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      if (res.dataValue) {
        this.getExexCharges(this.chargesParam);
        this.businessDates = res.dataValue.businessDaysList;
      }
    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  getClonePaymentDebitAccount() {
    this.isLoadingCompelete = false;
    let reqObj = {
      moduleId: "PMTACCLKPTWB"
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
        if(this.rootScopeData.withinBankCloneTransactionObject.debitAccNo){
        for (let i = 0; i < this.debitData.length; i++) {
          if (this.rootScopeData.withinBankCloneTransactionObject.debitAccNo === this.debitData[i].OD_ACC_NO) {
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

  getCloneBeneInfo() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitUnitId:"",
      debitCifNo:"",
      subProduct:"",
      functionCode:""
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";

    this.paymentService.getPaymentBeneAccountApiCall(reqObj).subscribe((response: any) => {
      if(response){
        this.showBeneData = true;
        this.isLoadingCompelete = true;
        this.beneData = response.data;
        for (let i = 0; i < this.beneData.length; i++) {
          if (this.rootScopeData.withinBankCloneTransactionObject.benefAccNo === this.beneData[i].beneAccNo) {
            this.toAccountDetails[0] = this.beneData[i];
          }
        }
        this.beneAccountDetailsObj = {
          "title": "LBL_TO",
          "data": this.toAccountDetails,
          "fieldDetails":[
            {
                "dispKey": "LBL_NICKNAME",
                "dataKey": "beneId"
            },
            {
                "dispKey": "LBL_ACC_NUMBER",
                "dataKey": "beneAccNo"
            },
            {
                "dispKey": "LBL_FULL_NAME",
                "dataKey": "beneaccName"
            },
            {
              "dispKey": "LBL_BANK_NAME",
              "dataKey": "bankName"
            },
            {
              "dispKey": "LBL_CURRENCY",
              "dataKey": "debitCcy"
            },
            {
                "dispKey": "LBL_STATUS",
                "dataKey": "callBackStatus"
            }
          ]
      };
      this.getDailyLimit();
      let debitCcy = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
      this.currencyArray = [];
      this.currencyArray.push(debitCcy)
      this.showDetails = true;
      this.paymentAmtObj.amount =  this.rootScopeData.withinBankCloneTransactionObject.paymentAmt.trim();
      this.paymentAmtObj.currency = debitCcy;
      this.paymentDetailsReceived(this.paymentAmtObj);
      this.getPurpose();
      this.getBusinessDateAndChargesApi();}
    }, error => {
      this.showBeneData = false;
      this.isLoadingCompelete = true;
     })
  }
  getStatus(event:any){
    this.disable=event
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
        { type: 'title', value:this.translateService.instant('LBL_WITHIN_SNB_RECEIPT'), x:85, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_BENEFICIARY'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:135},
        { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
        { type: 'text', value:this.fromAccountDetails[0].USER_ID ? this.fromAccountDetails[0].USER_ID : '', y:75},
        { type: 'text', value:this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : '', y:85},
        { type: 'text', value:this.fromAccountDetails[0].ALIAS_NAME ? this.fromAccountDetails[0].ALIAS_NAME : '', y:95},
        { type: 'text', value:this.toAccountDetails[0].beneaccName? this.toAccountDetails[0].beneaccName : '', y:115},
        { type: 'text', value:this.toAccountDetails[0].beneAccNo? this.toAccountDetails[0].beneAccNo : '', y:125},
        { type: 'text', value:this.toAccountDetails[0].aliasName ? this.toAccountDetails[0].aliasName : '', y:135},
        { type: 'text', value: currencyFormatPipeFilter.transform(this.exeDetailsObj.amt, this.debitCcy) + ' ' + this.debitCcy ?  currencyFormatPipeFilter.transform(this.exeDetailsObj.amt, this.debitCcy) + ' ' + this.debitCcy : '', y:145},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:155},
        { type: 'text', value: this.refNo ? this.refNo : '', y:155},
        { type: 'heading', value:this.translateService.instant('LBL_WITHIN_BNK_TRSGR_IS_INT_SUCCESS'), y:165},

      ]
      
      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'withInBankTransfer.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'withInBankTransfer.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);

  }
  getAuthType(val: any) {
    this.authType = val
  }
}
