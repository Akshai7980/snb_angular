import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Output, EventEmitter,Input  } from '@angular/core';
import { amountUnFormat } from 'src/app/utility/amount-unformat';

@Component({
  selector: 'app-amount-details',
  templateUrl: './amount-details.component.html',
  styleUrls: ['./amount-details.component.scss']
})
export class AmountDetailsComponent implements OnInit, OnChanges {
  @Output() paymentDetailsEmit = new EventEmitter<string>();
  @Output() currencyDetailsEmit = new EventEmitter<string>();
  @Input() paymentAmountError = '';
  @Input() showAmtDetInitiateScreen = true;
  @Input() currencyArrayDataSource:any={};
  @Input() showCharges=true;
  @Output() disableProceed=new EventEmitter()
  @Input() respStatus:any
  @Input() feeCharge:any
  @Input() vatCharge:any
  @Input() showFeeAndVat = false;
  @Input()ccy:any
  @Input() isHideTimer:boolean = false;
  @Input() paymentDetailsObj:any={
    amount:"",
    currency:"",
    amountError:"",
    currencyError:"",
    exchangeRate:"",
    fee:"",
    vat:"",
    ccy:"",
    debitAmount:"",
    debitCurrency:"",
    currencyFlag:''
  };
  timeLeft: number = 30;
  interval:any;
  dispTime="00:30";
  dispRest=false;
  constructor() { }
  ngOnChanges(): void {
    if(this.respStatus){
      this.getStatus();
    }
  }
  ngOnInit(): void {
  
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  amountOnBlur(event:any){
    let amount = event.target.value
    this.paymentDetailsObj.amount= amountUnFormat(amount);
    this.paymentDetailsEmit.emit(this.paymentDetailsObj);
  }

  currencyChanged() {
    window.clearInterval(this.interval)
    if(this.paymentDetailsObj.currency){
      this.paymentDetailsObj.amount = "";
      this.paymentDetailsObj.currencyError = "";
      //this.paymentDetailsObj.currencyFlag ='true';
    }
    this.currencyDetailsEmit.emit(this.paymentDetailsObj);
  }
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft=this.timeLeft-1;
       this.dispTime=this.timeLeft>9?"00:"+this.timeLeft:"00:0"+this.timeLeft
      } else {
        clearInterval(this.interval); 
        this.disableProceed.emit(true)
        this.dispRest=true  
        this.timeLeft=0;
        this.dispTime="00:00"
      }
    },1000)
  }
  restTimmer(event?:any){
    clearInterval(this.interval)
    // this.timeLeft=30;
    // this.startTimer()
    this.currencyDetailsEmit.emit(this.paymentDetailsObj);
    // this.dispRest=false
    this.getStatus();
  }

  getStatus(){
    if(this.respStatus && this.respStatus==="F"){
      this.dispRest=true;
      this.disableProceed.emit(true)
    }else if(this.respStatus && this.respStatus==="S"){
      this.isHideTimer = false;
      this.timeLeft=30;
      this.startTimer();
      this.dispRest=false;
      this.disableProceed.emit(false)
    }
  }
}
