import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advanced-filter-sadad-file-payments',
  templateUrl: './advanced-filter-sadad-file-payments.component.html',
  styleUrls: ['./advanced-filter-sadad-file-payments.component.scss']
})
export class AdvancedFilterSadadFilePaymentsComponent implements OnInit {

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
  uploadType: any;
  statusType: any;
  dateOrderType: any;
  showDateErrorMessage: boolean = false;
  showAmountErrorMessage: boolean = false;
  showUploadTypeErrorMessage:boolean = false;
  showStatusTypeErrorMessage:boolean = false;
  showDateOrderTypeErrorMessage:boolean = false;
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
  //     if(this.leftToggle){
  //       if(this.dateFrom && this.dateTo &&  this.uploadType && this.statusType && this.dateOrderType){
  //         params={
  //           dateFrom: this.dateFrom,
  //           dateTo: this.dateTo,
  //           amount: "",
  //           to: "",
  //           uploadType: this.uploadType,
  //           statusType: this.statusType,
  //           dateOrderType: this.dateOrderType,
  //           type: "Date"
  //         }
  //       this.advancedSearchParams.emit(params);
  //       this.showAdvancedSearchPopup = false;    
  //       this.leftToggle=true;
  //       this.rightToggle=false;
  //       // this.dateFrom = "";
  //       // this.dateTo = "";
  //       this.leftToggleCntl();
  //       this.clearFlag = false;
  //       // this.clearFlag = !this.clearFlag;
  //     }else{
  //       this.showDateErrorMessage = this.dateFrom ? false : true;
  //       this.showUploadTypeErrorMessage = this.uploadType ? false : true;
  //       this.showStatusTypeErrorMessage = this.statusType ? false : true;
  //       this.showDateOrderTypeErrorMessage = this.dateOrderType ? false : true;
  //     }
  //   }else if(this.rightToggle){
  //     debugger;
  //     if(this.amount && this.to && this.uploadType && this.statusType && this.dateOrderType){
  //     params={
  //             amount: this.amount,
  //             to: this.to,
  //             dateFrom: "",
  //             dateTo: "",
  //             type: "Amount",
  //             uploadType: this.uploadType,
  //           statusType: this.statusType,
  //           dateOrderType: this.dateOrderType,
  //     }
  //     this.advancedSearchParams.emit(params);
  //     this.showAdvancedSearchPopup = false;
  //     this.showAmountErrorMessage = false;
  //     this.leftToggle=false;
  //     this.rightToggle=true;
  //     // this.amount = "";
  //     // this.to = "";
  //     this.rightToggleCntl();
  //     this.clearFlag = false;
  //     // this.clearFlag = !this.clearFlag;
  //   }
  //   else{
  //     this.showAmountErrorMessage = this.amount ? false : true;
  //     // this.showsubscriberErrorMessage = this.subscriberId ? false : true;
  //     // this.showBillerNameErrorMessage = this.sadadName ? false : true;

  //   }
  // }
  // this.advancedSearchParams.emit(params);
  // this.showAdvancedSearchPopup = false;
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
    if((this.dateFrom && this.dateTo) ||  this.uploadType || this.statusType || this.dateOrderType){
      params={
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        amount: "",
        to: "",
        uploadType: this.uploadType,
        statusType: this.statusType,
        dateOrderType: this.dateOrderType,
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
    if((this.amount && this.to) ||   this.uploadType || this.statusType || this.dateOrderType){
      params={
          amount: this.amount,
          to: this.to,
          dateFrom: "",
          dateTo: "",
          type: "Amount",
          uploadType: this.uploadType,
          statusType: this.statusType,
          dateOrderType: this.dateOrderType,
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
  this.uploadType='';
  this.statusType='';
  this.dateOrderType='';
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
}
