import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from 'src/app/payroll/services/payroll.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Subscription } from 'rxjs';
import { PeriodicElementDuplicate } from 'src/app/common-components/components/duplicate-records/duplicate-records.component';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-authorized-file-upload',
  templateUrl: './authorized-file-upload.component.html',
  styleUrls: ['./authorized-file-upload.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthorizedFileUploadComponent implements OnInit {
  selectedElementData: any = {};
  rootScopeData: RootScopeDeclare = RootScopeData;
  fileDetails: any;
  fileApiAutoFetch: any;
  subscriptions: Subscription[] = [];
  showRecSumm: boolean = false;
  uploadFileDetails: any = {};
  transactionSummaryList: any = [];
  fileUploadedDetails: any;
  recordSummaryObject: any = {};
  sortOptions: any = {
    sortColumn: 'transactionRef',
    sortOrder: 'desc',
    fromRow: 1,
    toRow: 6,
  };
  moduleId: string = 'PAYROLTXNS';
  showDebitData: boolean = false;
  duplicateRecordList: any = [];
  debitDataObj: any;
  workFlowHistoryParams: any;
  isLoadingCompelete: boolean = true;
  balanceValidation: boolean = false;
  showAuthorizeBtn: boolean = true;
  dupDetailsList: any;
  fromRow: any;
  toRow: any;
  totalrecords: any;
  pageName:any;
  todayDate = new Date();
  showDatePicker: boolean = false;
  toDate: any;
  toDateValue: any;
  showDateErrorMessage:boolean = false

  constructor(
    private router: Router,
    private myTaskService: MyTaskService,
    private payrollService: PayrollService,
    private datePipe : DatePipe
  ) {}

  backTOPayroll() {
    this.router.navigate(['/mytask/Payroll/file-upload']);
  }
  authorizeFileUpload() {
    this.router.navigate(['/mytask/authorizePayrollFileUpload']);
  }
  rejectFileUpload() {
    this.router.navigate(['/mytask/rejectPayrollFileUpload']);
  }

  ngOnInit(): void {
    this.uploadFileDetails = this.myTaskService.getSelectedElementDetails();
    this.getClickedData();
    // this.fetchDuplicateFileDetails();
    this.fileUploadedDetails = {
      fileName: '',
      moduleId: 'FILEDLD',
    };
    this.pageName='Inquiry';
  }

  getClickedData() {
    this.selectedElementData = this.myTaskService.getSelectedElementDetails();
    this.getAccountDetails();

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

  getAccountDetails() {
    this.isLoadingCompelete = false;
    const params = {
      REQ_ACCOUNT_NUMBER: this.selectedElementData?.debit_acc_no
        ? this.selectedElementData.debit_acc_no
        : '',
      CIF_NO: this.selectedElementData?.cif_no
        ? this.selectedElementData.cif_no
        : '',
      REQ_COUNTRY_CODE: this.selectedElementData?.currency
        ? this.selectedElementData.currency
        : '',
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
          if (
            this.selectedElementData.fileFormat === 'csv' ||
            this.selectedElementData.fileFormat === 'CSV'
          ) {
            this.showDebitData = true;
            this.debitDataObj = {
              title: 'LBL_FROM',
              data: [res.DATA.ACC_DETAILS],
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
          } else {
            this.showDebitData = false;
          }
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  onUploadDownload() {
    if (this.selectedElementData.file_name) {
      this.fileUploadedDetails = {
        fileName: this.selectedElementData?.file_name,
        moduleId: 'FILEDLD',
      };
    }
  }

  getRecordSummaryData(data?: any) {

    const params = {
      subPdt: this.uploadFileDetails?.subprod_code
        ? this.uploadFileDetails.subprod_code
        : '',
      sortColumn: data?.sortColumn,
      sortOrder: data?.sortOrder,
      fromRow: data?.fromRow,
      toRow: data?.toRow,
      pageName:'Inquiry',
      refNo: this.uploadFileDetails?.d_ref_no
        ? this.uploadFileDetails.d_ref_no
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

  onSortColumn(event: any) {
    this.getRecordSummaryData(event);
  }

  fetchFileDetails() {
    const params = {
      REFERENCE_NUM: this.uploadFileDetails?.d_ref_no
        ? this.uploadFileDetails.d_ref_no
        : '',
      subProductName: this.uploadFileDetails?.subprod_code
        ? this.uploadFileDetails.subprod_code
        : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    const fileDetails = this.payrollService.getFileDetails(params).subscribe(
      (res: any) => {
        if (res.data) {
          // if (res.data.fileStatusCd === 'PNRFV') {
            this.getRecordSummaryData(this.sortOptions);
            this.fetchDuplicateFileDetails();
          // }

          this.fileDetails = res.data;
          this.showAuthorizeBtn = false;
          // debugger
          // if(this.fileDetails.valueDate){
          //   // let data = this.datePipe.transform(this.fileDetails.valueDate, 'dd-MM-yyyy')
          //   // let vdate = new Date(this.fileDetails.valueDate).getDate();
          //   let day = this.fileDetails.valueDate.substring(0, 2);
          //   let month = this.fileDetails.valueDate.substring(3, 5);
          //   let year = this.fileDetails.valueDate.substring(6, 10);
          //   // return new Date(month + "/" + day + "/" + year);
          //   let vdate = new Date(month + "-" + day + "-" + year);

          //   if(vdate < this.todayDate){
          //     this.showDatePicker = true;
          //     // return true;
          //   }else{
          //     this.showDatePicker = false;
          //   }
          // }else{
          //   this.showDatePicker = true;
          // }
          // if(this.fileDetails.odFileAmount && this.selectedElementData.accountDetails && this.selectedElementData.accountDetails.res_AvailableBalance)
          // {
            // const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
            // const uploadAmount = Number(unformattedAmountPipeFilter.transform(this.fileDetails.odFileAmount, "SAR"));
            // const debitAmount = Number(unformattedAmountPipeFilter.transform(this.selectedElementData.accountDetails.res_AvailableBalance,"SAR"));
            // if(uploadAmount < debitAmount){
            //   this.balanceValidation = false;
            //   this.showAuthorizeBtn = false;
            //   // this.getShowProceedBalanceValidation.emit(this.balanceValidation)
            //   // this.getAuthorizationData();
            // }else{
            //   this.balanceValidation = true;
            //   this.showAuthorizeBtn = true;
            //   // this.getShowProceedBalanceValidation.emit(this.balanceValidation)
            // }
            
          // }
         
        }
      },
      (error: any) => {}
    );
    this.subscriptions.push(fileDetails);
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
        pageName :'checkDuFileMyTask'
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

  // getDate(event:any){
  //   debugger
  //   this.toDate = "" + event.getDate() + "/" + (event.getMonth() + 1) + "/" + event.getFullYear();
  //   this.toDateValue = event
  // }
}
