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
  selector: 'app-credit-card-limit',
  templateUrl: './credit-card-limit.component.html',
  styleUrls: ['./credit-card-limit.component.scss'],
})
export class CreditCardLimitComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingComplete: boolean = true;
  showErrMsg: boolean = false;

  title: string = 'creditCard';
  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  sefAuthFlag: string = '';
  submitData: any;
  receiptObject: any = {};
  creditCardObj: any = {};
  creditCardLimit: any;
  newLimit: any;
  cardDetails: any;
  url: string = systemproperty.termsAndConditionsForPayments;
  flexiAuth: any;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private downloadAsPdf: downloadAsPdf,
    private cards: CardsService
  ) { }

  ngOnInit(): void {
    if (Object.keys(this.rootScopeData.creditCardListDetail).length <= 0) {
      this.router.navigate(['/cards/cardsInquiry']);
      return;
    }

    this.cardDetails = this.rootScopeData.creditCardListDetail;
    
    this.constructCreditCardTable(this.rootScopeData.creditCardListDetail);
    this.getCreditCardLimits();
    // if (JSON.stringify(this.rootScopeData.creditCardMoreActionList) === '{}') {
    //   this.router.navigate(['/cards/cardsInquiry']);
    // }
  }

  getCreditCardLimits() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
      ? this.rootScopeData.userInfo.UNIT_ID
      : '',
      pan: this.cardDetails.cardId ? this.cardDetails.cardId : ''
    };
    this.isLoadingComplete = false;
    this.cards.getCreditCardLimit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.dataValue) {
          const creditCardLimit = res.dataValue;
          this.creditCardLimit = {
            min: creditCardLimit.maximumCreditLimitIncreaseValue.amount,
            minCcy: creditCardLimit.maximumCreditLimitIncreaseValue.currencyCode,
            max: creditCardLimit.maximumCreditLimitDecreaseValue.amount,
            maxCcy:  creditCardLimit.maximumCreditLimitDecreaseValue.currencyCode
          }
        }
      },
      (error) => { 
        this.isLoadingComplete = true;
      }
    );
  }

  onAccountSelect(event: any) {
    if (event === 'iconClick') this.title === 'creditCard' ? this.initiateAnotherRequest() : this.title = 'creditCard';
  }

  constructCreditCardTable(data: any) {
    this.creditCardObj = {
      title: 'LBL_CREDIT_CARD',
      data: [data],
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
          dataKeySupport: 'currency'
        },
      ],
    };
  }

  getAuthorizationData() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData.userInfo?.sCustNo ? this.rootScopeData.userInfo?.sCustNo : '',
      accNo: this.cardDetails.accountId,
      productCode: 'CORESVS',
      subProdCode: 'CRDVWPIN',
      funcCode: 'VWPINFNC',
      amount: this.cardDetails.balance, // need to checK
      pymntCurrency: this.cardDetails.currency, // need to checK
      debitCurrency: this.cardDetails.currency, // need to checK
    };
    this.cards.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        this.sefAuthFlag = res.data.selfAuth;
        if (res) {
          this.flexiAuth = res.data.flexiAuth;
          if (res.data.flexiAuth == 'true') {
            this.authOptions = res.data.authList;
          }
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
      newLimit <
      parseInt(this.creditCardLimit.min) ||
      newLimit >
      parseInt(this.creditCardLimit.max)
    ) {
      this.showErrMsg = true;
      return;
    } else {
      this.showErrMsg = false;
    }
  }
  getConvertedCurrency(amount: string, currency: string): string {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    return `${currencyFormatPipeFilter.transform(
      amount,
      currency
    )} ${currency}`;
  }
  toProceed() {
    this.showErrMsg = false;
    if (
      !this.newLimit ||
      this.newLimit === '' ||
      this.newLimit <
      parseInt(this.creditCardLimit.min) ||
      this.newLimit >
      parseInt(this.creditCardLimit.max)
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
    };
    
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.cardDetails.cifNo,
      userOtpValue: this.userOtpValue,
      secAuthRef: this.secAuthRef,
      entlValue: '',
      SEL_PARSED_RULE_ID: this.authDetail.selectedAprover?.PARSED_RULE_ID
        ? this.authDetail.selectedAprover?.PARSED_RULE_ID
        : '',
      SELECTION_FLAG: this.authOptions.length > 0 ? 'Y' : 'N',
      sefAuthFlag: this.sefAuthFlag,
      CARD_NUM: this.cardDetails.cardId ? this.cardDetails.cardId : '',
      CARD_TYPE: this.cardDetails.cardType ? this.cardDetails.cardType : '',
      CURRENCY: this.cardDetails.currency ? this.cardDetails.currency : '',
      CARD_STATUS: this.cardDetails.cardStatus?.description ? this.cardDetails.cardStatus?.description : '',
      BALANCE: this.cardDetails.balance ? this.cardDetails.balance : '',
      NEW_LIMIT: this.newLimit,
      CARD_NAME: this.cardDetails.holderName ? this.cardDetails.holderName : '',
      MIN_LIMIT: this.creditCardLimit.min ? this.creditCardLimit.min : '',
      MAX_LIMIT: this.creditCardLimit.max ? this.creditCardLimit.max : ''
    };
    this.cards.getChangeCardLimitSubmit(params).subscribe(
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
  }

  constructReceiptData(refNo: any) {
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_CREDIT_CARD_SENT_TO_APPROVE',
      referenceNumber: refNo,
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
              dispKey: 'LBL_MIN_LIMIT',
              dataKey: (this.creditCardLimit.min && this.creditCardLimit.minCcy) ? this.getConvertedCurrency(
                this.creditCardLimit.min,
                this.creditCardLimit.minCcy
              ) : '--',
            },
            {
              dispKey: 'LBL_MAX_LIMIT',
              dataKey: (this.creditCardLimit.max && this.creditCardLimit.maxCcy) ? this.getConvertedCurrency(
                this.creditCardLimit.max,
                this.creditCardLimit.maxCcy
              ) : '--',
            },
            {
              dispKey: 'LBL_NEW_LIMIT',
              dataKey: (this.newLimit && this.cardDetails.currency) ? this.getConvertedCurrency(
                this.newLimit,
                this.creditCardLimit.minCcy
              ) : '--',
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
            dataKey: this.submitData.OD_STATUS_DESC ? this.submitData.OD_STATUS_DESC : '--',
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
        value: this.translateService.instant('LBL_CHANGE_CARD_LIMIT_RECEIPT'),
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
        value: this.translateService.instant('LBL_FULL_NAME'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 85,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_MIN_LIMIT'),
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_MAX_LIMIT'),
        y: 125,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_NEW_LIMIT'),
        y: 135,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.cardDetails.holderName ? this.cardDetails.holderName : '--',
        y: 65,
      },
      {
        type: 'text',
        value: this.cardDetails.maskedCardId ? this.cardDetails.maskedCardId : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.cardDetails.cardType ? this.cardDetails.cardType : '--',
        y: 85,
      },
      {
        type: 'text',
        value: (this.creditCardLimit.min && this.creditCardLimit.minCcy) ? this.getConvertedCurrency(this.creditCardLimit.min, this.creditCardLimit.minCcy) : '--',
        y: 115,
      },
      {
        type: 'text',
        value: (this.creditCardLimit.max && this.creditCardLimit.maxCcy) ? this.getConvertedCurrency(this.creditCardLimit.max, this.creditCardLimit.maxCcy) : '--',
        y: 125,
      },
      {
        type: 'text',
        value: (this.newLimit && this.cardDetails.currency) ? this.getConvertedCurrency(this.newLimit, this.cardDetails.currency) : '--',
        y: 135,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 155,
      },
      { type: 'text', value: this.submitData.INPUT_REFERENCE_NO ? this.submitData.INPUT_REFERENCE_NO : '--', y: 155 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CREDIT_CARD_SENT_TO_APPROVE'),
        y: 165,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_CHANGE_CARD_LIMIT') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
