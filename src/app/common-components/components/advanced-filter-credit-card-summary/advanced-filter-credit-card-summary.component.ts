import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-advanced-filter-credit-card-summary',
  templateUrl: './advanced-filter-credit-card-summary.component.html',
  styleUrls: ['./advanced-filter-credit-card-summary.component.scss'],
})
export class AdvancedFilterCreditCardSummaryComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  @Input() statuses?: any;
  @Input() transactionTypes?: any;

  rootScopeData: RootScopeDeclare = RootScopeData;

  clearFlag: boolean = false;
  showDateErrorMessage: boolean = false;

  dateFrom: any;
  dateTo: any;
  maxDate: any;
  minDate: any;
  fromDateValue: any;
  amountFrom: string = '';
  amountTo: string = '';
  transactionType: any = '';
  selectedStatus: any = '';

  // transaction = [
  //   { viewValue: 'All' },
  //   { viewValue: 'ARAMCO Invoice Payments' },
  //   { viewValue: 'Activate Merchant' },
  //   { viewValue: 'Account Activation' },
  //   { viewValue: 'Add Ecommerce Merchant' },
  // ];
  // status = [
  //   { viewValue: 'All' },
  //   { viewValue: 'Discard' },
  //   { viewValue: 'Pending' },
  // ];

  constructor() {}

  ngOnInit(): void {}

  stopAdvancedSearchClose(event: any) {
    event.stopImmediatePropagation();
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getFromDate(event: any) {
    this.dateFrom = event;
  }

  getToDate(event: any) {
    this.dateTo = event;
  }

  onClickClear() {
    this.amountFrom = '';
    this.amountTo = '';
    this.transactionType = '';
    this.selectedStatus = '';
    this.dateFrom='';
    this.dateTo='';
    this.clearFlag = !this.clearFlag;
  }

  onClickApply() {
    if (!this.dateFrom || !this.dateTo) {
      this.showDateErrorMessage = true;
      return;
    }

    const params = {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      amountFrom: this.amountFrom,
      amountTo: this.amountTo,
      transactionType: this.transactionType,
      selectedStatus: this.selectedStatus,
    };
    this.advancedSearchParams.emit(params);
    this.clearFlag = false;
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
 
}
