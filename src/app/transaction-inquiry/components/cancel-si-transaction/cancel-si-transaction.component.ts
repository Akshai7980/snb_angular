import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-cancel-si-transaction',
  templateUrl: './cancel-si-transaction.component.html',
  styleUrls: ['./cancel-si-transaction.component.scss']
})
export class CancelSiTransactionComponent implements OnInit {
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
  debitDetails:any;
  reviewDate!: { transferDetails: any; transferSummary: any; reason: any };

  constructor( private location: Location,
    private transactionInquiry: TransactionInquiryService) { }

  ngOnInit(): void {
    this.isLoadingComplete = true;
    debugger;
    this.transferSummary =   this.rootScopeData.standingOrderDetails.summary;
    this.transferDetails =   this.rootScopeData.standingOrderDetails.details;
    this.debitDetails = this.rootScopeData.standingOrderDetails.paymentDetails;
    // this.setDetails(this.transferSummary);
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
    debugger;
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
      txnNo : this.rootScopeData.internationalSITransactionObject.siBookingRefNo,
      hostRefNo :this.rootScopeData.internationalSITransactionObject.siBookingRefNo,
      cifNo :this.rootScopeData.internationalSITransactionObject.cifNo 
      
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
