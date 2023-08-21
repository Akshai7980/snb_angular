import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { EpayServiceService } from '../../services/epay-service.service';

@Component({
  selector: 'app-refund-request',
  templateUrl: './refund-request.component.html',
  styleUrls: ['./refund-request.component.scss'],
})
export class RefundRequestComponent implements OnInit {
  mobileNumber: any;
  refundType: any;
  rrn: any;
  refundAmount: any;
  refundTypes: any = [];
  merchantDetails: any = {};
  description: string = '';
  isLoadingComplete: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;

  pageType: string = '';
  errMsg: string = '';
  otpError: string = '';

  flexAuthResp: any;
  authOptions: any;
  authDataObj: any;
  secAuthRef: any;
  userOtpValue: any;
  submittedData: any;
  saveReceiptObject: any;
  receiptObject: any = {};

  url: string = systemproperty.termsAndConditionsForPayments;

  constructor(
    private ePayService: EpayServiceService,
    private location: Location,
    private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf
  ) {}

  ngOnInit(): void {
    if (this.rootScopeData?.selectedEPayTransaction) {
      this.getMerchantFinanceDisputeAPI();
      this.getEPayRefundTypes();
      this.getAuthorizerList();
    } else {
      this.location.back();
    }
  }

  getMerchantFinanceDisputeAPI() {
    this.isLoadingComplete = false;
    let reqObj = {
      referenceNo: this.rootScopeData?.selectedEPayTransaction?.transactionReference ? this.rootScopeData?.selectedEPayTransaction?.transactionReference : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };

    this.ePayService.epayMerchantFinanceDispute(reqObj).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res && res.data) {
          this.merchantDetails = res?.data;
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getEPayRefundTypes() {
    this.isLoadingComplete = false;
    const data = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.ePayService.getEPayRefundTypes(data).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res?.data[0].amountType.length > 0) {
          this.refundTypes = res?.data[0].amountType;
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  getRefundType() {
    if (this.refundType === 'full') this.refundAmount = parseInt(this.merchantDetails.refundAmt).toFixed(2);
    else this.refundAmount = '0';
  }

  proceedButton() {
    this.errMsg = '';
    if (!this.mobileNumber) {
      this.errMsg = 'mobileNumber';
      return;
    } else if (!this.rrn) {
      this.errMsg = 'rrn';
      return;
    } else if (!this.refundType) {
      this.errMsg = 'refundType';
      return;
    } else if (!this.refundAmount) {
      this.errMsg = 'refundAmount';
      return;
    }
    if (this.refundType !== 'full' && this.refundAmount > this.merchantDetails.refundAmt) {
      this.errMsg = 'validRefundAmount';
      return;
    }
    this.refundAmount = parseInt(this.refundAmount).toFixed(2);
    this.pageType = 'review';
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
      subProdCode: 'EPYMCR',
      funcCode: 'EPYMRFNC',
      amount: this.merchantDetails.amount
        ? this.merchantDetails.amount
        : '',
      accNo: this.merchantDetails.accNo
        ? this.merchantDetails.accNo
        : '',
      pymntCurrency: this.merchantDetails.currency
        ? this.merchantDetails.currency
        : '',
      debitCurrency: this.merchantDetails.currency
        ? this.merchantDetails.currency
        : '',
    };
    this.ePayService.getEPayAuthorizers(params).subscribe(
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
    } else {
      this.userOtpValue = '';
    }
    this.onSubmit();
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
      PARAM2: this.userOtpValue,
      PARAM1: this.secAuthRef,
      SEL_PARSED_RULE_ID: this.authDataObj?.selectedAprover?.PARSED_RULE_ID
      ? this.authDataObj.selectedAprover?.PARSED_RULE_ID
      : '',
      SELECTION_FLAG: this.authOptions.length > 0 ? 'Y' : 'N',
      INPUT_FUNCTION_CODE: 'EPYMRFNC',
      INPUT_PRODUCT: 'CORESVS',
      INPUT_SUB_PRODUCT: 'EPYMCR',
      INPUT_CIF_NO: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo.sCustNo
        : '',
      INPUT_UNIT_ID: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      INPUT_CHANNEL_ID: '3',
      ACCNO: this.merchantDetails.accNo ? this.merchantDetails.accNo : '',
      NICKNAME: this.merchantDetails.nickname ? this.merchantDetails.nickname : '',
      FULLNAME: this.merchantDetails.fullname ? this.merchantDetails.fullname : '',
      STATUS: this.merchantDetails.Status ? this.merchantDetails.Status : '',
      BALANCE: this.merchantDetails.amount ? this.merchantDetails.amount : '',
      MERCHANTENGNAME: this.merchantDetails.merchantName ? this.merchantDetails.merchantName : '',
      MERCHANTID: this.merchantDetails.merchantId ? this.merchantDetails.merchantId : '',
      CLAIMDES: this.merchantDetails.claimDesc ? this.merchantDetails.claimDesc : '',
      REFUNDTYPE: this.merchantDetails.refundType ? this.merchantDetails.refundType : '',
      DEDUCTIONDATE: '',
      CLAIMTYPE: this.merchantDetails.claimType ? this.merchantDetails.claimType : '',
      SEQUENCE: this.merchantDetails.sequenceNo ? this.merchantDetails.sequenceNo : '',
      CARDTYPE: this.merchantDetails.cardType ? this.merchantDetails.cardType : '',
      CARDNO: this.merchantDetails.cardNo ? this.merchantDetails.cardNo : '',
      AMOUNT: this.merchantDetails.amount ? this.merchantDetails.amount : '',
      TRANSDATE: this.merchantDetails.epayDate ? this.merchantDetails.epayDate : '',
      REFUNDAMNT: this.merchantDetails.refundAmt ? this.merchantDetails.refundAmt : '',
      MOBILENO: this.merchantDetails.mobileNo ? this.merchantDetails.mobileNo : '',
      RRN: this.merchantDetails.rrn ? this.merchantDetails.rrn : '',
    };

    this.ePayService.ePayTransactionRefundAmountSubmit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.dataValue &&
          res.dataValue.STATUS &&
          res.dataValue.STATUS === 'SUCCESS'
        ) {
          this.submittedData = res.dataValue;
          this.constructReceiptData();
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }

  validateInput(field: any) {
    if (!field || field.length > 0) {
      this.errMsg = '';
    }
  }

  cancelMerchantDetail() {
    this.rootScopeData.showtransaction = true;
    this.rootScopeData.showMerchantDetail = false;
    this.location.back();
  }

  makeAnotherTransaction() {
    this.location.back();
  }

  constructReceiptData() {
    this.saveReceiptObject = {
      pageheading: this.translateService.instant('LBL_REQ_SUCCESS'),
      subHeading: this.translateService.instant(
        'LBL_YOUR_REFUND_REQUEST_IS_PENDING_FOR_APPROVAL'
      ),
      Description: this.translateService.instant(
        'LBL_EPAY_REFUND_REQUEST_PENDING_FOR_APPROVAL_REQUEST_IS_INT_SUCCESS'
      ),
      keyValues: [],
      pagecall: 'refundRequest',
      refNo: this.submittedData.INPUT_REFERENCE_NO,
    };
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_YOUR_REFUND_REQUEST_IS_PENDING_FOR_APPROVAL',
      referenceNumber: this.submittedData.INPUT_REFERENCE_NO,
      receiptDetails: [
        {
          title: 'LBL_TRANSACTION_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.merchantDetails?.cardNo
                ? this.merchantDetails?.cardNo
                : '--',
            },
            {
              dispKey: 'LBL_CARD_TYPE',
              dataKey: this.merchantDetails?.cardType
                ? this.merchantDetails?.cardType
                : '--',
            },
            {
              dispKey: 'LBL_DATE',
              dataKey: this.merchantDetails?.epayDate
                ? this.merchantDetails?.epayDate
                : '--',
            }
          ],
        },
        {
          title: 'LBL_REQUEST_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_RRN',
              dataKey: this.rrn
                ? this.rrn
                : '--',
            },
            {
              dispKey: 'LBL_REFUND_TYPE',
              dataKey: this.refundType
                ? this.refundType
                : '--',
            },
            {
              dispKey: 'LBL_CLAIM_DESCRIPTION',
              dataKey: this.description
                ? this.description
                : '--',
            }
          ],
        },
        {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_REFUND_AMOUNT',
              dataKey: this.refundAmount
              ? currencyFormatPipeFilter.transform(
                  this.refundAmount,
                  this.merchantDetails?.currency
                ) +
                ' ' +
                this.merchantDetails?.currency
              : '--'
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
              dataKey: this.submittedData?.STATUS ? this.submittedData.STATUS : '--',
            },
            {
              dispKey: 'LBL_RESPONSE',
              dataKey: this.submittedData?.OD_STATUS_DESC
                ? this.submittedData.OD_STATUS_DESC
                : '--',
            },
          ],
        }
      );
    this.pageType = 'receipt';
  }

  downloadPdf() {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_REFUND_REQUEST_RECEIPT'),
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
        value: this.translateService.instant('LBL_TRANSACTION_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_TYPE'),
        y: 75,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_DATE'),
        y: 85,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REQUEST_DETAILS'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_RRN'),
        y: 105,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REFUND_TYPE'),
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CLAIM_DESCRIPTION'),
        y: 125,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REFUND_AMOUNT'),
        y: 135,
      },
      {
        type: 'text',
        value: this.merchantDetails?.cardNo
        ? this.merchantDetails?.cardNo
        : '--',
        y: 65,
      },
      {
        type: 'text',
        value: this.merchantDetails?.cardType
        ? this.merchantDetails?.cardType
        : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.merchantDetails?.epayDate
        ? this.merchantDetails?.epayDate
        : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.rrn
          ? this.rrn
          : '--',
        y: 105,
      },
      {
        type: 'text',
        value: this.refundType
          ? this.refundType
          : '--',
        y: 115,
      },
      {
        type: 'text',
        value: this.description
          ? this.description
          : '--',
        y: 125,
      },
      {
        type: 'text',
        value: this.refundAmount
        ? currencyFormatPipeFilter.transform(
            this.refundAmount,
            this.merchantDetails?.currency
          ) +
          ' ' +
          this.merchantDetails?.currency
        : '--',
        y: 135,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 145,
      },
      { type: 'text', value: this.submittedData.INPUT_REFERENCE_NO, y: 135 },
      {
        type: 'heading',
        value: this.translateService.instant(
          'LBL_YOUR_REFUND_REQUEST_IS_PENDING_FOR_APPROVAL'
        ),
        y: 155,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_REFUND_REQUEST_RECEIPT') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
