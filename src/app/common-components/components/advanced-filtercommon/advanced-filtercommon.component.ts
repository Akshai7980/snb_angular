import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filtercommon',
  templateUrl: './advanced-filtercommon.component.html',
  styleUrls: ['./advanced-filtercommon.component.scss']
})
export class AdvancedFiltercommonComponent implements OnInit {
  period='currentDay';
  leftToggle=true;
  rightToggle=false;
  fromDate: any;
  clearFlag:boolean = false;
  isHideDownloadCnter = false;
  toDate:any;
  fromDateError = false;
  toDateError = false;
  @Input() showAdvancedSearchPopup:any;

  @Output() advancedSearchParams =new EventEmitter();
  showDateErrorMessage: boolean = false;
  minDate:any
  maxDate = new Date();
  fromDateValue: any;
  toDateValue: any;
  newToDate:any
  constructor() { }

  ngOnInit(): void {
  }

 
  stopAdvancedSearchClose(event:any){
    event.stopImmediatePropagation();
  }
  onClickApply(){
    this.getCheck();
    let params;
    if(this.leftToggle){
      if(this.fromDate && this.toDate){
        params = 
        {
          period : "",
          fromDate : this.fromDate,
          toDate : this.toDate
        }
        this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;
        this.showDateErrorMessage = false;
        // this.period='currentDay';
        this.leftToggle=true;
        this.rightToggle=false;
        // this.fromDate = "";
        // this.fromDateValue=null
        // this.toDateValue=null
        // this.toDate = "";
        this.clearFlag = false;
      }else{
        this.fromDateError = this.fromDateValue  ? false : true;
        this.toDateError = this.toDateValue ? false : true;
      }
     
    }else if(this.rightToggle){
      if(this.period){
        params = 
      {
        period : this.period,
        fromDate : "",
        toDate : ""
      }
      this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;
        this.showDateErrorMessage = false;
        // this.period='currentDay';
        this.leftToggle=false;
        this.rightToggle=true;
        // this.fromDate = "";
        // this.toDate = "";
        this.clearFlag = false;
      }
    }
  }
  
  onClickClear(){
    this.period='currentDay';
    this.leftToggle=true;
    this.rightToggle=false;
    this.clearFlag = !this.clearFlag;
    this.fromDateError=false;
    this.toDateError=false;
    this.fromDate=""
    this.toDate=""
    this.fromDate=""
    this.toDate=""
    this.fromDateValue=""
    this.toDateValue=""
  }
  
  getFromDate(event:any){
    this.fromDate = "" + (event.getDate()>9?event.getDate():"0"+event.getDate())+ "/" + (event.getMonth() + 1>9?event.getMonth() + 1:"0"+(event.getMonth() + 1)) + "/" + event.getFullYear();
    // if(!(this.toDateValue && this.toDateValue.getTime()>=event.getTime())){
    //   this.fromDateValue = event
    // }
    this.fromDateValue = event      
    this.toDate ='';
    this.toDateValue = '';
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
