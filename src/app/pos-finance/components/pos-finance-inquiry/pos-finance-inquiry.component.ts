import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import {
  showFilteredRecords,
  showFilteredRows,
} from 'src/app/utility/tableFilter';
import { PosFinanceService } from '../../services/pos-finance.service';

@Component({
  selector: 'app-pos-finance-inquiry',
  templateUrl: './pos-finance-inquiry.component.html',
  styleUrls: ['./pos-finance-inquiry.component.scss'],
})
export class PosFinanceInquiryComponent implements OnInit, AfterViewInit {
  printSection: string = 'posFinanceInquiryPrintSection';
  logo = 'assets/images/snb-logo-print.png';

  contextMenuList = [];

  moreActions: any = [
    {
      display_key: 'LBL_VIEWDETAILS',
      item_id: 'POS_FINANCE_SUMMARY',
    },
  ];

  displayedColumns: string[] = [
    'refNo',
    'accNo',
    'crNo',
    'requestId',
    'financeAmt',
    'statusDesc',
    'action',
  ];

  posFinanceInquiryList: any = [];
  dataSourceLength: any;
  posFinanceInquiryListDataSource: any = {};
  totalRecords: string = '';
  isLoadingComplete: boolean = true;
  noRecordFlag: boolean = false;
  noRecordFoundInfoObj: any = {};
  fromRow: number;
  toRow: number;
  currentColumn: string = 'refNo';
  sortDirection: string = 'desc';

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  rootScopeData: RootScopeDeclare = RootScopeData;
  filterConstraint: any;
  status: any;
  filterField: any;
  fromDate: any;
  toDate: any;
  filterFlag: any;

  constructor(
    private posFinanceService: PosFinanceService,
    private router: Router
  ) {
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.rootScopeData.advSearchCurrentPage = 'posFinanceInquiryList';
  }

  ngOnInit(): void {
    this.rootScopeData.filterTableId = 'posFinanceInquirytable';
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.getPosFinanceInquiryList();
    this.getPoSFinanceInquiryCiflkp();
  }

  ngAfterViewInit(): void {
    this.posFinanceInquiryListDataSource.paginator =
      this.commonPagination.paginator;
  }

  getPosFinanceInquiryList() {
    this.isLoadingComplete = false;
    const params = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortDirection,
      fromRowNo: this.fromRow,
      toRowNo: this.toRow,
      filterField: this.filterField,
      filterConstraint: this.filterConstraint,
      status: this.status,
      fromDate: this.fromDate,
      toDate: this.toDate,
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      filterFlag: this.filterFlag,
    };
    this.posFinanceService
      .getPosFinanceInquiryList(params)
      .subscribe((res: any) => {
        this.isLoadingComplete = true;
        this.totalRecords = res.headerValue.totalCount;
        this.posFinanceInquiryList = res.data;
        this.posFinanceInquiryListDataSource = new MatTableDataSource(res.data);
        this.posFinanceInquiryListDataSource.paginator =
          this.commonPagination.paginator;
        this.dataSourceLength = res.data.length;
      });
  }

  getPoSFinanceInquiryCiflkp() {
    this.posFinanceService
      .getPoSFinanceInquiryCiflkp()
      .subscribe((res: any) => {
        this.contextMenuList = res?.dataValue.map((val: any) => {
          return {
            displayName: val.cifName,
            CIF_NO: val.cifNo,
            value: val.cifNo,
          };
        });
      });
  }

  triggerDropdownFilter(event: any) {
    showFilteredRows(this.rootScopeData.filterTableId, event);
  }
  triggerSearchFilter(event: any) {
    const columnsToSearch = [
      { name: 'refNo', fieldType: 'string' },
      { name: 'accNo', fieldType: 'string' },
      { name: 'crNo', fieldType: 'string' },
      { name: 'requestId', fieldType: 'string' },
      { name: 'financeAmt', fieldType: 'amount1' },
      { name: 'statusDesc', fieldType: 'string' },
    ];
    const tableData = showFilteredRecords(
      this.posFinanceInquiryList,
      columnsToSearch,
      event.target.value
    );
    this.posFinanceInquiryListDataSource = new MatTableDataSource(tableData);
    this.posFinanceInquiryListDataSource.paginator =
      this.commonPagination.paginator;
  }

  advancedSearchApply(event: any) {
    this.filterField = event.reqId;
    this.filterConstraint = 'contains';
    this.status = event.status;
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.filterFlag = 'Y';
    this.getPosFinanceInquiryList();
  }

  refreshPosFinanceInquiry() {
    this.getPosFinanceInquiryList();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getPosFinanceInquiryList();
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getPosFinanceInquiryList();
  }

  selectedRecord(event: any, element: any) {
    this.rootScopeData.posFinanceSummaryRecord = element;
    event?.stopPropagation();
  }

  onClickRecord(row: any) {
    this.rootScopeData.posFinanceSummaryRecord = row;
    this.router.navigate(['/posFinance/posFinanceSummary']);
  }
}
