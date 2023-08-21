import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { amountValidation, NumberValidation_Omit_Char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advanced-filter-single-transfer',
  templateUrl: './advanced-filter-single-transfer.component.html',
  styleUrls: ['./advanced-filter-single-transfer.component.scss']
})
export class AdvancedFilterSingleTransferComponent implements OnInit {
  // transactionType="withinmyaccounts";
  leftToggle=true;
  rightToggle=false;
  dateFrom:any;
  dateTo:any;
  transactionType:any;
  clearFlag:boolean = false;
  amount:any;
  to:any;
  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  showDateErrorMessage: boolean = false;
  fromDateValue:any;
  toDateValue:any;
  minDate:any
  isShownAmountValidation :boolean = false;
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
//       if(this.isShownAmountValidation === false)  
//       {
//       if(this.leftToggle){
//         if(this.dateFrom && this.dateTo){
//         params={
//              dateFrom: this.dateFrom,
//             dateTo: this.dateTo,
//             amount: "",
//             to: "",
//             transactionType: this.transactionType,
//             type: "Date"
//           }
//         this.advancedSearchParams.emit(params);
//         this.showAdvancedSearchPopup = false;    
//         this.leftToggle=true;
//         this.rightToggle=false;
//         // this.dateFrom = "";
//         // this.dateTo = "";
//         this.leftToggleCntl();
//         this.clearFlag = false;
//         // this.clearFlag = !this.clearFlag;
//       }else{
//         this.showDateErrorMessage = true;
//       }
//     }else if(this.rightToggle){
//       if(this.amount && this.to){
//       params={
//               amount: this.amount,
//               to: this.to,
//               dateFrom: "",
//               dateTo: "",
//               transactionType: this.transactionType,
//               type: "Amount"
//       }
//       this.advancedSearchParams.emit(params);
//       this.showAdvancedSearchPopup = false;
//       this.showDateErrorMessage = false;
//       this.leftToggle=false;
//       this.rightToggle=true;
//       // this.amount = "";
//       // this.to = "";
//       this.rightToggleCntl();
//       this.clearFlag = false;
//       // this.clearFlag = !this.clearFlag;
//     }
//   }
//   this.advancedSearchParams.emit(params);
//   this.showAdvancedSearchPopup = false;
// }
  // this.clearFlag = !this.clearFlag;
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
    if(this.transactionType || (this.fromDateValue && this.toDateValue)){
      params={
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      amount: "",
      to: "",
      transactionType: this.transactionType,
      type: "Date"
    }
      this.advancedSearchParams.emit(params);
      this.showAdvancedSearchPopup = false;    
      this.leftToggle=true;
      this.rightToggle=false;
      // this.dateFrom = "";
      // this.dateTo = "";
      this.leftToggleCntl();
      this.clearFlag = false;
    }
  }else if(this.rightToggle){
    if((this.amount && this.to) || this.transactionType){
      params={
           amount: this.amount,
          to: this.to,
          dateFrom: "",
          dateTo: "",
          transactionType: this.transactionType,
          type: "Amount"
      }
      this.advancedSearchParams.emit(params);
      this.showAdvancedSearchPopup = false;
      this.showDateErrorMessage = false;
      this.leftToggle=false;
      this.rightToggle=true;
      // this.amount = "";
      // this.to = "";
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
  // this.dateFrom = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  let day=event.getDate()>9?event.getDate():"0"+event.getDate()
  let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
  let year=event.getFullYear()
  this.dateFrom=day+"/"+month+"/"+year
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
  this.clearFlag = !this.clearFlag;
  this.fromDateValue='';
  this.dateFrom = '';
  this.dateTo = '';
    this.toDateValue='';
  this.leftToggleCntl();
  this.fromDateErrorMessage=false;
  this.toDateErrorMessage=false;
  this.minFromDate='';
  this.minToDate='';
  this.maxFromDate = new Date();
  this.maxToDate = new Date();
  this.isShownAmountValidation = false;
  this.amount='';
  this.to='';
}
closeFilter(event:any){
  this.showAdvancedSearchPopup = false; 
}

filterAmtValidation()
{
  if(this.to && this.amount){
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
numericOnly(event:any){
  return NumberValidation_Omit_Char(event);
}

}
