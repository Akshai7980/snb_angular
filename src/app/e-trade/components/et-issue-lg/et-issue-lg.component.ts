import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AccountDetailsService } from 'src/app/accounts/services/account-details.service';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { ETradeService } from '../../services/e-trade.service';

@Component({
  selector: 'app-et-issue-lg',
  templateUrl: './et-issue-lg.component.html',
  styleUrls: ['./et-issue-lg.component.scss'],
})
export class EtIssueLgComponent implements OnInit {
  isLoadingComplete: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  url: string = systemproperty.termsAndConditionsForStopPayment;

  fromAccounts: any = [];
  fromAccountsObject: any;
  selectedFromAccount: any;

  showToAccounts: boolean = false;
  toAccounts: any = [];
  toAccountsObject: any;
  selectedToAccount: any;

  showDetails: boolean = false;

  showReview: boolean = false;
  commissionAccounts: any = [];
  marginAccounts: any = [];
  types: any = [];
  branches: any = [];
  currencies: any = [];
  applicantDetailsErrors: any = {
    commissionAccountError: '',
    marginAccountError: '',
  };
  applicantDetails: any = {
    commissionAccount: '',
    marginAccount: '',
    address1: 'test address1',
    address2: '',
    address3: '',
    email: 'test@email.com',
    mobile: '',
    phone: '5555555555',
    fax: '',
  };
  issueDetailsErrors: any = {
    languageError: '',
    typeError: '',
    branchError: '',
    amountError: '',
    expiryError: '',
  };
  issueDetails: any = {
    language: '',
    type: '',
    branch: '',
    amount: '0.00',
    ccy: '',
    amountInEnglish: '',
    amountInArabic: '',
    representing: '0.00',
    refNumber: '',
    expiry: '',
    projectNameAndPurpose: '',
  };

  isDailyLimitActive: boolean = true;

  otpError: string = '';
  otpValue: string = '';
  secondAuthRef: string = '';
  initReqParam: any;
  authorsList: any = [];
  authorizeDetails: any;
  submitSuccessful: boolean = false;

  receiptData: any;
  showAuthorization: boolean = false;
  authType: any;
  constructor(
    private readonly eTradeService: ETradeService,
    private readonly datePipe: DatePipe,
    private accountService : AccountDetailsService
  ) {}

  ngOnInit(): void {
    this.getFromAccounts();
    if (this.rootScopeData.userInfo.mLanguage === 'en_US') {
      this.issueDetails.language = 'English';
    } else {
      this.issueDetails.language = 'Arabic';
    }
  }

  getFromAccounts(): void {
    this.isLoadingComplete = false;
    this.eTradeService.getFromAccounts().subscribe(
      (accounts: any) => {
        this.isLoadingComplete = true;
        if (accounts.DATA && accounts.DATA.ALL_RECORDS) {
          this.fromAccounts = accounts.DATA.ALL_RECORDS;
          this.fromAccountsObject = {
            title: 'LBL_FROM',
            data: this.fromAccounts,
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
                dataKey: 'OD_ACC_NAME',
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
          // this.rootScopeData.userInfo.maskingFlag
          //         ? 'HIDDEN'
          //         :
          if (accounts.DATA.ALL_RECORDS.length === 1) {
            this.onFromAccountSelection(accounts.DATA.ALL_RECORDS[0]);
          }
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  onFromAccountSelection(account: any): void {
   
    if (account === 'iconClick') {
      this.toAccounts = [];
      this.showToAccounts = false;
      this.toAccountsObject = undefined;
      this.showDetails = false;
      this.selectedFromAccount = undefined;
      this.showReview = false;
      this.resetDetails();
    } else {
      this.eTradeService.getToAccounts().subscribe(
        (accounts: any) => {
          this.isLoadingComplete = true;
          if (accounts && accounts.data) {
            this.toAccounts = accounts.data;
            this.showToAccounts = true;
            this.toAccountsObject = {
              title: 'LBL_TO',
              data: this.toAccounts,
              fieldDetails: [
                {
                  dispKey: 'LBL_NICKNAME_IN_ENGLISH',
                  dataKey: 'odEnglish',
                },
                {
                  dispKey: 'LBL_NICKNAME_IN_ARABIC',
                  dataKey: 'odArabic',
                },
              ],
            };
            if (accounts.data.length === 1) {
              this.onToAccountSelection(accounts.data[0]);
            }
            this.selectedFromAccount = account;

            let param : any = {
              OD_ACC_NO : account.OD_ACC_NO,
              COD_CORECIF : account.COD_CORECIF,
              REQ_COUNTRY_CODE : account.REQ_COUNTRY_CODE,
              UNIT_ID : account.UNIT_ID
            }
            this.accountService.getAccountDetails(param).subscribe((res : any) => {
              if(res && res.DATA && res.DATA.ACC_DETAILS){
                this.selectedFromAccount.OD_ACC_NAME = res.DATA.ACC_DETAILS.res_Account_Name;
              }
            });
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
    }
  }

  onToAccountSelection(account: any): void {
    if (account === 'iconClick') {
      this.selectedToAccount = undefined;
      this.showDetails = false;
      this.resetDetails();
    } else {
      this.selectedToAccount = account;
      this.showDetails = true;
      this.isLoadingComplete = false;

      combineLatest([
        this.eTradeService.getFromAccounts(),
        this.eTradeService.getTypes(),
        this.eTradeService.getBranches(),
        this.eTradeService.getCurrencies(),
      ]).subscribe(
        ([commissionAccounts, types, branches, currencies]) => {
          this.isLoadingComplete = true;
          if (
            commissionAccounts &&
            commissionAccounts.DATA &&
            commissionAccounts.DATA.ALL_RECORDS
          ) {
            this.commissionAccounts = this.marginAccounts =
              commissionAccounts.DATA.ALL_RECORDS;
          }

          if (types.data && types.data.length) {
            this.types = types.data;
          }

          if (branches.data && branches.data.length) {
            this.branches = branches.data;
          }

          if (currencies.data && currencies.data.length) {
            this.currencies = currencies.data;
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
    }
  }

  setApplicantDetails(details: any): void {
    this.applicantDetails = details;
  }

  setIssueDetails(details: any): void {
    this.issueDetails = details;
  }

  proceedToReview(): void {
    this.validateDetailsFields();
    if (
      !this.applicantDetailsErrors.commissionAccountError &&
      !this.applicantDetailsErrors.marginAccountError &&
      !this.issueDetailsErrors.languageError &&
      !this.issueDetailsErrors.typeError &&
      !this.issueDetailsErrors.branchError &&
      !this.issueDetailsErrors.expiryError &&
      !this.issueDetailsErrors.amountError
    ) {
      this.isLoadingComplete = false;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      this.initReqParam = {
        accNo: this.selectedFromAccount.OD_ACC_NO,
        amt: amountUnFormat(this.issueDetails.amount),
        pdroductCode: 'NBMTRD',
        subPrdCode: 'LGCSMAR',
        cif: this.selectedFromAccount.COD_CORECIF,
        unitId: this.selectedFromAccount.UNIT_ID,
        ccy: this.issueDetails.ccy.currency,
      };
      this.eTradeService
        .getAuthorizers({
          unitId: this.selectedFromAccount.UNIT_ID,
          cif: this.selectedFromAccount.COD_CORECIF,
          amount: amountUnFormat(this.issueDetails.amount),
          accountNumber: this.selectedFromAccount.OD_ACC_NO,
          paymentCurrency: this.issueDetails.ccy.currency,
          debitCurrency: this.issueDetails.ccy.currency,
        })
        .subscribe(
          (authors: any) => {
            if (authors) {
              this.isLoadingComplete = true;
              if (authors.data.flexiAuth == 'true') {
                this.showAuthorization = true;
                this.authorsList = authors.data.authList;
              }
            }
          },
          () => {
            this.isLoadingComplete = true;
          }
        );

      this.isLoadingComplete = false;
      this.eTradeService
        .getDailyLimit({
          availBal: this.selectedFromAccount.CURR_AVAIL_BAL_AMT,
          reqCountry: this.selectedFromAccount.REQ_COUNTRY_CODE,
          unitId: this.selectedFromAccount.UNIT_ID,
          cif: this.selectedFromAccount.COD_CORECIF,
          accCcy: this.selectedFromAccount.OD_CCY_CODE,
          valueDate: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
          accNo: this.selectedFromAccount.OD_ACC_NO,
          portalAccNo: this.selectedFromAccount.OD_PORTAL_ACC_NO,
        })
        .subscribe(
          (limit: any) => {
            this.isLoadingComplete = true;
            this.rootScopeData.dailyLimit =
              limit && limit.data && limit.data.length && limit.data[1]
                ? limit.data[1]
                : '';
          },
          () => {
            this.isLoadingComplete = true;
          }
        );
      this.showReview = true;
    }
  }

  validateDetailsFields(): void {
    if (!this.applicantDetails.marginAccount) {
      this.applicantDetailsErrors.marginAccountError =
        'LBL_PLEASE_SELECT_ACCOUNT';
    } else {
      this.applicantDetailsErrors.marginAccountError = '';
    }

    if (!this.applicantDetails.commissionAccount) {
      this.applicantDetailsErrors.commissionAccountError =
        'LBL_PLEASE_SELECT_ACCOUNT';
    } else {
      this.applicantDetailsErrors.commissionAccountError = '';
    }

    if (!this.issueDetails.language) {
      this.issueDetailsErrors.languageError = 'LBL_PLSE_SELECT_LANGUAGE';
    } else {
      this.issueDetailsErrors.languageError = '';
    }

    if (!this.issueDetails.branch) {
      this.issueDetailsErrors.branchError = 'LBL_PLEASE_SELECT_BRANCH';
    } else {
      this.issueDetailsErrors.branchError = '';
    }
    if (!this.issueDetails.type) {
      this.issueDetailsErrors.typeError = 'LBL_PLEASE_SELECT_TYPE';
    } else {
      this.issueDetailsErrors.typeError = '';
    }
    if (!this.issueDetails.expiry) {
      this.issueDetailsErrors.expiryError = 'LBL_PLEASE_ENTER_DATE';
    } else {
      this.issueDetailsErrors.expiryError = '';
    }
    if (!this.issueDetails.amount || +this.issueDetails.amount <= 0) {
      this.issueDetailsErrors.amountError = 'LBL_PLEASE_ENTER_AMOUNT';
    } else {
      this.issueDetailsErrors.amountError = '';
    }
  }

  cancelLgIssue(): void {
    window.location.reload();
  }

  setAuthorizationData(authorizerDetails: any): void {
    this.authorizeDetails = authorizerDetails;
  }

  getOtpValue(otpValue: string): void {
    if (otpValue && otpValue.length === 4) {
      this.otpError = '';
      this.otpValue = otpValue;
      this.submitIssueLg();
    } else {
      this.otpValue = '';
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    }
  }

  onSecondFactorValue(authValue: any): void {
    this.secondAuthRef = authValue.data.secfRefNo;
  }

  submitIssueLg(): void {
    if (this.otpValue && this.otpValue.length === 4) {
      this.isLoadingComplete = false;
      this.eTradeService
        .submitLgIssue({
          issueDetails: {
            ...this.issueDetails,
            amount: this.issueDetails.amount.split('.')[0],
          },
          applicantDetails: this.applicantDetails,
          otp: this.otpValue,
          secRef: this.secondAuthRef,
          account: this.selectedFromAccount,
          authorizer: this.authorizeDetails,
          beneficiary: this.selectedToAccount,
          AUTH_TYPE_O :this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
        })
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;

            if (response.dataValue.OD_STATUS_DESC === 'Success') {
              this.rootScopeData.dataFromContextMenu = '';
              this.constructReceiptData(response.dataValue.INPUT_REFERENCE_NO);
              this.submitSuccessful = true;
            } else {
              this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
              // this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';

            }
          },
          () => {
            this.isLoadingComplete = true;
          }
        );
    } else {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    }
  }

  constructReceiptData(referenceNumber: string): void {
    const datePipe = new DateFormatPipe();
    this.receiptData = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_LG_PENDING_FOR_APPROVAL',
      referenceNumber: referenceNumber,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.selectedFromAccount,
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.loginID
                ? this.rootScopeData.userInfo.loginID
                : '',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.selectedFromAccount.OD_ACC_NO,
            },
            {
              dispKey: 'LBL_SHORT_NAME',
              dataKey: this.selectedFromAccount.ALIAS_NAME,
            },
          ],
        },
        {
          title: 'LBL_TO',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_BENEFICIARY_IN_ENGLISH',
              dataKey: this.selectedToAccount.odEnglish,
            },
            {
              dispKey: 'LBL_BENEFICIARY_IN_ARABIC',
              dataKey: this.selectedToAccount.odArabic,
            },
          ],
        },
        {
          title: 'LBL_LG_ISSUE_DETAILS',
          isTable: 'true',
          data: [
            {
              type:
                this.rootScopeData.userInfo.mLanguage === 'en_US'
                  ? this.issueDetails.type.descEng
                  : this.issueDetails.type.descAr,
              expiry: datePipe.transform(this.issueDetails.expiry),
              amount: this.issueDetails.amount,
              currency: this.issueDetails.ccy.currency,
            },
          ],
          fieldDetails: [
            {
              dispKey: 'LBL_TYPE',
              dataKey: 'type',
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: 'expiry',
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: 'amount',
              dataKeySupport: 'currency',
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
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    if (this.showAuthorization) {
      this.receiptData.receiptDetails.push({
        title: 'LBL_AUTHORIZATION',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_Next_Approver',
            dataKey:
              this.authorizeDetails &&
              this.authorizeDetails.selectedAprover &&
              this.authorizeDetails.selectedAprover.AUTH_NAME
                ? this.authorizeDetails.selectedAprover.AUTH_NAME
                : 'Not Provided',
          },
          {
            dispKey: 'LBL_ADD_NEXT_APROVER',
            dataKey:
              this.authorizeDetails &&
              this.authorizeDetails.selectedAprover &&
              this.authorizeDetails.aproveNote
                ? this.authorizeDetails.aproveNote
                : 'Not Provided',
          },
        ],
      });
    }
  }

  resetDetails(): void {
    this.applicantDetailsErrors = {
      commissionAccountError: '',
      marginAccountError: '',
    };
    this.applicantDetails = {
      commissionAccount: '',
      marginAccount: '',
      address1: '',
      address2: '',
      address3: '',
      email: '',
      mobile: '',
      phone: '',
      fax: '',
    };

    this.issueDetailsErrors = {
      languageError: '',
      typeError: '',
      branchError: '',
      amountError: '',
      expiryError: '',
    };
    this.issueDetails = {
      ...this.issueDetails,
      type: '',
      branch: '',
      amount: '',
      ccy: '',
      amountInEnglish: '',
      amountInArabic: '',
      representing: '',
      refNumber: '',
      expiry: '',
      projectNameAndPurpose: '',
    };
  }

  reload(): void {
    window.location.reload();
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
