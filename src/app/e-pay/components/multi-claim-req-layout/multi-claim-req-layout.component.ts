import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { EpayServiceService } from '../../services/epay-service.service';
import { MultiClaimMerchantDetailsComponent } from '../multi-claim-merchant-details/multi-claim-merchant-details.component';

@Component({
  selector: 'app-multi-claim-req-layout',
  templateUrl: './multi-claim-req-layout.component.html',
  styleUrls: ['./multi-claim-req-layout.component.scss'],
})
export class MultiClaimReqLayoutComponent implements OnInit {
  merchantDetails: any;
  merchantClaimDetails: any;

  @ViewChild('merchantDetailsComp')
  merchantDetailsComp!: MultiClaimMerchantDetailsComponent;

  pageType: string = '';
  sortOptions: any = {
    sortColumn: 'transactionDate',
    sortOrder: 'asc',
    fromRow: 0,
    toRow: 5,
    totalCount: ''
  };
  recordSummaryObject: any;

  isLoadingComplete: boolean = true;
  showRecSumm: boolean = false;

  saveReceiptObject: any;
  flexAuthResp: any = {};
  receiptObject: any = {};
  authOptions: any;
  otpError: string = '';
  authDataObj: any;
  secAuthRef: any;
  userOtpValue: string = '';
  submittedData: any;
  proceedResponse: any;

  url: string = systemproperty.termsAndConditionsForPayments;

  recordSummaryModuleId: string = 'EPYMULCLMRCRDSUMMY';

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private ePayService: EpayServiceService,
    private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf
  ) {}

  ngOnInit(): void {}

  getMerchantDetails(event: any) {
    this.merchantDetails = event;
    this.pageType = '';
  }

  toCancel() {
    this.pageType = '';
    this.merchantDetailsComp.getSelectedAccount('iconClick');
  }

  proceedNext(event: any) {
    this.merchantClaimDetails = event;
    const params = {
      fileSize: event.uploadedFile.size ? event.uploadedFile.size : '',
      fileFormat: event.uploadedFile.format ? event.uploadedFile.format : '',
      accNo: this.merchantDetails.OD_ACC_NO ? this.merchantDetails.OD_ACC_NO : '',
      fileName: event.uploadedFile.fileActualName ? event.uploadedFile.fileActualName : '',
      mobileNumber: event.mobileNumber ? event.mobileNumber : '',
      financialClaimType: event.claimType ? event.claimType : '',
      claimdesc: event.description ? event.description : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : ''
    };
    this.isLoadingComplete = false;
    this.ePayService.multiClaimProceed(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.data) {
          this.proceedResponse = res.data;
          this.pageType = 'review';
          this.getRecordSummary();
          this.getAuthorizerList();
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getRecordSummary() {
    const params = {
      sortOrder: this.sortOptions.sortOrder,
      sortColumn: this.sortOptions.sortColumn,
      fromRowNo: this.sortOptions.fromRowNo,
      toRowNo: this.sortOptions.toRowNo,
      refNo: this.proceedResponse.REFERENCE_NUM ? this.proceedResponse.REFERENCE_NUM : '',
    };
    this.isLoadingComplete = false;
    this.ePayService.getMultiClaimRecordSummary(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.data) {
          const recordSummaryList = res.data.map((val: any) => {
            return {
              currency: 'SAR',
              ...val
            };
          });
          this.sortOptions.totalCount = res.headerValue.totalCount;
          this.showRecSumm = true;
          this.rootScopeData.totalRecrdsCount = res.headerValue.totalCount;
          this.recordSummaryObject = {
            data: recordSummaryList,
            displayDetails: [
              {
                displayLabel: 'LBL_TRANSACTION_DATE',
                displayKey: 'transactionDate',
              },
              {
                displayLabel: 'LBL_TRANS_SEQ_NUM',
                displayKey: 'transSeqNo',
              },
              {
                displayLabel: 'LBL_TRANSACTION_TYPE',
                displayKey: 'transType',
              },
              {
                displayLabel: 'LBL_APPROVAL_CODE',
                displayKey: 'aproveCode',
              },
              {
                displayLabel: 'LBL_AMOUNT',
                displayKey: 'amount',
                type: 'amount',
                supportValue: 'currency',
              },
            ],
          };
        }
      },
      (error: any) => {
        this.showRecSumm = true;
        this.isLoadingComplete = true;
      }
    );
  }

  onSortColumn(event: any) {
    this.sortOptions.sortColumn = event.sortColumn;
    this.sortOptions.sortOrder = event.sortOrder;
    this.sortOptions.fromRow = event.fromRow;
    this.sortOptions.toRow = event.toRow;
    this.getRecordSummary();
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
      subProdCode: 'EPYMCD',
      funcCode: 'EPYMCDFNC',
      amount: this.merchantClaimDetails.refundAmount
        ? this.merchantClaimDetails.refundAmount
        : '',
      accNo: this.merchantDetails?.selectedAccount?.OD_ACC_NO
        ? this.merchantDetails?.selectedAccount?.OD_ACC_NO
        : '',
      pymntCurrency: this.merchantDetails?.selectedAccount?.OD_CCY_CODE
        ? this.merchantDetails?.selectedAccount?.OD_CCY_CODE
        : '',
      debitCurrency: this.merchantDetails?.selectedAccount?.OD_CCY_CODE
        ? this.merchantDetails?.selectedAccount?.OD_CCY_CODE
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
      param1: this.secAuthRef,
      param2: this.userOtpValue,
      SEL_PARSED_RULE_ID: this.authDataObj?.selectedAprover?.PARSED_RULE_ID
        ? this.authDataObj.selectedAprover?.PARSED_RULE_ID
        : '',
      SELECTION_FLAG: this.authOptions.length > 0 ? 'Y' : 'N',
      INPUT_CIF_NO: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo.sCustNo
        : '',
      INPUT_UNIT_ID: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      INPUT_REQ_COUNTRY_CODE: this.merchantDetails?.selectedAccount
        ?.REQ_COUNTRY_CODE
        ? this.merchantDetails?.selectedAccount?.REQ_COUNTRY_CODE
        : '',
      ACCNO: this.merchantDetails?.selectedAccount?.OD_ACC_NO
        ? this.merchantDetails?.selectedAccount?.OD_ACC_NO
        : '',
      NICKNAME: this.merchantDetails?.selectedAccount?.ALIAS_NAME
        ? this.merchantDetails?.selectedAccount?.ALIAS_NAME
        : '',
      FULLNAME: this.merchantDetails?.selectedAccount?.OD_ACC_NAME
        ? this.merchantDetails?.selectedAccount?.OD_ACC_NAME
        : '',
      STATUS: this.merchantDetails?.selectedAccount?.STATUS
        ? this.merchantDetails?.selectedAccount?.STATUS
        : '',
      BALANCE: this.merchantDetails?.selectedAccount?.CURR_AVAIL_BAL_AMT
        ? this.merchantDetails?.selectedAccount?.CURR_AVAIL_BAL_AMT
        : '',
      FILE_NAME: this.merchantClaimDetails.uploadedFile?.fileActualName
        ? this.merchantClaimDetails.uploadedFile?.fileActualName
        : '--',
      MERCHANTENGNAME: this.merchantDetails?.selectedMerchant
        ?.merchantEnglishName
        ? this.merchantDetails?.selectedMerchant?.merchantEnglishName
        : '',
      MERCHANTID: this.merchantDetails?.selectedMerchant?.merchantAccountNumber
        ? this.merchantDetails?.selectedMerchant?.merchantAccountNumber
        : '',
      MOBILENO: this.merchantClaimDetails.mobileNumber
        ? this.merchantClaimDetails.mobileNumber
        : '',
      CLAIMDES: this.merchantClaimDetails.description
        ? this.merchantClaimDetails.description
        : '',
      CLAIMTYPE: this.merchantClaimDetails.claimType
        ? this.merchantClaimDetails.claimType
        : '',
      CURRENCY: this.merchantDetails?.selectedAccount?.OD_CCY_CODE
        ? this.merchantDetails?.selectedAccount?.OD_CCY_CODE
        : '',
      AMOUNT: this.merchantClaimDetails.refundAmount
        ? this.merchantClaimDetails.refundAmount
        : '',
      NORECORDS: this.sortOptions.totalCount ? this.sortOptions.totalCount : '',
      BENENAME: '',
      VIOLATORID: '', // Need to remove once we got request payload from backend team
      VIOLATIONID: '', // Need to update once we got request payload from backend team
    };
    this.ePayService.multiClaimSubmit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.dataValue &&
          res.dataValue.STATUS &&
          res.dataValue.STATUS === 'SUCCESS'
        ) {
          this.submittedData = res.dataValue;
          this.constructReceiptData(this.submittedData);
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  constructReceiptData(response: any) {
    this.saveReceiptObject = {
      pageheading: this.translateService.instant('LBL_REQ_SUCCESS'),
      subHeading: this.translateService.instant(
        'LBL_MULTI_CLAIM_REQ_PENDING_APPROVAL'
      ),
      Description: this.translateService.instant(
        'LBL_MULTI_CLAIM_REQ_PENDING_APPROVAL_REQUEST_IS_INT_SUCCESS'
      ),
      keyValues: [],
      pagecall: 'multiClaimRequest',
      refNo: response.INPUT_REFERENCE_NO,
    };
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_MULTI_CLAIM_REQ_PENDING_APPROVAL',
      referenceNumber: response.INPUT_REFERENCE_NO,
      receiptDetails: [
        {
          title: 'LBL_MERCHANT_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_MERCHANT_NAME',
              dataKey: this.merchantDetails?.selectedMerchant
                ?.merchantEnglishName
                ? this.merchantDetails?.selectedMerchant?.merchantEnglishName
                : '--',
            },
            {
              dispKey: 'LBL_MERCHANT_ID',
              dataKey: this.merchantDetails?.selectedMerchant
                ?.merchantAccountNumber
                ? this.merchantDetails?.selectedMerchant?.merchantAccountNumber
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
              dataKey: this.merchantClaimDetails.claimType
                ? this.merchantClaimDetails.claimType
                : '--',
            },
            {
              dispKey: 'LBL_MOBILE_NUMBER',
              dataKey: this.merchantClaimDetails.mobileNumber
                ? this.merchantClaimDetails.mobileNumber
                : '--',
            },
            {
              dispKey: 'LBL_FILE',
              dataKey: this.merchantClaimDetails.uploadedFile?.fileActualName
                ? this.merchantClaimDetails.uploadedFile?.fileActualName
                : '--',
            }
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
    this.pageType = 'receipt';
  }

  makeAnotherPayment() {
    this.merchantDetails = null;
    this.pageType = '';
  }

  downloadPdf() {
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_MULTI_CLAIM_REQUEST_RECEIPT'),
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
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CLAIM_TYPE'),
        y: 95,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_MOBILE_NUMBER'),
        y: 105,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FILE'),
        y: 115,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'text',
        value: this.merchantClaimDetails.claimType
          ? this.merchantClaimDetails.claimType
          : '--',
        y: 95,
      },
      {
        type: 'text',
        value: this.merchantClaimDetails.mobileNumber
          ? this.merchantClaimDetails.mobileNumber
          : '--',
        y: 105,
      },
      {
        type: 'text',
        value: this.merchantClaimDetails.uploadedFile?.fileActualName
          ? this.merchantClaimDetails.uploadedFile?.fileActualName
          : '--',
        y: 115,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 125,
      },
      { type: 'text', value: this.submittedData.INPUT_REFERENCE_NO, y: 125 },
      {
        type: 'heading',
        value: this.translateService.instant(
          'LBL_MULTI_CLAIM_REQ_PENDING_APPROVAL'
        ),
        y: 135,
      }
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_MULTI_CLAIM_REQUEST_RECEIPT') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
