import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';

@Component({
  selector: 'app-file-transfer',
  templateUrl: './file-transfer.component.html',
  styleUrls: ['./file-transfer.component.scss'],
})
export class FileTransferComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  // curerentSelection: any;
  dataSourceToPass: any;
  displayedColumns: string[] = [
    'referenceNumber',
    'fileName',
    'requestType',
    'submittedOn',
    'makerName',
    'action',
  ];
  dataSource: any = [];
  noRecordFoundInfoObj: any = {};
  selectedGroup: string = '';
  // tablePageSize: any;
  fromRow: number = 1;
  toRow: number = totalRecordsPerRequest;
  // filterArray: any = [];
  totalRecords: string = '';
  norecordflag: boolean = false;
  isLoadingCompelete: boolean = true;
  sortDirection: string = '';
  responseHeader: any = {};
  currentColumn: string = '';

  constructor(private mytaskService: MyTaskService) {
    this.rootScopeData.activeTabName = 'filepayments';
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_TRSFR_FND',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'false',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.currentColumn = 'maker_date';
    this.sortDirection = 'desc';
    this.getPaymentDetails();
  }

  getPaymentDetails() {
    this.isLoadingCompelete = false;

    let params = {
      groupBy: this.selectedGroup ? this.selectedGroup : '',
      sortcolumn: this.currentColumn ? this.currentColumn : '',
      sortDirection: this.sortDirection ? this.sortDirection : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      fromRow: this.fromRow ? this.fromRow : '',
      toRow: this.toRow ? this.toRow : '',
    };

    this.mytaskService.filePaymentsSummary(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        if (res && res.headerValue) {
          this.responseHeader = res.headerValue;
          this.totalRecords = res.headerValue?.totalCount;
        }

        if (res && res.data && res.data.length > 0) {
          this.dataSource = res.data;
          this.dataSourceLength = this.dataSource?.length;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
        } else {
          this.norecordflag = !this.norecordflag;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'd_ref_no', fieldType: 'string' },
      { name: 'file_name', fieldType: 'string' },
      { name: 'upload_type', fieldType: 'string' },
      { name: 'maker_date', fieldType: 'date' },
      { name: 'maker_name', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator = this.commonPagination.paginator;
  }

  refreshSummary() {
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.commonPagination.paginator.pageSize = 5;
    this.commonPagination.paginator.firstPage();
    this.sortDirection = '';
    this.totalRecords = this.totalRecords;
    this.getPaymentDetails();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getPaymentDetails();
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getPaymentDetails();
  }
}
