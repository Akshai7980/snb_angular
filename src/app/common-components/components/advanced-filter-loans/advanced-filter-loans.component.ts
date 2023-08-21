import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-loans',
  templateUrl: './advanced-filter-loans.component.html',
  styleUrls: ['./advanced-filter-loans.component.scss']
})
export class AdvancedFilterLoansComponent implements OnInit {
period='currentDay';
leftToggle=true;
rightToggle=false;
fromDate: any;
clearFlag:boolean = false;
toDate:any;
@Input() showAdvancedSearchPopup:any;
@Output() advancedSearchParams =new EventEmitter();
showDateErrorMessage: boolean = false;
toDateValue: any;
fromDateValue: any;
maxDate=new Date();
minDate : any;
constructor() { }

ngOnInit(): void {
}
leftToggleCntl(){
  if(this.leftToggle=true){
    document.getElementById('leftToggle')?.classList.add('active');
    document.getElementById('rightToggle')?.classList.remove('active');
    this.rightToggle = false;
  }
}
rightToggleCntl(){
  if(this.rightToggle=true){
    document.getElementById('rightToggle')?.classList.add('active');
    document.getElementById('leftToggle')?.classList.remove('active');
    this.leftToggle=false;
  }
}
stopAdvancedSearchClose(event:any){
  event.stopImmediatePropagation();
}
onClickApply(){
  let params;
  if(this.leftToggle){
    if(this.fromDate && this.toDate){
      params = 
      {
        period : "Custom Dates",
        fromDate : this.fromDate,
        toDate : this.toDate
      }
      this.advancedSearchParams.emit(params);
      this.showAdvancedSearchPopup = false;
      this.showDateErrorMessage = false;
      // this.period='currentDay';
      this.leftToggle=true;
      this.rightToggle=false;
      this.fromDate = this.fromDateValue;
      this.toDate = this.toDateValue;
      this.leftToggleCntl();
      this.clearFlag = false;
      // this.clearFlag = !this.clearFlag;
    }else{
      this.showDateErrorMessage = true;
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
      // this.leftToggleCntl();
      this.rightToggleCntl();
      this.clearFlag = false;
      // this.clearFlag = !this.clearFlag;
    }
  }
}

onClickClear(){
  this.period='currentDay';
  this.leftToggle=true;
  this.rightToggle=false;
  this.fromDateValue='';
    this.toDateValue='';
  this.leftToggleCntl();
  this.clearFlag = !this.clearFlag;
}

getFromDate(event:any){
  // this.fromDate = "" + event.getDate().toString().padStart(2, "0") + "/" + (event.getMonth() + 1).toString().padStart(2, "0") + "/" + event.getFullYear();
  this.fromDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
      // if(!(this.toDateValue && this.toDateValue.getTime()>=event.getTime())){
      //   this.fromDateValue = event
      // }
      this.fromDateValue = event      
      this.toDate ='';
      this.toDateValue = '';
}
getToDate(event:any){
  // this.toDate = "" + event.getDate().toString().padStart(2, "0") + "/" + (event.getMonth() + 1).toString().padStart(2, "0") + "/" + event.getFullYear();
  this.toDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
      this.toDateValue = event
}
  
closeFilter(event:any){
  this.showAdvancedSearchPopup = false; 
}

}
