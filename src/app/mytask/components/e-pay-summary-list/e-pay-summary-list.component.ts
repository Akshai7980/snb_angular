import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-e-pay-summary-list',
  templateUrl: './e-pay-summary-list.component.html',
  styleUrls: ['./e-pay-summary-list.component.scss'],
})
export class EPaySummaryListComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  isLoadingComplete: boolean = true;
  noRecordFlag: boolean = false;

  moduleId: string = 'MYTASKEPYSUMY';

  ePaySummaryListDataSource: any;
  currentColumn: string = 'txnNo';
  sortDirection: string = 'desc';
  dataSourceLength: any;
  totalRecords: any;
  ePaySummaryList: any = [];
  filterField: any;
  filterConstraint: any;
  fromDate: any;
  toDate: any;
  fromRow: any;
  toRow: any;
  filterFlag: any = 'Y';
  filterList: any;
  filterArray: any;
  requestTypes: any;

  multiClaimCount: number = 0;
  othersCount: number = 0;

  displayedColumns: string[] = [
    'txnNo',
    'mobileNo',
    'reqType',
    'date',
    'status',
    'action',
  ];

  noRecordFoundObject = {
    msg: 'LBL_NO_RECORDS_FOUND',
    showMsg: 'true',
  };

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  constructor(private myTaskService: MyTaskService, private router: Router) {}

  ngOnInit(): void {
    this.rootScopeData.paymentActiveTabName = 'ePay';
    this.rootScopeData.activeTabName = 'ePay';
    this.rootScopeData.advSearchCurrentPage = 'ePaySummaryList';
    this.getePaySummaryList();
  }

  changeTab(tab: string) {
    this.moduleId = tab;
    this.getePaySummaryList();
  }

  getePaySummaryList() {
    this.isLoadingComplete = false;
    const params = {
      moduleId: this.moduleId,
      sortColumn: this.currentColumn,
      sortOrder: this.sortDirection,
      userNo: this.rootScopeData.userInfo?.userNo
        ? this.rootScopeData.userInfo?.userNo
        : '',
      fromRowNo: this.fromRow,
      toRowNo: this.toRow,
      filterList: this.filterArray,
      unitId: this.rootScopeData.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo?.UNIT_ID
        : '',
      groupBy: '',
      filterFlag: this.filterFlag,
    };
    this.myTaskService.getePayMyTaskSummaryList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res && res.data && res.data.length) {
          this.ePaySummaryList = res.data;
          this.requestTypes = [];
          let requestTypesMap: any = {};
          this.ePaySummaryList.forEach((val: any) => {
            requestTypesMap[val.requestType] = val.requestType;
          });
          this.requestTypes = Object.keys(requestTypesMap);
          this.ePaySummaryListDataSource = new MatTableDataSource(
            this.ePaySummaryList
          );
          this.totalRecords = res.headerValue.totalCount;
          this.moduleId === 'MYTASKEPYUPDSUMY' ? this.multiClaimCount = this.totalRecords : this.othersCount = this.totalRecords;
          this.dataSourceLength = this.ePaySummaryList.length;
          this.ePaySummaryListDataSource.paginator =
            this.commonPagination.paginator;
        } else {
          this.noRecordFlag = true;
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  advancedSearchApply(event: any): void {
    this.filterArray = [];
    if (event.dateFrom && event.dateTo) {
      const fromDate = this.getDateFormat(event.dateFrom);
      const toDate = this.getDateFormat(event.dateTo);
      const passingObj = {
        filterField: 'epyDate',
        filterConstraint: 'date',
        filterValue: '',
        fromAmt: '',
        toAmt: '',
        fromDate: fromDate,
        toDate: toDate,
      };

      this.filterArray.push(passingObj);

      const passingObj1 = {
        filterField: 'requestType',
        filterConstraint: 'contains',
        filterValue: event.requestType,
      };

      this.filterArray.push(passingObj1);
    } else {
      const passingObj2 = {
        filterField: 'period',
        filterConstraint: 'contains',
        filterValue: event.period,
      };

      this.filterArray.push(passingObj2);
    }
    this.getePaySummaryList();
  }

  getDateFormat(dateFormat: any) {
    const date =
      dateFormat.getDate() < 10
        ? '0' + dateFormat.getDate()
        : dateFormat.getDate();
    const month =
      dateFormat.getMonth() + 1 < 10
        ? '0' + (dateFormat.getMonth() + 1)
        : dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();
    const formatedDate = date + '/' + month + '/' + year;
    return formatedDate;
  }

  triggerSearchFilter(event: any): void {
    const columnsToSearch = [
      { name: 'refNo', fieldType: 'string' },
      { name: 'moblieNo', fieldType: 'string' },
      { name: 'reqType', fieldType: 'string' },
      { name: 'epyDate', fieldType: 'date' },
      { name: 'status', fieldType: 'string' },
    ];
    const tableData = showFilteredRecords(
      this.ePaySummaryList,
      columnsToSearch,
      event.target.value
    );
    this.ePaySummaryListDataSource = new MatTableDataSource(tableData);
    this.ePaySummaryListDataSource.paginator = this.commonPagination.paginator;
  }

  refreshCreditCardList(): void {
    this.getePaySummaryList();
  }

  onClickAuthorize(event: any, element: any) {
    event.stopImmediatePropagation();
    this.showDetails(element, '/mytask/ePayAuthorize');
  }

  onClickReject(event: any, element: any) {
    event.stopImmediatePropagation();
    this.showDetails(element, '/mytask/ePayReject');
  }

  showDetails(row: any, path: any) {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      refNo: row.refNo,
      moduleId: this.setModuleId(row),
    };
    this.myTaskService.getePayMyTaskDetails(params).subscribe(
      (details: any) => {
        this.isLoadingComplete = true;
        if (details && details.data) {
          this.rootScopeData.selectedEPay = {
            summary: row,
            details: details.data,
          };
          this.router.navigate([path]);
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  setModuleId(row: any): string {
    switch (row.subproductCode) {
      case 'APEPYSTMT':
        return 'APPEPYDET';
      case 'EPYMC':
        return 'EPYMCDET';
      case 'EPYMCR':
        return 'EPYMCRDET';
      case 'EPYMCD':
        return 'EPYMCDDET';
    }
    return '';
  }

  paginationChangeClick(event: any): void {
    this.fromRow = event.fromRow;
    this.toRow = event.toRow;
    this.getePaySummaryList();
  }

  sortColumn(column: any): void {
    if (!this.currentColumn || !this.sortDirection) return;
    this.currentColumn = column;
    this.sortDirection === 'desc'
      ? (this.sortDirection = 'asc')
      : (this.sortDirection = 'desc');
    this.toRow = Number(this.toRow - this.fromRow) + 1;
    this.fromRow = 1;
    this.getePaySummaryList();
  }
}
