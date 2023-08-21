import { Component, OnInit, OnDestroy } from '@angular/core';
import { RootScopeDeclare } from '../../../rootscope-declare';
import { RootScopeData } from '../../../rootscope-data';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-esal-payer',
  templateUrl: './add-esal-payer.component.html',
  styleUrls: ['./add-esal-payer.component.scss'],
})
export class AddESALPayerComponent implements OnInit, OnDestroy {
  rootScopeData: RootScopeDeclare = RootScopeData;

  receiptData: any;
  isProceed = false;
  finalSubmit: boolean = false;
  proceed = false;
  showAddEsalPayer: boolean = true;
  clearForm: boolean = false;
  payerDetails = {
    payerId: '',
    payerIdError: '',
    shortName: '',
    shortNameError: '',
    fullName: '',
    fullNameError: '',
  };
  authorizationDetails = {
    authorizer: '',
    note: '',
  };
  authorsList: string[] = [];
  authorError: string = '';
  isLoadingComplete: boolean = true;
  showAuthorization: boolean = false;
  showAuthentication: boolean = false;
  otpError: string = '';
  secondFactorAuthRef: string = '';
  otpValue: string = '';
  isPayerFormInvalid: boolean = false;
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
  refNo : any;
  saveReceiptObject:any;
  authType: any;
  rejectMsg: boolean = false;
  checkPayerIDBtnValid: boolean = true;
  constructor(private readonly sadadService: SadadPaymentService, private downloadAsPdf:downloadAsPdf, private readonly translateService: TranslateService) {}

  ngOnInit(): void {
    this.url = systemproperty.termsAndConditionsForStopPayment;
  }

  setPayerDetails(details: any): void {
    this.payerDetails.payerId = details.payerId;
    this.payerDetails.fullName = details.fullName;
    this.payerDetails.shortName = details.shortName;
    if(!this.payerDetails.payerId){
      this.checkPayerIDBtnValid = true;
    }
  }

  onSecondFactorValue(secondFactorDetails: any): void {
    this.secondFactorAuthRef = secondFactorDetails.data.secfRefNo;
  }

  getOtpValue(otpDetails: any): void {
    this.otpValue = otpDetails;
    this.onSubmit();
  }

  proceedNext() {
    const payerDetails = this.payerDetails;
    this.isPayerFormInvalid = false;
    if (
      !payerDetails.payerId ||
      payerDetails.payerIdError ||
      !payerDetails.fullName ||
      !payerDetails.shortName
    ) {
      this.isPayerFormInvalid = true;
    }
    if (this.isPayerFormInvalid) {
      this.setErrors();
    } else {
      this.initReqParam.amt="0";
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode="PAYRMAIN";
      this.initReqParam.unitId="IGTBSA";
  
      this.getAuthorizers();
      this.proceed = true;
      this.finalSubmit = true;
      this.isProceed = false;
      this.rootScopeData.addEsalPayerReviewMode = true;
    }
  }

  setErrors(): void {
    const payerDetails = this.payerDetails;
    if (!payerDetails.payerId) {
      this.payerDetails.payerIdError = 'LBL_PAYER_ID_ERROR';
    }
    if (!payerDetails.shortName) {
      this.payerDetails.shortNameError = 'LBL_PAYER_ALIAS_ERROR';
    }
    if (!payerDetails.fullName) {
      this.payerDetails.fullNameError = 'LBL_PAYER_NAME_ERROR';
    }
  }

  getAuthorizers(): void {
    this.isLoadingComplete = false;
   let params={
    debitCifNo:"",
    vsubprdtcode:"PAYRMAIN",//PAYRMAIN
    funCode:"PAYCRET", //PAYCRET
    paymentAmount:"0",
    debitPortalAccNo:"",
    debitCurrencyCode:"",
    unitID:"IGTBSA"

    }
    this.sadadService.selfAuthCheck(params).subscribe(
      (response: any) => {
        this.isLoadingComplete = true;
        if (response) {
          if (response.data.selfAuth == 'true') {
            this.showAuthentication = true;
          }
          if (response.data.flexiAuth == 'true') {
            this.showAuthorization = true;
            this.authorsList = response.data.authList;
          }
        }
      },
      () => {
        this.showAuthentication = false;
        this.showAuthorization = false;
        this.isLoadingComplete = true;
      }
    );
  }

  setAuthorizationData(authorDetails: any): void {
    this.authorizationDetails.authorizer =
      authorDetails.selectedAprover.AUTH_NAME;
    this.authorizationDetails.note = authorDetails.aproveNote;
  }

  clearClick() {
    this.checkPayerIDBtnValid = true;
    this.clearForm = !this.clearForm;
    this.payerDetails = {
      payerId: '',
      payerIdError: '',
      shortName: '',
      shortNameError: '',
      fullName: '',
      fullNameError: '',
    };
  }

  refresh() {
    this.rootScopeData.addEsalPayerReviewMode = false;
    this.proceed = false;
    this.finalSubmit = false;
    this.otpError = '';
    this.otpValue = '';
    this.secondFactorAuthRef = '';
  }

  onSubmit() {
    let isFormValid = true;
    if (!this.otpValue || this.otpValue.length !== 4) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      isFormValid = false;
      return;
    }
    if (isFormValid && !this.isPayerFormInvalid) {
      this.sadadService.submitEsalPayer({payerId: this.payerDetails.payerId,fullName: this.payerDetails.fullName,shortName: this.payerDetails.shortName,otp: this.otpValue,otpRef: this.secondFactorAuthRef,AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''})
        .subscribe(
          (response: any) => {
            if (response && response.dataValue) {
              if(response.dataValue.OD_STATUS_DESC === "Failed"){
                this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
                // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
              }else{
              this.isProceed = true;
              this.showAddEsalPayer = false;
              this.refNo = response.dataValue.INPUT_REFERENCE_NO;
              this.constructReceiptData(response.dataValue.INPUT_REFERENCE_NO,response.dataValue);
              }
            }
          },
          () => {
            this.showAddEsalPayer = true;
          }
        );
    }
  }

  constructReceiptData(refNumber: any,data:any) {
    let flexiAuth ={
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey:
            this.authorizationDetails &&
            this.authorizationDetails.authorizer
              ? this.authorizationDetails.authorizer
              : 'Not Provided',
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey:
            this.authorizationDetails && this.authorizationDetails.note
              ? this.authorizationDetails.note
              : 'Not Provided',
        },
      ],
    }

    // var message2 :any;
    // var rejectReasonFromAPi : any;
    // let journalId :any;
    // if(data.TXN_STATUS=== "AH"){
    //   message2 = "LBL_YOUR_ESAL_PAYMENT_REQUEST_IS_PROCESSED_SUCCESS";
    //   journalId = data.JOURNAL_ID;
    // }else if(data.TXN_STATUS=== "RH"){
    //   message2 = "LBL_YOUR_ESAL_PAYMENT_REQUEST_IS_REJECTED";
    //   rejectReasonFromAPi = data.OD_REJECT_REASON;
    // }else{
    //   message2 = "LBL_ESAL_PAYER_ADDED_IS_INT_SUCCESS";
    // }

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
      message2 = "LBL_ESAL_PAYER_ADDED_IS_INT_SUCCESS";
    }else{
      message1 = "LBL_PAYMENT_SUCCESSFULL";
      message2 = "LBL_ESAL_PAYER_ADDED_IS_INT_SUCCESS";
    }


    this.receiptData = {
      msg1: message1,
      // msg2: 'LBL_ESAL_PAYER_ADDED',
      msg2: message2,
      rejectReason: rejectReasonFromAPi ? rejectReasonFromAPi : "",
      referenceNumber: refNumber,
      receiptDetails: [
        {
          title: 'LBL_PAYER_DETAILS',
          isTable: 'true',
          data: [this.payerDetails],
          fieldDetails: [
            {
              dispKey: 'LBL_PAYER_ID',
              dataKey: 'payerId',
            },
            {
              dispKey: 'LBL_PAYER_SHORT_NAME',
              dataKey: 'shortName',
            },
            {
              dispKey: 'LBL_PAYER_FULL_NAME',
              dataKey: 'fullName',
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
          "subHead": "Payer Details",
          "subValue": ""
        },
        {
          "subHead": "PayerId",
          "subValue": this.payerDetails.payerId ?  this.payerDetails.payerId : "--"
        },
        {
          "subHead": "Payer Short Name",
          "subValue": this.payerDetails.shortName ? this.payerDetails.shortName :"--"
        },
        {
          "subHead": "Payer Full Name",
          "subValue": this.payerDetails.fullName ? this.payerDetails.fullName:"--"
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        }
      ],
      "pagecall":"esalbiller",
      "refNo":refNumber
    }

  }

  initializeAnotherTransaction(): void {
    this.rootScopeData.addEsalPayerReviewMode = false;
    this.showAddEsalPayer = true;
    this.proceed = false;
    this.showAuthentication = false;
    this.showAuthorization = false;
    this.finalSubmit = false;
    this.clearClick();
  }

  ngOnDestroy(): void {
    this.rootScopeData.addEsalPayerReviewMode = false;
  }
  downloadPdf(values:any)
      { 
        let SelectedType = values;
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_ESAL_PAYER_RECEIPT'), x:85, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_PAYER_DETAILS'), y:65},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_PAYER_ID'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_PAYER_SHORT_NAME'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_PAYER_FULL_NAME'), y:95},
        { type: 'text', value:this.payerDetails.payerId ? this.payerDetails.payerId : '', y:75},
        { type: 'text', value:this.payerDetails.shortName ? this.payerDetails.shortName : '', y:85},
        { type: 'text', value:this.payerDetails.fullName? this.payerDetails.fullName : '', y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:105},
        { type: 'text', value: this.refNo ? this.refNo : '', y:105},
        { type: 'heading', value:this.translateService.instant('LBL_ESAL_PAYER_ADDED_IS_INT_SUCCESS'), y:115},
        
      ]

      //   this.pdfData.push(
      //     { type: 'save', value:'ESALpayer.pdf'}
      //  )

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'ESALpayer.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'ESALpayer.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
  getAuthType(val: any) {
    this.authType = val
  }

  emitPayerValidationBtn(even:any){
    this.checkPayerIDBtnValid = even;
  }
}
