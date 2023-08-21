import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advance-search-filter-efinance',
  templateUrl: './advance-search-filter-efinance.component.html',
  styleUrls: ['./advance-search-filter-efinance.component.scss'],
})
export class AdvanceSearchFilterEfinanceComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  isLoadingComplete: boolean = true;
  fromDateError = false;
  toDateError = false;
  fromLimit: any;
  clearFlag:boolean = false;
  toLimit:any;
  toDateValue: any;
  showDateErrorMessage: boolean = false;
  minDate:any
  maxDate = new Date();
  fromDateValue: any;
  productName: any;
  facilityID: any;
  availableLimitFrom: any;
  availableLimitTo: any;

  constructor() { }

  ngOnInit(): void {
  }

  stopAdvancedSearchClose(event: any): void {
    event.stopImmediatePropagation();
  }
  onClickClear(): void {
    this.productName = '';
    this.facilityID = '';
    this.fromLimit = '';
    this.toLimit = ''
    this.availableLimitFrom = "";
    this.availableLimitTo = "";
    this.fromDateError=false;
    this.toDateError=false;
    this.clearFlag = !this.clearFlag;
  }

  onClickApply(): void {
    const params = {
      ProductName : this.productName,
      facilityId : this.facilityID,
      fromLimit : this.fromLimit,
      toLimit : this.toLimit,
      fromAmount: this.availableLimitFrom,
      toAmount: this.availableLimitTo
    };
    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
  }
  
  // getFromDate(event:any){
  //   this.fromDate = "" + (event.getDate()>9?event.getDate():"0"+event.getDate())+ "/" + (event.getMonth() + 1>9?event.getMonth() + 1:"0"+(event.getMonth() + 1)) + "/" + event.getFullYear();
  //   if(!(this.toDateValue && this.toDateValue.getTime()>=event.getTime())){
  //     this.fromDateValue = event
  //   }
  //   this.fromDateError=false;
  //   this.getCheck()
  // }
  // getToDate(event:any){
  //   this.toDate = "" + (event.getDate()>9?event.getDate():"0"+event.getDate()) + "/" + (event.getMonth() + 1>9?event.getMonth() + 1:"0"+(event.getMonth() + 1)) + "/" + event.getFullYear();
  //   this.toDateValue = event
  //   this.toDateError=false
  //   this.getCheck()
  // }
  // getCheck(){
  //   if(this.toDateValue && this.fromDateValue){
  //     if(this.toDateValue.getTime()<this.fromDateValue.getTime()){
  //      this.toDate="";
  //      this.toDateValue=null
  //     }
  //   }
  // }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }

  allowNumbersOnly(e: any) {
    var theEvent = e || window.event;
    var code = e.which ? e.which : e.keyCode;
    code = String.fromCharCode(code);
    if (code.length == 0) return;
    var regex = /^[0-9.,\b]+$/;
    if (!regex.test(code)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
  }
}
}


