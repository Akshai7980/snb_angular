import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-instant-transfer-management',
  templateUrl: './instant-transfer-management.component.html',
  styleUrls: ['./instant-transfer-management.component.scss']
})
export class InstantTransferManagementComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  rootScopeData: RootScopeDeclare = RootScopeData
  noRecordFoundInfoObj: any;
  dataSourceToPass: any;
  displayedColumns: string[] = ['accNumber', 'refNumber', 'mobileNo','email','nationalId','action'];
  dataSource: any=[];
  tablePageSize: any;
  fromRow: any;
  toRow: any; 
  totalRecords: any;
  norecordflag: boolean = false;
  isLoadingCompelete = true;
  sortDirection: string = '';
  currentColumn: string = '';
  responseHeader: any;
  enablePropertty:boolean =true;
  isRefreshFlag: boolean = false;
  refreshClickedFlag: boolean = false;

  constructor(private mytaskService: MyTaskService, private router: Router, private commonService: CommonService) { 
    this.currentColumn ='REF_NO';
    this.sortDirection ='desc';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.rootScopeData.paymentActiveTabName = 'instantTransferManagement';
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_RECORDS_FOUND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getInstantTransferManagement();
  }

  getInstantTransferManagement() {
    let params = {
      fromRow : this.fromRow,
      toRow : this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection
    };
    this.isLoadingCompelete = false;
    this.mytaskService.instantTransferManagementSummaryAPICall(params).subscribe((res: any) => {
      this.isLoadingCompelete = true
      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
      if(res.status === 500){
        this.norecordflag = true;
        this.enablePropertty = false;
      }
      else{
        this.norecordflag = false;
        this.enablePropertty = true;
        // this.dataSource = res.data;
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(res.data);
        }else{
          this.dataSource = res.data;
          this.isRefreshFlag = false;
        }
        this.refreshClickedFlag = false;
        this.dataSourceLength = this.dataSource.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource)
        this.dataSourceToPass.paginator = this.commonPagination.paginator;
        this.totalRecords = res.headerValue.totalCount;
        if (this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0) {
          this.norecordflag = true;
          this.enablePropertty = false;  
        }
        else{
          this.enablePropertty=true;
          this.norecordflag = false;
        }
      }     
     
    }, (error: any) => {
      this.isLoadingCompelete = true;
      this.enablePropertty=false;
      this.norecordflag = true;
    })
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [ 
      {"name":"ACC_NO", "fieldType":"string"},
      {"name":"REF_NO", "fieldType":"string"}, 
      {"name":"PROXY_1_VALUE", "fieldType":"string"},
      {"name":"PROXY_2_VALUE", "fieldType":"string"},
      {"name":"PROXY_3_VALUE", "fieldType":"string"}
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows('serviceRequestDefaultCntr', event.target.value);
  }
  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.pageSize = 5;
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.firstPage();
    this.refreshClickedFlag = true;
    this.getInstantTransferManagement();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getInstantTransferManagement();
  }
  goToDetailsScreen(row: any) {
    if (row.MODES === "R") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/instantTransferRegDetailsLayout']);
    }
    if (row.MODES === "D") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/instantTransferDeRegDetailsLayout']);
    }
    if (row.MODES === "Q") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/qtlDetailsLayout']);
    }
  }

  onApproveClick(event: any, row: any) {
    event.stopImmediatePropagation();
    if (row.MODES === "R") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/authorizeIPSRegistration']);
    }
    if (row.MODES === "D") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/authorizeIPSDeRegistration']);
    }
    if (row.MODES === "Q") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/authorizeQtl']);
    }
  }

  onRejectClick(event: any, row: any) {
    event.stopImmediatePropagation();
    if (row.MODES === "R") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/rejectIPSRegistration']);
    }
    if (row.MODES === "D") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/rejectIPSDeRegistration']);
    }
    if (row.MODES === "Q") {
      this.rootScopeData.pendingActivitiesInstantTransferSummaryObject = row;
      this.router.navigate(['/mytask/rejectQtl']);
    }

  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.fromRow = 1;
    this.isRefreshFlag = true;
    this.getInstantTransferManagement();
  }

}
