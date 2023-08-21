import { Component, Input, OnInit} from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PaymentsServiceService } from '../../services/payments-service.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe'
import { ConfigurationManagementService } from 'src/app/configuration-management/services/configuration-management.service';
import { TranslateService } from '@ngx-translate/core';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

import { DatePipe } from '@angular/common';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
 
@Component({
  selector: 'app-fund-transfer-local',
  templateUrl: './fund-transfer-local.component.html',
  styleUrls: ['./fund-transfer-local.component.scss']
})
export class FundTransferLocalComponent implements OnInit {

  paymentName: string = "Own Account Transfer";
  paymentSubProduct: string = "BKSRNT";
  paymentFunctionCode: string = "CRRNTS";
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
  DebitClearFlag=false;

  toAccountDetails: any = [];
  beneAccountDetailsObj: any = {};
  beneData: any =[];
  BeneClearFlag=false;

  showDetails = false;
  initiateScreen = true;
  showAmtDetInitiateScreen = true;
  showAddDetInitiateScreen = true;
  showReceiptForm = false;
  showAuthorization = false;
  showAuthentication = false;
  shownSearchFlag= true;

  adhocBene:boolean = false;
  quickBene:boolean = false;
  
  receiptData: any;
  insufficientError : boolean = true

  paymentCurrency:any;
  paymentAmount:any;
  formattedPaymentAmount:any;
  additionalDetailsObj:any;
  autherizationDetailsObj:any;
  additionalDetailsErrorObj:any={
    purposeError:"",
    relationshipError:"",
    valueDateError:""
  };
  paymentAmtObj:any={
    amount:"",
    currency:"",
    amountError:"",
    currencyError:"",
    exchangeRate:"",
    fee:"",
    vat:"",
    ccy:"",
    debitAmount:"",
    debitCurrency:""
  }
  currentDate:any;
  dataSourcePurpose:any
  dataSourceDailyLimit:any
  secAuthRef:any;
  userOtpValue:any;
  otpError: string = "";
  authError: string = "";
  payeeType: string = "Existing";
  //for Edit
  editmode: string = "";
  //debitCurrency:any;
  exchangeRate:any;

  maxDate = new Date();
  minDate = new Date();
  relationshipArray :any = [];
  RecipientBankArray :any = [];
  purposeOfTransferArray :any =[];
  currencyArray: any = [];
  authListArray: any = [];
  rateRefNo:any;
  chargeAmount:any;
  vatAmount:any;
  verifyQuickTransObj:any
  country: any;
  countryCode: any;
  adhocObj:any={
    adhocIbanNo:"",
    adhocIbanNoError:"",
    adhocFullName:"",
    adhocFullNameError:"",
    adhocCurrency:"",
    adhocBankName:"",
    adhocBranchName:"",
    adhocBankCity:"",
    adhocSwiftCode:""
  };

  quickTransferObj:any={
    quickTransferMenuId:"",
    quickTransferReceipientBank:"",
    quickTransferReceipientBankError:"",
    quickTransferAmount:"",
    quickTransferAmountError:"",
    quickTransferIBAN:"",
    quickTransferMobileNum: "",
    quickTransferNationalID: "",
    quickTransferEmailID: "",
    quickTransferIBANError:"",
    quickTransferMobileNumError: "",
    quickTransferNationalIDError: "",
    quickTransferEmailIDError: "",
    quickTransferBeneName: "",
    quickTransferBeneNameError: "" 
  };
  onNextVerify = false;
  isAccountVerified: boolean = false
  quickTransferMenuList = [
    {
      id: "IBAN",
      values: "LBL_IBAN_VALUE"
    },
    {
      id: "MOB",
      values: "LBL_MOBILE"
    },
    {
      id: "NID",
      values: "LBL_NATIONAL_ID"
    },
    {
      id: "EID",
      values: "LBL_EMAIL_ID"
    }

  ]
  displayLst:any=[]
  purposeCode: any;
  relationShipCode: any;
  proxyDetails = {
    proxyValue: '',
    proxyType: ''
  }
  showProceed: boolean = false;
  showExecutionDetails=false;
  businessDates: any;
  debAmt:any;
  param={
    moduleId:"BUSINESSDAYLIST",
    transactionType:"SARIE"
  }
  exeDateError=false
  exeDetailsObj:any
  chargesParam:any={
    moduleId:"GETFLDDATA",
    txnType:"IMMEDIATE"
  }
feeCharge:any
vatCharge:any
exeCCY:any
ccyCode:any
  purposeData: any;
  //changes added
  isExecutionDetails=true
  proxyResponseAccountDetails = {
    beneAccNo: '',
    beneAccName: ''
  }
  ibanData: any;
  bankverifyError: boolean= false;
  disable=false;
  bankSwiftCode: any;
  disableproceedBtn: boolean = false;
  checkTransferLimit: boolean = false;
  bicCodeForIBAN: any;
  exchangeStatus:any;
  checkExchangeRateValidationFlag:any;
  swiftCode: any;
  checkIsQuickTransfer: boolean = false;
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
  narrationDetailsshown:boolean = true;
  setColmWidth=true;
  enteredDetailsInQuicktransfer: any;
  isQuickTransferSelected: boolean = false;
  QuickTransferLabel: any;
  pdfData: any;
  refNo: any;
  norecordflag: boolean = false;
  noRecordFoundInfoObj!: { msg: string; btnLabel: string; btnLink: string; showBtn: string; showMsg: string; showIcon: string; };
  beneTitleForEmpty: any;
  validProxy :any;
  amountValidationFlag:boolean=false
  checkFlexiAuth: boolean = false;
  showInstruction: string = '';
  authType: any;
  saveReceiptObject: any;
  rejectMsg : boolean = false;
  isHideTimer: boolean = false;
  showVAtandCharges: boolean = false;
  showVAtandChargesFromQT: boolean = false;
  constructor(private translateService: TranslateService,private paymentService: PaymentsServiceService, private readonly configService: ConfigurationManagementService, private downloadAsPdf:downloadAsPdf,private datePipe:DatePipe) {

    this.rootScopeData.lhsActiveComp = 'fundTransfer';
    this.rootScopeData.paymentActiveTabName = 'BKSRNT';
   }

  ngOnInit(): void {
    if (this.rootScopeData.localCloneTransactionObject.clone === "Y") {
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
    this.currentDate = "" + today.getDate().toString().padStart(2, "0") + "/" + (today.getMonth()+ 1).toString().padStart(2, "0")  + "/" + today.getFullYear();
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
      moduleId:"PMTACCLKPDFT"
    }
    this.paymentService.getPaymentDebitAccountApiCall(reqObj).subscribe((response: any) => {
      if(response){
        this.isLoadingCompelete = true;
        this.debitData = response.DATA.ALL_RECORDS;
        for (let i in this.debitData) {         
          let crntAvail_amount = this.debitData[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = this.debitData[i].OD_CCY_CODE;
          let convtd_amount ='';
          if(crntAvail_amount && convtd_ccy){
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
             convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
             this.debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
             this.debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }               
        } 

        // this.debitData.sort((a:any, b:any) => a.CURR_AVAIL_BAL_AMT.localeCompare(b.CURR_AVAIL_BAL_AMT));

        this.debitAccountDetailsObj = {
          "title": "LBL_FROM",
          "data": this.debitData,
          "fieldDetails":[
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
                "dataKeySupport":"OD_CCY_CODE"
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
      if(response && response.data && response.data.length != 0){
        this.showBeneData = true;
        this.isLoadingCompelete = true;
        this.norecordflag = false;
        this.beneData = response.data;
        this.beneAccountDetailsObj = {
          "title": "LBL_TO",
          "data": this.beneData,
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
     })
  }

  afterFromAccountSelection(fromAccount: any) {
  this.ibanData = fromAccount.OD_IBAN_ACC_NO
   this.chargesParam.unitId= fromAccount && fromAccount.UNIT_ID
   ? fromAccount.UNIT_ID
   : '';
   this.chargesParam.debAccNo=fromAccount && fromAccount.OD_ACC_NO
   ? fromAccount.OD_ACC_NO
   : '';
   
    this.chargesParam.cif=fromAccount && fromAccount.COD_CORECIF
    ? fromAccount.COD_CORECIF
    : '';
    
    this.chargesParam.accCcy=fromAccount && fromAccount.OD_CCY_CODE
    ? fromAccount.OD_CCY_CODE
    : '';
    if(this.rootScopeData.changeHeading === "Review"){
      return;
    }
    //this.rootScopeData.dailyLimit = "";
    this.norecordflag = false;
    this.adhocBene = false;
    this.quickBene = false;
    if (fromAccount == 'iconClick') {
      if(this.rootScopeData.localCloneTransactionObject){
        this.debitAccountDetailsObj = "";
        this.getPaymentDebitAccount();
      }
      this.exchangeStatus='F';
      this.isHideTimer = true;
      this.showVAtandCharges = false;
      this.showVAtandChargesFromQT = false;
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
      this.showInstruction = fromAccount && fromAccount.tag70 ? fromAccount.tag70:'';
      this.getBeneInfo();
      this.rootScopeData.hideTabs = true;
      this.DebitClearFlag = false;
    }
  }

  afterToAccountSelection(toAccount: any) {
    this.checkIsQuickTransfer = false;
    this.showVAtandChargesFromQT = false;
    if(this.rootScopeData.changeHeading === "Review"){
      return;
    }
    //this.rootScopeData.dailyLimit = "";
    this.proxyDetails = {
      proxyValue: '',
      proxyType: ''
    }
    if (toAccount == 'iconClick') {
      this.exchangeStatus='F';
      this.isHideTimer = true;
      this.showVAtandCharges = false;
      this.showVAtandChargesFromQT = false;
      this.showDetails = false;
      this.beneAccountDetailsObj = "";
      this.payeeType = "Existing";
      this.adhocObj.adhocFullName = ""
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
      this.clearAdhoc();
      this.clearQuickTransfer();
      this.clearAmountData();
      this.getBeneInfo();
    } else {
      //if(toAccount && toAccount.debitCcy){
        this.paymentAmtObj.currency = toAccount && toAccount.debitCcy ? toAccount.debitCcy : "";
        this.onSelectBeneSingleRecord(toAccount);
      /*}else{
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_BENE_CURR_NOT_AVAILABLE";
      }*/
    }
  }

  onSelectBeneSingleRecord(toAccount: any){
    let debitCcy = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    let beneCcy = toAccount && toAccount.debitCcy ? toAccount.debitCcy : "";
    this.currencyArray = [];
    if (debitCcy && debitCcy !== beneCcy) {
      this.currencyArray.push(debitCcy, beneCcy);
    } else {
      this.currencyArray.push(debitCcy);
    }

    this.showDetails = true;
    this.toAccountDetails[0] = toAccount;
    //this.getPaymentPurpose();
    this.getPurpose();
    // this.getCurrency();
  }

  getDailyLimit() {
    this.isLoadingCompelete = false;
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
        if(response){
          this.isLoadingCompelete = true;
          this.dataSourceDailyLimit = response.data && response.data[1] ? response.data[1] : "";
          this.rootScopeData.dailyLimit = this.dataSourceDailyLimit;
        }  
      }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  getPurpose(){
    let params={
      subProduct : this.paymentSubProduct,
      functionCode: this.paymentFunctionCode
    }
    this.isLoadingCompelete = false;
    this.purposeOfTransferArray = [];
    this.paymentService.getPurposeOfTransferApiCall(params).subscribe((response: any) => {     
      if(response && response.data){
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
      debitUnitId:"",
      purposeCode:"",
      categoryCode: "",
      subPurposeCode: "",
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.purposeCode = this.purposeData.purposeCode ? this.purposeData.purposeCode:"";
    reqObj.categoryCode = this.purposeData.categoryCode ? this.purposeData.categoryCode:"";
    reqObj.subPurposeCode = this.purposeData.subPurposeCode ? this.purposeData.subPurposeCode:"";
    this.relationshipArray = [];
    this.paymentService.getRelationshipApiCall(reqObj).subscribe((response: any) => {     
        if(response && response.data){
          this.isLoadingCompelete = true;         
          this.relationshipArray = response.data;
        }  
      }, error => {    
        this.isLoadingCompelete = true;
      }
    )
  }

  getRecipientBank() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitUnitId:"",
      debitCountryCode:""
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.debitCountryCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].REQ_COUNTRY_CODE ? this.fromAccountDetails[0].REQ_COUNTRY_CODE : "";

    this.relationshipArray = [];
    this.purposeOfTransferArray = [];
    this.paymentService.getRecipientBankApiCall(reqObj).subscribe((response: any) => {     
        if(response && response.data){
          this.isLoadingCompelete = true;         
          this.RecipientBankArray = response.data;
        }  
      }, error => {    
        this.isLoadingCompelete = true;
      }
    )
  }

  getCurrency() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitUnitId:"",
      debitCountryCode:"",
      debitCifNo:"",
      subProduct:"",
      functionCode:""
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.debitCountryCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].REQ_COUNTRY_CODE ? this.fromAccountDetails[0].REQ_COUNTRY_CODE : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";
  
    this.currencyArray = [];
    this.paymentService.getCurrencyApiCall(reqObj).subscribe((response: any) => {     
        if(response && response.data){
          this.isLoadingCompelete = true;         
          var resdata = response.data;  
          for (let i = 0; i < resdata.length; i++) {
            this.currencyArray = resdata[i].transactionCcy;
          }   
        }  
      }, error => {    
        this.isLoadingCompelete = true;
      }
    )
  }

  getPaymentPurpose() {
    this.isLoadingCompelete = false;
    let reqObj = {
      debitUnitId:"",
      subProduct:""
    }
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct:"";

    this.paymentService.getPaymentPurposeApiCall(reqObj).subscribe((response: any) => {
        if(response){
          this.isLoadingCompelete = true;
          this.dataSourcePurpose = response.data[0].purposeOfTransfer;
        }
      }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  paymentDetailsReceived(paymentDetailsObj:any) {
    this.paymentAmount = paymentDetailsObj.amount.trim();
    let amount = Number(this.paymentAmount);
    // this.paymentCurrency = paymentDetailsObj.currency;
    this.paymentCurrencyForRecipt = paymentDetailsObj.currency;
    this.chargesParam.amount=amount+""
    this.debAmt=amount
    this.debitCcy = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    this.paymentCurrency = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].debitCcy ? this.toAccountDetails[0].debitCcy : "";
    if(amount){
      // changes added; 
          // this.isLoadingCompelete = false;
          // this.paymentService.getBusinessDates(this.param).subscribe((res:any)=>{
          //   this.isLoadingCompelete = true;
          //   if(res.dataValue){
          //     this.getExexCharges(this.chargesParam);
          //     this.businessDates = res.dataValue.businessDaysList;
          //   }
          // },error=>{
          //   this.isLoadingCompelete = true;
          // })
          // this.showExecutionDetails=true
        // }else{
        //   this.showExecutionDetails=false
        // }
        this.getExexCharges(this.chargesParam);
      if(amount>20000 && this.isExecutionDetails){
      // if(this.isExecutionDetails){
        this.showVAtandCharges = false;
        this.isLoadingCompelete = false;
        this.paymentService.getBusinessDates(this.param).subscribe((res:any)=>{
          //debugger;
          this.isLoadingCompelete = true;
          if(res.dataValue){
            // this.getExexCharges(this.chargesParam);
            
            // let currentdate = new Date();
            //   let formatcurrentDate = this.datePipe.transform(currentdate,'dd/MM/yyyy')
            //   let firstBusinessDate = this.datePipe.transform(res.dataValue.businessDaysList[0].businessDay, 'MM/dd/yyyy');
            //   if(formatcurrentDate == firstBusinessDate)
            //   {
            //     delete res.dataValue.businessDaysList[0],
            //     delete res.dataValue.businessDaysList[1]
            //   }
              this.businessDates = res.dataValue.businessDaysList;
          }
        },error=>{
          this.isLoadingCompelete = true;
        })
        this.showExecutionDetails=true
        this.showVAtandCharges = false;
      }else if(amount <= 20000 && this.isExecutionDetails){
        //debugger;
        this.showVAtandCharges = true;
        if(this.toAccountDetails[0].IpsFlag === "N"){
          this.isLoadingCompelete = false;
          this.paymentService.getBusinessDates(this.param).subscribe((res:any)=>{
            this.isLoadingCompelete = true;
            if(res.dataValue){
              // this.getExexCharges(this.chargesParam);
              
              // let currentdate = new Date();
              // let formatcurrentDate = this.datePipe.transform(currentdate,'dd/MM/yyyy')
              // let firstBusinessDate = this.datePipe.transform(res.dataValue.businessDaysList[0].businessDay, 'MM/dd/yyyy');
              // if(formatcurrentDate == firstBusinessDate)
              // {
              //   delete res.dataValue.businessDaysList[0],
              //   delete res.dataValue.businessDaysList[1]
              // }
              this.businessDates = res.dataValue.businessDaysList;
            }
          })
          this.showExecutionDetails=true;
          this.showVAtandCharges = false;
        }else{
          this.showExecutionDetails=false;
        }
        
      }
      // else{
      //   this.showExecutionDetails=false
      // }
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
          }else {
            this.paymentAmtObj.exchangeRate = "";
            this.transactionType = "DEBIT";
            this.transactionInputType = "INPUT_DEBIT_AMOUNT";
//debugger;
            if(Number(amount) < Number(amountUnFormat(this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT))){
              this.amountValidationFlag = false; 
              // this.disable=false;
              this.insufficientError = false;
            }
            else{
              this.amountValidationFlag = true;
              this.paymentAmtObj.amountError = 'LBL_INSUFFICIENT_BALANCE';
              // this.disable=true;
              this.insufficientError = true;
            }
          }
      }else{
        this.paymentAmount = "";
        this.formattedPaymentAmount = "";
        this.paymentAmtObj.amountError = "LBL_PROVIDE_VALID_AMOUNT";
      }
    }else{
      this.paymentAmount = "";
      this.paymentAmtObj.exchangeRate = "";
    }
    this.chargesParam.amount =  this.debAmt;
    this.getExexCharges(this.chargesParam);
  }

  getExchangeRate() {
    this.isLoadingCompelete = false;
    let debitCcyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";

    if(debitCcyCode != this.paymentCurrencyForRecipt){
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
        if(response){
          this.isLoadingCompelete = true;
          this.debAmt = response.data && response.data[0] && response.data[0].targetAmount ? response.data[0].targetAmount : "";;
          this.ccyCode = this.paymentCurrencyForRecipt;
          this.paymentAmtObj.exchangeRate = response.data && response.data[0] && response.data[0].conversionMessage ? response.data[0].conversionMessage : "";
          this.paymentAmtObj.debitAmount = response.data && response.data[0] && response.data[0].paymentAmt ? response.data[0].paymentAmt : "";
          // this.paymentAmtObj.debitCurrency = response.data && response.data[0] && response.data[0].creditCcy ? response.data[0].creditCcy : "";
          this.rateRefNo = response.data && response.data[0] && response.data[0].rateRefNo ? response.data[0].rateRefNo : "";
          this.paymentAmtObj.debitCurrency = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
          
          this.exchangeStatus="S";
//debugger
          if(Number(this.debAmt) < Number(amountUnFormat(this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT))){
            this.amountValidationFlag = false; 
            this.insufficientError = false
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
        this.disable=true;
        this.checkExchangeRateValidationFlag = false
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_FETCH_THE_RATES";
      }
    )
  }

  currencyDetailsReceived(paymentDetailsObj:any) {
    this.paymentCurrencyForRecipt = paymentDetailsObj.currency;
    // this.paymentCurrency = paymentDetailsObj.currency;
    let paymentAmount = paymentDetailsObj.amount.trim();
    if(!paymentDetailsObj.amount)
    {
      this.debAmt='';
      this.exchangeStatus=''
    }
    this.paymentCurrency = this.toAccountDetails && this.toAccountDetails[0] && this.toAccountDetails[0].debitCcy ? this.toAccountDetails[0].debitCcy : "";
    let debitCcyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    if(this.paymentCurrency){
      this.paymentAmtObj.currencyError = "";     
      if (paymentAmount && this.paymentCurrency != debitCcyCode) {

        this.getExchangeRate();
      }else {
        this.paymentAmtObj.exchangeRate = "";
      }
    }else{
      this.paymentAmtObj.exchangeRate = "";
    }
  }

  additionalDetailsReceived(additionalDetailsObj:any) {
    this.additionalDetailsObj = additionalDetailsObj;
  }
  getPurposeCode(data:any){
    this.purposeData = data;
    this.getRelationship();
  }

  getRelationShipCode(data:any){
    this.relationShipCode = data;
  }


  adhocDetailReceived(adhocObj:any) {
    this.adhocObj = adhocObj;
    if(this.adhocObj.adhocIbanNo){
      this.isLoadingCompelete = false;
      this.adhocObj.adhocIbanNoError = "";
      let reqObj={
        accNumber:"",
        paymentMode:"",
        unitId:"",
        country:"SAUDI ARABIA",
        countryCode:"SA",
        currency:"SAR"
      }
      reqObj.accNumber = this.adhocObj && this.adhocObj.adhocAccNo ? this.adhocObj.adhocAccNo : "";
      reqObj.paymentMode = this.paymentSubProduct ? this.paymentSubProduct : "";
      reqObj.unitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
      // reqObj.country = this.country ? this.country : "";
      // reqObj.countryCode = this.countryCode ? this.countryCode : "";

      this.paymentService.validateAccountNumber(reqObj).subscribe((response: any) => {
            if(response && response.data){
              this.isLoadingCompelete = true;
              //this.adhocObj.adhocFullName = response.data.BENE_NME ? response.data.BENE_NME : "";
              this.adhocObj.adhocCurrency = response.data.BENE_CURRENCY ? response.data.BENE_CURRENCY : "";
              this.adhocObj.adhocBankName = response.data.BANK_NAME ? response.data.BANK_NAME : "";
              this.adhocObj.adhocBranchName= response.data.BRANCH_NAME ? response.data.BRANCH_NAME : "";
              this.adhocObj.adhocBankCity= response.data.BANK_ADDRESS ? response.data.BANK_ADDRESS : "";
              this.adhocObj.adhocSwiftCode = response.data.SWIFT_CODE ? response.data.SWIFT_CODE : "";
            }else{
              this.isLoadingCompelete = true;
            }
          }, (error:any) =>{
            this.isLoadingCompelete = true;
          }
        )
    }else{
      this.clearAdhoc();
    }
  }

  proceedAdhoc(){
    let isAdhocValid = true;
    if(!this.adhocObj.adhocIbanNo){
      isAdhocValid = false;
      this.adhocObj.adhocIbanNoError = "LBL_PROVIDE_ACC_NO";
    } 
    if(!this.adhocObj.adhocFullName){
      isAdhocValid = false;
      this.adhocObj.adhocFullNameError = "LBL_PROVIDE_BENE_NAME";
    } 
    // if(!this.adhocObj || !this.adhocObj.adhocCurrency){
    //   isAdhocValid = false;
    //   this.rootScopeData.showSystemError = true;
    //   this.rootScopeData.toastMessage = "LBL_BENE_CURR_NOT_AVAILABLE";
    // }
    if(isAdhocValid){
      this.payeeType = "New";
      let beneAdhocData = [{
        // aliasName: "", //????
        beneAccNo: this.adhocObj.adhocIbanNo,
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
        "fieldDetails":[         
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

  proceedQuickTransfer(){
    this.checkIsQuickTransfer = true;
    let isQuickTransferValid = true;
    let accNo = "";
    if(!this.quickTransferObj.quickTransferReceipientBank){
      isQuickTransferValid = false;
      this.quickTransferObj.quickTransferReceipientBankError = "LBL_PLSE_CHOOSE_ON_OPTION";
    } 
    if(!this.quickTransferObj.quickTransferAmount){
      isQuickTransferValid = false;
      this.quickTransferObj.quickTransferAmountError = "LBL_AMOUNT_NOT_VALID";
    } 
    let proxy = ""
    let proxyType = "";
    if(!this.quickTransferObj.quickTransferBeneName && this.quickTransferObj.quickTransferMenuId == "IBAN"){
      isQuickTransferValid = false;
      this.quickTransferObj.quickTransferBeneNameError = "LBL_PROVIDE_BENE_NAME";
    }     
    if(this.quickTransferObj.quickTransferMenuId == "IBAN"){
      accNo = this.quickTransferObj.quickTransferIBAN;
      proxy = "LBL_ACCOUNT_NUMBER_IBAN";
      proxyType = "IBAN";
      if(this.quickTransferObj.quickTransferIBAN && this.quickTransferObj.quickTransferBeneName) {
        isQuickTransferValid = true;
        this.proxyResponseAccountDetails.beneAccName = this.quickTransferObj.quickTransferBeneName;
        this.proceedQuickTransferAfterValidation(this.quickTransferObj.quickTransferIBAN, proxyType);
      } else {
        isQuickTransferValid = false;
        if(!this.quickTransferObj.quickTransferIBAN){
          this.quickTransferObj.quickTransferIBANError = "LBL_PROVIDE_ACC_NO";
        } 
        if(!this.quickTransferObj.quickTransferBeneName){
          this.quickTransferObj.quickTransferBeneNameError = "LBL_PROVIDE_BENE_NAME";
        }
      } 
    }else if(this.quickTransferObj.quickTransferMenuId == "MOB"){
      accNo = this.quickTransferObj.quickTransferMobileNum;
      proxy = "LBL_MOBILE_NUMBER";
      proxyType = "MOBILE";
      if(this.quickTransferObj.quickTransferMobileNum){
        isQuickTransferValid = true;
        this.proceedQuickTransferAfterValidation(this.quickTransferObj.quickTransferMobileNum, proxyType);
      } else{
        isQuickTransferValid = false;
        this.quickTransferObj.quickTransferMobileNumError = "LBL_PROVIDE_MOB_NO";
      } 
    }else if(this.quickTransferObj.quickTransferMenuId == "NID"){
      accNo = this.quickTransferObj.quickTransferNationalID;
      proxy = "LBL_NATIONAL_ID";
      proxyType = "NATIONAL_ID";
      if(this.quickTransferObj.quickTransferNationalID){
        isQuickTransferValid = true;
        this.proceedQuickTransferAfterValidation(this.quickTransferObj.quickTransferNationalID, proxyType);

      } else{
        isQuickTransferValid = false;
        this.quickTransferObj.quickTransferNationalIDError = "LBL_PROVIDE_MOB_NO";
      } 
    }else if(this.quickTransferObj.quickTransferMenuId == "EID"){
      accNo = this.quickTransferObj.quickTransferEmailID;
      proxy = "LBL_EMAIL_ID";
      proxyType = "EMAIL";
      if(this.quickTransferObj.quickTransferEmailID){
        isQuickTransferValid = true;
        this.proceedQuickTransferAfterValidation(this.quickTransferObj.quickTransferEmailID, proxyType);
      } else{
        isQuickTransferValid = false;
        this.quickTransferObj.quickTransferEmailIDError = "LBL_PROVIDE_MOB_NO";
      } 
    }
   }
   validateProxies(details: any) {

    this.bicCodeForIBAN ='';
    if(details.id){
      this.validateProxy(details.id, details.value, details.proxy, details.type,details.bankcode);
    } else {
      this.onBankVerify(details.value);
      // this.validateIban(details.value, details.proxy, details.type);
    }
   }

   hideProceed(data: any): void {
    this.showProceed = !data.hideProceed;
    this.quickTransferObj = data.details;
   }

   proceedQuickTransferAfterValidation(accNo: any, proxy: string ): void {
    this.enteredDetailsInQuicktransfer = accNo;
      this.payeeType = "New";
      let beneAdhocData = [{
        aliasName: "",
        beneAccNo: this.proxyResponseAccountDetails.beneAccNo ? this.proxyResponseAccountDetails.beneAccNo : '',
        accName: this.proxyResponseAccountDetails.beneAccName ? this.proxyResponseAccountDetails.beneAccName : '',
        bankName: this.quickTransferObj.quickTransferReceipientBank,
        debitCcy: "",
        STATUS: "",
        debitBranch: "",
        beneAccType: "Account",
        enteredDetailsInQuicktransfer : accNo,
        maskedAccountNumber : this.proxyResponseAccountDetails.beneAccNo ? this.proxyResponseAccountDetails.beneAccNo : '',
        maskedAccName: this.proxyResponseAccountDetails.beneAccName ? this.proxyResponseAccountDetails.beneAccName : '',
      }]

      if(this.quickBene) {
        if(proxy === "MOBILE" || proxy === "EMAIL" || proxy === "NATIONAL_ID") {
          beneAdhocData[0].maskedAccountNumber =('' + beneAdhocData[0].maskedAccountNumber).slice(0,5)+('' + beneAdhocData[0].maskedAccountNumber).slice(2, beneAdhocData[0].maskedAccountNumber.length-2)
      .replace(/./g, "*")
      + ('' + beneAdhocData[0].maskedAccountNumber).slice(-3);
          beneAdhocData[0].maskedAccName =('' + beneAdhocData[0].maskedAccName).slice(0,5)+('' + beneAdhocData[0].maskedAccName).slice(2, beneAdhocData[0].maskedAccName.length-2)
      .replace(/./g, "*")
      + ('' + beneAdhocData[0].maskedAccName).slice(-3);
          this.beneAccountDetailsObj.fieldDetails = [
            {
              "dispKey": proxy,
              "dataKey": "enteredDetailsInQuicktransfer"
            },
            //New key added for Iban Number and Acc name
            {
              "dispKey": "LBL_ACCOUNT_NUMBER_IBAN",
              "dataKey": "maskedAccountNumber"
            },
            {
              "dispKey": "LBL_ACCOUNT_NAME",
              "dataKey": "maskedAccName"
            },
            {
              "dispKey": "LBL_BANK_NAME",
              "dataKey": "bankName"
            },  
          ]
        }else{
          this.beneAccountDetailsObj.fieldDetails = [
            {
              "dispKey": proxy,
              "dataKey": "beneAccNo"
            },
             //New key added for Acc name
            {
              "dispKey": "LBL_ACCOUNT_NAME",
              "dataKey": "accName"
            },
            {
              "dispKey": "LBL_BANK_NAME",
              "dataKey": "bankName"
            },  
          ]
        }
        // this.beneAccountDetailsObj.fieldDetails = [
        //   {
        //     "dispKey": proxy,
        //     "dataKey": "beneAccNo"
        //   },
        //   {
        //     "dispKey": "LBL_BANK_NAME",
        //     "dataKey": "bankName"
        //   },  
        // ]

        this.proxyDetails = {
          proxyType: proxy,
          proxyValue: proxy? accNo : ""
        }; 
        
        if(proxy === "MOBILE"){
          this.QuickTransferLabel = "LBL_MOBILE_NUMBER"
        }else if(proxy === "EMAIL"){
          this.QuickTransferLabel = "LBL_EMAIL"
        }else if(proxy === "EMAIL"){
          this.QuickTransferLabel = "LBL_NATIONAL_ID"
        }else {
          this.QuickTransferLabel = "LBL_ACC_NUMBER"
        }
      }
      this.beneAccountDetailsObj.data = beneAdhocData;
      this.quickBene = false;
      this.showBeneData = true;
      this.paymentAmtObj.amount=this.quickTransferObj.quickTransferAmount;
      this.paymentAmount=this.quickTransferObj.quickTransferAmount;
      this.showVAtandChargesFromQT = true;
      this.getCharges();
      this.paymentDetailsReceived(this.paymentAmtObj)
      this.onSelectBeneSingleRecord(beneAdhocData[0]);
    
   }

   validateProxy(proxyNumber: number, proxyValue: string, proxyName: string, proxy:string,bankcode:string ): void {
    this.isLoadingCompelete = false;
    this.validProxy = proxyNumber;
    let concatProxyValue = bankcode.concat(proxyValue.toString());
    this.paymentService.getProxyIdentifierDetailsData({
      proxyValue: concatProxyValue,
      proxyId: proxyNumber
    }).subscribe((response: any) => {

      if(response && response.data.res_ErrorMessage === "Sucess") {
        this.showProceed = true;
        this.proxyResponseAccountDetails.beneAccName = response.data.account? response.data.account.name : ''
        this.proxyResponseAccountDetails.beneAccNo = response.data.account? response.data.account.value : ''
        //debugger
        this.bicCodeForIBAN = this.bankSwiftCode;
        // this.onBankVerifyValidateMobile(this.proxyResponseAccountDetails.beneAccNo);
      } else {
        this.showProceed = false;
        if(proxyNumber === 14) {
          this.quickTransferObj.quickTransferMobileNumError = "LBL_ENTER_VALID_MOBILE"
        } else if( proxyNumber === 13) {
          this.quickTransferObj.quickTransferNationalIDError = "LBL_ENTER_VALID_NATIONAL_ID"
        } else if( proxyNumber === 12) {
          this.quickTransferObj.quickTransferEmailIDError="LBL_ENTER_VALID_EMAIL_ID"
        }
       }
      this.isLoadingCompelete = true;
    }, ()=> {
      this.showProceed = false;
      this.rootScopeData.showSystemError = true;
      this.isLoadingCompelete = true;
    })
   }

   onBankVerifyValidateMobile(ibanNo:any){
    this.bankverifyError = false;
    if(ibanNo){
    let reqdata = {
      ibanAccount : ibanNo
    }
    this.paymentService.bankVerify(reqdata).subscribe((res)=>{
      if(res){

        if(res.data.bicCode){
          this.bicCodeForIBAN = res.data.bicCode;
        }
        else{
          this.showProceed = false;
          if(this.validProxy === 14) {
            this.quickTransferObj.quickTransferMobileNumError = "LBL_ENTER_VALID_MOBILE"
          } else if(this.validProxy === 13) {
            this.quickTransferObj.quickTransferNationalIDError = "LBL_ENTER_VALID_NATIONAL_ID"
          } else if(this.validProxy === 12) {
            this.quickTransferObj.quickTransferEmailIDError="LBL_ENTER_VALID_EMAIL_ID"
          }
        }
        // if(res.data.bicCode === this.bankSwiftCode){
        //   this.bankverifyError = false;
        //   // this.validateIban(ibanNo, '', '');
        //   if(this.checkTransferLimit === true){
        //     if(res.data.BeneRegFlag === 'Y'){
        //       this.quickTransferObj.quickTransferAmountError="";
        //       this.disableproceedBtn = false;
        //     }else{
        //       this.quickTransferObj.quickTransferAmountError="LBL_ENTRD_AMT_ERROR";
        //       this.disableproceedBtn = true;
        //       this.onNextVerify = false;
        //       this.isAccountVerified = false;
        //     }
        //   }else{
        //     this.disableproceedBtn = false;
        //   }
          
        // }else{
        //   this.bankverifyError = true;
        //   this.quickTransferObj.quickTransferMobileNum = '';
        //   this.quickTransferObj.quickTransferNationalID = '';
        //   this.quickTransferObj.quickTransferEmailID = '';
        // }
      }else{

      }
    })
  }
  }

   validateIban(ibanNumber: any, proxyName: string, proxy: string): void {
    if(ibanNumber){
      this.showProceed = true;
        this.proxyResponseAccountDetails.beneAccName = this.quickTransferObj.quickTransferBeneName? this.quickTransferObj.quickTransferBeneName : "";
        this.proxyResponseAccountDetails.beneAccNo = ibanNumber;
				this.quickTransferObj.quickTransferAmountError="";
        this.disableproceedBtn = false;
    // this.configService.getProxyIdentifierData(
    //           ibanNumber,
    //           ibanNumber
    //         ).subscribe((resp: any) => {
    //           if(resp.data) {
    //             this.showProceed = true;
    //             this.proxyResponseAccountDetails.beneAccName = this.quickTransferObj.quickTransferBeneName? this.quickTransferObj.quickTransferBeneName : "";
    //             this.proxyResponseAccountDetails.beneAccNo = ibanNumber;
    //             this.isLoadingCompelete = true;
    //             // this.onBankVerify(ibanNumber);
    //             if(this.checkTransferLimit === true){
    //               if(resp.data.BeneRegFlag === 'Y'){
    //                 this.quickTransferObj.quickTransferAmountError="";
    //                 this.disableproceedBtn = false;
    //               }else if(resp.data.registrationId){
    //                 this.quickTransferObj.quickTransferAmountError="";
    //                 this.disableproceedBtn = false;
    //               }else{
    //                 this.quickTransferObj.quickTransferAmountError="LBL_ENTRD_AMT_ERROR";
    //                 this.disableproceedBtn = true;
    //                 this.onNextVerify = false;
    //                 this.isAccountVerified = false;
    //                 this.quickTransferObj.quickTransferIBAN = '';
    //               }
    //             }else{
    //               this.disableproceedBtn = false;
    //               if(resp.data.registrationId){
    //                 this.quickTransferObj.quickTransferAmountError="";
    //                 this.disableproceedBtn = false;
    //               }else{
    //                 this.quickTransferObj.quickTransferIBANError = "LBL_PROVIDE_ACC_NO";
    //                 this.showProceed = false;
    //               }
    //             }
    //           } else {
    //             this.quickTransferObj.quickTransferIBANError = "LBL_PROVIDE_ACC_NO";
    //             this.showProceed = false;
    //           }
    //         }, () => {
    //           this.quickTransferObj.quickTransferIBANError = "LBL_PROVIDE_ACC_NO";
    //           this.isLoadingCompelete = true;
    //           this.showProceed = false;
    //         })
          } else {
            this.quickTransferObj.quickTransferIBANError = "LBL_PROVIDE_ACC_NO";
            this.showProceed = false;
          }
   }

   onBankVerify(ibanNo:any){
    this.bankverifyError = false;
    if(ibanNo){
      this.validateIban(ibanNo, '', '');
    let reqdata = {
      ibanAccount : ibanNo
    }
    this.paymentService.bankVerify(reqdata).subscribe((res)=>{
      if(res){

        
        if(res.data.bicCode){
          this.bicCodeForIBAN = res.data.bicCode;
          var selectFourChar = res.data.bicCode.substring(0,4)
        
          if(selectFourChar === this.bankSwiftCode){
            this.bankverifyError = false;
            if(res.data && res.data.bicCode){
              if(this.checkTransferLimit === true){
                if(res.data.BeneRegFlag === 'Y'){
                  this.quickTransferObj.quickTransferAmountError="";
                  this.disableproceedBtn = false;
                }else{
                  this.quickTransferObj.quickTransferAmountError="LBL_ENTRD_AMT_ERROR";
                  this.disableproceedBtn = true;
                  this.onNextVerify = false;
                  this.isAccountVerified = false;
                }
              }else{
                // this.disableproceedBtn = false;
              }
            }else{
              this.quickTransferObj.quickTransferIBANError = "LBL_PROVIDE_ACC_NO";
              this.isLoadingCompelete = true;
              this.showProceed = false;
            }
        }else{
        this.bankverifyError = true;
        this.quickTransferObj.quickTransferIBAN = '';
      }
        }
        else if(res.data.res_ErrorCode === "11111"){
          this.quickTransferObj.quickTransferIBANError = res.data.res_ErrorMessage;
          this.isLoadingCompelete = true;
          this.showProceed = false;
        }
        else{
          this.quickTransferObj.quickTransferIBANError = "LBL_PROVIDE_ACC_NO";
                this.isLoadingCompelete = true;
                this.showProceed = false;
        }
        // if(res.data.bicCode === this.bankSwiftCode){
        //   this.bankverifyError = false;
          
          
          
        // }else{
        //   this.bankverifyError = true;
        //   this.quickTransferObj.quickTransferIBAN = '';
        // }
      }
    })
  }
  }

  autherizationDetailsReceived(autherizationDetailsObj:any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }

  submit(){
    let isAmountValid = true;
    let isCurrencyValid = true;
    let isPurposeValid = true;
    let isRelationshipValid = true;
    let isValueDateValid = true;
    if(!this.paymentAmount){
      isAmountValid = false;
      this.paymentAmtObj.amountError = "LBL_PROVIDE_VALID_AMOUNT";
    }
    if(!this.paymentAmtObj.currency){
      isCurrencyValid = false;
      this.paymentAmtObj.currencyError = "LBL_PROVIDE_VALID_CURRENCY";
    }        
    if(!this.additionalDetailsObj){
      isPurposeValid = false;
      this.additionalDetailsErrorObj.purposeError = "LBL_PLEASE_SELECT_PURPOSE";
      this.additionalDetailsErrorObj.relationshipError = "LBL_PLEASE_SELECT_RELATIONSHIP";
      this.additionalDetailsErrorObj.valueDateError = "LBL_PROVIDE_VALUE_DATE";
    }else{
      if(!this.additionalDetailsObj.purpose){
        isPurposeValid = false;
        this.additionalDetailsErrorObj.purposeError = "LBL_PLEASE_SELECT_PURPOSE";
      }
      if(!this.additionalDetailsObj.relationship){
        isRelationshipValid = false;
        this.additionalDetailsErrorObj.relationshipError = "LBL_PLEASE_SELECT_RELATIONSHIP";
      }
      if(!this.additionalDetailsObj.valueDate){
        isValueDateValid = false;
        this.additionalDetailsErrorObj.valueDateError = "LBL_PROVIDE_VALUE_DATE";
      }
    }
    //changes made
    if(this.exeDetailsObj){
      if(this.exeDetailsObj.type==="Scheduled"){
        if(typeof(this.exeDetailsObj.date)==="string"){
          this.exeDateError=true
        }else{
          this.exeDateError=false
        }
      }
    }
   
    if(isAmountValid && isCurrencyValid && isPurposeValid && isRelationshipValid && isValueDateValid && !this.exeDateError){
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
      paymentAmount:"",
      debitUnitId:"",
      debitCifNo:"", 
      debitPortalAccNo:"",
      paymentCurrency:"",
      subProduct:"",
      functionCode:""
    }
    reqObj.paymentAmount = this.paymentAmount ? this.paymentAmount : "";
    reqObj.debitUnitId = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
    reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    reqObj.debitPortalAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
    reqObj.paymentCurrency = this.paymentCurrency ? this.paymentCurrency : "";
    reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
    reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";
    this.paymentService.getChargesApiCall(reqObj).subscribe((response: any) => {
        if(response && response.data){
          this.isLoadingCompelete = true;
          let fee = response.data[0] && response.data[0].chargeInfo && response.data[0].chargeInfo[0] && response.data[0].chargeInfo[0].charge ? response.data[0].chargeInfo[0].charge : "";
          let vat = response.data[0] && response.data[0].chargeInfo && response.data[0].chargeInfo[0] && response.data[0].chargeInfo[0].tax ? response.data[0].chargeInfo[0].tax : "";
          let ccy = response.data[0] && response.data[0].chargeInfo && response.data[0].chargeInfo[0] && response.data[0].chargeInfo[0].ccy ? response.data[0].chargeInfo[0].ccy : "";
          if(this.paymentAmount && fee && vat && ccy){
            this.chargeAmount = fee;
            this.vatAmount = vat;
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            //let debitAmount = Number(this.paymentAmount) + Number(this.paymentAmtObj.fee) + Number(this.paymentAmtObj.vat);
            //this.paymentAmtObj.debitAmount = currencyFormatPipeFilter.transform(debitAmount, ccy);
            if(this.showExecutionDetails){
              this.paymentAmtObj.fee = currencyFormatPipeFilter.transform(fee, ccy);
              this.paymentAmtObj.vat = currencyFormatPipeFilter.transform(vat, ccy);
              this.paymentAmtObj.ccy = ccy;  
            }else{
              this.paymentAmtObj.fee = this.feeCharge;
              this.paymentAmtObj.vat = this.vatCharge;
              this.paymentAmtObj.ccy = this.exeCCY; 
            }
            if(this.showVAtandChargesFromQT){
              this.paymentAmtObj.fee = currencyFormatPipeFilter.transform(fee, ccy);
              this.paymentAmtObj.vat = currencyFormatPipeFilter.transform(vat, ccy);
              this.paymentAmtObj.ccy = ccy;
            }
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
      paymentAmount:"",
      debitCifNo:"", 
      debitPortalAccNo:"",
      debitCurrencyCode:"",
      beneCurrencyCode:"",
      paymentCurrency:"",
      subProduct:"",
      functionCode:""
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
        if(response){
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
    if(otpValue){
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onSubmitReceipt();
    }else{
      this.userOtpValue = "";
    }
  }

  modify(){
    this.rootScopeData.changeHeading = "Make Payment";
    this.initiateScreen = true;
    this.showAmtDetInitiateScreen = true;
    this.showAddDetInitiateScreen = true;
    this.showAuthorization = false;
    this.checkFlexiAuth = false;
    this.showAuthentication = false;
    this.clearAuthData();
  }

  showOneTimePayment(){
    //changes added
    this.isExecutionDetails=true
    this.adhocObj.adhocIbanNoError = "";
    this.adhocObj.adhocFullNameError = "";
    this.proxyDetails = {
      proxyValue: '',
      proxyType: ''
    }
    let reqObj={
      moduleId:"COUNTRYLKPDFT",
      unitId:this.rootScopeData.userInfo.UNIT_ID
    }
    this.paymentService.getCountry(reqObj).subscribe((response: any) => {
        if(response){      
          this.isLoadingCompelete = true;
          this.adhocBene = true;
          this.showBeneData = false;
          this.country = response.data && response.data[0] && response.data[0].countryName ? response.data[0].countryName : "";
		  this.countryCode = response.data && response.data[0] && response.data[0].countryCode ? response.data[0].countryCode : "";;
        }  
      }, (error:any) =>{
        this.isLoadingCompelete = true;
      }
    )
  }

  showQuickTransfer(){
    //changes added
    this.norecordflag = false;
    this.isExecutionDetails=false
    this.getRecipientBank();
    this.quickBene = true;
    this.showAmtDetInitiateScreen=false
    this.showBeneData = false;
    this.isQuickTransferSelected = true;
  }
   
  cancel() {
    this.exchangeStatus='F';
    this.isHideTimer = true;
    this.norecordflag = false;
    this.showVAtandCharges = false;
    this.showVAtandChargesFromQT = false;
    this.initGenerateStatement();
    this.cancelQuickTransfer();
  }

  cancelAdhoc(){
    this.adhocBene = false;
    this.showBeneData = true;
    this.showVAtandCharges = false;
    this.showVAtandChargesFromQT = false;
    this.clearAdhoc();
  }

  cancelQuickTransfer(){
    this.checkIsQuickTransfer = false;
    this.quickBene= false;
    this.showAmtDetInitiateScreen=true;
    this.showVAtandCharges = false;
    this.showVAtandChargesFromQT = false;
    this.onNextVerify = false;
    this.quickTransferObj={
      quickTransferMenuId:"",
      quickTransferReceipientBank:"",
      quickTransferReceipientBankError:"",
      quickTransferAmount:"",
      quickTransferAmountError:"",
      quickTransferIBAN:"",
      quickTransferMobileNum: "",
      quickTransferNationalID: "",
      quickTransferEmailID: "",
      quickTransferIBANError:"",
      quickTransferMobileNumError: "",
      quickTransferNationalIDError: "",
      quickTransferEmailIDError: "",
      quickTransferBeneName: "",
      quickTransferBeneNameError: "" 
    };
    if(this.beneData.length === 0){
      this.showBeneData = false; 
      this.showProceed = false;
      this.norecordflag = true;
    }else{
      this.showBeneData = true; 
      this.showProceed = false;
      this.norecordflag = false;
    }
    this.showExecutionDetails=true;this.showDetails=true;
  }

  clearAmountData(){
    this.paymentCurrency = "";
    this.paymentAmount = "";
    this.paymentAmtObj.amount = "";
    this.paymentAmtObj.currency = ""
    this.paymentAmtObj.exchangeRate = "";
    this.paymentAmtObj.debitCurrency = "";
  } 

  clearAuthData(){
    this.autherizationDetailsObj = "";
    this.userOtpValue = "";
    this.otpError = "";
    this.authError = "";
  }

  clearAdditionalData(){
    this.additionalDetailsObj = "";
  }

  clearAdhoc(){
    this.adhocObj.adhocIbanNo = "";
    this.adhocObj.adhocIbanNoError = "";
    this.adhocObj.adhocFullName = "";
    this.adhocObj.adhocFullNameError = "";
    this.adhocObj.adhocCurrency = "";
    this.adhocObj.adhocBankName = "";
    this.adhocObj.adhocBranchName = "";
    this.adhocObj.adhocBankCity = "";
    this.adhocObj.adhocSwiftCode = "";
  }

  clearQuickTransfer(){
    this.quickTransferObj.quickTransferMenuId = "";
    this.quickTransferObj.quickTransferReceipientBank = "";
    this.quickTransferObj.quickTransferReceipientBankError = "";
    this.quickTransferObj.quickTransferAmount = "";
    this.quickTransferObj.quickTransferAmountError = "";
    this.quickTransferObj.quickTransferIBAN = "";
    this.quickTransferObj.quickTransferMobileNum = "";
    this.quickTransferObj.quickTransferNationalID = "";
    this.quickTransferObj.quickTransferEmailID = "";
    this.quickTransferObj.quickTransferIBANError = "";
    this.quickTransferObj.quickTransferMobileNumError = "";
    this.quickTransferObj.quickTransferNationalIDError = "";
    this.quickTransferObj.quickTransferEmailIDError = "";
    this.quickTransferObj.quickTransferBeneName = "";
    this.quickTransferObj.quickTransferBeneNameError = "";
  }

  initGenerateStatement() {
    this.clearAmountData();
    this.getPaymentDebitAccount();
    this.DebitClearFlag= true;    
    this.rootScopeData.changeHeading = "Make Payment";
    this.rootScopeData.localCloneTransactionObject = '';
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
    this.showVAtandCharges = false;
    this.showVAtandChargesFromQT = false;
    //changes added
    this.showExecutionDetails=false
  }

  onSubmitReceipt(){
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

    //quickTransferVaalidation
    if(this.checkIsQuickTransfer === true){
      this.swiftCode = this.bicCodeForIBAN ? this.bicCodeForIBAN : "";
    }else{
      this.swiftCode = this.toAccountDetails[0].swiftCode ? this.toAccountDetails[0].swiftCode : "";
    }
    

    if(isOtpValid){
          /*if(this.editDetails.type == "amend") {
      this.moduletype = "TXNRECALLAMEND";
      this.inputTypeAction = "SAVE_TXN";
      this.inputTypeTransactStatus = "RA";
      }*/
      this.rootScopeData.dailyLimit = "";
      this.isLoadingCompelete = false;
      let reqObj = {
        moduleId:"",
        inputAction:"",
        inputTransactStatus:"",
        debitUnitId:"",
        paymentAmount:"",
        payeeType:"",
        editmode:"",
        transactionType:"",
        maxIndTxnLimit:"",
        usedPayLimit:"",
        valueDate:"",
        narration:"",
        rateRefNo:"",
        chargeAmount:"",
        vatAmount:"",
        inputVersionNum:"",
        paymentName:"",
        subProduct:"",
        functionCode:"",
        debitAvailableBalance:"",
        debitCurrencyCode:"",
        debitCifNo:"",
        debitPortalAccNo:"",
        debitAccName:"",
        debitAccNo:"",
        debitCountryCode:"",
        beneBank:"",
        beneId:"",
        beneBranch:"",
        beneAccType:"",
        beneCountry:"",
        beneAccName:"",
        beneCurrencyCode:"",
        beneAccNo:"",
        beneSwiftCode:"",
        beneBankCode:"",
        authRuleId:"",
        authUserNo:"",
        authUserLevel:"",
        selectionFlag:"",
        userNoList:"",
        approverNote:"",
        purposeCode:"",
        subPurposeCode:"",
        categoryCode:"",
        relationshipCode:"",
        otp: "",
        otpRef: "",
        proxyType: this.proxyDetails.proxyType,
        phoneNo: this.proxyDetails.proxyType==="MOBILE"? this.proxyDetails.proxyValue: "",
        emailId: this.proxyDetails.proxyType==="EMAIL"? this.proxyDetails.proxyValue: "",
        nationalId: this.proxyDetails.proxyType==="NATIONAL_ID"? this.proxyDetails.proxyValue: "",
        exeType:"",
        instructions1:"",
        instructions2:"",
        INPUT_MODE:"",
        INPUT_REFERENCE_NO:"",
        AUTH_TYPE_O:""
      }

      reqObj.moduleId = this.moduleId? this.moduleId : "";
      reqObj.inputAction = this.inputAction? this.inputAction : "";
      reqObj.inputTransactStatus = this.inputTransactStatus? this.inputTransactStatus : "";
      reqObj.paymentAmount = this.paymentAmount ? this.paymentAmount : "";
      reqObj.payeeType = this.payeeType ? this.payeeType : "";
      reqObj.editmode = this.editmode ? this.editmode : "";
      reqObj.transactionType = this.transactionType ? this.transactionType : "";
      reqObj.maxIndTxnLimit = this.dataSourceDailyLimit && this.dataSourceDailyLimit.maxIndTxnLimit ? this.dataSourceDailyLimit.maxIndTxnLimit : "";
      reqObj.usedPayLimit = this.dataSourceDailyLimit && this.dataSourceDailyLimit.usedPayLimit ? this.dataSourceDailyLimit.usedPayLimit : "";
      reqObj.valueDate = this.additionalDetailsObj && this.additionalDetailsObj.valueDate ? this.additionalDetailsObj.valueDate : "";
      reqObj.narration = this.additionalDetailsObj && this.additionalDetailsObj.narration ? this.additionalDetailsObj.narration : "";
      reqObj.rateRefNo = this.rateRefNo ? this.rateRefNo : "";
      reqObj.chargeAmount = this.chargeAmount ? this.chargeAmount : "";
      //debugger;
      reqObj.vatAmount = this.vatAmount ? this.vatAmount : "";
      reqObj.inputVersionNum = this.inputVersionNum ? this.inputVersionNum : "";     
      reqObj.paymentName = this.paymentName ? this.paymentName : "";
      reqObj.subProduct = this.paymentSubProduct ? this.paymentSubProduct : "";
      reqObj.functionCode = this.paymentFunctionCode ? this.paymentFunctionCode : "";
      reqObj.purposeCode = this.purposeData.purposeCode? this.purposeData.purposeCode:"";
      reqObj.subPurposeCode = this.purposeData.subPurposeCode? this.purposeData.subPurposeCode:"";
      reqObj.categoryCode = this.purposeData.categoryCode? this.purposeData.categoryCode:"";
      reqObj.relationshipCode = this.relationShipCode ?  this.relationShipCode:"";

      reqObj.otp = this.userOtpValue ? this.userOtpValue : '';
      reqObj.otpRef = this.secAuthRef ? this.secAuthRef : '';
      reqObj.instructions1 = this.additionalDetailsObj && this.additionalDetailsObj.intructions1 ? this.additionalDetailsObj.intructions1 : "";
      reqObj.instructions2 = this.additionalDetailsObj && this.additionalDetailsObj.instructions2 ? this.additionalDetailsObj.instructions2 : "";
      reqObj.AUTH_TYPE_O = this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
      if(this.rootScopeData.localCloneTransactionObject.edit === "Y"){
        reqObj.INPUT_MODE = "EDIT_CONFORM_SUBMIT";
        reqObj.INPUT_REFERENCE_NO = this.rootScopeData.localCloneTransactionObject.ref_NO;
      }else{
        reqObj.INPUT_MODE = "CONFORM_SUBMIT";
      }

      if(this.fromAccountDetails && this.fromAccountDetails[0]){
        reqObj.debitUnitId = this.fromAccountDetails[0].UNIT_ID ? this.fromAccountDetails[0].UNIT_ID : "";
        reqObj.debitAvailableBalance = this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT ? this.fromAccountDetails[0].CURR_AVAIL_BAL_AMT : "";
        reqObj.debitCurrencyCode = this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
        reqObj.debitCifNo = this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
        reqObj.debitPortalAccNo = this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
        reqObj.debitAccName = this.fromAccountDetails[0].OD_ACC_NAME ? this.fromAccountDetails[0].OD_ACC_NAME : "";
        reqObj.debitAccNo = this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "";
        reqObj.debitCountryCode = this.fromAccountDetails[0].REQ_COUNTRY_CODE ? this.fromAccountDetails[0].REQ_COUNTRY_CODE : "";  
      }

      reqObj.beneCurrencyCode  = this.paymentCurrency ? this.paymentCurrency : "";
      if(this.toAccountDetails && this.toAccountDetails[0]){
        reqObj.beneBank = this.toAccountDetails[0].bankName ? this.toAccountDetails[0].bankName : "";
        reqObj.beneBranch = this.toAccountDetails[0].debitBranch ? this.toAccountDetails[0].debitBranch : "";
        reqObj.beneAccType = this.toAccountDetails[0].beneAccType ? this.toAccountDetails[0].beneAccType : "";
        reqObj.beneCountry = this.toAccountDetails[0].beneCntry ? this.toAccountDetails[0].beneCntry : "";
        if(this.proxyDetails.proxyType==="MOBILE" || this.proxyDetails.proxyType==="EMAIL" ||this.proxyDetails.proxyType==="NATIONAL_ID"){          
          reqObj.beneAccName =  this.proxyResponseAccountDetails.beneAccName ? this.proxyResponseAccountDetails.beneAccName : "";
        }
        else{
          reqObj.beneAccName = this.toAccountDetails[0].beneaccName ? this.toAccountDetails[0].beneaccName : "";
        }
       
        
        reqObj.beneId = this.toAccountDetails[0].beneId ? this.toAccountDetails[0].beneId : "";
        //reqObj.beneCurrencyCode  = this.toAccountDetails[0].debitCcy ? this.toAccountDetails[0].debitCcy : "";
        reqObj.beneAccNo  = this.toAccountDetails[0].beneAccNo ? this.toAccountDetails[0].beneAccNo : "";  
        reqObj.beneSwiftCode = this.swiftCode;
        reqObj.beneBankCode = this.toAccountDetails[0].bankCode ? this.toAccountDetails[0].bankCode : "";
      }

      if(this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover){
        reqObj.authRuleId  =  this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID ? this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID : "";
        reqObj.authUserNo  = this.autherizationDetailsObj.selectedAprover.OD_USER_NO ? this.autherizationDetailsObj.selectedAprover.OD_USER_NO : "";
        reqObj.authUserLevel  = this.autherizationDetailsObj.selectedAprover.OD_LEVEL ? this.autherizationDetailsObj.selectedAprover.OD_LEVEL : "";
        reqObj.selectionFlag = reqObj.authUserNo ? 'Y' : 'N';
        reqObj.userNoList = reqObj.authUserNo && reqObj.authUserLevel ? reqObj.authUserNo+'%'+reqObj.authUserLevel : "";  
      }
      reqObj.approverNote  = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : "";
      //changes added
      if(this.exeDetailsObj){
        reqObj.valueDate = this.exeDetailsObj && this.exeDetailsObj.valueDate ? this.exeDetailsObj.valueDate : "";
        reqObj.chargeAmount = this.exeDetailsObj.fee ? this.exeDetailsObj.fee : "";
        reqObj.vatAmount = this.exeDetailsObj.vat ? this.exeDetailsObj.vat : "";
        reqObj.exeType=this.exeDetailsObj && this.exeDetailsObj.type ? (this.exeDetailsObj.type).toUpperCase() : "";
      }
      this.paymentService.submitMakePaymentApiCall(reqObj).subscribe((response: any) => {
          this.isLoadingCompelete = true;    
          if(response){
            if(response.dataValue.OD_STATUS_DESC === "Failed"){
              this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
              // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
            }else {
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
              this.clearQuickTransfer();
              this.adhocObj.adhocFullName = ""
              this.showReceiptForm = true;
            }
          }else{
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
    if(this.isQuickTransferSelected === true) {
      this.toAccountDetails[0].beneAccNo = this.enteredDetailsInQuicktransfer ? this.enteredDetailsInQuicktransfer : "";
      // this.toAccountDetails[0].beneAccNo = ('' + this.toAccountDetails[0].beneAccNo).slice(0,2)+('' + this.toAccountDetails[0].beneAccNo).slice(2, this.toAccountDetails[0].beneAccNo.length-2)
      // .replace(/./g, "*")
      // + ('' + this.toAccountDetails[0].beneAccNo).slice(-2);
      this.toAccountDetails[0].beneAccNo = this.toAccountDetails[0].beneAccNo

    }else{
      this.QuickTransferLabel = "";
    }
    this.QuickTransferLabel = this.QuickTransferLabel ? this.QuickTransferLabel : "LBL_ACC_NUMBER";

    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    let approver = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME : this.translateService.instant("LBL_NOT_PROVIDED");
    let approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : this.translateService.instant("LBL_NOT_PROVIDED");
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
    let UTIReference :any;
    let checkAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_PAYMENT_SUCCESSFULL"
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
      journalId = data.JOURNAL_ID;
      if(data.UTI_REFERENCE=== "null"){
        UTIReference = "--";
      }else{
        UTIReference = data.UTI_REFERENCE
      }
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
      // "msg2": "LBL_LOCAL_TRSFR_PENDNG_FR_APPROVAL_MSG", 
      "msg2": message2,
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      "referenceNumber": refNumber,
      "UTIReference": UTIReference ? UTIReference : "",
      "journalId":journalId ? journalId : "",
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "true",
          "data": this.fromAccountDetails,
          "authorizeButtonRouterPath":"/accounts/generate-statement",
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
              // "dataKey": "accName"
              "dataKey": this.toAccountDetails[0].beneaccName
            },
            {
              "dispKey": this.QuickTransferLabel,
              // "dataKey": "beneAccNo"
              "dataKey":this.QuickTransferLabel === "LBL_ACC_NUMBER" && this.isQuickTransferSelected === true ?this.translateService.instant("LBL_SA")+ this.toAccountDetails[0].beneAccNo:this.toAccountDetails[0].beneAccNo
            },
            {
              "dispKey": "LBL_SHORT_NAME",
              // "dataKey": "aliasName"
              "dataKey": this.toAccountDetails[0].aliasName
            }
          ]
        },
        {
          "isTable": "false",
          "fieldDetails": [
            {
              "dispKey": "LBL_DEBIT_AMT",
              "dataKey": currencyFormatPipeFilter.transform(this.debAmt, this.debitCcy) + ' ' + this.debitCcy
            },
            {
              "dispKey": "LBL_EXECUTION_DETAILS",
              "dataKey":  this.exeDetailsObj && this.exeDetailsObj.valueDate ? this.exeDetailsObj.valueDate : date 
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
        "buttonLabel":"LBL_INITIATE_ANOTHER_REQUEST"
      },
      "finishButton":{
        "buttonLabel":"LBL_FINISH",
        "buttonPath":"/dashboard"
      }  
    };
    if(approver && this.checkFlexiAuth && checkAuth){
      this.receiptData.receiptDetails.push(flexiAuth);
    }
    this.isQuickTransferSelected = false;

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
          "subValue": this.fromAccountDetails[0].USER_ID ? this.fromAccountDetails[0].USER_ID : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.fromAccountDetails[0].OD_ACC_NO ? this.fromAccountDetails[0].OD_ACC_NO : "--"
        },
        {
          "subHead": "Short Name",
          "subValue": this.fromAccountDetails[0].ALIAS_NAME ? this.fromAccountDetails[0].ALIAS_NAME : "--"
        },
        {
          "subHead": "To",
          "subValue": ""
        },
        {
          "subHead": "Beneficiary",
          "subValue": this.toAccountDetails[0].beneaccName ? this.toAccountDetails[0].beneaccName : "--"
        },
        {
          "subHead": "To Account Number",
          "subValue": this.toAccountDetails[0].beneAccNo ? this.toAccountDetails[0].beneAccNo : "--"
        },
        {
          "subHead": "To Short Name",
          "subValue": this.toAccountDetails[0].aliasName ? this.toAccountDetails[0].aliasName : "--"
        },
        {
          "subHead": "Debit Amount",
          "subValue": currencyFormatPipeFilter.transform(this.debAmt, this.debitCcy) + ' ' + this.debitCcy
        },
        {
          "subHead": "Journal ID",
          "subValue": journalId ? journalId : "--"
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        },
        {
          "subHead": "UTI reference number",
          "subValue": UTIReference ? UTIReference : "--"
        }
      ],
      "pagecall":this.checkIsQuickTransfer === true ? "quicktransfer" : "payments",
      "refNo":refNumber
    }

  }

  checkForAmountChange(amountChanged: boolean): void {
    if(amountChanged) {
      this.onNextVerify = false;
      this.isAccountVerified = false;
      this.showProceed = false;
    } else {
      if(this.isAccountVerified){
        this.onNextVerify = true;
      } else {
        this.onNextVerify = false;
      }
    }
  }

  verifyQukTrans(){
    this.isLoadingCompelete = false;
     let reqObj={
      moduleId:'',
      prdName:'',
      subPrdName:'',
      funCode:'',
      cifNo:''
    }
    reqObj.moduleId="FETCHTXNLIMIT";
    reqObj.prdName=this.paymentProduct;
    reqObj.subPrdName="BKSRNT";
    reqObj.funCode=this.paymentFunctionCode
    reqObj.cifNo = this.chargesParam.cif;

    this.quickTransferObj.quickTransferAmountError="";
    if(Number(this.quickTransferObj.quickTransferAmount) > 2500){
      this.isLoadingCompelete = true;
      this.quickTransferObj.quickTransferAmountError="LBL_CUSTOMER_LIMIT_EXCEEDS_QUICK_TRANSFER_LIMIT";
    }else{
      this.paymentService.verifyQuickTransfer(reqObj).subscribe((resObj:any)=>{
        this.isLoadingCompelete = true;
        if(resObj){
          let verifyQuickTransObj=resObj.data
          this.isAccountVerified = false;
          // if(Number(this.quickTransferObj.quickTransferAmount)>Number(verifyQuickTransObj.proxyLimit)){
          //   this.quickTransferObj.quickTransferAmountError="LBL_ENTRD_AMT_ERROR";
          //   this.onNextVerify = false;
          // }else{
          //   this.onNextVerify = true;
          //   this.isAccountVerified = true;
          //   this.quickTransferObj.quickTransferMenuId = "IBAN";
          //   if(verifyQuickTransObj.quickTransferLimit){
          //     if((Number(this.quickTransferObj.quickTransferAmount)>Number(verifyQuickTransObj.quickTransferLimit))){
          //       this.displayLst=[this.quickTransferMenuList[0]]
          //     }else{
          //       this.displayLst=this.quickTransferMenuList
          //     }           
          //   }else{
          //     if((Number(this.quickTransferObj.quickTransferAmount)>Number(verifyQuickTransObj.proxyLimit))){
          //       this.displayLst=[this.quickTransferMenuList[0]]
          //     }else{
          //       c
          //     }
              
          //   }
          // }
          if(Number(verifyQuickTransObj.proxyLimit) === 0 || Number(verifyQuickTransObj.proxyLimit) === null){
            this.quickTransferObj.quickTransferAmountError="LBL_QUICK_TRANSFER_AMOUNT_VALIDATION";
          }       
          // As POWN SAID WE CHANGED FROM PROXYLIMIT TO QUICKTRANSFERLIMIT
          else if(Number(this.quickTransferObj.quickTransferAmount)>=Number(verifyQuickTransObj.quickTransferLimit)){
            this.quickTransferObj.quickTransferAmountError="LBL_PROXY_LIMIT_EXCEEDS";
          }
          else{
            
            this.onNextVerify = true;
              this.isAccountVerified = true;
              this.checkTransferLimit = false;
              this.quickTransferObj.quickTransferMenuId = "IBAN";
              //debugger;
              this.displayLst=this.quickTransferMenuList
              this.quickTransferObj.quickTransferAmountError="";
          }

          // AS POWN SAID
          // else if(Number(this.quickTransferObj.quickTransferAmount)>=Number(verifyQuickTransObj.proxyLimit)){
            
          //   if(Number(this.quickTransferObj.quickTransferAmount)<=Number(verifyQuickTransObj.sarieTransferLimit)){
          //   // debugger;
          //   // if(verifyQuickTransObj.BeneRegFlag){
          //   //   if(verifyQuickTransObj.BeneRegFlag === 'Y'){
          //     this.onNextVerify = true;
          //     this.isAccountVerified = true;
          //     this.quickTransferObj.quickTransferMenuId = "IBAN";
          //     //     this.displayLst=[this.quickTransferMenuList[0]];
          //     //   }else{
          //     // this.displayLst=this.quickTransferMenuList
          //     // this.quickTransferObj.quickTransferAmountError="LBL_ENTRD_AMT_ERROR";
          //     // this.onNextVerify = false;
          //     this.displayLst=[this.quickTransferMenuList[0]]
          //     this.quickTransferObj.quickTransferAmountError="";
          //     this.checkTransferLimit = true;
          //   // }           
          // // }
          //   }else{
          //     this.quickTransferObj.quickTransferAmountError="LBL_ENTRD_AMT_ERROR";
          //   }
            
          // }
          // else if (Number(this.quickTransferObj.quickTransferAmount)<=Number(verifyQuickTransObj.quickTransferLimit)){
          //     this.onNextVerify = true;
          //     this.isAccountVerified = true;
          //     this.checkTransferLimit = false;
          //     this.quickTransferObj.quickTransferMenuId = "IBAN";
          //     //debugger;
          //     this.displayLst=this.quickTransferMenuList
          //     this.quickTransferObj.quickTransferAmountError="";
          //   }  
          // else{
          //   this.quickTransferObj.quickTransferAmountError="LBL_QUICK_TRANSFER_QUICKTRANSFER_LIMIT_EXCEED";
          // }

        }
      }, () => {
        this.isLoadingCompelete = true;
      })
    }
  }
  getExexCharges(reqObj:any){
    this.isLoadingCompelete=false;
    reqObj.subProd = "BKSRNT";
    reqObj.funCode = "CRRNTS";
    reqObj.checkIpsFlag = this.toAccountDetails[0] ? this.toAccountDetails[0].IpsFlag :'';
    reqObj.conditionalAmount = Number(this.paymentAmount)
    this.paymentService.getExeCharges(reqObj).subscribe((exeRes:any)=>{
      if(exeRes){
        this.isLoadingCompelete=true;
        this.feeCharge=exeRes.data[0].chargeInfo[0].charge
        this.vatCharge=exeRes.data[0].chargeInfo[0].tax
        this.exeCCY=exeRes.data[0].chargeInfo[0].ccy

        let currencyFormatPipeFilter = new CurrencyFormatPipe();
        this.paymentAmtObj.fee = currencyFormatPipeFilter.transform(this.feeCharge, this.exeCCY);
        this.paymentAmtObj.vat = currencyFormatPipeFilter.transform(this.vatCharge, this.exeCCY);
        this.paymentAmtObj.ccy = this.exeCCY;

        this.chargeAmount = this.feeCharge;
        this.vatAmount = this.vatCharge;
      }
    })
  }
  getExecutionDetails(event:any){
    this.exeDetailsObj=event
    this.chargesParam.txnType=(this.exeDetailsObj.type).toUpperCase()
    if( this.exeDetailsObj.callflag==true){
      this.getExexCharges(this.chargesParam);
    }
  }

  getClonePaymentDebitAccount() {
    this.isLoadingCompelete = false;
    let reqObj = {
      moduleId:"PMTACCLKPDFT"
    }

    this.paymentService.getPaymentDebitAccountApiCall(reqObj).subscribe((response: any) => {
      if(response){
        this.isLoadingCompelete = true;
        this.debitData = response.DATA.ALL_RECORDS;
        for (let i in this.debitData) {         
          let crntAvail_amount = this.debitData[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = this.debitData[i].OD_CCY_CODE;
          let convtd_amount ='';
          if(crntAvail_amount && convtd_ccy){
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
             convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
             this.debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
             this.debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }               
        } 
        if(this.rootScopeData.localCloneTransactionObject.debitAccNo){
        for (let i = 0; i < this.debitData.length; i++) {
          if (this.rootScopeData.localCloneTransactionObject.debitAccNo === this.debitData[i].OD_ACC_NO) {
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
          "fieldDetails":[
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
                "dataKeySupport":"OD_CCY_CODE"
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
          if (this.rootScopeData.localCloneTransactionObject.benefAccNo === this.beneData[i].beneAccNo) {
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
      this.paymentAmtObj.amount =  this.rootScopeData.localCloneTransactionObject.paymentAmt.trim();
      this.paymentAmtObj.currency = debitCcy;
      this.paymentDetailsReceived(this.paymentAmtObj);
      this.getPurpose();
      this.paymentService.getBusinessDates(this.param).subscribe((res: any) => {
        this.isLoadingCompelete = true;
        if (res.dataValue) {
          this.getExexCharges(this.chargesParam);             
        //   let currentdate = new Date();
        //   let formatcurrentDate = this.datePipe.transform(currentdate,'dd/MM/yyyy')
        //   let firstBusinessDate = this.datePipe.transform(res.dataValue.businessDaysList[0].businessDay, 'MM/dd/yyyy');
        //  if(formatcurrentDate == firstBusinessDate)
        //   {
        //         delete res.dataValue.businessDaysList[0],
        //         delete res.dataValue.businessDaysList[1]
        //   }     
          this.businessDates = res.dataValue.businessDaysList;  
        }
      }, error => {
        this.isLoadingCompelete = true;
      })
      }    
    }, error => {
      this.showBeneData = false;
      this.isLoadingCompelete = true;
     })
  }

  hideProceedBtn(data: any): void {
    this.showProceed = data.hideProceedbtn;
   }
   getStatus(event:any){
    if(this.checkExchangeRateValidationFlag){
      this.disable=event
    }
    
  }

  getBankSwiftCode(data:any){
    this.bankSwiftCode = data.swithcode
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
        { type: 'title', value:this.translateService.instant('LBL_LOCAL_TRANSFER_RECEIPT'), x:85, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
        { type:'setTextColor', val1:255, val2:255, val3:255},
        { type:'setFontSize', size:10},
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
        { type:'setFontSize', size:10},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
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
        { type: 'text', value:this.toAccountDetails[0].aliasName ? this.toAccountDetails[0].aliasName : this.toAccountDetails[0].beneId, y:135},
        { type: 'text', value: currencyFormatPipeFilter.transform(this.debAmt, this.debitCcy) + ' ' + this.debitCcy ?  currencyFormatPipeFilter.transform(this.debAmt, this.debitCcy) + ' ' + this.debitCcy : '', y:145},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:155},
        { type: 'text', value: this.refNo ? this.refNo : '', y:155},
        { type: 'heading', value:this.translateService.instant('LBL_LOCAL_TRSFR__IS_INT_SUCCESS'), y:165},
        
      ]
      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'localTransfer.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'localTransfer.pdf'}
       )
      }
     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
