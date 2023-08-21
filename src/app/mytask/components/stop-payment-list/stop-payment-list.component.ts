import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-stop-payment-list',
  templateUrl: './stop-payment-list.component.html',
  styleUrls: ['./stop-payment-list.component.scss'],
})
export class StopPaymentListComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  noRecordFlag: boolean = false;
  isLoadingComplete: boolean = true;
  currentColumn: string = 'makerDate';
  filterArray: any = [];
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_TRSFR_FND',
    btnLabel: 'Apply Now',
    btnLink: '/dashboard',
    showBtn: 'false',
    showMsg: 'true',
    showIcon: 'true',
  };
  displayColumns: string[] = [
    'refNo',
    'uploadType',
    'format',
    'status',
    'totalAmount',
    'date',
    'action',
  ];

  paymentsList :any = [];
  paymentListDataSource: any;
  totalPaymentRecords = 10;
  totalPaymentListDataSource: number = 0;

  responseHeader: any;
  sortDirection: string = 'desc';
  fromRow: any = '1';
  toRow: any = totalRecordsPerRequest;
  isRefreshFlag:boolean = false;
  refreshClickedFlag: boolean = false;

  constructor(
    private readonly myTaskService: MyTaskService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.rootScopeData.advSearchCurrentPage = 'stopPaymentSummary';
    this.rootScopeData.activeTabName = 'stopPayment';
    this.getStopPaymentsList();
  }

  getStopPaymentsList(): void {
    this.isLoadingComplete = false;
    this.rootScopeData.benUploadBeneficiaryCount = 0;
    this.myTaskService
      .getStopPaymentSubmittedRecords({
        sortColumn: this.currentColumn,
        sortOrder: this.sortDirection,
        fromRow: this.fromRow,
        toRow: this.toRow,
        unitId: this.rootScopeData.userInfo.UNIT_ID,
        filterArray: this.filterArray,
        filterFlag: 'Y',
      })
      .subscribe(
        (transfers: any) => {
          this.isLoadingComplete = true;
          if (transfers.data && transfers.data.length) {
           //this.paymentsList = transfers.data;
           if(this.isRefreshFlag === false){
            this.paymentsList = this.paymentsList.concat(transfers.data);
          }else{
            this.paymentsList = transfers.data;
            this.isRefreshFlag = false;
          }
            this.refreshClickedFlag = false;
            this.totalPaymentRecords = transfers.headerValue.totalCount;
            this.rootScopeData.benUploadBeneficiaryCount =
              transfers.headerValue.totalCount;
            this.responseHeader = transfers.headerValue;
            this.paymentListDataSource = new MatTableDataSource(
              this.paymentsList
            );
            this.paymentListDataSource.paginator =
              this.commonPagination.paginator;
            this.noRecordFlag = false;
          } else {
            this.noRecordFlag = true;
          }
        },
        () => {
          this.isLoadingComplete = true;
          this.noRecordFlag = true;
        }
      );
  }

  showStopPaymentDetails(selectedPayment: any, route: string): void {
    this.isLoadingComplete = false;
    this.myTaskService
      .getStopPaymentDetails({
        referenceNo: selectedPayment.referenceNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID,
      })
      .subscribe(
        (details: any) => {
          this.isLoadingComplete = true;
          if (details.data) {
            this.rootScopeData.selectedInquiryForStopPayment = {
              ...details.data,
              status: selectedPayment.status,
            };
            this.rootScopeData.selectedStopPaymentType =
              selectedPayment.level === 'file' ? 'file' : 'record';
            this.router.navigate([route]);
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  approveStopPayment(event: any, selectedPayment: any): void {
    event.stopImmediatePropagation();
    this.showStopPaymentDetails(
      selectedPayment,
      'mytask/authorize-stop-payment'
    );
  }

  rejectStopPayment(event: any, selectedPayment: any): void {
    event.stopImmediatePropagation();
    this.showStopPaymentDetails(selectedPayment, 'mytask/reject-stop-payment');
  }

  triggerSearchFilter(searchValue: any): void {
    let columnsToSearch = [
      { name: 'referenceNo', fieldType: 'string' },
      { name: 'type', fieldType: 'string' },
      { name: 'format', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'totalAmt', fieldType: 'string' },
      { name: 'makerDate', fieldType: 'date' },
    ];
    let tableData = showFilteredRecords(
      this.paymentsList,
      columnsToSearch,
      searchValue.target.value
    );
    this.paymentListDataSource = new MatTableDataSource(tableData);
    this.paymentListDataSource.paginator = this.commonPagination.paginator;
  }

  refreshPayments(): void {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.paymentsList = [];
    this.commonPagination.paginator.pageSize = 5;
    //this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.firstPage();
    this.sortDirection = '';
    this.refreshClickedFlag = true;
    this.getStopPaymentsList();
  }

  paginationChangeClick(paginationDetails: any): void {
    this.fromRow = paginationDetails.fromRow;
    this.toRow = paginationDetails.toRow;
    this.getStopPaymentsList();
  }

  sortColumn(column: string): void {
    this.currentColumn = column;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getStopPaymentsList();
  }

  advancedSearchApply(event: any): void {
    const advancedSearchFromDate = event.fromDate;
    const advancedSearchFromTo = event.toDate;
    const advancedSearchAmount = event.fromAmount;
    const advancedSearchTo = event.toAmount;
    const advancedSearchType = event.type;
    this.sortDirection = event.sortOrder;
    const advancedSearchPeriod = event.period;

    this.filterArray = [];

    let passingObj1 = {
      filterField: 'paymentAmt',
      filterConstraint: 'amt',
      filterValue: '',
      fromAmt: advancedSearchAmount ? advancedSearchAmount : '',
      toAmt: advancedSearchTo ? advancedSearchTo : '',
      fromDate: '',
      toDate: '',
    };

    this.filterArray.push(passingObj1);

    if (advancedSearchType == 'Date') {
      passingObj1 = {
        filterField: 'valueDate',
        filterConstraint: 'date',
        filterValue: '',
        fromAmt: '',
        toAmt: '',
        fromDate: advancedSearchFromDate,
        toDate: advancedSearchFromTo,
      };

      this.filterArray.push(passingObj1);
    } else {
      passingObj1 = {
        filterField: 'period',
        filterConstraint: 'contains',
        filterValue: advancedSearchPeriod,
        fromAmt: '',
        toAmt: '',
        fromDate: '',
        toDate: '',
      };

      this.filterArray.push(passingObj1);
    }
    this.getStopPaymentsList();
  }
}
