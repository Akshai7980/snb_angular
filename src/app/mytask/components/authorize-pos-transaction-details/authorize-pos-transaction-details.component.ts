import { Component, OnInit } from '@angular/core';
import { MyTaskService } from '../../services/my-task.service';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';

@Component({
  selector: 'app-authorize-pos-transaction-details',
  templateUrl: './authorize-pos-transaction-details.component.html',
  styleUrls: ['./authorize-pos-transaction-details.component.scss'],
})
export class AuthorizePosTransactionDetailsComponent implements OnInit {
  hideInitiateButton: boolean = true;
  isLoadingComplete: boolean = true;
  showReceipt: boolean = false;
  isFlexiAuth: boolean = false;

  receiptData: any = {};
  authDataObj: any = {};

  authList: any = [];

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private readonly mytaskService: MyTaskService) {}

  ngOnInit(): void {
    this.selfAuthCheck();
  }

  selfAuthCheck() {
    this.isLoadingComplete = false;

    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData?.userInfo?.corpID
        ? this.rootScopeData.userInfo.corpID
        : '',
      productCode: this.rootScopeData.pendingActivitiesBulkUploadObject
        .productCode
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.productCode
        : '',
      subProdCode: this.rootScopeData.pendingActivitiesBulkUploadObject
        .subproductCode
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.subproductCode
        : '',
      funcCode: this.rootScopeData.pendingActivitiesBulkUploadObject
        .functionCode
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.functionCode
        : '',
      amount: this.rootScopeData.posTransactionMerchantDetail?.amount
        ? this.rootScopeData.posTransactionMerchantDetail.amount
        : '',
      accNo: this.rootScopeData.posTransactionMerchantDetail?.accNo
        ? this.rootScopeData.posTransactionMerchantDetail.accNo
        : '',
      pymntCurrency: this.rootScopeData.posTransactionMerchantDetail?.currency
        ? this.rootScopeData.posTransactionMerchantDetail.currency
        : '',
      debitCurrency: this.rootScopeData.posTransactionMerchantDetail?.currency
        ? this.rootScopeData.posTransactionMerchantDetail.currency
        : '',
    };

    this.mytaskService.getAuthorizers(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        if (
          res &&
          res.data &&
          res.data.authList &&
          res.data.authList.length > 0
        ) {
          this.authList = res.data.authList;
        }

        if (res.data.flexiAuth === 'true') {
          this.isFlexiAuth = true;
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  setAuthorizationDetails(details: any): void {
    this.authDataObj = details;
  }

  submitToReceipt() {
    this.isLoadingComplete = false;

    const params = {
      INPUT_GCIF: this.rootScopeData?.userInfo?.corpID
        ? this.rootScopeData.userInfo.corpID
        : '',
      INPUT_USER_NO: this.rootScopeData?.userInfo?.userNo
        ? this.rootScopeData.userInfo.userNo
        : '',
      TXN_REF_NUM: this.rootScopeData.pendingActivitiesBulkUploadObject.refNo
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.refNo
        : '',
      PRODUCT: this.rootScopeData.pendingActivitiesBulkUploadObject.productCode
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.productCode
        : '',
      SUB_PRODUCT: this.rootScopeData.pendingActivitiesBulkUploadObject
        .subproductCode
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.subproductCode
        : '',
      ACTION: this.rootScopeData.pendingActivitiesBulkUploadObject.functionCode
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.functionCode
        : '',
      INPUT_HOST_CODE: 'ACCRD',
      INPUT_VER_NO: this.rootScopeData.pendingActivitiesBulkUploadObject
        .versionNo
        ? this.rootScopeData.pendingActivitiesBulkUploadObject.versionNo
        : '',
    };

    this.mytaskService.posAuthorizeSubmit(params).subscribe(
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

          this.constructReceiptData(
            res.dataValue.INTERNAL_REFERENCE_NO,
            res.dataValue
          );
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }
  constructReceiptData(referenceNo: string, submitResp: any) {
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
              dataKey: this.rootScopeData.posTransactionMerchantDetail?.accNo
                ? this.rootScopeData.posTransactionMerchantDetail.accNo
                : '--',
            },
            {
              dispKey: 'LBL_MERCHANT_NUMBER',
              dataKey: this.rootScopeData.posTransactionMerchantDetail
                ?.merchantId
                ? this.rootScopeData.posTransactionMerchantDetail.merchantId
                : '--',
            },
            {
              dispKey: 'LBL_TERMINAL_CITY_NAME_OR_NEAREST_CITY',
              dataKey: this.rootScopeData.posTransactionMerchantDetail
                ?.terminalType
                ? this.rootScopeData.posTransactionMerchantDetail.terminalType
                : '--',
            },
            {
              dispKey: 'LBL_MOBILE_NUMBER',
              dataKey: this.rootScopeData.posTransactionMerchantDetail?.mobileNo
                ? this.rootScopeData.posTransactionMerchantDetail.mobileNo
                : '--',
            },
            {
              dispKey: 'LBL_EMAIL_ADDRESS_1',
              dataKey: this.rootScopeData.posTransactionMerchantDetail?.email
                ? this.rootScopeData.posTransactionMerchantDetail.email
                : '--',
            },
            {
              dispKey: 'LBL_NUMBER_OF_TERMINALS_(IN_SAME_LOCATION)',
              dataKey: this.rootScopeData.posTransactionMerchantDetail
                ?.terminalId
                ? this.rootScopeData.posTransactionMerchantDetail.terminalId
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

    this.isFlexiAuth &&
      this.receiptData.receiptDetails.push(
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: this.authDataObj?.selectedAprover?.AUTH_NAME
                ? this.authDataObj.selectedAprover.AUTH_NAME
                : 'Any',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: this.authDataObj?.aproveNote
                ? this.authDataObj.aproveNote
                : '--',
            },
          ],
        },
        {
          title: '',
          isTable: 'false',
          fieldDetails: [
            {
              dispKey: 'LBL_STATUS',
              dataKey: submitResp?.STATUS ? submitResp.STATUS : '--',
            },
            {
              dispKey: 'LBL_RESPONSE',
              dataKey: submitResp?.OD_STATUS_DESC
                ? submitResp.OD_STATUS_DESC
                : '--',
            },
          ],
        }
      );
  }
}
