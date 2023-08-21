import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter,Input  } from '@angular/core';

@Component({
  selector: 'app-currency-dropdown',
  templateUrl: './currency-dropdown.component.html',
  styleUrls: ['./currency-dropdown.component.scss']
})
export class CurrencyDropdownComponent implements OnInit {
  @Output() paymentCurrencyEmit = new EventEmitter<string>();
  @Input() showAmtDetInitiateScreen = true;
  @Input() currencyArrayDataSource:any={};
  @Input() paymentCurrencyError:any;
  paymentCurrency:any;

  constructor() { }

  ngOnInit(): void {
  }

  currencyChanged(event: any) {
    if(this.paymentCurrencyError){
      this.paymentCurrencyError = "";
    }
    this.paymentCurrencyEmit.emit(this.paymentCurrency);
  }
}
