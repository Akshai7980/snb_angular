import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { amountValidation, NumberValidation_Omit_Char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advanced-filter-aramco',
  templateUrl: './advanced-filter-aramco.component.html',
  styleUrls: ['./advanced-filter-aramco.component.scss']
})
export class AdvancedFilterAramcoComponent implements OnInit {
  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  leftToggle=true;
  rightToggle=false;
  fromDate: any;
  toDate: any;
  toDateValue: any;
  clearFlag: boolean = false;
  fromDateValue: any;
  invoiceNumber: any;
  searchWithin: any;
  status: any;
  dateOrder: any;
  maxDate=new Date();
  accountNumber:string='';
  remitterID:string='';
  amount:string='';
  to:string='';
  requestType:string='';
  showDateErrorMessage: boolean = false;
  isShownAmountValidation :boolean = false;
  requestTypeList=["Direct Payments","Invoice Payments"]
 currentColumn = 'odMakerDate';
   sortDirection = 'desc';
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
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }

  onClickApply() {
    let params;
    if(this.fromDate && this.toDate || this.amount && this.to || this.remitterID || this.requestType)
    {
      params = {
        accNum: this.accountNumber,
        remitter: this.remitterID,
        amountFrom: this.amount,
        amountTo : this.to,
        reqType : this.requestType,
        currentColumn : this.currentColumn,
        sortDirection : this.sortDirection           
      };
      this.advancedSearchParams.emit(params);
      this.showAdvancedSearchPopup = false;
      this.clearFlag = false;

    }
    

    // if(this.leftToggle){
    //   if (this.fromDate && this.toDate) {
    //     params = {
    //       dateFrom: this.fromDate,
    //       dateTo: this.toDate,
    //       invoiceNumber: this.invoiceNumber,
    //       // status: this.status,
    //       // searchWithIN: this.searchWithin,
    //       // dateOrder : this.dateOrder,
    //       type: "invoice"
    //     };
    //     this.advancedSearchParams.emit(params);
    //     this.showDateErrorMessage = false;
    //     this.showAdvancedSearchPopup = false;
    //     this.clearFlag = false;
    //   }else{
    //     this.showDateErrorMessage = true;
    //   }

    //   if(this.invoiceNumber){
    //     params = {
    //       dateFrom: this.fromDate,
    //       dateTo: this.toDate,
    //       invoiceNumber: this.invoiceNumber,
    //       type: "invoice"
    //     };
    //     this.advancedSearchParams.emit(params);

    //     this.showAdvancedSearchPopup = false;
    //     this.clearFlag = false;
    //   }
    // }else if(this.rightToggle){
    //   if (this.fromDate && this.toDate) {
    //     params = {
    //       dateFrom: this.fromDate,
    //       dateTo: this.toDate,
    //       invoiceNumber: this.invoiceNumber,
    //       // status: this.status,
    //       // searchWithIN: this.searchWithin,
    //       // dateOrder : this.dateOrder,
    //       type: "paid"
    //     };
    //     this.advancedSearchParams.emit(params);
    //     this.showDateErrorMessage = false;
    //     this.showAdvancedSearchPopup = false;
    //     // this.dateFrom = '';
    //     // this.dateTo = '';
    //     // this.name = '';
    //     // this.bankName = '';
    //     // this.clearFlag = !this.clearFlag;
    //     this.clearFlag = false;
    //   } else{
    //     this.showDateErrorMessage = true;
    //   }

    //   if(this.invoiceNumber){
    //     params = {
    //       dateFrom: this.fromDate,
    //       dateTo: this.toDate,
    //       invoiceNumber: this.invoiceNumber,
    //       // status: this.status,
    //       // searchWithIN: this.searchWithin,
    //       // dateOrder : this.dateOrder,
    //       type: "paid"
    //     };
    //     this.advancedSearchParams.emit(params);
    //     this.showAdvancedSearchPopup = false;

    //     this.clearFlag = false;
    //   }
    // }
      
  }

  getFromDate(event:any){
    // this.fromDate = "" + event.getDate().toString().padStart(2, "0") + "/" + (event.getMonth() + 1).toString().padStart(2, "0") + "/" + event.getFullYear();
    // this.fromDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
    let day=event.getDate()>9?event.getDate():"0"+event.getDate()
    let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
    let year=event.getFullYear()
    this.fromDate=day+"/"+month+"/"+year
      // if(!(this.toDateValue && this.toDateValue.getTime()>=event.getTime())){
      //   this.fromDateValue = event
      // }
      this.fromDateValue = event      
      this.toDate ='';
      this.toDateValue = ''; 
  }

  getToDate(event:any){
    // this.toDate = "" + event.getDate().toString().padStart(2, "0") + "/" + (event.getMonth() + 1).toString().padStart(2, "0") + "/" + event.getFullYear();
    // this.toDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
    let day=event.getDate()>9?event.getDate():"0"+event.getDate()
    let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
    let year=event.getFullYear()
    this.toDate=day+"/"+month+"/"+year
      this.toDateValue = event
  }

  onClickClear() {
    this.currentColumn = 'odMakerDate';
    this.sortDirection = 'desc';
    this.accountNumber = '';
    this.remitterID = '';
    this.amount = '';
    this.to = '';
    this.requestType = "Any";
    this.clearFlag = !this.clearFlag;
    this.isShownAmountValidation = false;
  }

  numericOnly(event:any){
    return NumberValidation_Omit_Char(event);
  }

  clickrequestType(event:any){
    this.requestType = event.value;
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
}
