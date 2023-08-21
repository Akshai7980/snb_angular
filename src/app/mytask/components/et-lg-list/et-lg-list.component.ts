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
  selector: 'app-et-lg-list',
  templateUrl: './et-lg-list.component.html',
  styleUrls: ['./et-lg-list.component.scss'],
})
export class EtLgListComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  noRecordFlag: boolean = false;
  isLoadingComplete: boolean = true;
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: 'Apply Now',
    btnLink: '/dashboard',
    showBtn: 'true',
    showMsg: 'true',
    showIcon: 'true',
  };

  lgList: any = [];
  lgListDataSource = new MatTableDataSource([]);
  displayedColumns = [
    'refNo',
    'accNo',
    'lgType',
    'date',
    'maker',
    'action',
  ];
  totalRecords: number = 0;
  dataSourceLength: number = 0;

  fromRow: number = 1;
  toRow: number = totalRecordsPerRequest;
  sortDirection: string = 'desc';
  currentColumn: string = 'refNo';
  isRefreshFlag: boolean = false;
  refreshClickedFlag: boolean = false;
  responseHeader: any = {};
  advanceSearchValues: any = {};
  filterArray: any = [];

  constructor(
    private readonly myTaskService: MyTaskService,
    private readonly router: Router
  ) {
    this.rootScopeData.activeTabName = 'eTrade';
  }

  ngOnInit(): void {
    this.getLgSummary();
  }

  getLgSummary(): void {
    this.isLoadingComplete = false;
    const params = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortDirection,
      fromRowNo: this.fromRow,
      toRowNo: this.toRow,
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      filterField: '',
      filterConstraint: 'contains',
      filterValue: this.filterArray[0]?.filterValue
        ? this.filterArray[0].filterValue
        : '',
    };
    this.myTaskService.getLgSummary(params).subscribe(
      (letters: any) => {
        this.isLoadingComplete = true;
        this.rootScopeData.selectedInquiryForStopPayment = {
          lgSummary: letters.data.length,
        };
        if (letters.data && letters.data.length) {
          if (this.isRefreshFlag === false) {
            this.lgList = this.lgList.concat(letters.data);
          } else {
            this.lgList = letters.data;
            this.isRefreshFlag = false;
          }
          this.refreshClickedFlag = false;
          this.totalRecords = letters.headerValue.totalCount;
          this.responseHeader = letters.headerValue;
          this.lgListDataSource = new MatTableDataSource(this.lgList);
          this.lgListDataSource.paginator = this.commonPagination.paginator;
          this.noRecordFlag = false;
        } else {
          this.noRecordFlag = true;
        }
      },
      () => {
        this.noRecordFlag = true;
        this.isLoadingComplete = true;
      }
    );
  }

  applyAdvanceSearch(searchValues: any) {
    this.advanceSearchValues = searchValues;

    this.filterArray = [];

    let passingObj1 = {
      filterField: '',
      filterConstraint: 'contains',
      filterValue: searchValues ? searchValues : '',
    };

    this.filterArray.push(passingObj1);
    this.getLgSummary();
  }

  triggerSearchFilter(searchValue: any) {
    let columnsToSearch = [
      { name: 'refNo', fieldType: 'string' },
      { name: 'accNo', fieldType: 'string' },
      { name: 'lgType', fieldType: 'string' },
      { name: 'valueDate', fieldType: 'date' },
      { name: 'maker', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.lgList,
      columnsToSearch,
      searchValue.target.value
    );
    this.lgListDataSource = new MatTableDataSource(tableData);
    this.lgListDataSource.paginator = this.commonPagination.paginator;
  }

  refreshLgList(): void {
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.isRefreshFlag = true;
    this.lgList = [];
    this.commonPagination.paginator.pageSize = 5;
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.firstPage();
    this.sortDirection = '';
    this.refreshClickedFlag = true;
    this.getLgSummary();
  }

  sortColumn(column: string): void {
    this.currentColumn = column;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getLgSummary();
  }

  paginationChangeClick(params: any): void {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getLgSummary();
  }

  routeToDetails(lg: any, route: string): void {
    this.isLoadingComplete = false;
    const params = {
      REFERENCE_NUMBER: lg?.refNo ? lg.refNo : '',
    };
    this.myTaskService.getLgDetails(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res && res.data) {
          this.rootScopeData.selectedInquiryForStopPayment = {
            lgDetails: res.data,
            letterOfGua: lg,
          };
          this.router.navigate([route]);
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  approveLg(event: any, lg: any): void {
    event.stopImmediatePropagation();
    this.routeToDetails(lg, 'mytask/authorizeLg');
  }

  rejectLg(event: any, lg: any): void {
    event.stopImmediatePropagation();
    this.routeToDetails(lg, 'mytask/rejectLg');
  }
}
