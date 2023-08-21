import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {RootScopeDeclare} from '../../../rootscope-declare';
import {RootScopeData} from '../../../rootscope-data';
import { mobileNumberValidation, NumberValidation_Omit_Char } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.scss']
})
export class BeneficiaryDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() country:any;
  @Input() fullNameValidationFlag:any;
  @Input() shortNameValidationFlag:any;
  @Input() cityValidationFlag:any;
  @Input() stateValidationFlag:any;
  @Input() addressValidationFlag:any;
  @Input() shortNameDuplicateFlag:any;
  @Input() countryValidationFlag:any;
  @Output() inputFieldValues = new EventEmitter();
  fullName = "";
  shortName = "";
  city="";
  state="";
  address="";
  postalCode="";
  phone = "";
  countryCode: any;
  localCountryList: any;
  constructor() { }
  accountCountry : any="";
  ngOnInit(): void {
    if(this.country){
      this.localCountryList = this.country;
      // this.accountCountry = this.country[0].countryName;
    }
  }

onBlurInputField(getData:any){
  for(let i=0;i<this.country.length;i++){
    if(this.accountCountry === this.country[i].countryName){
      this.countryCode = this.country[i].ccyCode;
    }
  }
  let params={
    fullName:this.fullName,
    shortName:this.shortName,
    country:this.accountCountry,
    countryCode:this.countryCode,
    city:this.city,
    state:this.state,
    address:this.address,
    postalCode:this.postalCode,
    phoneNumber:this.phone
  }
  this.inputFieldValues.emit(params);
  if(getData === "fullName"){
    this.fullNameValidationFlag = this.fullName ? false:true;
  }else if(getData === "shortName"){
    this.shortNameValidationFlag = this.shortName ? false:true;
  }else if(getData === "city"){
    this.cityValidationFlag = this.city ? false:true;
  }else if(getData === "state"){
    this.stateValidationFlag = this.state ? false:true;
  }else if(getData === "address"){
    this.addressValidationFlag = this.address ? false:true;
  }
}

allowAlphabetsAndSpaceOnly(event:any){
  var charCode = event.keyCode;
  if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 32 ){
    return true;
  }else{
    return false;
  }
}

checkPhoneNumberValidate(val:any){
  return mobileNumberValidation(val);
}

checkNumberValidate(event:any){
  var charCode =  event.keyCode;
  if (!(charCode>=48 && charCode<=57) ) {
    return false;
  }
  return true;
}

searchCountry(event: any) {
  const searchValue: string = event?.target?.value;
  this.country = this.localCountryList;
  this.country = this.country.filter((eachCountry: any) =>
    (eachCountry?.countryName as string)?.toLowerCase().includes(searchValue?.toLowerCase()))
}

resetCountryInput(event: any) {
  const blurredValue: string = event?.target?.value;
  const countryFound = this.country.filter((eachCountry: any) =>
    (eachCountry?.countryName as string)?.toLowerCase() === blurredValue?.toLowerCase());
  if (countryFound?.length > 0) {
    this.accountCountry = countryFound[0]?.countryName;
    this.onCountrySelect();
  } else {
    this.accountCountry = "";
    this.onCountrySelect();
  }
}

onCountrySelect(){
  // this.accountDataToPass = {};
  // this.enableValidateSwiftCode = false;
  // this.showOtherInformation = this.accountCountry ? true:false;
  this.localCountryList.forEach((element:any) => {
      if(this.accountCountry === element.countryName){
        this.countryCode=element.countryCode
        if(element.clearCodeInq === "Y"){
          // this.isSwiftCodeValidate = true;
          // this.checkBeneBankDetails = true;
          // this.iBanorNot = "Y";
        }else{
          // this.isSwiftCodeValidate = false;
          // this.checkBeneBankDetails = false;
          // this.iBanorNot="N";
        }
      }
      
  });
}
}
