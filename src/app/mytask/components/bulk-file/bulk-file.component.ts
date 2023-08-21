import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { dateFormat } from 'src/app/utility/common-utility';
import {
  totalRecordsPerRequest,
  pageOptions,
} from 'src/app/utility/paginator-config';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-bulk-file',
  templateUrl: './bulk-file.component.html',
  styleUrls: ['./bulk-file.component.scss'],
})
export class BulkFileComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  curerentSelection: any;
  dataSourceToPass: any;
  displayedColumns: string[] = [
    'transactionid',
    'filename',
    'initiateddate',
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
  currentColumn: any = 'beneReferenceNo';
  sortDirection: any = 'desc';
  isRefreshFlag:boolean = false;
  responseHeader:any;
  refreshClickedFlag: boolean = false;

  @Output() dataSourceLengthValue = new EventEmitter();
  constructor(private mytaskService: MyTaskService, private router: Router) {
    this.rootScopeData.advSearchCurrentPage = 'bulkPayment';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.getMyTaskSummary();

    this.rootScopeData.activeTabName = 'bulkfile';
  }

  goToDetailsScreen(row: any) {
    this.rootScopeData.pendingActivitiesBulkUploadObject = row;
    this.router.navigate(['/mytask/receiptBeneficiaryUpload']);
  }

  getMyTaskSummary() {
    this.isLoadingCompelete = false;
    let params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
    };

    this.mytaskService.getMytaskSummaryBenUpload(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
        this.rootScopeData.benUploadBeneficiaryCount = res.headerValue.TOTAL_COUNT;
        //this.dataSource = res.data;
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(res.data);
        }else{
          this.dataSource = res.data;
          this.isRefreshFlag = false;
        }
        this.rootScopeData.myTaskBulkUploadSummaryObject = this.dataSource;
        if (this.dataSource && this.dataSource.length) {
          this.noRecordFlag = false;
          this.refreshClickedFlag = false;
          this.dataSourceLength = this.dataSource.length;
          // this.rootScopeData.benUploadBeneficiaryCount = this.dataSourceLength;
          this.dataSourceToPass = new MatTableDataSource(
            this.rootScopeData.myTaskBulkUploadSummaryObject
          );
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.totalRecords = res.headerValue.TOTAL_COUNT;
        } else {
          this.noRecordFlag = true;
          this.rootScopeData.benUploadBeneficiaryCount = "";
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
      { name: 'beneReferenceNo', fieldType: 'string' },
      { name: 'beneFileName', fieldType: 'string' },
      { name: 'beneFileUploadDate', fieldType: 'date' },
      { name: 'beneFileStatus', fieldType: 'string' },
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

  advancedSearchApply(event: any) {
    let tableData;
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
    if (event.isdate === true) {
      tableData = this.dataSource.filter((el: any) => {
        var formatedDate = dateFormat(el);
        const data =
          el.beneFileStatus === event.status &&
          formatedDate >= event.dateFrom &&
          formatedDate <= event.dateTo;
        return data;
      });
    } else if (event.isdate === false) {
      let startDate: any;
      let endDate: any;
      let date = new Date();
      if (event.period === 'currentDay') {
        startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0
        );
        endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      }

      if (event.period === 'currentMonth') {
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      }
      if (event.period === 'previousDay') {
        startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - 1,
          0
        );
        endDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          -1
        );
      }
      if (event.period === 'previousMonth') {
        startDate = new Date(date.getFullYear(), date.getMonth() - 1);
        endDate = new Date(date.getFullYear(), date.getMonth(), 0);
      }
      if (event.period === 'last7Days') {
        startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - 7
        );
        endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      }
      if (event.period === 'last2Weeks') {
        startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - 14
        );
        endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      }
      if (event.period === 'last3Months') {
        startDate = new Date(
          date.getFullYear(),
          date.getMonth() - 3,
          date.getDate()
        );
        endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      }
      if (event.period === 'last6Months') {
        startDate = new Date(
          date.getFullYear(),
          date.getMonth() - 6,
          date.getDate()
        );
        endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      }

      tableData = this.dataSource.filter((el: any) => {
        var formatedDate = dateFormat(el);
        const data =
          el.beneFileStatus === event.status &&
          formatedDate >= startDate &&
          formatedDate <= endDate;
        return data;
      });
    }
    if (tableData && tableData.length) {
      this.dataSourceToPass = new MatTableDataSource(tableData);
      this.rootScopeData.benUploadBeneficiaryCount = this.dataSourceLength;
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
    } else {
      this.noRecordFlag = true;
    }
  }

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.pageSize = 5;
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.firstPage();
    this.sortDirection = '';
    this.refreshClickedFlag = true;
    this.getMyTaskSummary();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getMyTaskSummary();
  }
  authorizeBulkPage(event: any, row: any) {
    event.stopImmediatePropagation();
    this.rootScopeData.pendingActivitiesBulkUploadObject = row;
    this.router.navigate(['/mytask/authorizeBulkPayment']);
  }

  rejectBulkPage(event: any, row: any) {
    event.stopImmediatePropagation();
    this.rootScopeData.pendingActivitiesBulkUploadObject = row;
    this.router.navigate(['/mytask/rejectBulkPayment']);
  }
}
