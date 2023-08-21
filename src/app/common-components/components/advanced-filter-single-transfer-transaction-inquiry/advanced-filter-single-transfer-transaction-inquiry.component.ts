import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { amountValidation, NumberValidation_Omit_Char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advanced-filter-single-transfer-transaction-inquiry',
  templateUrl: './advanced-filter-single-transfer-transaction-inquiry.component.html',
  styleUrls: ['./advanced-filter-single-transfer-transaction-inquiry.component.scss']
})
export class AdvancedFilterSingleTransferTransactionInquiryComponent implements OnInit {
  searchwithin="makerDate";
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
  isShownAmountValidation :boolean = false;
    
  constructor() { }
  
    ngOnInit(): void {
      
        this.isShowPaymentTypeFields = true;
      
      this.searchwithin = "makerDate";
      this.minDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
      // this.minDate = new Date(new Date().setDate(new Date().getDate() - 14));
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
    //  if(this.isShownAmountValidation === false)  
    //   {
        if(this.leftToggle){
          if(this.fromDate && this.toDate || this.transactionType || this.amountFrom && this.amountTo){
            params = 
            {
            period : "",
            sortOrder : this.datetime,
            searchwithin : this.searchwithin,
            fromDate : this.fromDate,
            toDate : this.toDate,
            fromAmount : this.amountFrom,
            toAmount : this.amountTo,
            transactionType : this.transactionType,
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
          }else{
            // this.showDateErrorMessage = true;
            this.showAdvancedSearchPopup = false;
          }
  
          if(this.accountNumber)
          {
            params={
            fromDate : this.fromDate,
            toDate : this.toDate,
            accountNumber : this.accountNumber,
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
            // this.showAccNumErrorMessage = true;
            this.showAdvancedSearchPopup = false;
          }
         
        }else if(this.rightToggle){
        
          if(this.period || this.transactionType || this.amountFrom && this.amountTo)
          {
          params = 
          {
            period : this.period,
            sortOrder : this.datetime,
            searchwithin : this.searchwithin,
            fromDate : "",
            toDate : "",         
            type : "Period",
            fromAmount : this.amountFrom,
            toAmount : this.amountTo,
            transactionType : this.transactionType,
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
            // this.showAccNumErrorMessage = true;
            this.showAdvancedSearchPopup = false;
          }
        }
      // }
      
    }
  
    onClickClear(){
      this.searchwithin="makerDate";
      this.datetime="desc";
      this.period='currentDay';
      this.leftToggle=true;
      this.rightToggle=false;
      this.accountNumber=''
      this.fromDateValue='';
      this.toDateValue='';
      this.transactionType="";
    this.transactionType=''; 
    this.amountFrom='';
    this.amountTo='';
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

    numericOnly(event:any){
      return NumberValidation_Omit_Char(event);
    }

    filterAmtValidation()
    {
      if(this.amountTo){
        let status = amountValidation(this.amountFrom ,this.amountTo)
        if(status === true)
        {
          this.isShownAmountValidation = true
          this.amountTo =''
        }
        else{
          this.isShownAmountValidation = false
        }
      }      
    }

}