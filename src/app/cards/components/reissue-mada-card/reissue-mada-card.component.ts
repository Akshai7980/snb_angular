import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { CardsService } from '../../services/cards.service';
@Component({
  selector: 'app-reissue-mada-card',
  templateUrl: './reissue-mada-card.component.html',
  styleUrls: ['./reissue-mada-card.component.scss']
})
export class ReissueMadaCardComponent implements OnInit {

  isLoadingComplete: boolean = true;

  reIssueEmit: any = {};
  reIssueReviewEmit: any = {};
  rootScopeData: RootScopeDeclare = RootScopeData;
  title: string = "reissueCard";
  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  isSelfAuth: boolean = false;
  isFlexiAuth: boolean = false;
  submitResponse: any = {};
  showAuthorization: boolean = false;
  callbackValidation: boolean = false;
  pdfData: any;
  receiptObject: any = {};
  debitAccObj: any = {};
  selectedMadaCardData: any;
  authDataObj: any;
  initParam: any;
  sefAuthFlag:any;
  newLimit: any;
  reason: any;
  selectedMadaCardObj: any;
  comment: string = '';
  submitSuccessful: boolean = false;
  referenceNumber: any;
  pageName: string = 'reissueCard';
  pageCall: any;
  authType: any;
  constructor(private cardsService: CardsService, private translateService: TranslateService, private downloadAsPdf: downloadAsPdf, private route: Router) { }

  ngOnInit(): void {
    this.pageCall = "reissueCard";
    if (this.rootScopeData.selectedMada) {
      this.selectedMadaCardObj = this.rootScopeData.selectedMada;
      //console.log(this.selectedMadaCardObj,"TEST:::::")
      this.selectedMadaCardData = [
        {
          cardNum: this.selectedMadaCardObj.maskedCardNo,
          nickName: this.selectedMadaCardObj.name,
          status: this.selectedMadaCardObj.statusDescription,
          expiryDate: this.selectedMadaCardObj.expiryDate
        }
      ]
    }
    this.initParam = {
      pdroductCode: 'CORESVS',
      subPrdCode: 'MADSTOP',
      funcCode: "MADSTPFC",
      accNo: this.selectedMadaCardObj?.primaryAcctNo ? this.selectedMadaCardObj?.primaryAcctNo : "",
      amt: this.selectedMadaCardObj?.amount ? this.selectedMadaCardObj?.amount : "",
      cif: this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF : "",
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
        ccy: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
    };
    this.constructMadaCardTable(this.selectedMadaCardData);
    // this.constructMadaCardTable(this.creditCardData);   
    // this.reIssueEmit.canProceed = false;
    // this.reIssueReviewEmit.canSubmit = false;
  }

  initAnotherPayment() {
    this.title = "reissueCard";
    this.route.navigate(['/cards/cardsInquiry/MADA'])
  }

  callBackSuccess(){
    this.showAuthorization = true;
  }

  getCanelBtnClick(){
    this.route.navigate(['/cards/cardsInquiry/MADA'])
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

        { type: 'text', value: '100.00 SAR', y: 115 },
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
        { type: 'text', value: '9987462132012345', y: 165 },
        { type: 'heading', value: this.translateService.instant('LBL_POS_RECEIPT_LIMIT'), y: 175 },

      ]

    this.pdfData.push(
      { type: 'save', value: 'Madacard.pdf' }
    )

    this.downloadAsPdf.downloadpdf(this.pdfData);


  }

  constructMadaCardTable(data: any) {
    this.debitAccObj = {
      title: 'LBL_MADA_CARD',
      data: data,
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'cardNum',
        },
        {
          dispKey: 'LBL_ISSUE_DATE',
          dataKey: 'issueDate',
        }, {
          dispKey: 'LBL_CARD_HOLDER_NAME',
          dataKey: 'nickName',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'status',
        },
        {
          dispKey: 'LBL_EXPIRY_DATE',
          dataKey: 'expiryDate',
        },
      ],
    };
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
      this.onSubmit();
    } else {
      this.userOtpValue = '';
    }
  }

  toProceed() {
    this.title = "review";
    this.initParam.accNo =  this.selectedMadaCardObj?.primaryAcctNo ? this.selectedMadaCardObj?.primaryAcctNo : ""
    this.initParam.amt = this.selectedMadaCardObj?.amount ? this.selectedMadaCardObj?.amount : ""
    this.initParam.ccy =  this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : ""
    
    this.getAuthorizationData();
  }

  getAuthorizationData() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF : "",
      accNo: this.selectedMadaCardObj?.primaryAcctNo
        ? this.selectedMadaCardObj?.primaryAcctNo
        : '',
      productCode: 'CORESVS',
      subProdCode: 'MADREISS',
      funcCode: 'MADREISFNC',
      amount: this.selectedMadaCardObj?.amount ? this.selectedMadaCardObj?.amount : "",
      pymntCurrency: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
      debitCurrency: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
    };
    this.cardsService.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        this.comment = this.comment.trim();
        this.title = "review";
        // console.log(res,"TEST:::L::")
        if (
          res &&
          res.data &&
          res.data.authList &&
          res.data.authList.length > 0
        ) {
          this.sefAuthFlag = res.data.selfAuth;
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

  onSubmit() {

    // if (!this.userOtpValue) {
    //   this.otpError = 'LBL_PLS_ENTER_OTP';
    //   return;
    // } else if (this.userOtpValue.length < 4) {
    //   this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    //   return;
    // }

    if (this.userOtpValue && this.userOtpValue.length === 4) {
      this.isLoadingComplete = false;
      let params = {
        "AUTH_TYPE_O": "",
        "PARAM2": this.secAuthRef,
        "PARAM1": this.userOtpValue,
        "SEL_PARSED_RULE_ID": "",
        "cifNo": this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF : "",
        "unitId": this.rootScopeData?.userInfo?.UNIT_ID
          ? this.rootScopeData.userInfo.UNIT_ID
          : '',
        "orgAccNo": this.selectedMadaCardObj?.primaryAcctNo,
        "txnStatus": "",
        "custType": "",
        "reqCountryCode": "",
        "valueDate": "",
        "txtCurrency": "",
        "txnAmount": "",
        "versionNo": "1",
        "expiryDate": this.selectedMadaCardObj?.expires,
        "issueDate": this.selectedMadaCardObj?.issueDate ? this.selectedMadaCardObj?.issueDate : "",
        "cardName": this.selectedMadaCardObj?.name,
        "cardNo": this.selectedMadaCardObj?.pan,
        "status": this.selectedMadaCardObj?.status,
        authName:
        this.authDataObj &&
        this.authDataObj.selectedAprover &&
        this.authDataObj.selectedAprover.AUTH_NAME
          ? this.authDataObj.selectedAprover.AUTH_NAME
          : 'LBL_NOT_PROVIDED',
      authNote:
        this.authDataObj &&
        this.authDataObj.selectedAprover &&
        this.authDataObj.aproveNote
          ? this.authDataObj.aproveNote
          : 'LBL_NOT_PROVIDED',
      PARSED_RULE_ID:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.PARSED_RULE_ID
          : '',
      SELECTION_FLAG:
        this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
      sefAuthFlag: this.sefAuthFlag,
        "authType":this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
      }
      this.cardsService
        .submitReIssueMada(params)
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;

            if (response?.dataValue?.STATUS === 'SUCCESS') {
              this.rootScopeData.dataFromContextMenu = '';
              this.referenceNumber = response?.dataValue?.INPUT_REFERENCE_NO;
              this.submitResponse = response.dataValue;
              this.constructReceiptData(this.referenceNumber);
              // this.constructReceiptData(response.data.authList[0].OD_USER_NO); //.INPUT_REFERENCE_NO);
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

    // const data = {
    //   "AUTH_TYPE_O": "",
    //   param2: this.secAuthRef,
    //   param1: this.userOtpValue,
    //   authName:
    //     this.authDataObj &&
    //     this.authDataObj.selectedAprover &&
    //     this.authDataObj.selectedAprover.AUTH_NAME
    //       ? this.authDataObj.selectedAprover.AUTH_NAME
    //       : 'LBL_NOT_PROVIDED',
    //   authNote:
    //     this.authDataObj &&
    //     this.authDataObj.selectedAprover &&
    //     this.authDataObj.aproveNote
    //       ? this.authDataObj.aproveNote
    //       : 'LBL_NOT_PROVIDED',
    //   PARSED_RULE_ID:
    //     this.authDataObj && this.authDataObj.selectedAprover
    //       ? this.authDataObj.selectedAprover.PARSED_RULE_ID
    //       : '',
    //   SELECTION_FLAG:
    //     this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
    //   sefAuthFlag: this.showAuthorization

    //   //showNext: this.showNext,
    // };
    // if (!this.userOtpValue) {
    //   this.otpError = 'LBL_PLS_ENTER_OTP';
    //   return;
    // } else if (this.userOtpValue.length < 4) {
    //   this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    //   return;
    // }
    //this.submitFunct()

  }

  // submitFunct() {
  //   this.constructReceiptData(this.referenceNumber);
  // }
  setAuthorizationData(authorDetails: any): void {
    this.authDataObj = authorDetails;
  }
  getReIssueEmit(event: any) {
    this.reIssueEmit = event;
  }

  // getSubmitEmit(event: any) {
  //   if (event.canSubmit) {
  //     this.reIssueReviewEmit = event;
  //     this.submitFunct();
  //   } else {
  //     this.reIssueEmit.canProceed = false;
  //     this.reIssueReviewEmit.canSubmit = false;
  //   }
  // }
  getAuthType(val: any) {
    this.authType = val
  }
  constructReceiptData(refNo: any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    // Object.assign([this.selectedDebitObj][0], { USER_ID: userId })
    this.receiptObject = {
      msg1: 'LBL_REQUEST_SUCCESSFULL',
      msg2: 'LBL_RE_ISSUE_CARD_REQUEST_PENDING_MSG',
      referenceNumber: refNo,
      showCallBackComponent: false,
      receiptDetails: [
        {
          title: 'LBL_MADA_CARD',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: userId,
            },
            {
              dispKey: 'LBL_CARD_HOLDER_NAME',
              dataKey: this.selectedMadaCardObj?.name,
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.selectedMadaCardObj?.maskedCardNo ? this.selectedMadaCardObj?.maskedCardNo : "",
            },
            {
              dispKey: 'LBL_EXPIRY_DATE',
              dataKey: this.selectedMadaCardObj?.expiryDate ? this.selectedMadaCardObj?.expiryDate : "",
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
      }
    };

    if (this.isFlexiAuth.toString() === 'false' || !this.isFlexiAuth) {
      this.receiptObject.receiptDetails.splice(1, 0, {
        title: '',
        isTable: 'false',
        data: '',
        type: 'reissueMada',
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
          }]
      },{
      title: '',
      isTable: 'false',
      fieldDetails: [
        {
          dispKey: 'LBL_STATUS',
          dataKey: this.submitResponse?.OD_STATUS
            ? this.submitResponse.OD_STATUS
            : '--',
        },
        {
          dispKey: 'LBL_RESPONSE',
          dataKey: this.submitResponse?.OD_STATUS_DESC
            ? this.submitResponse.OD_STATUS_DESC
            : '--',
        },
      ],
    })
    // (this.isSelfAuth.toString() === "false") && this.receiptObject.receiptDetails.push({
    //   title: '',
    //   isTable: 'false',
    //   fieldDetails: [
    //     {
    //       dispKey: 'LBL_FAILED',
    //       dataKey: 'LBL_FAILED_MESSAGE',
    //     },
    //     {
    //       dispKey: 'LBL_RESPONSE',
    //       dataKey: '--'
    //     },
    //   ],
    // }),
    this.title = 'receipt';

  }

  openTermsAndCondition() { }

}
