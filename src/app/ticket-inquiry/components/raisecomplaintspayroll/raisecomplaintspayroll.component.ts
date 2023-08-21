import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MatSelectModule } from '@angular/material/select';
import { email, mobileNumberValidation, omit_special_char } from 'src/app/utility/common-utility';
// import { TicketServiceService } from '../../services/ticket-service.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
// import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
// import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-raisecomplaintspayroll',
  templateUrl: './raisecomplaintspayroll.component.html',
  styleUrls: ['./raisecomplaintspayroll.component.scss']
})
export class RaisecomplaintspayrollComponent implements OnInit {
  isChecked = "recfund"
  NonReceiptofFund:string = "LBL_NON_RECEIPT_FUND"
  ReceivedIncorrectAmount:string = "LBL_RECEIVED_INCORRECT_AMT"
  rootScopeData: RootScopeDeclare = RootScopeData;
  debitAccountDetailsObj: any
  isLoadingCompelete = false;
  shownSearchFlag = true;
  DebitClearFlag = false;
  router: any;
  mobNumInvalid:boolean=false;
  mobNumber:any;
  maxDate=new Date() ;
  dateErr = false;
  retentionDate: any;
  clearFlag=false;
  showFeeDetails:boolean=false;
  hideBtn:boolean=false;
  review : boolean =false;
  showReadOly:boolean=false;

  @Input() transferdirection:any=['Incoming','Outgoing'];
  isReadOly:boolean=false
  compTypeObj:any={
    mobNum:'',
    heldamount:'',
    filename:'',
    claimdesc:'',
    type:'Held Amount Not Release',
    retentionDate:''
  }
  errObj:any={
    mobErr:'',
    amountErr:'',
    fileErr:'',
    dateErr:''

  }
  @Output() isProccedValue= new EventEmitter()
  @Output() restClickedFun= new EventEmitter()

  
  constructor(public datepipe: DatePipe) { }

  ngOnInit(): void {

  } 
  // displayContent(value: any) {
  //   debugger;
  //   this.isChecked = value
  //   if(this.isChecked == 'recfund'){
  //     this.compTypeObj.type="Non Receipt Of Fund"
  //     // this.router.navigate(['ticketInquiry/RaiseComplaintType']);
  //   }else {
  //     this.compTypeObj.type="Receipt Incorrect Amount"
  //     // this.router.navigate(['ticketInquiry/RaiseComplaintType']);
  //   }
  // }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  validate(event:any,field:any){
    if(field==='mobNum'){
      let regExp=/^([0-9 +]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.mobErr=!this.compTypeObj.mobNum || !valid?'LBL_MOB_NUM':''
    }else if(field==='amount'){
      let regExp=/^([0-9 +]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.amountErr=!this.compTypeObj.heldamount || !valid?'LBL_PLEASE_ENTER_HELDAMOUNT':''
    }else if(field==='filename'){
      let regExp=/^([a-zA-Z0-9 ]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.fileErr=!this.compTypeObj.filename || !valid ? 'LBL_PLEASE_ENTER_FILE_NAME':''
    }
    // this.compTypeObj.dob=this.dob;
  }
  proceed(){
    this.errObj.amountErr=!this.compTypeObj.heldamount?'LBL_PLEASE_ENTER_HELDAMOUNT':'';
    this.errObj.mobErr=!this.compTypeObj.mobNum ?'LBL_MOB_NUM':'';
    this.errObj.fileErr=!this.compTypeObj.filename ? 'LBL_PLEASE_ENTER_FILE_NAME':'';
    this.errObj.dateErr=!this.compTypeObj.retentionDate? 'LBL_ENTER_DATE':'';
  if( !this.errObj.amountErr && !this.errObj.mobErr && !this.errObj.fileErr && !this.errObj.dateErr){
    this.review = true;
    this.rootScopeData.changeHeading = "Review";
    this.isProccedValue.emit(this.compTypeObj);
    this.isReadOly=true;
    this.hideBtn=true;
  }

  }
  numberOly(event:any){
    return mobileNumberValidation(event)
  }
  
  getDate(event:any){
    this.retentionDate=this.datepipe.transform(event,this.rootScopeData.userInfo.mDateFormat);
    this.compTypeObj.retentionDate= this.datepipe.transform(event, 'dd/MM/yyyy');
    this.errObj.dateErr = false;
  }
  reset()
  {
    
    // this.showDetail = false;
    this.restClickedFun.emit(true)
  }
}
