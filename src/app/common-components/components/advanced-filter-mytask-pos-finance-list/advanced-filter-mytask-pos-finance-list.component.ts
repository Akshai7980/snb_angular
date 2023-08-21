import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-mytask-pos-finance-list',
  templateUrl: './advanced-filter-mytask-pos-finance-list.component.html',
  styleUrls: ['./advanced-filter-mytask-pos-finance-list.component.scss'],
})
export class AdvancedFilterMytaskPosFinanceListComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  isLoadingComplete: boolean = true;
  fromDateError = false;
  toDateError = false;
  fromDate: any;
  clearFlag: boolean = false;
  toDate: any;
  toDateValue: any;
  showDateErrorMessage: boolean = false;
  minDate: any;
  maxDate = new Date();
  fromDateValue: any;
  reqId: any;
  crNo: any;
  amountFrom: any;
  amountTo: any;

  constructor() {}

  ngOnInit(): void {}

  stopAdvancedSearchClose(event: any): void {
    event.stopImmediatePropagation();
  }
  onClickClear(): void {
    this.reqId = '';
    this.crNo = '';
    this.fromDate = '';
    this.toDate = '';
    this.amountFrom = '';
    this.amountTo = '';
    this.fromDateValue='';
    this.toDateValue='';
    this.fromDateError = false;
    this.toDateError = false;
    this.clearFlag = !this.clearFlag;
  }

  onClickApply(): void {
    const params = {
      reqId: this.reqId,
      crNo: this.crNo,
      fromDate: this.fromDate,
      toDate: this.toDate,
      fromAmount: this.amountFrom,
      toAmount: this.amountTo,
    };

    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
    this.clearFlag = false;
  }

  getFromDate(event: any) {
    this.fromDate =
      '' +
      (event.getDate() > 9 ? event.getDate() : '0' + event.getDate()) +
      '/' +
      (event.getMonth() + 1 > 9
        ? event.getMonth() + 1
        : '0' + (event.getMonth() + 1)) +
      '/' +
      event.getFullYear();
    if (!(this.toDateValue && this.toDateValue.getTime() >= event.getTime())) {
      this.fromDateValue = event;
    }
    this.fromDateError = false;
    this.getCheck();
  }
  getToDate(event: any) {
    this.toDate =
      '' +
      (event.getDate() > 9 ? event.getDate() : '0' + event.getDate()) +
      '/' +
      (event.getMonth() + 1 > 9
        ? event.getMonth() + 1
        : '0' + (event.getMonth() + 1)) +
      '/' +
      event.getFullYear();
    this.toDateValue = event;
    this.toDateError = false;
    this.getCheck();
  }
  getCheck() {
    if (this.toDateValue && this.fromDateValue) {
      if (this.toDateValue.getTime() < this.fromDateValue.getTime()) {
        this.toDate = '';
        this.toDateValue = null;
      }
    }
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
