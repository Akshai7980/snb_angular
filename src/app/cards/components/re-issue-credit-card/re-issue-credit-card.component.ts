import { Component, OnInit } from '@angular/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
import { CardsService } from '../../services/cards.service';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-re-issue-credit-card',
  templateUrl: './re-issue-credit-card.component.html',
  styleUrls: ['./re-issue-credit-card.component.scss'],
})
export class ReIssueCreditCardComponent implements OnInit {
  isLoadingComplete: boolean = true;

  reIssueEmit: any = {};
  reIssueReviewEmit: any = {};
  receiptObject: any = {};
  cardDetails: any = {};

  refNo: string = '';

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf,
    private readonly cardService: CardsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.reIssueEmit.canProceed = false;
    this.reIssueReviewEmit.canSubmit = false;
  }

  getReIssueEmit(event: any) {
    this.reIssueEmit = event;
  }

  getSubmitEmit(event: any) {
    if (event.canSubmit) {
      this.reIssueReviewEmit = event;
      this.submitFunct();
    } else {
      this.reIssueEmit.canProceed = false;
      this.reIssueReviewEmit.canSubmit = false;
    }
  }

  submitFunct() {
    this.isLoadingComplete = false;
    this.cardService.reIssueCardSubmit(this.reIssueReviewEmit).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.dataValue &&
          res.dataValue.STATUS &&
          res.dataValue.STATUS === 'SUCCESS'
        ) {
          this.cardDetails = this.reIssueReviewEmit.cardDetails;
          this.refNo = res.dataValue.INPUT_REFERENCE_NO;
          this.constructReceiptData(
            res.dataValue.INPUT_REFERENCE_NO,
            this.reIssueReviewEmit.cardDetails,
            res
          );
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  constructReceiptData(referenceNo: string, cardDetails: any, response: any) {
    this.receiptObject = {
      msg1: 'LBL_REQUEST_SUCCESSFULL',
      msg2: 'LBL_RE_ISSUE_CARD_REQUEST_PENDING_MSG',
      referenceNumber: referenceNo,
      // showCallBackComponent: this.reIssueReviewEmit.isFlexiAuth,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.userNo
                ? this.rootScopeData.userInfo.userNo
                : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: cardDetails?.maskedCardId
                ? cardDetails.maskedCardId
                : '--',
            },
            {
              dispKey: 'LBL_CARD_NAME',
              dataKey: cardDetails?.holderName ? cardDetails.holderName : '--',
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
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST',
      },

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    const authorization = {
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey: this.reIssueReviewEmit?.authData?.selectedAprover?.AUTH_NAME
            ? this.reIssueReviewEmit.authData.selectedAprover.AUTH_NAME
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey: this.reIssueReviewEmit?.authData?.aproveNote
            ? this.reIssueReviewEmit?.authData?.aproveNote
            : 'LBL_NOT_PROVIDED',
        },
      ],
    };

    const responseData = {
      title: '',
      isTable: 'false',
      fieldDetails: [
        {
          dispKey: 'LBL_STATUS',
          dataKey: response.dataValue.STATUS ? response.dataValue.STATUS : '--',
        },
        {
          dispKey: 'LBL_RESPONSE',
          dataKey: response.dataValue.OD_STATUS_DESC
            ? response.dataValue.OD_STATUS_DESC
            : '--',
        },
      ],
    };

    // if (
    //   this.receiptObject.showCallBackComponent &&
    //   this.reIssueReviewEmit.isFlexiAuth
    // ) {
    //   this.receiptObject.response = responseData;
    if (this.reIssueReviewEmit.isFlexiAuth) {
      this.receiptObject.receiptDetails.push(authorization);
      this.receiptObject.receiptDetails.push(responseData);
    }
  }

  toActivateAnotherCard() {
    this.router.navigate(['/cards/cardsInquiry/credit']);
  }

  downloadPdf() {
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
        value: this.translateService.instant('LBL_ACTION_BY'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NAME'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.rootScopeData.userInfo.userNo
          ? this.rootScopeData.userInfo.userNo
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.cardDetails?.maskedCardId
          ? this.cardDetails.maskedCardId
          : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.cardDetails?.holderName
          ? this.cardDetails.holderName
          : '--',
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 155,
      },
      { type: 'text', value: this.refNo ? this.refNo : ' ', y: 155 },
      {
        type: 'heading',
        value: this.translateService.instant(
          'LBL_RE_ISSUE_CARD_REQUEST_PENDING_MSG'
        ),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_RE_ISSUE_CARD') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
