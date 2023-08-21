import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';
import {
  totalRecordsPerRequest,
  pageOptions,
} from 'src/app/utility/paginator-config';
@Component({
  selector: 'app-pos-finance',
  templateUrl: './pos-finance.component.html',
  styleUrls: ['./pos-finance.component.scss'],
})
export class PosFinanceComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  noRecordFlag: boolean = false;
  isLoadingComplete: boolean = false;

  posFinanceListDataSource: any = {};
  posFinanceList: any = [];

  currentColumn: string = 'transactionId';
  sortDirection: string = 'desc';
  fromRow: any;
  toRow: any;
  totalRecords: any;
  dataSourceLength: any;
  crNo: any;
  requestId: any;
  fromDate: any;
  toDate: any;
  fromAmount: any;
  toAmount: any;
  displayedColumns: string[] = [
    'refNo',
    
    'crNo',
    'requestId',
    'accNo',
    'financeAmt',
    'action',
  ];
  noRecordFoundObject = {
    msg: 'LBL_NO_RECORDS_FOUND',
    showMsg: 'true',
  };
  detail: boolean = false;
  reject: boolean = false;
  authorize: boolean = false;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  filterflag: any;
  filterConstraint: any;
  filterField: any;

  constructor(private router: Router, private myTaskService: MyTaskService) {
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.getPosFinanceList();
    this.rootScopeData.paymentActiveTabName = 'posFinance';
    this.rootScopeData.advSearchCurrentPage = 'myTaskPosFinance';
  }

  ngAfterViewInit(): void {
    this.posFinanceListDataSource.paginator = this.commonPagination.paginator;
  }

  getPosFinanceList() {
    this.isLoadingComplete = false;
    const params = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortDirection,
      fromRowNo: this.fromRow,
      toRowNo: this.toRow,
      filterField: this.filterField,
      filterConstraint: this.filterConstraint,
      CrNumber: this.crNo,
      fromAmt: this.fromAmount,
      toAmt: this.toAmount,
      fromDate: this.fromDate,
      toDate: this.toDate,
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      filterFlag: this.filterflag,
    };

    this.myTaskService.getPosFinanceList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        this.posFinanceList = res.data;
        this.posFinanceListDataSource = new MatTableDataSource(
          this.posFinanceList
        );
        this.totalRecords = res.headerValue.totalCount;
        this.dataSourceLength = this.posFinanceList.length;
        this.posFinanceListDataSource.paginator =
          this.commonPagination.paginator;
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }

  advancedSearchApply(event: any) {
    this.crNo = event.crNo;
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.fromAmount = event.fromAmount;
    this.toAmount = event.toAmount;
    this.filterflag = 'Y';
    this.filterConstraint = 'contains';
    this.filterField = event.reqId;
    this.getPosFinanceList();
  }

  triggerSearchFilter(event: any) {
    const columnsToSearch = [
      { name: 'refNo', fieldType: 'string' },
      { name: 'crNo', fieldType: 'string' },
      { name: 'requestId', fieldType: 'string' },
      { name: 'accNo', fieldType: 'string' },
      { name: 'financeAmt', fieldType: 'amount1' },
    ];
    const tableData = showFilteredRecords(
      this.posFinanceList,
      columnsToSearch,
      event.target.value
    );
    this.posFinanceListDataSource = new MatTableDataSource(tableData);
    this.posFinanceListDataSource.paginator = this.commonPagination.paginator;
  }

  refreshCreditCardList() {
    this.getPosFinanceList();
  }

  sortColumn(column: any) {
    this.currentColumn = column;
    if (this.sortDirection === '') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = '';
    }
    this.getPosFinanceList();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getPosFinanceList();
  }

  showDetails(row: any) {
    this.detail = true;
    this.reject = false;
    this.authorize = false;
    this.detailApi(row);
  }

  detailApi(row: any) {
    const param = {
      refNo: row.refNo,
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };

    this.myTaskService.getPoSFinanceDetail(param).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        this.rootScopeData.posFinanceRequestMytaskSummaryDetails = {
          row: row,
          res: res.data,
        };

        if (this.detail === true)
          this.router.navigate(['/mytask/posFinanceSummary']);
        if (this.reject === true)
          this.router.navigate(['/mytask/posFinanceReject']);
        if (this.authorize === true)
          this.router.navigate(['/mytask/posFinanceAuthorize']);
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }

  onClickAuthorize(event: any, element: any): void {
    this.detail = false;
    this.reject = false;
    this.authorize = true;
    this.detailApi(element);

    event.stopImmediatePropagation();
  }

  onClickReject(event: any, element: any): void {
    this.detail = false;
    this.reject = true;
    this.authorize = false;
    this.detailApi(element);

    event.stopImmediatePropagation();
  }
}
