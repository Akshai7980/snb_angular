import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreditCardShowPinComponent } from '../credit-card-show-pin/credit-card-show-pin.component';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
import { CardsService } from '../../services/cards.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MaskCardNumberPipe } from 'src/app/pipes/mask-card-number.pipe';

@Component({
  selector: 'app-credit-view-pin',
  templateUrl: './credit-view-pin.component.html',
  styleUrls: ['./credit-view-pin.component.scss'],
})
export class CreditViewPinComponent implements OnInit {
  viewPinEmit: any = {};
  viewPinReviewEmit: any = {};
  receiptObject: any = {};
  submitResponse: any = {};

  cardPin: string = '';

  isLoadingComplete: boolean = true;
  matDialogRef: any;
  showCardDetails: boolean = false;
  cardDetails: any = {};

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private downloadAsPdf: downloadAsPdf,
    private dialog: MatDialog,
    private cardService: CardsService
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.rootScopeData.creditCardListDetail).length <= 0) {
      this.router.navigate(['/cards/cardsInquiry']);
      return;
    }
    this.viewPinEmit.canProceed = true;
    this.cardDetails = this.rootScopeData.creditCardListDetail;
    this.showCardDetails = true;
    this.viewPinEmit.canProceed = false;
    this.viewPinReviewEmit.canSubmit = false;
  }

  getViewPinEmit(event: any) {
    this.viewPinEmit = event;
  }

  getSubmitEmit(event: any) {
    if (event.canSubmit) {
      this.viewPinReviewEmit = event;
      this.submitFunct();
    } else {
      this.viewPinEmit.canProceed = false;
      this.viewPinReviewEmit.canSubmit = false;
    }
  }

  submitFunct() {
    this.isLoadingComplete = false;
    this.cardService.viewPinSubmit(this.viewPinReviewEmit).subscribe((res: any) => {
      this.isLoadingComplete = true;
      if (res.dataValue?.STATUS === 'SUCCESS') {
        this.cardPin = res.dataValue.CARD_PIN;
        this.submitResponse = res.dataValue;
        this.constructReceiptData(
          res.dataValue.INPUT_REFERENCE_NO
        );
      }
    }, () => {
      this.isLoadingComplete = true;
    })
  }

  constructReceiptData(referenceNo: string) {
    this.receiptObject = {
      msg1: 'LBL_REQUEST_SUCCESSFULL',
      msg2: 'LBL_VIEW_PIN_REQUEST_SUCCESS_MSG',
      referenceNumber: referenceNo,
      receiptDetails: [
        {
          title: 'LBL_CREDIT_CARD',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_FULL_NAME',
              dataKey: this.cardDetails?.holderName ? this.cardDetails.holderName : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.cardDetails?.maskedCardId ? this.cardDetails.maskedCardId : '--',
            },
            {
              dispKey: 'LBL_CARD_TYPE',
              dataKey: this.cardDetails?.cardType ? this.cardDetails.cardType : '--',
            },
          ],
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
      initiateButton: {
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST',
      },

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    if (this.viewPinReviewEmit.flexiAuth === 'false' || !this.viewPinReviewEmit.flexiAuth) {
      this.receiptObject.receiptDetails.splice(1, 0, {
        title: '',
        isTable: 'false',
        data: '',
        type: 'viewPin',
      });
    }

    this.viewPinReviewEmit.flexiAuth.toString() === 'true' &&
      this.receiptObject.receiptDetails.push(
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: this.viewPinReviewEmit?.authData?.selectedAprover
                ?.AUTH_NAME
                ? this.viewPinReviewEmit.authData.selectedAprover.AUTH_NAME
                : 'LBL_NOT_PROVIDED',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: this.viewPinReviewEmit?.authData?.aproveNote
                ? this.viewPinReviewEmit?.authData?.aproveNote
                : 'LBL_NOT_PROVIDED',
            },
          ],
        },
        {
        title: '',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: this.submitResponse?.STATUS
              ? this.submitResponse.STATUS
              : '--',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: this.submitResponse?.OD_STATUS_DESC
              ? this.submitResponse.OD_STATUS_DESC
              : '--',
          },
        ],
      });
  }

  toActivateAnotherCard() {
    this.viewPinEmit.canProceed = false;
    this.viewPinReviewEmit.canSubmit = false;
    this.router.navigate(['/cards/cardsInquiry']);
  }

  onViewPinClick() {
    this.matDialogRef = this.dialog.open(CreditCardShowPinComponent, {
      data: {pin: this.cardPin},
      width: '41%',
      height: '75%',
      maxHeight: '310px',
      disableClose: true
    });
  }

  downloadPdf() {
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
        value: this.cardDetails.holderName ? this.cardDetails.holderName : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.cardDetails.maskedCardId ? this.cardDetails.maskedCardId : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.cardDetails.cardType ? this.cardDetails.cardType : '--',
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 155,
      },
      { type: 'text', value: this.submitResponse.INPUT_REFERENCE_NO ? this.submitResponse.INPUT_REFERENCE_NO : '--', y: 155 },
      {
        type: 'heading',
        value: this.translateService.instant(
          'LBL_VIEW_PIN_REQUEST_SUCCESS_MSG'
        ),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_VIEW_PIN') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
