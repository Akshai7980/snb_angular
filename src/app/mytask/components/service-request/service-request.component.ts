import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss']
})
export class ServiceRequestComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  rootScopeData: RootScopeDeclare = RootScopeData
  noRecordFoundInfoObj: any;
  selectedGroup: string = '';
  dataSourceToPass: any;
  displayedColumns: string[] = ['referenceNumber', 'requestType', 'submittedOn', 'makerId', 'action'];
  dataSource: any = [];
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
    this.currentColumn ='maker_DATE';
    this.sortDirection ='desc';
  }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'deposit';
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_REQUEST_FOUND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getServiceRequestDetails();
  }

  getServiceRequestDetails() {
    let params = {
      fromRow: this.fromRow,
      toRow: this.toRow,
      groupBy: this.selectedGroup,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection
    };
    this.isLoadingCompelete = false;
    this.mytaskService.serviceRequestSummaryCall(params).subscribe((res: any) => {
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
        // this.dataSource = res.dataValue;
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(res.dataValue);
        }else{
          this.dataSource = res.dataValue;
          this.isRefreshFlag = false;
        }
        this.refreshClickedFlag = false;
        this.dataSourceLength = this.dataSource.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource)
        this.dataSourceToPass.paginator = this.commonPagination.paginator;
        this.totalRecords = res.headerValue.totalCount;
        this.rootScopeData.serviceRequestDepositCount = this.totalRecords;
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
      {"name":"ref_NO", "fieldType":"string"},
      {"name":"function_ID_DISPVAL", "fieldType":"string"}, 
      {"name":"maker_DATE", "fieldType":"date"},
      {"name":"maker_NAME", "fieldType":"string"}
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
    this.getServiceRequestDetails();
  }

  paginationChangeClick(params: any) {
    // console.log("SPEVENT====>",params)
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getServiceRequestDetails();
  }
  goToDetailsScreen(row: any) {
    if (row.subprcode === "CHEQUES") {
      this.rootScopeData.pendingActivitiesServiceRequestObject = row;
      this.router.navigate(['/mytask/detailsLayout']);
    }
    // if (row.subprcode === 'add_Acc') {
    //   this.rootScopeData.pendingActivitiesServiceRequestObject = row;
    //   this.router.navigate(['/mytask/additionalDetailsSummary']);
    // }
  }

  onApproveClick(event: any, row: any) {
    event.stopImmediatePropagation();
    this.isLoadingCompelete = false;
    if (row.subprcode === "CHEQUES") {
      this.commonService.chequeBookDetailsApiCall(row.ref_NO).subscribe((res: any) => {
        this.isLoadingCompelete = true
        let chequeBookDetailsData = res.dataValue.DETAILS;
        Object.assign(chequeBookDetailsData, { hostTxnCode: row.host_TXN_CODE });
        this.rootScopeData.chequeBookDetailsObject = chequeBookDetailsData;
        this.router.navigate(['/mytask/authorizeChequeBookRequest']);
      }, (error: any) => {
        this.isLoadingCompelete = true;
      })
    }
    // if (row.subprcode === 'add_Acc') {
    //   this.rootScopeData.pendingActivitiesServiceRequestObject = row;
    //   this.router.navigate(['/mytask/additionalAccAuthorizeRequest']);
    // }
  }

  onRejectClick(event: any, row: any) {
    event.stopImmediatePropagation();
    this.isLoadingCompelete = false;
    if (row.subprcode === "CHEQUES") {
      this.commonService.chequeBookDetailsApiCall(row.ref_NO).subscribe((res: any) => {
        this.isLoadingCompelete = true
        let chequeBookDetailsData = res.dataValue.DETAILS;
        Object.assign(chequeBookDetailsData, { hostTxnCode: row.host_TXN_CODE });
        this.rootScopeData.chequeBookDetailsObject = chequeBookDetailsData;
        this.router.navigate(['/mytask/rejectChequeBookRequest']);
      }, (error: any) => {
        this.isLoadingCompelete = true;
      })
    }
    // if (row.subprcode === 'add_Acc') {
    //   this.rootScopeData.pendingActivitiesServiceRequestObject = row;
    //   this.router.navigate(['/mytask/additionalAccRejectRequest']);
    // }
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getServiceRequestDetails();
  }

 

}
