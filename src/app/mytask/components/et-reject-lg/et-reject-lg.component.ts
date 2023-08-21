import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { MyTaskService } from '../../services/my-task.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-et-reject-lg',
  templateUrl: './et-reject-lg.component.html',
  styleUrls: ['./et-reject-lg.component.scss'],
})
export class EtRejectLgComponent implements OnInit {
  isLoadingComplete: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  submitSuccessful: boolean = false;
  lgSummary: any;
  lgDetails: any;
  url = systemproperty.termsAndConditionsLinkForBenUpload;
  receiptData: any;
  rejectReason: string = '';
  isRejectReasonValid: boolean = true;
  referenceNumber: string = '';

  constructor(
    private readonly router: Router,
    private readonly myTaskService: MyTaskService,
    private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf
  ) {}

  ngOnInit(): void {
    if (this.rootScopeData.selectedInquiryForStopPayment.letterOfGua) {
      this.lgSummary = this.rootScopeData.selectedInquiryForStopPayment.letterOfGua;
      this.lgDetails = this.rootScopeData.selectedInquiryForStopPayment.lgDetails;
    } else {
      this.router.navigate(['mytask/eTrade/lg']);
    }
  }

  cancelLgReject(): void {
    this.rootScopeData.selectedInquiryForStopPayment = '';
    this.router.navigate(['mytask/lgDetails']);
  }

  rejectLg(): void {
    if (this.rejectReason) {
      this.isLoadingComplete = false;
      const params = {
        referenceNumber: this.lgSummary.refNo ? this.lgSummary.refNo : '',
        version: this.lgSummary.input_ver_no ? this.lgSummary.input_ver_no : '',
        remarks: this.rejectReason ? this.rejectReason : ''
      };
      this.myTaskService.rejectLg(params).subscribe(
        (response: any) => {
          this.isLoadingComplete = true;
          this.referenceNumber = response.dataValue.INTERNAL_REFERENCE_NO;
          if (response.dataValue.STATUS === 'Success') {
            this.constructReceiptData(response.dataValue.SELECTED_RECORDS);
            this.submitSuccessful = true;
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
    } else {
      this.isRejectReasonValid = false;
    }
  }

  validateReason(): void {
    this.isRejectReasonValid = this.rejectReason ? true : false;
  }

  onBackArrowClick(): void {
    this.cancelLgReject();
  }

  constructReceiptData(referenceNumber: string): void {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    const dateformatPipe = new DateFormatPipe()
    const amount = currencyFormatPipeFilter.transform(
      this.lgDetails.amount,
      this.lgDetails.lgCurrency
    ) + ' ' + this.lgDetails.lgCurrency;
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_LG_REJECTED',
      referenceNumber: referenceNumber,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.loginID
              ? this.rootScopeData.userInfo.loginID
              : '',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.lgSummary.accNo ? this.lgSummary.accNo : '--',
            },
            // {
            //   dispKey: 'LBL_NICK_NAME',
            //   dataKey: this.lgDetails.shortName ? this.lgDetails.shortName : '--',
            // },
            {
              dispKey: '',
              dataKey: ' ',
            },
          ],
        },
        {
          title: 'LBL_TO',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_BENEFICIARY_IN_ENGLISH',
              dataKey: this.lgSummary.nickNameEng ? this.lgSummary.nickNameEng : '--'
            },
            {
              dispKey: 'LBL_BENEFICIARY_IN_ARABIC',
              dataKey: this.lgSummary.nickNameAR ? this.lgSummary.nickNameAR : '--'
            },
          ],
        },
        {
          title: 'LBL_LG_ISSUE_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_TYPE',
              dataKey: this.lgDetails.lgType ? this.lgDetails.lgType : '--',
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: dateformatPipe.transform(this.lgDetails.expiryDate) ? dateformatPipe.transform(this.lgDetails.expiryDate) : '--'
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: this.lgDetails.amount ? amount : '--'
            },{
              dispKey: 'LBL_RJCT_RSN',
              dataKey: this.rejectReason,
            }
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
  }

  downloadPdf() {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    const dateFormatPipeFilter = new DateFormatPipe();
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_LETTER_OF_GUARANTEE_RECEIPT'),
        x: 75,
        y: 35,
      },
      { type: 'setFontSize', size: 10 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setFontSize', size: 10 },
      { type: 'setDrawColor', val: 128 },
      { type: 'setFillColor', val1: 128, val2: 128, val3: 128 },
      { type: 'drawRect', x: 15, y: 51, w: 90, h: 6, s: 'F' },
      { type: 'setTextColor', val1: 255, val2: 255, val3: 255 },
      { type: 'setFontSize', size: 10 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_LETTER_OF_GUARANTEE_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FROM'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_ACTION_BY'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_ACC_NUMBER'),
        y: 85,
      },
      // {
      //   type: 'heading',
      //   value: this.translateService.instant('LBL_NICKNAME'),
      //   y: 95,
      // },

      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CREDIT_TO'),
        y: 105,
      },

      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_BENEFICIARY_IN_ENGLISH'),
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_BENEFICIARY_IN_ARABIC'),
        y: 125,
      },

      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_LG_ISSUE_DETAILS'),
        y: 135,
      },

      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_TYPE'),
        y: 145,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_EXPIRY_DATE'),
        y: 155,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_AMOUNT'),
        y: 165,
      },

      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.lgSummary.fullName ? this.lgSummary.fullName : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.lgSummary.accNo ? this.lgSummary.accNo : '--',
        y: 85,
      },
      // {
      //   type: 'text',
      //   value: this.lgDetails.shortName ? this.lgDetails.shortName : '--',
      //   y: 95,
      // },
      {
        type: 'text',
        value: this.lgSummary.nickNameEng ? this.lgSummary.nickNameEng : '--',
        y: 115,
      },
      {
        type: 'text',
        value: this.lgSummary.nickNameAR ? this.lgSummary.nickNameAR : '--',
        y: 125,
      },

      {
        type: 'text',
        value: this.lgDetails.lgType ? this.lgDetails.lgType : '--',
        y: 145,
      },

      {
        type: 'text',
        value: dateFormatPipeFilter.transform(this.lgDetails?.expiryDate)
          ? dateFormatPipeFilter.transform(this.lgDetails?.expiryDate)
          : '--',
        y: 155,
      },

      {
        type: 'text',
        value:
          currencyFormatPipeFilter.transform(
            this.lgDetails.amount,
            this.lgDetails.lgCurrency
          ) +
          ' ' +
          this.lgDetails?.lgCurrency
            ? this.lgDetails.lgCurrency
            : '',
        y: 165,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 175,
      },
      { type: 'text', value: this.referenceNumber, y: 175 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_LG_REJECTED'),
        y: 185,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_LETTER_OF_GUARANTEE') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
