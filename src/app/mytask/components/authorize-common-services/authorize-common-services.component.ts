import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
@Component({
  selector: 'app-authorize-common-services',
  templateUrl: './authorize-common-services.component.html',
  styleUrls: ['./authorize-common-services.component.scss']
})
export class AuthorizeCommonServicesComponent implements OnInit {

  secAuthRef: any;
  receiptForm: boolean = false;
  invalidOtpError: string = '';
  receiptData: any;
  isLoadingComplete = true;
  authData: any;
  errorCode: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferDetails = RootScopeData.myTaskApproveDetails;
  transferData=RootScopeData.myTaskSingleTransferPayment.details
  timeLeft: number = 30;
  interval:any;
  dispTime="00:30";
  disablBtn=false;
  transactionType: string = "DEBIT";
  transactionInputType: string = "INPUT_DEBIT_AMOUNT";
  exchangeRateObj:any;
  autherizationDetailsObj: any;
  authListArray: any = [];
  showAuthorization = false;
  showAuthentication = false;
  authError: string = "";
  authType: any;
  dispReset=false;
  sefAuthFlag:any
  pdfData: any;
  saveReceiptObject : any;
  constructor(
    private location: Location,
    private router: Router,
    private readonly myTaskService: MyTaskService,
    private translateService: TranslateService,
    private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit(): void {
    this.checkIfDataPresent();
    this.checkSecfactorAuth();
  }

  /**
   * @description check transfer details and redirect if no details
   */
  checkIfDataPresent(): void {
    if (!this.transferDetails) {
      this.onBackArrowClick();
    }
  }

  /**
   * set authorization data
   * @param authorizationData approver and note for authorization
   */
  getAuthorizationData(authorizationData: any): void {
    this.authData = authorizationData;
  }

  /**
   * @description redirect to previous page
   */
  onBackArrowClick(): void {
    this.location.back();
  }

  onSecondFactorValue(authValue: any) {
    let vAuthvalue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
  }

  /**
   * @description redirect for new transfer request
   */
  initiateAnotherRequest() {
    this.router.navigate(['/mytask/commonServices']);
  }

  /**
   * @description check input fields and set receipt data if no errors
   */
  onClickSubmit() {
      this.isLoadingComplete = false;
      let param ={
          refNo: this.transferDetails.refNo,
          productCode: this.transferDetails.productCode,
          subprcode: this.transferDetails.subProdCode,
          action:this.transferDetails.action,
          hostCode: this.transferDetails.hostCode,
          version: this.transferDetails.version,
          param1 : this.autherizationDetailsObj && this.autherizationDetailsObj.selectedAprover ?this.autherizationDetailsObj.selectedAprover:'',
          param2 : this.autherizationDetailsObj && this.autherizationDetailsObj.aproveNote?this.autherizationDetailsObj.aproveNote:'',
      }
      this.myTaskService.approveCommonService(param).subscribe(
          (res:any) => {
            this.setReceiptData(res.dataValue.SELECTED_RECORDS);
            this.receiptForm = true;
            this.isLoadingComplete = true;
          },
          () => {
            this.receiptForm = false;
            this.isLoadingComplete = true;
          }
        );
    
  }

  /**
   * @description set the data for transfer receipt
   */
  setReceiptData(referenceNo:any): void {
    let auth={
      "title": 'LBL_AUTHORIZATION',
      "isTable": 'false',
      "data": '',
      "fieldDetails": [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": !this.autherizationDetailsObj ? 'Not Provided' : !this.autherizationDetailsObj.selectedAprover.AUTH_NAME ? 'Not Provided' : this.autherizationDetailsObj.selectedAprover.AUTH_NAME
        },
        {
          "dispKey": "LBL_ADD_NEXT_APROVER",
          "dataKey": !this.autherizationDetailsObj ? 'Not Provided' : !this.autherizationDetailsObj.aproveNote ? 'Not Provided':this.autherizationDetailsObj.aproveNote
        },
      ],
    }
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_APPROVED_STMT',
      referenceNumber: referenceNo,
      authorizeButtonRouterPath: '/mytask/commonServices',
      finishButtonRouterPath: '/dashboard',
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.transferDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_TRANSACTION_NUMBER',
              dataKey: this.transferDetails.refNo,
            },
            {
              dispKey: 'LBL_PAYMENT_TYPE',
              dataKey: this.transferDetails.requestType,
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.transferDetails.acc_NO,
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
    if(this.showAuthorization){
      this.receiptData.receiptDetails.push(auth)
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_UPLOAD_SUCCESSFUL"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_BENEFICIARY_APPROVED"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Transaction Number",
          "subValue": this.transferDetails.refNo ? this.transferDetails.refNo : "--"
        },
        {
          "subHead": "Payment Type",
          "subValue": this.transferDetails.requestType ? this.transferDetails.requestType : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.transferDetails.acc_NO ? this.transferDetails.acc_NO : "--"
        }
      ],
      "pagecall":"commonauthorized",
      "refNo":referenceNo
    }
  }

  checkSecfactorAuth() {
    let reqObj = {
      amount: "",
      gcif: "",
      accNo: "",
      debitCurrency: "",
      pymntCurrency: "", //?????
      subProdCode: "",
      debitUnitId:"",
      funcCode:"",
      productCode:"",
      referenceNo:"",
      cif:'',
      unitID: ''
    }
    reqObj.amount = this.transferDetails && this.transferDetails.debit_AMOUNT ? this.transferDetails.debit_AMOUNT : "";
    reqObj.gcif = this.transferDetails && this.transferDetails.gcif ? this.transferDetails.gcif:"";
    reqObj.accNo = this.transferDetails  && this.transferDetails.acc_NO ? this.transferDetails.acc_NO:"";
    reqObj.debitCurrency = this.transferDetails && this.transferDetails.debit_CURRENCY ? this.transferDetails.debit_CURRENCY : "";
    reqObj.pymntCurrency = this.transferDetails && this.transferDetails.payment_CURRENCY ? this.transferDetails.payment_CURRENCY : "";
    reqObj.debitUnitId = this.transferData  && this.transferData.unitId ? this.transferData.unitId : "";
    reqObj.referenceNo = this.transferDetails && this.transferDetails.ref_NO ? this.transferDetails.ref_NO : "";
    reqObj.productCode = this.transferDetails && this.transferDetails.product_CODE ? this.transferDetails.product_CODE : "";
    reqObj.subProdCode = this.transferDetails && this.transferDetails.subprcode ? this.transferDetails.subprcode:"";
    reqObj.funcCode = this.transferData && this.transferData.functionCode ? this.transferData.functionCode:"";
    reqObj.cif = this.transferDetails && this.transferDetails.cifNo ? this.transferDetails.cifNo:"";
    reqObj.unitID = this.rootScopeData.userInfo.UNIT_ID

    this.myTaskService.checkAuthorizationData(reqObj).subscribe((response: any) => {
      if (response) {       
        this.sefAuthFlag = response.data.selfAuth  
        if (response.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.authListArray = response.data.authList;
        }
      }
    }, error => {

    }

    )
  }
  
  autherizationDetailsReceived(autherizationDetailsObj: any) {
    this.autherizationDetailsObj = autherizationDetailsObj;
  }

  downloadPdf()
      { 
      let currencyFormatPipeFilter = new CurrencyFormatPipe();
      this.pdfData = 
      [
        { type:'setFontSize', size:11},
        { type: 'setFont',fontName:'helvetica', fontStyle:'bold'},
        { type:'setTextColor', val1:0, val2:0, val3:0},
        { type: 'title', value:"Authorize Receipt", x:80, y:35},
        { type:'setFontSize', size:10},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type:'setFontSize', size:10},
        { type: 'setFillColor', val1:128, val2:128, val3:128},
        { type:'setFontSize', size:9},
        { type:'setTextColor', val1:0, val2:0, val3:0}, 
        { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
        { type:'setFont', fontName:'helvetica', fontStyle:'normal'}, 
        { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_NUMBER'), y:75},
        { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
        { type: 'heading', value:this.translateService.instant('LBL_PAYMENT_TYPE'), y:95},       
        { type: 'text', value:this.transferDetails.refNo? this.transferDetails.refNo : '', y:75},
        { type: 'text', value:this.transferDetails.acc_NO? this.transferDetails.acc_NO : '', y:85},
        { type: 'text', value: this.transferDetails.requestType? this.transferDetails.requestType : '', y:95},
        { type:'setFont', fontName:'helvetica', fontStyle:'bold'},
        { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
        { type: 'text', value: this.transferDetails.refNo ? this.transferDetails.refNo : '', y:115},
        { type: 'heading', value:this.translateService.instant('LBL_NATIONAL_ADDRESS_MSG'), y:125},
        
      ]

        this.pdfData.push(
          { type: 'save', value:'Authorize-SingleTransfer.pdf'}
       )

     this.downloadAsPdf.downloadpdf(this.pdfData);
   
  }

}
