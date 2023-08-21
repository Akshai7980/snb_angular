import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-credit-card-payment-review',
  templateUrl: './credit-card-payment-review.component.html',
  styleUrls: ['./credit-card-payment-review.component.scss'],
})
export class CreditCardPaymentReviewComponent implements OnInit {
  fromDataColumns: any = [
    'AccountNumber',
    'Nickname',
    'FullName',
    'Status',
    'Balance',
  ];
  cardDataColumns: any = [
    'cardNumber',
    'Nickname',
    'cardType',
    'Status',
    'balanceAmount',
  ];
  from: any = [
    {
      name: 'Dameer Ahsan',
      number: 'SA1010 0100 1000 0000 0011',
      shortName: 'Dameer',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
  ];

  card: any = [
    {
      number: '1010 XXXX XXXX 0011',
      shortName: 'Dameer',
      type: 'MADA Card',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
  ];

  authOptions: any = [
    {
      OD_LEVEL: '',
      OD_GCIF: '',
      OD_USER_NO: '',
      AUTH_NAME: 'Vinay Myer',
      OD_ROLE_DESC: '',
      PARSED_RULE_ID: '',
    },
    {
      OD_LEVEL: '',
      OD_GCIF: '',
      OD_USER_NO: '',
      AUTH_NAME: 'Vimal Singh',
      OD_ROLE_DESC: '',
      PARSED_RULE_ID: '',
    },
    {
      OD_LEVEL: '',
      OD_GCIF: '',
      OD_USER_NO: '',
      AUTH_NAME: 'Aman Malih',
      OD_ROLE_DESC: '',
      PARSED_RULE_ID: '',
    },
  ];
  noAuthorError: string = '';
  authDataObj: any = {};
  secAuthRef: any;
  otpError: string = '';
  userOtpValue: any;
  url: string = '';
  @Output() getSubmitEmit = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  getAuthorizationEmit(authDetails: any) {
    this.authDataObj = authDetails;
  }

  onSecondFactorValue(secondFactorValue: any) {
    this.secAuthRef = secondFactorValue.data.secfRefNo;
  }

  getOtpValue(otp: any) {
    if (otp) {
      if (otp.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otp;
    } else {
      this.userOtpValue = '';
    }
  }

  toCancel() {}

  toModify() {}

  toSubmit() {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    const data = {
      cardDetail: '',
      refNumber: 'T123456789012345',
      authData: this.authDataObj,
      canViewReceipt: true,
    };
    this.getSubmitEmit.emit(data);
  }
}
