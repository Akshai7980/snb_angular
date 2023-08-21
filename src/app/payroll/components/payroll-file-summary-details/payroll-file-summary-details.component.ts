import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PeriodicElementDuplicate } from 'src/app/common-components/components/duplicate-records/duplicate-records.component';
import { PayrollService } from '../../services/payroll.service';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';

@Component({
  selector: 'app-payroll-file-summary-details',
  templateUrl: './payroll-file-summary-details.component.html',
  styleUrls: ['./payroll-file-summary-details.component.scss'],
})
export class PayrollFileSummaryDetailsComponent implements OnInit {
  debitDataObj: any;
  showNext: boolean = true;
  isLoadingCompelete: boolean = true;
  dropDownArrow: boolean = true;

  @Output() getClickEmit = new EventEmitter<boolean>();
  @Output() getAuthEmit = new EventEmitter<any>();
  @Output() getDateValueEmitted = new EventEmitter<any>();
  errorCode: string = '';
  duplicateRecordList: any = [];
  authDetails: any;
  uploadFileDetails: any = {};
  fetchedFileDetails: any = {};
  showRecSumm: boolean = false;
  moduleId: string = 'PAYROLTXNS';
  dupModuleId: string = 'PAYDUPFLE';
  dupSortOptions: any = {
    sortColumn: 'transactionId',
    sortOrder: 'desc',
    fromRow: 1,
    toRow: 5,
  };
  sortOptions: any = {
    sortColumn: 'beneAccNo',
    sortOrder: 'desc',
    fromRow: 1,
    toRow: 5,
  };
  fileDetailsEmitted: any;
  recordSummaryObject: any = {};
  showProceed: boolean = false;
  stopExecute: boolean = false;
  textAccnum = '';
  showProceedBtnAmountValidation: boolean = false;
  dupDetailsList: any;
  fromRow: any;
  toRow: any;
  totalrecords: any;
  pageName: any;
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.uploadFileDetails = this.payrollService.getUploadFileDetails();
    this.pageName = 'Initiate';
  }

  getDatas(event: any, type: string) {
    switch (type) {
      case 'authorization':
        this.authDetails = event;
        this.getAuthEmit.emit(this.authDetails);
    }
  }

  onFileDetailsEmit(event: any) {
    this.fileDetailsEmitted = event;
    this.getDateValueEmitted.emit(event)
    this.uploadFileDetails.fileDetails = this.fileDetailsEmitted;
    //debugger
    if (this.fileDetailsEmitted?.fileStatusCd === 'PNRFV') {
      this.getRecordSummaryData(this.sortOptions);
      this.showProceed = true;
    }
    if (
      this.fileDetailsEmitted?.fileStatusCd === 'PNRFV' &&
      this.fileDetailsEmitted?.duplicateFlag === 'Y'
    ) {
      this.fetchDuplicateFileDetails();
    }
    // if (!this.stopExecute) this.getRecordSummaryData(this.sortOptions);
    // this.stopExecute = true;
  }

  getRecordSummaryData(data: any) {
    const params = {
      refNo: this.uploadFileDetails?.fileDetails?.odDRefNo
        ? this.uploadFileDetails?.fileDetails?.odDRefNo
        : '',
      subPdt:
        (this.uploadFileDetails?.fileType?.subPdtCode === 'SALPAY'
          ? 'SALPAY'
          : '') ||
        (this.uploadFileDetails?.fileType?.subPdtCode === 'WPSUP'
          ? 'WPSUP'
          : '') ||
        (this.uploadFileDetails?.fileType?.subPdtCode === 'BULKPAY'
          ? 'BULKPAY'
          : ''),

      functionCode:
        (this.uploadFileDetails?.fileType?.subPdtCode === 'SALPAY' ||
        this.uploadFileDetails?.fileType?.subPdtCode === 'BULKPAY'
          ? 'BULKUP'
          : '') ||
        (this.uploadFileDetails?.fileType?.subPdtCode === 'WPSUP'
          ? 'WPSINI'
          : ''),
      sortColumn: this.sortOptions?.sortColumn
        ? this.sortOptions.sortColumn
        : '',
      sortOrder: this.sortOptions?.sortOrder ? this.sortOptions.sortOrder : '',
      fromRow: this.sortOptions?.fromRow ? this.sortOptions.fromRow : '',
      toRow: this.sortOptions?.toRow ? this.sortOptions.toRow : '',
      pageName: this.pageName ? this.pageName : '',
    };
    this.isLoadingCompelete = false;

    this.payrollService.getTransactionList(params).subscribe(
      (res: any) => {
        this.showRecSumm = true;

        this.isLoadingCompelete = true;
        if (res.data) {
          // this.textAccnum = res.data[0].accNo;
          this.sortOptions = res.headerValue;
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
        this.isLoadingCompelete = true;
        this.showRecSumm = true;
      }
    );
  }

  onSortColumn(event: any) {
    this.getRecordSummaryData(event);
  }

  onDupSortColumn(event: any) {
    this.fetchDuplicateFileDetails();
  }

  fetchDuplicateFileDetails() {
    let accountNumber = '';
    if (this.uploadFileDetails.format.type === 'csv') {
      accountNumber = this.uploadFileDetails?.fromAccount?.OD_ACC_NO;
    } else if (this.uploadFileDetails.format.type === 'txt') {
      accountNumber = this.uploadFileDetails?.fileDetails?.accNo;
    }
    let data: any = {
      functionCode: 'BULKUP',
      fromAccountId: accountNumber ? accountNumber : '',
      fileType: this.uploadFileDetails?.format?.type
        ? this.uploadFileDetails?.format?.type
        : '',
      totalAmount: this.fileDetailsEmitted?.odFileAmount
        ? this.fileDetailsEmitted?.odFileAmount
        : '',
      totalRecords: this.fileDetailsEmitted?.totalCount
        ? this.fileDetailsEmitted?.totalCount
        : '',
      noOfDays: 30,
      subProductCode: this.uploadFileDetails?.fileType?.subPdtCode
        ? this.uploadFileDetails?.fileType?.subPdtCode
        : '',
      txnRefNo: this.uploadFileDetails?.proceedRes?.REFERENCE_NUM
        ? this.uploadFileDetails?.proceedRes?.REFERENCE_NUM
        : '',
      fromRow: this.fromRow ? this.fromRow : '',
      toRow: this.toRow ? this.toRow : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
    };
    this.dupDetailsList = data;
    this.isLoadingCompelete = false;

    this.payrollService.getDuplicateFileApi(data).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data?.records) {
          let dataList: any = [];
          //debugger
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
          this.dupSortOptions = res.headerValue;
          this.duplicateRecordList = dataList;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  onSortColumnDup(details: any) {
    this.fromRow = details.fromRow;
    this.toRow = details.toRow;
    this.fetchDuplicateFileDetails();
  }

  toCancel() {
    this.showNext = false;
    this.getClickEmit.emit(this.showNext);
  }

  onProceed() {
    this.showNext = true;
    this.getClickEmit.emit(this.showNext);
  }

  onAccountClick() {
    this.getClickEmit.emit();
  }

  showProceedBalanceValidation(event: boolean) {
    this.showProceedBtnAmountValidation = event;
  }
}
