import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {RootScopeDeclare} from '../../../rootscope-declare';
import {RootScopeData} from '../../../rootscope-data';


@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
rootScopeData: RootScopeDeclare = RootScopeData;
@Input() accountData:any;
@Input() clearFlag = false;
@Input() validationFlag:any;
@Input() swiftCodeValidationFlag:any
@Input() isSwiftCodeValidate:any
@Input() routerCodeValidationFlag:any
@Output() accountNumber = new EventEmitter();
@Output() routingCode = new EventEmitter();
@Output() swiftCode = new EventEmitter();
@Input() accErrMsg:any
@Input() showBebeCreationInvalid=false
@Input() accNumInvalid=false
@Input() bicCodeResValidate = false
@Input() ibanValid :any;
//@Input() ibanMaxLength :any;
accNumber = "";
bankName = "";
branchName = "";
bankCity="";
SwiftCode="";
bankRouteCode="";
duplicateSwift="";
duplicateAccountNum="";
duplicateRouteCode="";
@Input() bankRouteCodeValidate = false

constructor() { 
}

ngOnInit(): void {
}

OnEnterAccountNumber(event:any){ 
  // debugger;
  let accountNumber = event.target.value;
  if(accountNumber !== this.duplicateAccountNum)
  {
    this.duplicateAccountNum = this.accNumber;
    this.accountNumber.emit(this.accNumber);
  }
  
}
onEnterRoutingCode(event:any){
  let routeCode = event.target.value;
  if(routeCode !== this.duplicateRouteCode)
  {
    this.duplicateRouteCode = this.bankRouteCode;
    if(routeCode.trim() && routeCode.length > 0){
      this.swiftCodeValidationFlag = false;
      this.routingCode.emit(this.bankRouteCode); 
    }else{
      this.bicCodeResValidate = false;
      this.bankName = '';
      this.bankCity = '';
      this.branchName = '';
      this.SwiftCode = '';
      if(this.ibanValid==="Y"){
        this.isSwiftCodeValidate = true;      
      }
      else{
        this.isSwiftCodeValidate = false;
        this.accNumber ='';
      }
    }
  }
  
}
onEnterSwiftCode(event:any){
  // debugger;
  let swiftCode = event.target.value;
  if(swiftCode !== this.duplicateSwift){
  if(this.SwiftCode.trim() && this.SwiftCode.length > 0)
  {
    this.bankRouteCode = '';
    this.isSwiftCodeValidate = true;
    this.duplicateSwift = this.SwiftCode;
    this.swiftCode.emit(this.SwiftCode)
  }else{
    this.bankRouteCodeValidate = false;
    this.bankName = '';
    this.bankCity = '';
    this.branchName = '';
    this.SwiftCode = '';
    if(this.ibanValid==="Y"){
      this.isSwiftCodeValidate = true;      
    }
    else{
      this.isSwiftCodeValidate = false;
      this.accNumber ='';
    }
    
  }
  this.swiftCodeValidationFlag = this.SwiftCode ? false:true;
}
}
ngOnChanges(){
  if(Object.keys(this.accountData).length > 0){
    this.bankName = this.accountData.bankName;
    this.branchName = this.accountData.branchName;
    this.bankCity = this.accountData.bankCity;
    // this.SwiftCode = this.accountData.swiftCode;
    if(this.accountData.bicCode){
      this.SwiftCode = this.accountData.bicCode;
      this.isSwiftCodeValidate = true;
    }
   
    
  }else if(Object.keys(this.accountData).length === 0){
    this.bankName ="";
    this.branchName = "";
    this.bankCity = "";
    this.SwiftCode = "";
    this.accNumber ='';
    this.bankRouteCode = '';
  }
  
  if(this.clearFlag){
    this.bankRouteCode = '';
    this.bankName ="";
    this.branchName = "";
    this.bankCity = "";
    this.SwiftCode = "";
    this.clearFlag  = false; 
  }

  this.ibanValid = this.ibanValid;
  // this.ibanMaxLength = this.ibanMaxLength;

}

}
