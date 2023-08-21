import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { mobileNumberValidation } from 'src/app/utility/common-utility';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fee-debit-inquiry',
  templateUrl: './fee-debit-inquiry.component.html',
  styleUrls: ['./fee-debit-inquiry.component.scss'],
})
export class FeeDebitInquiryComponent implements OnInit {
  clearFlag: boolean = false;
  showDateErrorMessage: boolean = false;
  dateFrom: any;
  maxDate: any;
  minDate: any;
  mobileNumber: any;
  description: any;
  currentDay: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private router: Router,
    private location: Location,
    private readonly datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (
      this.rootScopeData.posTransactionMerchantDetail === '' ||
      this.rootScopeData.posTransactionMerchantDetail.length === 0
    ) {
      this.rootScopeData.showtransaction = true;
      this.rootScopeData.showMerchantDetail = false;
      this.router.navigate(['/pos/posTransactions']);
    }
    this.minDate = this.addMonths(new Date(), -6);

    this.maxDate = new Date();
  }

  addMonths(date: any, month: any) {
    date.setMonth(date.getMonth() + month);
    return date;
  }
  getFromDate(event: any) {
    this.dateFrom = this.datePipe.transform(event, 'dd/MM/yyyy');
  }
  proceedButton(event: any) {
    if (event) {
      const data = {
        mobileNumber: this.mobileNumber,
        description: this.description,
        dateFrom: this.dateFrom,
      };

      this.rootScopeData.posTransactionFeeDebitInquiryDetail = data;
      this.router.navigate(['/pos/feeDebitInquiryReview']);
    }
  }
  allowNumbersOnly(e: any) {
    return mobileNumberValidation(e);
  }

  cancelButton(event: any) {
    if (event) {
      this.mobileNumber = '';
      this.description = '';
      this.dateFrom = '';
      this.clearFlag = true;
    }
  }

  returntoTransaction() {
    this.mobileNumber = '';
    this.description = '';
    this.dateFrom = '';

    this.location.back();
  }

  cancelMerchantDetail() {
    this.rootScopeData.showtransaction = true;
    this.rootScopeData.showMerchantDetail = false;
    this.location.back();
  }
}
