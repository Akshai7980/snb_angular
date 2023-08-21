import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import {
  totalRecordsPerRequest,
  pageOptions,
} from 'src/app/utility/paginator-config';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  totalRecords: any;
  dataSourceToPass: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSource: any;
  displayedColumns: string[] = [
    'accNumber',
    'terminalID',
    'merchantID',
    'serviceType',
    'mobile',
    'email',
  ];
  noRecordFoundInfoObj: any;
  norecordflag: boolean = false;
  isLoadingCompelete = true;
  sortDirection: string = '';
  currentColumn: string = '';
  enablePropertty: boolean = true;
  routeDetailScreen: any;
  @Output() childEvent: EventEmitter<any> = new EventEmitter();
  responseHeader: any;
  advSearchPeriod = '';
  advSearchSearchWithin = '';
  advSearchSortOrder = '';
  advSearchFromDate = '';
  advSearchToDate = '';
  filterflag: string = '';
  filterconstraint: string = '';
  filterfield: string = '';
  maxdate = new Date();

  constructor(private posService: PosService, private router: Router) {
    this.rootScopeData.activeTabName = 'otherrequest';
    this.rootScopeData.filterTableId = 'otherRequestsInquiryTable';
    this.rootScopeData.accountsActiveModule = 'OTHERREQINQ';

    this.currentColumn = 'accNo';
    this.sortDirection = 'desc';

    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_OTHER_REQUEST',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'true',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.getOtherRequest();
    this.rootScopeData.advSearchCurrentPage = 'posSeriveRequest';
    this.routeDetailScreen = '/accounts/chequedetailsLayout';
  }
  getOtherRequest() {
    this.isLoadingCompelete = false;
    const params = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortDirection,
      userNo: this.rootScopeData.userInfo?.userNo
        ? this.rootScopeData.userInfo.userNo
        : '',
      gcif: this.rootScopeData.userInfo?.sCustNo
        ? this.rootScopeData.userInfo.sCustNo
        : '',
      fromRowNo: this.fromRow,
      toRowNo: this.toRow,
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      groupBy: '',

      period: this.advSearchPeriod,
      fromDate: this.advSearchFromDate,
      toDate: this.advSearchToDate,
      filterflag: this.filterflag,
      filterfield: this.filterfield,
      filterconstraint: this.filterconstraint,
    };
    this.posService.getServiceRequest(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        this.dataSource = res.data;

        this.dataSourceLength = this.dataSource.length;

        if (res.headerValue !== undefined) {
          this.responseHeader = res.headerValue;
        }
        if (
          this.dataSource === null ||
          this.dataSource === '' ||
          this.dataSource === undefined ||
          this.dataSource.length === 0
        ) {
          this.norecordflag = !this.norecordflag;
        }
        if (res.data) {
          this.totalRecords = this.responseHeader.totalCount;

          this.rootScopeData.posServiceCount = this.responseHeader.totalCount;

          this.dataSourceLength = this.dataSource.length;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);

          this.dataSourceToPass.paginator = this.commonPagination.paginator;
        }
      },
      (error) => {
        this.isLoadingCompelete = true;
        this.norecordflag = true;
      }
    );
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getOtherRequest();
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getOtherRequest();
  }

  goToDetailsScreen(data: any) {
    if (data.subProductCode === 'CHEQUES') {
      this.rootScopeData.pendingActivitiesServiceRequestObject = data;
      this.router.navigate(['/accounts/chequedetailsLayout']);
    }
  }

  selectedRecord(event: any, element: any) {
    this.rootScopeData.pendingActivitiesServiceRequestObject = element;
    event?.stopPropagation();
  }

  refreshSummary() {
    this.getOtherRequest();
  }

  triggerSearchFilter(event: any) {
    const columnsToSearch = [
      { name: 'accNumber', fieldType: 'string' },
      { name: 'terminalID', fieldType: 'string' },
      { name: 'merchantID', fieldType: 'string' },
      { name: 'serviceType', fieldType: 'string' },
      { name: 'mobile', fieldType: 'string' },
      { name: 'email', fieldType: 'string' },
    ];
    const tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator = this.commonPagination.paginator;
  }

  advancedSearchApply(event: any) {
    this.dataSource.sort((a: any, b: any) => {
      if (event.order === 'desc') {
        if (a.beneFileUploadDate > b.beneFileUploadDate) {
          return -1;
        }
        if (a.beneFileUploadDate < b.beneFileUploadDate) {
          return 1;
        }
      }
      if (event.order === 'asc') {
        if (a.beneFileUploadDate < b.beneFileUploadDate) {
          return -1;
        }
        if (a.beneFileUploadDate > b.beneFileUploadDate) {
          return 1;
        }
      }
      return 0;
    });
    this.advSearchPeriod = 'date';
    this.advSearchFromDate = event.fromDate;
    this.advSearchFromDate = event.toDate;
    this.filterflag = 'Y';
    this.filterconstraint = 'date';
    this.filterfield = 'accNo';
    this.getOtherRequest();
  }
}
