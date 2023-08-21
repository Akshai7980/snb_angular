import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MaskCardNumberPipe } from 'src/app/pipes/mask-card-number.pipe';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';

@Component({
  selector: 'app-activate-card-review',
  templateUrl: './activate-card-review.component.html',
  styleUrls: ['./activate-card-review.component.scss'],
})
export class ActivateCardReviewComponent implements OnInit {
  authOptions: any = [];

  cardDetailsObj: any = {};
  receiptObject: any = {};
  authDataObj: any = {};
  flexAuthResp: any = {};

  url: string = systemproperty.termsAndConditionsForPayments;
  otpError: string = '';
  userOtpValue: string = '';
  secAuthRef: string = '';
  noAuthorError: string = '';
  pageName: string = 'activateCard';

  isLoadingCompelete: boolean = true;
  showCardDetails: boolean = false;
  showAuthentication: boolean = false;

  @Output() getSubmitEmit = new EventEmitter<any>();
  @Output() getProceedEmit = new EventEmitter<any>();
  @Output() cancelBtn = new EventEmitter<boolean>();

  rootScopeData: RootScopeDeclare = RootScopeData;
  showAuthorization: boolean = false;

  constructor(private readonly cardService: CardsService) {}

  ngOnInit(): void {
    this.constructCardDetailsTable();
    this.ActivateCardFlexiAuth();
  }

  constructCardDetailsTable() {
    const maskCardNumber = new MaskCardNumberPipe();
    this.rootScopeData.creditCardListDetail.cardId = maskCardNumber.transform(
      this.rootScopeData.creditCardListDetail.cardId
    );

    [this.rootScopeData.creditCardMoreActionList].forEach((element: any) => {
      element.cardId = element?.cardId ? element.cardId : '--';
      element.holderName = element?.holderName ? element.holderName : '--';
      element.cardType = element?.cardType ? element.cardType : '--';
      element.samaStatus = element?.samaStatus ? element.samaStatus : '--';
      element.expiryDate = element?.expiryDate ? element.expiryDate : '--';
    });

    this.cardDetailsObj = {
      title: 'LBL_CARD_DETAILS',
      data: [this.rootScopeData.creditCardListDetail],
      fieldDetails: [
        {
          dispKey: 'LBL_NAME_ON_CARD',
          dataKey: 'holderName',
        },
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'cardId', //
        },
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: 'cardType', //
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'samaStatus', //
        },
        {
          dispKey: 'LBL_EXPIRY_DATE',
          dataKey: 'expiryDate', //
        },
      ],
    };
  }

  callBackSuccess() {
    this.showAuthentication = true;
  }

  getCanelBtnClick() {
    this.cancelBtn.emit(false);
  }

  getAuthorizationEmit(authDetails: any) {
    this.authDataObj = authDetails;
  }

  onSecondFactorValue(secondFactorValue: any) {
    this.secAuthRef = secondFactorValue.data.secfRefNo;
  }

  getAccountData(type: string) {
    if (type === 'iconClick') {
      const data = {
        canViewReceipt: false,
      };
      this.getProceedEmit.emit(data);
    }
  }

  getOtpValue(otp: any) {
    if (otp) {
      if (otp.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otp;
      this.toSubmit();
    } else {
      this.userOtpValue = '';
    }
  }

  toCancel() {
    const data = {
      canViewReceipt: false,
    };
    this.getSubmitEmit.emit(data);
  }

  toSubmit() {
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
      cif: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo?.sCustNo
        : '',
      userOtpValue: this.userOtpValue ? this.userOtpValue : '',
      secAuthRef: this.secAuthRef ? this.secAuthRef : '',
      SEL_PARSED_RULE_ID: this.authDataObj?.selectedAprover?.PARSED_RULE_ID
        ? this.authDataObj.selectedAprover.PARSED_RULE_ID
        : '',
      SELECTION_FLAG:
        this.authDataObj?.selectedAprover &&
        this.authDataObj?.selectedAprover?.AUTH_NAME !== 'Any'
          ? 'Y'
          : 'N',
      sefAuthFlag: this.flexAuthResp?.selfAuth
        ? this.flexAuthResp.selfAuth
        : '',
      CARD_NUM: this.rootScopeData.creditCardListDetail?.cardId
        ? this.rootScopeData.creditCardListDetail.cardId
        : '',
      EXPIRY_DATE: this.rootScopeData.creditCardListDetail?.expiryDate
        ? this.rootScopeData.creditCardListDetail.expiryDate
        : '',
      canViewReceipt: true,
      cardDetail: this.rootScopeData?.creditCardListDetail
        ? this.rootScopeData.creditCardListDetail
        : '',
      authData: this.authDataObj ? this.authDataObj : '',
      flexAuthResp: this.flexAuthResp ? this.flexAuthResp : '',
      CARD_TYPE: this.rootScopeData.creditCardListDetail?.cardType
        ? this.rootScopeData.creditCardListDetail.cardType
        : '',
      CARD_STATUS: this.rootScopeData.creditCardListDetail?.samaStatus
        ? this.rootScopeData.creditCardListDetail?.samaStatus
        : '',
      CARD_NAME: this.rootScopeData.creditCardListDetail?.holderName
        ? this.rootScopeData.creditCardListDetail?.holderName
        : '',
    };
    this.getSubmitEmit.emit(data);
  }

  ActivateCardFlexiAuth() {
    this.isLoadingCompelete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo.sCustNo
        : '',
      productCode: 'CORESVS',
      subProdCode: 'CARDACT',
      funcCode: 'CDACTFNC',
      amount: this.rootScopeData.creditCardListDetail?.balance
        ? this.rootScopeData.creditCardListDetail.balance
        : '',
      accNo: this.rootScopeData.creditCardListDetail?.cardId
        ? this.rootScopeData.creditCardListDetail.cardId
        : '',
      pymntCurrency: '',
      debitCurrency: '',
    };
    this.cardService.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (
          res &&
          res.data &&
          res?.data?.authList &&
          res?.data?.authList?.length > 0 &&
          res.data.flexiAuth == 'true'
        ) {
          this.showAuthorization = true;
          this.authOptions = res.data.authList;
        }
        if (res && res.data) {
          this.flexAuthResp = res.data;
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }
}
