import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-cards-inquiry-credit',
  templateUrl: './advanced-filter-cards-inquiry-credit.component.html',
  styleUrls: ['./advanced-filter-cards-inquiry-credit.component.scss']
})
export class AdvancedFilterCardsInquiryCreditComponent implements OnInit {

  searchWithin = "all";
  dateTime = "desc";
  period = 'all';
  processingTime = "processingDate";
  resultsPerPage = "100";
  leftToggle = true;
  rightToggle = false;
  fromDate: any;
  clearFlag: boolean = false;
  toDate: any;
  amountFrom: any;
  amountTo: any;
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  showDateErrorMessage: boolean = false;
  fromDateValue: any;
  toDateValue: any;
  
  constructor() { }

  ngOnInit(): void {
  }

  leftToggleCntl() {
    document.getElementById('leftToggle')?.classList.add('active');
    document.getElementById('rightToggle')?.classList.remove('active');
    this.leftToggle = true;
    this.rightToggle = false;
  }

  rightToggleCntl() {
    document.getElementById('rightToggle')?.classList.add('active');
    document.getElementById('leftToggle')?.classList.remove('active');
    this.rightToggle = true;
    this.leftToggle = false;
  }

  stopAdvancedSearchClose(event: any) {
    event.stopImmediatePropagation();
  }

  onClickApply() {
    if (this.leftToggle && (!this.fromDate || !this.toDate)) {
      this.showDateErrorMessage = true;
      return;
    }
    const params = {
      processingTime: this.processingTime,
      period: this.leftToggle ? "" : this.period,
      sortOrder: this.dateTime,
      searchwithin: this.searchWithin,
      fromDate: this.leftToggle ? this.fromDate : "",
      toDate: this.leftToggle ? this.toDate : "",
      fromAmount: this.amountFrom,
      toAmount: this.amountTo,
      resultsPerPage: this.resultsPerPage,
      type: this.leftToggle ? "Date" : "Period"
    }
    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
    this.showDateErrorMessage = false;
    // this.period = 'all';
    // this.fromDate = "";
    // this.toDate = "";
    this.leftToggleCntl();
    this.clearFlag = false;
    // this.clearFlag = !this.clearFlag;
  }

  onClickClear() {
    this.searchWithin = "all";
    this.dateTime = "desc";
    this.period = 'all';
    this.resultsPerPage = "100";
    this.amountFrom = "";
    this.amountTo = "";
    this.fromDateValue='';
    this.toDateValue='';
    this.leftToggle = true;
    this.rightToggle = false;
    this.clearFlag = !this.clearFlag;
    
    this.leftToggleCntl();
  }

  getFromDate(event: any) {
    this.fromDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
    if (!(this.toDateValue && this.toDateValue.getTime() >= event.getTime())) {
      this.fromDateValue = event
    }
  }

  getToDate(event: any) {
    this.toDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
    this.toDateValue = event
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }

}
