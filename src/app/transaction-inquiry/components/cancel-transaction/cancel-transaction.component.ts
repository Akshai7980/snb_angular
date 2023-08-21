import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-cancel-transaction',
  templateUrl: './cancel-transaction.component.html',
  styleUrls: ['./cancel-transaction.component.scss'],
})
export class CancelTransactionComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferDetails: any;
  transferSummary: any;
  receiptData!: {
    msg1: string;
    msg2: string;
    referenceNumber: any;
    receiptDetails: {
      title: string;
      isTable: string;
      data: any;
      fieldDetails: any;
    }[];
    printButton: { buttonLabel: string; buttonIcon: string };
    saveButton: { buttonLabel: string; buttonIcon: string };
    initiateButton: { buttonLabel: string };
    finishButton: { buttonLabel: string; buttonPath: string };
  };
  fieldSet: any;
  total: any;
  authDataObj: any;
  amountDetailsObj: any;
  pmtType!: string;
  hideAll: boolean = false;
  isLoadingComplete: boolean = false;
  cancelReason: any;
  showError: boolean = false;
  reviewDate!: { transferDetails: any; transferSummary: any; reason: any };

  constructor(
    private location: Location,
    private transactionInquiry: TransactionInquiryService
  ) {}

  ngOnInit(): void {
    this.isLoadingComplete = true;
    this.transferSummary = this.rootScopeData.transactionInquiry.summary;
    this.setDetails(this.transferSummary);
  }

  back(): void {
    this.location.back();
  }

  doSomething(event: any) {
    if (event.target.value) {
      this.showError = false;
    }
    this.cancelReason = event.target.value;
  }

  setDetails(transfer: any): void {
    // check
    let params = {
      txnRefNo: transfer.ref_NO,
      productCode: transfer.product_CODE,
      subProductCode: transfer.payment_MODE,
      functionCode: transfer.function_ID,
      unit_ID: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.transactionInquiry.getSinglePaymentDetails(params).subscribe(
      (response: any) => {
        this.isLoadingComplete = false;
        if (response.data) {
          this.transferDetails = response.data;
          // console.log('transferDetails:', this.transferDetails);
        }
      },
      (error: any) => {
        this.isLoadingComplete = false;
      }
    );
  }

  cancelSubmit() {
    if (this.cancelReason) {
      this.hideAll = true;
      this.reviewDate = {
        transferDetails: this.transferDetails,
        transferSummary: this.transferSummary,
        reason: this.cancelReason,
      };
      // this.callCancelTransaction();
    } else {
      this.showError = true;
    }
  }

  callCancelTransaction() {
    const params = {
      transferDetails: this.transferDetails,
      transferSummary: this.transferSummary,
      reason: this.cancelReason,
    };
    // console.log('params:', params);
    this.transactionInquiry.cancelTransaction(params).subscribe(
      (res: any) => {
        // console.log('res:', res);
        if (res.dataValue.OD_STATUS_DESC === 'Success') {
          this.hideAll = true;
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  }
}
