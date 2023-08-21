import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-advance-filter-pos-service-request',
  templateUrl: './advance-filter-pos-service-request.component.html',
  styleUrls: ['./advance-filter-pos-service-request.component.scss'],
})
export class AdvanceFilterPosServiceRequestComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Output() advancedSearchParams = new EventEmitter();
  leftToggle = true;
  rightToggle = false;
  clearFlag: boolean = false;
  showDateErrorMessage: boolean = false;
  dateFrom: any;
  dateTo: any;
  maxDate: any;
  minDate: any;
  processingtime: any;
  processingTimeErrorMessage: boolean = false;
  amount: any;
  amountTo: any;
  AmountErrorMessage: boolean = false;
  ToAmountErrorMessage: boolean = false;
  resultPage: any;
  resultPageErrorMessage: boolean = false;
  searchwithin: any;
  searchWithinErrorMessage: boolean = false;
  fromDateValue: any;
  dateFromErrorMessage: boolean = false;
  dateToErrorMessage: boolean = false;
  transactionErrorMessage: boolean = false;
  dateErrorMessage: boolean = false;
  transactionType: any;
  periodErrorMessage: boolean = false;
  periodModel: any;
  datesort: any;
  processingTime = [
    { viewValue: ' Processing Date' },
    { viewValue: 'Discard' },
    { viewValue: 'Pending' },
    { viewValue: 'Authorized' },
    { viewValue: 'Reject' },
  ];
  resultPerPage = [
    { viewValue: '100' },
    { viewValue: '150' },
    { viewValue: '200' },
    { viewValue: '250' },
    { viewValue: '300' },
  ];
  searchWithin = [
    { viewValue: 'All' },
    { viewValue: 'Debit' },
    { viewValue: 'Credit' },
  ];
  period = [
    { viewValue: 'All' },
    { viewValue: 'Monthly' },
    { viewValue: 'Quarterly' },
    { viewValue: 'Yearly' },
  ];
  transcationType = [
    { viewValue: 'All' },
    { viewValue: 'ARAMCO Invoice Payments' },
    { viewValue: 'Activate Merchant' },
    { viewValue: 'Account Activation' },
    { viewValue: 'Add Ecommerce Merchant' },
  ];
  dateSort = [{ viewValue: ' Ascending' }, { viewValue: 'Descending ' }];
  constructor() {}

  ngOnInit(): void {}

  stopAdvancedSearchClose(event: any) {
    event.stopImmediatePropagation();
  }

  toggleControl(toggleType: string) {
    if (toggleType === 'rightToggle') {
      this.rightToggle = true;
      this.leftToggle = false;

      document.getElementById('leftToggle')?.classList.remove('active');
      document.getElementById('rightToggle')?.classList.add('active');
    } else {
      this.rightToggle = false;
      this.leftToggle = true;

      document.getElementById('rightToggle')?.classList.remove('active');
      document.getElementById('leftToggle')?.classList.add('active');
    }
  }

  getFromDate(event: any) {
    this.dateFrom = event;
  }

  getToDate(event: any) {
    this.dateTo = event;
  }

  onClickApply() {
    let params;
    if (this.leftToggle && !this.rightToggle) {
      if (
        this.processingtime &&
        this.amount &&
        this.amountTo &&
        this.resultPage &&
        this.dateFrom &&
        this.dateTo &&
        this.searchwithin &&
        this.transactionType &&
        this.datesort
      ) {
        params = {
          processing: this.processingtime ? this.processingtime : '',
          amount: this.amount ? this.amount : '',
          amountto: this.amountTo ? this.amountTo : '',
          result: this.resultPage ? this.resultPage : '',
          search: this.searchwithin ? this.searchwithin : '',
          transaction: this.transactionType ? this.transactionType : '',
          datesort: this.datesort ? this.datesort : '',
          dateFrom: this.dateFrom ? this.dateFrom : '',
          dateTo: this.dateTo ? this.dateTo : '',
        };
        this.advancedSearchParams.emit(params);
        this.clearFlag = false;
      } else {
        this.processingTimeErrorMessage = this.processingtime ? false : true;
        this.AmountErrorMessage = this.amount ? false : true;
        this.ToAmountErrorMessage = this.amountTo ? false : true;
        this.resultPageErrorMessage = this.resultPage ? false : true;
        this.searchWithinErrorMessage = this.searchwithin ? false : true;
        this.transactionErrorMessage = this.transactionType ? false : true;
        this.dateErrorMessage = this.datesort ? false : true;
        this.showDateErrorMessage = true;
      }
    } else {
      if (
        this.processingtime &&
        this.amount &&
        this.amountTo &&
        this.resultPage &&
        this.searchwithin &&
        this.periodModel &&
        this.transactionType &&
        this.datesort
      ) {
        params = {
          processing: this.processingtime ? this.processingtime : '',
          amount: this.amount ? this.amount : '',
          amountto: this.amountTo ? this.amountTo : '',
          result: this.resultPage ? this.resultPage : '',
          search: this.searchwithin ? this.searchwithin : '',
          period: this.periodModel ? this.periodModel : '',
          transaction: this.transactionType ? this.transactionType : '',
          datesort: this.datesort ? this.datesort : '',
        };
        this.advancedSearchParams.emit(params);
        this.clearFlag = false;
      } else {
        this.processingTimeErrorMessage = this.processingtime ? false : true;
        this.AmountErrorMessage = this.amount ? false : true;
        this.ToAmountErrorMessage = this.amountTo ? false : true;
        this.resultPageErrorMessage = this.resultPage ? false : true;
        this.searchWithinErrorMessage = this.searchwithin ? false : true;
        this.transactionErrorMessage = this.transactionType ? false : true;
        this.dateErrorMessage = this.datesort ? false : true;
        this.periodErrorMessage = this.periodModel ? false : true;
        this.showDateErrorMessage = true;
      }
    }
  }

  onClickClear() {
    (this.processingtime = ''),
      (this.amount = ''),
      (this.amountTo = ''),
      (this.resultPage = ''),
      (this.searchwithin = ''),
      (this.transactionType = ''),
      (this.datesort = ''),
      (this.periodModel = ''),
      (this.dateFrom = ''),
      (this.dateTo = ''),
      (this.processingTimeErrorMessage = false);
    this.AmountErrorMessage = false;
    this.ToAmountErrorMessage = false;
    this.resultPageErrorMessage = false;
    this.searchWithinErrorMessage = false;
    this.transactionErrorMessage = false;
    this.dateErrorMessage = false;
    this.periodErrorMessage = false;
    this.showDateErrorMessage = false;
    this.showAdvancedSearchPopup = false;
  }

  closeFilter(event: any) {
    this.showAdvancedSearchPopup = false;
  }
}
