import { Component,EventEmitter,Input,OnInit,Output } from '@angular/core';


@Component({
  selector: 'app-fund-transfer-within-adhoc',
  templateUrl: './fund-transfer-within-adhoc.component.html',
  styleUrls: ['./fund-transfer-within-adhoc.component.scss']
})
export class FundTransferWithinAdhocComponent implements OnInit {
  @Output() adhocEmit = new EventEmitter<string>();
  @Output() backclick = new EventEmitter;
  AccountNumber:string="";
  @Input() adhocObj:any={
    adhocAccNo:"",
    adhocAccNoError:"",
    adhocFullName:"",
    adhocCurrency:"",
    adhocBankName:"",
    adhocBranchName:"",
    adhocBankCity:"",
    adhocSwiftCode:""
  };
  @Input() isAccountNumberValid : any;

  constructor() { }

  ngOnInit(): void { }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  back(){
    this.adhocObj.adhocAccNo = "";
    this.adhocObj.adhocFullName = "";
    this.adhocObj.adhocCurrency = "";
    this.backclick.emit();
  }

  accNoOnBlur() {
    if(this.adhocObj.adhocAccNo){
      this.adhocObj.adhocAccNoError = "";
    }
    this.adhocEmit.emit(this.adhocObj);
  }
}


