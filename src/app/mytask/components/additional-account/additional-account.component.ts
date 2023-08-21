import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';

import {
  totalRecordsPerRequest,
  pageOptions,
} from 'src/app/utility/paginator-config';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';
@Component({
  selector: 'app-additional-account',
  templateUrl: './additional-account.component.html',
  styleUrls: ['./additional-account.component.scss'],
})
export class AdditionalAccountComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  curerentSelection: any;
  dataSourceToPass: any;
  displayedColumns: string[] = [
    'referenceNumber',
    'linkAccount',
    'currency',
    'reason',
    'date',
    'status',
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
  dataSource: any = [];
  selectedGroup: string = '';
  fromRow: any;
  toRow: any;
  filterArray: any = [];
  noRecordFlag: boolean = false;
  tablePageSize: any;
  totalRecords: any;
  isLoadingCompelete = true;
  currentColumn: any = 'transactionId';
  sortDirection: any = 'desc';
  isRefreshFlag: boolean = false;
  refreshClickedFlag = false;
  @Output() dataSourceLengthValue = new EventEmitter();
  constructor(private mytaskService: MyTaskService, private router: Router) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'additionalAccount';
    this.getMyTaskSummaryAdditionalAccount();
  }

  goToDetailsScreen(row: any) {
    this.rootScopeData.pendingActivitiesServiceRequestObject = row;
    this.router.navigate(['/mytask/additionalDetailsSummary']);
  }

  getMyTaskSummaryAdditionalAccount() {
    this.isLoadingCompelete = false;
    let params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
    };

    this.mytaskService.getMyTaskSummaryAdditionalAccount(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
        // this.dataSource = res.data;
        if (this.isRefreshFlag === false) {
          this.dataSource = this.dataSource.concat(res.data);
        } else {
          this.dataSource = res.data;
          this.isRefreshFlag = false;
        }
        this.refreshClickedFlag = false;
        // this.rootScopeData.myTaskBulkUploadSummaryObject = this.dataSource;
        if (this.dataSource && this.dataSource.length) {
          this.noRecordFlag = false;
          this.dataSourceLength = this.dataSource.length;
          // this.rootScopeData.benUploadBeneficiaryCount = this.dataSourceLength;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.totalRecords = res.headerValue.totalCount;
          this.rootScopeData.additionalAccountCount = this.totalRecords;
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
    this.getMyTaskSummaryAdditionalAccount();
  }
  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'linkAccount', fieldType: 'string' },
      { name: 'currency', fieldType: 'string' },
      { name: 'reason', fieldType: 'string' },
      { name: 'refNo', fieldType: 'string' },
      { name: 'valueDate', fieldType: 'date' },
      { name: 'statusDesc', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );

    if (tableData.length) {
      this.noRecordFlag = false;
      this.dataSourceToPass = new MatTableDataSource(tableData);
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
    } else {
      this.noRecordFlag = true;
    }
  }

  refreshSummary() {
    this.fromRow = 1;
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.pageSize = 5;
    this.commonPagination.paginator.firstPage();
    this.refreshClickedFlag = true;
    this.getMyTaskSummaryAdditionalAccount();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getMyTaskSummaryAdditionalAccount();
  }
  onRejectClick(event: any, row: any) {
    this.rootScopeData.pendingActivitiesServiceRequestObject = row;
    this.router.navigate(['/mytask/additionalAccRejectRequest']);
  }
  onApproveClick(event: any, row: any) {
    this.rootScopeData.pendingActivitiesServiceRequestObject = row;
    this.router.navigate(['/mytask/additionalAccAuthorizeRequest']);
  }
}
