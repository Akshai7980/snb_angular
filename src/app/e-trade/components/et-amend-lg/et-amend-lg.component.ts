import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { ETradeService } from '../../services/e-trade.service';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';

@Component({
  selector: 'app-et-amend-lg',
  templateUrl: './et-amend-lg.component.html',
  styleUrls: ['./et-amend-lg.component.scss'],
})
export class EtAmendLgComponent implements OnInit {
  isLoadingComplete: boolean = true;
  fromAccount: any;
  toAccount: any;
  rootScopeData: RootScopeDeclare = RootScopeData;

  commissionAccounts: any = [];
  marginAccounts: any = [];
  currencies: any = [];

  applicantDetailsErrors: any = {
    commissionAccountError: '',
    marginAccountError: '',
  };
  applicantDetails: any = {
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
    amount: '',
    ccy: '',
    amountInEnglish: '',
    amountInArabic: '',
    representing: '',
    refNumber: '',
    expiry: '',
    projectNameAndPurpose: '',
  };
  isUpdate: boolean = true;
  url: string = systemproperty.termsAndConditionsForStopPayment;
  authorsList: any = [];
  authDataObj: any;
  secondAuthRef: string = '';
  otpError: string = '';
  otpValue: string = '';
  submitSuccessful: boolean = false;
  receiptData: any;
  initReqParam: any = {};
  showAuthorization: boolean = false;
  lang: SUPPORTED_LANGUAGE = 'en';
  arlang: SUPPORTED_LANGUAGE = 'ar';

  value:any;
  authType: any;
  constructor(
    private readonly eTradeService: ETradeService,
    private readonly router: Router,
    private ngxNumToWordsService: NgxNumToWordsService
  ) {}

  ngOnInit(): void {
    if (
      this.rootScopeData.selectedInquiryForStopPayment &&
      this.rootScopeData.selectedInquiryForStopPayment.fromAccount
    ) {
      this.fromAccount = [
        this.rootScopeData.selectedInquiryForStopPayment.fromAccount,
      ];
      this.toAccount = [
        this.rootScopeData.selectedInquiryForStopPayment.toAccount,
      ];
      this.getAccounts();
    } else {
      this.router.navigate(['eTrade/inquiry']);
    }
  }

  getAccounts(): void {
    this.isLoadingComplete = false;
    combineLatest([
      this.eTradeService.getFromAccounts(),
      this.eTradeService.getCurrencies(),
      this.eTradeService.getTypes(),
      this.eTradeService.getBranches(),
    ]).subscribe(
      ([commissionAccounts, currencies, types, branches]) => {
        this.isLoadingComplete = true;
        if (
          commissionAccounts &&
          commissionAccounts.DATA &&
          commissionAccounts.DATA.ALL_RECORDS
        ) {
          this.commissionAccounts = this.marginAccounts =
            commissionAccounts.DATA.ALL_RECORDS;
        }

        if (currencies.data && currencies.data.length) {
          this.currencies = currencies.data;
        }

        this.setDetails(types.data, branches.data);
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  setDetails(types: any, branches: any): void {
    const details = this.rootScopeData.selectedInquiryForStopPayment.toAccount;
    this.applicantDetails = {
      commissionAccount: this.commissionAccounts.find(
        (account: any) => account.OD_ACC_NO === details.commissionDebitAccount
      ),
      marginAccount: this.marginAccounts.find(
        (account: any) => account.OD_ACC_NO === details.marginDebitAccount
      ),
      address1: details.applicantNameAddressEng2,
      address2: details.applicantNameAddressEng3,
      address3: details.applicantNameAddressEng4,
      email: details.applicantNameAddressEng5,
      mobile: details.mobile,
      phone: details.mobile,
      fax: details.mobile,
    };
    this.value = (details.lgAmount).replace(/,/g, '')
    this.value = parseFloat(this.value);
    this.issueDetails = {
      language: details.textLanguage === 'E' ? 'English' : 'Arabic',
      type: types.find((type: any) => type.lgType === details.productType),
      branch: branches.find(
        (branch: any) => branch.branchCode === details.deliveryBranch
      ),
      amount: details.lgAmount,
      ccy: this.currencies.find(
        (ccy: any) => ccy.currency === details.commissionDebitCurrency
      ),
      amountInEnglish: this.ngxNumToWordsService.inWords(this.value, this.lang),
      amountInArabic: this.ngxNumToWordsService.inWords(this.value, this.arlang),
      representing: details.contractPercentage,
      refNumber: details.refNo,
      expiry: details.expiryDateGregorian,
      projectNameAndPurpose: details.purposeLGEng1,
    };
  }

  setApplicantDetails(details: any): void {
    this.applicantDetails = details;
  }

  setIssueDetails(details: any): void {
    this.issueDetails = details;
  }

  onUpdate(): void {
    this.validateDetailsFields();
    if (
      !this.applicantDetailsErrors.commissionAccountError &&
      !this.applicantDetailsErrors.marginAccountError &&
      !this.issueDetailsErrors.expiryError &&
      !this.issueDetailsErrors.amountError
    ) {
      this.isLoadingComplete = false;
      this.initReqParam = {
        accNo: this.fromAccount[0].OD_ACC_NO,
        amt: amountUnFormat(this.issueDetails.amount),
        pdroductCode: 'NBMTRD',
        subPrdCode: 'LGCSMAR',
        cif: this.fromAccount[0].COD_CORECIF,
        unitId: this.fromAccount[0].UNIT_ID,
        ccy: this.issueDetails.ccy.currency,
      };
      this.eTradeService
        .getAuthorizers({
          unitId: this.fromAccount[0].UNIT_ID,
          cif: this.fromAccount[0].COD_CORECIF,
          amount: amountUnFormat(this.issueDetails.amount),
          accountNumber: this.fromAccount[0].OD_ACC_NO,
          paymentCurrency: this.issueDetails.ccy.currency,
          debitCurrency: this.issueDetails.ccy.currency,
        })
        .subscribe(
          (authors: any) => {
            this.isLoadingComplete = true;
            if (authors.data.flexiAuth == 'true') {
              this.showAuthorization = true;
              this.authorsList = authors.data.authList;
            }
          },
          () => {
            this.isLoadingComplete = true;
          }
        );
      this.isUpdate = false;
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

  setAuthorizationDetails(details: any): void {
    this.authDataObj = details;
  }

  onSecondFactorValue(authValue: any): void {
    this.secondAuthRef = authValue.data.secfRefNo;
  }

  getOtpValue(otpValue: string): void {
    if (otpValue && otpValue.length === 4) {
      this.otpError = '';
      this.otpValue = otpValue;
      this.submitAmendment();
    } else {
      this.otpValue = '';
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    }
  }

  cancelAmendment(): void {
    this.router.navigate(['eTrade/inquiry']);
  }

  submitAmendment(): void {
    if (this.otpValue && this.otpValue.length === 4) {
      this.eTradeService
        .submitAmendment({
          issueDetails: {
            ...this.issueDetails,
            amount: this.issueDetails.amount.split('.')[0],
          },
          applicantDetails: this.applicantDetails,
          otp: this.otpValue,
          secRef: this.secondAuthRef,
          account: this.fromAccount[0],
          authorizer: this.authDataObj,
          lg: this.rootScopeData.selectedInquiryForStopPayment.lg,
          AUTH_TYPE_O :this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
        })
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;
            if (response.dataValue.OD_STATUS_DESC === 'Success') {
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
      this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
      // this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
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
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.loginID
                ? this.rootScopeData.userInfo.loginID
                : '',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.fromAccount[0].OD_ACC_NO,
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: this.fromAccount[0].ALIAS_NAME,
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
              dataKey: this.rootScopeData.selectedInquiryForStopPayment.lg
                .beneficiaryNameEng
                ? this.rootScopeData.selectedInquiryForStopPayment.lg
                    .beneficiaryNameEng
                : '--',
            },
            {
              dispKey: 'LBL_BENEFICIARY_IN_ARABIC',
              dataKey: this.rootScopeData.selectedInquiryForStopPayment.lg
                .beneficiaryNameAr
                ? this.rootScopeData.selectedInquiryForStopPayment.lg
                    .beneficiaryNameAr
                : '--',
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
              this.authDataObj &&
              this.authDataObj.selectedAprover &&
              this.authDataObj.selectedAprover.AUTH_NAME
                ? this.authDataObj.selectedAprover.AUTH_NAME
                : 'Not Provided',
          },
          {
            dispKey: 'LBL_ADD_NEXT_APROVER',
            dataKey:
              this.authDataObj &&
              this.authDataObj.selectedAprover &&
              this.authDataObj.aproveNote
                ? this.authDataObj.aproveNote
                : 'LBL_NOT_PROVIDED',
          },
        ],
      });
    }
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
