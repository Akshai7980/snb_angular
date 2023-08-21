import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-reject-single-transfer-payment',
  templateUrl: './reject-single-transfer-payment.component.html',
  styleUrls: ['./reject-single-transfer-payment.component.scss'],
})
export class RejectSingleTransferPaymentComponent implements OnInit {
  rejectReason: string = '';
  isRejectReasonInvalid: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingComplete = true;
  receiptData: any;
  // CHECK: not used anywhere. can it be removed?
  details: any;
  receiptForm: boolean = false;
  transferDetails = this.rootScopeData.myTaskSingleTransferPayment.summary;
  timeLeft: number = 30;
  interval:any;
  dispTime="00:30";
  disablBtn=false;
  transactionType: string = "DEBIT";
  transactionInputType: string = "INPUT_DEBIT_AMOUNT";
  exchangeRateObj:any;
  transferData=this.rootScopeData.myTaskSingleTransferPayment.details;
  dispReset=false;
  pdfData: any;
  saveReceiptObject:any;
  rejectMsg = true ;
  constructor(
    private router: Router,
    private myTaskService: MyTaskService,
    private location: Location,
    private translateService: TranslateService,
    private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {
    this.checkIfDataPresent();
  }

  /**
   * @description check transfer details and redirect if no details
   */
  checkIfDataPresent(): void {
    if (!this.transferDetails) {
      this.onBackArrowClick();
    }else if(this.transferDetails && this.transferDetails.function_ID_DISPVAL==='International Fund Transfer'){
      this.getExchangeDetails();
      this.startTimer()
    }
  }

  /**
   * @description check if reject reason is valid
   */
  checkRejectReason(): void {
    // this.isRejectReasonInvalid = this.rejectReason ? false : true;
  }

  /**
   * @description check input fields and set receipt data
   */
  onClickSubmit(): void {
   
    // this.isRejectReasonInvalid = this.rejectReason ? false : true;
    if (!this.isRejectReasonInvalid) {
      if(this.transferDetails && this.transferDetails.function_ID_DISPVAL==='International Fund Transfer'){
        clearInterval(this.interval); 
      }
      this.isLoadingComplete = false;
      const details = this.rootScopeData.myTaskSingleTransferPayment;
      this.myTaskService
        .rejectSingleTransfer({
          param1: '',
          param2: '',
          remarks: this.rejectReason,
          rejectReason: this.rejectReason,
          referenceNumber: details.summary.ref_NO,
          product: details.summary.product_CODE,
          subProduct: details.summary.subprcode,
          action: details.summary.function_ID,
          hostCode: details.summary.host_TXN_CODE,
          version: details.summary.version_NO,
          refNo:this.exchangeRateObj?this.exchangeRateObj.rateRefNo:""
        })
        .subscribe(
          (res:any) => {
            this.setReceiptData(res.dataValue);
            this.receiptForm = true;
            this.isLoadingComplete = true;
          },
          () => {
            this.receiptForm = false;
            this.isLoadingComplete = true;
          }
        );
    }
  }

  /**
   * @description transform the transfer amount based on the currency value
   * @param amount amount to be transformed
   * @param currency currency of the transfer
   * @returns {string} amount transformed according to currency
   */
  getConvertedCurrency(amount: string, currency: string): string {
    const currencyFormatPipeFilter = new CurrencyFormatPipe();
    return `${currencyFormatPipeFilter.transform(
      amount,
      currency
    )} ${currency}`;
  }

  /**
   * @description set the data for transfer receipt
   */
  setReceiptData(data:any): void {
    //  let message2 :any;
    let UTIReference :any;
    let rejectReasonFromAPi : any;
    // let journalId :any;
    // if(data.TXN_STATUS=== "AH"){
    //   message2 = "LBL_YOUR_PAYMENT_REQUEST_IS_PROCESSED_SUCCESS";
    // }else if(data.TXN_STATUS=== "RH"){
    //   message2 = "LBL_YOUR_PAYMENT_REQUEST_IS_REJECTED";
    //   rejectReasonFromAPi = data.OD_REJECT_REASON; 
    // }else{
    //   message2 = "LBL_APPROVED_STMT";
    // }
    
    //   if(data.TXN_STATUS=== "AH"){
    //     journalId = data.JOURNAL_ID
    //   }
    rejectReasonFromAPi = this.rejectReason;
    if(data.UTI_REFERENCE=== "null"){
      UTIReference = "--";
    }else{
      UTIReference = data.UTI_REFERENCE
    }
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_REJECTION_STMT',
      // journalId:journalId ? journalId : "",
      rejectReason: rejectReasonFromAPi ? rejectReasonFromAPi : "--",
      referenceNumber: this.transferDetails.ref_NO,
      UTIReference: UTIReference ? UTIReference : "",
      authorizeButtonRouterPath: '/mytask/serviceRequest',
      finishButtonRouterPath: '/dashboard',
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.transferDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_NAME',
              dataKey: this.transferDetails.maker_NAME,
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.transferDetails.debit_ACC_NO,
            },
            {
              dispKey: 'LBL_AMOUNT',
              dataKey: this.getConvertedCurrency(
                this.transferDetails.debit_AMOUNT,
                this.transferDetails.debit_CURRENCY
              ),
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
        buttonLabel: 'LBL_MAKE_ANOTHER_AUTHORIZATION',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_REJECT_SINGLE_BENEFICIARY"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_REJECTION_STMT"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Name",
          "subValue": this.transferDetails.maker_NAME ? this.transferDetails.maker_NAME : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.transferDetails.debit_ACC_NO ? this.transferDetails.debit_ACC_NO : "--"
        },
        {
          "subHead": "Amount",
          "subValue": this.getConvertedCurrency(
                this.transferDetails.debit_AMOUNT,
                this.transferDetails.payment_CURRENCY
              ) ? this.getConvertedCurrency(
                this.transferDetails.debit_AMOUNT,
                this.transferDetails.payment_CURRENCY
              ) : "--"
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        }
      ],
      "pagecall":"singletransferauth",
      "refNo":this.transferDetails.ref_NO?this.transferDetails.ref_NO:"--"
    }
  }

  /**
   * @description redirect to previous page
   */
  onBackArrowClick(): void {
    this.location.back();
  }

  /**
   * @description redirect for new transfer request
   */
  initiateAnotherRequest() {
    this.router.navigate(['/mytask/payment/single-payments']);
  }
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
       this.dispTime=this.timeLeft>9?"00:"+this.timeLeft:"00:0"+this.timeLeft
      } else {
        clearInterval(this.interval); 
        this.disablBtn=true 
        this.dispReset=true 
        this.timeLeft=0;
        this.dispTime="00:00"
      }
    },1000)
  }
  getExchangeDetails(){
    this.isLoadingComplete=false
    let debitCcyCode = this.transferDetails && this.transferDetails.debitCurrency ? this.transferDetails.debitCurrency : "";
    let paymentCurrency=this.transferDetails &&  this.transferDetails.payment_CURRENCY ? this.transferDetails.payment_CURRENCY : "";
    if(debitCcyCode != paymentCurrency){
      this.transactionType = "CREDIT";
      this.transactionInputType = "INPUT_CREDIT_AMOUNT";
    }else{
      this.transactionType = "DEBIT";
      this.transactionInputType = "INPUT_DEBIT_AMOUNT";
    }
    let params={
      transactionType:"",
      transactionInputType:"",
      paymentAmount:"",
      debitCountryCode:"",
      debitCifNo:"", 
      debitAccNo:"",
      debitCurrencyCode:"",
      debitUnitId:"",
      paymentCurrency:"",
      subProduct:"",
      functionCode:""
    }
    params.transactionType=this.transactionType;
    params.transactionInputType=this.transactionInputType;
    params.paymentAmount=this.transferDetails && this.transferDetails.payment_AMOUNT
    params.debitCountryCode=this.transferData && this.transferData.debitCountryCode ? this.transferData.debitCountryCode : "";
    params.debitCifNo=this.transferData && this.transferData.cifNo ? this.transferData.cifNo : "";
    params.debitAccNo=this.transferDetails && this.transferDetails.debit_ACC_NO ? this.transferDetails.debit_ACC_NO : "";
    params.debitCurrencyCode=this.transferDetails && this.transferDetails.debit_CURRENCY ? this.transferDetails.debit_CURRENCY : "";
    params.debitUnitId=this.transferData && this.transferData.unitId ? this.transferData.unitId : "";
    params.paymentCurrency=paymentCurrency
    params.subProduct=this.transferData && this.transferData.subProduct ? this.transferData.subProduct : "";
    params.functionCode=this.transferData && this.transferData.functionCode ? this.transferData.functionCode : "";
  
    this.myTaskService.getExchangeRateApiCall(params).subscribe((res:any)=>{
   
      if(res && res.data){
        //add the code
        this.exchangeRateObj=res.data[0]
      }
      this.isLoadingComplete=true
    },error => {
      this.isLoadingComplete = true;
    })
  }
  restTimmer(event?:any){
    clearInterval(this.interval)
    this.checkIfDataPresent()
    this.timeLeft=30;
    this.dispReset=false
    this.disablBtn=false 
  }

  downloadPdf(values:any)
      { 
        let SelectedType = values;
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:"Authorize Single Transfer Receipt", x:80, y:35},
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
        { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
        { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_NAME'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_AMOUNT'), y:95}, 
        { type: 'heading', value:this.translateService.instant('LBL_RJCT_RSN'), y:105},         
        { type: 'text', value:this.transferDetails.maker_NAME? this.transferDetails.maker_NAME : '', y:75},
        { type: 'text', value:this.transferDetails.debit_ACC_NO? this.transferDetails.debit_ACC_NO : '', y:85},
        { type: 'text', value: currencyFormatPipeFilter.transform(this.transferDetails.debit_AMOUNT, this.transferDetails.payment_CURRENCY) + ' ' + this.transferDetails.payment_CURRENCY ?  currencyFormatPipeFilter.transform(this.transferDetails.debit_AMOUNT, this.transferDetails.payment_CURRENCY) + ' ' + this.transferDetails.payment_CURRENCY : '', y:95},
        { type: 'text', value:this.rejectReason? this.rejectReason : '', y:105},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
        { type: 'text', value: this.transferDetails.ref_NO ? this.transferDetails.ref_NO : '', y:115},
        { type: 'heading', value:this.translateService.instant('LBL_REJECTION_STMT'), y:125},
        
      ]

      if(SelectedType === 'save'){
        this.pdfData.push(
          { type: 'save', value:'reject-SingleTransfer.pdf'}
       )
      }       
       else if(SelectedType === 'print'){
        this.pdfData.push(
          { type: 'print', value:'reject-SingleTransfer.pdf'}
       )
      }

      //   this.pdfData.push(
      //     { type: 'save', value:'Authorize-SingleTransfer.pdf'}
      //  )

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }
}
