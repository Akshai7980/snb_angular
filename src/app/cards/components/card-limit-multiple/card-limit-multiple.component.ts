import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { CardsService } from '../../services/cards.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';

@Component({
  selector: 'app-card-limit-multiple',
  templateUrl: './card-limit-multiple.component.html',
  styleUrls: ['./card-limit-multiple.component.scss']
})
export class CardLimitMultipleComponent implements OnInit {

  title: string = 'changeCardLimit';
  creditCardListToPass: any;
  displayedColumns: string[] = ['holderName', 'cardId', 'cardType', 'creditLimit', 'newLimit'];
  creditCardList: any = [];
  newLimitAddedList: any[] = [];
  noRecordFoundInfoObj: any = {
    "msg": "LBL_NO_RECORDS_FOUND",
    "showMsg": "true",
    "showIcon": "true"
  };
  showErrMsg: boolean = false;

  noRecordFlag: boolean = false;
  isLoadingComplete = true;

  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';

  receiptObject: any = {};
  // totalAvailableLimit: string = '1000000';
  totalAvailableLimit: any;
  totalEnteredAmount: any = 0;
  errMsg: string = '';
  flexAuthResp: any;
  referenceNumber: any;
  url: string = systemproperty.termsAndConditionsForPayments;

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(    private translateService: TranslateService,
    private downloadAsPdf: downloadAsPdf, private cardsService: CardsService) { }

  ngOnInit(): void {
    this.getCreditCardList();
  }

  getCreditCardList() {
    let params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : ''
    };
    this.isLoadingComplete = false;
    this.cardsService.getCardSummaryList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        let creditCardList = [];
        if (res.dataValue?.entityCardDetailsList) {
          creditCardList = res.dataValue.entityCardDetailsList.entityCardDetails.map((val: any) => {
            return {
              cardId: val.cardDetails?.responseCardIdentifier.pan ? val.cardDetails.responseCardIdentifier.pan : '',
              holderName: `${val.cardDetails.firstName} ${val.cardDetails.lastName}`,
              cardType: val.cardProduct?.description ? val.cardProduct?.description : '', // Need clarification
              statusDescription: val.cardStatus?.description ? val.cardStatus?.description : '', // Need clarification
              balance: val.linkedAccountsList?.linkedAccount[0].accountDetails.availableBalance ? val.linkedAccountsList?.linkedAccount[0].accountDetails.availableBalance : '',
              currency: val.linkedAccountsList?.linkedAccount[0].accountDetails.curCurrency ? val.linkedAccountsList?.linkedAccount[0].accountDetails.curCurrency : '',
              cifNo: val.CifMap[0].shortCIF ? val.CifMap[0].shortCIF : '', // Need clarification
              accountId: val.linkedAccountsList?.linkedAccount[0].accountDetails.accountNumber ? val.linkedAccountsList?.linkedAccount[0].accountDetails.accountNumber : '',
              expiryDate: val.cardDetails?.expiryDate ? val.cardDetails?.expiryDate : '',
              creditLimit: val.linkedAccountsList?.linkedAccount[0].accountDetails.creditLimit ? val.linkedAccountsList?.linkedAccount[0].accountDetails.creditLimit : '',
              maskedCardId: val.cardDetails?.responseCardIdentifier.maskedPan ? val.cardDetails.responseCardIdentifier.maskedPan : ''
            }
          });
          this.creditCardList = creditCardList;
        }

        if (this.creditCardList && this.creditCardList.length) {
          this.noRecordFlag = false;
          this.creditCardListToPass = new MatTableDataSource(
            this.creditCardList
          );
        } else {
          this.noRecordFlag = true;
        }
      },
      (error: any) => {
        this.noRecordFlag = true;
        this.isLoadingComplete = true;
      }
    );
  }

  getCreditCardListForReview() {
    this.creditCardListToPass = new MatTableDataSource(this.newLimitAddedList);
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { "name": "holderName", "fieldType": "string" },
      { "name": "cardId", "fieldType": "string" },
      { "name": "cardType", "fieldType": "string" },
      { "name": "currentLimit", "fieldType": "amount1" }
    ];
    let tableData = showFilteredRecords(this.title === 'review' ? this.newLimitAddedList : this.creditCardList, columnsToSearch, event.target.value);
    this.creditCardListToPass = new MatTableDataSource(tableData);
  }
  
  // Allows only numbers
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onCheckNewLimit() {
    // if (this.totalEnteredAmount > parseInt(this.totalAvailableLimit)) {
    //   this.errMsg = 'LBL_AVAILABLE_LIMIT_VALIDATION';
    //   this.showErrMsg = true;
    //   return;
    // }
    // this.showErrMsg = false;
  }

  onChangeLimit(card: any) {
    let index = -1;
    this.newLimitAddedList.map((val, i) => {
      if (val.cardId === card.cardId)
        index = i;
    })
    if (card.newLimit) card.newLimit = parseInt(card.newLimit).toFixed(2);
    card.newLimitTemp = card.newLimit;
    if (index <= -1) {
      this.newLimitAddedList.push(card);
    } else if (card.newLimit && card.newLimit > 0) {
      this.newLimitAddedList[index] = card;
    } else {
      this.newLimitAddedList.splice(index, 1);
    }
    this.totalEnteredAmount = 0;
    this.newLimitAddedList.map(val => {
      this.totalEnteredAmount += parseInt(val.newLimit);
    })
    // if (this.newLimitAddedList.length > 0 && this.totalEnteredAmount <= parseInt(this.totalAvailableLimit)) this.showErrMsg = false;
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
      this.onSubmit()
    } else {
      this.userOtpValue = '';
    }
  }

  toProceed() {
    if (!this.totalEnteredAmount || this.newLimitAddedList.length <= 0) {
      this.errMsg = 'LBL_MULTIPLE_LIMIT_ERR_MSG';
      this.showErrMsg = true;
      return;
    }
    // if (this.totalEnteredAmount > this.totalAvailableLimit) {
    //   this.errMsg = 'LBL_AVAILABLE_LIMIT_VALIDATION';
    //   this.showErrMsg = true;
    //   return;
    // }
    this.newLimitAddedList.map(val => {
      val.newLimitTemp = `${val.newLimit} ${val.currency}`; // Need to use currency format pipe
      val.maskedCardId = val.maskedCardId;
    });
    this.title = 'review';
    this.getCreditCardListForReview();
    this.getAuthorizerList();
  }

  getAuthorizerList() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData.userInfo?.sCustNo ? this.rootScopeData.userInfo?.sCustNo : '',
      productCode: 'CORESVS',
      subProdCode: 'CRDLIMAD',
      funcCode: 'LIMADFNC',
      amount: this.creditCardList[0]?.balance ? this.creditCardList[0]?.balance : '',
      accNo: this.creditCardList[0]?.accountId ? this.creditCardList[0]?.accountId : '',
      pymntCurrency: this.creditCardList[0]?.currency ? this.creditCardList[0]?.currency : '', // need to checK
      debitCurrency: this.creditCardList[0]?.currency ? this.creditCardList[0]?.currency : '', // need to checK
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

  toCancel() {
    this.title = 'changeCardLimit';
    this.getCreditCardList();
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
    const newLimits = this.newLimitAddedList.map((val: any) => {
      return {
        CARD_NUM: val.cardId ? val.cardId : '',
        // CARD_LIMIT: val.newLimit,
        CHANGES: '',
        CARD_NAME: val.holderName ? val.holderName : '',
        CURRENT_LIMIT: val.creditLimit ? val.creditLimit : '',
        NEW_LIMIT: val.newLimit ? val.newLimit : '',
        TOTAL_AVAL_CREDIT: '',
        CARD_TYPE: val.cardType ? val.cardType : ''
      };
    })
    const data = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.creditCardList[0].cifNo,
      userOtpValue: this.userOtpValue,
      secAuthRef: this.secAuthRef,
      SEL_PARSED_RULE_ID: this.authDetail.selectedAprover?.PARSED_RULE_ID ? this.authDetail.selectedAprover?.PARSED_RULE_ID : "",
      SELECTION_FLAG: this.authOptions.length > 0 ? "Y" : "N",
      sefAuthFlag: this.flexAuthResp.selfAuth,
      CURRENCY: this.creditCardList[0]?.currency ? this.creditCardList[0]?.currency : '',
      LimitAdjustment: newLimits
    };
    this.cardsService.creditCardLimitMultipeSubmit(data).subscribe((res: any) => {
      this.isLoadingComplete = true;
      if (res.dataValue.STATUS === 'SUCCESS') {
        this.referenceNumber = res.dataValue.INPUT_REFERENCE_NO
        this.constructReceiptData(res.dataValue)
      }
    }, () => {
      this.isLoadingComplete = true;
    })
  }

  constructReceiptData(data: any) {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.receiptObject = {
      msg1: 'LBL_PAYMENT_SUCCESSFULL',
      msg2: 'LBL_CHANGE_LIMIT_FOR_MULTIPLE_CARD_SENT',
      referenceNumber: data.INPUT_REFERENCE_NO,
      receiptDetails: [
        {
          title: 'LBL_CARD_DETAILS',
          isTable: 'true',
          data: this.newLimitAddedList,
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_NAME',
              dataKey: "holderName",
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: "maskedCardId",
            },
            {
              dispKey: 'LBL_NEW_LIMIT',
              dataKey: "newLimitTemp",
            }
          ],
        },
        {
          title: '',
          isTable: 'false',
          fieldDetails: [
            {
              dispKey: 'LBL_TOTAL_AVAILABLE_LIMIT',
              dataKey: (this.totalAvailableLimit && this.creditCardList[0]?.currency) ? currencyFormatPipeFilter.transform(this.totalAvailableLimit, this.creditCardList[0]?.currency) + ' ' + this.creditCardList[0]?.currency : '--',
            },
            {
              dispKey: 'LBL_NEW_LIMIT',
              dataKey: (this.totalEnteredAmount && this.creditCardList[0]?.currency) ? currencyFormatPipeFilter.transform(this.totalEnteredAmount, this.creditCardList[0]?.currency) + ' ' + this.creditCardList[0]?.currency : '--',
            }
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

    (this.flexAuthResp.flexiAuth.toString() === "true") && this.receiptObject.receiptDetails.push(
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
            dataKey:
              this.authDetail?.aproveNote
                ? this.authDetail.aproveNote
                : 'Not Provided',
          },
        ]
      },
      {
      title: '',
      isTable: 'false',
      fieldDetails: [
        {
          dispKey: 'LBL_STATUS',
          dataKey: data.STATUS ? data.STATUS : '--',
        },
        {
          dispKey: 'LBL_RESPONSE',
          dataKey: data.OD_STATUS_DESC ? data.OD_STATUS_DESC : '--',
        },
      ],
    })
    this.title = 'receipt';
  }

  openTermsAndCondition() {}

  initiateAnotherRequest() {
    this.toCancel();
  }

    // Need to integrate the proper fields.
    downloadPdf() {
      const currencyFormatPipeFilter = new CurrencyFormatPipe();
      const head: any = [
        this.translateService.instant('LBL_CARD_NAME'),
        this.translateService.instant('LBL_CARD_NO'),
        this.translateService.instant('LBL_NEW_LIMIT')
      ];
      const body = this.newLimitAddedList.map((val: any) => {
        return {
          [head[0]]: val.holderName,
          [head[1]]: val.maskedCardId,
          [head[2]]: val.newLimit
        }
      });
      let yAfterTable = 85;
      yAfterTable = (this.newLimitAddedList.length * 10) + yAfterTable;
      let pdfData: any = [
        { type: 'setFontSize', size: 11 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
        {
          type: 'title',
          value: this.translateService.instant(
            'LBL_CHANGE_CARD_LIMIT_MULTIPLE'
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
        {
          type: 'table',
          head: head,
          body: body,
          y: 75,
          x: 20
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_TOTAL_AVAILABLE_LIMIT'),
          y: yAfterTable + 20,
        },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_NEW_LIMIT'),
          y: yAfterTable + 30,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'text',
          value: (this.totalAvailableLimit && this.creditCardList[0]?.currency) ? currencyFormatPipeFilter.transform(this.totalAvailableLimit, this.creditCardList[0]?.currency) + ' ' + this.creditCardList[0]?.currency : '--',
          y: yAfterTable + 20,
        },
        {
          type: 'text',
          value: (this.totalEnteredAmount && this.creditCardList[0]?.currency) ? currencyFormatPipeFilter.transform(this.totalEnteredAmount, this.creditCardList[0]?.currency) + ' ' + this.creditCardList[0]?.currency : '--',
          y: yAfterTable + 30,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_REF_NUMBER'),
          y: yAfterTable + 55,
        },
        { type: 'text', value: this.referenceNumber ? this.referenceNumber : '--', y: yAfterTable + 55 },
        {
          type: 'heading',
          value: this.translateService.instant(
            'LBL_CHANGE_WITHDRAWAL_LIMIT_SENT_TO_APPROVE'
          ),
          y: yAfterTable + 65,
        },
      ];
  
      pdfData.push({
        type: 'save',
        value:
          this.translateService.instant('LBL_CHANGE_WITHDRAWAL_LIMIT') + '.pdf',
      });
  
      this.downloadAsPdf.downloadpdf(pdfData);
    }

}
