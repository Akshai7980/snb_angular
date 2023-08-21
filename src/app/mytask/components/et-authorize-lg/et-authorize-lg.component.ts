import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ETradeService } from 'src/app/e-trade/services/e-trade.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { MyTaskService } from '../../services/my-task.service';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-et-authorize-lg',
  templateUrl: './et-authorize-lg.component.html',
  styleUrls: ['./et-authorize-lg.component.scss'],
})
export class EtAuthorizeLgComponent implements OnInit {
  isLoadingComplete: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  lgSummary: any;
  lgDetails: any;
  authorsList: any = [];
  authDataObj: any;
  url = systemproperty.termsAndConditionsLinkForBenUpload;
  submitSuccessful: boolean = false;
  receiptData: any;
  referenceNumber: string = '';
  showAuthorization: boolean = false;
  constructor(
    private readonly router: Router,
    private readonly eTradeService: ETradeService,
    private readonly myTaskService: MyTaskService,
    private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf
  ) {}

  ngOnInit(): void {
    if (this.rootScopeData.selectedInquiryForStopPayment.letterOfGua) {
      this.lgSummary =
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua;
      this.lgDetails =
        this.rootScopeData.selectedInquiryForStopPayment.lgDetails;
      this.getAuthors();
    } else {
      this.router.navigate(['mytask/eTrade/lg']);
    }
  }

  getAuthors(): void {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      cif: this.rootScopeData.userInfo.sCustNo,
      amount: this.lgDetails.amount ? this.lgDetails.amount : '',
      accountNumber: this.lgSummary.accNo ? this.lgSummary.accNo : '',
      paymentCurrency: this.lgDetails.lgCurrency ? this.lgDetails.lgCurrency : '',
      debitCurrency: this.lgDetails.lgCurrency ? this.lgDetails.lgCurrency : '',
    };
    this.eTradeService.getAuthorizers(params).subscribe(
      (authors: any) => {
        this.isLoadingComplete = true;
        if (authors.data.flexiAuth == 'true') {
          this.showAuthorization = true;
          this.authorsList = authors.data.authList;
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  setAuthorizationDetails(details: any): void {
    this.authDataObj = details;
  }

  cancelLgAuthorize(): void {
    this.rootScopeData.selectedInquiryForStopPayment = '';
    this.router.navigate(['mytask/lgDetails']);
  }

  authorizeLg(): void {
    this.isLoadingComplete = false;
    const params = {
      referenceNumber: this.lgSummary.refNo ? this.lgSummary.refNo : '',
      version: this.lgSummary.input_ver_no ? this.lgSummary.input_ver_no : '',
      PARSED_RULE_ID:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.PARSED_RULE_ID
          : '',
      SELECTION_FLAG:
        this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
      USER_NUMBER_LIST:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.OD_USER_NO
          : '',
      remarks: !this.authDataObj
        ? ''
        : !this.authDataObj.aproveNote
        ? ''
        : this.authDataObj.aproveNote,
      INPUT_HOST_CODE:
        this.rootScopeData.selectedInquiryForStopPayment &&
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua &&
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua
          .od_host_txn_code
          ? this.rootScopeData.selectedInquiryForStopPayment.letterOfGua
              .od_host_txn_code
          : '',
      ACTION:
        this.rootScopeData.selectedInquiryForStopPayment &&
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua &&
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua
          .functionCode
          ? this.rootScopeData.selectedInquiryForStopPayment.letterOfGua
              .functionCode
          : '',
      PRODUCT:
        this.rootScopeData.selectedInquiryForStopPayment &&
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua &&
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua.product
          ? this.rootScopeData.selectedInquiryForStopPayment.letterOfGua.product
          : '',
      SUB_PRODUCT:
        this.rootScopeData.selectedInquiryForStopPayment &&
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua &&
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua.subProduct
          ? this.rootScopeData.selectedInquiryForStopPayment.letterOfGua
              .subProduct
          : '',
    };
    this.myTaskService.authorizeLg(params).subscribe(
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
  }

  constructReceiptData(referenceNumber: string): void {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    const dateformatPipe = new DateFormatPipe();
    const amount =
      currencyFormatPipeFilter.transform(
        this.lgDetails.amount,
        this.lgDetails.lgCurrency
      ) +
      ' ' +
      this.lgDetails.lgCurrency;
    this.receiptData = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_ETRADE_AUTHORIZED_SUCCESS',
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
          ],
        },
        {
          title: 'LBL_TO',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_BENEFICIARY_IN_ENGLISH',
              dataKey: this.lgSummary.nickNameEng
                ? this.lgSummary.nickNameEng
                : '--',
            },
            {
              dispKey: 'LBL_BENEFICIARY_IN_ARABIC',
              dataKey: this.lgSummary.nickNameAR
                ? this.lgSummary.nickNameAR
                : '--',
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
              dataKey: dateformatPipe.transform(this.lgDetails.expiryDate)
                ? dateformatPipe.transform(this.lgDetails.expiryDate)
                : '--',
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: this.lgDetails.amount ? amount : '--',
            },
          ],
        },
        {
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
                this.authDataObj &&
                this.authDataObj.selectedAprover &&
                this.authDataObj.aproveNote
                  ? this.authDataObj.aproveNote
                  : 'LBL_NOT_PROVIDED',
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
        value: this.translateService.instant('LBL_LG_PENDING_FOR_APPROVAL'),
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
