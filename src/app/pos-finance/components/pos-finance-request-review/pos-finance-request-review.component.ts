import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { PosFinanceService } from '../../services/pos-finance.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pos-finance-request-review',
  templateUrl: './pos-finance-request-review.component.html',
  styleUrls: ['./pos-finance-request-review.component.scss'],
})
export class PosFinanceRequestReviewComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  url: string = '';
  fromDataDetailsObj: any = {};
  clearFlag: boolean = false;
  setColumnWidth: boolean = true;
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any;
  showReceipt: boolean = false;
  receiptData: any;
  hideInitiateButton: boolean = true;
  posFinanceRequestDetails: any;
  posFinanceRequestDetailsList: any;
  isSelfAuth: boolean = false;
  authDetail: any = {};
  sefAuthFlag: string = '';
  authOptions: Array<object> = [];
  submitData: any;
  currencyFormator: any;
  authType: any;
  constructor(
    private router: Router,
    private posFinanceServices: PosFinanceService,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getAuthorizationData();
    this.posFinanceRequestDetails = this.rootScopeData.posFinanceRequestDetails;
    this.posFinanceRequestDetailsList =
      this.rootScopeData.posFinanceRequestDetailsList;

    if (JSON.stringify(this.posFinanceRequestDetails) === '{}') {
      this.router.navigate(['/posFinance']);
    }

    this.constructFromTable();
  }
  constructFromTable() {
    this.fromDataDetailsObj = {
      title: 'Account',
      data: [this.posFinanceRequestDetails],
      fieldDetails: [
        {
          dispKey: 'LBL_ACC_NUMBER',
          dataKey: 'OD_ACC_NO',
        },
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'ALIAS_NAME',
        },
        {
          dispKey: 'LBL_FULL_NAME',
          dataKey: 'LIAS_NAME',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'STATUS',
        },
        {
          dispKey: 'LBL_BALANCE',
          dataKey: 'CURR_AVAIL_BAL_AMOUNT_NEW',
          dataKeySupport: 'OD_CCY_CODE',
        },
      ],
    };
  }
  getDisplayStatus(event: any, type: string) {
    if (type === 'fromData') {
      if (event === 'iconClick') {
        this.router.navigate(['/posFinance']);
      }
    }
  }
  setSecondFactorValue(secondFactorValue: any): void {
    this.secAuthRef = secondFactorValue.data.secfRefNo;
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
  submit() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      param1: this.userOtpValue,
      param2: this.secAuthRef,
      PARSED_RULE_ID:
        this.authDetail && this.authDetail.selectedAprover
          ? this.authDetail.selectedAprover.PARSED_RULE_ID
          : '',
      SELECTION_FLAG:
        this.authDetail && this.authDetail.selectedAprover ? 'Y' : '',
      sefAuthFlag: this.sefAuthFlag,
      valueDate: '',
      inputVersionOn: '',
      accNo: this.posFinanceRequestDetails.OD_ACC_NO,
      requestId: this.posFinanceRequestDetailsList.requestId,
      crNo: this.posFinanceRequestDetailsList.crNumber,
      rmReferals: this.posFinanceRequestDetailsList.rmReferals,
      financeAmt: this.posFinanceRequestDetailsList.financeAmount,
      currency: this.posFinanceRequestDetailsList.currency,
      COD_CORECIF: this.posFinanceRequestDetails.COD_CORECIF,
      AUTH_TYPE_O :this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    };
    this.posFinanceServices.submitApi(params).subscribe(
      (res: any) => {
        this.submitData = res.dataValue;

        this.constructReceiptData(this.submitData.INPUT_REFERENCE_NO);
      },
      (error) => { }
    );
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    this.showReceipt = true;
  }

  getConvertedCurrency(amount: string, currency: string): string {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    return `${currencyFormatPipeFilter.transform(
      amount,
      currency
    )} ${currency}`;
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_REQUEST_SUCCSFL',
      msg2: 'LBL_YOUR_MERCHANT_FINANCE_DISPUTE_IS_PENDING_FOR_APPROVAL',
      referenceNumber: refNumber ? refNumber : '--',

      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.posFinanceRequestDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.loginID
                ? this.rootScopeData.userInfo.loginID
                : '--',
            },
            {
              dispKey: 'LBL_Account_Number',
              dataKey: this.posFinanceRequestDetails.OD_ACC_NO
                ? this.posFinanceRequestDetails.OD_ACC_NO
                : '--',
            },
            {
              dispKey: 'LBL_NICK_NAME',
              dataKey: this.posFinanceRequestDetails.ALIAS_NAME
                ? this.posFinanceRequestDetails.ALIAS_NAME
                : '--',
            },
          ],
        },
        {
          title: 'LBL_LOAN_DETAILS',
          isTable: 'false',
          data: this.posFinanceRequestDetailsList,
          fieldDetails: [
            {
              dispKey: 'LBL_REQUEST_ID',
              dataKey: this.posFinanceRequestDetailsList.requestId
                ? this.posFinanceRequestDetailsList.requestId
                : '--',
            },
            {
              dispKey: 'LBL_CR_NUMBER',
              dataKey: this.posFinanceRequestDetailsList.crNumber
                ? this.posFinanceRequestDetailsList.crNumber
                : '--',
            },
            {
              dispKey: 'LBL_RM_REFERALS',
              dataKey: this.posFinanceRequestDetailsList.rmReferals
                ? this.posFinanceRequestDetailsList.rmReferals
                : '--',
            },
          ],
        },
        {
          isTable: 'false',
          data: this.posFinanceRequestDetailsList,
          fieldDetails: [
            {
              dispKey: 'LBL_FINANCE_AMOUNT',
              dataKey: this.getConvertedCurrency(
                this.posFinanceRequestDetailsList.financeAmount,
                this.posFinanceRequestDetailsList.currency
              ),
            },
            {
              dispKey: 'LBL_TENOR_PERIOD',
              dataKey: this.posFinanceRequestDetailsList.tenorMonths
                ? this.posFinanceRequestDetailsList.tenorMonths
                : '--',
            },
            {
              dispKey: 'LBL_MAX_AMT',
              dataKey: this.getConvertedCurrency(
                this.posFinanceRequestDetailsList.maximumAmount,
                this.posFinanceRequestDetailsList.currency
              ),
            },
          ],
        },
        {
          isTable: 'false',
          data: this.posFinanceRequestDetailsList,
          fieldDetails: [
            {
              dispKey: 'LBL_STATUS',
              dataKey:
                this.translateService.instant('LBL_CLAIM_SAVED_MESSAGE') +
                ' ' +
                this.posFinanceRequestDetailsList.requestId,
            },
          ],
        },
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: this.authDetail.selectedAprover?.AUTH_NAME
                ? this.authDetail.selectedAprover.AUTH_NAME
                : 'LBL_NOT_PROVIDED',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: this.authDetail?.aproveNote
                ? this.authDetail.aproveNote
                : 'LBL_NOT_PROVIDED',
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_GENERATE_ANOTHER_STATEMENT',
      },

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    this.isSelfAuth.toString() === 'true' &&
      this.receiptData.receiptDetails.push({
        title: '',
        isTable: 'false',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: 'LBL_SUCCESS',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: '--',
          },
        ],
      });
  }
  getAuthorizationData() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.posFinanceServices.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.sefAuthFlag = res.data.selfAuth;
        if (res) {
          if (res.data.flexiAuth == 'true') {
            this.authOptions = res.data.authList;
          }
        }
      },
      (error) => { }
    );
  }

  getData(event: any) {
    this.authDetail = event;
  }
  onSecondFactorValue(authValue: any) {
    this.secAuthRef = authValue.data.secfRefNo;
  }

  cancel() {
    this.router.navigate(['/posFinance']);
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
