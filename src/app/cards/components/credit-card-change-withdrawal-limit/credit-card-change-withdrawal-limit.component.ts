import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CardsService } from '../../services/cards.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';

@Component({
  selector: 'app-credit-card-change-withdrawal-limit',
  templateUrl: './credit-card-change-withdrawal-limit.component.html',
  styleUrls: ['./credit-card-change-withdrawal-limit.component.scss'],
})
export class CreditCardChangeWithdrawalLimitComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingComplete: boolean = true;
  showErrMsg: boolean = false;

  title: string = 'creditCard';
  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  enableEdit: boolean = false;
  sefAuthFlag: string = '';
  creditCardLimit: any;
  newLimit: any;

  receiptObject: any = {};
  creditCardObj: any = {};
  creditCardData: any = [];
  limitDetails: any = {
    currentLimit: '300.00',
    maxLimit: '6000.00',
    newLimit: '',
  };
  flexiAuth: any;

  cardDetails: any;
  submitData: any;
  url: string = systemproperty.termsAndConditionsForPayments;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private downloadAsPdf: downloadAsPdf,
    private cards: CardsService
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.rootScopeData.creditCardListDetail).length <= 0) {
      this.router.navigate(['/cards/cardsInquiry']);
      return;
    }
    this.cardDetails = this.rootScopeData.creditCardListDetail;

    this.constructCreditCardTable();
    this.getCreditCardLimits();
    // if (JSON.stringify(this.rootScopeData.creditCardMoreActionList) === "{}") {
    //   this.router.navigate(['/cards/cardsInquiry']);
    // }
  }

  constructCreditCardTable() {
    this.creditCardObj = {
      title: 'LBL_CREDIT_CARD',
      data: [this.cardDetails],
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

  OnAccountSelect(event: any) {
    if (event === 'iconClick')
      this.title === 'creditCard'
        ? this.initiateAnotherRequest()
        : (this.title = 'creditCard');
  }

  getAuthorizationData() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo?.sCustNo
        : '',
      accNo: this.cardDetails.accountId,
      productCode: 'CORESVS',
      subProdCode: 'CRDVWPIN',
      funcCode: 'VWPINFNC',
      amount: this.cardDetails.balance,
      pymntCurrency: this.cardDetails.currency,
      debitCurrency: this.cardDetails.currency,
    };
    this.cards.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        this.sefAuthFlag = res.data.selfAuth ? res.data.selfAuth : '';
        this.flexiAuth = res.data.flexiAuth;
        if (res && res.data.flexiAuth == 'true') {
            this.authOptions = res.data.authList;
        }
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getData(event: any) {
    this.authDetail = event;
  }

  onToggleChange() {
    this.enableEdit = !this.enableEdit;
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

  // Allows only numbers
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onCheckNewLimit() {
    const newLimit = parseInt(this.newLimit);
    if (
      newLimit >
      parseInt(this.creditCardLimit.maximumCreditLimitDecreaseValue.amount)
    ) {
      this.showErrMsg = true;
      return;
    }
    this.showErrMsg = false;
  }

  toProceed() {
    this.showErrMsg = false;
    if (
      !this.newLimit ||
      this.newLimit === '' ||
      this.newLimit >
        parseInt(this.creditCardLimit.maximumCreditLimitDecreaseValue.amount)
    ) {
      this.showErrMsg = true;
      return;
    }
    this.newLimit = parseInt(this.newLimit).toFixed(2);
    this.getAuthorizationData();
    this.title = 'review';
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
      cif: this.cardDetails.cifNo,
      userOtpValue: this.userOtpValue,
      secAuthRef: this.secAuthRef,
      SEL_PARSED_RULE_ID: this.authDetail.selectedAprover?.PARSED_RULE_ID
        ? this.authDetail.selectedAprover?.PARSED_RULE_ID
        : '',
      SELECTION_FLAG: this.authOptions.length > 0 ? 'Y' : 'N',
      sefAuthFlag: this.sefAuthFlag,
      CARD_NUM: this.cardDetails.cardId ? this.cardDetails.cardId : '',
      CARD_TYPE: this.cardDetails.cardType ? this.cardDetails.cardType : '',
      CURRENCY: this.cardDetails.currency ? this.cardDetails.currency : '',
      // CARD_LIMIT: this.newLimit,
      CARD_STATUS: this.cardDetails.cardStatus?.description
        ? this.cardDetails.cardStatus?.description
        : '',
      BALANCE: this.cardDetails.balance ? this.cardDetails.balance : '',
      NEW_LIMIT: this.newLimit,
      CURRENT_LIMIT: this.cardDetails.creditLimit
        ? this.cardDetails.creditLimit
        : '',
      CARD_NAME: this.cardDetails.holderName ? this.cardDetails.holderName : '',
    };

    this.cards.cardWithdrawalLimitSubmit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        if (res.dataValue.STATUS === 'SUCCESS') {
          this.submitData = res.dataValue;
          this.constructReceiptData(this.submitData.INPUT_REFERENCE_NO);
        }
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
    // this.constructReceiptData();
  }

  constructReceiptData(referenceNumber: string) {
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_CHANGE_WITHDRAWAL_LIMIT_SENT_TO_APPROVE',
      referenceNumber: referenceNumber,
      receiptDetails: [
        {
          title: 'LBL_CREDIT_CARD',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_NAME',
              dataKey: this.cardDetails.holderName
                ? this.cardDetails.holderName
                : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.cardDetails.maskedCardId
                ? this.cardDetails.maskedCardId
                : '--',
            },
            {
              dispKey: 'LBL_CARD_TYPE',
              dataKey: this.cardDetails.cardType
                ? this.cardDetails.cardType
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
              dispKey: 'LBL_CURRENT_LIMIT',
              dataKey:
                this.creditCardLimit.currentCreditLimit.amount &&
                this.creditCardLimit.currentCreditLimit.currencyCode
                  ? this.getConvertedCurrency(
                      this.creditCardLimit.currentCreditLimit.amount,
                      this.creditCardLimit.currentCreditLimit.currencyCode
                    )
                  : '--',
            },
            {
              dispKey: 'LBL_NEW_WITHDRAWAL_LIMIT',
              dataKey:
                this.newLimit &&
                this.creditCardLimit.currentCreditLimit.currencyCode
                  ? this.getConvertedCurrency(
                      this.newLimit,
                      this.creditCardLimit.currentCreditLimit.currencyCode
                    )
                  : '--',
            },
          ],
        }
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
            dataKey: this.submitData.STATUS ? this.submitData.STATUS : '--',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: this.submitData.OD_STATUS_DESC
              ? this.submitData.OD_STATUS_DESC
              : '--',
          },
        ],
      });
    this.title = 'receipt';
  }

  initiateAnotherRequest() {
    this.router.navigate(['/cards/cardsInquiry']);
  }

  // Need to integrate the proper fields.
  downloadPdf() {
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
        value: this.cardDetails.holderName ? this.cardDetails.holderName : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.cardDetails.cardId ? this.cardDetails.cardId : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.cardDetails.cardType ? this.cardDetails.cardType : '--',
        y: 95,
      },
      {
        type: 'text',
        value:
          this.creditCardLimit.currentCreditLimit.amount &&
          this.creditCardLimit.currentCreditLimit.currencyCode
            ? this.getConvertedCurrency(
                this.creditCardLimit.currentCreditLimit.amount,
                this.creditCardLimit.currentCreditLimit.currencyCode
              )
            : '--',
        y: 115,
      },
      {
        type: 'text',
        value:
          this.newLimit && this.creditCardLimit.currentCreditLimit.currencyCode
            ? this.getConvertedCurrency(
                this.newLimit,
                this.creditCardLimit.currentCreditLimit.currencyCode
              )
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
        value: this.submitData.INPUT_REFERENCE_NO
          ? this.submitData.INPUT_REFERENCE_NO
          : '--',
        y: 155,
      },
      {
        type: 'heading',
        value: this.translateService.instant(
          'LBL_CHANGE_WITHDRAWAL_LIMIT_SENT_TO_APPROVE'
        ),
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

  getCreditCardLimits() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      pan: this.cardDetails?.cardId ? this.cardDetails.cardId : '',
    };
    this.cards.getCreditCardLimit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.dataValue) {
          this.creditCardLimit =
            res.dataValue;
        }
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getConvertedCurrency(amount: string, currency: string): string {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    return `${currencyFormatPipeFilter.transform(
      amount,
      currency
    )} ${currency}`;
  }
}
