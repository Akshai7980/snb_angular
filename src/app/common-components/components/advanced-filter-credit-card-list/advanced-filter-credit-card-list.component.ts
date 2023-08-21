import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-credit-card-list',
  templateUrl: './advanced-filter-credit-card-list.component.html',
  styleUrls: ['./advanced-filter-credit-card-list.component.scss']
})
export class AdvancedFilterCreditCardListComponent implements OnInit {

  dateTime = "desc";
  period = 'all';
  leftToggle = true;
  rightToggle = false;
  fromDate: any;
  clearFlag: boolean = false;
  toDate: any;
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  showDateErrorMessage: boolean = false;
  fromDateValue: any;
  toDateValue: any;
  serviceType: any = 'all';

  constructor() { }

  ngOnInit(): void { }

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
    if (this.leftToggle === false) {
      let date = new Date();
      let startDate;
      let endDate;
      if (this.period === 'all') {
        this.fromDate = '';
        this.toDate = '';
      }
      if (this.period === 'monthly') {
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.fromDate =
          '' +
          startDate.getDate() +
          '/' +
          (startDate.getMonth() + 1) +
          '/' +
          startDate.getFullYear();
        this.toDate =
          '' +
          endDate.getDate() +
          '/' +
          (endDate.getMonth() + 1) +
          '/' +
          endDate.getFullYear();
      }
      if (this.period === 'quarterly') {
        startDate = new Date(
          date.getFullYear(),
          date.getMonth() - 3,
          date.getDate()
        );
        endDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0
        );
        this.fromDate =
          '' +
          startDate.getDate() +
          '/' +
          (startDate.getMonth() + 1) +
          '/' +
          startDate.getFullYear();
        this.toDate =
          '' +
          endDate.getDate() +
          '/' +
          (endDate.getMonth() + 1) +
          '/' +
          endDate.getFullYear();
      }
      if (this.period === 'yearly') {
        startDate = new Date(
          date.getFullYear() - 1,
          date.getMonth(),
          date.getDate()
        );
        endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.fromDate =
          '' +
          startDate.getDate() +
          '/' +
          (startDate.getMonth() + 1) +
          '/' +
          startDate.getFullYear();
        this.toDate =
          '' +
          endDate.getDate() +
          '/' +
          (endDate.getMonth() + 1) +
          '/' +
          endDate.getFullYear();
      }
    }
    const params = {
      period: this.leftToggle ? "" : this.period,
      sortOrder: this.dateTime,
      fromDate: this.leftToggle ? this.fromDate : "",
      toDate: this.leftToggle ? this.toDate : "",
      type: this.leftToggle ? "Date" : "Period",
      serviceType: this.serviceType
    }
    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
    this.showDateErrorMessage = false;
    // this.period = 'all';
    // this.fromDate = "";
    // this.toDate = "";
      // this.leftToggleCntl();
      this.clearFlag = false;
    // this.clearFlag = !this.clearFlag;
  }

  onClickClear() {
    this.dateTime = "desc";
    this.period = 'all';
    this.serviceType = 'all';
    this.leftToggle = true;
    this.rightToggle = false;
    this.clearFlag = !this.clearFlag;
    this.fromDateValue='';
    this.toDateValue='';
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
