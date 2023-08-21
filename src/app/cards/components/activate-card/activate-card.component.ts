import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-activate-card',
  templateUrl: './activate-card.component.html',
  styleUrls: ['./activate-card.component.scss'],
})
export class ActivateCardComponent implements OnInit {
  receiptObject: any = {};
  cardDetailsEmit: any = {};
  cardReviewEmit: any = {};

  isLoadingComplete: boolean = true;

  ChannelId: string = '';
  referenceNumber: string = '';

  constructor(
    private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf,
    private readonly cardService: CardsService
  ) {}

  ngOnInit(): void {
    this.ChannelId = 'web';
  }

  getProceedEmit(event: any) {
    this.cardDetailsEmit = event;
  }

  getSubmitEmit(event: any) {
    this.cardReviewEmit = event;
    if (!this.cardReviewEmit.canViewReceipt) {
      this.cardDetailsEmit.canProceed = false;
    }
    this.onSubmit(event);
  }

  onSubmit(params: any) {
    this.isLoadingComplete = false;
    this.cardService.activateCardSubmit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res?.dataValue &&
          res?.dataValue?.STATUS &&
          res.dataValue?.STATUS === 'SUCCESS'
        ) {
          this.referenceNumber = res.dataValue.INPUT_REFERENCE_NO;
          this.constructReceiptData(res, this.cardReviewEmit.cardDetail);
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  constructReceiptData(response: any, cardDetails: any) {
    this.receiptObject = {
      msg1: 'LBL_REQUEST_SUCCESSFULL',
      msg2: 'LBL_YOUR_CREDIT_CARD_ACTIVATION_MSG',
      referenceNumber: this.referenceNumber,
      subProductCode: 'CARDACT',
      receiptDetails: [
        {
          title: 'LBL_CARD_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: cardDetails?.holderName ? cardDetails.holderName : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: cardDetails?.cardId ? cardDetails.cardId : '--',
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: cardDetails?.expiryDate ? cardDetails.expiryDate : '--',
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
        buttonLabel: 'LBL_ACTIVATE_ANOTHER_CARD',
      },

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    const responseData = [
      {
        title: 'LBL_AUTHORIZATION',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_Next_Approver',
            dataKey: this.cardReviewEmit?.authData?.selectedAprover?.AUTH_NAME
              ? this.cardReviewEmit.authData.selectedAprover.AUTH_NAME
              : 'LBL_NOT_PROVIDED',
          },
          {
            dispKey: 'LBL_ADD_NEXT_APROVER',
            dataKey: this.cardReviewEmit?.authData?.aproveNote
              ? this.cardReviewEmit.authData.aproveNote
              : 'LBL_NOT_PROVIDED',
          },
        ],
      },
      {
        title: '',
        isTable: 'false',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: response?.dataValue?.STATUS
              ? response.dataValue.STATUS
              : '--',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: response?.dataValue?.OD_STATUS_DESC
              ? response.dataValue.OD_STATUS_DESC
              : '--',
          },
        ],
      }
    ];

    if (this.cardReviewEmit.flexAuthResp?.flexiAuth === 'true') {
      this.receiptObject.receiptDetails = [...this.receiptObject.receiptDetails, ...responseData];
    }
  }

  toActivateAnotherCard() {
    this.cardDetailsEmit.canProceed = false;
    this.cardReviewEmit.canViewReceipt = false;
  }

  downloadPdf() {
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
        value: this.translateService.instant('LBL_EXPIRY_DATE'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.cardReviewEmit?.cardDetail?.holderName
          ? this.cardReviewEmit.cardDetail.holderName
          : ' ',
        y: 75,
      },
      {
        type: 'text',
        value: this.cardReviewEmit?.cardDetail?.cardId
          ? this.cardReviewEmit.cardDetail.cardId
          : ' ',
        y: 85,
      },
      {
        type: 'text',
        value: this.cardReviewEmit?.cardDetail?.expiryDate
          ? this.cardReviewEmit.cardDetail.expiryDate
          : ' ',
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
        value: this.translateService.instant(
          'LBL_YOUR_CREDIT_CARD_ACTIVATION_MSG'
        ),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_ACTIVATE_CARD') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
