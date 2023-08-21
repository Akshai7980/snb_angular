import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { PayrollService } from '../../services/payroll.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-payroll-onboarding',
  templateUrl: './payroll-onboarding.component.html',
  styleUrls: ['./payroll-onboarding.component.scss']
})
export class PayrollOnboardingComponent implements OnInit, OnDestroy {

  title: string = "";
  onboardingFeeDetails: any = {};
  isLoadingCompelete: boolean = true;
  showScreen: string = '';
  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  receiptData: any = {};
  hideInitiateButton: boolean = true;
  subscriptions: Subscription[] = [];
  selfAuthFlag: string = '';
  authType: any;
  payrollOnboarding = 'payrollOnboarding';
  pageCall: any;
  showAuth: boolean = false;
  makeSelectable: boolean = false;
  saveReceiptObject: any;
  pdfData:any;
  refNo: any;

  constructor(private payrollService: PayrollService,private translateService: TranslateService, private downloadAsPdf:downloadAsPdf) { }

  ngOnInit(): void {
    this.title = "LBL_PAYROLL_ONBOARDING";
    this.pageCall = 'payrollOnboarding';
  }

  onProceedClick(event: string) {
    this.makeSelectable = false;
    this.title = "LBL_REVIEW";
    this.onboardingFeeDetails = event;
    this.showScreen = 'review';
    this.getAuthorizationData();
  }

  getAuthorizationData() {
    this.isLoadingCompelete = false;
    const data = {
      unitId: this.onboardingFeeDetails.accDetails.UNIT_ID,
      cif: this.onboardingFeeDetails.accDetails.COD_CORECIF,
      productCode: "PAYMNT",
      subProdCode: "PAYONBD",
      funcCode: "PYMTFNC",
      amount: this.onboardingFeeDetails.setupFee,
      accNo: this.onboardingFeeDetails.accDetails.OD_ACC_NO,
      pymntCurrency: this.onboardingFeeDetails.ccy,
      debitCurrency: this.onboardingFeeDetails.ccy
    }
    const authDtls = this.payrollService.getPayrollAuthData(data).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data.authList) {
          this.selfAuthFlag = res.data.selfAuth;
          this.authOptions = res.data.authList;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
      }
    );
    this.subscriptions.push(authDtls);
  }

  getData(event: any) {
    this.authDetail = event;
  }

  onSecondFactorValue(authValue: any) {
    this.secAuthRef = authValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      // if (otpValue.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.submit();
    } else {
      this.userOtpValue = '';
    }
  }

  submit() {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    this.isLoadingCompelete = false;
    const data = {
      otpValue: this.userOtpValue,
      secAuthRef: this.secAuthRef,
      accountDetails: this.onboardingFeeDetails,
      authDetail: this.authDetail,
      SEL_PARSED_RULE_ID: this.authDetail.selectedAprover?.PARSED_RULE_ID ? this.authDetail.selectedAprover?.PARSED_RULE_ID : "",
      SELECTION_FLAG: this.authOptions.length > 0 ? "Y" : "N",
      sefAuthFlag: this.selfAuthFlag,
      INPUT_TXN_STATUS: "RA",
      IsValidateToken: "",
      AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': '',
      REQUEST_ID: "ONLINE_DUPLICATE",
      PAYMENT_TYPE: "PAYONBD",
      FUNCTION_CODE: "PYMTFNC"
    };
    const submtDtls = this.payrollService.payrollOnboardingSubmit(data).subscribe((res:any) => {
      this.isLoadingCompelete = true;
      if (res && res.dataValue && res.dataValue.OD_STATUS_DESC === "Success") {
        this.title = '';
        this.constructReceiptData(res.dataValue.REFERENCE_NUM);
        this.showScreen = 'receipt';
      }else if(res && res.dataValue && res.dataValue.OD_STATUS_DESC === "Failure"){
        this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
        // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
      }else{
        this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
        // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
      }
    }, err => {
      this.isLoadingCompelete = true;
    })
    this.subscriptions.push(submtDtls);
  }

  constructReceiptData(referenceNo: string) {
    this.refNo = referenceNo;
    this.receiptData = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_PAYROLL_ONBOARD_SENT_TO_APPROVE',
      referenceNumber: referenceNo,
      showCallBackComponent: false,
      receiptDetails: [
        {
          title: 'LBL_FEE_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_LINK_FEE',
              dataKey: this.onboardingFeeDetails.accDetails.OD_ACC_NO? this.onboardingFeeDetails.accDetails.OD_ACC_NO : "--",
            },
            {
              dispKey: 'LBL_SETUP_FEE',
              dataKey: this.onboardingFeeDetails.setupFee?this.onboardingFeeDetails.setupFee:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--",
            },
            {
              dispKey: 'LBL_MONTHLY_FEE',
              dataKey: this.onboardingFeeDetails.monthlyFee?this.onboardingFeeDetails.monthlyFee:'--'+" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--",
            },
            {
              dispKey: 'LBL_PREPAID_CARD',
              dataKey: this.onboardingFeeDetails.prepaidCards? this.onboardingFeeDetails.prepaidCards:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--",
            },
            {
              dispKey: 'LBL_PER_SNB_RECORD',
              dataKey: this.onboardingFeeDetails.perSNBrecord?this.onboardingFeeDetails.perSNBrecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--",
            },
            {
              dispKey: 'LBL_PER_SARIE_RECORD',
              dataKey: this.onboardingFeeDetails.perSarieRecord?this.onboardingFeeDetails.perSarieRecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--",
            },
            {
              dispKey: 'LBL_FEE_VAT',
              dataKey: '',
            }
          ],
        },
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: this.authDetail.selectedAprover?.AUTH_NAME
                ? this.authDetail.selectedAprover.AUTH_NAME
                : 'Not Provided',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey:
                this.authDetail?.aproveNote
                  ? this.authDetail.aproveNote
                  : 'Not Provided',
            },
          ]
        }
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_REQ_SUCCESS"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_PAYROLL_ONBOARD_SENT_TO_APPROVE"),
      "keyValues": [
        {
          "subHead": "Fee Details",
          "subValue": ""
        },
        {
          "subHead": "Link fee from account",
          "subValue": this.onboardingFeeDetails.accDetails.OD_ACC_NO? this.onboardingFeeDetails.accDetails.OD_ACC_NO : "--"
        },
        {
          "subHead": "Setup fee",
          "subValue": this.onboardingFeeDetails.setupFee?this.onboardingFeeDetails.setupFee:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--"
        },
        {
          "subHead": "Monthly fee",
          "subValue": this.onboardingFeeDetails.monthlyFee?this.onboardingFeeDetails.monthlyFee:'--'+" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--"
        },
        {
          "subHead": "Prepaid card (Monthly fee)",
          "subValue": this.onboardingFeeDetails.prepaidCards? this.onboardingFeeDetails.prepaidCards:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--"
        },
        {
          "subHead": "Per SNB record",
          "subValue": this.onboardingFeeDetails.perSNBrecord?this.onboardingFeeDetails.perSNBrecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--"
        },
        {
          "subHead": "Per SARIE record",
          "subValue": this.onboardingFeeDetails.perSarieRecord?this.onboardingFeeDetails.perSarieRecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--"
        },
        {
          "subHead": "Fee is inclusive of VAT",
          "subValue": '--'
        }
      ],
      "pagecall":"payrollonboarding",
      "refNo":referenceNo
    }
  }

  cancel() {
    this.title = "LBL_PAYROLL_ONBOARDING";
    this.showScreen = '';
  }

  openTermsAndCondition() {
    const termsAndConditionsLink = systemproperty.termsAndConditionsLinkForPayrollOnboarding;
    window.open(termsAndConditionsLink);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  getAuthType(val: any) {
    this.authType = val
  }
  callBackSuccess(){
    this.showAuth = true;
  }

  getCanelBtnClick(){
    this.makeSelectable = true;
    this.cancel();
  }

  downloadPdf(values:any)
  { 
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant('LBL_PAYROLL_ONBOARDING_RECEIPT'), x:90, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_FEE_DETAILS'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_LINK_FEE'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_SETUP_FEE'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_MONTHLY_FEE'), y:95},
    // { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    // { type: 'heading', value:this.translateService.instant('LBL_TO'), y:105},
    // { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_PREPAID_CARD'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_PER_SNB_RECORD'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_PER_SARIE_RECORD'), y:125},
    { type: 'text', value:this.onboardingFeeDetails.accDetails.OD_ACC_NO? this.onboardingFeeDetails.accDetails.OD_ACC_NO : "--", y:75},
    { type: 'text', value:this.onboardingFeeDetails.setupFee?this.onboardingFeeDetails.setupFee:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:85},
    { type: 'text', value:this.onboardingFeeDetails.monthlyFee?this.onboardingFeeDetails.monthlyFee:'--'+" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:95},
    { type: 'text', value:this.onboardingFeeDetails.prepaidCards? this.onboardingFeeDetails.prepaidCards:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:105},
    { type: 'text', value: this.onboardingFeeDetails.perSNBrecord?this.onboardingFeeDetails.perSNBrecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:115},
    { type: 'text', value:this.onboardingFeeDetails.perSarieRecord?this.onboardingFeeDetails.perSarieRecord:'--' +" "+ this.onboardingFeeDetails.ccy? this.onboardingFeeDetails.ccy: "--", y:125},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:135},
    { type: 'text', value: this.refNo ? this.refNo : '', y:135},
    { type: 'heading', value:this.translateService.instant('LBL_PAYROLL_ONBOARD_SENT_TO_APPROVE'), y:145},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'payrollOnboarding.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'payrollOnboarding.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}

}
