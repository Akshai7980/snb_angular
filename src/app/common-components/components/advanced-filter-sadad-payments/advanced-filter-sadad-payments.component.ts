import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-advanced-filter-sadad-payments',
  templateUrl: './advanced-filter-sadad-payments.component.html',
  styleUrls: ['./advanced-filter-sadad-payments.component.scss']
})
export class AdvancedFilterSadadPaymentsComponent implements OnInit {
  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  @Input() sadadData:any;
  leftToggle=true;
  rightToggle=false;
  dateFrom:any;
  dateTo:any;
  transactionType:any;
  clearFlag:boolean = false;
  amount:any;
  to:any;
  subscriberId:any;
  sadadName :any;
  showDateErrorMessage: boolean = false;
  showAmountErrorMessage: boolean = false;
  showsubscriberErrorMessage:boolean = false;
  showBillerNameErrorMessage:boolean = false;
  constraintRecords:any=[];
  toDateValue: any;
  toDate: any;
  fromDate: any;
  fromDateValue: any;

  constructor() { }

  ngOnInit(): void {
    //advanced filterSearch dropdown functionality implemented
    let particularRecord :any=[];
    let moreActionList :any=[];
    for(let i=0;i < this.sadadData.length;i++)
  {
    if(particularRecord){
      if (particularRecord.find((test:any) => test.billerName ===  this.sadadData[i].billerName) === undefined) { 
        Object.assign( this.sadadData[i], { billerName: this.sadadData[i].billerName});
        particularRecord.push(this.sadadData[i]);
        this.constraintRecords = particularRecord;
      }
    }           
  }  
  
//advanced filterSearch dropdown functionality implemented 
  }

  leftToggleCntl(){
    if(this.leftToggle=true){
      document.getElementById('leftToggle')?.classList.add('active');
      document.getElementById('rightToggle')?.classList.remove('active');
      this.rightToggle = false;
      // this.sadadName = "";
      // this.subscriberId = "";
    }
  }

  rightToggleCntl(){
    if(this.rightToggle=true){
      document.getElementById('rightToggle')?.classList.add('active');
      document.getElementById('leftToggle')?.classList.remove('active');
      this.leftToggle=false;
      // this.sadadName = "";
      // this.subscriberId = "";
    }
  }

  stopAdvancedSearchClose(event:any){
    event.stopImmediatePropagation();
  }

  onClickApply(){
      let params;
      if(this.leftToggle){
        if(this.dateFrom && this.dateTo || this.sadadName || this.subscriberId){
          params={
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            amount: "",
            to: "",
            billerName: this.sadadName,
            type: "Date",
            subscriberId:this.subscriberId
          }
        this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;    
        this.leftToggle=true;
        this.rightToggle=false;
        // this.dateFrom = "";
        // this.dateTo = "";
        // this.subscriberId="";
        // this.sadadName="";
        this.leftToggleCntl();
        this.clearFlag = false;
        // this.clearFlag = !this.clearFlag;
      }else{
        
        this.showAdvancedSearchPopup = false; 
      }
    }else if(this.rightToggle){
      if(this.amount && this.to || this.sadadName || this.subscriberId){
      params={
              amount: this.amount,
              to: this.to,
              dateFrom: "",
              dateTo: "",
              billerName: this.sadadName,
              type: "Amount",
              subscriberId:this.subscriberId
      }
      this.advancedSearchParams.emit(params);
      this.showAdvancedSearchPopup = false;
      this.showAmountErrorMessage = false;
      this.leftToggle=false;
      this.rightToggle=true ;
      // this.amount = "";
      // this.to = "";
      // this.subscriberId ="";
      // this.sadadName="";
      this.rightToggleCntl();
      this.clearFlag = false;
      // this.clearFlag = !this.clearFlag;
    }else{
      
      this.showAdvancedSearchPopup = false; 
    }
    // else{
      // this.showAmountErrorMessage = this.amount ? false : true;
      // this.showsubscriberErrorMessage = this.subscriberId ? false : true;
      // this.showBillerNameErrorMessage = this.sadadName ? false : true;

    // }
  }
  // this.advancedSearchParams.emit(params);
  // this.showAdvancedSearchPopup = false;
  // this.clearFlag = !this.clearFlag;
}
    
getFromDate(event:any){
  this.dateFrom = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  let day=event.getDate()>9?event.getDate():"0"+event.getDate()
    let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
    let year=event.getFullYear()
    this.fromDate=day+"/"+month+"/"+year
      if(!(this.toDateValue && this.toDateValue.getTime()>=event.getTime())){
        this.fromDateValue = event
      }
}
getToDate(event:any){
  this.dateTo = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  let day=event.getDate()>9?event.getDate():"0"+event.getDate()
    let month=(event.getMonth() + 1)>9?(event.getMonth() + 1):"0"+(event.getMonth() + 1)
    let year=event.getFullYear()
    this.toDate=day+"/"+month+"/"+year
      this.toDateValue = event
}

onClickClear(){
  this.leftToggle=true;
  this.rightToggle=false;
  this.amount = "";
  this.to = "";
  this.subscriberId = '';
  this.transactionType='';
  this.dateFrom = "";
  this.dateTo = "";
  this.toDateValue = '';
  this.fromDateValue = '';
  this.clearFlag = !this.clearFlag;
  this.leftToggleCntl();
}
closeFilter(event:any){
  this.showAdvancedSearchPopup = false; 
}

numericOnly(event:any){
  return NumberValidation_Omit_Char(event);
}
}
