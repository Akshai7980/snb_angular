import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumberValidation_Omit_Char, omit_special_char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advance-filter-sadad-biller',
  templateUrl: './advance-filter-sadad-biller.component.html',
  styleUrls: ['./advance-filter-sadad-biller.component.scss']
})
export class AdvanceFilterSadadBillerComponent implements OnInit {
  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  @Input() sadadData:any;
  leftToggle=true;
  rightToggle=false;
  dateFrom:any;
  dateTo:any;
  transactionType:any;
  datetime:any;
  clearFlag:boolean = false;
  amount:any;
  to:any;
  fromDateValue:any;
  toDateValue:any
  refNo: any;
  statusType: any;
  showDateErrorMessage: boolean = false;
  showAmountErrorMessage: boolean = false;
  showUploadTypeErrorMessage:boolean = false;
  showStatusTypeErrorMessage:boolean = false;
  showDateOrderTypeErrorMessage:boolean = false;
  paymentType: any;
  fromDateErrorMessage:boolean = false; 
  toDateErrorMessage:boolean = false;
  maxFromDate = new Date();
  maxToDate = new Date();
  minFromDate :any;
  minToDate :any;
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
    if(this.dateFrom && this.dateTo){
      // this.showDateErrorMessage = false;
      this.fromDateErrorMessage=false;
      this.toDateErrorMessage=false;
    }else if(this.dateFrom || this.dateTo){
      // this.showDateErrorMessage = true;
      this.fromDateErrorMessage = this.dateFrom ? false : true;
      this.toDateErrorMessage = this.dateTo ? false : true;
    }
    if(!this.fromDateErrorMessage && !this.toDateErrorMessage){
      this.showAdvancedSearchPopup = false
    }else{
      this.showAdvancedSearchPopup= true
    }
    if((this.dateFrom && this.dateTo) ||  this.refNo || this.paymentType ){
      params={
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        amount: "",
        to: "",
        paymentType: this.paymentType,
        refNum: this.refNo,
        type: "Date"
      }
        this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;    
        this.leftToggle=true;
        this.rightToggle=false;
        this.leftToggleCntl();
        this.clearFlag = false;
    }
  }else if(this.rightToggle){
    if((this.amount && this.to) ||   this.refNo || this.paymentType ){
      params={
          amount: this.amount,
          to: this.to,
          dateFrom: "",
          dateTo: "",
          type: "Amount",
          paymentType: this.paymentType,
          refNum: this.refNo,
        }
        this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;
        this.showAmountErrorMessage = false;
            this.leftToggle=false;
            this.rightToggle=true;
            this.rightToggleCntl();
            this.clearFlag = false;
    }else{
      this.showAdvancedSearchPopup = false;
    }
  }
}
    
getFromDate(event:any){
  this.fromDateValue=event
  this.minToDate = this.fromDateValue
  this.dateFrom = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  // this.fromDateValue = event      
  // this.dateTo ='';
  // this.toDateValue = '';
}
getToDate(event:any){
  this.toDateValue=event
  this.dateTo = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  this.maxFromDate = this.toDateValue
}

onClickClear(){
  this.leftToggle=true;
  this.rightToggle=false;
  this.transactionType='';
  this.refNo='';
  this.paymentType='';
  this.refNo='';
  this.clearFlag = !this.clearFlag;
  this.fromDateValue='';
    this.toDateValue='';
    this.dateFrom='';
    this.dateTo ='';
  this.leftToggleCntl();
  this.fromDateErrorMessage=false;
  this.toDateErrorMessage=false;
  this.minFromDate='';
  this.minToDate='';
  this.maxFromDate = new Date();
  this.maxToDate = new Date();
}
closeFilter(event:any){
  this.showAdvancedSearchPopup = false; 
}

numericOnly(event:any){
  return NumberValidation_Omit_Char(event);
}
alphaNumeric(event:any){
  return omit_special_char(event)
}
}
