import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { email, mobileNumberValidation, NumberValidation_Omit_Char } from 'src/app/utility/common-utility';
import { PaymentsServiceService } from '../../services/payments-service.service';

@Component({
  selector: 'app-fund-transfer-local-quickpay',
  templateUrl: './fund-transfer-local-quickpay.component.html',
  styleUrls: ['./fund-transfer-local-quickpay.component.scss']
})
export class FundTransferLocalQuickpayComponent implements OnInit {

  @Input() isShowToggle: boolean = true;
  @Output() backclick = new EventEmitter;
  @Output() verifyClick=new EventEmitter;
  @Output() amountChanged = new EventEmitter;
  rootScopeData: RootScopeDeclare = RootScopeData
  backbutton = true;
  @Input() onNextVerify: boolean = false;
  paymentActiveTab = "IBAN";
  transferAmount = "";
  @Output() hideProceed = new EventEmitter<any>();
  @Output() quickTransferDetailsEmit = new EventEmitter<any>();
  @Input() recipientBankArrayDataSource:any={};
  @Input() quickTransferDetailsObj:any={
    quickTransferMenuId:"",
    quickTransferReceipientBank:"",
    quickTransferReceipientBankError:"",
    quickTransferAmount:"",
    quickTransferAmountError:"",
    quickTransferIBAN:"",
    quickTransferMobileNum: "",
    quickTransferNationalID: "",
    quickTransferEmailID: "",
    quickTransferIBANError:"",
    quickTransferMobileNumError: "",
    quickTransferNationalIDError: "",
    quickTransferEmailIDError: "",
    quickTransferBeneName: "",
    quickTransferBeneNameError: "" 
  };
 @Input() displayList:any=[]
 isEmailValidation=true;
 @Output() hideProceedBtn = new EventEmitter<any>();
 @Input() accountDetails : any;
  @Input() bankverifyError: boolean = false;
  @Output() bankSwiftCOde = new EventEmitter<any>();
  bankCode: any;
  constructor(private paymentService: PaymentsServiceService) { }

 

  ngOnInit(): void { 
    this.bankverifyError = false;
  }

  
  ngOnChanges(){
    if(this.bankverifyError)
    {
     this.rootScopeData.validationErrorToast=true;
     this.rootScopeData.validationToastMessage = "LBL_PLEASE_SELECT_VALID_BANK";
    }
  }

  recipientBankChanged(event: any) {
    this.bankverifyError = false;
    if(this.quickTransferDetailsObj && this.quickTransferDetailsObj.quickTransferReceipientBank){
      this.quickTransferDetailsObj.quickTransferReceipientBankError = "";
    }
  }

  onQTiban() {
    if(this.quickTransferDetailsObj.quickTransferIBAN.includes("SA") === true || this.quickTransferDetailsObj.quickTransferIBAN.includes("sa") === true){
      this.quickTransferDetailsObj.quickTransferIBAN = this.quickTransferDetailsObj.quickTransferIBAN.substring(2);
    }
    if(this.quickTransferDetailsObj && this.quickTransferDetailsObj.quickTransferIBAN){
      this.quickTransferDetailsObj.quickTransferIBANError = "";
      let iBAN = `SA${this.quickTransferDetailsObj.quickTransferIBAN}`
      this.quickTransferDetailsEmit.emit({value: iBAN, proxy: "LBL_ACCOUNT_NUMBER_IBAN", type: "IBAN"});
    }
  }

  onQTMobile() {
    if(this.quickTransferDetailsObj && this.quickTransferDetailsObj.quickTransferMobileNum){
      this.quickTransferDetailsObj.quickTransferMobileNumError = "";
      this.quickTransferDetailsEmit.emit({id:14, value: this.quickTransferDetailsObj.quickTransferMobileNum, proxy: "LBL_MOBILE_NUMBER", type: "Mobile",bankcode : this.bankCode});
    }
  }

  onQTnational() {
    if(this.quickTransferDetailsObj && this.quickTransferDetailsObj.quickTransferNationalID){
      this.quickTransferDetailsObj.quickTransferNationalIDError = "";
      this.quickTransferDetailsEmit.emit({id:13, value: this.quickTransferDetailsObj.quickTransferNationalID, proxy: "LBL_NATIONAL_ID", type: "NationalId",bankcode : this.bankCode});
    }
  }

  onQTEmail() {
    this.isEmailValidation = email(this.quickTransferDetailsObj.quickTransferEmailID);
    this.quickTransferDetailsObj.quickTransferEmailIDError = "";
    if(this.isEmailValidation)
    {
      if(this.quickTransferDetailsObj && this.quickTransferDetailsObj.quickTransferEmailID){
        // this.quickTransferDetailsObj.quickTransferEmailIDError = "";
        this.quickTransferDetailsEmit.emit({id:12, value: this.quickTransferDetailsObj.quickTransferEmailID, proxy: "LBL_EMAIL_ID", type: "Email",bankcode : this.bankCode}); 
      }
    }else{
      this.hideProceedBtn.emit({hideProceedbtn: false});
    }
   
  }

  onQTBeneName() {
    if(this.quickTransferDetailsObj && this.quickTransferDetailsObj.quickTransferBeneName){
      this.quickTransferDetailsObj.quickTransferBeneNameError = "";
    }
  }

  amountOnBlur() {
    if(this.quickTransferDetailsObj && this.quickTransferDetailsObj.quickTransferAmount){
      this.quickTransferDetailsObj.quickTransferAmountError = "";
      if(this.transferAmount !== this.quickTransferDetailsObj.quickTransferAmount) {
        this.transferAmount = this.quickTransferDetailsObj.quickTransferAmount;
        this.amountChanged.emit(true);
      } else {
        this.amountChanged.emit(false);
      }
    }  
  }

  back(){
    this.backclick.emit();
  }

  displayContent(value: any) {
    this.quickTransferDetailsObj = {
      ...this.quickTransferDetailsObj,
      quickTransferMenuId: value,
      quickTransferIBAN:"",
      quickTransferMobileNum: "",
      quickTransferNationalID: "",
      quickTransferEmailID: "",
      quickTransferIBANError:"",
      quickTransferMobileNumError: "",
      quickTransferNationalIDError: "",
      quickTransferEmailIDError: "",
      quickTransferBeneName: "",
      quickTransferBeneNameError: "",
    }
    this.paymentActiveTab = value;
    this.hideProceed.emit({hideProceed: true, details: this.quickTransferDetailsObj});
  }

  omit_special_char(val: any) {
    let k;
    k = val.charCode; 
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  validateNumber(val:any){
    return NumberValidation_Omit_Char(val);
  }
  numberOly(event:any){
    let k;
    k = event.charCode;
    return ((k >= 48 && k <= 57)) ;
  }
  onVerify() {
    this.bankverifyError = false;
    let isQuickTransferValid = true; 
    let stringToAmount = Number(this.quickTransferDetailsObj.quickTransferAmount)
    if(this.quickTransferDetailsObj && stringToAmount<1){
      isQuickTransferValid = false;
      this.quickTransferDetailsObj.quickTransferAmountError = "LBL_AMOUNT_NOT_VALID";
    }
    if(this.quickTransferDetailsObj && !this.quickTransferDetailsObj.quickTransferReceipientBank){
      isQuickTransferValid = false;
      this.quickTransferDetailsObj.quickTransferReceipientBankError = "LBL_PLSE_CHOOSE_ON_OPTION";
    }
    if(isQuickTransferValid) {
      this.verifyClick.emit()
      this.quickTransferDetailsEmit.emit(this.quickTransferDetailsObj);
         
      // if(this.paymentActiveTab == "IBAN"){
        
      //   this.quickTransferDetailsObj.quickTransferMenuId = "IBAN";
      // }
      //this.onNextVerify = true;
      this.backbutton = false;
    }

  }

  checkPhoneNumberValidate(val:any){
    return mobileNumberValidation(val);
  }

  selectedBank(event:any){
    this.bankCode = event.bankCode;
    let swiftCode = {swithcode:event.swiftCode}
    this.bankSwiftCOde.emit(swiftCode)
  }
  //onPasteEvent(event:any)
   // {
    //let pastedNAtionalId;
    //let clipboardData = event;
    //pastedNAtionalId = clipboardData;
    //if(pastedNAtionalId){
    //this.quickTransferDetailsObj.quickTransferNationalID  = pastedNAtionalId.replace(/[a-zA-Z\s\!\@\#\$\%\^\&\*\)\(+\=\._-]/g,'')  
    //}  
    
   //}
}
