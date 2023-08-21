import {
  Component,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import {
  showFilteredRows,
  showFilteredRecords,
} from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
})
export class PayrollComponent implements OnInit {
  selectedGroup: string = '';
  currentColumn: string = 'd_ref_no';
  sortDirection: string = 'desc';
  fromRow: any;
  toRow: any;
  bulkSource: any = [];
  isLoadingCompelete: boolean = true;
  dataSource: any =[];
  showVar: boolean = false;
  @Output() toggleChildToParent = new EventEmitter<boolean>();
  @Output() getSelectedEmit = new EventEmitter<any>();
  rootScopeData: RootScopeDeclare = RootScopeData;
  totalCount: string = '';
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  responseHeader: any = {};
  noRecordFlag: boolean = true;
  noRecordFoundInfoObj = {};
  selectedElementData: any;
  isRefreshFlag:boolean = false;
  refreshClickedFlag: boolean = false;

  constructor(private router: Router, private myTaskService: MyTaskService) {
    this.rootScopeData.paymentActiveTabName = 'Payroll';
    this.rootScopeData.activeTabName = 'fileUpload';
    this.fromRow = 1;
    //this.toRow = totalRecordsPerRequest;
  }

  ngOnInit() {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'false',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.getBulkSummary();
  }

  triggerSearchFilter(event: any): void {
    showFilteredRows('serviceRequestDefaultCntr', event.target.value);

    const columnsToSearch = [
      { name: 'd_ref_no', fieldType: 'string' },
      { name: 'upload_type', fieldType: 'string' },
      { name: 'fileFormat', fieldType: 'string' },
      { name: 'file_amount', fieldType: 'number' },
      { name: 'feeAmount', fieldType: 'string' },
    ];

    const tableData = showFilteredRecords(
      this.bulkSource,
      columnsToSearch,
      event.target.value
    );

    this.dataSource = new MatTableDataSource(tableData);
    this.dataSource.paginator = this.commonPagination?.paginator;
  }

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.pageSize = 5;
    //this.totalRecords = this.totalRecords
    this.commonPagination.paginator.firstPage();
    this.sortDirection = '';
    this.refreshClickedFlag = true;
    this.getBulkSummary();
  }

  getBulkSummary() {
    this.isLoadingCompelete = false;
    const params = {
      groupBy: this.selectedGroup,
      sortColumn: this.currentColumn,
      sortDirection: this.sortDirection,
      fromRow: this.fromRow,
      toRow: this.toRow,
      unitId: this.rootScopeData.userInfo.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.rootScopeData.singleBeneficiaryCount = 0;
    this.myTaskService.myTaskBulkSummary(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.dataValue.length > 0) {
          this.noRecordFlag = false;
          //this.bulkSource = res.dataValue;
          if(this.isRefreshFlag === false){
            this.bulkSource = this.bulkSource.concat(res.dataValue);
          }else{
            this.bulkSource = res.dataValue;
            this.isRefreshFlag = false;
          }
          this.refreshClickedFlag = false;
          this.totalCount = res.headerValue.totalCount;
          this.rootScopeData.singleBeneficiaryCount =
            res.headerValue.totalCount;
          this.responseHeader = res.headerValue;
          this.dataSource = new MatTableDataSource(this.bulkSource);
          if (this.commonPagination)
            this.dataSource.paginator = this.commonPagination.paginator;
        } else {
          this.noRecordFlag = true;
        }
      },
      (err) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
      }
    );
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getBulkSummary();
  }

  toggleChild(element: any) {
    this.myTaskService.setSelectedElementDetails(element);
    this.router.navigate(['/mytask/authFileUpload']);
  }

  onApproveClick(event: any, element: any): void {
    event.stopImmediatePropagation();
    this.myTaskService.setSelectedElementDetails(element);
    this.router.navigate(['/mytask/authorizePayrollFileUpload']);
  }

  onRejectClick(event: any, element: any): void {
    event.stopImmediatePropagation();
    this.myTaskService.setSelectedElementDetails(element);
    this.router.navigate(['/mytask/rejectPayrollFileUpload']);
  }

  sortColumn(column: any) {
    if (!this.currentColumn || !this.sortDirection) return;
    this.currentColumn = column;
    this.sortDirection === 'desc'
      ? (this.sortDirection = 'asc')
      : (this.sortDirection = 'desc');
    this.getBulkSummary();
  }

  displayedColumns: string[] = [
    'd_ref_no',
    'upload_type',
    'lang_id',
    'status',
    'file_amount',
    'feeAmount',
    'action',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: any;
  symbol: string;
  fee: any;
}

const ELEMENT_DATA: PeriodicElement[] = [];
