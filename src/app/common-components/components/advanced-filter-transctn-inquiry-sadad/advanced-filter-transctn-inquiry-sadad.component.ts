import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { amountValidation, NumberValidation_Omit_Char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advanced-filter-transctn-inquiry-sadad',
  templateUrl: './advanced-filter-transctn-inquiry-sadad.component.html',
  styleUrls: ['./advanced-filter-transctn-inquiry-sadad.component.scss']
})
export class AdvancedFilterTransctnInquirySadadComponent implements OnInit {
  @Input() showAdvancedSearchPopup:any;
  searchwithin : any = '';
  billerName=''
  serviceName='';
  toAmt:any;
  frmAmt:any;
  frmDate:any;
  toDate:any;
  billers:any;
  serviceTypes:any;
  params:any={};
  itemsPerPage='100';
  orderType='asc';
  clearFlag:boolean = false;
  @Output() advancedSearchParams =new EventEmitter();
  to:any;
  amount:any;
  isShownAmountValidation :boolean = false;
  showDateErrorMessage: boolean = false;
  fromDate:any;
fromDateValue:any;
toDateValue:any;
minDate:any
maxDate = new Date();
subProduct : any;
refNum: any;
  constructor() { }

  ngOnInit(): void {
    this.minDate = new Date(new Date().setMonth(new Date().getMonth() - 6));
  }
  stopAdvancedSearchClose(event:any){
    event.stopImmediatePropagation();
  }
  onClickApply(){
  // this.params.column=this.searchwithin;
  // this.params.noOfData=this.itemsPerPage
  // this.params.filedValue = this.searchwithin; 
  // if(this.searchwithin==='Biller'){
  //   this.params.filedValue=this.billerName
  // }else if(this.searchwithin==='Service Type'){
  //   this.params.filedValue=this.serviceName
  // }else if(this.searchwithin==='Value Date'){
  //   this.params.filedValue=''
  //   this.params.dateOrder=this.orderType
  // }else if(this.searchwithin==='Amount'){
  //   this.params.filedValue=''
  // }

  if(this.fromDate && this.toDate || this.searchwithin || this.subProduct || this.amount && this.to || this.refNum  ){
    this.params = {
      biller : this.searchwithin,
      fromAmount : this.amount,
      toAmount : this.to,
      fromDate : this.fromDate,
      toDate : this.toDate,
      referenceNo : this.refNum,
      serviceType : this.subProduct,
      sortColumn : this.searchwithin,
 	   orderType : this.orderType
    }
     this.advancedSearchParams.emit(this.params);
     this.showAdvancedSearchPopup=false;
     this.clearFlag = false;
  }
  else{ 
  //  this.showDateErrorMessage = true; 
  this.showAdvancedSearchPopup=false;
  }
 
  }
  onClickClear(){
    this.toAmt='';
    this.amount='';
    this.frmDate='';
    this.toDate='';
    this.searchwithin =  '';
    this.orderType = 'asc';
   this.subProduct = this.refNum = this.amount = this.to = '';
     this.clearFlag = !this.clearFlag;
     this.isShownAmountValidation = false;
  }
  selectedValue(event:any){
    // console.log(event)
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  getDate(event:any,val:any){
    if(val==='frm'){
      this.frmDate=event
    }else{
      this.toDate=event
    }
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
 
  filterAmtValidation()
{
  if(this.to){
    let status = amountValidation(this.amount ,this.to)
    if(status === true)
    {
      this.isShownAmountValidation = true
      this.to =''
    }
    else{
      this.isShownAmountValidation = false
    }
  }      
}

getFromDate(event:any){
  this.fromDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  this.fromDateValue = event      
  this.toDate ='';
  this.toDateValue = '';
}
getToDate(event:any){
  this.toDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  this.toDateValue = event
}
numericOnly(event:any){
  return NumberValidation_Omit_Char(event);
}
}
