import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';

const AUTHORIZATION_ERROR_REQUIRED = 'Please Select the Approver';

@Component({
  selector: 'app-authorize-single-transfer',
  templateUrl: './authorize-single-transfer.component.html',
  styleUrls: ['./authorize-single-transfer.component.scss'],
})
export class AuthorizeSingleTransferComponent implements OnInit {
  secAuthRef: any;
  otpValue: string = '';
  receiptForm: boolean = false;
  invalidOtpError: string = '';
  receiptData: any;
  isLoadingComplete = true;
  authData: any;
  errorCode: string = '';
  // authOptions = [
  //   { AUTH_NAME: 'Any' },
  //   { AUTH_NAME: 'Abdus Kamal' },
  //   { AUTH_NAME: 'Abdul Rabo' },
  //   { AUTH_NAME: 'Abbas Fattah' },
  //   { AUTH_NAME: 'Adahm' },
  // ];
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferDetails = RootScopeData.myTaskSingleTransferPayment.summary;
  transferData=RootScopeData.myTaskSingleTransferPayment.details
  timeLeft: number = 30;
  interval:any;
  dispTime="00:30";
  disablBtn=false;
  transactionType: string = "DEBIT";
  transactionInputType: string = "INPUT_DEBIT_AMOUNT";
  exchangeRateObj:any;
  autherizationDetailsObj: any;
  authListArray: any = [];
  showAuthorization = false;
  showAuthentication = false;
  authError: string = "";
  authType: any;
  dispReset=false;
  sefAuthFlag:any
  pdfData: any;
  saveReceiptObject:any;
  rejectMsg: boolean = false;
  url: string = systemproperty.termsAndConditionsForPayments;
  constructor(
    private location: Location,
    private router: Router,
    private readonly myTaskService: MyTaskService,
    private translateService: TranslateService,
    private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {
    this.checkIfDataPresent();
    this.checkSecfactorAuth();
  }

  /**
   * @description check transfer details and redirect if no details
   */
  checkIfDataPresent(): void {
    if (!this.transferDetails) {
      this.onBackArrowClick();
    }else if(this.transferDetails && this.transferDetails.function_ID_DISPVAL==='International Fund Transfer'){
      this.getExchangeDetails();
    }
  }

  /**
   * set authorization data
   * @param authorizationData approver and note for authorization
   */
  getAuthorizationData(authorizationData: any): void {
    this.authData = authorizationData;
  }

  /**
   * @description redirect to previous page
   */
  onBackArrowClick(): void {
    this.location.back();
  }

  onSecondFactorValue(authValue: any) {
    let vAuthvalue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
  }

  /**
   * @description set otp for authentication
   * @param otp entered OTP
   */
  getOtpValue(otp: string): void {
    this.otpValue = otp;
  }

  /**
   * @description redirect for new transfer request
   */
  initiateAnotherRequest() {
    this.router.navigate(['/mytask/payment/single-payments']);
  }

  /**
   * @description check input fields and set receipt data if no errors
   */
  onClickSubmit() {
    if(this.transferDetails && this.transferDetails.function_ID_DISPVAL==='International Fund Transfer'){
      clearInterval(this.interval); 
    }
    // const isApproverDataValid = this.authData ? true : false;
    const isOtpValid =
      this.otpValue && this.otpValue.length === 4 ? true : false;
    // if (isOtpValid) {
      this.isLoadingComplete = false;
      const details = this.rootScopeData.myTaskSingleTransferPayment;
      this.myTaskService
        .authorizeSingleTransfer({
          // param1: this.otpValue,
          // param2: this.secAuthRef,
          //sending empty otp value and ref num
          param1: '',
          param2: this.secAuthRef,
          rejectReason: '',
          referenceNumber: details.summary.ref_NO,
          product: details.summary.product_CODE,
          subProduct: details.summary.subprcode,
          action: details.summary.function_ID,
          hostCode: details.summary.host_TXN_CODE,
          version: details.summary.version_NO,
          refNo:this.exchangeRateObj?this.exchangeRateObj.rateRefNo:"",
          PARSED_RULE_ID:this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover
                    ? this.autherizationDetailsObj.selectedAprover.OD_RULE_PARSE_ID
                    : '',
    	  SELECTION_FLAG:this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover ? 'Y' : '',
          sefAuthFlag: this.sefAuthFlag,
          USER_NUMBER_LIST: this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover
                      ? this.autherizationDetailsObj.selectedAprover.OD_USER_NO
                      : '',
           remarks: !this.autherizationDetailsObj ? '' : !this.autherizationDetailsObj.aproveNote ? '':this.autherizationDetailsObj.aproveNote
        })
        .subscribe(
          (res:any) => {
            this.setReceiptData(res.dataValue);
            this.receiptForm = true;
            this.isLoadingComplete = true;
          },
          () => {
            this.receiptForm = false;
            this.isLoadingComplete = true;
          }
        );
    // } else {
      // if (!isOtpValid) {
      // this.invalidOtpError = 'LBL_PLS_ENTER_OTP';
      // }
      // if (!isApproverDataValid) {
      //   this.errorCode = AUTHORIZATION_ERROR_REQUIRED;
      // }
    // }
  }

  /**
   * @description set the data for transfer receipt
   */
  setReceiptData(data:any): void {
    let flexiAuth = {
      "title": 'LBL_AUTHORIZATION',
      "isTable": 'false',
      "data": '',
      "fieldDetails": [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": !this.autherizationDetailsObj ? 'Not Provided' : !this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? 'Not Provided' : this.autherizationDetailsObj.selectedAprover.AUTH_NAME
        },
        {
          "dispKey": "LBL_ADD_NEXT_APROVER",
          "dataKey": !this.autherizationDetailsObj ? 'Not Provided' : !this.autherizationDetailsObj.aproveNote ? 'Not Provided':this.autherizationDetailsObj.aproveNote
        },
      ],
    }
    let message1 :any;
    let message2 :any;
    let rejectReasonFromAPi : any;
    let journalId :any;
    let showAuth : boolean = false;
    this.rejectMsg = false;
    let UTIReference :any;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
      journalId = data.JOURNAL_ID;
      if(data.UTI_REFERENCE=== "null"){
        UTIReference = "";
      }else{
        UTIReference = data.UTI_REFERENCE
      }
    }else if(data.TXN_STATUS=== "RH"){
      message1 = "LBL_PAYMENT_UNSUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      this.rejectMsg = true;
      rejectReasonFromAPi = data.OD_REJECT_REASON;
    }else if(data.TXN_STATUS=== "IO"){
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED_AND_SENT_FOR_ADDITIONAL_APPROVAL";
      showAuth = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }
    
      // if(data.TXN_STATUS=== "AH"){
      //   journalId = data.JOURNAL_ID
      // }
    
    this.receiptData = {
      msg1: message1,
      msg2: message2,
      journalId:journalId ? journalId : "",
      rejectReason: rejectReasonFromAPi ? rejectReasonFromAPi : "",
      referenceNumber: this.transferDetails.ref_NO,
      UTIReference: UTIReference ? UTIReference : "",
      authorizeButtonRouterPath: '/mytask/serviceRequest',
      finishButtonRouterPath: '/dashboard',
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.transferDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_NAME',
              dataKey: this.transferDetails.maker_NAME,
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.transferDetails.debit_ACC_NO,
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: this.getConvertedCurrency(
                this.transferDetails.debit_AMOUNT,
                this.transferDetails.payment_CURRENCY
              ),
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
        buttonLabel: 'LBL_MAKE_ANOTHER_AUTHORIZATION',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    if (showAuth) {
      this.receiptData.receiptDetails.push(flexiAuth);
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_SINGLE_BENEFICIARY"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant(message2),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Name",
          "subValue": this.transferDetails.maker_NAME ? this.transferDetails.maker_NAME : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.transferDetails.debit_ACC_NO ? this.transferDetails.debit_ACC_NO : "--"
        },
        {
          "subHead": "Amount",
          "subValue": this.getConvertedCurrency(
                this.transferDetails.debit_AMOUNT,
                this.transferDetails.payment_CURRENCY
              ) ? this.getConvertedCurrency(
                this.transferDetails.debit_AMOUNT,
                this.transferDetails.payment_CURRENCY
              ) : "--"
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
      "pagecall":"singletransferauth",
      "refNo":this.transferDetails.ref_NO ?this.transferDetails.ref_NO :"--"
    }
  }

  /**
   * @description transform the transfer amount based on the currency value
   * @param amount amount to be transformed
   * @param currency currency of the transfer
   * @returns {string} amount transformed according to currency
   */
  getConvertedCurrency(amount: string, currency: string): string {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    return `${currencyFormatPipeFilter.transform(
      amount,
      currency
    )} ${currency}`;
  }
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
       this.dispTime=this.timeLeft>9?"00:"+this.timeLeft:"00:0"+this.timeLeft
      } else {
        clearInterval(this.interval); 
        this.disablBtn=true  
        this.dispReset=true 
        this.timeLeft=0;
        this.dispTime="00:00"
      }
    },1000)
  }

  getExchangeDetails(){
    this.isLoadingComplete=false
    let debitCcyCode = this.transferDetails && this.transferDetails.debitCurrency ? this.transferDetails.debitCurrency : "";
    let paymentCurrency=this.transferDetails &&  this.transferDetails.payment_CURRENCY ? this.transferDetails.payment_CURRENCY : "";
    if(debitCcyCode != paymentCurrency){
      this.transactionType = "CREDIT";
      this.transactionInputType = "INPUT_CREDIT_AMOUNT";
    }else{
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
    }
    let params={
      transactionType:"",
      transactionInputType:"",
      paymentAmount:"",
      debitCountryCode:"",
      debitCifNo:"", 
      debitAccNo:"",
      debitCurrencyCode:"",
      debitUnitId:"",
      paymentCurrency:"",
      subProduct:"",
      functionCode:""
    }
    params.transactionType=this.transactionType;
    params.transactionInputType=this.transactionInputType;
    params.paymentAmount=this.transferDetails && this.transferDetails.payment_AMOUNT
    params.debitCountryCode=this.transferData && this.transferData.debitCountryCode ? this.transferData.debitCountryCode : "";
    params.debitCifNo=this.transferData && this.transferData.cifNo ? this.transferData.cifNo : "";
    params.debitAccNo=this.transferDetails && this.transferDetails.debit_ACC_NO ? this.transferDetails.debit_ACC_NO : "";
    params.debitCurrencyCode=this.transferDetails && this.transferDetails.debit_CURRENCY ? this.transferDetails.debit_CURRENCY : "";
    params.debitUnitId=this.transferData && this.transferData.unitId ? this.transferData.unitId : "";
    params.paymentCurrency=paymentCurrency
    params.subProduct=this.transferData && this.transferData.subProduct ? this.transferData.subProduct : "";
    params.functionCode=this.transferData && this.transferData.functionCode ? this.transferData.functionCode : "";
  
    this.myTaskService.getExchangeRateApiCall(params).subscribe((res:any)=>{
   
      if(res && res.data){
        //add the code
        this.exchangeRateObj=res.data[0]
        this.dispReset=false;
        this.disablBtn=false;
        this.startTimer()
      }
      this.isLoadingComplete=true
    },error => {
      clearInterval(this.interval)
      this.dispReset=true;
      this.disablBtn=true;
      this.isLoadingComplete = true;
    })
  }

  checkSecfactorAuth() {
    let reqObj = {
      amount: "",
      gcif: "",
      accNo: "",
      debitCurrency: "",
      pymntCurrency: "", //?????
      subProdCode: "",
      debitUnitId:"",
      funcCode:"",
      productCode:"",
      referenceNo:"",
      cif:''
    }
    reqObj.amount = this.transferDetails ? this.transferDetails.debit_AMOUNT : "";
    reqObj.gcif = this.transferDetails ? this.transferDetails.gcif:"";
    reqObj.accNo = this.transferDetails ?this.transferDetails.acc_NO:"";
    reqObj.debitCurrency = this.transferDetails ? this.transferDetails.debit_CURRENCY : "";
    reqObj.pymntCurrency = this.transferDetails ? this.transferDetails.payment_CURRENCY : "";
    reqObj.debitUnitId = this.transferData ? this.transferData.unitId : "";
    reqObj.referenceNo = this.transferDetails ? this.transferDetails.ref_NO : "";
    reqObj.productCode = this.transferDetails ? this.transferDetails.product_CODE : "";
    reqObj.subProdCode = this.transferDetails ? this.transferDetails.subprcode:"";
    reqObj.funcCode = this.transferData ? this.transferData.functionCode:"";
    reqObj.cif = this.transferDetails ? this.transferDetails.cifNo:"";

    // reqObj.paymentAmount = this.chequeaddressCharge ? this.chequeaddressCharge : "";
    // reqObj.debitCifNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].COD_CORECIF ? this.fromAccountDetails[0].COD_CORECIF : "";
    // reqObj.debitPortalAccNo = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_PORTAL_ACC_NO ? this.fromAccountDetails[0].OD_PORTAL_ACC_NO : "";
    // reqObj.debitCurrencyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    // reqObj.beneCurrencyCode = this.fromAccountDetails && this.fromAccountDetails[0] && this.fromAccountDetails[0].OD_CCY_CODE ? this.fromAccountDetails[0].OD_CCY_CODE : "";
    // reqObj.subProduct = "CHEQUES";

    this.myTaskService.checkAuthorizationData(reqObj).subscribe((response: any) => {
      if (response) {       
        this.sefAuthFlag = response.data.selfAuth  
        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.authListArray = response.data.authList;
        }
      }
    }, error => {

    }

    )
  }

  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }
  restTimmer(event?:any){
    clearInterval(this.interval)
    this.timeLeft=30;
    this.checkIfDataPresent()
    this.dispReset=false
    this.disablBtn=false 
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
        { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_SINGLE_TRANSFER"), x:80, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_NAME'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:95},       
        { type: 'text', value:this.transferDetails.maker_NAME? this.transferDetails.maker_NAME : '', y:75},
        { type: 'text', value:this.transferDetails.debit_ACC_NO? this.transferDetails.debit_ACC_NO : '', y:85},
        { type: 'text', value: currencyFormatPipeFilter.transform(this.transferDetails.debit_AMOUNT, this.transferDetails.payment_CURRENCY) + ' ' + this.transferDetails.payment_CURRENCY ?  currencyFormatPipeFilter.transform(this.transferDetails.debit_AMOUNT, this.transferDetails.payment_CURRENCY) + ' ' + this.transferDetails.payment_CURRENCY : '', y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
        { type: 'text', value: this.transferDetails.ref_NO ? this.transferDetails.ref_NO : '', y:115},
        { type: 'heading', value:this.translateService.instant('LBL_APPROVED_STMT'), y:125},
        
      ]
      // debugger;

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'Authorize-SingleTransfer.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'Authorize-SingleTransfer.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
  back(): void {
    this.router.navigate(['/mytask/payment/single-payments'])
  }
}
