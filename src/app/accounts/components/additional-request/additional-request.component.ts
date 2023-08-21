import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import {
  totalRecordsPerRequest,
  pageOptions,
} from 'src/app/utility/paginator-config';
import { AccountDetailsService } from '../../services/account-details.service';
import { CommonInjectServiceService } from '../../services/common-inject-service.service';
import {
  showFilteredRecords,
  showFilteredRows,
} from 'src/app/utility/tableFilter';
@Component({
  selector: 'app-additional-request',
  templateUrl: './additional-request.component.html',
  styleUrls: ['./additional-request.component.scss'],
})
export class AdditionalRequestComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  curerentSelection: any;
  dataSourceToPass: any;
  displayedColumns: string[] = [
    'refNo',
    'linkAccount',
    'requestType',
    'status',
    'valueDate',
    'action',
  ];
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: 'Apply Now',
    btnLink: '/dashboard',
    showBtn: 'true',
    showMsg: 'true',
    showIcon: 'true',
  };
  dataSource: any;
  selectedGroup: string = '';
  fromRow: any;
  toRow: any;
  filterArray: any = [];
  noRecordFlag: boolean = false;
  tablePageSize: any;
  totalRecords: any;
  isLoadingCompelete = true;
  currentColumn: any;
  sortDirection: any;
  routeDetailScreen: any;

  @Output() dataSourceLengthValue = new EventEmitter();
  constructor(
    private accountService: AccountDetailsService,
    private router: Router
  ) {
    this.rootScopeData.activeTabName = 'additionalrequest';
    this.rootScopeData.accountsActiveModule = 'ADDACCDETAILS';
    this.currentColumn = 'refNo';
    this.sortDirection = 'desc';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.getAdditionalRequest();
  }

  getAdditionalRequest() {
    this.isLoadingCompelete = false;
    let params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
    };

    this.accountService.additionalAccountRequest(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        this.noRecordFlag = true;
        this.rootScopeData.additionalRequestCount = res.headerValue.totalCount;
        this.dataSource = res.data;
        // this.rootScopeData.myTaskBulkUploadSummaryObject = this.dataSource;
        if (this.dataSource && this.dataSource.length) {
          this.noRecordFlag = false;
          this.dataSourceLength = this.dataSource.length;
          // this.rootScopeData.benUploadBeneficiaryCount = this.dataSourceLength;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.totalRecords = res.headerValue.totalCount;
        } else {
          this.noRecordFlag = true;

          //this.rootScopeData.benUploadBeneficiaryCount = 0;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
        // this.rootScopeData.benUploadBeneficiaryCount = 0;
      }
    );
  }
  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === '') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = '';
    }
    this.getAdditionalRequest();
  }
  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'refNo', fieldType: 'string' },
      { name: 'linkAccount', fieldType: 'string' },
      { name: 'requestType', fieldType: 'string' },
      { name: 'statusDesc', fieldType: 'string' },
      { name: 'valueDate', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );

    if (tableData && tableData.length) {
      this.noRecordFlag = false;
      this.dataSourceToPass = new MatTableDataSource(tableData);
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
    } else {
      this.noRecordFlag = true;
    }
  }

  refreshSummary() {
    this.getAdditionalRequest();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getAdditionalRequest();
  }

  goToDetailsScreen(data: any) {
    this.rootScopeData.pendingActivitiesAdditionalRequestObject = data;
    this.router.navigate(['/accounts/additionalAccount']);
  }
  selectedRecord(event: any, element: any) {
    this.rootScopeData.pendingActivitiesAdditionalRequestObject = element;
    this.routeDetailScreen = '/accounts/additionalAccount';

    event?.stopPropagation();
  }
}
