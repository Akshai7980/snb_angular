import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { environment } from 'src/environments/environment';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { CommonService } from '../../../common-components/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'app-sadad-bulk-payment',
  templateUrl: './sadad-bulk-payment.component.html',
  styleUrls: ['./sadad-bulk-payment.component.scss'],
})
export class SadadBulkPaymentComponent implements OnInit {
  isLoadingCompelete = false;
  isLoadingCompeleteMedium=false;
  debitDataObj: any;
  isChecked: string = '';
  selectedDebitObj: any;
  hideAll = false;
  isProceed = false;
  receiptData: any;
  authDataObj: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  // fileDetailsTableColumn = ['Total Records', 'Total Amount', 'Success record'];
  authOptions: any = [];
  downloadUrlBasePath: string = '';
  entitelementData: any;
  fileDetails: any = [];
  // UploadfileTitle = 'Upload File';
  file_size: string = "";
  filename: string = '';
  fileFormat: string = '';
  fileAPIAutoInvoke: boolean = false;
  fileApiAutoFetch: any;
  fileApiAutoFetchNull:any;
  fileReferenceNumber: string = '';
  secAuthRef: any;
  userOtpValue: any = '';
  otpError: string | undefined;
  fileChecksum: string = '';
  fileActualName:string="";
  // supportedFileTypes = systemproperty.sadadBulkPaymentSupportedFileTypesCSV;    // Supported file is 'csv' only
  // supportedFileSize= systemproperty.sadadBulkPaymentSupportedFileSize; //Maximum file size = 10 MB
  fileValidationErrorMessage: string = '';
  fileSizeValidationErrorMessage: boolean = false;
  fileTypeValidationErrorMessage: boolean = false;
  fileNameValidationErrorMessage: boolean = false;
  proceedBtnShow: boolean = false;
  otpDetails: any;
  totalRecords: any;
  amount: any;
  numberOfRecord: any;
  numberOfFailedRecord:any;
  currencyCode: any;
  authorizeDetails: any;
  isProceedzeroamount:boolean=false;
  isProceedFileStatusCode:boolean=false;
  setIntervalFlag:boolean=false;
  downloadTemplateData:any;
  uploadInput:any;
  transactionSummaryList: any = [];
  fileUploadedDetails:any;
  subPdtCode:string="SADPAYUP";
  statusCodeNullCounter:number=0;
  uploadFailed:boolean=false;
  fileAPIAutoInvokeNull:boolean=false;
  setIntervalNullFlag:boolean=false;
  isAuthorizationSct:boolean=false;
  rejectReason:boolean=false;
  termsConditionUrl:string="";
  // Record summary
  recordSummaryObject:any={};
  showRecordSummary: boolean = false;
  uploadFileDetails: any = {};
  fetchedFileDetails: any = {};
  moduleId: string = 'SADRECSUMY';
  odDRefNo:any;
  isLoadingComplete:boolean=false;
  // responseHeader: any;
  sortOptions: any = {};
// Record summary
initReqParam={
  accNo:"",
  amt:"",
  pdroductCode:"",
  subPrdCode:"",
  cif:"",
  unitId:""
}
  sefAuthFlag: string = '';
  showAuthorization: boolean = false;
  showAuthentication: boolean = false;
  balanceValidation: boolean = false;
  authType: any;
  refNo: any;
  pdfData:any;
  saveReceiptObject:any;
  constructor(private translateService: TranslateService,private sadadService: SadadPaymentService, private router: Router, private commonService:CommonService,private downloadAsPdf:downloadAsPdf) {}

  ngOnInit(): void {
    this.termsConditionUrl = systemproperty.termsAndConditionsLinkForSadadBulkPayment;
   // this.downloadUrlBasePath = `${environment.restDownloadAPI}` + '?moduleId=TMPDOWNLD&subPdt=SADPAYUP&_dinsess=b9df4c22-494b-438e-a827-c8703de882b5';
      this.entitlement('SADPAYUP');
  }

  onFileAdded(eventData: any) {
    this.filename = eventData.title;
    this.file_size = eventData.size;
    this.fileFormat = eventData.format;
    this.fileChecksum = eventData.checkSum;
    this.fileActualName=eventData.fileActualName;
    this.fileTypeValidationErrorMessage = false;
    this.fileSizeValidationErrorMessage = false;
    this.fileNameValidationErrorMessage = false;
    this.fileTypeValidationErrorMessage = eventData.typeValidFlag ? false : true;
    this.fileSizeValidationErrorMessage = eventData.fileSizeValidFlag ? true : false;
    this.fileNameValidationErrorMessage = eventData.isFileNameValid? false : true;
    if (this.filename && !this.fileSizeValidationErrorMessage && !this.fileTypeValidationErrorMessage && !this.fileNameValidationErrorMessage) {
      this.proceedBtnShow = true;
      this.fileUploadedDetails={
        "fileName":eventData.title,
        "fileActualName":eventData.fileActualName,
        "moduleId":"FILEDLD"
      }
    } else {
      this.proceedBtnShow = false;
    }
  }

  bulkPaymentTab(selectedTab:any){    
    this.rootScopeData.sadadBulkPaymentTabInit=selectedTab;
    if(this.rootScopeData.sadadBulkPaymentTabInit==="SADMOIUP"){
      this.getDebitDataSadadMOIFileUpload(selectedTab);
    }else{
      this.getDebitData(selectedTab);
    }
  }

  entitlement(value: any) {
    this.isChecked = value;
    this.uploadInput={
      supportedFileTypes:systemproperty.sadadBulkPaymentSupportedFileTypesCSV,
      supportedFileSize:systemproperty.sadadBulkPaymentSupportedFileSize
    }
        let sessionUnitId = this.rootScopeData.userInfo.UNIT_ID || '';
        this.sadadService.getEntitlement(sessionUnitId).subscribe(
          (data: any) => {
            this.isLoadingCompelete = true;
            this.entitelementData = data.data.entitledSubPdt;
            this.entitelementData.forEach((element: any) => {
              if (this.rootScopeData.sadadBulkPaymentTabInit==="SADPAYUP") {
                this.router.navigate(['sadad/bulkPayment']);
                this.getDebitData(this.isChecked);
                this.isLoadingCompelete=false;
                this.subPdtCode=this.rootScopeData.sadadBulkPaymentTabInit;
              } else if (this.rootScopeData.sadadBulkPaymentTabInit==="SADMOIUP") {
                this.router.navigate(['sadad/bulkPaymentMOI']);
                this.subPdtCode=this.rootScopeData.sadadBulkPaymentTabInit
              }
            });
            this.downloadTemplateData = {
              flag:"SADPAYUP",
              moduleId: "TMPDOWNLD",
              subPdt: this.subPdtCode,
              exportType: 'csv'
            }
          },
          (_error: any) => { this.isLoadingCompelete = true; }
        );
    
  }

  getDisplayStatus(val: any, comp: any) {
    switch (comp) {
      case 'debitTo':
        this.selectedDebitObj = val;
        if(val === 'iconClick' ) {
          this.reset();
        }
        break;
      case 'authorization':
        this.authDataObj = val;
        break;
    }
    this.proceedBtnShow = false;    
  }

  getDebitData(value: any) {
    this.isLoadingCompelete=false;
    this.isChecked = value;
    this.sadadService.getSadadBulkFileUploadLokupApiCall().subscribe(
      (debData: any) => {
        if (debData) {
          this.isLoadingCompelete = true;
          let debitData = debData.DATA.ALL_RECORDS;

          for (let i in debitData) {
            let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMT;
            let convtd_ccy = debitData[i].OD_CCY_CODE;
            let convtd_amount = '';
            if (crntAvail_amount && convtd_ccy) {
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              convtd_amount = currencyFormatPipeFilter.transform(
                crntAvail_amount.trim(),
                convtd_ccy
              );
              debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
              debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
            }
          }
          this.debitDataObj = {
            title: 'LBL_FROM',
            data: debitData,
            fieldDetails: [
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'OD_ACC_NAME',
              },
              {
                dispKey: 'LBL_ACCOUNT_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
                dataKeySupport: 'OD_CCY_CODE',
              },
            ],
          };
        }
      },
      (_error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  proceedNext() {
    this.isLoadingCompelete = false;
    this.isLoadingCompeleteMedium=false;
    this.isAuthorizationSct=false;
    const requestObject = {
      fileName: this.filename,
      fileSize: this.file_size,
      fileType: this.fileFormat,
      accountNumber: this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '',
      cifNumber: this.selectedDebitObj.COD_CORECIF,
      checkSum: this.fileChecksum,
      makerDate: this.selectedDebitObj.DATE_TIME,
      subPdtCode: this.subPdtCode,
      actualFileName: this.fileActualName,
    };
    // console.log("TEST:::",requestObject);
    // console.log(this.rootScopeData.sadadBulkPaymentTabInit,"TEST:::")
    this.sadadService.sadUpSubmitApiCall(requestObject).subscribe(
      (proceedData: any) => {
        this.fileReferenceNumber = proceedData.data.REFERENCE_NUM;        
        //this.getFileDetails();
        if (this.fileReferenceNumber && proceedData.data.STATUS === "SUCCESS") {
          this.getFileDetails();
        }
      },
      (error) => { this.isLoadingCompelete = true; }
    );
  }

  getFileDetails() {
    this.fileDetails = [];
    let reqData = {
      unitId: this.selectedDebitObj?.UNIT_ID || '',
      referenceNumber: this.fileReferenceNumber
    }
    this.isProceed = true;
    this.isLoadingCompeleteMedium=false;
    this.isLoadingCompelete = true;
    
    //console.log("TEST::::",reqData)
    this.sadadService.getFileDetailsApiCall(reqData).subscribe(
      (fileDetailsData: any) => {
       // console.log("1")
        if (fileDetailsData.data.fileStatusCd === "PNAUTH") {
          //console.log("1")
          this.isLoadingCompeleteMedium=true;
          this.isProceedFileStatusCode=true;
          this.isAuthorizationSct=true;
          this.numberOfRecord = fileDetailsData.data.noOfSuccessTxn ? fileDetailsData.data.noOfSuccessTxn : '';
          this.numberOfFailedRecord = fileDetailsData.data.noOfFaildTxn ? fileDetailsData.data.noOfFaildTxn : '';
          this.amount = fileDetailsData.data.odFileAmount ? fileDetailsData.data.odFileAmount : '';
          this.totalRecords = fileDetailsData.data.totalCount ? fileDetailsData.data.totalCount : '';
          this.currencyCode = fileDetailsData.data.odTxnCy ? fileDetailsData.data.odTxnCy : '';
          this.odDRefNo=fileDetailsData.data.odDRefNo || '';
          //console.log("TEST:::::::::::::",this.odDRefNo)
          this.getRecordSummaryData({
            sortColumn: 'transactionId',
            sortOrder: 'desc',
            fromRow: 1,
            toRow: totalRecordsPerRequest,
          });

          if(this.amount && this.selectedDebitObj.CURR_AVAIL_BAL_AMT){
            const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
            const uploadAmount = Number(unformattedAmountPipeFilter.transform(this.amount, "SAR"));
            const debitAmount = Number(unformattedAmountPipeFilter.transform(this.selectedDebitObj.CURR_AVAIL_BAL_AMT,"SAR"));
            if(uploadAmount < debitAmount){
              this.balanceValidation = false;
              this.getAuthorizationData();
            }else{
              this.balanceValidation = true;
            }
          }
          
          if (this.amount) {
            //this.isProceedzeroamount=true;
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            this.amount = currencyFormatPipeFilter.transform(this.amount.trim(), '');
          }
          this.fileAPIAutoInvoke = true;
          this.uploadFailed=false;
          //console.log(this.fileApiAutoFetch,"TEST:::")
          if(this.fileApiAutoFetch){
            clearInterval(this.fileApiAutoFetch)
          }
          if(this.fileApiAutoFetchNull){
            clearInterval(this.fileApiAutoFetchNull)
          }
         // console.log(this.fileApiAutoFetch,"TEST:::")
        }else if( (fileDetailsData.data.fileStatusCd ==="VERFAL") || (fileDetailsData.data.fileStatusCd=== "CONFAL") || (fileDetailsData.data.fileStatusCd==="REJCTD") || (fileDetailsData.data.fileStatusCd==="FAILED")){
          this.isProceedFileStatusCode=false;
          this.statusCodeNullCounter=0;
          this.isLoadingCompeleteMedium=true;
          this.uploadFailed=true;
          this.rejectReason=fileDetailsData.data?.rejectReason;
          this.getRecordSummaryData({
            sortColumn: 'transactionId',
            sortOrder: 'desc',
            fromRow: 1,
            toRow: totalRecordsPerRequest,
          });
          if(this.fileApiAutoFetch){
            clearInterval(this.fileApiAutoFetch)
          }
          if(this.fileApiAutoFetchNull){
            clearInterval(this.fileApiAutoFetchNull)
          }
        }
        else if( (fileDetailsData.data.fileStatusCd ===null)){
          if(this.fileApiAutoFetch){
            clearInterval(this.fileApiAutoFetch)
          }
          
          if(!this.setIntervalNullFlag){
            this.setIntervalNullFlag=true;
            let intervalLimit = `${systemproperty.fetchFilesFromPPPInterval}`;
            this.statusCodeNullCounter=0;
            
            if (this.fileAPIAutoInvokeNull) {
              //console.log("T2")
              if(this.fileApiAutoFetchNull){
                clearInterval(this.fileApiAutoFetchNull)
              }
              this.fileAPIAutoInvokeNull=false;
              this.statusCodeNullCounter=0;
              this.uploadFailed=true;
              this.isLoadingCompeleteMedium=true;
              this.isProceedFileStatusCode=false;
            }else{
              this.fileApiAutoFetchNull = setInterval(() => {
              
                this.statusCodeNullCounter++;
                if(this.statusCodeNullCounter > 4){
                  this.fileAPIAutoInvokeNull=true;      
                  //console.log("T1")            
                }
              //console.log(this.statusCodeNullCounter,"COUNTER:::")
              this.getFileDetails();
              if(this.fileAPIAutoInvokeNull && this.fileApiAutoFetchNull){
                clearInterval(this.fileApiAutoFetchNull)
                this.fileAPIAutoInvokeNull=false;
              this.statusCodeNullCounter=0;
              this.uploadFailed=true;
              this.isLoadingCompeleteMedium=true;
              this.isProceedFileStatusCode=false;
              }
            }, Number(intervalLimit));
            }
          }
          //this.uploadFailed=false;
          //console.log("TEST:::")
        }else{
          //console.log("ELSE");
          if(this.fileApiAutoFetchNull){
            clearInterval(this.fileApiAutoFetchNull)
          }
          if(!this.setIntervalFlag){
            //console.log("ELSE INR")
            this.setIntervalFlag=true;
            let intervalLimit = `${systemproperty.fetchFilesFromPPPInterval}`;
            
            if (this.fileAPIAutoInvoke) {
              if(this.fileApiAutoFetch){
                clearInterval(this.fileApiAutoFetch)
              }
              this.fileAPIAutoInvoke=false;
            }else{
              this.fileApiAutoFetch = setInterval(() => {              
                this.getFileDetails();              
              }, Number(intervalLimit));
            }
            
          }
        }
        this.initReqParam.accNo= this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '';
        this.initReqParam.amt=parseFloat(this.amount.replace(/,/g, '')).toString();
        this.initReqParam.pdroductCode="PAYMNT";
        this.initReqParam.subPrdCode=this.subPdtCode;
        this.initReqParam.cif=this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : '';
        this.initReqParam.unitId=this.selectedDebitObj  && this.selectedDebitObj.UNIT_ID ? this.selectedDebitObj.UNIT_ID : "";
    
      },
      (error) => { this.isLoadingCompelete = true;this.isLoadingCompeleteMedium=true;
        this.isProceedFileStatusCode=true;
       }
    );
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  onSecondFactorAuth(details: any): void {
    this.secAuthRef = details.data.secfRefNo;
  }

  onSubmit() {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    const requestObject = {
      fileName: this.filename,
      fileSize: this.file_size,
      fileType: this.fileFormat,
      paymentCy:this.currencyCode,
      //amount:this.amount.trim(),
      amount: parseFloat(this.amount.replace(/,/g, '')).toString(),
      accountNumber: this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '',
      cifNumber: this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : '',
      referenceNumber: this.fileReferenceNumber,
      checkSum: this.fileChecksum,
      makerDate: this.selectedDebitObj.DATE_TIME,
      otp: this.userOtpValue ? this.userOtpValue : '',
      otpRef: this.secAuthRef ? this.secAuthRef : '',
      subPdtCode:this.subPdtCode,
      actualFileName: this.fileActualName,
      AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    };
    // console.log(JSON.stringify(requestObject), 'requestObject')
    this.sadadService.sadUpConfirmApiCall(requestObject).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      if (res.dataValue.INPUT_REFERENCE_NO && res.dataValue.OD_STATUS_DESC === "Success") {
        this.hideAll = true;
        this.refNo = res.dataValue.INPUT_REFERENCE_NO;
        this.constructReceiptData(res.dataValue.INPUT_REFERENCE_NO);
      }
      else if(res.dataValue.OD_STATUS_DESC === "Failed"){
        this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
          // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        }      
    }, error => { this.isLoadingCompelete = true; })
  }

  setAuthorDetails(authorDetails: any): void {
    this.authorizeDetails = authorDetails;
  }

  constructReceiptData(refNumber: any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign([this.selectedDebitObj][0], { USER_ID: userId })
    let flexiAuth = {
      "title": "LBL_AUTHORIZATION",
      "isTable": "false",
      "data": '',
      "fieldDetails": [
        {
          "dispKey": "LBL_Next_Approver",
          "dataKey": this.authorizeDetails === undefined ? 'Not Provided' : this.authorizeDetails.selectedAprover.AUTH_NAME === undefined && '' ? 'Not Provided' : this.authorizeDetails.selectedAprover.AUTH_NAME
        },
        {
          "dispKey": "LBL_ADD_NEXT_APROVER",
          "dataKey": this.authorizeDetails === undefined ? 'Not Provided' : this.authorizeDetails.aproveNote === undefined && '' ? 'Not Provided' : this.authorizeDetails.aproveNote
        }
      ]
    }
    this.receiptData = {
      msg1: 'LBL_PAYMENT_SUCCESSFULL',
      msg2: 'LBL_SADAD_BULK_PAYMENT_PENDING_APPROVAL',
      referenceNumber: refNumber,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'true',
          data: [this.selectedDebitObj],

          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: 'USER_ID',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: 'OD_ACC_NO',
            },
            {
              dispKey: 'LBL_SHORT_NAME',
              dataKey: 'ALIAS_NAME',
            },
          ],
        },
        {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_FILE_UPLOAD',
              dataKey: this.fileActualName,
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
        buttonLabel: 'LBL_MAKE_ANOTHER_PAY',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    if(this.showAuthorization){
      this.receiptData.receiptDetails.push(flexiAuth);
    }

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_PAYMENT_SUCCESSFULL"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_SADAD_BULK_PAYMENT_PENDING_APPROVAL"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.selectedDebitObj.USER_ID ?  this.selectedDebitObj.USER_ID : "--"
        },
        {
          "subHead": "Account Number",
          "subValue": this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO :"--"
        },
        {
          "subHead": "Nick name",
          "subValue": this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME:"--"
        },
        {
          "subHead": "File Upload",
          "subValue": this.fileActualName ? this.fileActualName :"--"
        },
      ],
      "pagecall":"sadadbulkupload",
      "refNo":refNumber
    }

  }

  makeAnotherPayment() {    
    this.reset();
  }

  reset() {
    this.debitDataObj = null;
    this.getDebitData(this.isChecked);
    this.selectedDebitObj = null;
    this.isProceed = false;
    this.proceedBtnShow = false;
    this.hideAll = false;
    this.setIntervalFlag=false;
    this.showAuthorization = false;
    this.showAuthentication = false;
    // this.fileAPIAutoInvokeNull=true;
    // this.fileAPIAutoInvoke=true;
    this.userOtpValue="";
    this.setIntervalNullFlag=false;
    this.showRecordSummary=false;
    this.fileTypeValidationErrorMessage = false;
    this.fileSizeValidationErrorMessage = false;
    this.fileNameValidationErrorMessage = false;
    this.isAuthorizationSct=true;
    this.uploadFailed=false;
    if(this.fileApiAutoFetchNull){
      clearInterval(this.fileApiAutoFetchNull)
    }
    if(this.fileApiAutoFetch){
      clearInterval(this.fileApiAutoFetch)
    }
  }

  getAuthorizationData() {
    const uploadFileData = {
      currencyCode: this.currencyCode,
      amount: this.amount
    }
    this.sadadService.sadadBulkFileUploadAuthCheck(this.selectedDebitObj, uploadFileData).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        this.sefAuthFlag = res.data.selfAuth;
        if (res) {
          this.isLoadingCompelete = true;
          if (res.data.selfAuth == "true") {
            this.showAuthentication = true;
          }
          if (res.data.flexiAuth == "true") {
            this.showAuthorization = true;
            this.authOptions = res.data.authList;
          }
        }
      },
      (error: any) => { this.isLoadingCompelete = true; }
    );
  }

  getOtpValue(otpValue: any) {
    if(otpValue){
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onSubmit();
    }else{
      this.userOtpValue = "";
    }
  }

  getRecordSummaryData(data: any): void {
    const params = {
      "moduleId": "SADRECSUMY",
      "productName": "PAYMNT",
      "subPdt": this.subPdtCode,
      "functionCode": "BULKUP",
      "odDRefNo": this.odDRefNo || '',
      "sortColumn": data?.sortColumn,
      "sortOrder": data?.sortOrder,
      "fromRow": data?.fromRow,
      "toRow": data?.toRow
    };
    this.isLoadingComplete = false;

    this.sadadService.getRecordSummary(params).subscribe(
      (records: any) => {
        this.isLoadingComplete = true;
        if (records.data) {
          this.sortOptions = records.headerValue;
          this.recordSummaryObject = {
            data: records.data,
            displayDetails: [
              {
                displayLabel: 'LBL_Transaction_Id',
                displayKey: 'transactionId',
              },
              {
                displayLabel: 'LBL_BILLER',
                displayKey: 'biller',
              },
              {
                displayLabel: 'LBL_SERVICE_TYPE',
                displayKey: 'service',
              },
              {
                displayLabel: 'LBL_ACCOUNT',
                displayKey: 'debitAcc',
              },
              {
                displayLabel: 'LBL_AMOUNT',
                displayKey: 'payAmt',
                type: 'amount',
                supportValue: 'ccy'
              },
              {
                displayLabel: 'LBL_STATUS',
                displayKey: 'status',
              },
              {                
                displayLabel: 'LBL_RJCT_RSN',
                displayKey: 'rejectReason',
              }
            ]
          };
          this.showRecordSummary = true;
          
        }
      },
      () => {
        this.isLoadingComplete = true;
        this.showRecordSummary = false;
      }
    );
  }

  onSortColumn(details: any): void {
    this.getRecordSummaryData(details);
  }

  // getOtpValue(otpValue: any) {
  //   if (otpValue) {
  //     this.otpError = 'LBL_PLS_ENTER_OTP';
  //     return;
  //   } else if (otpValue) {
  //     this.otpError = '';
  //     this.userOtpValue = otpValue;
  //   } else {
  //     this.userOtpValue = '';
  //     this.otpError = 'LBL_PLS_ENTER_OTP';
  //     return;
  //   }
  // }

  // onClickDownload() {
  //   window.open(this.downloadUrlBasePath, '_self');
  // }

  // Start - get debit data for sadad moi debit lookup data while toggled.

  getDebitDataSadadMOIFileUpload(value: any) {
    this.router.navigate(['sadad/bulkPaymentMOI']);
    this.isChecked = value;
    this.isLoadingCompelete = false;
    let moduleId="SADUPLACCLKP "
    this.sadadService.getSadadMOIBulkFileUploadLokupApiCall(moduleId).subscribe(
      (debData: any) => {
        this.isLoadingCompelete = true;
        if (debData) {
          let debitData = debData.DATA.ALL_RECORDS;
          for (let i in debitData) {
            let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMT;
            let convtd_ccy = debitData[i].OD_CCY_CODE;
            let convtd_amount = '';
            if (crntAvail_amount && convtd_ccy) {
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              convtd_amount = currencyFormatPipeFilter.transform(
                crntAvail_amount.trim(),
                convtd_ccy
              );
              debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
            }
          }
          this.debitDataObj = {
            title: 'LBL_FROM',
            data: debitData,
            fieldDetails: [
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'OD_ACC_NAME',
              },
              {
                dispKey: 'LBL_ACCOUNT_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: 'CURR_AVAIL_BAL_AMT',
                dataKeySupport: 'OD_CCY_CODE',
              },
            ],
          };
        }
      },
      (_error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }
  //End - get debit data for sadad moi debit lookup data while toggled.
  getAuthType(val: any) {
    this.authType = val
  }

  downloadPdf(values:any)
  { 
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant('LBL_SADAD_BULK_PAYMENT_RECEIPT'), x:90, y:35},
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
    { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_SHORT_NAME'), y:95},
    // { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    // { type: 'heading', value:this.translateService.instant('LBL_TO'), y:105},
    // { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_FILE_UPLOAD'), y:105},
    // { type: 'heading', value:this.translateService.instant('LBL_SERVICE_TYPE'), y:125},
    // { type: 'heading', value:this.translateService.instant(this.dynamicParamsForPayload[0].englishName), y:135},
    { type: 'text', value:this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : '', y:75},
    { type: 'text', value:this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '', y:85},
    { type: 'text', value:this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : '', y:95},
    { type: 'text', value:this.fileActualName ? this.fileActualName : '', y:105},
    // { type: 'text', value: this.payToObject[0].serviceType ?  this.payToObject[0].serviceType : '', y:125},
    // { type: 'text', value:this.dynamicParamsForPayload[0].value ? this.dynamicParamsForPayload[0].value : '', y:135},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:115},
    { type: 'text', value: this.refNo ? this.refNo : '', y:115},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_BULK_PAYMENT_PENDING_APPROVAL'), y:125},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'SadadBulkPayment.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'SadadBulkPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}