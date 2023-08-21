import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { EpayServiceService } from '../../services/epay-service.service';
@Component({
  selector: 'app-merchant-finance-dispute',
  templateUrl: './merchant-finance-dispute.component.html',
  styleUrls: ['./merchant-finance-dispute.component.scss']
})
export class MerchantFinanceDisputeComponent implements OnInit {
  mobileNumber: any;
  financialType: any;
  description: any;
  isLoadingComplete:boolean=false;
  title:string='ePayMerchantClaim';
  authOptions: Array<object> = [];
  flexiAuth:any;
  isSelfAuth:boolean=false;
  authDetail:any;
  secAuthRef:any;
  userOtpValue:any;
  otpError:any;
  initParam:any;
  merchantClaimReqObj:any=[];
  claimTypeDropdown:any=[];
  norecordflag:boolean=false;
  submittedData:any;
  saveReceiptObject:any;
  receiptObject:any;
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private router: Router, private epayService: EpayServiceService, private location: Location, private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf) {}

  ngOnInit(): void {
    this.title="MultiClaimReq";
    this.getMerchantFinanceDisputeAPI();
    this.getClaimTypeValues();

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
  getClaimTypeValues(){
    this.isLoadingComplete = false;
    let reqData={
      "action": "GET_POS_AMOUNT_TYPE_ACTION",
       "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : ''
    }
    this.epayService.getEPayRefundTypes(reqData).subscribe(
      (res:any)=>{
        this.isLoadingComplete = true;
        // console.log(res,"TEST:::")
        this.claimTypeDropdown=res?.data[0]?.amountType
      },(error:any)=>{
        this.isLoadingComplete = true;
      }      
    );
  }
  getMerchantFinanceDisputeAPI(){
      this.norecordflag = false;
      this.isLoadingComplete = false;
      let reqObj = {
        referenceNo: this.rootScopeData?.selectedEPayTransaction?.transactionReference ? this.rootScopeData?.selectedEPayTransaction?.transactionReference : "",
        unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      }

      this.epayService.epayMerchantFinanceDispute(reqObj).subscribe(
        (res: any) => {
          this.isLoadingComplete = true;
          if (
            res &&
            res.data 
          ) {
            this.merchantClaimReqObj.push(res?.data);
          }
        },
        (err: any) => {
          this.isLoadingComplete = true;
        }
      );
  }
  proceedButton(event: any) {
    this.title = 'review';
    this.getAuthorizationData();
  }
  getAuthorizationData() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cif: this.rootScopeData?.selectedEPayTransaction?.cif
        ? this.rootScopeData?.selectedEPayTransaction?.cif
        : '',
        accNo: this.rootScopeData?.selectedEPayTransaction?.accNo
        ? this.rootScopeData?.selectedEPayTransaction?.accNo
        : '',
      productCode: 'CORESVS',
      subProdCode: 'EPYTRSN',
      funcCode: 'EPYTRNFNC',
      amount: this.rootScopeData?.selectedEPayTransaction?.balance
        ? this.rootScopeData?.selectedEPayTransaction?.balance
        : '',
        pymntCurrency: this.rootScopeData.selectedEPayTransaction?.currency
        ? this.rootScopeData.selectedEPayTransaction?.currency
        : '',
        debitCurrency: this.rootScopeData.selectedEPayTransaction?.currency
        ? this.rootScopeData.selectedEPayTransaction?.currency
        : '',
    };
    this.epayService.getEPayAuthorizers(params).subscribe(
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
        this.flexiAuth = res.data?.flexiAuth;
        if (res.data.selfAuth === 'true') {
          this.isSelfAuth = true;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
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
      this.onSubmit()
    } else {
      this.userOtpValue = '';
    }
  }
  onSubmit() {
    this.title='receipt';
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    this.isLoadingComplete = false;
    const params = {
      PARAM2: this.userOtpValue,
      PARAM1: this.secAuthRef,
      SEL_PARSED_RULE_ID: this.authDetail?.selectedAprover?.PARSED_RULE_ID
      ? this.authDetail.selectedAprover?.PARSED_RULE_ID
      : '',
      SELECTION_FLAG: this.authOptions.length > 0 ? 'Y' : 'N',
      INPUT_FUNCTION_CODE: 'EPYMRFNC',
      INPUT_PRODUCT: 'CORESVS',
      INPUT_SUB_PRODUCT: 'EPYMCR',
      INPUT_CIF_NO: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo.sCustNo
        : '',
      INPUT_UNIT_ID: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      INPUT_CHANNEL_ID: '3',
      ACCNO: this.merchantClaimReqObj[0].accNo ? this.merchantClaimReqObj[0].accNo : '',
      NICKNAME: this.merchantClaimReqObj[0].nickname ? this.merchantClaimReqObj.nickname : '',
      FULLNAME: this.merchantClaimReqObj[0].fullname ? this.merchantClaimReqObj[0].fullname : '',
      STATUS: this.merchantClaimReqObj[0].Status ? this.merchantClaimReqObj[0].Status : '',
      BALANCE: this.merchantClaimReqObj[0].amount ? this.merchantClaimReqObj[0].amount : '',
      MERCHANTENGNAME: this.merchantClaimReqObj[0].merchantName ? this.merchantClaimReqObj[0].merchantName : '',
      MERCHANTID: this.merchantClaimReqObj[0].merchantId ? this.merchantClaimReqObj[0].merchantId : '',
      CLAIMDES: this.merchantClaimReqObj[0].claimDesc ? this.merchantClaimReqObj[0].claimDesc : '',
      REFUNDTYPE: this.merchantClaimReqObj[0].refundType ? this.merchantClaimReqObj[0].refundType : '',
      DEDUCTIONDATE: '',
      CLAIMTYPE: this.merchantClaimReqObj[0].claimType ? this.merchantClaimReqObj[0].claimType : '',
      SEQUENCE: this.merchantClaimReqObj[0].sequenceNo ? this.merchantClaimReqObj[0].sequenceNo : '',
      CARDTYPE: this.merchantClaimReqObj[0].cardType ? this.merchantClaimReqObj[0].cardType : '',
      CARDNO: this.merchantClaimReqObj[0].cardNo ? this.merchantClaimReqObj[0].cardNo : '',
      AMOUNT: this.merchantClaimReqObj[0].amount ? this.merchantClaimReqObj[0].amount : '',
      TRANSDATE: this.merchantClaimReqObj[0].epayDate ? this.merchantClaimReqObj[0].epayDate : '',
      REFUNDAMNT: this.merchantClaimReqObj[0].refundAmt ? this.merchantClaimReqObj[0].refundAmt : '',
      MOBILENO: this.merchantClaimReqObj[0].mobileNo ? this.merchantClaimReqObj[0].mobileNo : '',
      RRN: ''
    };
    
    this.epayService.ePayTransactionRefundAmountSubmit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (
          res &&
          res.dataValue &&
          res.dataValue.STATUS &&
          res.dataValue.STATUS === 'SUCCESS'
        ) {
          this.submittedData = res.dataValue;
          this.constructReceiptData(res?.dataValue?.INPUT_REFERENCE_NO);
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }
  cancelButton(event: any) {
    if (event) {
      this.mobileNumber = '';
      this.financialType = '';
      this.description = '';
    }
  }
  cancelMerchantDetail() {
    this.rootScopeData.showtransaction = true;
    this.rootScopeData.showMerchantDetail = false;
    this.location.back();
  }
  constructReceiptData(refNo:any) {
    this.saveReceiptObject = {
      pageheading: this.translateService.instant('LBL_REQ_SUCCESS'),
      subHeading: this.translateService.instant(
        'LBL_YOUR_MERCHANT_CLAIM_REQUEST_IS_PENDING_FOR_APPROVAL'
      ),
      Description: this.translateService.instant(
        'LBL_EPAY_REFUND_REQUEST_PENDING_FOR_APPROVAL_REQUEST_IS_INT_SUCCESS'
      ),
      keyValues: [],
      pagecall: 'refundRequest',
      refNo: this.submittedData.INPUT_REFERENCE_NO,
    };
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    this.receiptObject = {
      msg1: 'LBL_REQ_SUCCESS',
      msg2: 'LBL_YOUR_MERCHANT_CLAIM_REQUEST_IS_PENDING_FOR_APPROVAL',
      referenceNumber: this.submittedData.INPUT_REFERENCE_NO,
      receiptDetails: [
        {
          title: 'LBL_TRANSACTION_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_REF_NUMBER',
              dataKey: refNo,
            },
            {
              dispKey: 'LBL_CARD_NO',
              dataKey: this.merchantClaimReqObj[0]?.cardNo
                ? this.merchantClaimReqObj[0]?.cardNo
                : '--',
            },
            {
              dispKey: 'LBL_DATE',
              dataKey: this.merchantClaimReqObj[0]?.epayDate
                ? this.merchantClaimReqObj[0]?.epayDate
                : '--',
            }
          ],
        },
        {
          title: 'LBL_REQUEST_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CLAIM_TYPE',
              dataKey: this.financialType
                ? this.financialType
                : '--',
            },
            {
              dispKey: 'LBL_CLAIM_DESCRIPTION',
              dataKey: this.description
                ? this.description
                : '--',
            }
          ],
        },
        
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
        buttonLabel: 'LBL_MAKE_ANOTHER_REQUEST',
      },
    };
    this.flexiAuth.flexiAuth.toString() === 'true' &&
      this.receiptObject.receiptDetails.push(
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
              dataKey: this.authDetail?.aproveNote
                ? this.authDetail.aproveNote
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
              dataKey: this.submittedData?.STATUS ? this.submittedData.STATUS : '--',
            },
            {
              dispKey: 'LBL_RESPONSE',
              dataKey: this.submittedData?.OD_STATUS_DESC
                ? this.submittedData.OD_STATUS_DESC
                : '--',
            },
          ],
        }
      );
    this.title = 'receipt';
  }
  makeAnotherTransaction() {
    this.location.back();
  }
  downloadPdf() {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    let pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_MERCHANT_CLAIM_REQUEST_RECEIPT'),
        x: 75,
        y: 35,
      },
      { type: 'setFontSize', size: 10 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setFontSize', size: 10 },
      { type: 'setDrawColor', val: 128 },
      { type: 'setFillColor', val1: 128, val2: 128, val3: 128 },
      { type: 'drawRect', x: 15, y: 51, w: 90, h: 6, s: 'F' },
      { type: 'setTextColor', val1: 255, val2: 255, val3: 255 },
      { type: 'setFontSize', size: 10 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_TRANSACTION_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: '0', val2: '0', val3: '0' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CARD_NO'),
        y: 75,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_DATE'),
        y: 85,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REQUEST_DETAILS'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REFUND_AMOUNT'),
        y: 105,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_CLAIM_DESCRIPTION'),
        y: 115,
      },
      {
        type: 'text',
        value: this.merchantClaimReqObj?.cardNo
        ? this.merchantClaimReqObj?.cardNo
        : '--',
        y: 65,
      },
      {
        type: 'text',
        value: this.merchantClaimReqObj?.cardType
        ? this.merchantClaimReqObj?.cardType
        : '--',
        y: 75,
      },
      
      {
        type: 'text',
        value: this.financialType
          ? this.financialType
          : '--',
        y: 115,
      },
      {
        type: 'text',
        value: this.description
          ? this.description
          : '--',
        y: 125,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 145,
      },
      { type: 'text', value: this.submittedData.INPUT_REFERENCE_NO, y: 135 },
      {
        type: 'heading',
        value: this.translateService.instant(
          'LBL_YOUR_MERCHANT_CLAIM_REQUEST_IS_PENDING_FOR_APPROVAL'
        ),
        y: 155,
      },
    ];

    pdfData.push({
      type: 'save',
      value: this.translateService.instant('LBL_MERCHANT_CLAIM_REQUEST_RECEIPT') + '.pdf',
    });

    this.downloadAsPdf.downloadpdf(pdfData);
  }  
  }
