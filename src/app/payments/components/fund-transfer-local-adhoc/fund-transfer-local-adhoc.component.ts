import { Component,EventEmitter,Input,OnInit,Output } from '@angular/core';


@Component({
  selector: 'app-fund-transfer-local-adhoc',
  templateUrl: './fund-transfer-local-adhoc.component.html',
  styleUrls: ['./fund-transfer-local-adhoc.component.scss']
})
export class FundTransferLocalAdhocComponent implements OnInit {
  @Output() adhocEmit = new EventEmitter<string>();
  @Output() backclick = new EventEmitter;
  AccountNumber:string="";
  @Input() adhocObj:any={
    adhocIbanNo:"",
    adhocIbanNoError:"",
    adhocFullName:"",
    adhocFullNameError:"",
    adhocCurrency:"",
    adhocBankName:"",
    adhocBranchName:"",
    adhocBankCity:"",
    adhocSwiftCode:""
  };
  showBank = false;
  constructor() { }

  ngOnInit(): void { }

  omit_special_char(val :any){
    let k;  
    k = val.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  } 

  back(){
    this.backclick.emit();
  }

  ibanNoOnBlur() {
    if(this.adhocObj.adhocIbanNo){
      this.adhocObj.adhocIbanNoError = "";
      this.showBank=true
    }
    this.adhocEmit.emit(this.adhocObj);
  }

  nameOnBlur(){
    if(this.adhocObj.adhocFullName){
      this.adhocObj.adhocFullNameError = "";
    }
    this.adhocEmit.emit(this.adhocObj);    
  }
}


