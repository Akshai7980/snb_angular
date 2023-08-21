import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { EpayServiceService } from '../../services/epay-service.service';

@Component({
  selector: 'app-e-pay-transactions',
  templateUrl: './e-pay-transactions.component.html',
  styleUrls: ['./e-pay-transactions.component.scss']
})
export class EPayTransactionsComponent implements OnInit {
  showReceipt : boolean = false;
  review : boolean = false;
  debitAccountDetailsObj : any;
  clearFlag : boolean = false;
  searchShownFlag : boolean = true;
  norecordflag : boolean = false;
  isLoadingCompelete : boolean = false;
  debitData : any;
  merchantData:any
  rootScopeData: RootScopeDeclare = RootScopeData;
  showMerchantDetails : boolean = false;
  fromAccountDetails : any = [];
  merchantDetails : any = [];
  merchantDetailsObj : any;
  merchantClearFlag : boolean = false;
  showTransactiion : boolean = false;
  transactionData:any;
  transactionDetailsObj:any;
  grandTotal:any;
  showClaimDetais : boolean = false;
  showAuthorization : boolean =false;
  showAuthentication : boolean =false;
  claimDetails={
    claimType:'',
    desc:''
  }
  claimsTypes = ['Amount Type 1','Amount Type 2'];
  claimTypeErr : boolean = false;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:"",
    ccy:""
  } 
  authError:string='';
  authListArray:any;
  autherizationDetailsObj:any;
  secAuthRef:any;
  otpError:any;
  userOtpValue:any;
  receiptData:any;
  constructor(private epayService:EpayServiceService, private translateService:TranslateService) { }

  ngOnInit(): void {
    this.getPaymentDebitAccount()
  }
  getPaymentDebitAccount() {
    this.norecordflag = false;
    this.isLoadingCompelete = false;
    // console.log(this.rootScopeData?.userInfo,"TESTLL:::::")
    let reqObj = {
      moduleId: "EPYSTACCLKUP"
    }
    this.epayService.epayDebitAccount(reqObj).subscribe((response: any) => {
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
          "title": "LBL_ACCOUNT",
          "data": this.debitData,
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
              "dataKeySupport": "OD_CCY_CODE"
            }
          ]
        };
      }
    }, error => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }
  afterFromAccountSelection(event:any){
    if (event == 'iconClick') {
      this.debitAccountDetailsObj = "";
      this.getPaymentDebitAccount();
      this.showMerchantDetails=false;
      this.showTransactiion = false;
      this.showClaimDetais=false
    } else {
      this.fromAccountDetails[0] = event;
      this.clearFlag = false;
     
      this.getMerchantAccount();
    }
  }
  afterMerchantAccountSelection(event :any){
    if (event == 'iconClick') {
      this.merchantDetailsObj = "";
      this.getMerchantAccount();
      this.showTransactiion = false;
      this.showClaimDetais=false;
      this.merchantDetails=[];
    } else {
      this.merchantDetails[0] = event;
      this.merchantClearFlag = false;
      this.getTransactionData();
      

    }
  }
  getMerchantAccount(){
    this.norecordflag = false;
    this.isLoadingCompelete = false;
    let reqObj = {
        "moduleId": "EPYSRCH",
        "productName": "CORESVS",
        "subProductName": "EPYSTS",
        "functionCode": "EPYSTSFNC",
        "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
        "accNo": this.debitData[0]?.OD_ACC_NO ? this.debitData[0]?.OD_ACC_NO : ""
      };
    // let param={
    //   unitId: this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
    //   accNo: this.debitData?.OD_ACC_NO ? this.debitData?.OD_ACC_NO : ""
    // };
    this.epayService.getEPayMerchantList(reqObj).subscribe((resp:any)=>{
      if(resp){
        this.isLoadingCompelete = true;
        this.showMerchantDetails=true;
        this.merchantData = resp.data?.merchants;
    // this.epayService.getMerchantData(reqObj).subscribe((response: any) => {
    //   if (response) {
    //     this.isLoadingCompelete = true;
    //     this.showMerchantDetails=true;
    //     this.merchantData = response.DATA.ALL_RECORDS;
        this.merchantDetailsObj = {
          "title": "LBL_SLCT_MERCHANT",
          "data": this.merchantData,
          "fieldDetails": [
            {
              "dispKey": "LBL_MERCHANT_NAME",
              "dataKey": "merchantEnglishName"
            },
            {
              "dispKey": "LBL_MERCHANT_ID",
              "dataKey": "merchantNumber"
            },
          ]
        };
      }else{
        this.isLoadingCompelete=true
      }
    }, error => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }
  getTransactionData(){
    // console.log(this.merchantDetails[0],"this.merchantDetails[0]:::::::::TEST::::::::")
    this.isLoadingCompelete=false;
    let param={
      unitId:this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
      transactionReference:"",
      reconciliationFromDate:"",
      reconciliationToDate:"",
      authorizationNumber: '',
      settled: "",
      dateSort:"",
      pageSize:"",
      pageNumber:"",
      offlineReport:true,
      offlineReportOwner:this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : ''
    };
    this.epayService.getEpayTransactions(param).subscribe((res:any)=>{
      this.isLoadingCompelete=true;
      
      if(res && res.dataValue && res.dataValue.ecommerceTransactionsList.ecommerceTransactions.length>0){
        this.transactionData = res.dataValue.ecommerceTransactionsList.ecommerceTransactions;
        // for (let i in this.transactionData) {         
        //   let crntAvail_amount = this.transactionData[i].amount;
        //   let convtd_ccy = this.transactionData[i].ccyCode;
        //   let convtd_amount ='';
        //   if(crntAvail_amount && convtd_ccy){
        //     let currencyFormatPipeFilter = new CurrencyFormatPipe();
        //      convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
        //      this.transactionData[i].amount = convtd_amount;
        //   }               
        // } 
        this.showTransactiion = true;
      }

    },err=>{
      this.isLoadingCompelete=true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }
  getTransactionDetails(event:any, field:any){
    if(field === "details"){
      this.transactionDetailsObj = event;
      this.showClaimDetais = true;
    }else if(field === 'total'){
      this.grandTotal=event;
      this.showClaimDetais = true;
    }else if(field === 'clear' && event){
      this.showClaimDetais = false;
      this.showTransactiion = false;
      this.merchantDetailsObj = "";
      this.grandTotal='';
      this.transactionDetailsObj=''
      this.getMerchantAccount();
    }else if( field === 'refresh'){
      this.transactionData = '';
      this.getTransactionData(); 
    }
  }
  initTransactions(){
    this.showReceipt  = false;
    this.review = false;
    this.debitAccountDetailsObj = '';
    this.clearFlag  = false;
    this.merchantData = '';
    this.showMerchantDetails = false;
    this.merchantDetailsObj ='';
    this.merchantClearFlag = false;
    this.showTransactiion = false;
    this.transactionDetailsObj = '';
    this.grandTotal = '';
    this.showClaimDetais = false;
    this.showAuthorization =false;
    this.showAuthentication =false;
    this.claimDetails={
      claimType:'',
      desc:''
    }
    this.claimTypeErr = false;
    this.authError = '';
    this.otpError = '';
    this.getPaymentDebitAccount()

  }
  onClickCancel(){
    this.showTransactiion = false;
    this.showClaimDetais=false;
    this.transactionData='';
    this.getTransactionData();
    this.showAuthentication=false;
    this.showAuthorization=false;
    this.clearAuthData();
    this.claimDetails.claimType='';
    this.claimDetails.desc='';
    this.review=false;
  }
  cancel(){
    this.showTransactiion = false;
    this.merchantData='';
    this.merchantDetailsObj='';
    this.debitAccountDetailsObj = "";
    this.getPaymentDebitAccount();
    this.showMerchantDetails= false;
  }
  onSltChange(event:any){
    this.claimTypeErr=false
  }
  proceedNext(){
    if(!this.claimDetails.claimType){
      this.claimTypeErr = true;
    }else{
      this.review = true;
      this.rootScopeData.changeHeading = "Review";
      this.checkSecfactorAuth();
      this.showAuthorization  =true;
      this.showAuthentication  =true;
    }
  }
  clearAuthData(){
    this.autherizationDetailsObj = "";
    this.userOtpValue = "";
    this.otpError = "";
    this.authError = "";
  }
  autherizationDetailsReceived(autherizationDetailsObj:any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    if(otpValue){
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.submit();
    }else{
      this.userOtpValue = "";
    }
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

    this.epayService.selfAuthCheck(reqObj).subscribe((response: any) => {
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
      }
    )
  }
  submit(){
    // let isOtpValid = true;
    // if (this.showAuthentication ) {
    //   if (!this.userOtpValue || this.userOtpValue.length !== 4) {
    //     this.otpError = "LBL_PLS_ENTER_OTP";
    //     isOtpValid = false;
    //     return;
    //   }
    // }
    //  if(isOtpValid){
    //   this.isLoadingCompelete=false;
    //   let param;
    //   this.showAuthorization = false;
    //   this.showAuthentication = false;
    //   this.epayService.sbmitEpayApi(param).subscribe((response:any)=>{
    //     this.isLoadingCompelete = true;    
    //     if(response){
    //       if(response.dataValue.OD_STATUS_DESC === "Failed"){
    //         this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
    //       }else {
    //         this.showAuthorization = false;
    //         this.showAuthentication = false;
    //         this.showTransactiion =false;
    //         this.showClaimDetais =false;
    //         this.showMerchantDetails=false;
    //         this.rootScopeData.changeHeading = "";
    //         let refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
    //         this.constructReceiptData(refNo);
    //         this.clearAuthData();
    //         this.showReceipt= true;
    //       }
    //     }else{
    //       this.isLoadingCompelete = true;    
    //       this.rootScopeData.showSystemError = true;
    //     }
    //   }, error => {
    //     this.isLoadingCompelete = true;
    //   })
    // }
  }
  constructReceiptData(refNumber: any){
    // let approver = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME : this.translateService.instant("LBL_NOT_PROVIDED");
    // let approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : this.translateService.instant("LBL_NOT_PROVIDED");
    // let flexiAuth = {
    //   "title": "LBL_AUTHORIZATION",
    //   "isTable": "false",
    //   "fieldDetails": [
    //     {
    //       "dispKey": "LBL_Next_Approver",
    //       "dataKey": approver
    //     },
    //     {
    //       "dispKey": "LBL_ADD_NEXT_APROVER",
    //       "dataKey": approverNote
    //     }
    //   ]
    // }
    // let status = {
    //   "title": "LBL_STATUS_DETAILS",
    //   "isTable": "false",
    //   "fieldDetails": [
    //     {
    //       "dispKey": "LBL_STATUS",
    //       "dataKey": 'Success'
    //     },
    //     {
    //       "dispKey": "LBL_RESPONSE",
    //       "dataKey": 'TICNO868675'
    //     }
    //   ]
    // }
    // this.receiptData = {
    //   "msg1": "LBL_REQ_SUCCESSFUL",
    //   "msg2": "LBL_MERCHANT_CLAIM_PENDING_MSG",
    //   "referenceNumber": refNumber,
    //   "receiptDetails": [
    //     {
    //       "title": "LBL_TRANSACTION_DETAILS",
    //       "isTable": "true",
    //       "data": this.transactionDetailsObj,
    //       "fieldDetails": [
    //         {
    //           "dispKey": "LBL_REF_NUMBER",
    //           "dataKey": "refNo"
    //         },
    //         {
    //           "dispKey": "LBL_CARD_NO",
    //           "dataKey": "cardNo"
    //         },
    //         {
    //           "dispKey": "LBL_DATE",
    //           "dataKey": "date"
    //         }
    //       ]
    //     },
    //     {
    //       "title": "LBL_REQUEST_DETAILS",
    //       "isTable": "false",
    //       "data": this.claimDetails,
    //       "fieldDetails": [
    //         {
    //           "dispKey": "LBL_CLAIM_TYPE",
    //           "dataKey": this.claimDetails.claimType
    //         },
    //         {
    //           "dispKey": "LBL_CLAIM_DESCRIPTION",
    //           "dataKey": this.claimDetails.desc ? this.claimDetails.desc : 'Not Provided' 
    //         }
    //       ]
    //     }        
    //   ],
    //   "printButton": {
    //     "buttonLabel": "LBL_PRINT_RECEIPT",
    //     "buttonIcon": "./assets/images/PrinterIcon.png"
    //   },
    //   "saveButton": {
    //     "buttonLabel": "LBL_SAVE_RECEIPT",
    //     "buttonIcon": "./assets/images/saveReceipt.svg"
    //   },
    //   "initiateButton": {
    //     "buttonLabel": "LBL_INITIATE_ANOTHER_REQUEST"
    //   },
    //   "finishButton": {
    //     "buttonLabel": "LBL_FINISH",
    //     "buttonPath": "/dashboard"
    //   }
    // };
    // if (approver) {
    //   this.receiptData.receiptDetails.push(flexiAuth);
    // }if(this.rootScopeData.userInfo.isSingleUser==='Y'){
    //   this.receiptData.receiptDetails.push(status);
    // }
  }
  downloadPdf(){

  }
}
