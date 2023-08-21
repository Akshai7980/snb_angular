import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';

@Component({
  selector: 'app-payment-to',
  templateUrl: './payment-to.component.html',
  styleUrls: ['./payment-to.component.scss']
})
export class PaymentToComponent implements OnInit {
  total=0
  moiTo={biller:'',serviceType:'',nationalId:'',dob:'',amt:''}
  readOly=false
  dataSource:any
  footerSource:any
  formatType=''
  footerSourceColumn=['desc','amount']
  isProceed=false
  displayedColumns=['biller','ServiceType','description','amount','debit','action']
  billers=['CivilRegistration','Motor Vehicles','Driving Licences','Saudi Passport']
  serviceTypes=['Birth Registration','Death Registration','Marriage Registration','Divorce Registration']
  @Output() onPayToSelect = new EventEmitter();
  constructor(private curencyPipe:CurrencyFormatPipe) { }

  ngOnInit(): void {
  }
  setReadOly(){
    this.readOly=true
    this.dataSource=[this.moiTo]
    // fetch data based on moiTo Object
    this.footerSource=[{desc:'Service Fee',amt:'200.00 SAR'},{desc:'Service Tax',amt:'100.00 SAR'}]
    this.formatType = this.footerSource[0].amt.slice(-3);
    this.footerSource.forEach((element:any) => {
      let amt = element.amt.replace(/([a-zA-Z])/g, '');
      this.total=this.total+Number(amt)
    });
    this.moiTo.amt=this.curencyPipe.transform(this.total,this.formatType)+" "+this.formatType
  }
  selectedRow(val:any){
    if(val=='iconClick'){
      this.readOly=false;
    }
  }
  proceedToNext(){
    this.isProceed=true
    this.dataSource[0].amt=this.moiTo.amt
    this.onPayToSelect.emit(this.dataSource)
  }
}
