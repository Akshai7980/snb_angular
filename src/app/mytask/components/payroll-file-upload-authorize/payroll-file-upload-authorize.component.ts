import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { PayrollService } from 'src/app/payroll/services/payroll.service';
import { Subscription } from 'rxjs';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { PeriodicElementDuplicate } from 'src/app/common-components/components/duplicate-records/duplicate-records.component';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import moment from 'moment';
@Component({
  selector: 'app-payroll-file-upload-authorize',
  templateUrl: './payroll-file-upload-authorize.component.html',
  styleUrls: ['./payroll-file-upload-authorize.component.scss'],
})
export class PayrollFileUploadAuthorizeComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  details: any;
  isLoadingCompelete = true;
  receiptData: any;
  receiptForm: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  fileDetails: any;

  isOtpValid: any;
  payrollDetails: any;
  sadadBillerDetails: any;
  paymentCCY: any;
  fileApiAutoFetch: any;
  subscriptions: Subscription[] = [];

  displayedColumns = ['nickName', 'name', 'subscriberId', 'dueDate', 'amount'];
  selectedElementData: any = {};
  debitDataObj: any = {};
  uploadFileDetails: any;
  showDebitData: boolean = false;
  sortOptions: any = {
    sortColumn: 'transactionRef',
    sortOrder: 'desc',
    fromRow: 1,
    toRow: 6,
  };
  showRecSumm: boolean = false;
  recordSummaryObject: any;
  workFlowHistoryParams: any;
  moduleId: string = 'PAYROLTXNS';
  pdfData: any;
  refNum: any
  balanceValidation: boolean = false;
  dupDetailsList: any;
  duplicateRecordList: any =[];
  isSubmitEnabled: boolean = false;
  fromRow: any;
  toRow: any;
  totalrecords: any;
  pageName:any;
  todayDate :any;
  showDatePicker: boolean = false;
  toDate: any;
  toDateValue: any;
  showDateErrorMessage:boolean = false
  businessDates: any;
  validDates: any = [];
  cutOffTime: any;
  effectiveDate: any;
  startDate: any;
  saveReceiptObject:any;
  rejectMsg : boolean = false;
  constructor(
    private commonService: CommonService,
    private myTaskService: MyTaskService,
    private location: Location,
    private route: Router,
    private payrollService: PayrollService,
    private downloadAsPdf:downloadAsPdf,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedElementData = this.myTaskService.getSelectedElementDetails();
    this.fetchBusinessDays();
    // this.valueDateValidation();
    this.uploadFileDetails = this.payrollService.getUploadFileDetails();
    this.pageName='Inquiry';
    this.getAccountDetails(this.selectedElementData);
    this.getClickedData();
  }

  valueDateValidation(){
    if(this.selectedElementData.value_date){
      let day = this.selectedElementData.value_date.substring(0, 2);
      let month = this.selectedElementData.value_date.substring(3, 5);
      let year = this.selectedElementData.value_date.substring(6, 10);
      let vdate = new Date(month + "-" + day + "-" + year);
      this.todayDate = new Date();
      vdate.setMinutes(1);
      this.todayDate.setSeconds(0);
      this.todayDate.setMinutes(0);
      this.todayDate.setHours(0);

      if(vdate < this.todayDate){
        this.showDatePicker = true;
        // return true;
      }else if(vdate > this.todayDate){
        for(let i =0; i < this.businessDates.length; i++){
          let busday = this.businessDates[i].businessDay.substring(0, 2);
          let busmonth = this.businessDates[i].businessDay.substring(3, 5);
          let busyear = this.businessDates[i].businessDay.substring(6, 10);
          let busvdate = new Date(busmonth + "-" + busday + "-" + busyear);
          // busvdate.setMinutes(1);
          if(vdate.toDateString() === busvdate.toDateString()){
            this.showDatePicker = false;
            break;
          }else{
            this.showDatePicker = true;
          }
        }
      }
      // else{
      //   this.showDatePicker = false;
      // }
    }else{
      this.showDatePicker = true;
    }
  }

  fetchBusinessDays() {
    this.isLoadingCompelete = false;
    // if (this.fileType && this.fileFormat) {
    const params = {
      transactionType: 'SARIE',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.payrollService.getBusinessDaysList(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res && res.dataValue && res.dataValue.businessDaysList) {
          this.businessDates = res.dataValue.businessDaysList;
          if (this.businessDates) {
            this.businessDates.forEach((element: any) => {
              const time = moment(element.businessDay, 'DD/MM/YYYY').set({
                hour: 0,
                minute: 0,
                second: 0,
              });

              this.validDates.push(time.valueOf());
            });
            const sortedAscDate = this.validDates.sort(
              (objA: any, objB: any) => objA - objB
            );

            this.cutOffTime = parseInt(this.cutOffTime);
            let validateTime = 1400;

            if (this.effectiveDate == '0' && this.cutOffTime < validateTime) {
              this.startDate = new Date(sortedAscDate[0]);
            } else if (
              this.effectiveDate == '0' &&
              this.cutOffTime > validateTime
            ) {
              this.startDate = new Date(sortedAscDate[1]);
            } else if (this.effectiveDate >= '1') {
              this.startDate = new Date(sortedAscDate[this.effectiveDate]);
            }
            this.valueDateValidation();
          }
        }
      },
      (err) => {
        this.isLoadingCompelete = true;
      }
    );
    // }
  }

  getAccountDetails(element: any) {
    this.isLoadingCompelete = false;
    const params = {
      REQ_ACCOUNT_NUMBER: element?.debit_acc_no ? element.debit_acc_no : '',
      CIF_NO: element?.cif_no ? element.cif_no : '',
      REQ_COUNTRY_CODE: element?.currency ? element.currency : '',
      UNIT_ID: this.rootScopeData.userInfo.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.myTaskService.fetchAccountDetails(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.DATA.ACC_DETAILS) {
          this.selectedElementData.accountDetails = res.DATA.ACC_DETAILS;
          let convtd_amount = '';
          if (res.DATA.ACC_DETAILS.res_AvailableBalance && res.DATA.ACC_DETAILS.res_Acc_CCY_Cd) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(res.DATA.ACC_DETAILS.res_AvailableBalance.trim(), res.DATA.ACC_DETAILS.res_Acc_CCY_Cd);
            res.DATA.ACC_DETAILS.res_AvailableBalance = convtd_amount;
          }
          this.fetchFileDetails();
          this.showDebitData = true;
          this.debitDataObj = {
            title: 'LBL_FROM',
            data: [
              {
                res_Acc_No: this.selectedElementData.accountDetails.res_Acc_No
                  ? this.selectedElementData.accountDetails.res_Acc_No
                  : '--',
                res_Account_Name: this.selectedElementData.accountDetails
                  .res_Account_Name
                  ? this.selectedElementData.accountDetails.res_Account_Name
                  : '--',
                res_Acc_Status_Desc: this.selectedElementData.accountDetails
                  .res_Acc_Status_Desc
                  ? this.selectedElementData.accountDetails.res_Acc_Status_Desc
                  : '--',
                res_AvailableBalance: this.selectedElementData.accountDetails
                  .res_AvailableBalance
                  ? this.selectedElementData.accountDetails.res_AvailableBalance
                  : '--',
                res_Acc_CCY_Cd: this.selectedElementData.accountDetails.res_Acc_CCY_Cd
                  ? this.selectedElementData.accountDetails.res_Acc_CCY_Cd
                  : '--',
              },
            ],
            fieldDetails: [
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'res_Acc_No',
              },
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'res_Account_Name',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'res_Account_Name',
              },
              {
                dispKey: 'LBL_STATUS',
                dataKey: 'res_Acc_Status_Desc',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: 'res_AvailableBalance',
                dataKeySupport: 'res_Acc_CCY_Cd',
              },
            ],
          };
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  getSadadDetails() {
    this.isLoadingCompelete = false;
    this.commonService
      .sadadDetailsAPICall(this.rootScopeData.myTaskSADADSummaryObject.ref_NO)
      .subscribe(
        (res: any) => {
          this.isLoadingCompelete = true;
          this.payrollDetails = res.data;
          this.sadadBillerDetails = res.data.selectedBillers;
          this.paymentCCY = res.data.paymentCcy;
        },
        (error: any) => {
          this.isLoadingCompelete = true;
        }
      );
  }

  fetchFileDetails() {
    const params = {
      REFERENCE_NUM: this.selectedElementData?.d_ref_no
        ? this.selectedElementData.d_ref_no
        : '',
      subProductName: this.selectedElementData?.subprod_code
        ? this.selectedElementData.subprod_code
        : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    const fileDetails = this.payrollService.getFileDetails(params).subscribe(
      (res: any) => {
        if (res.data) {
          this.fileDetails = res.data;
          this.getRecordSummaryData(this.sortOptions);
          this.fetchDuplicateFileDetails();
          this.isSubmitEnabled = false;
          // if(this.fileDetails.odFileAmount)
          // {
          //   const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
          //   const uploadAmount = Number(unformattedAmountPipeFilter.transform(this.fileDetails.odFileAmount, "SAR"));
          //   const debitAmount = Number(unformattedAmountPipeFilter.transform(this.selectedElementData.accountDetails.res_AvailableBalance,"SAR"));
          //   if(uploadAmount < debitAmount){
          //     this.balanceValidation = false;
          //     this.isSubmitEnabled = false;
          //   }else{
          //     this.balanceValidation = true;
          //     this.isSubmitEnabled = true;
          //   }
          // }
        }
      },
      (error: any) => {}
    );
    this.subscriptions.push(fileDetails);
  }

  onClickSubmit() {
    if(this.showDatePicker && this.toDate){
      this.selectedElementData.value_date = this.toDate;
    }else if(!this.showDatePicker){

    }
    else{
      this.showDateErrorMessage = true;
      return;
    }
    let params = {
      refNumber: this.selectedElementData.d_ref_no,
      productCode: 'PAYMNT',
      subProductCode: this.selectedElementData.subprod_code,
      action: 'ACCEPT',
      versionNumber: this.selectedElementData.input_ver_no,
      hostCode: '',
      functionCode: this.selectedElementData.function_code,
      countryCode: this.selectedElementData.country_code,
      unitId: this.selectedElementData.unit_id,
      cifNo: this.selectedElementData.cif_no,
      valueDate: this.selectedElementData.value_date,
    };
    this.isLoadingCompelete = false;
    this.myTaskService.payrollAuthorizeApiCall(params).subscribe(
      (response) => {
        this.isLoadingCompelete = true;
        if (response.dataValue.STATUS === 'Success') {
          this.refNum=response.dataValue.SELECTED_RECORDS
          this.constructReceiptData(response.dataValue.SELECTED_RECORDS, response.dataValue);
          this.receiptForm = true;
        }
      },
      (error) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  constructReceiptData(refNumber: any, data:any) {
    let message1 : any;
    let message2 :any;
    let rejectReasonFromAPi : any;
    let journalId :any;
    this.rejectMsg = false;
    let showAuth : boolean = false;
    if(data.TXN_STATUS=== "AH"){
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED";
      journalId = data.JOURNAL_ID
    }else if(data.TXN_STATUS=== "RH"){
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_REJECTED";
      this.rejectMsg = true;
      rejectReasonFromAPi = data.OD_REJECT_REASON;
    }else if(data.TXN_STATUS=== "IO"){
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED_AND_SENT_FOR_ADDITIONAL_APPROVAL";
      showAuth = true;
    }else if(data.TXN_STATUS=== "AO"){
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_SUBMITTED_AND_ITS_SENT_TO_BANK";
    }else{
      message1 = "LBL_CONFIRMATION";
      message2 = "LBL_COMMON_YOUR_REQUEST_IS_APPROVED";
    }
    
    this.receiptData = {
      // msg1: 'LBL_CONFIRMATION',
      // msg2: 'LBL_AUTH_PAYROLL_MSG',
      "msg1":message1,
      "msg2":message2,
      "journalId":journalId ? journalId : "",
      "rejectReason": rejectReasonFromAPi ? rejectReasonFromAPi : "",
      referenceNumber: refNumber,
      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.selectedElementData,
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData?.userInfo?.loginID
                ? this.rootScopeData.userInfo.loginID
                : '--',
            },
            {
              dispKey: 'LBL_ACC_NUMBER',
              dataKey: this.selectedElementData?.accountDetails?.res_Acc_No
                ? this.selectedElementData.accountDetails.res_Acc_No
                : '--',
            },
            {
              dispKey: ' ',
              dataKey: ' ',
            },
          ],
        },
        {
          title: 'LBL_FILE_DETAILS',
          isTable: 'false',
          data: this.selectedElementData,
          fieldDetails: [
            {
              dispKey: 'LBL_DEPO_TYPE',
              dataKey: this.selectedElementData?.upload_type
                ? this.selectedElementData.upload_type
                : '--',
            },
            {
              dispKey: 'LBL_FORMAT',
              dataKey: this.selectedElementData?.fileFormat
                ? this.selectedElementData.fileFormat
                : '--',
            },
            {
              dispKey: 'LBL_UPLOAD_FILE',
              dataKey: this.selectedElementData?.file_name
                ? this.selectedElementData.file_name
                : '--',
            },
            {
              dispKey: 'LBL_TOTAL_AMOUNT',
              dataKey: `${
                this.selectedElementData?.file_amount
                  ? this.selectedElementData.file_amount
                  : '--'
              } ${
                this.selectedElementData?.file_amount
                  ? this.selectedElementData?.currency
                  : ''
              }`,
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
      "pageheading": this.translateService.instant("LBL_AUTHORIZE_PAYROLL_FILE_UPLOAD_RECEIPT"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_AUTH_PAYROLL_MSG"),
      "keyValues": [
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Account Name",
          "subValue": this.rootScopeData?.userInfo?.loginID
          ? this.rootScopeData.userInfo.loginID
          : '--'
        },
        {
          "subHead": "Account Number",
          "subValue": this.selectedElementData?.accountDetails?.res_Acc_No
          ? this.selectedElementData.accountDetails.res_Acc_No
          : '--'
        },
        {
          "subHead": "File Details",
          "subValue": ""
        },
        {
          "subHead": "Type",
          "subValue": this.selectedElementData?.upload_type
          ? this.selectedElementData.upload_type
          : '--'
        },
        {
          "subHead": "Format",
          "subValue": this.selectedElementData?.fileFormat
          ? this.selectedElementData.fileFormat
          : '--'
        },
        {
          "subHead": "Upload File",
          "subValue": this.selectedElementData?.file_name
          ? this.selectedElementData.file_name
          : '--'
        },
        {
          "subHead": "Total Amount",
          "subValue": `${
            this.selectedElementData?.file_amount
              ? this.selectedElementData.file_amount
              : '--'
          } ${
            this.selectedElementData?.file_amount
              ? this.selectedElementData?.currency
              : ''
          }`
        }
      ],
      "pagecall":"sadadbulkauth",
      "refNo":refNumber
    }
  }

  onBackArrowClick() {
    this.location.back();
  }

  initiateAnotherRequest() {
    this.route.navigate(['/mytask/payment/single-payments']);
  }

  getRecordSummaryData(data?: any) {
    const params = {
      subPdt: this.selectedElementData?.subprod_code
        ? this.selectedElementData?.subprod_code
        : '',
      sortColumn: data?.sortColumn,
      sortOrder: data?.sortOrder,
      fromRow: data?.fromRow,
      toRow: data?.toRow,
      pageName:'Inquiry',
      refNo: this.selectedElementData.d_ref_no
        ? this.selectedElementData.d_ref_no
        : '',
    };
    this.isLoadingCompelete = false;
    this.payrollService.getTransactionList(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data) {
          this.sortOptions = res.headerValue;
          this.showRecSumm = true;
          this.recordSummaryObject = {
            data: res.data, 
            displayDetails: [
              {
                displayLabel: 'LBL_TRANSACTION_REF',
                displayKey: 'txnId',
              },
              {
                displayLabel: 'LBL_CREDIT_ACCOUNT',
                displayKey: 'beneAccNo',
              },
              // {
              //   displayLabel: 'LBL_DEBIT_ACCOUNT',
              //   displayKey: 'accNo',
              // },
              {
                displayLabel: 'LBL_TYPE',
                displayKey: 'payType',
              },
              {
                displayLabel: 'LBL_AMOUNT',
                displayKey: 'payAmt',
                type: 'amount',
                supportValue: 'ccy',
              },
              // {
              //   displayLabel: 'LBL_RJCT_RSN',
              //   displayKey: 'rejectReason',
              // },
              {
                displayLabel: 'LBL_UTI',
                displayKey: 'utiReference',
              },
              {
                displayLabel: 'LBL_CHILD_REFERENCE',
                displayKey: 'childReference',
              },
              {
                displayLabel: 'LBL_DATE',
                displayKey: 'valueDate',
                type: 'date',
              },
              {
                displayLabel: 'LBL_STATUS',
                displayKey: 'status',
              },
            ],
          };
        }
      },
      (error: any) => {
        this.showRecSumm = true;
        this.isLoadingCompelete = true;
      }
    );
  }

  getClickedData() {
    this.selectedElementData = this.myTaskService.getSelectedElementDetails();

    this.workFlowHistoryParams = {
      refNum: this.uploadFileDetails?.d_ref_no
        ? this.uploadFileDetails.d_ref_no
        : '',
      productCode: this.uploadFileDetails?.product_code
        ? this.uploadFileDetails.product_code
        : '',
      subProductCode: this.uploadFileDetails?.subprod_code
        ? this.uploadFileDetails.subprod_code
        : '',
      functionCode: this.uploadFileDetails?.function_code
        ? this.uploadFileDetails.function_code
        : '',
    };
  }

  onSortColumn(event: any) {
    this.getRecordSummaryData(event);
  }
  downloadPdf(values:any)
  { 
    let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_PAYROLL_FILE_UPLOAD_RECEIPT"), x:80, y:35},
    { type:'setFontSize', size:10},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setFontSize', size:10},
    { type: 'setFillColor', val1:128, val2:128, val3:128},
    { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
    { type:'setTextColor', val1:255, val2:255, val3:255},
    { type:'setFontSize', size:10},
    { type: 'heading', value:'File Upload Details', y:55},
    { type:'setFontSize', size:9},
    { type:'setTextColor', val1:0, val2:0, val3:0}, 
    { type: 'heading', value:this.translateService.instant('LBL_FROM'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_ACTION_BY'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_ACC_NUMBER'), y:85},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_FILE_DETAILS'), y:95},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_DEPO_TYPE'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_FORMAT'), y:115},
    { type: 'heading', value:this.translateService.instant('LBL_UPLOAD_FILE'), y:125},
    { type: 'heading', value:this.translateService.instant('LBL_TOTAL_AMOUNT'), y:135},
    { type: 'text', value:  this.rootScopeData?.userInfo?.loginID ? this.rootScopeData.userInfo.loginID : '--', y:75},
    { type: 'text', value:  this.selectedElementData?.accountDetails?.res_Acc_No
    ? this.selectedElementData.accountDetails.res_Acc_No
    : '--', y:85},
    { type: 'text', value: this.selectedElementData?.upload_type ? this.selectedElementData.upload_type : '--', y:105},
    { type: 'text', value: this.selectedElementData?.fileFormat ? this.selectedElementData.fileFormat : '--', y:115},
    { type: 'text', value: this.selectedElementData?.file_name ? this.selectedElementData.file_name : '--', y:125},
    { type: 'text', value:  `${
      this.selectedElementData?.file_amount
        ? this.selectedElementData.file_amount
        : '--'
    } ${
      this.selectedElementData?.file_amount
        ? this.selectedElementData?.currency
        : ''
    }`, y:135},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:145},
    { type: 'text', value: this.refNum ? this.refNum : '', y:145},
    { type: 'heading', value:this.translateService.instant('LBL_AUTH_PAYROLL_MSG'), y:155},
    
  ]


  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'AuthorizePayrollFileUpload.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'AuthorizePayrollFileUpload.pdf'}
   )
  }
  //   this.pdfData.push(
  //     { type: 'save', value:'AuthorizePayrollFileUpload.pdf'}
  //  )

 this.downloadAsPdf.downloadpdf(this.pdfData);

}

onSortColumnDup(details: any){
  this.fromRow = details.fromRow;
  this.toRow = details.toRow;
  this.fetchDuplicateFileDetails();
}

fetchDuplicateFileDetails() {
  let data: any = {
    functionCode: this.selectedElementData.function_code,
    fromAccountId:
      this.selectedElementData.fileFormat === 'csv'
        ? this.selectedElementData.debit_acc_no
        : '',
    fileType: this.selectedElementData.fileFormat,
    totalAmount: this.selectedElementData.file_amount,
    totalRecords: this.selectedElementData.no_of_trans,
    noOfDays: 30,
    subProductCode: this.selectedElementData.subprod_code,
    txnRefNo: this.selectedElementData.d_ref_no,
    fromRow: this.fromRow,
    toRow: this.toRow,
    pageName:'checkDuFileMyTask'
  };
  this.isLoadingCompelete = false;
  this.dupDetailsList = data;

  this.payrollService.getDuplicateFileApi(data).subscribe(
    (res: any) => {
      this.isLoadingCompelete = true;
      if (res.data?.records) {
        let dataList: any = [];
        this.totalrecords = res.headerValue.totalCount;
        res.data?.records.forEach((element: any) => {
          let data: PeriodicElementDuplicate = {
            transactionId: element.transactionId,
            requester: '-',
            accNo: element.fromAccountId,
            valueDate: element.valueDate,
            row: element.fileSeqNo,
            amount: element.totalAmount,
            subType: element.fileType,
            orderDate: element.orderDate,
            reject: '-',
          };
          dataList.push(data);
        });
        this.duplicateRecordList = dataList;
      }
    },
    (error: any) => {
      this.isLoadingCompelete = true;
    }
  );
}

getDate(event:any){
  this.toDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  this.toDateValue = event
}
cancel(){
  this.route.navigate(['/mytask/payment/single-payments'])
}
}
