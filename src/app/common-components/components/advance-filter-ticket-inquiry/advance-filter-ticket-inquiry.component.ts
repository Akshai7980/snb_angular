import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advance-filter-ticket-inquiry',
  templateUrl: './advance-filter-ticket-inquiry.component.html',
  styleUrls: ['./advance-filter-ticket-inquiry.component.scss']
})
export class AdvanceFilterTicketInquiryComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  isLoadingComplete: boolean = true;
  serviceType: string = '';
  requestStatus : string = '';
  fromDateError = false;
  toDateError = false;
  fromDate: any;
  clearFlag:boolean = false;
  isHideDownloadCnter = false;
  toDate:any;
  toDateValue: any;
  showDateErrorMessage: boolean = false;
  minDate:any
  maxDate = new Date();
  fromDateValue: any;
  constructor() { }

  ngOnInit(): void {
  }

  stopAdvancedSearchClose(event: any): void {
    event.stopImmediatePropagation();
  }
  onClickClear(): void {
    this.serviceType = '';
    this.requestStatus = '';
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
      serviceType : this.serviceType,
      requestStatus : this.requestStatus,
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
