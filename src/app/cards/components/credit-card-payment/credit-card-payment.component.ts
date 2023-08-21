import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-credit-card-payment',
  templateUrl: './credit-card-payment.component.html',
  styleUrls: ['./credit-card-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreditCardPaymentComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  accountList: any = [];
  creditCardList: any = [];
  authOptions: any = [];
  errMsg: boolean = false;

  setColumnWidth: boolean = true;
  shownSearchFlag: boolean = true;
  toCreditCardList: boolean = false;
  showDailyLimit: boolean = false;
  isLoadingComplete: boolean = true;
  clearFlag: boolean = false;
  showAccountList: boolean = false;

  flexAuthResp: any;
  comments: any;
  secAuthRef: any;
  userOtpValue: any;
  submitData: any;
  labelToShow: any;
  amountToShow: any;

  cardDetailsObj: any = {};
  receiptObject: any = {};
  amountDetailsMenu: any = [
    {
      payOption: 'Full Outstanding',
      key: 'FO',
    },
    {
      payOption: 'Statement Due',
      key: 'SD',
    },
    {
      payOption: 'Minimum Due',
      key: 'MD',
    },
    {
      payOption: 'Specific Amount',
      key: 'SA',
    }
  ];
  amountDetails: any = {};
  authDataObj: any = {};
  fromDataDetailsObj: any = {};
  creditCardDetailsObj: any = {};
  selectedFromData: any = {};
  selectedCardData: any = {};

  otherAmount: string = '';
  isChecked: string = '';
  title: string = '';
  noAuthorError: string = '';
  otpError: string = '';

  url: string = systemproperty.termsAndConditionsForPayments;

  constructor(
    private translateService: TranslateService,
    private downloadAsPdf: downloadAsPdf,
    private cardsService: CardsService
  ) {}

  ngOnInit(): void {
    this.getAccountLookup();
  }

  getAccountLookup() {
    this.isLoadingComplete = false;
    this.cardsService.getAccountLookup().subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.DATA?.ALL_RECORDS.length > 0) {
          const currencyPipe = new CurrencyFormatPipe();
          this.accountList = res.DATA.ALL_RECORDS.map((val: any) => {
            return {
              balance: currencyPipe.transform(
                val.CURRENT_BAL_AMT,
                val.OD_CCY_CODE
              ),
              ...val,
            };
          });
        }
        this.showAccountList = true;
        this.constructFromTable();
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getCreditCardLookup() {
    let params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.isLoadingComplete = false;
    this.cardsService.getCreditCardLookup(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        let creditCardList = [];
        const currencyPipe = new CurrencyFormatPipe();
        if (res.dataValue?.entityCardDetailsList) {
          creditCardList =
            res.dataValue.entityCardDetailsList.entityCardDetails.map(
              (val: any) => {
                return {
                  cardId: val?.cardDetails?.responseCardIdentifier?.pan
                    ? val.cardDetails.responseCardIdentifier.pan
                    : '',
                  holderName: `${val?.cardDetails?.firstName} ${val?.cardDetails?.lastName}`,
                  cardType: val.cardProduct?.description
                    ? val.cardProduct?.description
                    : '',
                  statusDescription: val.cardStatus?.description
                    ? val.cardStatus?.description
                    : '',
                  balance: val.linkedAccountsList?.linkedAccount[0]
                    ?.accountDetails?.availableBalance
                    ? currencyPipe.transform(
                        val.linkedAccountsList?.linkedAccount[0].accountDetails
                          .availableBalance,
                        val.linkedAccountsList?.linkedAccount[0]?.accountDetails
                          ?.curCurrency
                      )
                    : '',
                  currency: val.linkedAccountsList?.linkedAccount[0]
                    ?.accountDetails?.curCurrency
                    ? val.linkedAccountsList?.linkedAccount[0].accountDetails
                        .curCurrency
                    : '',
                  cifNo: val.CifMap[0].shortCIF ? val.CifMap[0].shortCIF : '',
                  accountId: val.linkedAccountsList?.linkedAccount[0]
                    .accountDetails?.accountNumber
                    ? val.linkedAccountsList?.linkedAccount[0].accountDetails
                        .accountNumber
                    : '',
                  expiryDate: val.cardDetails?.expiryDate
                    ? val.cardDetails?.expiryDate
                    : '',
                  creditLimit: val.linkedAccountsList?.linkedAccount[0]
                    ?.accountDetails?.creditLimit
                    ? val.linkedAccountsList?.linkedAccount[0].accountDetails
                        .creditLimit
                    : '',
                  cardProduct: val?.cardProduct,
                  cardStatus: val?.cardStatus,
                  linkedAccountsList: val?.linkedAccountsList,
                  maskedCardId: val?.cardDetails?.responseCardIdentifier
                    ?.maskedPan
                    ? val.cardDetails.responseCardIdentifier.maskedPan
                    : '',
                };
              }
            );
          this.creditCardList = creditCardList;
          this.toCreditCardList = true;
          this.constructCreditTable();
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getDailyLimitApiCall() {
    this.isLoadingComplete = false;
    const today = new Date();
    const valueDate =
      '' +
      today.getDate().toString().padStart(2, '0') +
      '/' +
      (today.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      today.getFullYear();
    const data = {
      availBal: this.selectedFromData?.CURR_AVAIL_BAL_AMT
        ? this.selectedFromData.CURR_AVAIL_BAL_AMT
        : '',
      reqCountry: this.selectedFromData?.REQ_COUNTRY_CODE
        ? this.selectedFromData.REQ_COUNTRY_CODE
        : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo?.UNIT_ID
        : '',
      cif: this.rootScopeData?.userInfo?.sCustNo
        ? this.rootScopeData.userInfo?.sCustNo
        : '',
      accCcy: this.selectedFromData?.OD_CCY_CODE,
      valueDate: valueDate,
      accNo: this.selectedFromData.OD_ACC_NO,
      portalAccNo: this.selectedFromData.OD_PORTAL_ACC_NO,
      productName: 'CORESVS',
      subProductName: 'CARDPAY',
      functionCode: 'CDPAYFNC',
    };
    this.cardsService.getDailyLimitApiCall(data).subscribe((res: any) => {
      this.isLoadingComplete = true;
      const currencyPipe = new CurrencyFormatPipe();
      if (res.data) {
        const dailyLimitObj = {
          availPayLimit: currencyPipe.transform(
            res.data[1].availPayLimit,
            res.data[1].baseCcy
          ),
          baseCcy: res.data[1].baseCcy,
          maxIndTxnLimit: currencyPipe.transform(
            res.data[1].maxIndTxnLimit,
            res.data[1].baseCcy
          ),
        };
        this.rootScopeData.dailyLimit = dailyLimitObj;
      }
    });
  }

  constructFromTable() {
    this.fromDataDetailsObj = {
      title: 'LBL_FROM',
      data: this.accountList,
      fieldDetails: [
        {
          dispKey: 'LBL_ACC_NUMBER',
          dataKey: 'OD_ACC_NO',
        },
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'ALIAS_NAME',
        },
        {
          dispKey: 'LBL_FULL_NAME',
          dataKey: 'OD_ACC_NAME',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'STATUS',
        },
        {
          dispKey: 'LBL_BALANCE',
          dataKey: 'balance',
          dataKeySupport: 'OD_CCY_CODE',
        },
      ],
    };
  }

  getDisplayStatus(event: any, type: string) {
    if (type === 'fromData') {
      if (event !== 'iconClick') {
        this.selectedFromData = event;
        this.showDailyLimit = true;
        this.getDailyLimitApiCall();
        this.getCreditCardLookup();
      } else if (event === 'iconClick') {
        this.toCreditCardList = false;
        this.showDailyLimit = false;
        this.title = '';
        // this.isChecked = 'Outstanding';
      }
    }
    if (type === 'creditCard') {
      if (event !== 'iconClick') {
        this.selectedCardData = event;
        if (this.title !== 'review') {
          this.title = 'creditCardPayment';
          this.isChecked = this.amountDetailsMenu[0].key;
          this.getCardDetails();
        }
      } else if (event === 'iconClick') {
        this.title = '';
      }
    }
  }

  // getCreditCardPaymentAmountDetailsMenu() {
  //   this.isLoadingComplete = false;
  //   const data = {
  //     unitId: this.rootScopeData.userInfo?.UNIT_ID
  //       ? this.rootScopeData.userInfo?.UNIT_ID
  //       : '',
  //   };
  //   this.cardsService.getCreditCardPaymentAmountDetailsMenu(data).subscribe(
  //     (res: any) => {
  //       this.isLoadingComplete = true;
  //       if (res.data?.creditCard.length) {
  //         this.amountDetailsMenu = res.data.creditCard;
  //         this.isChecked = this.amountDetailsMenu[0].key;
  //       }
  //     },
  //     (err: any) => {
  //       this.isLoadingComplete = true;
  //     }
  //   );
  // }

  getCardDetails() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cardId: this.selectedCardData.cardId,
    };
    this.cardsService.cardDetails(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res && res.dataValue && res.dataValue.CardDetails) {
          this.amountDetails = res.dataValue.CardDetails;
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  // getCreditCardPaymentAmountDetails() {
  //   this.isLoadingComplete = false;
  //   const data = {
  //     unitId: this.rootScopeData.userInfo?.unitId
  //       ? this.rootScopeData.userInfo?.unitId
  //       : '',
  //   };
  //   this.cardsService
  //     .getCreditCardPaymentAmountDetails(data)
  //     .subscribe((res: any) => {
  //       if (res.data) {
  //         this.isLoadingComplete = true;
  //         this.amountDetails = res.data;
  //       }
  //     });
  // }

  constructCreditTable() {
    this.creditCardDetailsObj = {
      title: 'LBL_CREDIT_CARD',
      subTitle: 'LBL_FROM',
      data: this.creditCardList,
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

  toCancel() {
    this.toCreditCardList = false;
    this.showDailyLimit = false;
    this.title = '';
    this.clearFlag = true;
    this.constructFromTable();
  }

  onChangeLimit(card: any) {
    const amount = parseInt(this.otherAmount);
    this.otherAmount = amount > 0 ? amount.toFixed(2) : '';
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  displayContent(type: string) {
    if (type) {
      this.isChecked = type;
    }
  }

  toProceed() {
    this.showDailyLimit = false;
    this.getAuthorizerList();
    this.labelToShow =
      this.isChecked === 'FO'
        ? 'LBL_FULL_OUTSTANDING_AMOUNT'
        : this.isChecked === 'SD'
        ? 'LBL_STATEMENT_DUE'
        : this.isChecked === 'SA'
        ? 'LBL_SPECIFIC_AMOUNT'
        : 'LBL_MIN_DUE';
    this.amountToShow =
      this.isChecked === 'FD'
        ? this.amountDetails.balance
        : this.isChecked === 'SD'
        ? this.amountDetails.statementBalance
        : this.isChecked === 'SA'
        ? this.otherAmount
        : this.amountDetails.dueAmount;
    if (this.isChecked === 'SA' && this.amountToShow <= 0) {
      this.errMsg = true;
      return;
    }
    this.errMsg = false;
    this.title = 'review';
  }

  getAuthorizerList() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo?.sCustNo
        : '',
      productCode: 'CORESVS',
      subProdCode: 'CARDPAY',
      funcCode: 'CDPAYFNC',
      amount: this.selectedFromData?.CURRENT_BAL_AMT
        ? this.selectedFromData?.CURRENT_BAL_AMT
        : '',
      accNo: this.selectedFromData?.OD_ACC_NO
        ? this.selectedFromData?.OD_ACC_NO
        : '',
      pymntCurrency: this.selectedFromData?.OD_CCY_CODE
        ? this.selectedFromData?.OD_CCY_CODE
        : '',
      debitCurrency: this.selectedFromData?.OD_CCY_CODE
        ? this.selectedFromData?.OD_CCY_CODE
        : '',
    };
    this.cardsService.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res && res.data) {
          this.flexAuthResp = res.data;
        }
        if (res.data.flexiAuth == 'true') {
          this.authOptions = res.data.authList;
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getAuthorizationEmit(authDetails: any) {
    this.authDataObj = authDetails;
  }

  onSecondFactorValue(secondFactorValue: any) {
    this.secAuthRef = secondFactorValue.data.secfRefNo;
  }

  getOtpValue(otp: any) {
    if (otp) {
      if (otp.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otp;
      this.toSubmit();
    } else {
      this.userOtpValue = '';
    }
  }

  toSubmit() {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }

    this.isLoadingComplete = false;
    const amount =
      this.isChecked === 'FO'
        ? this.amountDetails.balance
        : this.isChecked === 'SD'
        ? this.amountDetails.statementBalance
        : this.isChecked === 'SA'
        ? this.otherAmount
        : this.amountDetails.dueAmount;
    const minDue = this.isChecked === 'SA' ? this.amountDetails.dueAmount : '';

    const data = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.selectedCardData.cifNo,
      userOtpValue: this.userOtpValue,
      secAuthRef: this.secAuthRef,
      SEL_PARSED_RULE_ID: this.authDataObj?.selectedAprover?.PARSED_RULE_ID
        ? this.authDataObj.selectedAprover?.PARSED_RULE_ID
        : '',
      SELECTION_FLAG: this.authOptions.length > 0 ? 'Y' : 'N',
      sefAuthFlag: this.flexAuthResp?.selfAuth
        ? this.flexAuthResp.selfAuth
        : '',
      CARD_NUM: this.selectedCardData?.number
        ? this.selectedCardData.number
        : '',
      CARD_TYPE: this.selectedCardData?.type ? this.selectedCardData.type : '',
      CURRENCY: this.selectedCardData?.currency
        ? this.selectedCardData.currency
        : '',
      FULL_OUT_AMT: this.otherAmount ? this.otherAmount : '',
      ACCNO: this.selectedFromData?.OD_ACC_NO
        ? this.selectedFromData.OD_ACC_NO
        : '',
      COMMENTS: this.comments ? this.comments : '',
      CARD_STATUS: this.selectedCardData?.statusDescription
        ? this.selectedCardData.statusDescription
        : '',
      BALANCE: this.selectedFromData?.CURRENT_BAL_AMT
        ? this.selectedFromData?.CURRENT_BAL_AMT
        : '',
      ACCOUNT_NAME: this.selectedFromData?.OD_ACC_NAME
        ? this.selectedFromData.OD_ACC_NAME
        : '',
      AMOUNT: amount, // Each menu have amount. Need to pass the amount from which menu we have selected
      MIN_DUE: minDue, // Each menu have amount. Need to pass the amount from which menu we have selected
      CARD_NAME: this.selectedCardData?.holderName
        ? this.selectedCardData.holderName
        : '',
    };

    this.cardsService.creditCardPaymentSubmit(data).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.dataValue.STATUS === 'SUCCESS') {
          this.submitData = res.dataValue;
          this.constructReceiptData(res.dataValue.INPUT_REFERENCE_NO);
          this.title = 'receipt';
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  toModify() {
    this.title = 'creditCardPayment';
  }

  constructReceiptData(referenceNo: string) {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.receiptObject = {
      msg1: 'LBL_PAYMENT_SUCCESSFULL',
      msg2: 'LBL_CREDIT_CARD_PAYMENT_PENDING_MSG',
      referenceNumber: referenceNo,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData?.userInfo?.userNo
                ? this.rootScopeData.userInfo.userNo
                : '--',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.selectedFromData?.OD_ACC_NO
                ? this.selectedFromData.OD_ACC_NO
                : '--',
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: this.selectedFromData?.ALIAS_NAME
                ? this.selectedFromData.ALIAS_NAME
                : '--',
            },
          ],
        },
        {
          title: 'LBL_CARD_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_NAME',
              dataKey: this.selectedCardData?.holderName
                ? this.selectedCardData.holderName
                : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.selectedCardData?.maskedCardId
                ? this.selectedCardData.maskedCardId
                : '--',
            },
            {
              dispKey: 'LBL_CARD_TYPE',
              dataKey: this.selectedCardData?.cardType
                ? this.selectedCardData.cardType
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
              dispKey: this.labelToShow,
              dataKey:
                this.amountToShow && this.selectedCardData.currency
                  ? currencyFormatPipeFilter.transform(
                      this.amountToShow,
                      this.selectedCardData.currency
                    )
                  : '--',
            },
            {
              dispKey: 'LBL_COMMENTS',
              dataKey: this.comments ? this.comments : 'Not Provided',
            },
            {
              dispKey: ' ',
              dataKey: ' ',
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
        buttonLabel: 'LBL_MAKE_ANOTHER_PAY',
      },

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    this.flexAuthResp.flexiAuth.toString() === 'true' &&
      this.receiptObject.receiptDetails.push(
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: this.authDataObj.selectedAprover?.AUTH_NAME
                ? this.authDataObj.selectedAprover.AUTH_NAME
                : 'Not Provided',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: this.authDataObj?.aproveNote
                ? this.authDataObj.aproveNote
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
              dataKey: this.submitData?.STATUS ? this.submitData.STATUS : '--',
            },
            {
              dispKey: 'LBL_RESPONSE',
              dataKey: this.submitData?.OD_STATUS_DESC
                ? this.submitData.OD_STATUS_DESC
                : '--',
            },
          ],
        }
      );
  }

  makeAnotherPayment() {
    this.toCancel();
  }

  downloadPdf() {
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
        value: this.translateService.instant('LBL_ACTION_BY'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_ACC_NUMBER'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NAME'),
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
      {
        type: 'heading',
        value: this.translateService.instant(this.labelToShow),
        y: 145,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_COMMENTS'),
        y: 155,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.rootScopeData?.userInfo?.userNo
          ? this.rootScopeData.userInfo.userNo
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.selectedFromData?.OD_ACC_NO
          ? this.selectedFromData.OD_ACC_NO
          : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.selectedFromData?.ALIAS_NAME
          ? this.selectedFromData.ALIAS_NAME
          : '--',
        y: 95,
      },
      {
        type: 'text',
        value: this.selectedCardData?.holderName
          ? this.selectedCardData.holderName
          : '--',
        y: 115,
      },
      {
        type: 'text',
        value: this.selectedCardData?.maskedCardId
          ? this.selectedCardData.maskedCardId
          : '--',
        y: 125,
      },
      {
        type: 'text',
        value: this.selectedCardData?.cardType
          ? this.selectedCardData.cardType
          : '--',
        y: 135,
      },
      {
        type: 'text',
        value:
          this.amountToShow && this.selectedCardData?.currency
            ? currencyFormatPipeFilter.transform(
                this.amountToShow,
                this.selectedCardData.currency
              )
            : '--',
        y: 145,
      },
      {
        type: 'text',
        value: this.comments ? this.comments : 'Not Provided',
        y: 155,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 165,
      },
      {
        type: 'text',
        value: this.submitData?.INPUT_REFERENCE_NO
          ? this.submitData.INPUT_REFERENCE_NO
          : '--',
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
}
