import { Component, OnInit } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { Router } from '@angular/router';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { CardsService } from '../../services/cards.service';
import {DatePipe} from '@angular/common';
@Component({
  selector: 'app-pos-purchase-limit-mada-card',
  templateUrl: './pos-purchase-limit-mada-card.component.html',
  styleUrls: ['./pos-purchase-limit-mada-card.component.scss']
})
export class PosPurchaseLimitMadaCardComponent implements OnInit {

  isLoadingComplete: boolean = true;
  isReasonReadonly: boolean = false;
  selectReasonError: boolean = false;
  selectCustomAmountError: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  amountLimit:any;
  maxamountLimit:any;
  currencyCode = "SAR";
  title: string = "posPurchaseLimit";
  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  isSelfAuth: boolean = false;
  customAmount: string = "";
  customAmountValue:string="";
  referenceNumber:any;
  receiptObject: any = {};
  submitResponse:any={};
  debitAccObj: any = {};
  selectedMadaCardObj: any = {};
  selectedCardData: any;
  newLimit: any;
  customLimit: any;
  reason: any;
  pdfData: any;
  newAmountLimit: any;
  comment: string = '';
  showAuthorization:boolean=false;
  submitSuccessful:boolean=false;
  initParam:any;
  madaCardDetailResponse:any;
  

  constructor(private datepipe:DatePipe, private cardsService: CardsService, private translateService: TranslateService, private downloadAsPdf: downloadAsPdf, private route: Router) { }

  ngOnInit(): void {

    this.rootScopeData.changeHeading = "Review";
    if (this.rootScopeData.selectedMada) {
      this.selectedMadaCardObj = this.rootScopeData.selectedMada;
      this.getMadaCardDetailAPI();
      // console.log(this.selectedMadaCardObj,"TEST:::POS::")
    }
    this.initParam = {
      pdroductCode: 'CORESVS',
      subPrdCode: 'MADPOSLIM',
      funcCode: "POSLMFNC",
      accNo: this.selectedMadaCardObj?.primaryAcctNo ? this.selectedMadaCardObj?.primaryAcctNo : "",
      amt: this.selectedMadaCardObj?.amount ? this.selectedMadaCardObj?.amount : "",
      cif: this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF  :"",
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
      ? this.rootScopeData.userInfo.UNIT_ID
      : '',
      ccy: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
    };

    this.selectedCardData = [
      {
        cardNum: this.selectedMadaCardObj.maskedCardNo,
        nickName: this.selectedMadaCardObj.name,
        status: this.selectedMadaCardObj.statusDescription,
        expiryDate: this.selectedMadaCardObj.expiryDate
      }
    ]
    this.constructMadaCardTable(this.selectedCardData);
    this.posNewLimit();
  }

  getMadaCardDetailAPI(){
    this.isLoadingComplete=false;
    const params={      
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID
      ? this.rootScopeData.userInfo.UNIT_ID
      : '',      
      "productName": "CORESVS",
      "subProdName": "MADASVS",
      "functionCode": "CDINQFNC",
      "cardNumber": this.selectedMadaCardObj.maskedCardNo
    };
    this.cardsService.getMadaCardDetail(params).subscribe(
      (res: any) => {
        //console.log('res', res);
        this.isLoadingComplete = true;
        if (
          res &&
          res.dataValue 
        ) {
          this.madaCardDetailResponse = res?.dataValue?.ATMCardDetailsResponse?.success;
          this.amountLimit= this.madaCardDetailResponse?.cardLimit ? this.madaCardDetailResponse?.cardLimit : "";
          this.maxamountLimit=this.madaCardDetailResponse?.cardLimit ? this.madaCardDetailResponse?.cardLimit : "";
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  posNewLimit(){
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.cardsService.posNewLimitService(params).subscribe(
      (res: any) => {
        // console.log('res', res);
        this.isLoadingComplete = true;
        if (
          res &&
          res.data 
        ) {
          this.newAmountLimit = res.data[0].newLimit;
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  initAnotherPayment() {
    this.title = "posPurchaseLimit";
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

        { type: 'text', value: this.amountLimit ? this.amountLimit : '', y: 115 },
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
        { type: 'text', value: this.referenceNumber ? this.referenceNumber : '', y: 165 },
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

  onSelectednewLimit() {
    this.selectReasonError = false;
    this.selectCustomAmountError = false;
    if (!this.newLimit)
      this.selectReasonError = true;
  }

  validateSpace(event: any): void {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
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
    // console.log(this.customAmount,"TEST::customAmount:::LL::")
    this.customAmountValue=this.customAmount;
    this.selectReasonError = false;
    this.selectCustomAmountError = false;
    //this.customAmount=customAmountVal;
    if (!this.newLimit || this.newLimit === '') {
      this.selectReasonError = true;
      return;
    }

    // UI validation for Maximum limit // Commenting the code requested by Backend team no validation for maximum limit
    // if ((this.newLimit === "Custom" && (!this.customAmount)) || (this.newLimit === "Custom" && (Number(this.customAmount) > Number(this.maxamountLimit)))) {
    //   this.selectCustomAmountError = true;
    //   return;
    // }

    this.comment = this.comment.trim();
    this.title = "review";
    this.getAuthorizationData();
    // let params = {
    //   "unitId": this.rootScopeData?.userInfo?.UNIT_ID
    //   ? this.rootScopeData.userInfo.UNIT_ID
    //   : '',
    //   "cif": this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF  :"",
    //   "productCode": "CORESVS",
    //   "subProdCode": "MADPOSLIM",
    //   "funcCode": "POSLMFNC",
    //   "amount": "", // clarification from API
    //   "accNo": this.selectedMadaCardObj?.primaryAcctNo ? this.selectedMadaCardObj?.primaryAcctNo : "", // clarification from API
    //   "pymntCurrency": "", // clarification from API
    //   "debitCurrency": "" // clarification from API
    // }

    // this.cardsService.posPurchaseLimitFlexiAuth(params).subscribe(
    //   (authors: any) => {
    //     if (authors) {
    //       this.isLoadingComplete = true;
    //       this.comment = this.comment.trim();
    //       this.title = "review";
    //       this.getAuthorizationData();
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
      cif: this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF  :"",
      accNo: this.selectedMadaCardObj?.primaryAcctNo
        ? this.selectedMadaCardObj?.primaryAcctNo
        : '',
      productCode: 'CORESVS',
      subProdCode: 'MADPOSLIM',
      funcCode: 'POSLMFNC',
      amount: this.selectedMadaCardObj?.amount ? this.selectedMadaCardObj?.amount : "",
      pymntCurrency: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
      debitCurrency: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
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
          this.isSelfAuth = true;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  onSubmit() {

    // console.log(this.customAmount,"TEST::customAmount:::LL::")
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
        "cifNo": this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF  :"",
        "unitId":this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
        "orgAccNo": this.selectedMadaCardObj?.primaryAcctNo,
        "custType": "",
        "reqCountryCode": "",
        "valueDate": "",
        "txtCurrency": "",
        "txnAmount": "",
        "versionNo": "1",
        "cardName": "",
        "cardNo": this.selectedMadaCardObj?.pan,
        "accountNumber": this.selectedMadaCardObj?.primaryAcctNo,
        "expiryDate": this.selectedMadaCardObj?.expires,
        currentLimit:this.amountLimit,
        newLimit:this.newAmountLimit,
        "status":this.selectedMadaCardObj?.status
      }
      this.cardsService
        .submitPoSPurchaseLimit(params)
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;

            if (response.dataValue?.STATUS === 'SUCCESS') {
              this.submitResponse = response.dataValue;
              this.constructReceiptData(response?.dataValue?.INPUT_REFERENCE_NO); //.INPUT_REFERENCE_NO);
              this.submitSuccessful = true;
            } else {
              this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
              // this.isLoadingComplete = true;
            }
          },
          () => {
            this.isLoadingComplete = true;
          }
        );
    } else {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    }
    //this.constructReceiptData(refno)
  }

  constructReceiptData(refNo:any) {
    //console.log(this.customLimit,"TEST:::LL::customlimit::")
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.amountLimit = this.amountLimit ? currencyFormatPipeFilter.transform(this.amountLimit.toString().trim(), this.currencyCode) + " " + this.currencyCode : '';
    this.newLimit = this.newLimit ? currencyFormatPipeFilter.transform(this.newLimit.toString().trim(), this.currencyCode) + " " + this.currencyCode : '';
    this.customAmountValue = this.customAmountValue ? currencyFormatPipeFilter.transform(this.customAmountValue.trim(), this.currencyCode) + " " + this.currencyCode : '';
// console.log(this.customLimit,"TEST:::LL::customlimit::")
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_POS_RECEIPT_LIMIT',
      referenceNumber: refNo,
      receiptDetails: [
        {
          title: 'LBL_MADA_CARD',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_HOLDER_NAME',
              dataKey: this.selectedMadaCardObj?.name ? this.selectedMadaCardObj?.name :"",
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
        },
        {
          title: 'LBL_AMOUNT_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CURRENT_LIMIT',
              dataKey: this.amountLimit,
            },
            {
              dispKey: 'LBL_NEW_LIMIT',
              dataKey: this.customAmountValue ? this.customAmountValue : this.newLimit,
            }
          ],
        }
        
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: '/assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: '/assets/images/saveReceipt.svg',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
      initiateButton: {
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST'
      },
    };

    if (this.isSelfAuth.toString() === 'false' || !this.isSelfAuth) {
      this.receiptObject.receiptDetails.splice(2, 0, {
        title: '',
        isTable: 'false',
        data: '',
        type: 'posMada',
      });
    }

    (this.isSelfAuth.toString() === "true") && this.receiptObject.receiptDetails.push(
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
      },{
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

}
