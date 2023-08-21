import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { environment } from 'src/environments/environment';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { TranslateService } from '@ngx-translate/core';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';

@Component({
  selector: 'sadad-moi-bulk-payment-payment',
  templateUrl: './sadad-moi-bulk-payment.component.html',
  styleUrls: ['./sadad-moi-bulk-payment.component.scss'],
})
export class SadadMoiBulkPaymentComponent implements OnInit {
  @Input() selectedObj: any
  isLoadingCompelete = false;
  debitDataObj: any;
  isChecked:string = '';
  selectedDebitObj: any;
  hideAll = false;
  dataSource: any
  billerinformdataSource: any;
  billerName: string = "";
  billerId: string = "";
  billerCode: string = "";
  serviceTypeData: any;
  serviceCode: string = "";
  isProceed: boolean = false;
  receiptData: any;
  authDataObj: any;
  downloadUrlBasePath: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  authOptions: any = [];
  // uploadFileTitle = 'Upload File';
  selectedBillerObjData: any;
  selectedServiceTypeObjData: any;
  selectedServiceName: any;
  otpDetails: any;
  secAuthRef: any;
  authorizeDetails: any;
  userOtpValue: any;
  otpError: string | undefined;
  file_size: string = "";
  filename: string = '';
  fileFormat: string = '';
  fileAPIAutoInvoke: boolean = false;
  fileApiAutoFetch: any;
  fileApiAutoFetchNull:any;
  fileReferenceNumber: string = '';
  fileDetails: any = [];
  // fileDetailsTableColumn = ['Total Records', 'Total Amount', 'Number of Records'];
  // supportedFileTypes = systemproperty.sadadMOIBulkPaymentSupportedFileTypesCSV;    
  // supportedFileSize= systemproperty.sadadMOIBulkPaymentSupportedFileSize;
  rejectReason:boolean=false;
  fileChecksum: string = '';
  fileActualName: string = '';
  fileSizeValidationErrorMessage: boolean = false;
  fileTypeValidationErrorMessage: boolean = false;
  proceedBtnShow: boolean = false;
  totalRecords: any;
  amount: any;
  numberOfRecord: any;
  numberOfFailedRecord:any;
  currencyCode: any;
  entitelementData: any;
  isLoadingCompeleteMedium:boolean=false;
  setIntervalFlag:boolean=false;
  isProceedFileStatusCode:boolean=false;
  downloadTemplateData:any;
  uploadInput:any;
  fileUploadedDetails:any;
  subPdtCode:string="SADMOIUP";
  statusCodeNullCounter:number=0;
  uploadFailed:boolean=false;
  fileAPIAutoInvokeNull:boolean=false;
  setIntervalNullFlag:boolean=false;
  isAuthorizationSct:boolean=false;
  // record summary
  transactionSummaryList: any = [];  
  showRecSumm: boolean = false;
  uploadFileDetails: any = {};
  fetchedFileDetails: any = {};
  moduleId: string = 'SADRECSUMY';
  showRecordSummary:boolean=false;
  odDRefNo:any;
  termsConditionUrl:string="";
  isLoadingComplete:boolean=false;
  recordSummaryObject: any;
  sortOptions: any = {
    sortColumn: 'beneAccNo',
    sortOrder: 'desc',
    fromRow: 0,
    toRow: 5,
  };
  fileNameValidationErrorMessage: boolean = false;
  // record summary
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
  constructor(
    private translateService: TranslateService,
    private sadadService: SadadPaymentService,
    private router: Router, private downloadAsPdf:downloadAsPdf
  ) { }

  ngOnInit(): void {    
    //this.getDebitData();
    this.billerinform();
    this.termsConditionUrl = systemproperty.termsAndConditionsLinkForSadadBulkPayment;
    this.entitlement('SADMOIUP');    
    
  }

  billerinform() {
    this.isLoadingCompelete = false;
    let param = {
      pageCall : "BULK"
    }
    this.sadadService.getSadadMoiBillerInfo(param).subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billerinformdataSource = data.data;
      }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  entitlement(value: any) {
    this.isChecked = value;
    this.uploadInput={
      supportedFileTypes:systemproperty.sadadMOIBulkPaymentSupportedFileTypesCSV,
      supportedFileSize:systemproperty.sadadMOIBulkPaymentSupportedFileSize
    }
    let sessionUnitId = this.rootScopeData.userInfo.UNIT_ID || '';
        this.sadadService.getEntitlement(sessionUnitId).subscribe(
          (data: any) => {
            this.isLoadingCompelete = true;
            this.entitelementData = data.data.entitledSubPdt;
            let sadadTabActive: Boolean = false;
            this.entitelementData.forEach((element: any) => {
              if (element.subPdtCode === 'SADPAYUP'  && (this.rootScopeData.sadadBulkPaymentTabInit==="SADPAYUP")) {
                sadadTabActive = false;
                this.router.navigate(['sadad/bulkPayment']);
                this.subPdtCode=element.subPdtCode;                
              }else if (element.subPdtCode === 'SADMOIUP' && (this.rootScopeData.sadadBulkPaymentTabInit==="SADMOIUP")) {
                sadadTabActive = true;
                this.router.navigate(['sadad/bulkPaymentMOI']);
                this.getDebitData(this.isChecked);
                this.subPdtCode=element.subPdtCode;
              }
            });
            this.isChecked="SADMOIUP";            
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
    this.isChecked = value;
    this.isLoadingCompelete = false;
    let moduleId="SADMOIUPLACCLKP"
    this.sadadService.getSadadMOIBulkFileUploadLokupApiCall(moduleId).subscribe(
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

  onFileAdded(eventData: any) {
    this.filename = eventData.title;
    this.file_size = eventData.size;
    this.fileFormat = eventData.format;
    this.fileChecksum = eventData.checkSum;
    this.fileActualName= eventData.fileActualName;
    
    this.fileTypeValidationErrorMessage = false;
    this.fileSizeValidationErrorMessage = false;
    this.fileNameValidationErrorMessage = false;
    this.fileTypeValidationErrorMessage = eventData.typeValidFlag ? false : true;
    this.fileSizeValidationErrorMessage = eventData.fileSizeValidFlag ? true : false;
    this.fileNameValidationErrorMessage = eventData.isFileNameValid? false : true;

    if (this.filename && !this.fileSizeValidationErrorMessage && !this.fileTypeValidationErrorMessage && this.selectedBillerObjData && this.selectedServiceTypeObjData) {
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

  selectedBillerObj(value: any) {
    this.selectedBillerObjData = value;
    if (this.filename && !this.fileSizeValidationErrorMessage && !this.fileTypeValidationErrorMessage && this.selectedBillerObjData && this.selectedServiceTypeObjData) {
      this.proceedBtnShow = true;
    } else {
      this.proceedBtnShow = false;
    }
  }

  selectedServiceTypeObj(value: any) {
    this.selectedServiceTypeObjData = value;
    this.selectedServiceName = value.serviceName;
    this.downloadTemplateData = {
      flag:"SADMOIUP",
      moduleId: "TMPDOWNLD",
      subPdt: this.subPdtCode,
      exportType: 'csv',
      billerId:this.selectedBillerObjData.billerId?this.selectedBillerObjData.billerId:'',
      billerCode:this.selectedBillerObjData.billerCode?this.selectedBillerObjData.billerCode:'',
      serviceCode:this.selectedServiceTypeObjData.serviceCode?this.selectedServiceTypeObjData.serviceCode:'',
      type:this.selectedServiceTypeObjData.serviceName?this.selectedServiceTypeObjData.serviceName:''
    }
    if (this.filename && !this.fileSizeValidationErrorMessage && !this.fileTypeValidationErrorMessage && this.selectedBillerObjData && this.selectedServiceTypeObjData) {
      this.proceedBtnShow = true;
    } else {
      this.proceedBtnShow = false;
    }
 }

  displayContent(value: any) {
    this.isChecked = value;
    this.rootScopeData.sadadBulkPaymentTabInit=value;
    if (this.rootScopeData.sadadBulkPaymentTabInit ==="SADMOIUP") {
      this.router.navigate(['sadad/bulkPaymentMOI']);      
     this.getDebitData(value);
     this.subPdtCode="SADMOIUP"
    } else if (this.rootScopeData.sadadBulkPaymentTabInit==="SADPAYUP") {
      this.router.navigate(['sadad/bulkPayment']);      
      this.getDebitData(value);
      this.subPdtCode="SADPAYUP"
    }
  }

  proceedNext() {

  let requestObj = {
      fileName: this.filename?this.filename:'',
      fileSize: this.file_size?this.file_size:'',
      fileType: this.fileFormat?this.fileFormat:'',
      billerId: this.selectedBillerObjData.billerId ? this.selectedBillerObjData.billerId : '',
      billerCode: this.selectedBillerObjData.billerCode ? this.selectedBillerObjData.billerCode : '',
      serviceCode: this.selectedServiceTypeObjData.serviceCode ? this.selectedServiceTypeObjData.serviceCode : '',
      accountNumber: this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '',
      cifNumber: this.selectedDebitObj.COD_CORECIF?this.selectedDebitObj.COD_CORECIF:'',
      checkSum: this.fileChecksum,
      makerDate: this.selectedDebitObj.DATE_TIME?this.selectedDebitObj.DATE_TIME:'',
      subPdtCode:this.subPdtCode,
      actualFileName: this.fileActualName
    }
    this.isLoadingCompeleteMedium=false;
    this.isProceedFileStatusCode=false;
    this.isAuthorizationSct=false;
    this.sadadService.proceedSadadMOIBulkFileUploadLokupApiCall(requestObj).subscribe(
      (proceedData: any) => {
        this.fileReferenceNumber = proceedData.data.REFERENCE_NUM;
        
        //this.fileFetchCall();
        if (this.fileReferenceNumber && proceedData.data.STATUS === "SUCCESS") {
          //this.isLoadingCompelete = true;
          //this.isProceed = true;
          this.fileFetchCall();          
        }
      }, (error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  makeAnotherPayment() {
    this.reset();
  }

  fileFetchCall() {
    this.fileDetails = [];
    let reqData = {
      unitId: this.selectedDebitObj?.UNIT_ID,
      referenceNumber: this.fileReferenceNumber
    }
    this.isProceed = true;
    this.sadadService.fetchFileDetailsByProceedReferenceNumber(reqData)
      .subscribe(
        (proceedData: any) => {
          this.isLoadingCompelete = true;
          if (proceedData.data.fileStatusCd === "PNAUTH") {
            this.isLoadingCompeleteMedium=true;
            this.fileAPIAutoInvoke = true;
            this.isProceedFileStatusCode=true;
            this.numberOfRecord = proceedData.data.noOfSuccessTxn ? proceedData.data.noOfSuccessTxn : '';
            this.numberOfFailedRecord = proceedData.data.noOfFaildTxn ? proceedData.data.noOfFaildTxn : '';
            this.amount = proceedData.data.odFileAmount ? proceedData.data.odFileAmount : '';
            this.totalRecords = proceedData.data.totalCount ? proceedData.data.totalCount : '';
            this.currencyCode = proceedData.data.odTxnCy ? proceedData.data.odTxnCy : '';
            this.odDRefNo=proceedData.data.odDRefNo || '';
            this.isAuthorizationSct=true;

            this.getRecordSummaryData({
              sortColumn: 'transactionId',
              sortOrder: 'desc',
              fromRow: 1,
              toRow: totalRecordsPerRequest,
            });
            // this.getAuthorizationData();
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
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              this.amount = currencyFormatPipeFilter.transform(this.amount.trim(), '');
            }
            this.fileAPIAutoInvoke = true;
          this.uploadFailed=false;
          if(this.fileApiAutoFetch){
            clearInterval(this.fileApiAutoFetch)
          }
          if(this.fileApiAutoFetchNull){
            clearInterval(this.fileApiAutoFetchNull)
          }
          }else if( (proceedData.data.fileStatusCd ==="VERFAL") || (proceedData.data.fileStatusCd=== "CONFAL") || (proceedData.data.fileStatusCd==="REJCTD") || (proceedData.data.fileStatusCd==="FAILED")){
            this.isProceedFileStatusCode=false;
            this.statusCodeNullCounter=0;
            this.isLoadingCompeleteMedium=true;
            this.uploadFailed=true;
            this.rejectReason=proceedData.data?.rejectReason;
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
          else if( (proceedData.data.fileStatusCd ===null)){
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
                this.fileFetchCall();
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
                  this.fileFetchCall();              
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
    
        }, (error: any) => {
          this.isLoadingCompelete = true;this.isLoadingCompeleteMedium=true;
          this.isProceedFileStatusCode=true;
        }
      );
  }

  setAuthorDetails(authorDetails: any): void {
    this.authorizeDetails = authorDetails;
  }

  onSecondFactorAuth(details: any): void {
    this.secAuthRef = details.data.secfRefNo;
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if(otpValue){
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onSubmitSadadBulkFileUpload();
    }else{
      this.userOtpValue = "";
    }
  }

  onSubmitSadadBulkFileUpload() {
    if (!this.userOtpValue) {
      this.otpError = "LBL_PLS_ENTER_OTP";
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }

    const requestObject = {
      fileName: this.filename,
      fileSize: this.file_size,
      checkSum: this.fileChecksum,
      referenceNumber: this.fileReferenceNumber, 
      accountNumber: this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '',
      amount: parseFloat(this.amount.replace(/,/g, '')).toString(),
      paymentCy:this.currencyCode,
      unitId: this.selectedDebitObj.UNIT_ID ? this.selectedDebitObj.UNIT_ID : '',
      codCifNo: this.selectedDebitObj.COD_CORECIF ? this.selectedDebitObj.COD_CORECIF : '',
      dateTime: this.selectedDebitObj.DATE_TIME ? this.selectedDebitObj.DATE_TIME : '',
      billerId: this.selectedBillerObjData.billerId ? this.selectedBillerObjData.billerId : '',
      billerCode: this.selectedBillerObjData.billerCode ? this.selectedBillerObjData.billerCode : '',
      serviceCode: this.selectedServiceTypeObjData.serviceCode ? this.selectedServiceTypeObjData.serviceCode : '',
      otp: this.userOtpValue ? this.userOtpValue : '',
      otpRef: this.secAuthRef ? this.secAuthRef : '',
      subPdtCode:this.subPdtCode,
      actualFileName: this.fileActualName,
      AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    }

    this.sadadService.submitSadadMoiBulkFileUpload(requestObject).subscribe(
      (data: any) => {
       // console.log(requestObject,"TEST:::")
        this.isLoadingCompelete = true;
        if (data.dataValue.INPUT_REFERENCE_NO && data.dataValue.OD_STATUS_DESC === "Success") {
          this.hideAll = true
          this.refNo = data.dataValue.INPUT_REFERENCE_NO;
          this.constructReceiptData(data.dataValue.INPUT_REFERENCE_NO)
        }
        else {
          this.otpError = this.authType==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
          // this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
        }
      }, error => {
        this.isLoadingCompelete = true;
      })
  }

  constructReceiptData(refNumber: any) {
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign([this.selectedDebitObj][0], { USER_ID: userId });
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
      msg2: 'LBL_SADAD_MOI_BULK_PAYMENT_PENDING_APPROVAL',
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
          title: 'LBL_BILLER_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_BILLER',
              dataKey: this.selectedBillerObjData.billerName,
            },
            {
              dispKey: 'LBL_SERVICE_TYPE',
              dataKey: this.selectedServiceTypeObjData.serviceName,
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
          "subHead": "Biller Details",
          "subValue": ""
        },
        {
          "subHead": "Biller",
          "subValue": this.selectedBillerObjData.billerName ?  this.selectedBillerObjData.billerName : "--"
        },
        {
          "subHead": "Service Type",
          "subValue": this.selectedServiceTypeObjData.serviceName ? this.selectedServiceTypeObjData.serviceName :"--"
        },
        {
          "subHead": "File Upload",
          "subValue": this.fileActualName ? this.fileActualName :"--"
        },
      ],
      "pagecall":"sadadmoibulkupload",
      "refNo":refNumber
    }

  }

  reset() {
    this.debitDataObj = null;
    this.getDebitData('SADMOIUP');
    this.selectedDebitObj = null;
    this.hideAll = false;
    this.isProceed = false;
    this.proceedBtnShow = false;
    this.selectedBillerObjData=null;
    this.selectedServiceTypeObjData=null;
    this.setIntervalFlag=false;
    this.isProceedFileStatusCode=false; 
    this.filename="";
    this.userOtpValue="";
    this.selectedServiceName=null;
    this.showRecordSummary=false;
    this.fileTypeValidationErrorMessage = false;
    this.fileSizeValidationErrorMessage = false;
    this.fileNameValidationErrorMessage = false;
    this.isAuthorizationSct=false;
    this.uploadFailed=false;
    this.showAuthorization = false;
    this.showAuthentication = false;
    if(this.fileApiAutoFetchNull){
      clearInterval(this.fileApiAutoFetchNull)
    }
    if(this.fileApiAutoFetch){
      clearInterval(this.fileApiAutoFetch)
    }
  }

  getAuthorizationData() {

  let reqObj = {
  fileAmount: this.amount,
  pymntCurrency:this.currencyCode,
  unitId:this.selectedDebitObj.UNIT_ID,
  cifNum:this.selectedDebitObj.COD_CORECIF,
  accountNumber:this.selectedDebitObj.OD_ACC_NO,
  debitCurrency:this.selectedDebitObj.OD_CCY_CODE,
}
this.sadadService.flexiAuthorizationSadadMOIFileUpload(reqObj).subscribe(
      (res: any) => {
        //this.isLoadingCompelete = true;
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
      (error: any) => {
       this.isLoadingCompelete = true;
      }
    );
  }

  getRecordSummaryData(data: any): void {
    const params = {
      "moduleId": "SADMOIRECSUMY",
      "productName": "PAYMNT",
      "subPdt": "SADMOIUP",
      "functionCode": "BULKUP",
      "odDRefNo": this.odDRefNo || '',
      "sortColumn": data?.sortColumn,
      "sortOrder": data?.sortOrder,
      "fromRow": data?.fromRow,
      "toRow": data?.toRow
    };
    this.isLoadingComplete = false;

    this.sadadService.getsadadMOIRecordSummary(params).subscribe(
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
                supportValue: 'ccy',
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

  // onClickDownload() {
  //   this.billerId = this.selectedBillerObjData.billerId;
  //   this.billerCode = this.selectedBillerObjData.billerCode;
  //   this.serviceCode = this.selectedServiceTypeObjData.serviceCode
  //   this.downloadUrlBasePath = `${environment.restDownloadAPI}` + `?moduleId=TMPDOWNLD&subPdt=SADMOIUP&billerId=` + this.billerId + `&billerCode=` + this.billerCode + `&serviceCode=` + this.serviceCode;
  //   window.open(this.downloadUrlBasePath, '_self');
  // }

//   uploadedFileDownload(){
// //(click)="uploadedFileDownload()"
//   }
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
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_BILLER_DETAILS'), y:105},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_BILLER'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_SERVICE_TYPE'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_FILE_UPLOAD'), y:135},
    { type: 'text', value:this.selectedDebitObj.USER_ID ? this.selectedDebitObj.USER_ID : '', y:75},
    { type: 'text', value:this.selectedDebitObj.OD_ACC_NO ? this.selectedDebitObj.OD_ACC_NO : '', y:85},
    { type: 'text', value:this.selectedDebitObj.ALIAS_NAME ? this.selectedDebitObj.ALIAS_NAME : '', y:95},
    { type: 'text', value:this.selectedBillerObjData.billerName ? this.selectedBillerObjData.billerName : '', y:115},
    { type: 'text', value: this.selectedServiceTypeObjData.serviceName ?  this.selectedServiceTypeObjData.serviceName : '', y:125},
    { type: 'text', value:this.fileActualName ? this.fileActualName : '', y:135},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNo ? this.refNo : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_SADAD_MOI_BULK_PAYMENT_PENDING_APPROVAL'), y:155},
  ]

  //   this.pdfData.push(
  //     { type: 'save', value:'SadadMOIrefund.pdf'}
  //  )

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'SadadMOIBulkPayment.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'SadadMOIBulkPayment.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
}
