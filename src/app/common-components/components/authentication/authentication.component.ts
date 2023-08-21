import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/common-components/services/common.service'
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  isLoadingCompelete = true;
  isChecked = '';
  isShownOtp:boolean=false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  otpValue:any;
  remainingTime=11;
  showTimer:any;
  authtype:any;
  @Input() initParam:any
  @Input() otpError:any;
  @Input() tokenError:any;
  @Input() isShowOtpTokenToggle:boolean = true;
  @Output() onTwoAuthClick = new EventEmitter()
  @Output() getOtpClick = new EventEmitter()
  timeLeft: number = 0;
  interval:any;
  @Output() ontimeoutInterval = new EventEmitter()
  @ViewChild('selectInput') selectInput!: ElementRef;
  @Output() authenticationType=new EventEmitter();
  @Output() keyupData= new EventEmitter();
  @Output() tokenData = new EventEmitter();
  checkedOTPValidation: boolean = false;
  tokenCode:string ='';
  secfRefNo:any;
  sefcData:any;
  disableField : boolean = true;
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.authtype=this.rootScopeData.userInfo.mauthenticationType;
    if(this.authtype.indexOf('O') >= 0){
      this.isChecked = 'OTP';
      this.secondAuthentication_click();
      this.startTimer();
      this.isShownOtp = true;
    }else if(this.authtype.indexOf('ES') >= 0){
      this.isChecked = 'sftToken';
    }else if(this.authtype.indexOf('EH') >= 0){
      this.isChecked = 'Token';
    }
    this.authenticationType.emit(this.isChecked)
  }

  ngOnChanges(){
    if(this.otpError){
      this.selectInput.nativeElement.value = '';
      this.tokenCode = "";
    }
  }

  startTimer() {
    let setOtpTimerOut : any = +(this.rootScopeData.userInfo.otpExpry ? this.rootScopeData.userInfo.otpExpry : 30)
    this.timeLeft=setOtpTimerOut;
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);  
        this.isShownOtp=false;
        this.timeLeft=setOtpTimerOut;
      }
    },1000)
  }


  secondAuthentication_click() {
    let params={
      pdroductCode:this.initParam? this.initParam.pdroductCode:"",
      subPrdCode:this.initParam? this.initParam.subPrdCode:"",
      amt:this.initParam? this.initParam.amt:"",
      accNo:this.initParam? this.initParam.accNo:"",
      unitId:this.initParam? this.initParam.unitId:"",
      cif:this.initParam? this.initParam.cif:"",
      ccy:this.initParam? this.initParam.ccy:"",
      type:this.initParam && this.initParam.type? this.initParam.type: ""
    }
    this.isLoadingCompelete = false;
    this.commonService.secondFactorAuthApiCall(params).subscribe(
      (data:any) => {
        this.isLoadingCompelete = true;
        if(data.data && data.data.status == 'Success'){
          this.secfRefNo=data.data.secfRefNo
          this.sefcData=data
          this.onTwoAuthClick.emit(data);
        }else{
          this.isShownOtp = false;
          this.stopInterval();
        }
     
      }, error => {
        this.isLoadingCompelete = true;
        this.isShownOtp = false;
        this.stopInterval();
      }

    )
  }

  otpOnBlur(event:any){
    // if(event.target.value && event.target.value.length === 4){
    //   this.otpError = "";
    // }
    // else{
    //   this.otpError="Please Enter OTP";
    // }
    // this.getOtpClick.emit(event.target.value);
  }
  onBlurToken(event:any){
    // if(event.target.value && event.target.value.length === 6){
    //   this.otpError = "";
    // }
    // this.getOtpClick.emit(event.target.value);
    this.tokenCode=event.target.value;
    if(this.tokenCode.length===8){
      let dataObj={
        data:{
          secfRefNo:this.tokenCode
        }
      }
      this.onTwoAuthClick.emit(dataObj);
    }
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }

  displayContent(value:any){
  this.isChecked = value;
  this.tokenCode = ''
  if(this.isChecked==="OTP"){
    this.sefcData.data.secfRefNo=this.secfRefNo
    this.onTwoAuthClick.emit(this.sefcData);
  }
  this.authenticationType.emit(value)
  this.otpError=''
  }
  shownOtp(){
      this.isShownOtp=true;
      this.selectInput.nativeElement.value = '';
      this.secondAuthentication_click();
      this.startTimer();
  }

  stopInterval(){
    this.timeLeft = 0;
    clearInterval(this.interval);
  }
  sendData(event:any){
    // this.tokenCode = "";
    this.otpError = '';
    if(this.checkedOTPValidation === false){
      if(this.isChecked==='OTP'){
        if(this.selectInput.nativeElement.value && (this.selectInput.nativeElement.value).length===4){ 
          this.checkedOTPValidation = true;
          this.getOtpClick.emit(this.selectInput.nativeElement.value);
          this.keyupData.emit(true);
        }else{
          this.checkedOTPValidation = false;
        }
      }else if(this.isChecked==='Token'){
        if(this.selectInput.nativeElement.value && (this.selectInput.nativeElement.value).length===4){
          this.checkedOTPValidation = true;
          if(this.tokenCode.length === 8){
            this.getOtpClick.emit(this.selectInput.nativeElement.value);
            this.keyupData.emit(true);
          }else{
            this.otpError="LBL_TOKEN_ERR_MSG"
          }
        }else{
          this.checkedOTPValidation = false;
        }
      }
    }
    if((this.selectInput.nativeElement.value && (this.selectInput.nativeElement.value).length!==4)){ 
      this.checkedOTPValidation = false;
    }
 }

 setFieldStatus(event:any){
  this.otpError = "";
  if(event.target.value.length===8){
    this.disableField = false;
  }else{
    this.disableField = true;
    this.selectInput.nativeElement.value=''
  }
 }
}
