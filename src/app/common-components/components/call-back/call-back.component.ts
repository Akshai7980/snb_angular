import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {MyTaskService} from 'src/app/mytask/services/my-task.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-call-back',
  templateUrl: './call-back.component.html',
  styleUrls: ['./call-back.component.scss']
})
export class CallBackComponent implements OnInit {
  btnLabel = '';
  showErrorCase = false;
  showSuccessCase = false;
  showInquicryCase = false;
  showOngoingCallCase = true;
  rootScopeData:RootScopeDeclare=RootScopeData;
  remainingTime:any;
  isLoadingCompelete = true;
  countDownIntrvl : any;
  callBackStatus:any;
  @Input() callBackParams:any;
  @Input() beneSummary:any;
  @Input() authorizeParams:any
  @Input() pageName:any
  @Input () ChannelId: any
  beneActivationParams:any=[];
  beneSummaryParams: any=[];
  callNumber:string="";
  called=0;
  disabled=false;
  @Output() onSuccessEmit = new EventEmitter;
  @Output() clickCancelCallBck = new EventEmitter;
  constructor(private commonService:CommonService,private myTaskService:MyTaskService,private translateService: TranslateService) { }

  ngOnInit(): void {
    this.generateIVRCall();
    this.countDown();
  }
  
  ngOnDestroy(): void {
    this.clearCountDown();
  }

  countDown() {
    this.remainingTime = this.rootScopeData.callBackTimerSeconds;
    let that  = this;
    this.setBtnLabel();
    this.countDownIntrvl = window.setInterval(function(){
      if(!--that.remainingTime) {
        that.clearCountDown();
        that.setBtnLabel();
      }else {
        that.setBtnLabel();
      }
    }, 1000);
  }

  clearCountDown() {
    window.clearInterval(this.countDownIntrvl);
  }

  generateIVRCall(){ 
    this.isLoadingCompelete=false;
    this.ChannelId = this.ChannelId ? this.ChannelId : "DESKTOP";
    let params={
      unitId : this.rootScopeData.userInfo.UNIT_ID,
      cif : this.rootScopeData.userInfo.sCustNo,
      mobileNo : "",
      loginId : this.rootScopeData.userInfo.loginID,
      PageCall : this.pageName,
      ChannelId : this.ChannelId
    }
    this.commonService.generateIVRCall(params).subscribe(
      (data: any) => {
        this.isLoadingCompelete=true; 
        if(data){
          params.mobileNo = data.mobileNo ? data.mobileNo : this.rootScopeData.userInfo.unmaskedMobileNumber;    
          this.callNumber = data.mobileNo ? data.mobileNo : this.rootScopeData.userInfo.unmaskedMobileNumber;    

          if(data.res_ErrorMessage === "Success"){
            this.inquireCallBack(data.GenerateCallbackResponse.success.uniqueId);
          }
          else if(data.errorCode ==="99955"){
            this.btnLabel="LBL_CALL_AGAIN";
            this.showOngoingCallCase=false;
            this.showErrorCase = true;
            this.clearCountDown();
            this.rootScopeData.validationErrorToast = true;
            this.rootScopeData.validationToastMessage =data.errorMessage;           
            // this.inquireCallBack(data.GenerateCallbackResponse.success.uniqueId);
          }
          else{
            this.btnLabel="LBL_CALL_AGAIN";
            this.showOngoingCallCase=false;
            this.showErrorCase = true;
            this.clearCountDown();
            // this.inquireCallBack(data.GenerateCallbackResponse.success.uniqueId);
          }
        }else{
          this.btnLabel="LBL_CALL_AGAIN";
          // this.rootScopeData.showSystemError = true;
          // this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
          this.clearCountDown();
        }
      }, (error: any) => {
        this.isLoadingCompelete=true;
        // this.rootScopeData.showSystemError = true;
        // this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
        this.clearCountDown();
      }

    )
  }

  inquireCallBack(uniqueId:any){
    this.isLoadingCompelete=false;
    this.ChannelId = this.ChannelId ? this.ChannelId : "DESKTOP";
    let params = {
      PageCall : this.pageName
    }
    this.commonService.inquireIVRCallBack(uniqueId,this.rootScopeData.userInfo.UNIT_ID,this.ChannelId,params).subscribe(
      (data: any) => {
        this.isLoadingCompelete=true;
       // debugger;
         if(data && data.res_ErrorMessage === "Sucess"){
          let status = data.InquireCallbackResponse.success.recordStatus;
          // alert(status);
          // if(status === "DISCONNECT" || status === "BUSY" || status === "NOANSWER" || status === "FAILED"){
          //   this.callBackStatus = "N";  
          //   this.showErrorMsg();
          // }
          if(status === "PROCESSED"){
            let that = this;
            this.showOngoingCallMsg();
            let intr = window.setInterval(function(){
              if(that.remainingTime <= 0) {
                // that.remainingTime = that.rootScopeData.callBackTimerSeconds;
                that.countDown();
                that.inquireCallBack(uniqueId);
                window.clearInterval(intr);
              }
            }, 1000);
          }else if(status === "CONFIRMED"){
            this.callBackStatus = "Y";
            this.clearCountDown();
            this.showSuccessMsg();
            //validation for only beneactivation
            switch (this.pageName) {
              case 'changePassword':
                  break;
              case "sadadBiller":
                  break;
              case "additionalAccount":
                  break;
              case "payrollOnboarding":
                  break;
               case "activateCard":
                  break;
              case "reissueCard":
                  break;
              case "newMadaCard":
                  break;    
              default:
                this.callBeneActivation();
                  break;
            }
          
            // if(this.pageName !== 'changePassword' || this.pageName !== "sadadBiller"){
            //   this.callBeneActivation();
            // }
			      this.remainingTime = 1;
            this.onSuccessEmit.emit();
          }else if(status === "NEW" || status === "QUEUED"){
            // this.callBackStatus = "N";  
            // this.showEnquireAgainMsg();
			      // this.remainingTime = 1;
            let that = this;
            this.showOngoingCallMsg();
            let intr = window.setInterval(function(){
              if(that.remainingTime <= 0) {
                // that.remainingTime = that.rootScopeData.callBackTimerSeconds;
                that.countDown();
                that.inquireCallBack(uniqueId);
                window.clearInterval(intr);
              }
            }, 1000);
          }else { //status === "DISCONNECT" || status === "BUSY" || status === "NOANSWER" || status === "FAILED"
            this.callBackStatus = "N";  
            this.showErrorMsg();
			      this.remainingTime = 1;
          }
          
        }else{
       
         this.btnLabel="LBL_CALL_AGAIN";
          this.showOngoingCallCase=false;
          this.showErrorCase = true;
          this.clearCountDown();
        }
        //this.remainingTime = 1;
       
      }, (error: any) => {
        this.isLoadingCompelete=true;
      }
    )
  }

  callBeneActivation(){
    this.isLoadingCompelete=false;
    let languageCode = "";
    if( this.rootScopeData.userInfo.mLanguage == "en_US")
    {
        languageCode = "1";
    }
    else{
      languageCode = "3";
    }
    
    if(this.pageName === "sadadBiller"){
    this.beneActivationParams[0] = {
      "callBackStatusFlag": this.callBackStatus,
      "BeneId":this.callBackParams.beneId,
      "OdRefNo":this.callBackParams.refNumber,
      "auth":"N",
      "functionCode":"SADLB",
      "subProduct":"SADLIBR"
     }
    }
    if(this.pageName === "beneficiary"){
      let params;

      for(let i=0;i<this.callBackParams.length;i++){
        params={
          "callBackStatusFlag": this.callBackStatus,
          "BeneId":this.callBackParams[i].beneId ? this.callBackParams[i].beneId : this.callBackParams[i].beneAliasName,
          "OdRefNo":this.callBackParams[i].refNumber ? this.callBackParams[i].refNumber : this.callBackParams[i].odLibRefNo,          
          "auth":"Y",
          "functionCode":"CRBENE",
          "subProduct":"BENE",
          "languageCode":languageCode
          }
          let beneSummaryParams=params;
          this.beneActivationParams.push(beneSummaryParams)
      }
     
    //   params={
    //   "callBackStatusFlag": this.callBackStatus,
    //   "BeneId":this.callBackParams.beneId ? this.callBackParams.beneId : this.callBackParams[0].beneAliasName,
    //   "OdRefNo":this.callBackParams.refNumber ? this.callBackParams.refNumber : this.callBackParams[0].odLibRefNo,
    //   // "BeneId":this.callBackParams[i].beneAliasName,
    //   // "OdRefNo":this.callBackParams[i].odLibRefNo,
    //   "auth":"Y",
    //   "functionCode":"CRBENE",
    //   "subProduct":"BENE",
    //   "languageCode":languageCode
    //   }
    //   let beneSummaryParams=params;
    //   this.beneActivationParams.push(beneSummaryParams)
     }
    this.commonService.beneActivation(this.beneActivationParams).subscribe(
      (response: any) => {
        this.isLoadingCompelete=true;
        if(response.data.Status === "Success"){
        let labelMsg = this.translateService.instant('LBL_BENEFICIARY_ACTIVATED')
        this.rootScopeData.showSystemError = true;        
        this.rootScopeData.toastMessage = labelMsg;
        }else{
          let labelerrorMsg = this.translateService.instant('LBL_BENEFICIARY_NOT_ACTIVATED')
          this.rootScopeData.showSystemError = true;
          this.rootScopeData.toastMessage = labelerrorMsg;
        }
        // if(this.rootScopeData.callBackOTPEntitlement.beneRegistrationWorkflow === 'N'){
        //   this.authorizeAddedBeneficiary();
        // }
      }, (error: any) => {
        this.isLoadingCompelete=true;
        let labelerrorMsg = this.translateService.instant('LBL_BENEFICIARY_NOT_ACTIVATED')
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = labelerrorMsg;
      }
    )
  }

  authorizeAddedBeneficiary(){
    this.isLoadingCompelete = false;
    this.myTaskService.authorizeBeneficiaryAPICall(this.authorizeParams).subscribe(
      response =>{
        this.isLoadingCompelete = true;
        // let vdata:any = [];
        // vdata = response;          
        // if(vdata.dataValue.STATUS === "Success"){
        //   this.rootScopeData.showSystemError = true;
        //   this.rootScopeData.toastMessage = "LBL_BENEFICIARY_AUTHORIZED";
        // }
       
      },
      error =>{
        this.isLoadingCompelete = true;
    
      }
    )
  }

  setBtnLabel() {
    this.btnLabel = this.remainingTime + ' Sec';
    if(!this.remainingTime && (this.showErrorCase || this.showInquicryCase)) {
      this.btnLabel = "LBL_CALL_AGAIN";

      // this.showErrorMsg();
      // this.showOngoingCallMsg();
    }
  }

  showErrorMsg() {
    this.showSuccessCase = false;
    this.showErrorCase = true;
    this.showOngoingCallCase = false;
    this.showInquicryCase = false;
  }

  showOngoingCallMsg() {
    this.showSuccessCase = false;
    this.showErrorCase = false;
    this.showOngoingCallCase = true;
    this.showInquicryCase = false;
  }
  showEnquireAgainMsg() {
    this.showSuccessCase = false;
    this.showInquicryCase = true;
	this.showErrorCase = false;
    this.showOngoingCallCase = false;
  }
  
  showSuccessMsg() {
    this.showSuccessCase = true;
    this.showErrorCase = false;
    this.showOngoingCallCase = false;
	this.showInquicryCase = false;
  }

  callAgain(data:any){
    this.called=this.called+1
    if(data === "LBL_CALL_AGAIN" && this.called<=2){
      this.showOngoingCallCase = true;
      this.showSuccessCase = false;
      this.showErrorCase = false;
      this.generateIVRCall();
      this.countDown();
    }else{
      this.disabled=true   
      // this.showOngoingCallCase = false;
      // this.showSuccessCase = false;
      // this.showErrorCase = true;
    }
    if(this.called>=2){
      this.disabled=true
    }
  }

  cancelCallback(){
    this.clickCancelCallBck.emit()
  }
  
}


