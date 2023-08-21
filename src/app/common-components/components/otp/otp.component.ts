import { Component,EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  @Output() getOtpClick = new EventEmitter();
  @Output() onTwoAuthClick = new EventEmitter();
  @Input() isOtpValid:any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingCompelete = true;
  isauthoriseTextValid: boolean = true;
  authType: string = "";
  securedRefNo: string = "";
  securedText: string = "";
  securedToken: string = "";
  otpValue:any;
  remainingTime=11;
  showTimer:any
  isShownOtp:boolean=false;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:""
  }
  constructor(private commonService:CommonService) { }

  ngOnInit(): void {
    this.secondAuthentication_click();
  }

  countDown() {
    let that  = this; 
    setInterval(()=>{
      if(!--that.remainingTime){
        this.showTimer = that.remainingTime;
      }
      else{
        if(that.remainingTime >= 0)
        {
          this.showTimer = that.remainingTime;
        }
        else{
          this.isShownOtp=false;
          this.remainingTime = 11;
          return;
        }       
      }
    },1000)
  }
 
  shownOtp(){
    this.isShownOtp=true;
    this.countDown();
  }

  secondAuthentication_click() {
    this.isLoadingCompelete = false;
    this.commonService.secondFactorAuthApiCall(this.initReqParam).subscribe(
      (data:any) => {
        this.isLoadingCompelete = true;
        this.onTwoAuthClick.emit(data);
        this.isauthoriseTextValid = false;
        this.authType = data.authType;
        this.securedRefNo = data.secfRefNo;
        this.securedText = data.secfText;
        this.securedToken = data.token;
        
        
      }, error => {
        this.isLoadingCompelete = true;
        // this.rootScopeData.showSystemError = true;
      }

    )
  }

  numberOnly(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  sendOtp(event:any){
    if(event.target.value.length === 4){
      this.getOtpClick.emit(event.target.value);
    }
    this.isOtpValid = (this.otpValue.length === 4) ? false:true;
  }


}
