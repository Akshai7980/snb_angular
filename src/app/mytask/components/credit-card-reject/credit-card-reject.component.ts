import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { MaskCardNumberPipe } from 'src/app/pipes/mask-card-number.pipe';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-credit-card-reject',
  templateUrl: './credit-card-reject.component.html',
  styleUrls: ['./credit-card-reject.component.scss'],
})
export class CreditCardRejectComponent implements OnInit {
  isLoadingComplete: boolean = true;
  showReceipt: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;

  transferSummaryDetails: any = {};
  receiptObject: any = {};

  rejectReasonText: string = '';
  rejectReasonError: string = '';
  isRejectReasonValid: boolean = false;
  moduleId: string = '';
  receiptMessage: string = '';
  fieldDetails: any = [];
  referenceNumber: string = '';
  constructor(
    private router: Router,
    private readonly myTaskService: MyTaskService,
    private readonly translateService: TranslateService,
    private location: Location,
    private downloadAsPdf: downloadAsPdf,
  ) {}

  ngOnInit(): void {
    if (this.rootScopeData.selectedInquiryForStopPayment) {
      this.isLoadingComplete = true;
      this.transferSummaryDetails =
        this.rootScopeData.selectedInquiryForStopPayment;
      this.moduleId = this.setModuleId();
    } else {
      this.router.navigate(['/mytask/cards/creditCard']);
    }
  }

  setModuleId(): string {
    let moduleId = '';
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    switch (this.transferSummaryDetails.summary.subproductCode) {
      case 'CARDSTP':
        this.receiptMessage = 'LBL_STOP_CARD_REQ_REJECTED';
        this.fieldDetails = {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_REASON_TO_STOP',
              dataKey: this.transferSummaryDetails.details.reason,
            },
            {
              dispKey: 'LBL_COMMENTS',
              dataKey: this.transferSummaryDetails.details.comments
                ? this.transferSummaryDetails.details.comments
                : 'LBL_NOT_PROVIDED',
            },
          ],
        };
        return 'STCRDREJ';
      case 'CARDACT':
        this.receiptMessage = 'LBL_ACTIVATE_CARD_REQ_REJECTED';
        return 'ACTCRDREJ';
      case 'CRDVWPIN':
        this.receiptMessage = 'LBL_VIEW_PIN_REQ_REJECTED';
        return 'VWPNREJ';
      case 'CRDWITHCH':
        this.receiptMessage = 'LBL_CHANGE_CARD_WITHDRAW_LIMIT_REQ_REJECTED';
        this.fieldDetails = {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CURRENT_LIMIT',
              dataKey: `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.currentLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`,
            },
            {
              dispKey: 'LBL_NEW_LIMIT',
              dataKey: `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.newLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`,
            },
          ],
        };
        return 'CRDWTHREJ';
      case 'CRDCRELIM':
        this.fieldDetails = {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CURRENT_LIMIT',
              dataKey: `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.currentLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`,
            },
            {
              dispKey: 'LBL_MAX_LIMIT',
              dataKey: `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.maxLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`,
            },
            {
              dispKey: 'LBL_MIN_LIMIT',
              dataKey: `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.minLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`,
            },
            {
              dispKey: 'LBL_NEW_LIMIT',
              dataKey: `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.newLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`,
            },
          ],
        };
        this.receiptMessage = 'LBL_CHANGE_CARD_CREDIT_LIMIT_REQ_REJECTED';
        return 'CRDLMTREJ';
      case 'CARDPAY':
        this.fieldDetails = {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: this.transferSummaryDetails.details.accName
                ? this.transferSummaryDetails.details.accName
                : '--',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.transferSummaryDetails.details.accNo,
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.amount,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`,
            },
          ],
        };
        this.receiptMessage = 'LBL_CREDIT_CARD_PAYMENT_REQ_REJECTED';
        return 'CRDPAYREJ';
      case 'CRDREISSU':
        this.receiptMessage = 'LBL_CARD_RE_ISSUE_REQ_REJECTED';
        return 'CRDREREJ';
      case 'CRDLIMAD':
        this.receiptMessage = 'LBL_CARD_LIMIT_ADJ_REQ_REJECTED';
        return 'CRDLMTADJREJ';
    }
    return moduleId;
  }

  onSubmit(): void {
    this.isRejectReasonValid = false;
    if (!this.rejectReasonText || this.rejectReasonText === '') {
      this.isRejectReasonValid = true;
      this.rejectReasonError = 'LBL_ERROR_MESSAGE_RJCT_RSN';
      return;
    }
    this.isLoadingComplete = false;
    this.myTaskService
      .rejectCreditCard({
        rejectReason: this.rejectReasonText,
        moduleId: this.moduleId,
        refNo: this.transferSummaryDetails.summary.refNo,
        hostCode: this.transferSummaryDetails.summary.INPUT_HOST_CODE,
        productCode: this.transferSummaryDetails.summary.productCode,
        subProductCode: this.transferSummaryDetails.summary.subproductCode,
        functionCode: this.transferSummaryDetails.summary.functionCode,
      })
      .subscribe(
        (response: any) => {
          this.isLoadingComplete = true;
          if (response.dataValue.STATUS === 'Success') {
            this.referenceNumber = response.dataValue.SELECTED_RECORDS;
            this.constructReceiptData(response.dataValue.SELECTED_RECORDS);
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  isValidReason(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    } else {
      this.isRejectReasonValid = false;
    }
  }

  constructReceiptData(referenceNumber: string) {
    const maskCardNumber = new MaskCardNumberPipe();
    this.receiptObject = {
      msg1: 'LBL_CONFIRMATION',
      msg2: this.receiptMessage,
      referenceNumber: referenceNumber,
      receiptDetails: [
        {
          title: 'LBL_RJCT_RSN',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_STATUS',
              dataKey: 'LBL_REJECTED',
            },
            {
              dispKey: 'LBL_REASON',
              dataKey: this.rejectReasonText
                ? this.rejectReasonText
                : 'Not Provided',
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: '/assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: '/assets/images/saveReceipt.svg',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
      initiateButton: {
        buttonLabel: 'LBL_MAKE_ANOTHER_AUTHORIZATION',
      },
    };

    if (this.moduleId !== 'CRDLMTADJREJ') {
      this.receiptObject.receiptDetails.unshift({
        title: 'LBL_CREDIT_CARD',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_FULL_NAME',
            dataKey: this.transferSummaryDetails.summary.cardName,
          },
          {
            dispKey: 'LBL_CARD_NO',
            dataKey: maskCardNumber.transform(
              this.transferSummaryDetails.summary.cardNo
            ),
          },
          {
            dispKey: 'LBL_CARD_TYPE',
            dataKey: this.transferSummaryDetails.details.cardType,
          },
        ],
      });
    } else {
      const currencyFormatPipeFilter = new CurrencyFormatPipe();
      this.transferSummaryDetails.details.cardsLmtAdj.forEach((card: any) => {
        card.newLmt = `${currencyFormatPipeFilter.transform(
          card.newLmt,
          card.currency
        )} ${card.currency}`;
        card.cardNo = maskCardNumber.transform(card.cardNo);
      });
      this.receiptObject.receiptDetails.unshift({
        title: 'LBL_CARD_DETAILS',
        isTable: 'true',
        data: this.transferSummaryDetails.details.cardsLmtAdj,
        fieldDetails: [
          {
            dispKey: 'LBL_CARD_NAME',
            dataKey: 'cardName',
          },
          {
            dispKey: 'LBL_CARD_NO',
            dataKey: 'cardNo',
          },
          {
            dispKey: 'LBL_NEW_LIMIT',
            dataKey: 'newLmt',
          },
        ],
      });
    }
    if (
      this.fieldDetails &&
      this.fieldDetails.fieldDetails &&
      this.fieldDetails.fieldDetails.length
    ) {
      this.receiptObject.receiptDetails.splice(1, 0, this.fieldDetails);
    }
    this.showReceipt = true;
  }

  initiateAnotherRequest() {
    this.router.navigate(['/mytask/cards/creditCard']);
  }

  downloadPdf(): void {
    switch (this.transferSummaryDetails.summary.subproductCode) {
      case 'CARDSTP':
        this.stopCardPdf();
        break;
      case 'CARDACT':
        this.activateCardPdf();
        break;
      case 'CRDVWPIN':
        this.viewPinPdf();
        break;
      case 'CRDWITHCH':
        this.withdrawLimitChangePdf();
        break;
      case 'CRDCRELIM':
        this.creditLimitChangePdf();
        break;
      case 'CARDPAY':
        this.creditCardPayment();
        break;
      case 'CRDREISSU':
        this.reissueCardPdf();
        break;
      case 'CRDLIMAD':
        this.multipleLimitChangePdf();
        break;
    }
  }

  stopCardPdf(): void {
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_STOP_CARD_RECEIPT'),
        x: 85,
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
        value: this.translateService.instant('LBL_STOP_CARD_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_DETAILS'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FULL_NAME'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardName
          ? this.transferSummaryDetails.summary.cardName
          : ' ',
        y: 75,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardNo
          ? this.transferSummaryDetails.summary.cardNo
          : ' ',
        y: 85,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.cardType
          ? this.transferSummaryDetails.details.cardType
          : ' ',
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REASON_TO_STOP'),
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_COMMENTS'),
        y: 125,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.reason ?? ' ',
        y: 115,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.comments
          ? this.transferSummaryDetails.details.comments
          : '',
        y: 125,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 155,
      },
      { type: 'text', value: this.referenceNumber, y: 155 },
      {
        type: 'heading',
        value: this.translateService.instant(this.receiptMessage),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_STOP_CARD') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  activateCardPdf(): void {
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_ACTIVATE_CARD_RECEIPT'),
        x: 85,
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
        value: this.translateService.instant('LBL_ACTIVATE_CARD_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_DETAILS'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FULL_NAME'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardName
          ? this.transferSummaryDetails.summary.cardName
          : ' ',
        y: 75,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardNo
          ? this.transferSummaryDetails.summary.cardNo
          : ' ',
        y: 85,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.cardType
          ? this.transferSummaryDetails.details.cardType
          : ' ',
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 155,
      },
      { type: 'text', value: this.referenceNumber, y: 155 },
      {
        type: 'heading',
        value: this.translateService.instant(this.receiptMessage),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_ACTIVATE_CARD') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  reissueCardPdf(): void {
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_RE_ISSUE_CARD_RECEIPT'),
        x: 85,
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
        value: this.translateService.instant('LBL_CARD_DETAILS'),
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
        value: this.translateService.instant('LBL_FULL_NAME'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardName
          ? this.transferSummaryDetails.summary.cardName
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardNo
          ? this.transferSummaryDetails.summary.cardNo
          : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.cardType
          ? this.transferSummaryDetails.details.cardType
          : '--',
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 155,
      },
      {
        type: 'text',
        value: this.referenceNumber ? this.referenceNumber : ' ',
        y: 155,
      },
      {
        type: 'heading',
        value: this.translateService.instant(this.receiptMessage),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_RE_ISSUE_CARD') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  withdrawLimitChangePdf(): void {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant(
          'LBL_CHANGE_WITHDRAWAL_LIMIT_RECEIPT'
        ),
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
        value: this.translateService.instant(
          'LBL_CREDIT_CARD_WITHDRAW_LIMIT_DETAILS'
        ),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_DETAILS'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FULL_NAME'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CURRENT_LIMIT'),
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_NEW_WITHDRAWAL_LIMIT'),
        y: 125,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardName
          ? this.transferSummaryDetails.summary.cardName
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardNo
          ? this.transferSummaryDetails.summary.cardNo
          : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.cardType
          ? this.transferSummaryDetails.details.cardType
          : '--',
        y: 95,
      },
      {
        type: 'text',
        value:
          this.transferSummaryDetails.details.currentLmt &&
          this.transferSummaryDetails.details.currency
            ? `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.currentLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`
            : '--',
        y: 115,
      },
      {
        type: 'text',
        value:
          this.transferSummaryDetails.details.newLmt &&
          this.transferSummaryDetails.details.currency
            ? `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.newLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`
            : '--',
        y: 125,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 155,
      },
      {
        type: 'text',
        value: this.referenceNumber,
        y: 155,
      },
      {
        type: 'heading',
        value: this.translateService.instant(this.receiptMessage),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value:
        this.translateService.instant('LBL_CHANGE_WITHDRAWAL_LIMIT') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  creditLimitChangePdf(): void {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_CHANGE_CARD_LIMIT_RECEIPT'),
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
        value: this.translateService.instant(
          'LBL_CREDIT_CARD_CREDIT_LIMIT_DETAILS'
        ),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_DETAILS'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FULL_NAME'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CURRENT_LIMIT'),
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_MAX_LIMIT'),
        y: 125,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_MIN_LIMIT'),
        y: 135,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_NEW_LIMIT'),
        y: 145,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardName
          ? this.transferSummaryDetails.summary.cardName
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardNo
          ? this.transferSummaryDetails.summary.cardNo
          : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.cardType
          ? this.transferSummaryDetails.details.cardType
          : '--',
        y: 95,
      },
      {
        type: 'text',
        value:
          this.transferSummaryDetails.details.currentLmt &&
          this.transferSummaryDetails.details.currency
            ? `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.currentLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`
            : '--',
        y: 115,
      },
      {
        type: 'text',
        value:
          this.transferSummaryDetails.details.maxLmt &&
          this.transferSummaryDetails.details.currency
            ? `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.maxLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`
            : '--',
        y: 125,
      },
      {
        type: 'text',
        value:
          this.transferSummaryDetails.details.minLmt &&
          this.transferSummaryDetails.details.currency
            ? `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.minLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`
            : '--',
        y: 135,
      },
      {
        type: 'text',
        value:
          this.transferSummaryDetails.details.newLmt &&
          this.transferSummaryDetails.details.currency
            ? `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.newLmt,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`
            : '--',
        y: 145,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 165,
      },
      {
        type: 'text',
        value: this.referenceNumber,
        y: 165,
      },
      {
        type: 'heading',
        value: this.translateService.instant(this.receiptMessage),
        y: 175,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_CHANGE_CREDIT_LIMIT') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  creditCardPayment(): void {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_CREDIT_CARD_PAYMENT_RECEIPT'),
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
        value: this.translateService.instant('LBL_CREDIT_CARD_PAYMENT_DETAILS'),
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
        value: this.translateService.instant('LBL_ACC_NUMBER'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FULL_NAME'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_AMOUNT'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_DETAILS'),
        y: 105,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NAME'),
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 125,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 135,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.accNo
          ? this.transferSummaryDetails.details.accNo
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.accName
          ? this.transferSummaryDetails.details.accName
          : '--',
        y: 85,
      },
      {
        type: 'text',
        value:
          this.transferSummaryDetails.details.amount &&
          this.transferSummaryDetails.details.currency
            ? `${currencyFormatPipeFilter.transform(
                this.transferSummaryDetails.details.amount,
                this.transferSummaryDetails.details.currency
              )} ${this.transferSummaryDetails.details.currency}`
            : '--',
        y: 95,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardName
          ? this.transferSummaryDetails.summary.cardName
          : '--',
        y: 115,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardNo
          ? this.transferSummaryDetails.summary.cardNo
          : '--',
        y: 125,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.cardType
          ? this.transferSummaryDetails.details.cardType
          : '--',
        y: 135,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 165,
      },
      {
        type: 'text',
        value: this.referenceNumber,
        y: 165,
      },
      {
        type: 'heading',
        value: this.translateService.instant(
          'LBL_CREDIT_CARD_PAYMENT_PENDING_MSG'
        ),
        y: 175,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_CREDIT_CARD_PAYMENT') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  viewPinPdf(): void {
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_VIEW_PIN_RECEIPT'),
        x: 85,
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
        value: this.translateService.instant('LBL_VIEW_PIN_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CREDIT_CARD'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FULL_NAME'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardName
          ? this.transferSummaryDetails.summary.cardName
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.summary.cardNo
          ? this.transferSummaryDetails.summary.cardNo
          : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.transferSummaryDetails.details.cardType
          ? this.transferSummaryDetails.details.cardType
          : '--',
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 115,
      },
      {
        type: 'text',
        value: this.referenceNumber ? this.referenceNumber : '--',
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant(this.receiptMessage),
        y: 125,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_VIEW_PIN') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  multipleLimitChangePdf(): void {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    const head: any = [
      this.translateService.instant('LBL_CARD_NAME'),
      this.translateService.instant('LBL_CARD_NO'),
      this.translateService.instant('LBL_NEW_LIMIT'),
    ];
    const body = this.transferSummaryDetails.details.cardsLmtAdj.map(
      (val: any) => {
        return {
          [head[0]]: val.cardName,
          [head[1]]: val.cardNo,
          [head[2]]: val.newLmt,
        };
      }
    );
    let yAfterTable = 85;
    yAfterTable =
      this.transferSummaryDetails.details.cardsLmtAdj.length * 10 + yAfterTable;
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_CHANGE_CARD_LIMIT_MULTIPLE'),
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
        value: this.translateService.instant('LBL_CARD_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_DETAILS'),
        y: 65,
      },
      {
        type: 'table',
        head: head,
        body: body,
        y: 75,
        x: 20,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: yAfterTable + 55,
      },
      {
        type: 'text',
        value: this.referenceNumber ? this.referenceNumber : '--',
        y: yAfterTable + 55,
      },
      {
        type: 'heading',
        value: this.translateService.instant(this.receiptMessage),
        y: yAfterTable + 65,
      },
    ];

    pdfData.push({
      type: 'save',
      value:
        this.translateService.instant('LBL_CARD_LIMIT_ADJUSTMENT') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  onBackArrowClick() {
    this.location.back();
  }
}
