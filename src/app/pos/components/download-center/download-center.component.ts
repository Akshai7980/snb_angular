import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AccountDetailsService } from 'src/app/accounts/services/account-details.service';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import {
  pageOptions,
  totalRecordsPerRequest,
} from 'src/app/utility/paginator-config';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  styleUrls: ['./download-center.component.scss'],
})
export class DownloadCenterComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  totalRecords: any;
  dataSourceToPass: any;
  dataSource: any;
  displayedColumns: string[] = [
    'reportName',
    'user',
    'requestDate',
    'status',
    'records',
    'action',
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
  downloadUrlBasePath: string = '';

  constructor(
    private accountService: AccountDetailsService,
    public posService: PosService
  ) {
    this.rootScopeData.activeTabName = 'downloadcenter';
    this.rootScopeData.filterTableId = 'otherRequestsInquiryTable';
    this.rootScopeData.accountsActiveModule = 'OTHERREQINQ';
    this.rootScopeData.advSearchCurrentPage = 'downloadCenterInquiryTable';

    this.currentColumn = 'submittedOn';
    this.sortDirection = 'desc';

    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_DOWNLOAD_CENTER',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'true',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.getOtherRequest();
    this.routeDetailScreen = '/accounts/chequedetailsLayout';
    this.rootScopeData.advSearchCurrentPage = 'posSeriveRequest';
  }
  getOtherRequest() {
    this.isLoadingCompelete = false;
    let params = {
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
      filterField: this.filterfield,
      filterConstraint: this.filterconstraint,
    };
    this.posService.getDownloadCenter(params).subscribe(
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
          this.dataSourceLength = this.dataSource.length;
          this.rootScopeData.posDownloadCenterCount =
            this.responseHeader.totalCount;

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

  selectedRecord(event: any, element: any) {
    this.rootScopeData.pendingActivitiesServiceRequestObject = element;
    event?.stopPropagation();
  }

  refreshSummary() {
    this.getOtherRequest();
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'reportName', fieldType: 'string' },
      { name: 'user', fieldType: 'string' },
      { name: 'merchantID', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'records', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator = this.commonPagination.paginator;
  }

  advancedSearchApply(event: any) {
    this.advSearchPeriod = 'date';
    this.advSearchFromDate = event.fromDate;
    this.advSearchFromDate = event.toDate;
    this.filterflag = 'Y';
    this.filterconstraint = 'date';
    this.filterfield = 'submittedOn';
    this.getOtherRequest();
  }

  downloadStatements(selectedrow: any) {
    document
      .getElementById('download_' + selectedrow.txnRefNo)
      ?.classList.add('showLoader');
    let fromToDate = selectedrow.statementPeriod;
    fromToDate = fromToDate.replaceAll(' ', '');
    let url =
      this.downloadUrlBasePath +
      '?moduleId=EXPORTSTMNT' +
      '&exportFormat=PDF&reqId=' +
      selectedrow.txnRefNo +
      '&filePath=' +
      selectedrow.zipPath +
      '&simulate=N&statementPeriod=' +
      fromToDate;

    this.accountService.exportDocument(url).subscribe(
      (response) => {
        document
          .getElementById('download_' + selectedrow.txnRefNo)
          ?.classList.remove('showLoader');
        if (response.status == 200) {
          window.open(
            url +
              '&_dinsess=' +
              this.rootScopeData.userInfo._cpReqToken +
              '&langId=' +
              this.rootScopeData.userInfo.mLanguage,
            '_self'
          );
        }
      },
      (error) => {
        document
          .getElementById('download_' + selectedrow.txnRefNo)
          ?.classList.remove('showLoader');
        if (error.status == 200) {
          window.open(
            url +
              '&_dinsess=' +
              this.rootScopeData.userInfo._cpReqToken +
              '&langId=' +
              this.rootScopeData.userInfo.mLanguage,
            '_self'
          );
        }
      }
    );
  }
}
