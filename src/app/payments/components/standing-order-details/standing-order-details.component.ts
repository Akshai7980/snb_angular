import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PaymentsServiceService } from '../../services/payments-service.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { amountUnFormat } from 'src/app/utility/amount-unformat';

const PAYMENT_SUB_PRODUCT = 'BKSIBT';
const PAYMENT_FUNCTION_CODE = 'CRIBT';

@Component({
  selector: 'app-standing-order-details',
  templateUrl: './standing-order-details.component.html',
  styleUrls: ['./standing-order-details.component.scss'],
})
export class StandingOrderDetailsComponent implements OnInit {
  isLoadingComplete: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;

  fromAccountsObject: any;
  selectedFromAccount: any=[];
  toAccountsObject: any;
  selectedToAccount: any=[];
  url:string='';
  shownSearchFlag: boolean = true;
  showReceiptForm: boolean = false;
  clearFlag: boolean = false;

  showToAccounts: boolean = false;
  loadForm: boolean = false;
  showAmountDetailsForm = true;
  isReviewScreen = false;
  showAuthorization = false;
  showAuthentication = false;
  paymentFrequencies = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  paymentEndOptions = ['Expiry Date', 'Number of Instances'];
  authError: string = '';
  otpError: string = '';
  showStandingInstructionsForm: boolean = true;
  amountValidationFlag:boolean=false
  amountTransferCurrencies: string[] = [];
  paymentAmtObj: any = {
    amount: '',
    currency: '',
    amountError: '',
    currencyError: '',
    exchangeRate: '',
    fee: '',
    vat: '',
    ccy: '',
    debitAmount: '',
    debitCurrency: '',
  };
  authorsList = [];
  relationshipArray: string[] = [];
  purposeOfTransfer: string[] = [];
  showAdditionalDetailsForm: boolean = true;
  additionalDetailsErrorObj: any = {
    purposeError: '',
    relationshipError: '',
  };
  standingInstructionsObject = {
    frequency: '',
    frequencyError: '',
    paymentStartDate: '',
    paymentStartDateError: '',
    paymentEndOnWith: 'Expiry Date',
    paymentEndError: '',
    paymentEndDate: '',
    paymentEndDateError: '',
    numberOfInstances: '',
    numberOfInstancesError: '',
  };

  standingInstructionDetails = {
    standingInstructions: {
      frequency: '',
      paymentStartDate: '',
      paymentEnd: '',
      paymentEndDate: '',
      numberOfInstances: 0,
    },
    amountDetails: {
      transferAmount: '',
      transferCurrency: '',
    },
    additionalDetails: {
      purpose: '',
      purposeCode: '',
      subPurpose: '',
      subPurposeCode: '',
      relationship: '',
      relationshipCode: '',
      categoryCode: '',
      narration: '',
    },
  };
  receiptData: any;
  isFormObjectValid: boolean = true;
  authorizeDetails: any;
  dataSourceDailyLimit: any;
  fee: any;
  vat: any;
  otpDetails: any;
  secAuthRef: any;
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
  transactionType: any;
  transactionInputType: any;
  paymentCurrency: any;
  paymentAmount: any;
  paymentCurrencyForRecipt: any;
  debitCcy: any;
  paymentSubProduct: string = "RECPAY";
  paymentFunctionCode: string = "RECUR";
  debAmt: any;
  ccyCode: any;
  exchangeStatus: any;
  checkExchangeRateValidationFlag: boolean = false;
  disable: boolean = false;
  rateRefNo: any;
  authType: any;
  saveReceiptObject: any;
  debitData: any;
  beneData: any =[];
  rejectMsg: boolean = false;
  purposeCode :string ='';
  relationshipCode :string='';
  BeneClearFlag: boolean = false;
  amendEnabled : boolean = false;
    // For diable button for amend 
  disabledbutton : boolean = false;
  narrationDetailsshown:boolean = false;
  isDownArrowNotRequired = false;
  showInstruction:string='';
  setnarationvalue:string='';
  constructor(
    private translateService: TranslateService,
    private readonly router: Router,
    private readonly paymentService: PaymentsServiceService,
    private readonly datePipe: DatePipe,
    private downloadAsPdf:downloadAsPdf
  ) {
    this.rootScopeData.paymentActiveTabName = 'BKSIBT';
  }

  ngOnInit(): void {
    if (this.rootScopeData.withinBankSITransactionObject.amend === "Y") {
      this.isLoadingComplete = true;
      this.rootScopeData.changeHeading = "LBL_STANDING_ORDERS";
      this.rootScopeData.hideTabs = true;
      this.amendEnabled = this.disabledbutton  = true;
      this.getClonePaymentDebitAccount();
      this.rootScopeData.changeHeading = 'LBL_REVIEW';    
      this.showInstruction = "Y";
      this.isDownArrowNotRequired = true;
    }
    else{
      this.getFromAccounts('PMTACCLKPSI');
      this.isDownArrowNotRequired = false;
    }
    
    this.url = systemproperty.termsAndConditionsForPayments;
  }

  getFromAccounts(transferModuleId: string): void {
    this.isLoadingComplete = false;
    this.paymentService
      .getPaymentDebitAccountApiCall({ moduleId: transferModuleId })
      .subscribe(
        (response: any) => {
          this.isLoadingComplete = true;
          for (let i in response.DATA.ALL_RECORDS) {
            let crntAvail_amount = response.DATA.ALL_RECORDS[i].CURR_AVAIL_BAL_AMT;
            let convtd_ccy = response.DATA.ALL_RECORDS[i].OD_CCY_CODE;
            let convtd_amount = '';
            if (crntAvail_amount && convtd_ccy) {
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
              response.DATA.ALL_RECORDS[i].CURR_AVAIL_BAL_AMT = convtd_amount;
              response.DATA.ALL_RECORDS[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
            }
          }
          this.fromAccountsObject = this.generateTableObject(
            'LBL_FROM',
            response.DATA.ALL_RECORDS,
            [
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'OD_ACC_NAME',
              },
              {
                dispKey: 'LBL_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
                dataKeySupport: 'OD_CCY_CODE',
              },
            ]
          );
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  generateTableObject(tableTitle: string, data: any, fieldDetails: any): any {
    return {
      title: tableTitle,
      data: data,
      fieldDetails: fieldDetails,
    };
  }

  onFromAccountSelection(account: any | string): void {
    if(this.rootScopeData.changeHeading === "LBL_REVIEW"){
      return;
    }
    if (typeof account === 'string' && account === 'iconClick') {
      this.rootScopeData.hideTabs = false;
      this.showToAccounts = false;
      this.selectedToAccount = [];
      this.selectedFromAccount = [];
      this.resetData();
      this.clearFlag = false;
    } else {
      this.showToAccounts = true;
      this.rootScopeData.hideTabs = true;
      this.selectedFromAccount[0] = account;
      this.getDailyLimit();
      this.getToAccounts(account);
    }
  }

  getToAccounts(account: any | string): void {

    if (account) {
      this.paymentService
        .getPaymentBeneAccountApiCall({
          debitUnitId:
            this.selectedFromAccount[0] && this.selectedFromAccount[0].UNIT_ID
              ? this.selectedFromAccount[0].UNIT_ID
              : '',
          debitCifNo:
            this.selectedFromAccount[0] && this.selectedFromAccount[0].COD_CORECIF
              ? this.selectedFromAccount[0].COD_CORECIF
              : '',
          subProduct: PAYMENT_SUB_PRODUCT ? PAYMENT_SUB_PRODUCT : '',
          functionCode: PAYMENT_FUNCTION_CODE ? PAYMENT_SUB_PRODUCT : '',
        })
        .subscribe((response: any) => {
          this.toAccountsObject = this.generateTableObject(
            'LBL_TO',
            response.data,
            [
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'beneId',
              },
              {
                dispKey: 'LBL_ACC_IBAN_NO',
                dataKey: 'beneAccNo',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'beneaccName',
              },
              {
                dispKey: 'LBL_BANK_NAME',
                dataKey: 'bankName',
              },
              {
                dispKey: 'LBL_STATUS',
                dataKey: 'callBackStatus',
              },
            ]
          );
        });
    }
  }

  onToAccountSelection(account: any | string): void {
    if(this.rootScopeData.changeHeading === "LBL_REVIEW"){
      return;
    }
    this.BeneClearFlag = false;
    let beneAccNo = account && account.beneAccNo ? account.beneAccNo : "";
    let debitAccNo = this.selectedFromAccount && this.selectedFromAccount[0].OD_ACC_NO ? this.selectedFromAccount[0].OD_ACC_NO : "";
    if (typeof account === 'string' && account === 'iconClick') {
      this.resetData();
      this.selectedToAccount = [];
    } else {

      if (debitAccNo === beneAccNo) {
        this.BeneClearFlag = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_SAME_ACCOUNT";
        return;
      }
      this.selectedToAccount = [];
      this.selectedToAccount[0] = account;
      this.loadForm = true;

      this.getCurrencies(account);

      this.setAdditionalDetailsForm();
    }
  }

  getCurrencies(account: any): void {
    this.amountTransferCurrencies = [];
    let debitCcy =
      this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_CCY_CODE
        ? this.selectedFromAccount[0].OD_CCY_CODE
        : '';
    let beneCcy = account && account.debitCcy ? account.debitCcy : '';
    if (debitCcy && beneCcy && debitCcy !== beneCcy) {
      this.amountTransferCurrencies.push(debitCcy, beneCcy);
    } else {
      this.amountTransferCurrencies.push(debitCcy);
    }
    this.paymentAmtObj.currency =
      this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_CCY_CODE
        ? this.selectedFromAccount[0].OD_CCY_CODE
        : '';
  }

  setAdditionalDetailsForm(): void {
    this.getPurpose();
  }

  getPurpose(): void {
    this.isLoadingComplete = false;
    this.paymentService
      .getPurposeOfTransferApiCall({
        subProduct: PAYMENT_SUB_PRODUCT,
        functionCode: PAYMENT_FUNCTION_CODE,
      })
      .subscribe(
        (response: any) => {
          if (response && response.data) {
            this.purposeOfTransfer = response.data;
            this.isLoadingComplete = true;
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  setPurpose(purpose: any): void {
    this.standingInstructionDetails.additionalDetails.purposeCode =
      purpose.purposeCode;
    this.standingInstructionDetails.additionalDetails.purpose = purpose.purpose;
    this.standingInstructionDetails.additionalDetails.subPurposeCode =
      purpose.subPurposeCode;
    this.standingInstructionDetails.additionalDetails.subPurpose =
      purpose.subPurpose;
    this.standingInstructionDetails.additionalDetails.categoryCode =
      purpose.categoryCode;
    this.getRelationship();
    if(this.rootScopeData.withinBankSITransactionObject.amend === "Y"){
      this.disabledbutton = false;
    }  
  }

  getRelationship(): void {
    this.isLoadingComplete = false;
    const purposeDetails = this.standingInstructionDetails.additionalDetails;
    this.paymentService
      .getRelationshipApiCall({
        debitUnitId:
          this.selectedFromAccount[0] && this.selectedFromAccount[0].UNIT_ID
            ? this.selectedFromAccount[0].UNIT_ID
            : '',
        purposeCode: purposeDetails.purposeCode
          ? purposeDetails.purposeCode
          : '',
        subPurposeCode: purposeDetails.subPurposeCode
          ? purposeDetails.subPurposeCode
          : '',
        categoryCode: purposeDetails.categoryCode
          ? purposeDetails.categoryCode
          : '',
      })
      .subscribe(
        (relations: any) => {
          if (relations && relations.data) {
            this.relationshipArray = relations.data;
            this.isLoadingComplete = true;
          }
        },
        (error) => {
          this.isLoadingComplete = true;
        }
      );
  }

  setRelationshipCode(relation: string): void {
    this.standingInstructionDetails.additionalDetails.relationship = relation;
    if(this.rootScopeData.withinBankSITransactionObject.amend === "Y"){
      this.disabledbutton = false;
    }  
  }

  setAdditionalDetails(details: any): void {
    this.standingInstructionDetails.additionalDetails.purposeCode =
      details.purposeCode;
    this.standingInstructionDetails.additionalDetails.relationshipCode =
      details.relationShipCode;
    this.standingInstructionDetails.additionalDetails.narration =
      details.narration;
  }

  amountDetailsTransferAmount(transferAmountDetails: any): void { 
    const amount = transferAmountDetails.amount.trim();
    this.paymentAmount = transferAmountDetails.amount.trim();
    this.paymentCurrencyForRecipt = transferAmountDetails.currency;
    this.debitCcy = this.selectedFromAccount[0]  && this.selectedFromAccount[0].OD_CCY_CODE ? this.selectedFromAccount[0].OD_CCY_CODE : "";
    this.paymentCurrency = this.selectedToAccount[0] && this.selectedToAccount[0].debitCcy ? this.selectedToAccount[0].debitCcy : "";
    if (amount) {
      this.paymentAmtObj.amountError = '';       

      this.paymentAmtObj.amount =
        this.standingInstructionDetails.amountDetails.transferAmount =
          this.transformAmount(amount, transferAmountDetails.currency);

      this.standingInstructionDetails.amountDetails.transferCurrency =
        transferAmountDetails.currency;

        let debitCcyCode = this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_CCY_CODE ? this.selectedFromAccount[0].OD_CCY_CODE : "";
          if (this.paymentCurrency && this.paymentCurrency != debitCcyCode) {
            this.transactionType = "CREDIT";
            this.transactionInputType = "INPUT_CREDIT_AMOUNT";
            this.getExchangeRate();  
                       
          }else {
            this.paymentAmtObj.exchangeRate = "";
            this.transactionType = "DEBIT";
            this.transactionInputType = "INPUT_DEBIT_AMOUNT";

            if(Number(amount) < Number(amountUnFormat(this.selectedFromAccount[0].CURR_AVAIL_BAL_AMT))){
              this.amountValidationFlag = false; 
            }
            else{
              this.amountValidationFlag = true;
              this.paymentAmtObj.amountError = 'LBL_INSUFFICIENT_BALANCE';
            }
          }
        
    } else {
      this.paymentAmtObj.amountError = 'LBL_PROVIDE_VALID_AMOUNT';
    }
    if(this.rootScopeData.withinBankSITransactionObject.amend === "Y"){
      this.disabledbutton = false;
    }
  }

  getExchangeRate() {    
    this.isLoadingComplete = false;
    let debitCcyCode =this.selectedFromAccount[0] &&this.selectedFromAccount[0].OD_CCY_CODE ? this.selectedFromAccount[0].OD_CCY_CODE : "";
   //debugger;
    if(debitCcyCode != this.paymentCurrency){
      this.transactionType = "CREDIT";
      this.transactionInputType = "INPUT_CREDIT_AMOUNT";
    }else{
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
    }
    let reqObj = {
      transactionType:"",
      transactionInputType:"",
      paymentAmount:"",
      debitCountryCode:"",
      debitCifNo:"", 
      debitAccNo:"",
      debitCurrencyCode:"",
      beneCurrencyCode:"",
      debitUnitId:"",
      paymentCurrency:"",
      subProduct:"",
      functionCode:""
    }
    reqObj.transactionType = this.transactionType ? this.transactionType : "";
    reqObj.transactionInputType = this.transactionInputType ? this.transactionInputType : "";
    reqObj.paymentAmount = this.paymentAmount ? this.paymentAmount : "";
    reqObj.debitCountryCode =this.selectedFromAccount[0] &&this.selectedFromAccount[0].REQ_COUNTRY_CODE ?this.selectedFromAccount[0].REQ_COUNTRY_CODE : "";
    reqObj.debitCifNo =this.selectedFromAccount[0] &&this.selectedFromAccount[0].COD_CORECIF ?this.selectedFromAccount[0].COD_CORECIF : "";
    reqObj.debitAccNo =this.selectedFromAccount[0] &&this.selectedFromAccount[0].OD_ACC_NO ?this.selectedFromAccount[0].OD_ACC_NO : "";
    reqObj.debitCurrencyCode =this.selectedFromAccount[0] &&this.selectedFromAccount[0].OD_CCY_CODE ?this.selectedFromAccount[0].OD_CCY_CODE : "";
    reqObj.beneCurrencyCode = this.selectedToAccount[0] && this.selectedToAccount[0].debitCcy ? this.selectedToAccount[0].debitCcy : "";
    reqObj.debitUnitId = this.selectedFromAccount[0]  && this.selectedFromAccount[0].UNIT_ID ? this.selectedFromAccount[0].UNIT_ID : "";
    reqObj.paymentCurrency = this.paymentCurrency ? this.paymentCurrency : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";

    this.paymentService.getExchangeRateApiCall(reqObj).subscribe((response: any) => {
        if(response){
          this.isLoadingComplete = true;
          this.paymentAmtObj.exchangeRate = response.data && response.data[0] && response.data[0].conversionMessage ? response.data[0].conversionMessage : "";
          this.paymentAmtObj.debitAmount = response.data && response.data[0] && response.data[0].paymentAmt ? response.data[0].paymentAmt : "";
          this.paymentAmtObj.debitCurrency = response.data && response.data[0] && response.data[0].creditCcy ? response.data[0].creditCcy : "";
          this.rateRefNo = response.data && response.data[0] && response.data[0].rateRefNo ? response.data[0].rateRefNo : "";          
          // this.debAmt = this.paymentAmtObj.debitAmount;
          // this.ccyCode = this.paymentAmtObj.debitCurrency;
          this.debAmt = response.data && response.data[0] && response.data[0].targetAmount ? response.data[0].targetAmount : "";
          this.ccyCode = this.paymentCurrencyForRecipt;
          
          if(Number(this.debAmt) < Number(amountUnFormat(this.selectedFromAccount[0].CURR_AVAIL_BAL_AMT))){
            this.amountValidationFlag = false; 
          }
          else{
            this.amountValidationFlag = true;
            this.paymentAmtObj.amountError = 'LBL_INSUFFICIENT_BALANCE';
          }

          this.exchangeStatus="S";
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
        this.isLoadingComplete = true;
        this.paymentAmtObj.exchangeRate = "";
        this.exchangeStatus="F"
        this.disable = true
        this.checkExchangeRateValidationFlag = false
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_FETCH_THE_RATES";
      }
    )
  }

  transformAmount(amount: string, currency: string): string {
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    return currencyFormatPipeFilter.transform(amount, currency);
  }

  amountDetailsCurrency(transferAmountDetails: any): void {
    this.paymentAmtObj.exchangeRate = "";
    this.amountDetailsTransferAmount(transferAmountDetails);
  }

  resetData(){
    this.loadForm = false;
    this.paymentAmtObj = {
      amount: '',
      currency: '',
      amountError: '',
      currencyError: '',
      exchangeRate: '',
      fee: '',
      vat: '',
      ccy: '',
      debitAmount: '',
      debitCurrency: '',
    };
    this.relationshipArray = [];
    this.purposeOfTransfer = [];
    this.standingInstructionsObject = {
      frequency: '',
      frequencyError: '',
      paymentStartDate: '',
      paymentStartDateError: '',
      paymentEndOnWith: 'Expiry Date',
      paymentEndError: '',
      paymentEndDate: '',
      paymentEndDateError: '',
      numberOfInstances: '',
      numberOfInstancesError: '',
    };
  }

  cancel() {
    if (this.rootScopeData.withinBankSITransactionObject) {
      this.router.navigate(['transactionInquiry/standingOrder']);
    } else {
      this.rootScopeData.hideTabs = false;
      this.showToAccounts = false;
      this.selectedToAccount = [];
      this.selectedFromAccount = [];
      this.clearFlag = true;
      this.isReviewScreen = false;
      this.rootScopeData.changeHeading = 'LBL_STANDING_ORDERS';
      this.resetData();
      this.getFromAccounts('PMTACCLKPSI');
    }
    
  }

  proceedToReview(): void {
    if (this.checkIfFormsValid()) {
      this.isReviewScreen = true;
      this.showAmountDetailsForm = false;
      this.showAdditionalDetailsForm = false;
      this.showStandingInstructionsForm = false;
      this.rootScopeData.changeHeading = 'LBL_REVIEW';
      this.initReqParam.accNo=this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_ACC_NO?this.selectedFromAccount[0].OD_ACC_NO:"";
      this.initReqParam.amt=this.standingInstructionDetails &&this.standingInstructionDetails.amountDetails.transferAmount?this.standingInstructionDetails.amountDetails.transferAmount:"0";
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode='RECPAY';
      this.initReqParam.cif=this.selectedFromAccount[0] && this.selectedFromAccount[0].COD_CORECIF?this.selectedFromAccount[0].COD_CORECIF:"";
      this.initReqParam.unitId=this.selectedFromAccount[0] && this.selectedFromAccount[0].UNIT_ID?this.selectedFromAccount[0].UNIT_ID:"";
      
      this.checkSecondFactorAuth();
      this.getRequiredData();
    }
  }

  setAuthorDetails(authorDetails: any): void {
    this.authorizeDetails = authorDetails;
  }

  onSecondFactorAuth(details: any): void {
    this.secAuthRef = details.data.secfRefNo;
  }

  getOtpValue(otpDetails: any): void {
    // this.otpDetails = otpDetails;
    if (otpDetails) {
      this.otpError = "";
      this.otpDetails = otpDetails;
      this.onSubmitReceipt();
    } else {
      this.otpDetails = "";
    }
  }

  modify(): void {
    this.isReviewScreen = false;
    this.showAmountDetailsForm = true;
    this.showAdditionalDetailsForm = true;
    this.showStandingInstructionsForm = true;
    this.rootScopeData.changeHeading = 'LBL_STANDING_ORDERS';
    this.otpDetails = undefined;
    this.authorizeDetails = {};
  }

  onSubmitReceipt(): void {
    let isOtpValid = true;
    this.isFormObjectValid = true;

    // if (!this.otpDetails) {
    //   this.isFormObjectValid = false;
    //   this.otpError = 'LBL_PLS_ENTER_OTP';
    // }
    if (this.showAuthentication ) {
      if (!this.otpDetails || this.otpDetails.length !== 4) {
        this.otpError = "LBL_PLS_ENTER_OTP";
        this.isFormObjectValid = false;
        isOtpValid = false;
        return;
      }
    }
    if (this.isFormObjectValid) {
      this.isLoadingComplete = false;
      this.paymentService
        .siSubmitTransfer(this.generateRequestPayloadForSubmit())
        .subscribe(
          (response: any) => {
            if (response) {
              if (response.dataValue.OD_STATUS_DESC === 'Failed') {
                this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
                // this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
                this.isLoadingComplete = true;
              } else {
                this.rootScopeData.changeHeading = '';
                this.refNo = response.dataValue.INPUT_REFERENCE_NO;
                this.constructReceipt(response.dataValue.INPUT_REFERENCE_NO, response.dataValue);
                this.isLoadingComplete = true;
                this.resetData();
                this.showReceiptForm = true;
              }
            }
          },
          () => {
            this.isLoadingComplete = true;
          }
        );
    }
  }

  constructReceipt(referenceNumber: string,data:any): void {
    if (this.rootScopeData.withinBankSITransactionObject.amend === "Y") {
      referenceNumber =  this.rootScopeData.withinBankSITransactionObject.siBookingRefNo;
    }

    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.selectedFromAccount[0],{USER_ID:userId});

    let flexiAuth = {
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey: this.authorizeDetails && this.authorizeDetails.selectedAprover && this.authorizeDetails.selectedAprover.AUTH_NAME ? this.authorizeDetails.selectedAprover.AUTH_NAME : 'Not Provided',
        },
        {
          dispKey: 'LBL_NOTES_NEXT_APROVER',
          dataKey:
          this.authorizeDetails && this.authorizeDetails.selectedAprover && this.authorizeDetails.aproveNote ? this.authorizeDetails.aproveNote : 'Not Provided' ,
        },
      ],
    }

    this.rejectMsg=false;
    var message1 :any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    // let journalId :any;
    let checkAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
      // journalId = data.JOURNAL_ID;
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
      msg1: message1,
      // msg2: 'LBL_WITHIN_BNK_TRSGR_PENDNG_FR_ARROVAL_MSG',
      msg2: message2,
      referenceNumber: referenceNumber,
      rejectReason: rejectReasonFromAPi ? rejectReasonFromAPi : "",
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'true',
          data: this.selectedFromAccount,
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: 'USER_ID',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'OD_ACC_NO',
            },
            {
              dispKey: 'LBL_SHORT_NAME',
              dataKey: 'ALIAS_NAME',
            },
          ],
        },
        {
          title: 'LBL_TO',
          isTable: 'true',
          data: this.selectedToAccount,
          fieldDetails: [
            {
              dispKey: 'LBL_BENEFICIARY',
              dataKey: 'beneaccName',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'beneAccNo',
            },
            {
              dispKey: 'LBL_SHORT_NAME',
              dataKey: 'aliasName',
            },
          ],
        },
        {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_DEBIT_AMT',
              dataKey: `${this.standingInstructionDetails.amountDetails.transferAmount} ${this.standingInstructionDetails.amountDetails.transferCurrency}`,
            },
          ],
        },
        
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_INITIATE_ANOTHER_REQUEST',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
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
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.selectedFromAccount[0].USER_ID ? this.selectedFromAccount[0].USER_ID : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.selectedFromAccount[0].OD_ACC_NO ? this.selectedFromAccount[0].OD_ACC_NO : "--"
        },
        {
          "subHead": "Short Name",
          "subValue": this.selectedFromAccount[0].ALIAS_NAME ? this.selectedFromAccount[0].ALIAS_NAME :"--"
        },
        {
          "subHead": "To",
          "subValue": ""
        },
        {
          "subHead": "Beneficiary",
          "subValue": this.selectedToAccount[0].aliasName ? this.selectedToAccount[0].aliasName : "--"
        },
        {
          "subHead": "To Account Number",
          "subValue": this.selectedToAccount[0].beneAccNo ? this.selectedToAccount[0].beneAccNo : "--"
        },
        {
          "subHead": 'To Short Name',
          "subValue": this.selectedToAccount[0].aliasName ? this.selectedToAccount[0].aliasName : "--"
        },
        {
          "subHead": "Debit Amount",
          "subValue": `${this.standingInstructionDetails.amountDetails.transferAmount} ${this.standingInstructionDetails.amountDetails.transferCurrency}`
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        }
      ],
      "pagecall":"payments",
      "refNo":referenceNumber
    }
  }

  getDailyLimit() {
    this.isLoadingComplete = false;
    const today = new Date();
    const currentDate =
      '' +
      today.getDate().toString().padStart(2, '0') +
      '/' +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      today.getFullYear();

    let reqObj = {
      debitCountryCode:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].REQ_COUNTRY_CODE
          ? this.selectedFromAccount[0].REQ_COUNTRY_CODE
          : '',
      debitUnitId:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].UNIT_ID
          ? this.selectedFromAccount[0].UNIT_ID
          : '',
      debitAvailableBalance:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].CURR_AVAIL_BAL_AMT
          ? this.selectedFromAccount[0].CURR_AVAIL_BAL_AMT
          : '',
      debitCurrencyCode:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_CCY_CODE
          ? this.selectedFromAccount[0].OD_CCY_CODE
          : '',
      debitCifNo:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].COD_CORECIF
          ? this.selectedFromAccount[0].COD_CORECIF
          : '',
      debitPortalAccNo:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_PORTAL_ACC_NO
          ? this.selectedFromAccount[0].OD_PORTAL_ACC_NO
          : '',
      beneAccNo:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].COD_CORECIF
          ? this.selectedFromAccount[0].COD_CORECIF
          : '',
      valueDate: '',
      subProduct: PAYMENT_SUB_PRODUCT,
      functionCode: PAYMENT_FUNCTION_CODE,
    };
    reqObj.valueDate = currentDate ? currentDate : '';
    this.paymentService.getDailyLimitApiCall(reqObj).subscribe(
      (response: any) => {
        if (response) {
          this.isLoadingComplete = true;
          this.dataSourceDailyLimit =
            response.data && response.data[1] ? response.data[1] : '';
          this.rootScopeData.dailyLimit = this.dataSourceDailyLimit;
        }
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }

  generateRequestPayloadForSubmit(): any {
    if(this.rootScopeData.withinBankSITransactionObject.amend === "Y"){ 
    this.standingInstructionDetails.standingInstructions.frequency = this.standingInstructionsObject.frequency;
    this.standingInstructionDetails.standingInstructions.paymentStartDate = this.formatDate(this.standingInstructionsObject.paymentStartDate, 'dd/MM/yyyy');
    this.standingInstructionDetails.standingInstructions.paymentEndDate = this.formatDate(this.standingInstructionsObject.paymentEndDate, 'dd/MM/yyyy');
    this.standingInstructionDetails.standingInstructions.numberOfInstances = parseInt(this.standingInstructionsObject.numberOfInstances);
    this.standingInstructionDetails.additionalDetails.purposeCode = this.rootScopeData?.standingOrderDetails?.details?.purposeCode;
    this.standingInstructionDetails.additionalDetails.categoryCode = this.rootScopeData?.standingOrderDetails?.details?.categoryCode;
    this.standingInstructionDetails.additionalDetails.subPurposeCode = this.rootScopeData?.standingOrderDetails?.details?.subPurposeCode;
    this.standingInstructionDetails.additionalDetails.relationshipCode = this.rootScopeData?.standingOrderDetails?.details?.relationshipCode;
    }
    let details = this.standingInstructionDetails;
    let reqObj: any = {
      moduleId: 'PAYMNTINIT',
      inputAction: 'SAVE_TXN',
      inputTransactStatus: 'RA',
      debitUnitId:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].UNIT_ID
          ? this.selectedFromAccount[0].UNIT_ID
          : '',
      paymentAmount: details.amountDetails.transferAmount,
      payeeType: 'New',
      editmode: '',
      transactionType: this.transactionType ? this.transactionType : "",
      maxIndTxnLimit:
        this.dataSourceDailyLimit && this.dataSourceDailyLimit.maxIndTxnLimit
          ? this.dataSourceDailyLimit.maxIndTxnLimit
          : '',
      usedPayLimit:
        this.dataSourceDailyLimit && this.dataSourceDailyLimit.usedPayLimit
          ? this.dataSourceDailyLimit.usedPayLimit
          : '',
      valueDate: details.standingInstructions.paymentStartDate,
      narration: details.additionalDetails.narration,
      rateRefNo: '',
      chargeAmount: this.fee ? this.fee : '',
      vatAmount: this.vat ? this.vat : '',
      inputVersionNum: 1,
      paymentName: 'Within Bank Transfer',
      subProduct: 'RECPAY',
      functionCode: this.rootScopeData.withinBankSITransactionObject.amend === "Y" ? 'AMNDSI':'RECUR',
      paymentType:'BKSIBT',
      debitAvailableBalance:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].CURR_AVAIL_BAL_AMT
          ? this.selectedFromAccount[0].CURR_AVAIL_BAL_AMT
          : '',
      debitCurrencyCode:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_CCY_CODE
          ? this.selectedFromAccount[0].OD_CCY_CODE
          : '',
      debitCifNo:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].COD_CORECIF
          ? this.selectedFromAccount[0].COD_CORECIF
          : '',
      debitPortalAccNo:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_PORTAL_ACC_NO
          ? this.selectedFromAccount[0].OD_PORTAL_ACC_NO
          : '',
      debitAccName:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_ACC_NAME
          ? this.selectedFromAccount[0].OD_ACC_NAME
          : '',
      debitAccNo:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_ACC_NO
          ? this.selectedFromAccount[0].OD_ACC_NO
          : '',
      debitCountryCode:
        this.selectedFromAccount[0] && this.selectedFromAccount[0].REQ_COUNTRY_CODE
          ? this.selectedFromAccount[0].REQ_COUNTRY_CODE
          : '',
      beneBank:
        this.selectedToAccount[0] && this.selectedToAccount[0].bankName
          ? this.selectedToAccount[0].bankName
          : '',
      beneBranch:
        this.selectedToAccount[0] && this.selectedToAccount[0].debitBranch
          ? this.selectedToAccount[0].debitBranch
          : '',
      beneAccType:
        this.selectedToAccount[0] && this.selectedToAccount[0].beneAccType
          ? this.selectedToAccount[0].beneAccType
          : '',
      beneCountry:
        this.selectedToAccount[0] && this.selectedToAccount[0].beneCntry
          ? this.selectedToAccount[0].beneCntry
          : '',
      beneAccName:
        this.selectedToAccount[0] && this.selectedToAccount[0].beneaccName
          ? this.selectedToAccount[0].beneaccName
          : '',
      beneCurrencyCode:  this.selectedToAccount[0] && this.selectedToAccount[0].debitCcy
      ? this.selectedToAccount[0].debitCcy : '',
      beneAccNo:
        this.selectedToAccount[0] && this.selectedToAccount[0].beneAccNo
          ? this.selectedToAccount[0].beneAccNo
          : '',
      authRuleId:
        this.authorizeDetails &&
        this.authorizeDetails.selectedAprover &&
        this.authorizeDetails.selectedAprover.PARSED_RULE_ID
          ? this.authorizeDetails.selectedAprover.PARSED_RULE_ID
          : '',
      authUserNo:
        this.authorizeDetails &&
        this.authorizeDetails.selectedAprover &&
        this.authorizeDetails.selectedAprover.OD_USER_NO
          ? this.authorizeDetails.selectedAprover.OD_USER_NO
          : '',
      authUserLevel:
        this.authorizeDetails &&
        this.authorizeDetails.selectedAprover &&
        this.authorizeDetails.selectedAprover.OD_LEVEL
          ? this.authorizeDetails.selectedAprover.OD_LEVEL
          : '',
      selectionFlag:
        this.authorizeDetails &&
        this.authorizeDetails.selectedAprover &&
        this.authorizeDetails.selectedAprover.OD_USER_NO
          ? 'Y'
          : 'N',
      userNoList:
        this.authorizeDetails &&
        this.authorizeDetails.selectedAprover &&
        this.authorizeDetails.selectedAprover.OD_USER_NO &&
        this.authorizeDetails.selectedAprover.OD_LEVEL
          ? `${this.authorizeDetails.selectedAprover.OD_USER_NO}%${this.authorizeDetails.selectedAprover.OD_LEVEL}`
          : '',
      approverNote:
        this.authorizeDetails && this.authorizeDetails.aproveNote
          ? this.authorizeDetails.aproveNote
          : '',
      purposeCode: details.additionalDetails.purposeCode
        ? details.additionalDetails.purposeCode
        : '',
      subPurposeCode: details.additionalDetails.subPurposeCode
        ? details.additionalDetails.subPurposeCode
        : '',
      relationshipCode: details.additionalDetails.relationshipCode
        ? details.additionalDetails.relationshipCode
        : '',
      categoryCode : details.additionalDetails.categoryCode? details.additionalDetails.categoryCode:'',
      otp: this.otpDetails ? this.otpDetails : '',
      otpRef: this.secAuthRef ? this.secAuthRef : '',
      siOption: 'Yes',
      frequencyUnit: 1,
      siNoPay: details.standingInstructions.numberOfInstances,
      siPaymentStartDate: details.standingInstructions.paymentStartDate
        ? details.standingInstructions.paymentStartDate
        : '',
      siPaymentEndDate: details.standingInstructions.paymentEndDate
        ? details.standingInstructions.paymentEndDate
        : '',
      frequency: details.standingInstructions.frequency.charAt(0),
      AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': '',
      txnNo : this.rootScopeData.withinBankSITransactionObject.amend === "Y" ? this.rootScopeData.withinBankSITransactionObject.siBookingRefNo : '' ,
      hostRefNo : this.rootScopeData.withinBankSITransactionObject.amend === "Y" ? this.rootScopeData.withinBankSITransactionObject.siBookingRefNo :'',
      summaryCifNo : this.rootScopeData.withinBankSITransactionObject.cifNo


    };
    return reqObj;
  }

  checkSecondFactorAuth() {
    this.isLoadingComplete = false;
    let reqObj = {
      paymentAmount: this.standingInstructionDetails.amountDetails.transferAmount,
      debitCifNo: this.selectedFromAccount[0].COD_CORECIF,
      debitPortalAccNo: this.selectedFromAccount[0].OD_ACC_NO,
      debitCurrencyCode: this.selectedFromAccount[0].OD_CCY_CODE,
      beneCurrencyCode: this.selectedToAccount[0].debitCcy,
      paymentCurrency: this.selectedToAccount[0].debitCcy,
      subProduct: 'RECPAY',
      functionCode: 'RECUR',
      debitUnitId: this.selectedFromAccount.UNIT_ID
    };
    this.paymentService.selfAuthCheck(reqObj).subscribe(
      (response: any) => {
        if (response) {
          this.isLoadingComplete = true;
          if (response.data.selfAuth == 'true') {
            this.showAuthentication = true;
          }
          if (response.data.flexiAuth == 'true') {
            this.showAuthorization = true;
            this.authorsList = response.data.authList;
          }
        }
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }


//Amend Payments Start//
getClonePaymentDebitAccount() {
  this.isLoadingComplete = false;
  let reqObj = {
    moduleId: "PMTACCLKPSI"
  }

  // debugger;
  this.paymentService.getPaymentDebitAccountApiCall({ moduleId: reqObj.moduleId }).subscribe((response: any) => {
    if (response) {
      this.isLoadingComplete = true;
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
      // debugger;
      if (this.rootScopeData.withinBankSITransactionObject.debitAccount) {
        for (let i = 0; i < this.debitData.length; i++) {
          // debugger;
          if (this.rootScopeData.withinBankSITransactionObject.debitAccount === this.debitData[i].OD_ACC_NO) {
            this.selectedFromAccount[0] = this.debitData[i];
            this.getCloneBeneInfo();
          }
        }
      }
      // debugger;
      this.fromAccountsObject = this.generateTableObject(
        'LBL_FROM',
        this.selectedFromAccount,
        [
          {
            dispKey: 'LBL_NICKNAME',
            dataKey: 'ALIAS_NAME',
          },
          {
            dispKey: 'LBL_ACC_NUMBER',
            dataKey: 'OD_ACC_NO',
          },
          {
            dispKey: 'LBL_FULL_NAME',
            dataKey: 'OD_ACC_NAME',
          },
          {
            dispKey: 'LBL_STATUS',
            dataKey: 'STATUS',
          },
          {
            dispKey: 'LBL_BALANCE',
            dataKey: this.rootScopeData.userInfo.maskingFlag ? "HIDDEN" : "CURR_AVAIL_BAL_AMT",
            dataKeySupport: 'OD_CCY_CODE',
          },
        ]
      );
    }
  }, error => {
    this.isLoadingComplete = true;
  });
}


getCloneBeneInfo() {
  this.isLoadingComplete = false;
  let reqObj = {
    debitUnitId:"",
    debitCifNo:"",
    subProduct:"",
    functionCode:""
  }
  reqObj.debitUnitId = this.selectedFromAccount && this.selectedFromAccount[0] && this.selectedFromAccount[0].UNIT_ID ? this.selectedFromAccount[0].UNIT_ID : "";
  reqObj.debitCifNo = this.selectedFromAccount && this.selectedFromAccount[0] && this.selectedFromAccount[0].COD_CORECIF ? this.selectedFromAccount[0].COD_CORECIF : "";
  reqObj.subProduct = PAYMENT_SUB_PRODUCT ? PAYMENT_SUB_PRODUCT : '',
  reqObj.functionCode = PAYMENT_FUNCTION_CODE ? PAYMENT_SUB_PRODUCT : '',

  this.paymentService.getPaymentBeneAccountApiCall(reqObj).subscribe((response: any) => {
    if(response){
      this.showToAccounts = true;
      this.isLoadingComplete = true;
      this.beneData = response.data;
      let isBeneAccountExist  = false;
      for (let i = 0; i < this.beneData.length; i++) {
        // debugger;
        if (this.rootScopeData.withinBankSITransactionObject.benefAcNo === this.beneData[i].beneAccNo) {
          this.selectedToAccount[0] = this.beneData[i];
          isBeneAccountExist = true;
          break;
        }
      }
      if(!isBeneAccountExist){
        return;
      }
      this.toAccountsObject = {
        "title": "LBL_TO",
        "data": this.selectedToAccount,
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
    let debitCcy = this.selectedFromAccount && this.selectedFromAccount[0] && this.selectedFromAccount[0].OD_CCY_CODE ? this.selectedFromAccount[0].OD_CCY_CODE : "";
    let beneCcy = this.selectedToAccount && this.selectedToAccount[0] && this.selectedToAccount[0].debitCcy ? this.selectedToAccount[0].debitCcy : "";
    this.amountTransferCurrencies = [];
    this.amountTransferCurrencies.push(debitCcy)
    this.loadForm = true;
    this.paymentAmtObj.amount =  this.rootScopeData.withinBankSITransactionObject.siAmt.trim();
    this.paymentAmtObj.currency = debitCcy;
    if(this.paymentAmtObj.amount){
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      this.standingInstructionDetails.amountDetails.transferAmount = currencyFormatPipeFilter.transform(this.paymentAmtObj.amount.trim(), this.paymentAmtObj.currency?this.paymentAmtObj.currency:"SAR");
      this.standingInstructionDetails.amountDetails.transferCurrency = this.paymentAmtObj.currency ? this.paymentAmtObj.currency : "";
    }
    // this.paymentDetailsReceived(this.paymentAmtObj);

    this.amountTransferCurrencies = [];   
    if (debitCcy && beneCcy && debitCcy !== beneCcy) {
      this.amountTransferCurrencies.push(debitCcy, beneCcy);
    } else {
      this.amountTransferCurrencies.push(debitCcy);
    }

    // debugger;
    // this.rootScopeData.localSITransactionObject

    // this.paymentAmtObj.currency =
    //   this.selectedFromAccount && this.selectedFromAccount.OD_CCY_CODE
    //     ? this.selectedFromAccount.OD_CCY_CODE
    //     : '';
    
    let frequencyCode = this.rootScopeData.standingOrderDetails.details.payevery;
    let frequencyType ='';
    if(frequencyCode === 'D'){
       frequencyType = 'Daily'
    }
    else if(frequencyCode === 'W'){
     frequencyType = 'Weekly'
    }
    else if(frequencyCode === 'M'){
     frequencyType = 'Monthly'
    }
    else if(frequencyCode === 'Y'){
     frequencyType = 'Yearly'
    }

    this.getPurpose();
    this.standingInstructionsObject.frequency = frequencyType
    let amendStartDate = '';
    amendStartDate = this.rootScopeData.withinBankSITransactionObject.firstPymtDat;
    let amendLastDate = '';
    amendLastDate = this.rootScopeData.withinBankSITransactionObject.lastPymtDt;
    this.standingInstructionsObject.paymentStartDate= amendStartDate
    this.standingInstructionsObject.paymentEndDate = amendLastDate
    this.purposeCode = this.rootScopeData.standingOrderDetails.details.purposeDesc;
    this.setnarationvalue = this.rootScopeData.standingOrderDetails.details.narration;
    this.standingInstructionsObject.numberOfInstances = this.rootScopeData.withinBankSITransactionObject.numberOfInstances;
    this.relationshipCode = this.rootScopeData.standingOrderDetails.details.relationshipCodeDesc;
    this.standingInstructionDetails.additionalDetails.relationship = this.rootScopeData.standingOrderDetails.details.relationshipCodeDesc; 
    this.standingInstructionDetails.additionalDetails.purposeCode = this.rootScopeData.standingOrderDetails.details.purposeCode;
    this.standingInstructionDetails.additionalDetails.relationshipCode = this.rootScopeData.standingOrderDetails.details.relationShipCode;      
    this.standingInstructionDetails.additionalDetails.purpose = this.rootScopeData.standingOrderDetails.details.purposeDesc;
    this.standingInstructionDetails.additionalDetails.subPurposeCode = this.rootScopeData.standingOrderDetails.details.subPurposeCode;
    this.standingInstructionDetails.additionalDetails.categoryCode = this.rootScopeData.standingOrderDetails.details.categoryCode;
    this.getRelationship();
    
    
    }    
  }, error => {
    
    this.isLoadingComplete = true;
   })
}
//Amend Payments End



  getRequiredData(): void {
    this.isLoadingComplete = false;
    this.paymentService
      .getChargesApiCall({
        paymentAmount: this.standingInstructionDetails.amountDetails
          .transferAmount
          ? this.standingInstructionDetails.amountDetails.transferAmount
          : '',
        debitUnitId:
          this.selectedFromAccount && this.selectedFromAccount.UNIT_ID
            ? this.selectedFromAccount.UNIT_ID
            : '',
        debitCifNo:
          this.selectedFromAccount && this.selectedFromAccount.COD_CORECIF
            ? this.selectedFromAccount.COD_CORECIF
            : '',
        debitPortalAccNo:
          this.selectedFromAccount && this.selectedFromAccount.OD_PORTAL_ACC_NO
            ? this.selectedFromAccount.OD_PORTAL_ACC_NO
            : '',
        paymentCurrency: this.standingInstructionDetails.amountDetails
          .transferCurrency
          ? this.standingInstructionDetails.amountDetails.transferCurrency
          : '',
        subProduct: PAYMENT_SUB_PRODUCT,
        functionCode: PAYMENT_FUNCTION_CODE,
      })
      .subscribe(
        (response: any) => {
          if (response && response.data) {
            this.isLoadingComplete = true;
            this.fee =
              response.data[0] &&
              response.data[0].chargeInfo &&
              response.data[0].chargeInfo[0] &&
              response.data[0].chargeInfo[0].charge
                ? response.data[0].chargeInfo[0].charge
                : '';
            this.vat =
              response.data[0] &&
              response.data[0].chargeInfo &&
              response.data[0].chargeInfo[0] &&
              response.data[0].chargeInfo[0].tax
                ? response.data[0].chargeInfo[0].tax
                : '';
            const ccy =
              response.data[0] &&
              response.data[0].chargeInfo &&
              response.data[0].chargeInfo[0] &&
              response.data[0].chargeInfo[0].ccy
                ? response.data[0].chargeInfo[0].ccy
                : '';
            if (
              this.standingInstructionDetails.amountDetails.transferAmount &&
              this.fee &&
              this.vat &&
              ccy
            ) {
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              this.paymentAmtObj.fee = currencyFormatPipeFilter.transform(
                this.fee,
                ccy
              );
              this.paymentAmtObj.vat = currencyFormatPipeFilter.transform(
                this.vat,
                ccy
              );
              this.paymentAmtObj.ccy = ccy;
            }
          }
        },
        (error) => {
          this.isLoadingComplete = true;
        }
      );
  }

  checkIfFormsValid(): boolean {
    let isValid = true;

    if (!this.standingInstructionsObject.frequency) {
      isValid = false;
      this.standingInstructionsObject.frequencyError = 'LBL_FREQUENCY_ERROR';
    }

    if (!this.standingInstructionsObject.paymentStartDate) {
      isValid = false;
      this.standingInstructionsObject.paymentStartDateError =
        'LBL_PAYMENT_START_DATE_ERROR';
    }

    if (
      this.standingInstructionsObject.paymentEndOnWith === 'Expiry Date' &&
      !this.standingInstructionsObject.paymentEndDate
    ) {
      isValid = false;
      this.standingInstructionsObject.paymentEndDateError =
        'LBL_PAYMENT_END_DATE_ERROR';
    } else if (
      this.standingInstructionsObject.paymentEndOnWith ===
        'Number of Instances' &&
      !this.standingInstructionsObject.numberOfInstances
    ) {
      isValid = false;
      this.standingInstructionsObject.numberOfInstancesError =
        'LBL_VALID_INSTANCE_ERROR';
    }

    if(this.amountValidationFlag){
      isValid = false;
    }
    if (!this.paymentAmtObj.amount) {
      this.paymentAmtObj.amountError = 'LBL_ENTER_TRANSFER_AMOUNT';
      isValid = false;
    }
    if (!this.paymentAmtObj.currency) {
      this.paymentAmtObj.currencyError = 'LBL_PROVIDE_VALID_CURRENCY';
      isValid = false;
    }

    if (!this.standingInstructionDetails.additionalDetails.purpose) {
      this.additionalDetailsErrorObj.purposeError = 'LBL_PLEASE_SELECT_PURPOSE';
      isValid = false;
    }
    if (!this.standingInstructionDetails.additionalDetails.relationship) {
      this.additionalDetailsErrorObj.relationshipError =
        'LBL_PLEASE_SELECT_RELATIONSHIP';
      isValid = false;
    }

    return isValid;
  }

  setStandingInstructions(details: any): void {
    this.standingInstructionDetails.standingInstructions = {
      frequency: details.frequency,
      paymentStartDate: this.formatDate(details.paymentStartDate, 'dd/MM/yyyy'),
      paymentEnd: details.paymentEndOnWith,
      paymentEndDate: this.formatDate(details.paymentEndDate, 'dd/MM/yyyy'),
      numberOfInstances: details.numberOfInstances,
    };
    if(this.rootScopeData.withinBankSITransactionObject.amend === "Y"){
     this.disabledbutton = false;
   }
  }

  formatDate(date: any, format: string): string {
    const formattedDate =
      date && this.datePipe.transform(new Date(date), format);
    return formattedDate ? formattedDate : '';
  }

  initGenerateStatement(): void {
    this.cancel();
    this.showReceiptForm = false;
    this.showToAccounts = false;
    this.loadForm = false;
    this.isReviewScreen = false;
    this.rootScopeData.hideTabs=false;
    this.rootScopeData.changeHeading = 'LBL_STANDING_ORDERS';
  }
  downloadPdf(values:any)
      { 
        let SelectedType = values;
        let amtDetails = this.standingInstructionDetails.amountDetails.transferAmount;
        let amtCcy = this.standingInstructionDetails.amountDetails.transferCurrency;
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_WITHIN_SNB_RECEIPT'), x:80, y:35},
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
        { type: 'text', value:this.selectedFromAccount[0].OD_ACC_NAME ? this.selectedFromAccount[0].USER_ID : '', y:75},
        { type: 'text', value:this.selectedFromAccount[0].OD_ACC_NO ? this.selectedFromAccount[0].OD_ACC_NO : '', y:85},
        { type: 'text', value:this.selectedFromAccount[0].ALIAS_NAME ? this.selectedFromAccount[0].ALIAS_NAME : '', y:95},
        { type: 'text', value:this.selectedToAccount[0].accName? this.selectedToAccount[0].accName : '', y:115},
        { type: 'text', value:this.selectedToAccount[0].beneAccNo? this.selectedToAccount[0].beneAccNo : '', y:125},
        { type: 'text', value:this.selectedToAccount[0].aliasName ? this.selectedToAccount[0].aliasName : '', y:135},
        { type: 'text', value: amtDetails+ ' ' + amtCcy ?  amtDetails+ ' ' + amtCcy  : '', y:145},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:155},
        { type: 'text', value: this.refNo ? this.refNo : '', y:155},
        { type: 'heading', value:this.translateService.instant('LBL_WITHIN_BNK_TRSGR_IS_INT_SUCCESS'), y:165},
      ]

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'withinSNB.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'withinSNB.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
