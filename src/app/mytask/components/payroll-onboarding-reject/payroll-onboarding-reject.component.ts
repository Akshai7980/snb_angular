import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { ThisReceiver } from '@angular/compiler';
@Component({
  selector: 'app-payroll-onboarding-reject',
  templateUrl: './payroll-onboarding-reject.component.html',
  styleUrls: ['./payroll-onboarding-reject.component.scss'],
})
export class PayrollOnboardingRejectComponent implements OnInit {
  isRejectReasonValid: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  rejectReasonText: string = '';
  rejectReasonError: string = '';
  onboardingFeeDetails: any = {};
  feeDetails: any = [];
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  constructor(
    private location: Location,
    private route: Router,
    private myTaskService: MyTaskService,
    private translateService: TranslateService,private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {
    this.onboardingFeeDetails =
      this.myTaskService.getSelectedElementDetails().onBoardingDetails;
    this.feeDetails = this.myTaskService.getSelectedElementDetails().feeDetails;
  }

  trimField(text: string) {
    return text.replace(/^\s+|\s+$/g, '');
  }

  onEnterReason() {
    this.isRejectReasonValid = false;
  }

  onSubmit() {
    if (!this.rejectReasonText) {
      this.isRejectReasonValid = true;
      this.rejectReasonError = 'LBL_ERROR_MESSAGE_RJCT_RSN';
      return;
    } else {
      if (this.trimField(this.rejectReasonText) !== '') {
        this.rejectReasonText.trim();
      } else {
        this.rejectReasonText = '';
        this.isRejectReasonValid = true;
        this.rejectReasonError = 'LBL_ERROR_MESSAGE_RJCT_RSN';
        return;
      }
    }
    const params = {
      INPUT_REFERENCE_NO: this.onboardingFeeDetails?.referenceNo
        ? this.onboardingFeeDetails.referenceNo
        : '',
      REJECT_REASON: this.rejectReasonText,
      INPUT_VER_NO: this.rootScopeData.chequeBookDetailsObject.INPUT_VER_NO
        ? this.rootScopeData.chequeBookDetailsObject.INPUT_VER_NO
        : '',
    };
    this.isLoadingCompelete = false;
    this.myTaskService.payrollOnboardingReject(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.dataValue.STATUS === 'Success') {
          this.receiptForm = true;
          this.constructReceiptData(res.dataValue.INTERNAL_REFERENCE_NO);
          this.refNo = res.dataValue.INTERNAL_REFERENCE_NO;
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_PAYROLL_ONBOARDING_REJECTION_STMT',
      referenceNumber: refNumber,
      showCallBackComponent: false,
      receiptDetails: [
        {
          title: 'LBL_FEE_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CHARGE_ACC',
              dataKey: this.onboardingFeeDetails.accNo,
            },
            {
              dispKey: 'LBL_SETUP_FEE',
              dataKey: this.feeDetails?.setupFee
                ? `${this.feeDetails.setupFee} ${this.onboardingFeeDetails?.ccy}`
                : '--',
            },
            {
              dispKey: 'LBL_MONTHLY_FEE',
              dataKey: this.feeDetails?.monthlyFee
                ? `${this.feeDetails.monthlyFee} ${this.onboardingFeeDetails?.ccy}`
                : '--',
            },
            {
              dispKey: 'LBL_PREPAID_CARD',
              dataKey: this.feeDetails?.prepaidCards
                ? `${this.feeDetails.prepaidCards} ${this.onboardingFeeDetails?.ccy}`
                : '--',
            },
            {
              dispKey: 'LBL_PER_SNB_RECORD',
              dataKey: this.feeDetails?.perSNBrecord
                ? `${this.feeDetails.perSNBrecord} ${this.onboardingFeeDetails?.ccy}`
                : '--',
            },
            {
              dispKey: 'LBL_PER_SARIE_RECORD',
              dataKey: this.feeDetails?.perSarieRecord
                ? `${this.feeDetails.perSarieRecord} ${this.onboardingFeeDetails?.ccy}`
                : '--',
            },
          ],
        },
        {
          title: 'LBL_RJCT_RSN',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_REASON',
              dataKey: this.rejectReasonText
                ? this.rejectReasonText
                : 'Not Provided',
            },
          ],
        },
        {
          title: 'LBL_RESPONSE',
          isTable: 'false',
          fieldDetails: [
            {
              dispKey: 'LBL_STATUS',
              dataKey: 'LBL_SUCCESS',
            },
            {
              dispKey: 'LBL_RESPONSE',
              dataKey: '--',
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

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_REJ_PAYROLL_ONBOARDING"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_PAYROLL_ONBOARDING_REJECTION_STMT"),
      "keyValues": [
        {
          "subHead": "Fee Details",
          "subValue": ""
        },
        {
          "subHead": "Link fee from account",
          "subValue": this.onboardingFeeDetails.accNo? this.onboardingFeeDetails.accNo : "--"
        },
        {
          "subHead": "Setup fee",
          "subValue": this.feeDetails?.setupFee
          ? `${this.feeDetails.setupFee} ${this.onboardingFeeDetails?.ccy}`
          : '--'
        },
        {
          "subHead": "Monthly fee",
          "subValue": this.feeDetails?.monthlyFee
          ? `${this.feeDetails.monthlyFee} ${this.onboardingFeeDetails?.ccy}`
          : '--'
        },
        {
          "subHead": "Prepaid card (Monthly fee)",
          "subValue": this.feeDetails?.prepaidCards
          ? `${this.feeDetails.prepaidCards} ${this.onboardingFeeDetails?.ccy}`
          : '--'
        },
        {
          "subHead": "Per SNB record",
          "subValue": this.feeDetails?.perSNBrecord
          ? `${this.feeDetails.perSNBrecord} ${this.onboardingFeeDetails?.ccy}`
          : '--'
        },
        {
          "subHead": "Per SARIE record",
          "subValue": this.feeDetails?.perSarieRecord
          ? `${this.feeDetails.perSarieRecord} ${this.onboardingFeeDetails?.ccy}`
          : '--'
        },
        {
          "subHead": "Fee is inclusive of VAT",
          "subValue": '--'
        }
      ],
      "pagecall":"payrollonboarding",
      "refNo":refNumber
    }
  }

  onBackArrowClick() {
    this.location.back();
  }

  initiateAnotherRequest() {
    this.route.navigate(['/mytask/Onboarding']);
  }
  downloadPdf(values:any)
  { 
  let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_REJ_PAYROLL_ONBOARDING"), x:80, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_CHARGE_ACC'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_SETUP_FEE'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_MONTHLY_FEE'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_PREPAID_CARD'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_PER_SNB_RECORD'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_PER_SARIE_RECORD'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_RJCT_RSN'), y:135},
    { type: 'heading', value:this.translateService.instant('LBL_REASON'), y:145},
    { type: 'text', value:  this.onboardingFeeDetails.accNo ? this.onboardingFeeDetails.accNo : '--',y:75},
    { type: 'text', value:  this.feeDetails?.setupFee ? `${this.feeDetails.setupFee} ${this.onboardingFeeDetails?.ccy}` : '--',y:85},
    { type: 'text', value:  this.feeDetails?.monthlyFee ? `${this.feeDetails.monthlyFee} ${this.onboardingFeeDetails?.ccy}` : '--',y:95},
    { type: 'text', value:  this.feeDetails?.prepaidCards ? `${this.feeDetails.prepaidCards} ${this.onboardingFeeDetails?.ccy}` : '--',y:105},
    { type: 'text', value:  this.feeDetails?.perSNBrecord ? `${this.feeDetails.perSNBrecord} ${this.onboardingFeeDetails?.ccy}` : '--',y:115},
    { type: 'text', value:  this.feeDetails?.perSarieRecord ? `${this.feeDetails.perSarieRecord} ${this.onboardingFeeDetails?.ccy}` : '--',y:125},
    { type: 'text', value:  this.rejectReasonText ? this.rejectReasonText : 'Not Provided',y:145},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:155},
    { type: 'text', value: this.refNo? this.refNo : '', y:155},
    { type: 'heading', value:this.translateService.instant('LBL_PAYROLL_ONBOARDING_APPROVE_STMT'), y:165},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Reject-PayrollOnboarding.pdf'} 
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Reject-PayrollOnboarding.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}
