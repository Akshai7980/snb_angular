import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-e-pay-reject',
  templateUrl: './e-pay-reject.component.html',
  styleUrls: ['./e-pay-reject.component.scss'],
})
export class EPayRejectComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  isLoadingComplete: boolean = true;
  showReceipt: boolean = false;
  isRejectReasonValid: boolean = false;

  rejectReasonText: string = '';
  rejectReasonError: string = '';
  receiptObject: any = {};
  saveReceiptObject: any = {};
  requestSummaryDetails: any;
  submittedResponse: any;
  moduleId: string = '';
  action: string = '';
  receiptMessage: string = '';
  descriptionMessage: string = '';

  constructor(
    private router: Router,
    private readonly myTaskService: MyTaskService,
    private readonly translateService: TranslateService,
    private downloadAsPdf: downloadAsPdf
  ) {}

  ngOnInit(): void {
    if (this.rootScopeData.selectedEPay) {
      this.isLoadingComplete = true;
      this.requestSummaryDetails = this.rootScopeData.selectedEPay;
      this.setModuleDetails();
    } else {
      this.router.navigate(['/mytask/ePay']);
    }
  }

  isValidReason(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    } else {
      this.isRejectReasonValid = false;
    }
  }

  onSubmit() {
    this.isLoadingComplete = false;
    const params = {
      moduleId: this.moduleId,
      INPUT_USER_NO: this.rootScopeData?.userInfo?.userNo
        ? this.rootScopeData.userInfo.userNo
        : '',
      INPUT_FUNCTION_CODE: this.requestSummaryDetails.summary.functionCode
        ? this.requestSummaryDetails.summary.functionCode
        : '',
      INPUT_PRODUCT: this.requestSummaryDetails.summary.productCode
        ? this.requestSummaryDetails.summary.productCode
        : '',
      INPUT_SUB_PRODUCT: this.requestSummaryDetails.summary.subproductCode
        ? this.requestSummaryDetails.summary.subproductCode
        : '',
      REQUEST_TYPE: this.requestSummaryDetails.summary.requestType
        ? this.requestSummaryDetails.summary.requestType
        : '',
      TXN_REF_NUM: this.requestSummaryDetails.summary.refNo
        ? this.requestSummaryDetails.summary.refNo
        : '',
      ACTION: this.action,
      REJECT_REASON: this.rejectReasonText,
    };
    this.myTaskService.getePayMyTaskReject(params).subscribe(
      (response: any) => {
        this.isLoadingComplete = true;
        if (response.dataValue.STATUS === 'Success') {
          this.submittedResponse = response.dataValue;
          this.constructReceiptData();
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  setModuleDetails() {
    switch (this.requestSummaryDetails.summary.subproductCode) {
      case 'APEPYSTMT':
        this.moduleId = 'APPEPYREJ';
        this.action = 'APEPYFNC';
        this.receiptMessage = 'LBL_APPLY_FOR_EPAY_REJECTED';
        this.descriptionMessage =
          'LBL_EPAY_REQ_PENDING_APPROVAL_REQUEST_IS_INT_SUCCESS';
        break;
      case 'EPYMCD':
        this.moduleId = 'EPYMCDREJ';
        this.action = 'EPYMCDFNC';
        this.receiptMessage = 'LBL_MULTI_CLAIM_REQ_REJECTED';
        this.descriptionMessage =
          'LBL_MULTI_CLAIM_REQ_PENDING_APPROVAL_REQUEST_IS_INT_SUCCESS';
        break;
      case 'EPYMC':
        this.moduleId = 'EPYTRNSREJ';
        this.action = 'EPYTRFNC';
        this.receiptMessage = 'LBL_EPAY_MERCHANT_CLAIM_REJECTED';
        this.descriptionMessage =
          'LBL_EPAY_MERCHANT_CLAIM_PENDING_APPROVAL_REQUEST_IS_INT_SUCCESS';
        break;
      case 'EPYMCR':
        this.moduleId = 'EPYTRNSREJ';
        this.action = 'EPYTRFNC';
        this.receiptMessage = 'LBL_EPAY_REFUND_REQUEST_REJECTED';
        this.descriptionMessage =
          'LBL_EPAY_REFUND_REQUEST_PENDING_FOR_APPROVAL_REQUEST_IS_INT_SUCCESS';
        break;
    }
  }

  constructReceiptData() {
    this.saveReceiptObject = {
      pageheading: this.translateService.instant('LBL_REQ_SUCCESS'),
      subHeading: this.translateService.instant(this.receiptMessage),
      Description: this.translateService.instant(this.descriptionMessage),
      keyValues: [],
      pagecall: 'ePayReject',
      refNo: this.submittedResponse.INPUT_REFERENCE_NO,
    };
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: this.receiptMessage,
      referenceNumber: this.submittedResponse.INPUT_REFERENCE_NO,
      receiptDetails: [],
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
    if (this.moduleId === 'APPEPYREJ') {
      const data = [
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
              dataKey: this.requestSummaryDetails.details.accNo
                ? this.requestSummaryDetails.details.accNo
                : '--',
            },
            {
              dispKey: 'LBL_SHORT_NAME',
              dataKey: this.requestSummaryDetails.details.nickname
                ? this.requestSummaryDetails.details.nickname
                : '--',
            },
          ],
        },
        {
          title: 'LBL_MERCHANT_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_NAME',
              dataKey: this.requestSummaryDetails.details.comName
                ? this.requestSummaryDetails.details.comName
                : '--',
            },
            {
              dispKey: 'LBL_PHONE',
              dataKey: this.requestSummaryDetails.details.phoneNo
                ? this.requestSummaryDetails.details.phoneNo
                : '--',
            },
            {
              dispKey: 'LBL_CITY',
              dataKey: this.requestSummaryDetails.details.city
                ? this.requestSummaryDetails.details.city
                : '--',
            },
          ],
        },
      ];
      this.receiptObject.receiptDetails = data;
    } else if (this.moduleId === 'EPYTRNSREJ') {
      if (this.requestSummaryDetails.summary.subproductCode === 'EPYMC') {
        const data = [
          {
            title: 'LBL_TRANSACTION_DETAILS',
            isTable: 'false',
            data: '',
            fieldDetails: [
              {
                dispKey: 'LBL_REF_NUMBER',
                dataKey: this.requestSummaryDetails.details.refNo
                  ? this.requestSummaryDetails.details.refNo
                  : '--',
              },
              {
                dispKey: 'LBL_CARD_NO',
                dataKey: this.requestSummaryDetails.details.cardNo
                  ? this.requestSummaryDetails.details.cardNo
                  : '--',
              },
              {
                dispKey: 'LBL_DATE',
                dataKey: this.requestSummaryDetails.details.epayDate
                  ? this.requestSummaryDetails.details.epayDate
                  : '--',
              },
            ],
          },
          {
            title: 'LBL_REQUEST_DETAILS',
            isTable: 'false',
            data: '',
            fieldDetails: [
              {
                dispKey: 'LBL_CLAIM_TYPE',
                dataKey: this.requestSummaryDetails.details.claimType
                  ? this.requestSummaryDetails.details.claimType
                  : '--',
              },
              {
                dispKey: 'LBL_CLAIM_DESCRIPTION',
                dataKey: this.requestSummaryDetails.details.claimDesc
                  ? this.requestSummaryDetails.details.claimDesc
                  : '--',
              },
            ],
          },
        ];
        this.receiptObject.receiptDetails = data;
      } else if (
        this.requestSummaryDetails.summary.subproductCode === 'EPYMCR'
      ) {
        const data = [
          {
            title: 'LBL_TRANSACTION_DETAILS',
            isTable: 'false',
            data: '',
            fieldDetails: [
              {
                dispKey: 'LBL_CARD_NO',
                dataKey: this.requestSummaryDetails.details.cardNo
                  ? this.requestSummaryDetails.details.cardNo
                  : '--',
              },
              {
                dispKey: 'LBL_CARD_TYPE',
                dataKey: this.requestSummaryDetails.details.cardType
                  ? this.requestSummaryDetails.details.cardType
                  : '--',
              },
              {
                dispKey: 'LBL_DATE',
                dataKey: this.requestSummaryDetails.details.epayDate
                  ? this.requestSummaryDetails.details.epayDate
                  : '--',
              },
            ],
          },
          {
            title: 'LBL_REQUEST_DETAILS',
            isTable: 'false',
            data: '',
            fieldDetails: [
              {
                dispKey: 'LBL_RRN',
                dataKey: this.requestSummaryDetails.details.rrn
                  ? this.requestSummaryDetails.details.rrn
                  : '--',
              },
              {
                dispKey: 'LBL_REFUND_TYPE',
                dataKey: this.requestSummaryDetails.details.refundType
                  ? this.requestSummaryDetails.details.refundType
                  : '--',
              },
              {
                dispKey: 'LBL_CLAIM_DESCRIPTION',
                dataKey: this.requestSummaryDetails.details.claimDesc
                  ? this.requestSummaryDetails.details.claimDesc
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
                dispKey: 'LBL_REFUND_AMOUNT',
                dataKey:
                  this.requestSummaryDetails.details.refundAmt &&
                  this.requestSummaryDetails.details.currency
                    ? `${currencyFormatPipeFilter.transform(
                        this.requestSummaryDetails.details.refundAmt,
                        this.requestSummaryDetails.details.currency
                      )} ${this.requestSummaryDetails.details.currency}`
                    : '--',
              },
            ],
          },
        ];
        this.receiptObject.receiptDetails = data;
      }
    } else if (this.moduleId === 'EPYMCDREJ') {
      const data = [
        {
          title: 'LBL_MERCHANT_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_MERCHANT_NAME',
              dataKey: this.requestSummaryDetails.details.merchantName
                ? this.requestSummaryDetails.details.merchantName
                : '--',
            },
            {
              dispKey: 'LBL_MERCHANT_ID',
              dataKey: this.requestSummaryDetails.details.merchantId
                ? this.requestSummaryDetails.details.merchantId
                : '--',
            },
          ],
        },
        {
          title: 'LBL_CLAIM_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CLAIM_TYPE',
              dataKey: this.requestSummaryDetails.details.claimType
                ? this.requestSummaryDetails.details.claimType
                : '--',
            },
            {
              dispKey: 'LBL_MOBILE_NUMBER',
              dataKey: this.requestSummaryDetails.details.mobileNo
                ? this.requestSummaryDetails.details.mobileNo
                : '--',
            },
            {
              dispKey: 'LBL_FILE',
              dataKey: this.requestSummaryDetails.details.fileName
                ? this.requestSummaryDetails.details.fileName
                : '--',
            },
          ],
        },
      ];
      this.receiptObject.receiptDetails = data;
    }

    this.receiptObject.receiptDetails.push(
      {
        title: 'LBL_ADDITIONAL_DETAILS',
        isTable: 'false',
        fieldDetails: [
          {
            dispKey: 'LBL_RJCT_RSN',
            dataKey: this.rejectReasonText ? this.rejectReasonText : '--',
          },
        ],
      },
      {
        title: '',
        isTable: 'false',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: this.submittedResponse?.STATUS
              ? this.submittedResponse.STATUS
              : '--',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: this.submittedResponse?.OD_STATUS_DESC
              ? this.submittedResponse.OD_STATUS_DESC
              : '--',
          },
        ],
      }
    );
    this.showReceipt = true;
  }

  initiateAnotherRequest() {
    this.router.navigate(['/mytask/ePay']);
  }

  downloadPdf() {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant(this.receiptMessage),
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
    ];
    if (this.moduleId === 'APPEPYREJ') {
      pdfData.push(
        {
          type: 'heading',
          value: this.translateService.instant('LBL_FROM'),
          y: 55,
        },
        { type: 'setFontSize', size: 9 },
        { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_ACTION_BY'),
          y: 65,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_ACC_NUMBER'),
          y: 75,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_SHORT_NAME'),
          y: 85,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_MERCHANT_DETAILS'),
          y: 95,
        },
        { type: 'setFontSize', size: 9 },
        { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_NAME'),
          y: 105,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_PHONE'),
          y: 115,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_CITY'),
          y: 125,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'text',
          value: this.rootScopeData?.userInfo?.userNo
            ? this.rootScopeData.userInfo.userNo
            : '--',
          y: 65,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.accNo
            ? this.requestSummaryDetails.details.accNo
            : '--',
          y: 75,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.nickname
            ? this.requestSummaryDetails.details.nickname
            : '--',
          y: 85,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.comName
            ? this.requestSummaryDetails.details.comName
            : '--',
          y: 105,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.phoneNo
            ? this.requestSummaryDetails.details.phoneNo
            : '--',
          y: 115,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.city
            ? this.requestSummaryDetails.details.city
            : '--',
          y: 125,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_REF_NUMBER'),
          y: 135,
        },
        {
          type: 'text',
          value: this.submittedResponse.INPUT_REFERENCE_NO,
          y: 135,
        },
        {
          type: 'heading',
          value: this.translateService.instant(this.receiptMessage),
          y: 145,
        }
      );
    } else if (this.moduleId === 'EPYTRNSREJ') {
      if (this.requestSummaryDetails.summary.subproductCode === 'EPYMC') {
        pdfData.push(
          {
            type: 'heading',
            value: this.translateService.instant('LBL_TRANSACTION_DETAILS'),
            y: 55,
          },
          { type: 'setFontSize', size: 9 },
          { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_REF_NUMBER'),
            y: 65,
          },
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_CARD_NO'),
            y: 75,
          },
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_DATE'),
            y: 85,
          },
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_REQUEST_DETAILS'),
            y: 95,
          },
          { type: 'setFontSize', size: 9 },
          { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_CLAIM_TYPE'),
            y: 105,
          },
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_CLAIM_DESCRIPTION'),
            y: 115,
          },
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
          {
            type: 'text',
            value: this.rootScopeData?.userInfo?.refNo
              ? this.rootScopeData.userInfo.refNo
              : '--',
            y: 65,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.cardNo
              ? this.requestSummaryDetails.details.cardNo
              : '--',
            y: 75,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.epayDate
              ? this.requestSummaryDetails.details.epayDate
              : '--',
            y: 85,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.claimType
              ? this.requestSummaryDetails.details.claimType
              : '--',
            y: 105,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.claimDesc
              ? this.requestSummaryDetails.details.claimDesc
              : '--',
            y: 115,
          },
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_REF_NUMBER'),
            y: 125,
          },
          {
            type: 'text',
            value: this.submittedResponse.INPUT_REFERENCE_NO,
            y: 135,
          },
          {
            type: 'heading',
            value: this.translateService.instant(this.receiptMessage),
            y: 135,
          }
        );
      } else if (
        this.requestSummaryDetails.summary.subproductCode === 'EPYMCR'
      ) {
        pdfData.push(
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
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_REQUEST_DETAILS'),
            y: 95,
          },
          { type: 'setFontSize', size: 9 },
          { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_RRN'),
            y: 105,
          },
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
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
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.cardNo
              ? this.requestSummaryDetails.details.cardNo
              : '--',
            y: 65,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.cardType
              ? this.requestSummaryDetails.details.cardType
              : '--',
            y: 75,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.epayDate
              ? this.requestSummaryDetails.details.epayDate
              : '--',
            y: 85,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.rrn
              ? this.requestSummaryDetails.details.rrn
              : '--',
            y: 105,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.refundType
              ? this.requestSummaryDetails.details.refundType
              : '--',
            y: 115,
          },
          {
            type: 'text',
            value: this.requestSummaryDetails.details.claimDesc
              ? this.requestSummaryDetails.details.claimDesc
              : '--',
            y: 125,
          },
          {
            type: 'text',
            value:
              this.requestSummaryDetails.details.refundAmt &&
              this.requestSummaryDetails.details.currency
                ? `${currencyFormatPipeFilter.transform(
                    this.requestSummaryDetails.details.refundAmt,
                    this.requestSummaryDetails.details.currency
                  )} ${this.requestSummaryDetails.details.currency}`
                : '--',
            y: 135,
          },
          { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
          {
            type: 'heading',
            value: this.translateService.instant('LBL_REF_NUMBER'),
            y: 145,
          },
          {
            type: 'text',
            value: this.submittedResponse.INPUT_REFERENCE_NO,
            y: 135,
          },
          {
            type: 'heading',
            value: this.translateService.instant(this.receiptMessage),
            y: 155,
          }
        );
      }
    } else if (this.moduleId === 'EPYMCDREJ') {
      pdfData.push(
        {
          type: 'heading',
          value: this.translateService.instant('LBL_MERCHANT_DETAILS'),
          y: 55,
        },
        { type: 'setFontSize', size: 9 },
        { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_MERCHANT_NAME'),
          y: 65,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_MERCHANT_ID'),
          y: 75,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_CLAIM_DETAILS'),
          y: 85,
        },
        { type: 'setFontSize', size: 9 },
        { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_CLAIM_TYPE'),
          y: 95,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_MOBILE_NUMBER'),
          y: 105,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_FILE'),
          y: 115,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.merchantName
            ? this.requestSummaryDetails.details.merchantName
            : '--',
          y: 65,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.merchantId
            ? this.requestSummaryDetails.details.merchantId
            : '--',
          y: 75,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.claimType
            ? this.requestSummaryDetails.details.claimType
            : '--',
          y: 95,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.mobileNo
            ? this.requestSummaryDetails.details.mobileNo
            : '--',
          y: 105,
        },
        {
          type: 'text',
          value: this.requestSummaryDetails.details.fileName
            ? this.requestSummaryDetails.details.fileName
            : '--',
          y: 115,
        },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_REF_NUMBER'),
          y: 125,
        },
        {
          type: 'text',
          value: this.submittedResponse.INPUT_REFERENCE_NO,
          y: 135,
        },
        {
          type: 'heading',
          value: this.translateService.instant(this.receiptMessage),
          y: 135,
        }
      );
    }

    pdfData.push({
      type: 'save',
      value:
        this.translateService.instant(
          this.requestSummaryDetails.summary.requestType
        ) + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }

  onBackArrowClick() {
    this.router.navigate(['/mytask/ePaySummary']);
  }
}
