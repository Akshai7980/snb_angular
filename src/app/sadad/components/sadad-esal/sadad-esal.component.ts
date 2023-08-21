import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
@Component({
  selector: 'app-sadad-esal',
  templateUrl: './sadad-esal.component.html',
  styleUrls: ['./sadad-esal.component.scss'],
})
export class SadadEsalComponent implements OnInit {
  debitDataObj: any;
  selectedDebitObj: any;
  isLoadingComplete = true;
  isProceed = false;
  selectedESALTo: any;
  resetRemain = false;
  amountDetailsObj: any;
  amount = 0;
  pmtType: any;
  amountToPass = '';
  authDataObj: any;
  total = '';
  receiptData: any;
  fieldSet: any;
  hideAll = false;
  errorCode: any;
  authOptions: any;
  otpError: string = '';
  otpValue: string = '';
  secAuthRef: string = '';
  additionalData = { date: null, paymentDetails: '', customerRef: '' };
  paymentAmtObj: any = {
    amount: '',
    currency: 'SAR',
    amountError: '',
    currencyError: '',
    exchangeRate: '',
    fee: '',
    vat: '',
    ccy: 'SAR',
    debitAmount: '',
    debitCurrency: '',
  };
  displayAdditionalDetailsForm = true;
  payerId: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  functionCode: any;
  subProdCode: any;
  creditToEntitlementTabs: any;
  isLoadingCompelete: boolean = true;
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
  showAuthorization: boolean = false;
  showAuthentication : boolean = false;
  saveReceiptObject:any;
  authType: any;
  rejectMsg: boolean = false;
  constructor(
    private readonly sadadService: SadadPaymentService,
    private readonly datePipe: DatePipe,
    private readonly translateService: TranslateService,
    private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {
    this.getDebitData();
    this.url = systemproperty.termsAndConditionsForStopPayment;
  }

  getDebitData() {
    this.isLoadingComplete = false;
    this.sadadService.getEsalDebitAccounts().subscribe(
      (debData: any) => {
        this.isLoadingComplete = true;
        if (debData) {
          let debitData = debData.DATA.ALL_RECORDS;
          const currencyFormatPipeFilter = new CurrencyFormatPipe();
          debitData.forEach((debitAccount: any) => {
            debitAccount.CURR_AVAIL_BAL_AMT =
              debitAccount.CURR_AVAIL_BAL_AMT && debitAccount.OD_CCY_CODE
                ? currencyFormatPipeFilter.transform(
                    debitAccount.CURR_AVAIL_BAL_AMT,
                    debitAccount.OD_CCY_CODE
                  )
                : debitAccount.CURR_AVAIL_BAL_AMT;
            debitAccount.HIDDEN = this.translateService.instant('LBL_HIDDEN');
          });
          this.debitDataObj = {
            title: 'LBL_FROM',
            data: debitData,
            fieldDetails: [
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: this.rootScopeData.userInfo.maskingFlag
                  ? 'HIDDEN'
                  : 'CURR_AVAIL_BAL_AMT',
                dataKeySupport: this.rootScopeData.userInfo.maskingFlag
                  ? ''
                  : 'OD_CCY_CODE',
              },
            ],
          };
        }
      },
      () => {
        this.isLoadingComplete = true;
        this.debitDataObj = null;
      }
    );
  }

  onSecondFactorValue(secFacDetails: any): void {
    this.secAuthRef = secFacDetails.data.secfRefNo;
  }

  getOtpValue(otpValue: any): void {
    if (otpValue) {
      this.otpError = '';
      this.otpValue = otpValue;
      this.submit();
    } else {
      this.otpValue = '';
      this.otpError = 'LBL_PLS_ENTER_OTP';
    }
  }

  getData(val: any, field: any) {
    switch (field) {
      case 'debitTo':
        if (val === 'iconClick') {
          this.reset();
        } else {
          this.selectedDebitObj = val;
        }
        break;
      case 'esalTo':
        this.selectedESALTo = val.selectedInvoices;
        this.payerId = val.payerId;
        this.resetRemain = false;
        if (
          this.pmtType === 'beneficiary' ||
          this.pmtType === 'invoice' ||
          this.pmtType === 'payer'
        ) {
          this.selectedESALTo.forEach((ele: any) => {
            let amt = ele.dueAmount.replaceAll(',', '');
            this.amount = this.amount + Number(amt);
          });
          this.amountToPass = this.amount + '';
          this.chargesDetails();
          this.getFlexAuthData();
          this.displayAdditionalDetailsForm = true;
        }
        break;
      case 'paymentType':
        this.pmtType = val;
        break;
      case 'reset':
        this.resetRemain = val;
        if (this.resetRemain) {
          this.isProceed = false;
          this.selectedESALTo = null;
          this.amountDetailsObj = null;
          this.amount = 0;
          this.displayAdditionalDetailsForm = true;
        }
        break;
      case 'authorization':
        this.authDataObj = val;
        break;
      case 'additionalDetails':
        this.additionalData = val;
        break;
    }
  }

  onFromAccountSelection(account: any): void {
    let debitValue = account;
        this.checkAramcoToCreditEntitlements(debitValue);
    if (account === 'iconClick') {
      this.reset();
    } else {
      if(Number(amountUnFormat(account.CURR_AVAIL_BAL_AMT)) <= 0){
        this.rootScopeData.validationErrorToast = true;
        this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
        this.reset();
      }else{
        this.selectedDebitObj = account;
      }
    }
  }

  getAuthorsData(authorsDetails: any): void {
    this.authDataObj = authorsDetails;
  }

  getAdditionalDetails(details: any): void {
    this.additionalData = details;
  }

  onBeneficiaryTypeChange(type: any): void {
    this.pmtType = type;
  }

  resetInvoices(details: any): void {
    this.resetRemain = details;
    if (this.resetRemain) {
      this.isProceed = false;
      this.selectedESALTo = null;
      this.amountDetailsObj = null;
      this.amount = 0;
      this.displayAdditionalDetailsForm = true;
    }
  }

  proceedWithInvoices(details: any): void {
    this.selectedESALTo = details.selectedInvoices;
    this.payerId = details.payerId;
    this.subProdCode = details.subProdCode;  //subproductCode
    this.functionCode = details.funcCode;    //functionCode
    this.resetRemain = false;
    if (
      this.pmtType === 'beneficiary' ||
      this.pmtType === 'invoice' ||
      this.pmtType === 'payer'
    ) {
      this.selectedESALTo.forEach((ele: any) => {
        let amt = ele.dueAmount.replaceAll(',', '');
        this.amount = this.amount + Number(amt);
      });
      this.amountToPass = this.amount + '';
      this.chargesDetails();
      this.getFlexAuthData();
      this.displayAdditionalDetailsForm = true;
    }
  }

  getFlexAuthData(): void {
    this.isLoadingComplete = false;
    let reqObj = {
      unitId: this.selectedDebitObj.UNIT_ID,
      debitCifNo: this.selectedDebitObj.COD_CORECIF,
      paymentAmount: this.amountToPass,
      debitPortalAccNo: this.selectedDebitObj.OD_PORTAL_ACC_NO,
      beneCurrencyCode: this.selectedDebitObj.OD_CCY_CODE,
      funCode:'',
      subCode:''
    };
    if( this.pmtType==="beneficiary" || this.pmtType==="invoice"){
      reqObj.funCode="ESALTXN"
      reqObj.subCode="ESALPAY"
    }else{
      reqObj.funCode="ESLONTXN"
      reqObj.subCode="ESALONEPAY"
    }
    this.sadadService.getEsalAuthorizers(reqObj).subscribe(
      (res: any) => {
        if(res){
          this.isLoadingCompelete = true;
          if (res.data.selfAuth == "true") {
            this.showAuthentication = true;
          }
          if (res.data.flexiAuth == "true") {
            this.showAuthorization = true;
            this.authOptions = res.data.authList;
          }
        }
        else{
          this.isLoadingCompelete=true
        }
      },
      () => {
        this.isLoadingComplete = true;
        this.authOptions = [];
      }
    );
  }

  proceedNext(): void {
    if( this.pmtType==="beneficiary" || this.pmtType==="invoice"){
      this.initReqParam.subPrdCode="ESALPAY"
    }else{
      this.initReqParam.subPrdCode="ESALONEPAY"
    }
    this.initReqParam.accNo=this.selectedDebitObj  && this.selectedDebitObj.OD_PORTAL_ACC_NO ? this.selectedDebitObj.OD_PORTAL_ACC_NO : "";
    this.initReqParam.amt=this.amountToPass ? this.amountToPass : "0";
    this.initReqParam.pdroductCode="PAYMNT";
    this.initReqParam.cif=this.selectedDebitObj  && this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : "";
    this.initReqParam.unitId=this.selectedDebitObj  && this.selectedDebitObj.UNIT_ID ? this.selectedDebitObj.UNIT_ID : "";
    
    this.isProceed = true;
    this.displayAdditionalDetailsForm = false;
  }

  chargesDetails() {
    this.isLoadingComplete = false;
    this.sadadService
      .getEsalCharges(this.selectedDebitObj)
      .subscribe(
        (taxes: any) => {
          this.isLoadingComplete = true;
          if (taxes.data) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            this.paymentAmtObj.amount = currencyFormatPipeFilter.transform(
              this.amountToPass,
              'SAR'
            );
            this.paymentAmtObj.fee = taxes.data[0].chargeInfo[0].charge;
            this.paymentAmtObj.vat = taxes.data[0].chargeInfo[0].vat;
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  submit() {
    if (!this.otpValue || this.otpValue.length !== 4) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
    } else {
      this.isLoadingComplete = false;
      const reqObj = {
        subprodCode: this.subProdCode,
        funcCode : this.functionCode,
        debitDetails: this.selectedDebitObj,
        totalAmount: this.amountToPass,
        additionalDetails: this.additionalData,
        paymentDetails: this.paymentAmtObj,
        otpValue: this.otpValue,
        secAuthRef: this.secAuthRef,
        selectedBillers: this.selectedESALTo.map((biller: any) => {
          return {
            BILLER_NAME: biller.billerName,
            BILLER_ID: biller.billerID,
            DUE_DATE: biller.dueDate,
            INVOICE_NO: biller.invoiceCode,
            DUE_AMOUNT: biller.dueAmount,
            MIN_AMOUNT: biller.PaymentRange.range.lowerRange,
            INVOICE_CODE : biller.invoiceNumber
          };
        }),
        AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
      };
      this.sadadService.submitESALPayment(reqObj).subscribe(
        (data: any) => {
          this.isLoadingComplete = true;
          if (data.dataValue.OD_STATUS_DESC === 'Success') {
            this.refNo = data.dataValue.INPUT_REFERENCE_NO;
            this.constructReceiptData(data.dataValue.INPUT_REFERENCE_NO,data.dataValue);
            this.hideAll = true;
          } else {
            this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
            // this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
    }
  }

  constructReceiptData(refNumber: any, dataValue:any): void {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.selectedESALTo.map((biller: any) => {
      biller.amountWithCurrency = `${currencyFormatPipeFilter.transform(
        biller.dueAmount,
        'SAR'
      )} SAR`;
      // biller.dueDate = this.datePipe.transform(
      //   new Date(biller.dueDate),
      //   this.rootScopeData.userInfo.mDateFormat
      // );
    });
    let customDetails = [];
    let flexiAuth = {
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey:
            this.authDataObj &&
            this.authDataObj.selectedAprover &&
            this.authDataObj.selectedAprover.AUTH_NAME
              ? this.authDataObj.selectedAprover.AUTH_NAME
              : 'Not Provided',
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey:
            this.authDataObj && this.authDataObj.aproveNote
              ? this.authDataObj.aproveNote
              : 'Not Provided',
        },
      ],
    }
    this.rejectMsg=false;
    var message1 : any;
    var message2 :any;
    let rejectReasonFromAPi : any;
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
    if (this.pmtType === 'beneficiary' || this.pmtType === 'payer') {
      customDetails = [
        {
          title: 'LBL_TO',
          isTable: 'true',
          data: [{ payerId: this.payerId }],
          fieldDetails: [
            {
              dispKey: 'LBL_PAYER_ID',
              dataKey: 'payerId',
            },
          ],
        },
        {
          title: '',
          isTable: 'true',
          data: this.selectedESALTo,
          fieldDetails: [
            {
              dispKey: 'LBL_INVOICE_NUMBER',
              dataKey: 'invoiceCode',
            },
            {
              dispKey: 'LBL_DUE_DATE',
              dataKey: 'dueDate',
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: 'amountWithCurrency',
            },
          ],
        },
      ];
    } else {
      customDetails = [
        {
          title: 'LBL_TO',
          isTable: 'true',
          data: this.selectedESALTo,
          fieldDetails: [
            {
              dispKey: 'LBL_BILLER',
              dataKey: 'billerName',
            },
            {
              dispKey: 'LBL_INVOICE_NUMBER',
              dataKey: 'invoiceCode',
            },
            {
              dispKey: 'LBL_DUE_DATE',
              dataKey: 'dueDate',
            },
          ],
        },
      ];
    }
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.selectedDebitObj, { USER_ID: userId })
    this.receiptData = {
      msg1: message1,
      // msg2: 'LBL_ESAL_PAYMENT_PENDING_FOR_APPROVAL',
      msg2: message2,
      rejectReason: rejectReasonFromAPi?rejectReasonFromAPi:"",
      referenceNumber: refNumber,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'true',
          data: [this.selectedDebitObj],

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
              dispKey: 'LBL_NICK_NAME',
              dataKey: 'ALIAS_NAME',
            },
          ],
        },
        ...customDetails,
        {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_DEBIT_AMT',
              dataKey: `${currencyFormatPipeFilter.transform(
                this.amountToPass,
                'SAR'
              )} SAR`,
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
        buttonLabel: 'LBL_MAKE_ANOTHER_PAY',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    if(this.showAuthorization && checkAuth){
      this.receiptData.receiptDetails.push(flexiAuth);
    }

    let esalArray : any = [];
    for(let i = 0; i < this.selectedESALTo.length; i++){
      let obj = {
        "Biller": this.selectedESALTo[i].billerName,
        "Invoice Number" : this.selectedESALTo[i].invoiceCode,
        "Due Date": this.selectedESALTo[i].dueDate
      }
      esalArray.push(obj)
    }
    if (this.pmtType === 'beneficiary' || this.pmtType === 'payer'){
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
            "subHead": "Nickname",
            "subValue": this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME:"--"
          },
          {
            "subHead": "To",
            "subValue": ""
          },
          {
            "subHead": "Payer Id",
            "subValue": this.payerId ? this.payerId :"--"
          },
          {
            "subeHead": 'Debit Amount',
            "subValue": `${currencyFormatPipeFilter.transform(this.amountToPass,'SAR')} SAR`
          }
        ],
        "pagecall":"esalbene",
        "ArrayData": esalArray,
        "refNo":refNumber
        }
      }
      else{
        let esalInvoiceArray : any = [];
    for(let i = 0; i < this.selectedESALTo.length; i++){
      let obj = {
        "Biller": this.selectedESALTo[i].billerName,
        "Invoice Number" : this.selectedESALTo[i].invoiceCode,
        "Due Date": this.selectedESALTo[i].dueDate
      }
      esalInvoiceArray.push(obj)
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
            "subHead": "Nickname",
            "subValue": this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME:"--"
          },
          {
            "subHead": "To",
            "subValue": ""
          },
          {
            "subHead": 'Debit Amount',
            "subValue": `${currencyFormatPipeFilter.transform(this.amountToPass,'SAR')} SAR`
          }
        ],
        "pagecall":"esalinvoice",
        "ArrayData": esalArray,
        "refNo":refNumber
      }
    }
  
  }

  reset() {
    this.selectedDebitObj = null;
    this.selectedESALTo = null;
    this.debitDataObj = null;
    this.isProceed = false;
    this.getDebitData();
    this.amountToPass = '';
    this.amount = 0;
    this.hideAll = false;
    this.displayAdditionalDetailsForm = true;
    this.additionalData = { date: null, paymentDetails: '', customerRef: '' };
    this.showAuthentication=false;
    this.showAuthorization=false;
  }

  initESALPayment() {
    this.reset();
  }

  checkAramcoToCreditEntitlements(selectDebitAcc :any)
  {
    this.isLoadingCompelete = false;
    let selectedAccnum = selectDebitAcc.OD_PORTAL_ACC_NO
    this.sadadService.getCreditTabEntitlements(selectedAccnum).subscribe((resp: any) => {
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
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      // let debitAmt = `${currencyFormatPipeFilter.transform( this.amountToPass,'SAR')} SAR`;
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:this.translateService.instant('LBL_ESAL_RECEIPT'), x:90, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_NICK_NAME'), y:95},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_TO'), y:105},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_INVOICE_NUMBER'), y:125},
        { type: 'heading', value:this.translateService.instant('LBL_DUE_DATE'), y:135},
        { type: 'text', value:this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : '', y:75},
        { type: 'text', value:this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '', y:85},
        { type: 'text', value:this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : '', y:95},
        { type: 'text', value:this.selectedESALTo[0].invoiceCode? this.selectedESALTo[0].invoiceCode : '', y:125},
        { type: 'text', value:this.selectedESALTo[0].dueDate ? this.selectedESALTo[0].dueDate : '', y:135},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:165},
        { type: 'text', value: this.refNo ? this.refNo : '', y:165},
        { type: 'heading', value:this.translateService.instant('LBL_ESAL_PAYMENT_PENDING_FOR_APPROVAL'), y:175},
        { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}
      ]
      
      if (this.pmtType === 'beneficiary' || this.pmtType === 'payer') {
        this.pdfData.push(
          { type: 'heading', value:this.translateService.instant('LBL_PAYER_ID'), y:115},
          { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:145},
          { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:155},
          { type: 'text', value:this.payerId? this.payerId : '', y:115},
          { type: 'text', value:this.selectedESALTo[0].amountWithCurrency? this.selectedESALTo[0].amountWithCurrency : '', y:145},
          { type: 'text', value: currencyFormatPipeFilter.transform( this.amountToPass,'SAR') + 'SAR' ? currencyFormatPipeFilter.transform( this.amountToPass,'SAR') + 'SAR' : '', y:155},
        )
      }
      else{
        this.pdfData.push(
        { type: 'heading', value:this.translateService.instant('LBL_BILLER'), y:115},
        { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
        { type: 'text', value:this.selectedESALTo[0].billerName? this.selectedESALTo[0].billerName : '', y:115},
        { type: 'text', value: currencyFormatPipeFilter.transform( this.amountToPass,'SAR') + 'SAR' ? currencyFormatPipeFilter.transform( this.amountToPass,'SAR') + 'SAR' : '', y:145},
        )
      }
    
      //   this.pdfData.push(
      //     { type: 'save', value:'ESAL.pdf'}
      //  )
      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'ESAL.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'ESAL.pdf'}
       )
      }

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
