import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationManagementService } from 'src/app/configuration-management/services/configuration-management.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-quick-transfer-limit-preview',
  templateUrl: './quick-transfer-limit-preview.component.html',
  styleUrls: ['./quick-transfer-limit-preview.component.scss']
})
export class QuickTransferLimitPreviewComponent implements OnInit {
  isLoadingCompelete = false;
  debitDataObj: any
  selectedDebitObj: any
  hideAll = false;
  payToObject: any;
  additionalreadOly = true;
  editData = false;
  addtionalData = { date: null, paymentDetails: '', customerRef: '' }
  isProceed = true;
  moreTransaction = true
  grandTotal: any
  receiptData: any;
  transferData: any = []
  authDataObj: any
  transferTotal = 0;
  dataSorceToPass: any;
  hideContent = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  index = -1;
  setReadContent=false;
  showBasket=true;
  basketData:any;
  finalBasketData:any
  // authOptions=[{AUTH_NAME:"Any"},{AUTH_NAME:"Abdus Kamal"},{AUTH_NAME:"Abdul Rabo"},{AUTH_NAME:"Abbas Fattah"},{AUTH_NAME:"Adahm"}]
  authOptions :any =[];
  userOtpValue: any;
  otpError: string | undefined;
  @Input() customersLimit = "";
  @Input()  OwnLimitAmount ="";
  @Input() customercurrency ='';
  @Output() redirectFlag = new EventEmitter();
  secAuthRef: any;
  ConfigurationManagementService: any;
  initiate:boolean = true;
  @Input() CIFDetails : any;
  showAuthorization: boolean = false;
  url:string='';
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:""
  }
  authType: any;
  refNo: any;
  pdfData:any;
  saveReceiptObject:any;
  checkFlexiAuth: boolean = false;
  rejectMsg: boolean = false;
  constructor(private configManagementService: ConfigurationManagementService,private translateService: TranslateService,private downloadAsPdf:downloadAsPdf) { }
  ngOnInit(): void {
     this.getAuthApproverDetails();
     this.url = systemproperty.termsAndConditionsForStopPayment;
     this.initReqParam.accNo=this.CIFDetails && this.CIFDetails.cifNo ? this.CIFDetails.cifNo:"";
     this.initReqParam.amt=parseFloat(amountUnFormat(this.customersLimit))+"";
     this.initReqParam.pdroductCode="PAYMNT";
     this.initReqParam.subPrdCode='MNTQTL';
     this.initReqParam.cif=this.CIFDetails && this.CIFDetails.cifNo ? this.CIFDetails.cifNo:"";
     this.initReqParam.unitId=this.CIFDetails && this.CIFDetails.unitId ? this.CIFDetails.unitId : "";
      
  }

  getDisplayStatus(autherizationDetailsObj: any) {
    this.authDataObj =  autherizationDetailsObj;
  }
  getAuthApproverDetails() {
    let data = {
      cifNumber : this.CIFDetails.cifNo,
      unitId : this.CIFDetails.unitId,
      enterAmount: this.customersLimit,
      subProdCode: 'MNTQTL',
      funcCode: 'CRQTLI',
      accNo:this.CIFDetails.cifNo,
      paymentAmount:this.customersLimit
    }
    this.checkFlexiAuth = false;
    this.configManagementService.selfAuthCheck(data).subscribe((res: any) => {
      if (res) {
        if (res.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.checkFlexiAuth = true;
          this.authOptions = res.data.authList;
        }
        this.isLoadingCompelete = true;
        // this.authOptions = res.data.authList;

      }
    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  // getAuthorizationData() {
  //   this.configManagementService.selfAuthCheck(this.selectedDebitObj).subscribe((res: any) => {
  //     this.authOptions = res.data.authList;
  //   }, (error: any) => {
  //   });
  // }
  onSubmit() {
    if (!this.userOtpValue || this.userOtpValue.length !== 4) {
      this.otpError = "LBL_PLS_ENTER_OTP";
      return;
    }
    this.isLoadingCompelete = false;
    let datas ={
      otp : this.userOtpValue,
      customerLimit : this.customersLimit,
      ownLimitAmount : this.OwnLimitAmount,
      secAuthRef : this.secAuthRef,
      customerCurrency : this.customercurrency,
      cifNo: this.CIFDetails.cifNo,
      gcif: this.CIFDetails.gcif,
      unitId: this.CIFDetails.unitId,
      AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    }
    
    //this.grandTotal = this.payToObject[0].amt
    this.configManagementService.submitQuickTransfer(datas).subscribe((response: any) => {
      this.isLoadingCompelete = true;
      if (response.dataValue.OD_STATUS_DESC === "Success") {
        this.refNo = response.dataValue.INPUT_REFERENCE_NO;
        this.constructReceiptData(response.dataValue.INPUT_REFERENCE_NO, response.dataValue);
        this.hideAll = true;
      }
      else if(response.dataValue.OD_STATUS_DESC === "Failed"){
        this.otpError = "LBL_PLS_ENTER_OTP";
      }
    },    
    (error:any) =>{
      this.isLoadingCompelete = true;
    })
    
  }
  constructReceiptData(refNumber: any, resObj:any) {
    let data= resObj;
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    let Formatamount = currencyFormatPipeFilter.transform(this.OwnLimitAmount, 'SAR');
    // if(this.moreTransaction){
    //   this.finalBasketData.forEach((element:any) => {
    //     data.push(element.from)
    //   });
    // }

   let flexiAuth = {
      "title": "LBL_AUTHORIZATION",
      "isTable": "false",
      "data": '',
      "fieldDetails": [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": this.authDataObj && this.authDataObj.selectedAprover && this.authDataObj.selectedAprover.AUTH_NAME ? this.authDataObj.selectedAprover.AUTH_NAME : 'Not Provided'
        },
        {
          "dispKey": "LBL_ADD_NEXT_APROVER",
          "dataKey": this.authDataObj && this.authDataObj.selectedAprover && this.authDataObj.aproveNote ? this.authDataObj.aproveNote : 'Not Provided'
        }
      ]
    }
    
    var message1 : any;
    var message2 :any;
    var rejectReasonFromAPi : any;
    let journalId :any;
    this.rejectMsg = false;
    let checkAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
      journalId = data.JOURNAL_ID;
    }else if(data.TXN_STATUS=== "RH" || data.TXN_STATUS=== "RE"){
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      rejectReasonFromAPi = data.OD_REJECT_REASON;
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "RA"){
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_INITIATED_SUCCESSFULLY_AND_ITS_READY_FOR_AUTH";
      checkAuth = true;
    }else if(data.TXN_STATUS=== "RN"){
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED_DUE_RULE_NOT_FOUND";
      this.rejectMsg = true;
    }else if(data.TXN_STATUS=== "AO"){
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_PROCCESSED_SUCCESSFULLY";
    }

    this.receiptData = {
      "msg1": "LBL_INSTANT_TRANSFER_LIMIT_RECEIPT",
      "msg2": message2,
      "referenceNumber": refNumber,
      "receiptDetails": [
        // {
        //   "title": "LBL_FROM",
        //   "isTable": "true",
        //   "data": this.moreTransaction?data:[this.selectedDebitObj],
        //   // "data": [this.selectedDebitObj],

        //   "fieldDetails": [
        //     {
        //       "dispKey": "LBL_ACTION_BY",
        //       "dataKey": "FULL_NAME"
        //     },
        //     {
        //       "dispKey": "LBL_ACC_NUMBER",
        //       "dataKey": "CARD_ACC_NO"
        //     },
        //     {
        //       "dispKey": "LBL_SHORT_NAME",
        //       "dataKey": "EMB_NAME"
        //     }
        //   ]
        // },
        // {
        //   "title": "LBL_TO",
        //   "isTable": "true",
        //   "data": this.moreTransaction ? this.transferData : this.payToObject,
        //   "fieldDetails": [
        //     {
        //       "dispKey": "LBL_BILLER",
        //       "dataKey": "biller"
        //     },
        //     {
        //       "dispKey": "LBL_SERVICE_TYPE",
        //       "dataKey": "serviceType"
        //     },
        //     {
        //       "dispKey": "LBL_AMOUNT",
        //       "dataKey": "amt"
        //     }
        //   ]
        // },
        {
          "title": "LBL_CIF_ACCOUNT",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_CUSTOMER_INFORMATION_NUMBER",
              "dataKey": this.CIFDetails.cifNo
            },
            {
              "dispKey": "LBL_CUSTOMER_NAME",
              "dataKey": this.CIFDetails.customerName
            }
          ]
        },
        {
          "title": "LBL_TRANSFER_LIMIT",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_QUICK_TRANSFER_LIMIT",
              "dataKey": Formatamount + " SAR"
            },
            {
              "dispKey": "LBL_CUSTOMER_INSTANT_TRANSFER_LIMIT",
              "dataKey": this.customersLimit + " SAR"
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
    }
    if(this.checkFlexiAuth && checkAuth){
      this.receiptData.receiptDetails.push(flexiAuth);
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_INSTANT_TRANSFER_LIMIT_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant(message2),
      "keyValues": [
        {
          "subHead": "CIF Account",
          "subValue": ""
        },
        {
          "subHead": "Customer Information Number",
          "subValue": this.CIFDetails.cifNo ? this.CIFDetails.cifNo : "--"
        },
        {
          "subHead": "Customer Name",
          "subValue": this.CIFDetails.customerName ? this.CIFDetails.customerName : "--"
        },
        {
          "subHead": "Transfer Limit",
          "subValue": ""
        },
        {
          "subHead": "Instant Transfer Limit",
          "subValue": Formatamount ? Formatamount + " SAR" : "--"
        },
        {
          "subHead": "Customer's Instant Transfer Limit",
          "subValue": this.customersLimit ? this.customersLimit + " SAR" : "--"
        },
        {
          "subHead": "Journal ID",
          "subValue": journalId ? journalId : "--"
        },
        {
          "subHead": "Reject Reason",
          "subValue": rejectReasonFromAPi ? rejectReasonFromAPi : "--"
        }
      ],
      "pagecall":"IPStransferlimit",
      "refNo":refNumber
    }
    this.hideAll = true
  }

  downloadPdf(values:any)
  { 
    let currencyFormatPipeFilter = new CurrencyFormatPipe();
    let Formatamount : any;
    if(this.OwnLimitAmount){
      Formatamount = currencyFormatPipeFilter.transform(this.OwnLimitAmount, 'SAR');
    }
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant('LBL_INSTANT_TRANSFER_LIMIT_RECEIPT'), x:90, y:35},
    { type:'setFontSize', size:10},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setFontSize', size:10},
    { type: 'setFillColor', val1:128, val2:128, val3:128},
    { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
    { type:'setTextColor', val1:255, val2:255, val3:255},
    { type:'setFontSize', size:10},
    { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
    { type:'setFontSize', size:9},
    { type:'setTextColor', val1:0, val2:0, val3:0}, 
    { type: 'heading', value:this.translateService.instant('LBL_CIF_ACCOUNT'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_CUSTOMER_INFORMATION_NUMBER'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_CUSTOMER_NAME'), y:85},
    // { type: 'heading', value:this.translateService.instant('LBL_NICKNAME'), y:95},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_TRANSFER_LIMIT'), y:95},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_QUICK_TRANSFER_LIMIT'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_CUSTOMER_INSTANT_TRANSFER_LIMIT'), y:115},
    // { type: 'heading', value:this.translateService.instant('LBL_NATIONAL_ID'), y:135},
    { type: 'text', value:this.CIFDetails.cifNo? this.CIFDetails.cifNo : "--", y:75},
    { type: 'text', value:this.CIFDetails.customerName?this.CIFDetails.customerName:'--', y:85},
    // { type: 'text', value:this.selectedDebitObj.LIAS_NAME?this.selectedDebitObj.LIAS_NAME:'', y:95},
    { type: 'text', value:Formatamount?Formatamount + " SAR":'--', y:105},
    { type: 'text', value: this.customersLimit?this.customersLimit + " SAR":'--', y:115},
    // { type: 'text', value:this.selectedQuickTransferTo.nationalID!=''?this.selectedQuickTransferTo.nationalID:'Not Provided', y:135},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:125},
    { type: 'text', value: this.refNo ? this.refNo : '--', y:125},
    { type: 'heading', value:this.translateService.instant('LBL_INSTANT_TRANSFER_LIMIT_CHANGE'), y:135},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'QuickTransferLimit.pdf'}
    )
  }       
    else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'QuickTransferLimit.pdf'}
    )
  }
  

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
  reset() {
    this.debitDataObj = null;
    this.selectedDebitObj=null;
    this.payToObject=null;
    this.isProceed=false;
    this.additionalreadOly=true
    this.addtionalData={ date: null, paymentDetails: '', customerRef: '' }
    this.editData=false;
    this.moreTransaction=false;
    this.transferData=[];
    this.dataSorceToPass=[]
    this.showBasket=false;
    this.hideContent=false
    this.redirectFlag.emit(false);   

  }
  deleteRecord(i: any) {
    this.transferTotal = 0
    this.transferData.splice(i, 1);
    this.transferData.forEach((ele: any) => {
      let formatType = ele.amt.slice(-3);
      let amt = ele.amt.replace(/([a-zA-Z])/g, '');
      this.transferTotal = this.transferTotal + Number(amt)
    })
    if (this.transferData.length == 0) {
        this.reset();
      this.dataSorceToPass = []
    } else {
      this.dataSorceToPass = this.transferData;
    }
  
  }
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onSubmit();
    } else {
      this.userOtpValue = "";
      this.otpError = "LBL_PLS_ENTER_OTP";
    }
  }
  autherizationDetailsReceived(autherizationDetailsObj:any) {
    this.authDataObj = autherizationDetailsObj;
  }
  getAuthType(val: any) {
    this.authType = val
  }
}

