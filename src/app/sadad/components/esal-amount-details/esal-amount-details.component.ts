import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-esal-amount-details',
  templateUrl: './esal-amount-details.component.html',
  styleUrls: ['./esal-amount-details.component.scss']
})
export class EsalAmountDetailsComponent implements OnInit,OnChanges {
  amountObj={transferAmt:'',currencyCode:'SAR',fee:'0.5 SAR',vat:'0.8 SAR',debitAmount:0}
  @Input() amount=''
  @Input()readOnly=false;
  debitAmount=0
  @Output() finalAmountObj=new EventEmitter()
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.amountObj.transferAmt=this.amount
    this.getDebitAmount();
    this.amountObj.debitAmount=this.debitAmount
    this.finalAmountObj.emit(this.amountObj)
  }

  ngOnInit(): void {
    this.amountObj.transferAmt=this.amount
  }
  getDebitAmount(){
    this.debitAmount=0
    let fee=(this.amountObj.fee.replace(/([a-zA-Z])/g, '')).trim()
    let vat=(this.amountObj.vat.replace(/([a-zA-Z])/g, '')).trim()
     this.debitAmount=Number(this.amountObj.transferAmt)+Number(fee)+Number(vat)
  }
}
