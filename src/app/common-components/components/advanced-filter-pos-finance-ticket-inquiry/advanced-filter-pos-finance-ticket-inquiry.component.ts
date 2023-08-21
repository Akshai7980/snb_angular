import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-pos-finance-ticket-inquiry',
  templateUrl: './advanced-filter-pos-finance-ticket-inquiry.component.html',
  styleUrls: ['./advanced-filter-pos-finance-ticket-inquiry.component.scss']
})
export class AdvancedFilterPosFinanceTicketInquiryComponent implements OnInit {

  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  isLoadingComplete: boolean = true;
  fromDateError = false;
  toDateError = false;
  fromDate: any;
  clearFlag:boolean = false;
  toDate:any;
  toDateValue: any;
  showDateErrorMessage: boolean = false;
  minDate:any
  maxDate = new Date();
  fromDateValue: any;
  reqStatus: any;
  serviceType: any;

  constructor() { }

  ngOnInit(): void {
  }

  stopAdvancedSearchClose(event: any): void {
    event.stopImmediatePropagation();
  }
  onClickClear(): void {
    this.reqStatus = '';
    this.serviceType = '';
    this.fromDate = '';
    this.toDate = ''
    this.fromDateError=false;
    this.toDateError=false;
    this.fromDateValue='';
    this.toDateValue='';
    this.clearFlag = !this.clearFlag;
  }

  onClickApply(): void {
    const params = {
      reqStatus : this.reqStatus,
      serviceType : this.serviceType,
      fromDate : this.fromDate,
      toDate : this.toDate
    };
    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
    this.clearFlag = false;
  }

  
  getFromDate(event:any){
    this.fromDate = "" + (event.getDate()>9?event.getDate():"0"+event.getDate())+ "/" + (event.getMonth() + 1>9?event.getMonth() + 1:"0"+(event.getMonth() + 1)) + "/" + event.getFullYear();
    if(!(this.toDateValue && this.toDateValue.getTime()>=event.getTime())){
      this.fromDateValue = event
    }
    this.fromDateError=false;
    this.getCheck()
  }
  getToDate(event:any){
    this.toDate = "" + (event.getDate()>9?event.getDate():"0"+event.getDate()) + "/" + (event.getMonth() + 1>9?event.getMonth() + 1:"0"+(event.getMonth() + 1)) + "/" + event.getFullYear();
    this.toDateValue = event
    this.toDateError=false
    this.getCheck()
  }
  getCheck(){
    if(this.toDateValue && this.fromDateValue){
      if(this.toDateValue.getTime()<this.fromDateValue.getTime()){
       this.toDate="";
       this.toDateValue=null
      }
    }
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
