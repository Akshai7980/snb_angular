import {
  AfterViewChecked,
  ChangeDetectorRef,
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
  selector: 'app-pos-transaction',
  templateUrl: './pos-transaction.component.html',
  styleUrls: ['./pos-transaction.component.scss'],
})
export class PosTransactionComponent implements OnInit, AfterViewChecked {
  rootScopeData: RootScopeDeclare = RootScopeData;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  curerentSelection: any;
  dataSourceToPass: any;
  displayedColumns: string[] = [
    'transactionId',
    'AccNo',
    'requestType',
    'initiationDate',
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
  currentColumn: any = 'refNo';
  sortDirection: any = 'desc';

  @Output() dataSourceLengthValue = new EventEmitter();
  constructor(
    private readonly mytaskService: MyTaskService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly router: Router
  ) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.rootScopeData.paymentActiveTabName = 'PosTransaction';
    this.rootScopeData.activeTabName = 'posService';
    this.getMyTaskSummary();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  goToDetailsScreen(row: any) {
    this.rootScopeData.pendingActivitiesBulkUploadObject = row;
    this.router.navigate(['/mytask/posReview']);
  }

  getMyTaskSummary() {
    this.isLoadingCompelete = false;
    let params = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortDirection,
      fromRowNo: this.fromRow,
      toRowNo: this.toRow,
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      groupBy: '',
      filterFlag: 'Y',
      filterField: '',
      filterConstraint: '',
      filterValue: '',
      fromAmt: '',
      toAmt: '',
      fromDate: '',
      toDate: '',
    };

    this.mytaskService.getMytaskSummaryPos(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        this.rootScopeData.benUploadBeneficiaryCount = 0;
        if (res && res.data && res.data.length > 0) {
          this.dataSource = res.data;
          this.noRecordFlag = false;
          this.totalRecords = res.headerValue.totalCount;
          this.dataSourceLength = this.dataSource.length;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.rootScopeData.myTaskBulkUploadSummaryObject = this.dataSource;
          this.rootScopeData.benUploadBeneficiaryCount = this.dataSourceLength;
          this.rootScopeData.posServiceCount = this.dataSourceLength;
        } else {
          this.noRecordFlag = true;
          this.rootScopeData.benUploadBeneficiaryCount = 0;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
        this.rootScopeData.benUploadBeneficiaryCount = 0;
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
    this.getMyTaskSummary();
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'transactionId', fieldType: 'string' },
      { name: 'AccNo', fieldType: 'string' },
      { name: 'requestType', fieldType: 'string' },
      { name: 'initiationDate', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );

    if (tableData && tableData.length) {
      this.dataSourceToPass = new MatTableDataSource(tableData);
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
    } else {
      this.noRecordFlag = true;
    }
  }

  refreshSummary() {
    this.getMyTaskSummary();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getMyTaskSummary();
  }

  rejectScreen() {
    this.router.navigate(['/mytask/posReject']);
  }

  authorizeScreen() {
    this.router.navigate(['/mytask/posAuthorize']);
  }
}
