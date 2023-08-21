import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-service-inquiry',
  templateUrl: './advanced-filter-service-inquiry.component.html',
  styleUrls: ['./advanced-filter-service-inquiry.component.scss']
})
export class AdvancedFilterServiceInquiryComponent implements OnInit {
  dateTime = "desc";
  period = 'all';
  leftToggle = true;
  rightToggle = false;
  fromDate: any;
  clearFlag: boolean = false;
  toDate: any;
  @Input() serviceTypes: any;
  @Input() cardTypes: any;
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  showDateErrorMessage: boolean = false;
  fromDateValue: any;
  toDateValue: any;
  serviceType: any = 'all';
  cardType: any = 'all';

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
      period: this.leftToggle ? "" : this.period,
      sortOrder: this.dateTime,
      fromDate: this.leftToggle ? this.fromDate : "",
      toDate: this.leftToggle ? this.toDate : "",
      type: this.leftToggle ? "Date" : "Period",
      serviceType: this.serviceType,
      cardType: this.cardType
    }
    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
    this.showDateErrorMessage = false;
    this.clearFlag = false;
    // this.period = 'all';
    // this.fromDate = "";
    // this.toDate = "";
    // this.serviceType = 'all';
    // this.cardType = 'all';
    // this.leftToggleCntl();
    // this.clearFlag = !this.clearFlag;
  }

  onClickClear() {
    this.dateTime = "desc";
    this.period = 'all';
    this.leftToggle = true;
    this.rightToggle = false;
    this.clearFlag = !this.clearFlag;
    this.serviceType = 'all';
    this.cardType = 'all';
    this.leftToggleCntl();
    this.fromDateValue='';
    this.toDateValue='';
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
