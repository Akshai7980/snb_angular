import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
@Component({
  selector: 'app-advanced-filter-e-pay-summary-list',
  templateUrl: './advanced-filter-e-pay-summary-list.component.html',
  styleUrls: ['./advanced-filter-e-pay-summary-list.component.scss']
})
export class AdvancedFilterEPaySummaryLisComponent implements OnInit {

  @Input() showAdvancedSearchPopup: any;
  @Input() requestTypes?: any;
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
  fromDateValue: any;
  dateFromErrorMessage: boolean = false;
  dateToErrorMessage: boolean = false;
  requestErrorMessage: boolean = false;
  dateErrorMessage: boolean = false;
  requestType: any;
  periodErrorMessage: boolean = false;
  periodModel: any;
  period = [
    'All',
    'Monthly',
    'Quarterly',
    'Yearly'
  ];

  constructor() {}

  ngOnInit(): void {}

  stopAdvancedSearchClose(event: any) {
    event.stopImmediatePropagation();
  }

  leftToggleCntl() {
    // if ((this.leftToggle = true)) {
      document.getElementById('rightToggle')?.classList.remove('active');

      document.getElementById('leftToggle')?.classList.add('active');
      this.leftToggle = true;
    this.rightToggle = false;
      // this.onClickClear();
    // }
  }

  rightToggleCntl() {
    // if ((this.rightToggle = true)) {
      document.getElementById('leftToggle')?.classList.remove('active');

      document.getElementById('rightToggle')?.classList.add('active');
      this.leftToggle = false;
    this.rightToggle = true;
      // this.onClickClear();
    // }
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
        this.dateFrom &&
        this.dateTo &&
        this.requestType
      ) {
        params = {
          requestType: this.requestType ? this.requestType : '',
          dateFrom: this.dateFrom ? this.dateFrom : '',
          dateTo: this.dateTo ? this.dateTo : '',
        };
        this.advancedSearchParams.emit(params);
        this.closeFilter(null);
        this.clearFlag = false;
      } else {
        this.requestErrorMessage = this.requestType ? false : true;
        this.showDateErrorMessage = true;
      }
    } else {
      if (
        this.periodModel &&
        this.requestType
      ) {
        params = {
          period: this.periodModel ? this.periodModel : '',
          requestType: this.requestType ? this.requestType : '',
        };
        this.advancedSearchParams.emit(params);
        this.closeFilter(null);
        this.clearFlag = false;
      } else {
        this.requestErrorMessage = this.requestType ? false : true;
        this.periodErrorMessage = this.periodModel ? false : true;
        this.showDateErrorMessage = true;
      }
    }
  }

  onClickClear() {
      (this.requestType = ''),
      (this.periodModel = ''),
      (this.dateFrom = ''),
      (this.dateTo = ''),
    this.requestErrorMessage = false;
    this.dateErrorMessage = false;
    this.periodErrorMessage = false;
    this.showDateErrorMessage = false;
    this.showAdvancedSearchPopup = false;
  }

  closeFilter(event: any) {
    this.showAdvancedSearchPopup = false;
  }
}
