import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CardsService } from '../../services/cards.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';

@Component({
  selector: 'app-stop-credit-card',
  templateUrl: './stop-credit-card.component.html',
  styleUrls: ['./stop-credit-card.component.scss'],
})
export class StopCreditCardComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  isLoadingComplete: boolean = true;
  isReasonReadonly: boolean = false;
  selectReasonError: boolean = false;
  isSelfAuth: boolean = false;

  title: string = 'stopCard';
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  reason: string = '';
  comment: string = '';
  referenceNumber: string = '';

  authOptions: Array<object> = [];
  reasonsList: any = [];

  authDetail: any = {};
  receiptObject: any = {};
  creditCardObj: any = {};
  url: string = systemproperty.termsAndConditionsForPayments;
  flexiAuth: any;

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf,
    private readonly cards: CardsService
  ) {}

  ngOnInit(): void {
    this.getCreditCardDropDown();
    if (JSON.stringify(this.rootScopeData.creditCardMoreActionList) === '{}') {
      this.router.navigate(['/cards/cardsInquiry']);
    }
    this.constructCreditCardTable();
  }

  constructCreditCardTable() {
    [this.rootScopeData.creditCardMoreActionList].forEach((element: any) => {
      element.cardId = element.cardId ? element.cardId : '--';
      element.holderName = element.holderName ? element.holderName : '--';
      element.cardType = element.cardType ? element.cardType : '--';
      element.statusDescription = element.statusDescription
        ? element.statusDescription
        : '--';
      element.balance = element.balance ? element.balance : '--';
    });

    this.creditCardObj = {
      title: 'LBL_CREDIT_CARD',
      data: [this.rootScopeData.creditCardMoreActionList],
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'maskedCardId',
        },
        {
          dispKey: 'LBL_CARD_NAME',
          dataKey: 'holderName',
        },
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: 'cardType',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'statusDescription',
        },
        {
          dispKey: 'LBL_BALANCE_AMOUNT',
          dataKey: 'balance',
          dataKeySupport: 'currency',
        },
      ],
    };
  }

  getCreditCardDropDown() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.cards.getStopPaymentDropDown(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.data &&
          res.data.length > 0 &&
          res.data[0].stopCard &&
          res.data[0].stopCard.length > 0
        ) {
          this.reasonsList = res.data[0].stopCard;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  onAccountSelect(event: any) {
    if (event === 'iconClick')
      this.title === 'stopCard'
        ? this.initiateAnotherRequest()
        : (this.title = 'stopCard');
  }

  onSelectedReason() {
    if (this.reason || this.reason !== '') this.selectReasonError = false;
  }

  validateSpace(event: any): void {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  getAuthorizationData() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo.sCustNo
        : '',
      acc: this.rootScopeData?.creditCardMoreActionList?.accountId
        ? this.rootScopeData?.creditCardMoreActionList?.accountId
        : '',
      productCode: 'CORESVS',
      subProdCode: 'CRDVWPIN',
      funcCode: 'VWPINFNC',
      amount: this.rootScopeData?.creditCardMoreActionList?.balance
        ? this.rootScopeData?.creditCardMoreActionList?.balance
        : '',
      pymntCurrency: this.rootScopeData.creditCardMoreActionList?.currency
        ? this.rootScopeData.creditCardMoreActionList?.currency
        : '',
      debitCurrency: this.rootScopeData.creditCardMoreActionList?.currency
        ? this.rootScopeData.creditCardMoreActionList?.currency
        : '',
    };
    this.cards.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.data &&
          res.data.authList &&
          res.data.authList.length > 0
        ) {
          this.authOptions = res.data.authList;
        }
        this.flexiAuth = res.data?.flexiAuth;
        if (res.data.selfAuth === 'true') {
          this.isSelfAuth = true;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }
  getData(event: any) {
    this.authDetail = event;
  }

  onSecondFactorValue(authValue: any) {
    this.secAuthRef = authValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      if (otpValue.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.onSubmit();
    } else {
      this.userOtpValue = '';
    }
  }

  toProceed() {
    this.selectReasonError = false;
    if (!this.reason || this.reason === '') {
      this.selectReasonError = true;
      return;
    }
    this.comment = this.comment.trim();
    this.title = 'review';
    this.getAuthorizationData();
  }

  onSubmit() {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      param1: this.userOtpValue ? this.userOtpValue : '',
      param2: this.secAuthRef ? this.secAuthRef : '',
      selectionFlag:
        this.authDetail &&
        this.authDetail?.selectedAprover &&
        this.authDetail?.selectedAprover?.AUTH_NAME !== 'Any'
          ? 'Y'
          : 'N',
      inputValueDate: '',
      inputVersionNo: '1', // Harshitha confirmed to send a static value as 1.
      cardNo: this.rootScopeData?.creditCardMoreActionList?.cardId
        ? this.rootScopeData.creditCardMoreActionList.cardId
        : '--',
      cardName: this.rootScopeData?.creditCardMoreActionList?.cardProduct
        ?.description
        ? this.rootScopeData.creditCardMoreActionList.cardProduct.description
        : '',
      reason: this.reason ? this.reason : '',
      selfParsedRuleId:
        this.authDetail && this.authDetail.selectedAprover
          ? this.authDetail.selectedAprover.PARSED_RULE_ID
          : '',
      INPUT_CIF_NO: this.rootScopeData.creditCardMoreActionList.cifNo
        ? this.rootScopeData.creditCardMoreActionList.cifNo
        : '',
      cardType: this.rootScopeData.creditCardMoreActionList?.cardType
        ? this.rootScopeData.creditCardMoreActionList.cardType
        : '',
      cardStatus: this.rootScopeData.creditCardMoreActionList?.statusDescription
        ? this.rootScopeData.creditCardMoreActionList.statusDescription
        : '',
      balance: this.rootScopeData.creditCardMoreActionList?.linkedAccountsList
        ?.linkedAccount[0]?.accountDetails?.availableBalance
        ? this.rootScopeData.creditCardMoreActionList.linkedAccountsList
            .linkedAccount[0].accountDetails.availableBalance
        : '',
      currency: this.rootScopeData.creditCardMoreActionList?.currency
        ? this.rootScopeData.creditCardMoreActionList.currency
        : '',
      comment: this.comment ? this.comment : '',
    };
    this.cards.getStopPaymentSubmit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.dataValue &&
          res.dataValue.STATUS &&
          res.dataValue.STATUS === 'SUCCESS'
        ) {
          this.referenceNumber = res.dataValue.INPUT_REFERENCE_NO;
          this.constructReceiptData(res.dataValue);
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  constructReceiptData(response: any) {
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_STOP_CREDIT_CARD_SENT_TO_APPROVE',
      referenceNumber: response.INPUT_REFERENCE_NO,
      receiptDetails: [
        {
          title: 'LBL_CREDIT_CARD',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_NAME',
              dataKey: this.rootScopeData?.creditCardMoreActionList?.holderName
                ? this.rootScopeData.creditCardMoreActionList.holderName
                : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.rootScopeData?.creditCardMoreActionList
                ?.maskedCardId
                ? this.rootScopeData.creditCardMoreActionList.maskedCardId
                : '--',
            },
            {
              dispKey: 'LBL_CARD_TYPE',
              dataKey: this.rootScopeData?.creditCardMoreActionList?.cardType
                ? this.rootScopeData.creditCardMoreActionList.cardType
                : '--',
            },
          ],
        },
        {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_REASON_TO_STOP',
              dataKey: this.reason ?? ' ',
            },
            {
              dispKey: 'LBL_COMMENTS',
              dataKey: this.comment ? this.comment : '--',
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
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST',
      },
    };

    this.flexiAuth.toString() === 'true' &&
      this.receiptObject.receiptDetails.push(
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
              dataKey: this.authDetail?.aproveNote
                ? this.authDetail.aproveNote
                : 'Not Provided',
            },
          ],
        },
        {
          title: '',
          isTable: 'false',
          fieldDetails: [
            {
              dispKey: 'LBL_STATUS',
              dataKey: response?.STATUS ? response.STATUS : '--',
            },
            {
              dispKey: 'LBL_RESPONSE',
              dataKey: response?.OD_STATUS_DESC
                ? response.OD_STATUS_DESC
                : '--',
            },
          ],
        }
      );
    this.title = 'receipt';
  }

  initiateAnotherRequest() {
    this.router.navigate(['/cards/cardsInquiry']);
  }

  downloadPdf() {
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
        value: this.rootScopeData?.creditCardMoreActionList?.holderName
          ? this.rootScopeData.creditCardMoreActionList.holderName
          : ' ',
        y: 75,
      },
      {
        type: 'text',
        value: this.rootScopeData?.creditCardMoreActionList?.cardId
          ? this.rootScopeData.creditCardMoreActionList.cardId
          : ' ',
        y: 85,
      },
      {
        type: 'text',
        value: this.rootScopeData?.creditCardMoreActionList?.cardType
          ? this.rootScopeData.creditCardMoreActionList.cardType
          : ' ',
        y: 95,
      },
      {
        type: 'text',
        value: this.reason ?? ' ',
        y: 115,
      },
      {
        type: 'text',
        value: this.comment ? this.comment : '',
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
        value: this.translateService.instant(
          'LBL_STOP_CREDIT_CARD_SENT_TO_APPROVE'
        ),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_STOP_CARD') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
