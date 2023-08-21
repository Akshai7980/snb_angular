import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-additional-account-review',
  templateUrl: './additional-account-review.component.html',
  styleUrls: ['./additional-account-review.component.scss'],
})
export class AdditionalAccountReviewComponent implements OnInit {
  authDataObj: any;
  authorsList: string[] = [];
  authorError: string = '';
  secondFactorAuthRef: any;
  errorCode: string = '';
  otpValue: any;
  userOtpValue: any = '';
  @Input() otpError: string | undefined;
  @Input() additionalAccountDetails: any = {};
  flexiAuthData: any;
  secAuthRef: any;
  cancelbtn: boolean = true;
  showNext: boolean = true;
  @Output() getClickEmit = new EventEmitter<any>();
  @Output() cancelBtn = new EventEmitter<boolean>();
  sefAuthFlag: string = '';
  showAuthorization: boolean = false;
  url: string = '';
  authOptions: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  showAuthentication: boolean = false;
  additionalAccount = "additionalAccount";
  pageCall: any;
  authType: any;


  constructor(public accountService: AccountDetailsService) {}

  ngOnInit() {
    this.pageCall = "additionalAccount";
    this.url = systemproperty.termsAndConditionsLinkForBenUpload;
    this.getAuthorizationData();
  }

  getAuthorizationData() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.accountService.getAddAccAuthorization(params).subscribe(
      (res: any) => {
        this.sefAuthFlag = res.data.selfAuth;
        if (res) {
          if (res.data.flexiAuth == 'true') {
            this.showAuthorization = true;
            this.authOptions = res.data.authList;
          }
        }
      },
      (error) => {}
    );
  }

  setAuthorizationData(authorDetails: any): void {
    this.authDataObj = authorDetails;
  }

  getDatas(event: any, filed: string) {
    switch (filed) {
      case 'authorization':
        this.authDataObj = event;
        break;
    }
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.submit();
    } else {
      this.userOtpValue = '';
    }
  }

  toCancel() {
    this.cancelBtn.emit(this.cancelbtn);
  }

  submit() {
    this.showNext = true;
    const data = {
      param2: this.secAuthRef,
      param1: this.userOtpValue,
      authName:
        this.authDataObj &&
        this.authDataObj.selectedAprover &&
        this.authDataObj.selectedAprover.AUTH_NAME
          ? this.authDataObj.selectedAprover.AUTH_NAME
          : 'LBL_NOT_PROVIDED',
      authNote:
        this.authDataObj &&
        this.authDataObj.selectedAprover &&
        this.authDataObj.aproveNote
          ? this.authDataObj.aproveNote
          : 'LBL_NOT_PROVIDED',
      PARSED_RULE_ID:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.PARSED_RULE_ID
          : '',
      SELECTION_FLAG:
        this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
      sefAuthFlag: this.sefAuthFlag,
      showAuthField: this.showAuthorization,
      showNext: this.showNext,
      authType:this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    };
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    this.getClickEmit.emit(data);
  }

  callBackSuccess(){
    this.showAuthentication = true;
    
  }

  getCanelBtnClick(){
    this.cancelBtn.emit(this.cancelbtn);
  }

  getAuthType(val: any) {
    this.authType = val
  }
}