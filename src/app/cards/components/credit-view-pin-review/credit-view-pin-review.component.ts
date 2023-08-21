import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-credit-view-pin-review',
  templateUrl: './credit-view-pin-review.component.html',
  styleUrls: ['./credit-view-pin-review.component.scss'],
})
export class CreditViewPinReviewComponent implements OnInit {

  viewPinDetailsObj: any = {};
  authDataObj: any = {};
  flexAuthResp: any = {};
  
  @Input() cardDetails: any = {};

  authorsList: string[] = [];
  otpError: string = '';
  secAuthRef: string = '';
  userOtpValue: any = '';
  url: string = systemproperty.termsAndConditionsForPayments;
  isLoadingComplete: boolean = true;

  rootScopeData: RootScopeDeclare = RootScopeData;

  @Output() getSubmitEmit = new EventEmitter<any>();

  constructor(private cardService: CardsService) {}

  ngOnInit(): void {
    this.getAuthorizerList();
    this.viewPinDetailsObj = {
      title: 'LBL_CREDIT_CARD',
      data: [this.cardDetails],
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_NAME',
          dataKey: 'holderName',
        },
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'maskedCardId',
        },
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: 'cardType',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'statusDescription',
        },
        {
          dispKey: 'LBL_BALANCE_AMOUNT',
          dataKey: 'balance',
          dataKeySupport: 'currency'
        },
      ],
    };
  }

  getAuthorizerList() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData.userInfo?.sCustNo ? this.rootScopeData.userInfo?.sCustNo : '',
      productCode: 'CORESVS',
      subProdCode: 'CRDVWPIN',
      funcCode: 'VWPINFNC',
      amount: this.cardDetails.balance ? this.cardDetails.balance : '',
      accNo: this.cardDetails.accountId ? this.cardDetails.accountId : '',
      pymntCurrency: this.cardDetails.currency ? this.cardDetails.currency : '',
      debitCurrency: this.cardDetails.currency ? this.cardDetails.currency : ''
    };
    this.cardService.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res && res.data) {
          this.flexAuthResp = res.data;
        }
        if (res.data.flexiAuth == 'true') {
          this.authorsList = res.data.authList;
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  setAuthorizationDetails(authDetails: any) {
    this.authDataObj = authDetails;
  }

  setSecondFactorValue(secondFactorValue: any): void {
    this.secAuthRef = secondFactorValue.data.secfRefNo;
  }

  getOtpValue(otp: string): void {
    if (otp) {
      if (otp.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otp;
      this.submit();
    } else {
      this.userOtpValue = '';
    }
  }

  toCancel() {
    const data = {
      canSubmit: false,
    };
    this.getSubmitEmit.emit(data);
  }

  submit(): void {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    const data = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.cardDetails.cifNo,
      userOtpValue: this.userOtpValue,
      secAuthRef: this.secAuthRef,
      SEL_PARSED_RULE_ID: this.authDataObj.selectedAprover?.PARSED_RULE_ID ? this.authDataObj.selectedAprover?.PARSED_RULE_ID : "",
      SELECTION_FLAG: this.authorsList.length > 0 ? "Y" : "N",
      sefAuthFlag: this.flexAuthResp.selfAuth,
      flexiAuth: this.flexAuthResp.flexiAuth,
      CARD_NUM: this.cardDetails.cardId ? this.cardDetails.cardId : '',
      EXPIRY_DATE: this.cardDetails.expiryDate ? this.cardDetails.expiryDate : '',
      canSubmit: true,
      cardDetail: this.cardDetails,
      authData: this.authDataObj,
      CARD_STATUS: this.cardDetails.cardStatus?.description ? this.cardDetails.cardStatus?.description : '',
      BALANCE: this.cardDetails.balance ? this.cardDetails.balance : '',
      CURRENCY: this.cardDetails.currency ? this.cardDetails.currency : '',
      CARD_NAME: this.cardDetails.holderName ? this.cardDetails.holderName : ''
    };
    this.getSubmitEmit.emit(data);
  }

  onAccountSelect(event: any) {
    if (event = 'iconClick') this.toCancel();
  }
}
