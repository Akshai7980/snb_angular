import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-pos-multi-claim-request-review',
  templateUrl: './pos-multi-claim-request-review.component.html',
  styleUrls: ['./pos-multi-claim-request-review.component.scss'],
})
export class PosMultiClaimRequestReviewComponent implements OnInit {
  url: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  showReceipt: boolean = false;
  receiptData: any;
  otpError: string = '';
  userOtpValue: any;
  secAuthRef: string = '';
  fileUploadedDetails: any;
  recordSummaryObject: any = {};
  sortOptions: any = {
    sortColumn: 'transactionRef',
    sortOrder: 'desc',
    fromRow: 1,
    toRow: 6,
  };
  shwRec: boolean = false;
  pageName: boolean = true;
  moduleId: string = 'MULCLMRCRDSUMMY';

  totalRecords: any;
  constructor(private router: Router, public posService: PosService) {}

  ngOnInit(): void {
    console.log(
      this.rootScopeData.posTransactionRefundRequestDetail,
      'posTransactionRefundRequestDetail'
    );
    this.getRecordSummaryData();
    if (
      this.rootScopeData.posMultiClaimRequestMerchantDetail === '' ||
      this.rootScopeData.posMultiClaimRequestMerchantDetail.length === 0
    ) {
      this.rootScopeData.showtransaction = true;
      this.rootScopeData.showMerchantDetail = false;
      this.router.navigate(['/pos/posMultiClaimRequest']);
    }
    this.fileUploadedDetails = {
      fileName: this.rootScopeData.posTransactionRefundRequestDetail.fileName,
      fileActualName:
        this.rootScopeData.posTransactionRefundRequestDetail.actualFileName,
      moduleId: 'POSMULCLMACCLKUP',
    };
  }

  onSortColumn(event: any) {
    this.getRecordSummaryData();
  }

  getRecordSummaryData() {
    const params = {};

    this.posService.getRecordSummary(params).subscribe(
      (res: any) => {
        if (res && res.data && res.data.length > 0) {
          console.log(res.data, 'res.data');
          this.shwRec = true;
          this.totalRecords = res.headerValue.totalCount;
          this.sortOptions = res.headerValue;

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

          console.log(this.recordSummaryObject, 'this.recordSummaryObject ');
        }
      },
      (error: any) => {}
    );
  }

  returnToAccount(event: any) {
    if (event) {
      this.rootScopeData.showtransaction = true;
      this.rootScopeData.showMerchantDetail = false;
      this.router.navigate(['/pos/posMultiClaimRequest']);
    }
  }

  returnToTransaction(event: any) {
    if (event) {
      this.rootScopeData.showtransaction = false;
      this.rootScopeData.showMerchantDetail = true;
      this.router.navigate(['/pos/posMultiClaimRequest']);
    }
  }

  submit() {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    this.showReceipt = true;
    this.constructReceiptData('9987462132012345');
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
              dataKey: this.rootScopeData.posSelectedTransaction.termID,
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.rootScopeData.posSelectedTransaction.cardNumber,
            },
            {
              dispKey: 'LBL_DATE',
              dataKey: this.rootScopeData.posSelectedTransaction.Date,
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
                  .financialType.value,
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
              dataKey: this.rootScopeData.posSelectedTransaction.amountinSAR,
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
              dataKey: 'ANY',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: 'Not Provided',
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
  setSecondFactorValue(secondFactorValue: any): void {
    this.secAuthRef = secondFactorValue.data.secfRefNo;
  }
}
