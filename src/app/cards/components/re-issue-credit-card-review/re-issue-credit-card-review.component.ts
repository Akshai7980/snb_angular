import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-re-issue-credit-card-review',
  templateUrl: './re-issue-credit-card-review.component.html',
  styleUrls: ['./re-issue-credit-card-review.component.scss'],
})
export class ReIssueCreditCardReviewComponent implements OnInit {
  authorsList: any = [];

  reIssueDetailsObj: any = {};
  authDataObj: any = {};

  noAuthorError: string = '';
  otpError: string = '';
  secAuthRef: string = '';
  userOtpValue: any = '';
  url: string = '';
  pageName: string = 'reissueCard';
  showAuthorization: boolean = false;

  isLoadingCompelete: boolean = true;

  rootScopeData: RootScopeDeclare = RootScopeData;

  @Output() getSubmitEmit = new EventEmitter<any>();
  isFlexiAuth: boolean = false;

  constructor(private readonly cardService: CardsService) {
    this.rootScopeData.changeHeading = 'Review';
  }

  ngOnInit(): void {
    this.reIssueDetailsObj = {
      title: 'LBL_CREDIT_CARD',
      data: [this.rootScopeData.accDetailsObject],
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'maskedCardId',
        },
        {
          dispKey: 'LBL_CARD_NAME',
          dataKey: 'holderName',
        },
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: 'cardType',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'samaStatus',
        },
        {
          dispKey: 'LBL_BALANCE_AMOUNT',
          dataKey: 'remainingCashLimit',
          dataKeySupport: 'currency', // OF team itself. // Divya Krishna.
        },
      ],
    };
    this.getAuthorization();
  }

  getAuthorization() {
    this.isLoadingCompelete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo.sCustNo
        : '',
      amount: this.rootScopeData?.creditCardMoreActionList?.balance
        ? this.rootScopeData.creditCardMoreActionList.balance
        : '',
      accNo: this.rootScopeData?.creditCardMoreActionList?.accountId
        ? this.rootScopeData.creditCardMoreActionList.accountId
        : '',
      pymntCurrency: this.rootScopeData.creditCardMoreActionList?.currency
        ? this.rootScopeData.creditCardMoreActionList?.currency
        : '',
      debitCurrency: this.rootScopeData.creditCardMoreActionList?.currency
        ? this.rootScopeData.creditCardMoreActionList?.currency
        : '',
      productCode: 'CORESVS',
      subProdCode: 'CRDREISSU',
      funcCode: 'REISEFNC',
    };
    this.cardService.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        this.isFlexiAuth = JSON.parse(res.data.flexiAuth);
        if (
          res &&
          res.data &&
          res.data.authList &&
          res.data.authList.length > 0
        ) {
          this.authorsList = res.data.authList;
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
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
      canSubmit: true,
      cardDetails: this.rootScopeData.accDetailsObject,
      authData: this.authDataObj,
      PARAM2: this.userOtpValue ? this.userOtpValue : '',
      PARAM1: this.secAuthRef ? this.secAuthRef : '',
      SEL_PARSED_RULE_ID: this.authDataObj?.selectedAprover?.PARSED_RULE_ID
        ? this.authDataObj?.selectedAprover?.PARSED_RULE_ID
        : '',
      SELECTION_FLAG:
        this.authDataObj?.selectedAprover?.AUTH_NAME === 'Any' ? 'N' : 'Y',
      INPUT_CIF_NO: this.rootScopeData.creditCardListDetail.cifNo
        ? this.rootScopeData.creditCardListDetail.cifNo
        : '',
      INPUT_UNIT_ID: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      INPUT_DEBIT_ORG_ACC_NO: this.rootScopeData?.accDetailsObject?.accountId
        ? this.rootScopeData.accDetailsObject.accountId
        : '',
      INPUT_VERSION_NO: '1',
      CARD_NUM: this.rootScopeData?.accDetailsObject?.cardId
        ? this.rootScopeData.accDetailsObject.cardId
        : '',
      CARD_NAME: this.rootScopeData.creditCardListDetail.holderName
        ? this.rootScopeData.creditCardListDetail.holderName
        : '',
      CARD_STATUS: this.rootScopeData.accDetailsObject.samaStatus
        ? this.rootScopeData.accDetailsObject.samaStatus
        : '',
      CARD_TYPE: this.rootScopeData.creditCardListDetail.cardType
        ? this.rootScopeData.creditCardListDetail.cardType
        : '',
      BALANCE: this.rootScopeData.creditCardListDetail.balance
        ? this.rootScopeData.creditCardListDetail.balance
        : '',
      CURRENCY: this.rootScopeData.creditCardListDetail.currency
        ? this.rootScopeData.creditCardListDetail.currency
        : '',
      isFlexiAuth: this.isFlexiAuth,
    };
    this.getSubmitEmit.emit(data);
  }

  callBackSuccess() {
    this.showAuthorization = true;
  }

  getCanelBtnClick() {
    const data = {
      canSubmit: false,
      canProceed: false,
    };
    this.getSubmitEmit.emit(data);
  }
}
