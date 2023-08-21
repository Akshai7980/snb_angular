import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import {Router} from '@angular/router';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { CardsService } from '../../services/cards.service';
@Component({
  selector: 'app-stop-mada-card',
  templateUrl: './stop-mada-card.component.html',
  styleUrls: ['./stop-mada-card.component.scss']
})
export class StopMadaCardComponent implements OnInit {

  isLoadingComplete: boolean = true;
  isReasonReadonly: boolean = false;
  selectReasonError: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  title: string = "stopCard";
  authOptions: Array<object> = [];
  authDetail: any = {};
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any = '';
  isSelfAuth: boolean = false;

  receiptObject: any = {};
  debitAccObj: any = {};
  submitResponse: any = {};
  selectedMadaCardObj:any;
  selectedMadaCardData: any;
  newLimit: any;
  reason: any;
  reasons: any;
  comment: string = '';
  pdfData: any;
  showAuthorization:boolean=false;
  submitSuccessful:boolean=false;
  initParam:any;
  

  constructor(private cardsService: CardsService, private translateService: TranslateService, private downloadAsPdf:downloadAsPdf, private route: Router) { }

  ngOnInit(): void {
    
    if (this.rootScopeData.selectedMada) {
      this.selectedMadaCardObj = this.rootScopeData.selectedMada;
      //console.log(this.selectedMadaCardObj,"TEST:::::")      
      this.selectedMadaCardData= [
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
      cif: this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF  :"",
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
      ? this.rootScopeData.userInfo.UNIT_ID
      : '',
      ccy: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
    };

    this.constructMadaCardTable(this.selectedMadaCardData);

    this.callStopCardReasonList();

  }
  callStopCardReasonList(){
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.cardsService.stopReasonValueservice(params).subscribe(
      (res: any) => {
        //console.log('res', res);
        this.isLoadingComplete = true;
        if (
          res &&
          res.data 
        ) {
          this.reasons = res.data[0].madaCard;
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }
  
  initAnotherPayment(){
    this.title = "posPurchaseLimit";
    this.route.navigate(['/cards/cardsInquiry/MADA'])
  }
  downloadPdf(){
     
    this.pdfData = 
    [
      { type:'setFontSize', size:11},
      { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
      { type:'setTextColor', val1:0, val2:0, val3:0},
      { type: 'title', value:"Mada card Receipt", x:90, y:35},
      { type:'setFontSize', size:10},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type:'setFontSize', size:10},
      { type: 'setFillColor', val1:128, val2:128, val3:128},
      { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
      { type:'setTextColor', val1:255, val2:255, val3:255},
      { type:'setFontSize', size:10},
      { type: 'heading', value:'Transaction Details', y:55},
      { type:'setFontSize', size:9},
      { type:'setTextColor', val1:0, val2:0, val3:0}, 
      { type: 'heading', value:this.translateService.instant('LBL_MADA_CARD'), y:65},
      { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
      { type: 'heading', value:this.translateService.instant('LBL_CARD_HOLDER_NAME'), y:75},
      { type: 'heading', value:this.translateService.instant('LBL_CARD_NO'), y:85},
      { type: 'heading', value:this.translateService.instant('LBL_EXPIRY_DATE'), y:95},
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type: 'heading', value:this.translateService.instant('LBL_AMOUNT_DETAILS'), y:105},
      { type:'setFont', fontName:'helvetica', fontStyle:'normal'},
      { type: 'heading', value:this.translateService.instant('LBL_CURRENT_LIMIT'), y:115},
      { type: 'heading', value:this.translateService.instant('LBL_NEW_LIMIT'), y:125},
      // { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:135},
      // { type: 'heading', value:this.translateService.instant('LBL_DEBIT_AMT'), y:145},
      // { type: 'heading', value:this.translateService.instant('LBL_VALUE_DATE'), y:155},
      { type: 'text', value: 'Dameer Ahsan', y:75},{ type: 'text', value: '1010 XXXX XXXX 0011', y:85},
      { type: 'text', value: '31/07/2024', y:95},
      
      { type: 'text', value:'100.00 SAR', y:115},
      { type: 'text', value: '200.00 SAR', y:125},
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
      { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
      { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:165},
      { type: 'text', value: '12121212121212', y:165},
      { type: 'heading', value:this.translateService.instant('LBL_POS_RECEIPT_LIMIT'), y:175},
      
    ]

      this.pdfData.push(
        { type: 'save', value:'Madacard.pdf'}
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

  onSelectedReason() {
    if (this.reason || this.reason !== '')
      this.selectReasonError = false;
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
    this.selectReasonError = false;
    this.title = "review";
    if (!this.reason || this.reason === '') {
      this.selectReasonError = true;
      return;
    }

    this.getAuthorizationData();

    // let params = {
    //   "unitId": this.rootScopeData?.userInfo?.UNIT_ID
    //   ? this.rootScopeData.userInfo.UNIT_ID
    //   : '',
    //   "cif": this.selectedMadaCardObj?.shortCIF ? this.selectedMadaCardObj?.shortCIF  :"", // clarification from API
    //   "productCode": "CORESVS",
    //   "subProdCode": "MADSTOP",
    //   "funcCode": "MADSTPFC",
    //   "amount": "", // clarification from API
    //   "accNo": this.selectedMadaCardObj?.primaryAcctNo, // clarification from API
    //   "pymntCurrency": "", // clarification from API
    //   "debitCurrency": "" // clarification from API
    // }

    // this.cardsService.stopMadaFlexiAuth(params).subscribe(
    //   (authors: any) => {
    //     if (authors) {
    //       this.isLoadingComplete = true;
    //       this.comment = this.comment.trim();
    //       this.title = "review";
    //       this.getAuthorizationData();
    //       if (authors?.data?.selfAuth == 'true') {
    //         this.showAuthorization = true;
    //         this.authOptions = authors.data?.authList;
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
      cif: this.selectedMadaCardObj?.shortCIF
        ? this.selectedMadaCardObj?.shortCIF
        : '',
        accNo: this.selectedMadaCardObj?.primaryAcctNo
        ? this.selectedMadaCardObj?.primaryAcctNo
        : '',
      productCode: 'CORESVS',
      subProdCode: 'MADSTOP',
      funcCode: 'MADSTPFC',
      amount: this.selectedMadaCardObj?.amount ? this.selectedMadaCardObj?.amount : "",
      pymntCurrency: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
      debitCurrency: this.selectedMadaCardObj?.currency ? this.selectedMadaCardObj?.currency : "",
    };
    this.cardsService.getAuthorizerList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        this.comment = this.comment.trim();
          this.title = "review";
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
      let params = {
        "AUTH_TYPE_O": "",
        "secRef": this.secAuthRef,
        "otp": this.userOtpValue,
        "selfParsedRuleId": this.authDetail && this.authDetail.selectedAprover
        ? this.authDetail.selectedAprover.PARSED_RULE_ID
        : '',
        "stnFlag": this.authDetail &&
        this.authDetail?.selectedAprover &&
        this.authDetail?.selectedAprover?.AUTH_NAME !== 'Any'
          ? 'Y'
          : 'N',
        "entlVal": "",
        "cifNo": this.selectedMadaCardObj?.shortCIF
        ? this.selectedMadaCardObj?.shortCIF : "",
        "unitId":this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
        "orgAccNo": this.selectedMadaCardObj?.primaryAcctNo ? this.selectedMadaCardObj?.primaryAcctNo : "",
        "custType": "",
        "reqCountryCode": "",
        "valueDate": "",
        "txtCurrency": "",
        "txnAmount": "",
        "versionNo": "1",
        "cardName": "", // Waiting for backend team
        "cardNo": this.selectedMadaCardObj?.pan,
        "status":this.selectedMadaCardObj?.status,
        "expiryDate": this.selectedMadaCardObj?.expires,
        "resons": this.reason
      }
      this.cardsService
        .stopMadaCardSubmit(params)
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;

            if (response.dataValue?.STATUS === 'SUCCESS') {
              this.submitResponse = response.dataValue;
              this.constructReceiptData(response?.dataValue?.INPUT_REFERENCE_NO); //.INPUT_REFERENCE_NO);
              this.submitSuccessful = true;
            } else {
              this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
              this.isLoadingComplete = true;
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

  constructReceiptData(refNo:any) {
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_STOP_CREDIT_CARD_SENT_TO_APPROVE',
      referenceNumber: refNo,
      receiptDetails: [
        {
          title: 'LBL_MADA_CARD',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CARD_HOLDER_NAME',
              dataKey: this.selectedMadaCardObj?.name ? this.selectedMadaCardObj?.name : "",
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
          title: 'LBL_ADDITIONAL_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_REASON_TO_STOP',
              dataKey: this.reason,
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
        type: 'stopMada',
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

  openTermsAndCondition() {}

}
