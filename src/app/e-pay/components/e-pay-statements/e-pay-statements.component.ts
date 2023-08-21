import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { omit_special_char } from 'src/app/utility/common-utility';
import { EpayServiceService } from '../../services/epay-service.service';

@Component({
  selector: 'app-e-pay-statements',
  templateUrl: './e-pay-statements.component.html',
  styleUrls: ['./e-pay-statements.component.scss']
})
export class EPayStatementsComponent implements OnInit {

  debitAccountDetailsObj: any;
  rootScopeData: RootScopeDeclare = RootScopeData
  isLoadingCompelete = false;
  norecordflag: boolean = false;
  IS_ALL_SELECTED: any;
  showAccounts: boolean = false;
  debitData: any;
  showMerchantDatas: boolean = false;
  merchantAccountDetailsObj: any;
  merchantData: any;
  merchantAccountsDetails: any;
  showStmtDetails: boolean = false;
  stmtDetails = {
    crdType: 'All',
    period: '',
    frmDate: '',
    toDate: '',
    settled: 'All',
    sort: 'Ascending',
    frmAmt: '',
    toAmt: '',
    ref: '',
    authNo: '',
    exprtAs: ''
  }
  crdTypLists: any;
  errObj = {
    crdTypeErr: '',
    exprtErr: ''
  }
  periods: any = [];
  frmDate: any;
  toDate: any;
  frmDateErr: boolean = false;
  toDateErr: boolean = false;
  clearFlag: boolean = false;
  settledList: any = [];
  dateSortList: any = [];
  exprtList: any = [];
  receiptData: any;
  showReceipt: boolean = false;
  fromDates: any;
  toDates: any;
  minDate: any;
  maxDate = new Date();
  constructor(private epayService: EpayServiceService, private translateService: TranslateService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getPaymentDebitAccount();
  }
  getPaymentDebitAccount() {
    this.norecordflag = false;
    this.isLoadingCompelete = false;
    let reqObj = {
      moduleId: "EPYSTACCLKUP"
    }
    this.epayService.epayDebitAccount(reqObj).subscribe((response: any) => {
      if (response) {
        this.isLoadingCompelete = true;
        this.debitAccountDetailsObj = response.DATA.ALL_RECORDS;
        // console.log(this.debitAccountDetailsObj,"TEST::::");
        this.IS_ALL_SELECTED = false;
        for (let i in this.debitAccountDetailsObj) {
          this.debitAccountDetailsObj[i].IS_SELECTED = false;
          let crntAvail_amount = this.debitAccountDetailsObj[i].CURR_AVAIL_BAL_AMT;
          let convtd_ccy = this.debitAccountDetailsObj[i].OD_CCY_CODE;
          let convtd_amount = '';
          if (crntAvail_amount && convtd_ccy) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            this.debitAccountDetailsObj[i].CURR_AVAIL_BAL_AMT = convtd_amount;
            this.debitAccountDetailsObj[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }
        }
        this.showAccounts = true;
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
  afterDebitAccount(event: any, field: any) {
    if (field === 'data') {
      this.debitData = event;
      this.getMercahntData();
    } else if (field === 'reset') {
      this.debitData = '';
      this.merchantAccountDetailsObj = '';
      this.merchantData = '';
      this.showMerchantDatas = false;
      this.showStmtDetails = false;
      this.errObj.crdTypeErr = '';
      this.errObj.exprtErr = '';
      this.stmtDetails = {
        crdType: 'All',
        period: '',
        frmDate: '',
        toDate: '',
        settled: 'All',
        sort: 'Ascending',
        frmAmt: '',
        toAmt: '',
        ref: '',
        authNo: '',
        exprtAs: ''
      }
    }
  }
  afterMerchntAccount(event: any, field: any) {
    if (field === 'data') {
      this.merchantData = event;
      this.getCardType();
      this.getPeriod();
      this.getSettled();
      this.getDateSort();
      this.getExport();
    } else if (field === 'reset') {
      if (event === 'reset') {
        this.merchantData = '';
        this.debitData = '';
        this.debitAccountDetailsObj = '';
        this.showAccounts = false
        this.getPaymentDebitAccount()

        this.showMerchantDatas = false;
      } else if (event === 'icon') {
        this.showMerchantDatas = true;
        this.showStmtDetails = false;
      }
    }
  }

  getMercahntData() {
    this.isLoadingCompelete = false;
    let param = {
      "moduleId": "EPYSRCH",
      "productName": "CORESVS",
      "subProductName": "EPYSTS",
      "functionCode": "EPYSTSFNC",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
      "accNo": this.debitData[0]?.OD_ACC_NO ? this.debitData[0]?.OD_ACC_NO : ""
    };
    this.epayService.getEPayMerchantList(param).subscribe((resp: any) => {
      if (resp) {
        this.isLoadingCompelete = true;
        this.merchantAccountDetailsObj = resp.data?.merchants;
        // console.log(this.merchantAccountDetailsObj,"TEST:::::");
        this.showMerchantDatas = true;
        this.IS_ALL_SELECTED = false;
      } else {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    }, err => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }
  getCardType() {
    this.isLoadingCompelete = false;
    let param = {
      "action": "GET_POS_CARD_TYPE_ACTION",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : ""
    };
    this.epayService.getCardType(param).subscribe((res: any) => {
      if (res && res.data && res.data.cardType.length > 0) {
        this.isLoadingCompelete = true;
        this.crdTypLists = res.data.cardType;
        this.showStmtDetails = true;
      } else {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    }, err => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })

  }
  getPeriod() {
    this.isLoadingCompelete = false;
    let param = {
      "action": "GET_POS_PERIOD_ACTION",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
    };
    this.epayService.getPeriod(param).subscribe((res: any) => {
      if (res && res.data && res.data.cardPeriod.length > 0) {
        this.isLoadingCompelete = true;
        this.periods = res.data.cardPeriod;
        this.periods.push({ "period": "Custom Date" });
        this.showStmtDetails = true;
      } else {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    }, err => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }
  getSettled() {
    this.isLoadingCompelete = false;
    let param = {
      "action": "GET_POS_SETTLED_ACTION",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
    };
    this.epayService.getSettled(param).subscribe((res: any) => {
      if (res && res.data && res.data.settledOption.length > 0) {
        this.isLoadingCompelete = true;
        this.settledList = res.data.settledOption;
        this.showStmtDetails = true;
      } else {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    }, err => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })

  }
  getDateSort() {
    this.isLoadingCompelete = false;
    let param = {
      "action": "GET_POS_DATE_SORT_ACTION",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
    };
    this.epayService.getDateSort(param).subscribe((res: any) => {
      if (res && res.data && res.data.length > 0 && res.data[0].sortDate.length > 0) {
        this.isLoadingCompelete = true;
        this.dateSortList = res.data[0].sortDate;
        this.showStmtDetails = true;
      } else {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    }, err => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })

  }
  getExport() {
    this.isLoadingCompelete = false;
    let param = {
      "action": "GET_POS_EXPORT_AS_ACTION",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
    };
    this.epayService.getExport(param).subscribe((res: any) => {
      if (res && res.data && res.data[0].exportAs.length > 0) {
        this.isLoadingCompelete = true;
        this.exprtList = res.data[0].exportAs;
        this.showStmtDetails = true;
      } else {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    }, err => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })

  }
  getDate(event: any, field: any) {
    if (field === 'frm') {
      // this.fromDates=event
      if (!(this.toDates && this.toDates.getTime() <= event.getTime())) {
        this.clearFlag = false;
      } else {
        this.stmtDetails.toDate = ''
        this.clearFlag = true;

      }
      this.fromDates = event
      this.stmtDetails.frmDate = this.datePipe.transform(event, this.rootScopeData.userInfo.mDateFormat) + ""
    } else {
      this.toDates = event
      this.stmtDetails.toDate = this.datePipe.transform(event, this.rootScopeData.userInfo.mDateFormat) + ""
    }
  }
  validate(event: any, field: any) {
    if (field === 'crdType') {
      this.errObj.crdTypeErr = ""
    } else if (field === 'exprt') {
      this.errObj.exprtErr = ''
    }
  }
  formatCurrency(event: any, field: any) {
    let curPipe = new CurrencyFormatPipe()
    if (field === 'frm') {
      this.stmtDetails.frmAmt = curPipe.transform(this.stmtDetails.frmAmt, "SAR")
    } else {
      this.stmtDetails.toAmt = curPipe.transform(this.stmtDetails.toAmt, "SAR")
    }
  }
  onClickCancel() {
    this.fromDates = '';
    this.toDates = ''
    this.showReceipt = false;
    this.showAccounts = false;
    this.debitData = '';
    this.showMerchantDatas = false;
    this.merchantData = '';
    this.frmDateErr = false;
    this.showStmtDetails = false;
    this.debitAccountDetailsObj = '';
    this.getPaymentDebitAccount();
    this.toDateErr = false;
    this.stmtDetails = {
      crdType: 'All',
      period: '',
      frmDate: '',
      toDate: '',
      settled: 'All',
      sort: 'Ascending',
      frmAmt: '',
      toAmt: '',
      ref: '',
      authNo: '',
      exprtAs: ''
    },
      this.errObj = {
        crdTypeErr: '',
        exprtErr: ''
      }

  }
  submit() {

    this.errObj.crdTypeErr = this.stmtDetails.crdType === '' ? "LBL_CRD_TYPE_ERR" : "";
    if (this.stmtDetails.period === 'Custom Date') {
      this.frmDateErr = !this.stmtDetails.frmDate ? true : false;
      this.toDateErr = !this.stmtDetails.toDate ? true : false;
    } else {
      this.frmDateErr = false;
      this.toDateErr = false;
    }
    this.errObj.exprtErr = !this.stmtDetails.exprtAs ? "LBL_EXPRT_ERR" : '';
    let param = {
      cifNo: this.debitAccountDetailsObj[0]?.COD_CORECIF ? this.debitAccountDetailsObj[0]?.COD_CORECIF : "",
      unitId: this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
      debitAccountNo: this.debitAccountDetailsObj[0]?.OD_ACC_NO ? this.debitAccountDetailsObj[0]?.OD_ACC_NO : "",
      custType: "",
      reqCountryCode: "",
      valueDate: "",
      txnCurrency: "",
      txnAmount: "",
      accountNo: this.debitAccountDetailsObj[0]?.OD_ACC_NO ? this.debitAccountDetailsObj[0]?.OD_ACC_NO : "",
      nickName: this.debitAccountDetailsObj[0]?.ALIAS_NAME ? this.debitAccountDetailsObj[0]?.ALIAS_NAME : "",
      fullName: this.debitAccountDetailsObj[0]?.OD_ACC_NAME ? this.debitAccountDetailsObj[0]?.OD_ACC_NAME : "",
      accountStatus: this.debitAccountDetailsObj[0]?.STATUS ? this.debitAccountDetailsObj[0]?.STATUS : "",
      accountBalance: this.debitAccountDetailsObj[0]?.CURRENT_BAL_AMT ? this.debitAccountDetailsObj[0]?.CURRENT_BAL_AMT : "",
      merchantObject: this.merchantData ? this.merchantData : [],
      cardType: this.stmtDetails.crdType,
      cardPeriod: this.stmtDetails.period,
      cardDateSort: this.stmtDetails.sort,
      dateFrom: this.stmtDetails.frmDate,
      dateTo: this.stmtDetails.toDate,
      settled: this.stmtDetails.settled,
      amountFrom: this.stmtDetails.frmAmt,
      amountTo: this.stmtDetails.toAmt,
      refNo: this.stmtDetails.ref,
      authNo: this.stmtDetails.authNo,
      exportType: this.stmtDetails.exprtAs
    };
    if (!this.errObj.crdTypeErr && !this.frmDateErr && !this.toDateErr && !this.errObj.exprtErr) {
      this.isLoadingCompelete = false;
      this.epayService.submitEpayStmt(param).subscribe((response: any) => {
        if (response) {
          this.isLoadingCompelete = true;
          // let refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
          this.constructReceiptData(response.dataValue);
          this.showReceipt = true;
        }
        else {
          this.isLoadingCompelete = true;
        }
      }, err => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";

      })
    }

  }
  numOly(event: any) {
    let regExp = /^([0-9]+)$/
    return regExp.test(event.key)
  }
  charsOly(event: any) {
    return omit_special_char(event)
  }

  constructReceiptData(response: any) {
    let status = {
      "title": "LBL_STATUS_DETAILS",
      "isTable": "false",
      "fieldDetails": [
        {
          "dispKey": "LBL_STATUS",
          "dataKey": response?.OD_STATUS ? response.OD_STATUS : '--',
        },
        {
          "dispKey": "LBL_RESPONSE",
          "dataKey": response?.OD_STATUS_DESC
            ? response.OD_STATUS_DESC
            : '--',
        }
      ]
    }
    this.receiptData = {
      "msg1": "LBL_REQ_SUCCESSFUL",
      "msg2": "LBL_ESTMT_READY_TO_DWNLD_MSG",
      "referenceNumber": response?.dataValue?.INPUT_REFERENCE_NO ? response?.dataValue?.INPUT_REFERENCE_NO : "",
      "receiptDetails": [
        {
          "title": "LBL_STATEMENT_DETAILS",
          "isTable": "false",
          "data": this.stmtDetails,
          "fieldDetails": [
            {
              "dispKey": "LBL_CARD_TYPE",
              "dataKey": this.stmtDetails.crdType
            },
            {
              "dispKey": this.stmtDetails.period ? "LBL_PERIOD" : '',
              "dataKey": this.stmtDetails.period
            },
            {
              "dispKey": this.stmtDetails.frmDate ? "LBL_REC_FRM" : '',
              "dataKey": this.stmtDetails.frmDate && this.stmtDetails.toDate ? this.stmtDetails.frmDate + " - " + this.stmtDetails.toDate : ""
            },
            {
              "dispKey": "LBL_SETTLED",
              "dataKey": this.stmtDetails.settled
            },
            {
              "dispKey": "LBL_DATE_SORT",
              "dataKey": this.stmtDetails.sort
            },
            {
              "dispKey": "LBL_AMOUNT",
              "dataKey": this.stmtDetails.frmAmt ? this.stmtDetails.frmAmt + " SAR - " + this.stmtDetails.toAmt + " SAR" : " Not Provided"
            },
            {
              "dispKey": "LBL_REFERENCE",
              "dataKey": this.stmtDetails.ref ? this.stmtDetails.ref : " Not Provided"
            },
            {
              "dispKey": "LBL_AUTHORIZATION_NUMBER",
              "dataKey": this.stmtDetails.authNo ? this.stmtDetails.authNo : " Not Provided"
            },
            {
              "dispKey": "LBL_EXPORT_AS",
              "dataKey": this.stmtDetails.exprtAs
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
    if (this.rootScopeData.userInfo.isSingleUser === 'Y') {
      this.receiptData.receiptDetails.push(status);
    }
  }
  initRequest() {
    this.onClickCancel();
  }
  downloadPdf() {

  }
}
