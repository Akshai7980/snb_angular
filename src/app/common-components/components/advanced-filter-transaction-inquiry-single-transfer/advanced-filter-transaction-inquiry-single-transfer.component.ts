import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-transaction-inquiry-single-transfer',
  templateUrl: './advanced-filter-transaction-inquiry-single-transfer.component.html',
  styleUrls: ['./advanced-filter-transaction-inquiry-single-transfer.component.scss']
})
export class AdvancedFilterTransactionInquirySingleTransferComponent implements OnInit {
  searchwithin="paymentType";
  datetime="desc";
  period='last2Month';
  transactionType="";
  resultsPerPage="25";
  leftToggle=true;
  rightToggle=false;
  fromDate: any;
  clearFlag:boolean = false;
  toDate:any;
  amountFrom:any;
  amountTo:any;
  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  showDateErrorMessage: boolean = false;
  showAccNumErrorMessage: boolean = false;
  isShowPaymentTypeFields: boolean = false;
  isShowDateFields: boolean = false;
  isShowAmountFields: boolean = false;
  minDate:any
  maxDate = new Date();
  fromDateValue: any;
  toDateValue: any;
  accountNumber:any;
    
  constructor() { }
  
    ngOnInit(): void {
      if(this.searchwithin === "paymentType"){
        this.isShowPaymentTypeFields = true;
      }
      this.searchwithin = "makerDate";

      // this.minDate = new Date();
      // var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      // this.minDate = months[new Date(this.minDate.setMonth(this.minDate.getMonth() - 6)).getMonth()];
 

       this.minDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
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
        // if(this.fromDate && this.toDate){
        //   params = 
        //   {
        //   period : "",
        //   sortOrder : this.datetime,
        //   searchwithin : this.searchwithin,
        //   fromDate : this.fromDate,
        //   toDate : this.toDate,
        //   fromAmount : this.amountFrom,
        //   toAmount : this.amountTo,
        //   transactionType : this.transactionType,
        //   type : "Date"
        //   }
        //   this.advancedSearchParams.emit(params);
        //   this.showAdvancedSearchPopup = false;
        //   this.showDateErrorMessage = false;
        //   this.period='currentDay';
        //   this.leftToggle=true;
        //   this.rightToggle=false;
        //   this.fromDate = "";
        //   this.toDate = "";
        //   this.leftToggleCntl();
        //   this.clearFlag = !this.clearFlag;
        // }else{
        //   this.showDateErrorMessage = true;
        // }

        if((this.fromDate && this.toDate) || this.accountNumber)
        {
          params={
          fromDate : this.fromDate ? this.fromDate :'',
          toDate : this.toDate ? this.toDate :'',
          accountNumber : this.accountNumber ? this.accountNumber :'',
          type : "Date"
          }
          this.advancedSearchParams.emit(params);
          this.showAdvancedSearchPopup = false;
          this.showDateErrorMessage = false;
          // this.period='currentDay';
          this.leftToggle=true;
          this.rightToggle=false;
          // this.fromDate = "";
          // this.toDate = "";
          this.leftToggleCntl();
          this.clearFlag = false;
          // this.clearFlag = !this.clearFlag;
        }
        else{
          //this.showAccNumErrorMessage = false;
          this.showAdvancedSearchPopup = false;
        }
       
      }else if(this.rightToggle){
        // if(this.period){
        //   params = 
        // {
        //   period : this.period,
        //   sortOrder : this.datetime,
        //   searchwithin : this.searchwithin,
        //   fromDate : "",
        //   toDate : "",
        //   fromAmount : this.amountFrom,
        //   toAmount : this.amountTo,
        //   transactionType : this.transactionType,
        //   type : "Period"
        // }
        // this.advancedSearchParams.emit(params);
        //   this.showAdvancedSearchPopup = false;
        //   this.showDateErrorMessage = false;
        //   this.period='currentDay';
        //   this.leftToggle=true;
        //   this.rightToggle=false;
        //   this.fromDate = "";
        //   this.toDate = "";
        //   this.leftToggleCntl();
        //   this.clearFlag = !this.clearFlag;
        // }

        if(this.period || this.datetime || this.accountNumber)
        {
        params = 
        {
          period : this.period ? this.period : '',
          sortOrder : this.datetime ? this.datetime :'',
          searchwithin : this.searchwithin ? this.searchwithin : '',
          fromDate : "",
          toDate : "",         
          type : "Period",
          accountNumber:this.accountNumber ? this.accountNumber :''
        }
          this.advancedSearchParams.emit(params);
          this.showAdvancedSearchPopup = false;
          this.showDateErrorMessage = false;
          // this.period='currentDay';
          this.leftToggle=false;
          this.rightToggle=true;
          // this.fromDate = "";
          // this.toDate = "";
          this.rightToggleCntl();
          this.clearFlag = false;
          // this.clearFlag = !this.clearFlag;
        }
        else{
          this.showAccNumErrorMessage = false;
          this.showAdvancedSearchPopup = true;
        }
      }
    }
  
    onClickClear(){
      this.searchwithin="paymentType";
      this.datetime="desc";
      this.period='currentDay';
      this.leftToggle=true;
      this.rightToggle=false;
      this.accountNumber=''
      this.fromDateValue='';
    this.toDateValue='';
      this.clearFlag = !this.clearFlag;
      this.leftToggleCntl();
    }
  
    getFromDate(event:any){
      this.fromDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
      // if(!(this.toDateValue && this.toDateValue.getTime()>=event.getTime())){
      //   this.fromDateValue = event
      // }
      this.fromDateValue = event      
      this.toDate ='';
      this.toDateValue = '';
    }
    getToDate(event:any){
      this.toDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
      this.toDateValue = event
    }
    closeFilter(event:any){
      this.showAdvancedSearchPopup = false; 
    }
}
