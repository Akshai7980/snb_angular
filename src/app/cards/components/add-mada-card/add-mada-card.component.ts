import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CardsService } from '../../services/cards.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';

@Component({
  selector: 'app-add-mada-card',
  templateUrl: './add-mada-card.component.html',
  styleUrls: ['./add-mada-card.component.scss']
})
export class AddMadaCardComponent implements OnInit {
  chooseAccount: boolean;
  selectedAccount: any = {};
  isLoadingComplete: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  reIssueEmit: any = {};
  reIssueReviewEmit: any = {};
  submitSuccessful: boolean = false;

  title: string = "Add Mada Card";
  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  isSelfAuth: boolean = false;
  isFlexiAuth: boolean = false;
  searchShownFlag = true;
  receiptObject: any = {};
  pdfData: any = {};
  debitAccObj: any = {};
  initParam: any;
  fromAccounts: any = [];
  fromAccountsObject: any;
  submitResponse: any = {};
  newLimit: any;
  reason: any;
  reasons: any = [
    {
      name: "Damage"
    },
    {
      name: "Fraud"
    },
    {
      name: "Lost"
    },
    {
      name: "Stolen"
    },
    {
      name: "Cancel Permanently"
    }
  ];
  comment: string = '';
  accountSection = true;
  newcardtitle: boolean = true;
  showAuthorization: boolean = false;
  pageName: string = 'newMadaCard';
  pageCall: any;
  authType: any;
  constructor(private cardsService: CardsService, private translateService: TranslateService, private downloadAsPdf: downloadAsPdf, private route: Router) {
    this.chooseAccount = true;
    this.pageCall = "newMadaCard";
  }

  ngOnInit(): void {
    //this.constructMadaCardTable(this.madaCardData);   
    this.reIssueEmit.canProceed = false;
    this.reIssueReviewEmit.canSubmit = false;
    this.accountSection = true;
    this.newcardtitle = true;
    this.debitLookupcall();
    this.initParam = {
      pdroductCode: 'CORESVS',
      subPrdCode: 'MADAREQ',
      funcCode: "CRDREQFC",
      accNo: "",
      amt: '',
      cif: "",
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      ccy: "",
    };
  }

  initAnotherCard() {
    this.title = "Add Mada Card";
    this.route.navigate(['/cards/addMadaCard']);
    this.accountSection = true;
    this.newcardtitle = true;
    this.chooseAccount = true;
    this.resetCall();
    this.debitLookupcall();
  }
  debitLookupcall() {
    this.isLoadingComplete = false;
    this.cardsService.getAccountsforAddMada().subscribe(
      (accounts: any) => {
        this.isLoadingComplete = true;
        if (accounts.DATA?.ALL_RECORDS.length > 0) {
          const currencyPipe = new CurrencyFormatPipe();
          this.fromAccounts = accounts.DATA.ALL_RECORDS.map((val: any) => {
            return {
              balance: currencyPipe.transform(
                val.CURRENT_BAL_AMT,
                val.OD_CCY_CODE
              ),
              ...val,
            };
          });
        }
        this.constructMadaSummary();

        // if (accounts.DATA && accounts.DATA.ALL_RECORDS) {
        //   this.fromAccounts = accounts.DATA.ALL_RECORDS;

        //   if (accounts.DATA.ALL_RECORDS.length === 1) {
        //     // this.onFromAccountSelection(accounts.DATA.ALL_RECORDS[0]);
        //   }
        //   this.constructMadaSummary();
        // }
        // this.rootScopeData.userInfo.maskingFlag
        // ? 'HIDDEN'
        // :
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }
  constructMadaSummary() {
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
          dataKey: 'balance',
          dataKeySupport: 'OD_CCY_CODE',
        }
      ],
    };
  }
  resetCall() {
    this.userOtpValue = null;
  }
  onFromAccountSelection(event: any) {
    this.chooseAccount = false;
    this.title = "Account Selected";
    this.selectedAccount = event;
  }
  getCanelBtnClick(){
    this.route.navigate(['/cards/cardsInquiry/MADA'])
  }
  callBackSuccess(){
    this.showAuthorization = true;
  }
  downloadPdf() {
    this.pdfData =
      [
        { type: 'setFontSize', size: 11 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
        { type: 'title', value: "Mada card Receipt", x: 90, y: 35 },
        { type: 'setFontSize', size: 10 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'setFontSize', size: 10 },
        { type: 'setFillColor', val1: 128, val2: 128, val3: 128 },
        { type: 'drawRect', x: 15, y: 51, w: 90, h: 6, s: "F" },
        { type: 'setTextColor', val1: 255, val2: 255, val3: 255 },
        { type: 'setFontSize', size: 10 },
        { type: 'heading', value: 'Transaction Details', y: 55 },
        { type: 'setFontSize', size: 9 },
        { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
        { type: 'heading', value: this.translateService.instant('LBL_MADA_CARD'), y: 65 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        { type: 'heading', value: this.translateService.instant('LBL_CARD_HOLDER_NAME'), y: 75 },
        { type: 'heading', value: this.translateService.instant('LBL_CARD_NO'), y: 85 },
        { type: 'heading', value: this.translateService.instant('LBL_EXPIRY_DATE'), y: 95 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'heading', value: this.translateService.instant('LBL_AMOUNT_DETAILS'), y: 105 },
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
        { type: 'heading', value: this.translateService.instant('LBL_CURRENT_LIMIT'), y: 115 },
        { type: 'heading', value: this.translateService.instant('LBL_NEW_LIMIT'), y: 125 },
        // { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:135},
        // { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
        // { type: 'heading', value:this.translateService.instant('LBL_VALUE_DATE'), y:155},
        { type: 'text', value: 'Dameer Ahsan', y: 75 }, { type: 'text', value: '1010 XXXX XXXX 0011', y: 85 },
        { type: 'text', value: '31/07/2024', y: 95 },

        { type: 'text', value: '2000.00 SAR', y: 115 },
        { type: 'text', value: this.newLimit ? this.newLimit : '', y: 125 },
        // { type: 'text', value:this.creditObjArray[0].billerdueDate ? this.creditObjArray[0].billerdueDate : '', y:125},
        // { type: 'text', value:this.creditObjArray[0].billerdueDate ? this.creditObjArray[0].billerdueDate : '', y:125},
        // { type: 'text', value:this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : '', y:75},
        // { type: 'text', value:this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '', y:85},
        // { type: 'text', value:this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : '', y:95},
        // { type: 'text', value:this.creditObjArray[0].billerGroup? this.creditObjArray[0].billerGroup : '', y:115},
        // { type: 'text', value:this.creditObjArray[0].billerdueDate ? this.creditObjArray[0].billerdueDate : '', y:125},
        // { type: 'text', value: this.creditObjArray[0].billerAmount + ' ' + this.creditObjArray[0].currency ?  this.creditObjArray[0].billerAmount + ' ' + this.creditObjArray[0].currency : '', y:135},
        // { type: 'text', value: this.grandTotal + ' ' + this.biller_CCY ?  this.grandTotal + ' ' + this.biller_CCY : '', y:145},
        // { type: 'text', value: this.paymentDate ?  this.paymentDate : '', y:155},
        { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
        { type: 'heading', value: this.translateService.instant('LBL_REF_NUMBER'), y: 165 },
        { type: 'text', value: '121212121212', y: 165 },
        { type: 'heading', value: this.translateService.instant('LBL_MADA_CARD_ACTIVATION_MSG'), y: 175 },

      ]

    this.pdfData.push(
      { type: 'save', value: 'Madacard.pdf' }
    )

    this.downloadAsPdf.downloadpdf(this.pdfData);


  }
  cancelClick() {
    this.title = "Add New Mada Card";
    //this.chooseAccount=true;
    this.chooseAccount = true;
    this.accountSection = true;
  }




  validateSpace(event: any): void {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  getData(event: any) {
    this.authDetail = event;
  }

  onSecondFactorValue(authValue: any) {
    this.secAuthRef = authValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {

    if (otpValue) {
      if (otpValue.length === 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.onSubmit()
    } else {
      this.userOtpValue = '';
    }
  }

  toProceed() {
    //this.accountSection=false;
    // this.comment = this.comment.trim();
    // this.title = "review";

    this.initParam.accNo = this.selectedAccount?.OD_ACC_NO ? this.selectedAccount?.OD_ACC_NO : ""
    this.initParam.amt = this.selectedAccount?.CURRENT_BAL_AMT ? this.selectedAccount?.CURRENT_BAL_AMT : ""
    this.initParam.ccy = this.selectedAccount?.OD_CCY_CODE ? this.selectedAccount?.OD_CCY_CODE : ""
    this.initParam.cif = this.selectedAccount?.COD_CORECIF ? this.selectedAccount?.COD_CORECIF : ""

    this.isLoadingComplete = false;

    this.comment = this.comment.trim();
    this.title = "review";
    this.getAuthorizationData();

    // let params = {
    //   "unitId": this.rootScopeData?.userInfo?.UNIT_ID
    //     ? this.rootScopeData.userInfo.UNIT_ID
    //     : '',
    //   "cif": this.rootScopeData.userInfo?.sCustNo
    //   ? this.rootScopeData.userInfo.sCustNo : "", // clarification from API
    //   "productCode": "CORESVS",
    //   "subProdCode": "MADAREQ",
    //   "funcCode": "CRDREQFC",
    //   "amount":this.selectedAccount?.CURR_AVAIL_BAL_AMT, // clarification from API
    //   "accNo": this.selectedAccount?.OD_ACC_NO, // clarification from API
    //   "pymntCurrency": this.selectedAccount?.OD_CCY_CODE, // clarification from API
    //   "debitCurrency": "" // clarification from API
    // }

    // this.cardsService.addNewMadaFlexiAuth(params).subscribe(
    //   (authors: any) => {
    //     if (authors) {
    //       this.isLoadingComplete = true;
    //       this.comment = this.comment.trim();
    //       this.title = "review";
    //       this.getAuthorizationData();
    //       //this.rootScopeData.changeHeading = "Review";
    //       if (authors?.data?.selfAuth == 'true') {
    //         this.showAuthorization = true;
    //         this.authOptions = authors.data.authList;
    //       }
    //     }
    //   },
    //   () => {
    //     this.isLoadingComplete = true;
    //   }
    // );
  }

  getAuthorizationData() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.selectedAccount?.COD_CORECIF
        ? this.selectedAccount?.COD_CORECIF
        : '',
      accNo: this.selectedAccount?.OD_ACC_NO
        ? this.selectedAccount?.OD_ACC_NO
        : '',
      productCode: 'CORESVS',
      subProdCode: 'MADAREQ',
      funcCode: 'CRDREQFC',
      amount: this.selectedAccount?.CURRENT_BAL_AMT
        ? this.selectedAccount?.CURRENT_BAL_AMT
        : '',
      pymntCurrency: this.selectedAccount?.OD_CCY_CODE
        ? this.selectedAccount?.OD_CCY_CODE
        : '',
      debitCurrency: this.selectedAccount?.OD_CCY_CODE
        ? this.selectedAccount?.OD_CCY_CODE
        : ''
    };
    this.cardsService.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.data &&
          res.data.authList &&
          res.data.authList.length > 0
        ) {
          this.authOptions = res.data.authList;
        }
        if (res.data.flexiAuth === 'true') {
          this.isFlexiAuth = true;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  // callBackSuccess(){
  //   this.showAuthorization = true;
  // }

  // getCanelBtnClick(){
  //   this.onSubmit();
  // }

  onSubmit() {
    // if (!this.userOtpValue) {
    //   this.otpError = 'LBL_PLS_ENTER_OTP';
    //   return;
    // } else if (this.userOtpValue.length < 4) {
    //   this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    //   return;
    // }
    // this.constructReceiptData();
    if (this.userOtpValue && this.userOtpValue.length === 4) {
      this.isLoadingComplete = false;
      // console.log(this.selectedAccount,"TEST:::")
      let params = {
        "AUTH_TYPE_O": "",
        "secRef": this.secAuthRef,
        "otp": this.userOtpValue,
        "ruleId": this.authDetail && this.authDetail.selectedAprover
          ? this.authDetail.selectedAprover.PARSED_RULE_ID : "",
        "stnFlag": this.authDetail &&
          this.authDetail?.selectedAprover &&
          this.authDetail?.selectedAprover?.AUTH_NAME !== 'Any'
          ? 'Y'
          : 'N',
        "entlVal": "",
        "cifNo": this.selectedAccount?.COD_CORECIF
          ? this.selectedAccount?.COD_CORECIF : "",
        "orgAccNo": "",
        "custType": "",
        "reqCountryCode": "",
        "valueDate": "",
        "txnAmount": "",
        "txtCurrency": this.selectedAccount?.OD_CCY_CODE ? this.selectedAccount?.OD_CCY_CODE : "",
        "versionNo": "",
        "accountNumber": this.selectedAccount?.OD_ACC_NO ? this.selectedAccount?.OD_ACC_NO : "",
        "accName": this.selectedAccount?.OD_ACC_NAME ? this.selectedAccount?.OD_ACC_NAME : "",
        "status": this.selectedAccount?.STATUS ? this.selectedAccount?.STATUS : "",
        "ccy": this.selectedAccount?.OD_CCY_CODE ? this.selectedAccount?.OD_CCY_CODE : "",
        "balance": this.selectedAccount?.CURR_AVAIL_BAL_AMT ? this.selectedAccount?.CURR_AVAIL_BAL_AMT : ""
      }
      this.cardsService
        .submitAddMadaCard(params)
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;
            if (response.dataValue?.STATUS === 'SUCCESS') {
              this.submitResponse = response.dataValue;
              this.constructReceiptData(response?.dataValue?.INPUT_REFERENCE_NO, response?.dataValue?.expirydate); //.INPUT_REFERENCE_NO);
              this.submitSuccessful = true;
            } else {
              this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
            }
          },
          () => {
            this.isLoadingComplete = true;
          }
        );
    } else {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    }
    this.accountSection = false;
    this.newcardtitle = false;

  }

  // submitFunct() {
  //   this.constructReceiptData();
  // }

  // getReIssueEmit(event: any) {
  //   this.reIssueEmit = event;
  // }

  // getSubmitEmit(event: any) {
  //   if (event.canSubmit) {
  //     this.reIssueReviewEmit = event;
  //     this.submitFunct();
  //   } else {
  //     this.reIssueEmit.canProceed = false;
  //     this.reIssueReviewEmit.canSubmit = false;
  //   }
  // }

  constructReceiptData(refNo: any, expirydate:any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    this.fromAccountsObject = false;
    this.receiptObject = {
      msg1: 'LBL_REQUEST_SUCCESSFULL',
      msg2: 'LBL_ADD_CARD_RECEIPT_LIMIT',
      referenceNumber: refNo,
      showCallBackComponent: false,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: userId,
            },
            {
              dispKey: 'LBL_INQUIRY_ACCOUNT_NUMBER',
              dataKey: this.selectedAccount?.OD_ACC_NO,
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: expirydate? expirydate : '',
            }
          ],
        }
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

    if (this.isFlexiAuth.toString() === 'false' || !this.isFlexiAuth) {
      this.receiptObject.receiptDetails.splice(3, 0, {
        title: '',
        isTable: 'false',
        data: '',
        type: 'newMadaCard',
      });
    }

    (this.isFlexiAuth.toString() === "true") && this.receiptObject.receiptDetails.push(
      {
        title: 'LBL_AUTHORIZATION',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_Next_Approver',
            dataKey: this.authDetail.selectedAprover?.AUTH_NAME
              ? this.authDetail.selectedAprover.AUTH_NAME
              : 'Not Provided',
          },
          {
            dispKey: 'LBL_ADD_NEXT_APROVER',
            dataKey:
              this.authDetail?.aproveNote
                ? this.authDetail.aproveNote
                : 'Not Provided',
          },
        ]
      },
      {
        title: '',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_STATUS',
            dataKey: this.submitResponse?.STATUS
              ? this.submitResponse.STATUS
              : '--',
          },
          {
            dispKey: 'LBL_RESPONSE',
            dataKey: this.submitResponse?.OD_STATUS_DESC
              ? this.submitResponse.OD_STATUS_DESC
              : '--',
          },
        ],
      }
    )
    this.title = 'receipt';

  }

  openTermsAndCondition() { }

  addSelectedAccount(event: any) {
    this.chooseAccount = false;
    this.debitAccObj = event;
  }
}
