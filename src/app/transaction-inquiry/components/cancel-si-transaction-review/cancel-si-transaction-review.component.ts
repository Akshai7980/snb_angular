import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';
import { Location } from '@angular/common';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cancel-si-transaction-review',
  templateUrl: './cancel-si-transaction-review.component.html',
  styleUrls: ['./cancel-si-transaction-review.component.scss']
})
export class CancelSiTransactionReviewComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  printSection: string = '';
  logo = 'assets/images/snb-logo-print.png';
  @Input() receiptDetails: any;
  @Output() onInitAgainClick = new EventEmitter();
  transferDetails: any;
  transferSummary: any;
  cancelReason: any;
  resetRemain: boolean = false;
  isProceed: boolean = false;
  authDataObj: any;
  amountDetailsObj: any;
  errorCode: any;
  authOptions :any =[];
  fieldSet!: { dispKey: string; dataKey: string }[];
  receiptData: any;
  total!: string;
  pmtType!: string;
  hideAll: boolean = false;
  selectedDebitObj: any;
  selectedESALTo: any;
  selectedCancelObj: any;
  otpValue: any;
  secAuthRef: any;
  authData: any;
  showAuthorization: boolean = false;
  debitDetails:any;
  saveReceiptObject : any;
  authType:any;
  rejectMsg: boolean = false;
  constructor(
    private location: Location,
    private transactionInquiry: TransactionInquiryService,
    private translateService : TranslateService,
    private router : Router) { }

  ngOnInit(): void {
    this.printSection = 'receiptConatiner';
    // console.log('receiptDetails:', this.receiptDetails);
    this.transferDetails = this.rootScopeData.standingOrderDetails.details;
    this.transferSummary =  this.rootScopeData.standingOrderDetails.summary;
    this.debitDetails = this.rootScopeData.standingOrderDetails.paymentDetails;
    this.cancelReason = this.receiptDetails.reason;
    this.isProceed = true;
    this.resetRemain = false;
    this.hideAll = true;

    this.getAuthApproverDetails();
  }


  getAuthApproverDetails() {
    debugger;
    let data = {
      unitId :"IGTBSA" ,
      cifNo : this.transferDetails.cifNo,
      subProduct : "RECPAY",
      // functionCode : this.transferDetails.functionCode,
      functionCode : "CNCLSI",
      txnAmount : this.transferDetails.siAmount,
      debitNumber : this.transferDetails.siDebitAccNo,
      creditCurrency : this.transferDetails.sicurrency,
      debitCurrency : this.transferDetails.sicurrency
    }
    this.transactionInquiry.selfAuthCheck(data).subscribe((res: any) => {
      if (res) {
        if(res.data.flexiAuth === "true"){
          this.showAuthorization = true;
          this.authOptions = res.data.authList;
        }else{
          this.showAuthorization = false;
        }
            }
    }, error => {

    })
  }


  getAuthorizationData(authorizationData: any) {
    // console.log('authorizationData:',authorizationData);
    this.authData = authorizationData;
  }

  getOtpValue(event: any) {
    // console.log('event:',event);
    this.otpValue = event;
    this.callCancelTransaction();
  }

  onSecondFactorValue(authValue: any) {
    this.secAuthRef = authValue.data.secfRefNo;
  }

 
  back(): void {
    this.location.back();
  }

  callCancelTransaction() {
    const params = {
      transferDetails: this.transferDetails,
      transferSummary: this.transferSummary,
      authorizationData: this.authData,
      reason: this.cancelReason,
      authRef: this.secAuthRef,
      otp: this.otpValue,
      AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': '',
      txnRefNo :this.rootScopeData && this.rootScopeData.internationalSITransactionObject &&   this.rootScopeData.internationalSITransactionObject.siBookingRefNo ? 
                 this.rootScopeData.internationalSITransactionObject.siBookingRefNo : '',
      hostRefNo : this.rootScopeData && this.rootScopeData.internationalSITransactionObject &&   this.rootScopeData.internationalSITransactionObject.siBookingRefNo ? 
                this.rootScopeData.internationalSITransactionObject.siBookingRefNo : '',
      summaryCIF :  this.rootScopeData.internationalSITransactionObject.cifNo

    };
    //  console.log('params:', params);
    this.transactionInquiry.siCancelTransaction(params).subscribe(
      (res: any) => {
        // console.log('res:', res);
        if (res.dataValue.OD_STATUS_DESC === 'Success') {
          this.constructReceiptData(res.dataValue.INPUT_REFERENCE_NO,res.dataValue);
          this.hideAll = false;
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  }

  constructReceiptData(refNumber: any, data:any) {    
    if (this.amountDetailsObj) {
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      let convrtd_amt = currencyFormatPipeFilter.transform(
        this.amountDetailsObj.debitAmount,
        this.amountDetailsObj.currencyCode
      );
      this.total = convrtd_amt + ' ' + this.amountDetailsObj.currencyCode;
    }

    this.selectedCancelObj = {
      FULL_NAME: this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '',       
      CARD_ACC_NO: this.transferSummary.benefAcNo,
      EMB_NAME: this.transferSummary.beneficiaryName,
    };
this.rejectMsg=false;
    var message1 :any;
    var message2 :any;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_REQUEST_SUCCSFL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }else if(data.TXN_STATUS=== "RH" || data.TXN_STATUS=== "RE"){
      message1 = "LBL_REQ_UNSUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "RA"){
      message1 = "LBL_REQUEST_SUCCSFL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
    }else if(data.TXN_STATUS=== "RN"){
      message1 = "LBL_REQ_UNSUCCESSFUL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_REQUEST_SUCCSFL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_REQUEST_SUCCSFL";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }
    this.receiptData = {
      msg1: message1,
      msg2: message2,
      referenceNumber: refNumber,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'true',
          data: [this.selectedCancelObj],

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: 'FULL_NAME',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'CARD_ACC_NO',
            },
            {
              dispKey: 'LBL_NICKNAME',
              dataKey: 'EMB_NAME',
            },
          ],
        },
        {
          "title": "LBL_TO",
          "isTable": "false",
          "data": [this.transferSummary],
          "fieldDetails": [
            {
              "dispKey": "LBL_BENEFICIARY",
              // "dataKey": "accName"
              "dataKey": this.transferSummary.beneficiaryName ? this.transferSummary.beneficiaryName :"--"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              // "dataKey": "beneAccNo"
              "dataKey": this.transferSummary.benefAcNo ? this.transferSummary.benefAcNo : "--"
            },
            {
              "dispKey": "LBL_SHORT_NAME",
              // "dataKey": "aliasName"
              "dataKey": this.transferSummary.aliasName ? this.transferSummary.aliasName : "--"
            }
          ]
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
        buttonLabel: 'LBL_INITIATE_ANOTHER_REQUEST',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_CANCEL_TRANSACTION"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant(message2),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.selectedCancelObj.FULL_NAME ? this.selectedCancelObj.FULL_NAME : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.selectedCancelObj.CARD_ACC_NO ? this.selectedCancelObj.CARD_ACC_NO : "--"
        },
        {
          "subHead": "Short Name",
          "subValue": this.selectedCancelObj.EMB_NAME ? this.selectedCancelObj.EMB_NAME : "--"
        },
        {
          "subHead": "To",
          "subValue": ""
        },
        {
          "subHead": "Beneficiary",
          "subValue": this.transferSummary.beneficiaryName ? this.transferSummary.beneficiaryName :"--"
        },
        {
          "subHead": "To Account Number",
          "subValue": this.transferSummary.benefAcNo ? this.transferSummary.benefAcNo : "--"
        },
        {
          "subHead": 'To Short Name',
          "subValue": this.transferSummary.aliasName ? this.transferSummary.aliasName : "--"
        }
      ],
      "pagecall":"canceltransaction",
      "refNo":refNumber
    }
  }
  // new Auuth added
  getAuthType(val: any) {
    this.authType = val
  }
  initiateAnotherRequest(){
    this.router.navigate(['/transactionInquiry/standingOrder']);
  }
}
