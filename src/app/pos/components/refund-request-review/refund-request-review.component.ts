import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-refund-request-review',
  templateUrl: './refund-request-review.component.html',
  styleUrls: ['./refund-request-review.component.scss'],
})
export class RefundRequestReviewComponent implements OnInit {
  url: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  showReceipt: boolean = false;
  receiptData: any;
  otpError: string = '';
  userOtpValue: any;
  authOptions: any;
  sefAuthFlag: string = '';
  errorCode: string = '';
  authDataObj: any;
  secAuthRef: string = '';
  authType: any;
  constructor(private router: Router, public posService: PosService) {}

  ngOnInit(): void {
    if (
      this.rootScopeData.posTransactionMerchantDetail === '' ||
      this.rootScopeData.posTransactionMerchantDetail.length === 0
    ) {
      this.rootScopeData.showtransaction = true;
      this.rootScopeData.showMerchantDetail = false;
      this.router.navigate(['/pos/posTransactions']);
    }

    this.getAuthorizationData();
  }

  returnToAccount(event: any) {
    if (event) {
      this.rootScopeData.showtransaction = true;
      this.rootScopeData.showMerchantDetail = false;
      this.router.navigate(['/pos/posTransactions']);
    }
  }

  returnToTransaction(event: any) {
    if (event) {
      this.rootScopeData.showtransaction = false;
      this.rootScopeData.showMerchantDetail = true;
      this.router.navigate(['/pos/posTransactions']);
    }
  }

  getAuthType(val: any) {
    this.authType = val;
  }

  submit() {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }

    this.posService.getTransactionSubmit().subscribe(
      (res: any) => {
        if (
          res &&
          res.dataValue &&
          res.dataValue.STATUS &&
          res.dataValue.STATUS === 'SUCCESS'
        ) {
          this.showReceipt = true;
          this.constructReceiptData(res.dataValue.INPUT_REFERENCE_NO);
        }
      },
      (error: any) => {}
    );
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_REQUEST_SUCCSFL',
      msg2: 'LBL_YOUR_REFUND_REQUEST_IS_PENDING_FOR_APPROVAL',
      referenceNumber: refNumber,

      receiptDetails: [
        {
          title: 'LBL_TRANSACTION_DETAILS',
          isTable: 'false',
          data: this.rootScopeData.posSelectedTransaction,
          fieldDetails: [
            {
              dispKey: 'LBL_TERMINAL_ID',
              dataKey: this.rootScopeData.posSelectedTransaction.termianlId
                ? this.rootScopeData.posSelectedTransaction.termianlId
                : '--',
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.rootScopeData.posSelectedTransaction.maskedpan
                ? this.rootScopeData.posSelectedTransaction.maskedpan
                : '--',
            },
            {
              dispKey: 'LBL_DATE',
              dataKey: this.rootScopeData.posSelectedTransaction.transactionDate
                ? this.rootScopeData.posSelectedTransaction.transactionDate
                : '--',
              type: 'date',
            },
          ],
        },
        {
          title: 'LBL_REQUEST_DETAILS',
          isTable: 'false',
          data: this.rootScopeData.posTransactionRefundRequestDetail,
          fieldDetails: [
            {
              dispKey: 'LBL_MOBILE_NUMBER',
              dataKey:
                this.rootScopeData.posTransactionRefundRequestDetail.mobile,
            },
            {
              dispKey: 'LBL_FINANCIAL_CLAIM_TYPE',
              dataKey:
                this.rootScopeData.posTransactionRefundRequestDetail
                  .financialType.financialClaim,
            },

            {
              dispKey: 'LBL_CLAIM_DESCRIPTION',
              dataKey:
                this.rootScopeData.posTransactionRefundRequestDetail
                  .description,
            },
          ],
        },
        {
          isTable: 'false',
          data: this.rootScopeData.posSelectedTransaction,
          fieldDetails: [
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: this.rootScopeData.posSelectedTransaction
                .transactionAmount
                ? this.rootScopeData.posSelectedTransaction.transactionAmount
                : '--',
            },
          ],
        },
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey:
                this.authDataObj &&
                this.authDataObj.selectedAprover &&
                this.authDataObj.selectedAprover.AUTH_NAME
                  ? this.authDataObj.selectedAprover.AUTH_NAME
                  : 'LBL_NOT_PROVIDED',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey:
                this.authDataObj &&
                this.authDataObj.selectedAprover &&
                this.authDataObj.aproveNote
                  ? this.authDataObj.aproveNote
                  : 'LBL_NOT_PROVIDED',
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
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
  }

  initiateAnotherRequest() {
    this.rootScopeData.showtransaction = true;
    this.rootScopeData.showMerchantDetail = false;
    this.router.navigate(['/pos/posTransactions']);
  }

  getOtpValue(otp: string): void {
    if (otp) {
      if (otp.length === 4) this.otpError = '';
      this.userOtpValue = otp;
      this.submit();
    } else {
      this.userOtpValue = '';
    }
  }
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }
  setAuthorizationData(authorDetails: any): void {
    this.authDataObj = authorDetails;
  }

  getDatas(event: any, filed: string) {
    switch (filed) {
      case 'authorization':
        this.authDataObj = event;
        break;
    }
  }

  getAuthorizationData() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.posService.getAuthorization().subscribe(
      (res: any) => {
        this.sefAuthFlag = res.data.selfAuth;
        if (res) {
          if (res.data.flexiAuth == 'true') {
            this.authOptions = res.data.authList;
          }
        }
      },
      (error) => {}
    );
  }
}
