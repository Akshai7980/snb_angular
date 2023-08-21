import { Component, OnInit } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { EpayServiceService } from '../../services/epay-service.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-apply-for-epay',
  templateUrl: './apply-for-epay.component.html',
  styleUrls: ['./apply-for-epay.component.scss']
})
export class ApplyForEpayComponent implements OnInit {
  debitAccountDetailsObj: any;
  rootScopeData: RootScopeDeclare = RootScopeData
  isLoadingCompelete = false;
  clearFlag = false;
  fromAccountDetails: any = [];
  searchShownFlag = true;
  norecordflag: boolean = false;
  debitData: any;
  showMerchantDetails: boolean = false;
  merchantObj: any;
  showFeeDetails: boolean = false;
  feeDetails: any;
  isSubmit: boolean = false;
  showReadOly: boolean = false;
  authError: string = '';
  authListArray: any;
  autherizationDetailsObj: any;
  secAuthRef: any;
  otpError: any;
  userOtpValue: any;
  initReqParam: any;
  showAuthentication: boolean = false;
  showAuthorization: boolean = false;
  showReceipt: boolean = false;
  receiptData: any;
  clearMerchantDetails: boolean = false;
  modifyFlag: any;
  review: boolean = false;
  flexiAuth:any;
  constructor(private epayService: EpayServiceService, private translateService: TranslateService) { }

  ngOnInit(): void {
    this.getPaymentDebitAccount();
  }

  getPaymentDebitAccount() {
    this.norecordflag = false;
    this.isLoadingCompelete = false;
    let reqObj = {
      moduleId: "APPEPYACCLKUP"
    }
    this.epayService.epayDebitAccount(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        this.debitData = response.DATA.ALL_RECORDS;
        for (let i in this.debitData) {
          let crntAvail_amount = this.debitData[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = this.debitData[i].OD_CCY_CODE;
          let convtd_amount = '';
          if (crntAvail_amount && convtd_ccy) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            this.debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
            this.debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }
        }

        this.debitAccountDetailsObj = {
          "title": "LBL_ACCOUNT",
          "data": this.debitData,
          "fieldDetails": [
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "ALIAS_NAME"
            },
            {
              "dispKey": "LBL_FULL_NAME",
              "dataKey": "OD_ACC_NAME"
            },
            {
              "dispKey": "LBL_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN" : "CURR_AVAIL_BAL_AMT",
              "dataKeySupport": "OD_CCY_CODE"
            }
          ]
        };
      }
    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  afterFromAccountSelection(event: any) {
    if (event == 'iconClick') {
      this.debitAccountDetailsObj = "";
      this.getPaymentDebitAccount();
      this.showMerchantDetails = false;
      this.clearMerchantDetails = true
    } else {
      this.fromAccountDetails[0] = event;
      this.rootScopeData.hideTabs = true;
      this.clearFlag = false;
      this.showMerchantDetails = true
    }
  }
  getMerchantDetails(event: any, field: any) {
    if (field === 'mthData') {
      this.merchantObj = event;
      this.getChargeInfo();
      this.modifyFlag = false
    } else {
      this.showMerchantDetails = false;
      this.debitAccountDetailsObj = "";
      this.getPaymentDebitAccount();
    }
  }
  getChargeInfo() {
    this.isLoadingCompelete = false
    let param;
    this.epayService.getFeeDetails(param).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      if (res && res.data && res.data.length > 0 && res.data[0].chargeInfo) {
        this.feeDetails = res.data[0].chargeInfo[0]
        this.showFeeDetails = true
      }
    }, err => {
      this.isLoadingCompelete = true;
    })
  }
  onClickCancel() {
    this.initGenerateStatement()
  }
  clearAuthData() {
    this.autherizationDetailsObj = "";
    this.userOtpValue = "";
    this.otpError = "";
    this.authError = "";
  }
  prceedNext() {
    this.isSubmit = true;
    this.showReadOly = true;
    this.review = true;
    this.rootScopeData.changeHeading = "Review";
    this.showAuthentication = true;
    this.checkSecfactorAuth();
  }
  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.submit();
    } else {
      this.userOtpValue = "";
    }
  }
  checkSecfactorAuth() {
    this.isLoadingCompelete = false;
    let reqObj = {
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
      "cif": this.fromAccountDetails[0]?.COD_CORECIF ? this.fromAccountDetails[0]?.COD_CORECIF : "",
      "productCode": "CORESVS",
      "subProdCode": "APEPYSTMT",
      "funcCode": "APEPYFNC",
      "amount": this.fromAccountDetails[0]?.CURR_AVAIL_BAL_AMT ? this.fromAccountDetails[0]?.CURR_AVAIL_BAL_AMT : "",
      "accNo": this.fromAccountDetails[0]?.OD_ACC_NO ? this.fromAccountDetails[0]?.OD_ACC_NO : "",
      "pymntCurrency": this.fromAccountDetails[0]?.OD_CCY_CODE ? this.fromAccountDetails[0]?.OD_CCY_CODE : "",
      "debitCurrency": ""
    }

    this.epayService.selfAuthCheck(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        if (
          response &&
          response.data &&
          response.data.authList &&
          response.data.authList.length > 0
        ) {
          this.authListArray = response.data.authList;
          this.flexiAuth = response.data?.flexiAuth;
        }
        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          // this.authListArray = response.data.authList;
        }
      }
    }, error => {
      this.isLoadingCompelete = true;
    }
    )
  }
  submit() {
    let isOtpValid = true;
    if (this.showAuthentication) {
      if (!this.userOtpValue || this.userOtpValue.length !== 4) {
        this.otpError = "LBL_PLS_ENTER_OTP";
        isOtpValid = false;
        return;
      }
    }
    if (isOtpValid) {
      this.isLoadingCompelete = false;
      let param = {
        "secRef": this.secAuthRef,
        "otp": this.userOtpValue,
        "selfParsedRuleId": this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover
        ? this.autherizationDetailsObj.selectedAprover.PARSED_RULE_ID
        : '',
        "stnFlag": this.autherizationDetailsObj &&
        this.autherizationDetailsObj?.selectedAprover &&
        this.autherizationDetailsObj?.selectedAprover?.AUTH_NAME !== 'Any'
          ? 'Y'
          : 'N',
        "entlVal": "",
        "cif": this.fromAccountDetails[0]?.COD_CORECIF ? this.fromAccountDetails[0]?.COD_CORECIF : "",
        "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
        "primaryAcctNo": this.fromAccountDetails[0]?.OD_ACC_NO ? this.fromAccountDetails[0]?.OD_ACC_NO : "",
        "custType": "",
        "countryCode": "",
        "valDate": "",
        "txnCurrency": this.fromAccountDetails[0]?.OD_CCY_CODE ? this.fromAccountDetails[0]?.OD_CCY_CODE : "",
        "txnAmount": "",
        "accountNickName": this.fromAccountDetails[0]?.ALIAS_NAME ? this.fromAccountDetails[0]?.ALIAS_NAME :"",
        "accountFullName": this.fromAccountDetails[0]?.OD_ACC_NAME ? this.fromAccountDetails[0]?.OD_ACC_NAME :"",
        "status": this.fromAccountDetails[0]?.STATUS ? this.fromAccountDetails[0]?.STATUS :"",
        "accountBalance": this.fromAccountDetails[0]?.CURR_AVAIL_BAL_AMT ? this.fromAccountDetails[0]?.CURR_AVAIL_BAL_AMT :"",
        "engName": this.merchantObj?.engName,
        "arabicName": this.merchantObj?.arabicName,
        "phoneNo": this.merchantObj?.phoneNo,
        "city": this.merchantObj?.city,
        "address": this.merchantObj?.address,
        "delFirstName": this.merchantObj?.delFirstName,
        "delLastName": this.merchantObj?.delLastName,
        "mobileNo": this.merchantObj?.mobileNo,
        "email": this.merchantObj?.email,
        "techFirstName": this.merchantObj?.techFirstName,
        "techLastName": this.merchantObj?.techLastName,
        "techMail": this.merchantObj?.techMail,
        "techMobileNo": this.merchantObj?.techMobileNo,
        "paymentType": this.merchantObj?.paymentType,
        "payServiceProvider":this.merchantObj?.payServiceProvider,
        "schema": this.merchantObj?.schema ? this.merchantObj?.schema : "",
        "gateway": this.merchantObj?.gateway ? this.merchantObj?.gateway : "",
        "comments": this.merchantObj?.comment ? this.merchantObj?.comment : "",
        "webUrl": this.merchantObj?.webUrl ?this.merchantObj?.webUrl:"",
        "setupFee": this.feeDetails?.setupFee,
        "monthlyFee": this.feeDetails?.monthlyFee,
        "madaCNT": this.feeDetails?.madaPerc,
        "creditPRCNT": this.feeDetails?.ccPerc,
        "creditFixFee": this.feeDetails?.ccFixFee,
      }
      this.showAuthorization = false;
      this.showAuthentication = false;
      this.epayService.sbmitEpayApi(param).subscribe((response: any) => {
        this.isLoadingCompelete = true;
        if (response) {
          if (response.dataValue.OD_STATUS_DESC === "Failed") {
            this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
          } else {
            this.showAuthorization = false;
            this.showAuthentication = false;
            this.showFeeDetails = false;
            this.showMerchantDetails = false;
            this.rootScopeData.changeHeading = "";
            //let refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
            this.constructReceiptData(response?.dataValue);
            this.clearAuthData();
            this.showReceipt = true;
          }
        } else {
          this.isLoadingCompelete = true;
          this.rootScopeData.showSystemError = true;
          this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
        }
      }, error => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      })
    }
  }
  modify() {
    this.modifyFlag = true;
    this.showAuthentication = false;
    this.showAuthorization = false;
    this.showFeeDetails = false;
    this.showReadOly = false;
    this.isSubmit = false;
    this.review = false;
    this.otpError = '';
    this.userOtpValue = '';
    this.rootScopeData.changeHeading = "Apply for ePay";
    this.clearAuthData();
  }
  initGenerateStatement() {
    this.review = false;
    this.showReceipt = false;
    this.showAuthentication = false;
    this.showAuthorization = false;
    this.showFeeDetails = false;
    this.showReadOly = false;
    this.modifyFlag = false;
    this.isSubmit = false;
    this.showMerchantDetails = false;
    this.debitAccountDetailsObj = ''
    this.getPaymentDebitAccount();
    this.rootScopeData.changeHeading = "Apply for ePay";
  }
  constructReceiptData(response: any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.fromAccountDetails[0], { USER_ID: userId })
    // let approver = this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover && this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME : this.translateService.instant("LBL_NOT_PROVIDED");
    // let approverNote = this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote ? this.autherizationDetailsObj.aproveNote : this.translateService.instant("LBL_NOT_PROVIDED");
    // let flexiAuth = {
    //   "title": "LBL_AUTHORIZATION",
    //   "isTable": "false",
    //   "fieldDetails": [
    //     {
    //       "dispKey": "LBL_Next_Approver",
    //       "dataKey": approver
    //     },
    //     {
    //       "dispKey": "LBL_ADD_NEXT_APROVER",
    //       "dataKey": approverNote
    //     }
    //   ]
    // }
    // let status = {
    //   "title": "LBL_STATUS_DETAILS",
    //   "isTable": "false",
    //   "fieldDetails": [
    //     {
    //       "dispKey": "LBL_STATUS",
    //       "dataKey": 'Success'
    //     },
    //     {
    //       "dispKey": "LBL_RESPONSE",
    //       "dataKey": 'TICNO868675'
    //     }
    //   ]
    // }
    this.receiptData = {
      "msg1": "LBL_PAYMENT_SUCCESSFULL",
      "msg2": "LBL_APPLY_EPAY_PNDG_FR_APPROVAL",
      "referenceNumber": response?.INPUT_REFERENCE_NO ? response?.INPUT_REFERENCE_NO : "",
      "receiptDetails": [
        {
          "title": "LBL_FROM",
          "isTable": "true",
          "data": this.fromAccountDetails,
          "fieldDetails": [
            {
              "dispKey": "LBL_ACTION_BY",
              "dataKey": "USER_ID"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_SHORT_NAME",
              "dataKey": "ALIAS_NAME"
            }
          ]
        },
        {
          "title": "LBL_MRCHNT_DETAILS",
          "isTable": "true",
          "data": [this.merchantObj],
          "fieldDetails": [
            {
              "dispKey": "LBL_NAME",
              "dataKey": "engName"
            },
            {
              "dispKey": "LBL_PHONE",
              "dataKey": "phone"
            },
            {
              "dispKey": "LBL_CITY",
              "dataKey": "city"
            }
          ]
        }
      ],
      "printButton": {
        "buttonLabel": "LBL_PRINT_RECEIPT",
        "buttonIcon": "./assets/images/PrinterIcon.png"
      },
      "saveButton": {
        "buttonLabel": "LBL_SAVE_RECEIPT",
        "buttonIcon": "./assets/images/saveReceipt.svg"
      },
      "initiateButton": {
        "buttonLabel": "LBL_INITIATE_ANOTHER_REQUEST"
      },
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    };
    this.flexiAuth.toString() === 'true' &&
      this.receiptData.receiptDetails.push(
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: this.autherizationDetailsObj.selectedAprover?.AUTH_NAME
                ? this.autherizationDetailsObj.selectedAprover.AUTH_NAME
                : 'Not Provided',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: this.autherizationDetailsObj?.aproveNote
                ? this.autherizationDetailsObj.aproveNote
                : 'Not Provided',
            },
          ],
        },
        {
          title: '',
          isTable: 'false',
          fieldDetails: [
            {
              dispKey: 'LBL_STATUS',
              dataKey: response?.STATUS ? response.STATUS : '--',
            },
            {
              dispKey: 'LBL_RESPONSE',
              dataKey: response?.OD_STATUS_DESC
                ? response.OD_STATUS_DESC
                : '--',
            },
          ],
        }
      );
    
    // if (approver) {
    //   this.receiptData.receiptDetails.push(flexiAuth);
    // } if (this.rootScopeData.userInfo.isSingleUser === 'Y') {
    //   this.receiptData.receiptDetails.push(status);
    // }
  }
  downloadPdf() {

  }
}
