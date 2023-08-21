import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyTaskService } from '../../services/my-task.service';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';

@Component({
  selector: 'app-postransaction-details',
  templateUrl: './postransaction-details.component.html',
  styleUrls: ['./postransaction-details.component.scss'],
})
export class PostransactionDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  rejectreason: string = '';
  moduleId: string = '';

  workFlowHistoryParams: any = {};
  recordSummaryObject: any = {};
  transactionDetails: any = {};
  receiptData: any = {};

  isrejectreasonValid: boolean = false;
  hideInitiateButton: boolean = true;
  isLoadingComplete: boolean = true;
  isPosReject: boolean = false;
  showReceipt: boolean = false;
  showRecSumm: boolean = false;
  pageName: boolean = true;

  sortOptions: any = {
    sortColumn: 'transactionRef',
    sortOrder: 'desc',
    fromRow: 1,
    toRow: 6,
  };
  isPosService: boolean = false;

  constructor(
    private readonly mytaskService: MyTaskService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url === '/mytask/posReview') {
      this.isPosService = true;
    }

    if (
      !this.rootScopeData.pendingActivitiesBulkUploadObject &&
      this.router.url === '/mytask/posReview'
    ) {
      this.router.navigate(['/mytask/posTransaction/posService']);
      return;
    } else if (
      !this.rootScopeData.pendingActivitiesBulkUploadObject &&
      this.router.url === '/mytask/posTransaction/posUpload'
    ) {
      this.router.navigate(['/mytask/posTransaction/posUpload']);
      return;
    }

    let moduleId = 'POSMFDET'; // will execute on Request Type --> Merchant Finance Dispute
    this.rootScopeData.pendingActivitiesBulkUploadObject.requestType ===
      'Merchant Finance Dispute' && this.getTransactionDetail(moduleId);

    moduleId = 'POSRFDET'; // will execute on Request Type --> Fee Debit Inquiry
    this.rootScopeData.pendingActivitiesBulkUploadObject.requestType ===
      'Fee Debit Inquiry' && this.getTransactionDetail(moduleId);

    moduleId = 'POSFDDET'; // will execute on Request Type --> Refund Request
    this.rootScopeData.pendingActivitiesBulkUploadObject.requestType ===
      'Refund Request' && this.getTransactionDetail(moduleId);

    moduleId = 'POSTRANSDET'; // will execute on Request Type --> Merchant Dispute
    this.rootScopeData.pendingActivitiesBulkUploadObject.requestType ===
      'Merchant Dispute' && this.getTransactionDetail(moduleId);

    moduleId = 'POSMRFDET'; // will execute on Request Type --> Multi Claim Request
    this.rootScopeData.pendingActivitiesBulkUploadObject.requestType ===
      'Multi Claim Request' && this.getTransactionDetail(moduleId);

    if (this.router.url === '/mytask/posReject') {
      this.isPosReject = true;
    } else if (this.router.url === '/mytask/posAuthorize') {
      this.isPosReject = false;
    } else {
      this.getRecordSummary();
    }
  }

  getWorkFlowHistory() {
    this.workFlowHistoryParams = {
      txnRefNo: this.rootScopeData.pendingActivitiesBulkUploadObject?.refNo
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.refNo
        : '',
      productCode: 'CORESVS',
      subProductCode: 'CARDSTP',
      functionCode: 'CRDSTPFNC',
      unit_ID: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
  }

  getTransactionDetail(moduleId: string) {
    this.isLoadingComplete = false;

    const param = {
      moduleId: moduleId,
      refNo: this.rootScopeData.pendingActivitiesBulkUploadObject?.refNo
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.refNo
        : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };

    this.mytaskService.getTransactionDetails(param).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        if (res && res.data) {
          this.transactionDetails = res.data;
          this.rootScopeData.posTransactionMerchantDetail = res.data;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getMerchantFinanceDispute() {
    this.isLoadingComplete = false;

    const param = {
      refNo: this.rootScopeData.pendingActivitiesBulkUploadObject?.refNo
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.refNo
        : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };

    this.mytaskService.getTransactionDetails(param).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        if (res && res.data) {
          this.transactionDetails = res.data;
          this.rootScopeData.posTransactionMerchantDetail = res.data;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  getRecordSummary() {
    this.isLoadingComplete = false;

    const params = {
      productName: 'CORESVS',
      subPdt: 'POSMCD',
      functionCode: 'POSMCDFNC',
      refNo: this.rootScopeData.pendingActivitiesBulkUploadObject?.refNo
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.refNo
        : '',
    };

    this.mytaskService.posRecordSummary(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        if (res && res.data && res.data.length > 0) {
          this.sortOptions = res.headerValue;
          this.showRecSumm = true;

          this.recordSummaryObject = {
            data: res.data,
            displayDetails: [
              {
                displayLabel: 'LBL_TRANSACTION_DATE',
                displayKey: 'transactionDate',
                type: 'date',
              },
              {
                displayLabel: 'LBL_REF_NUMBER',
                displayKey: 'refNo',
              },
              {
                displayLabel: 'LBL_CLAIM_TYPE',
                displayKey: 'claimType',
              },

              {
                displayLabel: 'LBL_REFUND_TYPE',
                displayKey: 'refundType',
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
        this.isLoadingComplete = true;
      }
    );
  }

  textAreaClick() {
    this.isrejectreasonValid = this.rejectreason ? false : true;
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onSortColumn(event: any) {
    this.getRecordSummary();
  }

  submitToReceipt() {
    this.textAreaClick();

    if (this.rejectreason) {
      this.isLoadingComplete = false;

      const params = {
        INPUT_GCIF: this.rootScopeData?.userInfo?.corpID
          ? this.rootScopeData.userInfo.corpID
          : '',
        INPUT_USER_NO: this.rootScopeData?.userInfo?.userNo
          ? this.rootScopeData.userInfo.userNo
          : '',
        REJECT_REASON: this.rejectreason ?? '',
        TXN_REF_NUM: this.rootScopeData.pendingActivitiesBulkUploadObject?.refNo
          ? this.rootScopeData.pendingActivitiesBulkUploadObject.refNo
          : '',
        PRODUCT: this.rootScopeData.pendingActivitiesBulkUploadObject
          ?.productCode
          ? this.rootScopeData.pendingActivitiesBulkUploadObject.productCode
          : '',
        SUB_PRODUCT: this.rootScopeData.pendingActivitiesBulkUploadObject
          ?.subproductCode
          ? this.rootScopeData.pendingActivitiesBulkUploadObject.subproductCode
          : '',
        ACTION: this.rootScopeData.pendingActivitiesBulkUploadObject
          ?.functionCode
          ? this.rootScopeData.pendingActivitiesBulkUploadObject.functionCode
          : '',
        INPUT_HOST_CODE: 'ACCRD',
        INPUT_VER_NO: this.rootScopeData.pendingActivitiesBulkUploadObject
          ?.versionNo
          ? this.rootScopeData.pendingActivitiesBulkUploadObject.versionNo
          : '',
      };

      this.mytaskService.posRejectSubmit(params).subscribe(
        (res: any) => {
          this.isLoadingComplete = true;

          if (
            res &&
            res.dataValue &&
            res.dataValue.STATUS &&
            res.dataValue.STATUS === 'Success'
          ) {
            this.showReceipt = true;
            this.rootScopeData.isActivateCard = this.showReceipt;
            this.constructReceiptData(res.dataValue.INTERNAL_REFERENCE_NO);
          }
        },
        (error: any) => {
          this.isLoadingComplete = true;
        }
      );
    }
  }

  constructReceiptData(referenceNo: string) {
    this.receiptData = {
      msg1: 'LBL_REQ_SUCCESS',
      // msg2: 'LBL_ADDITIONAL_ACCOUNT_REQ_PEND_APPROVE_MSG',
      msg2: 'LBL_ADDITIONAL_ACCOUNT_REQ_IS_INT_SUCCESS',
      referenceNumber: referenceNo,
      receiptDetails: [
        {
          title: 'LBL_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_Account_Number',
              dataKey: this.transactionDetails?.accNo
                ? this.transactionDetails.accNo
                : '--',
            },
            {
              dispKey: 'LBL_MERCHANT_NUMBER',
              dataKey: this.transactionDetails?.merchantId
                ? this.transactionDetails.merchantId
                : '--',
            },
            {
              dispKey: 'LBL_TERMINAL_CITY_NAME_OR_NEAREST_CITY',
              dataKey: this.transactionDetails?.terminalType
                ? this.transactionDetails.terminalType
                : '--',
            },
            {
              dispKey: 'LBL_MOBILE_NUMBER',
              dataKey: this.transactionDetails?.mobileNo
                ? this.transactionDetails.mobileNo
                : '--',
            },
            {
              dispKey: 'LBL_EMAIL_ADDRESS_1',
              dataKey: this.transactionDetails?.email
                ? this.transactionDetails.email
                : '--',
            },
            {
              dispKey: 'LBL_NUMBER_OF_TERMINALS_(IN_SAME_LOCATION)',
              dataKey: this.transactionDetails?.terminalId
                ? this.transactionDetails.terminalId
                : '--',
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

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    this.isPosReject &&
      this.receiptData.receiptDetails.push({
        title: 'LBL_ADDITIONAL_DETAILS',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_RJCT_RSN',
            dataKey: this.rejectreason ?? '--',
          },
        ],
      });
  }
}
