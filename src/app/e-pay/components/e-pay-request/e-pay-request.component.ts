import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { EpayServiceService } from '../../services/epay-service.service';
@Component({
  selector: 'app-e-pay-request',
  templateUrl: './e-pay-request.component.html',
  styleUrls: ['./e-pay-request.component.scss']
})
export class EPayRequestComponent implements OnInit {
  @ViewChild(MatSort) sort !: MatSort;
  dataSourceToPass!: any;
  dataSource: any;
  norecordflag: boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  displayedColumns: string[] = ['merchantId', 'merchantName', 'serviceType', 'mobile', 'email'];
  isLoadingCompelete = true;
  dataSourceLength:any;
  sortDirection: string = '';
  currentColumn: string = '';
  responseHeader: any;
  filterArray: any;
  // filterflag: any;
  toRow: any;
  fromRow: any;
  tablePageSize: any;
  totalRecords: any;
  advSearchPeriod = '';
  advSearchSearchWithin = '';
  advSearchSortOrder = '';
  advSearchFromDate = '';
  advSearchToDate = '';
  filterflag: string = '';
  filterconstraint: string = '';
  filterfield: string = '';
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  constructor(private ePayService: EpayServiceService,private router:Router,private commonService:CommonService) {
    this.rootScopeData.activeTabName = 'epayRequest';
    this.currentColumn = 'merchantId';
    this.sortDirection = 'desc';
    this.fromRow = 1;
   }

  ngOnInit(): void {
    this.epayReqDetails();
  }
  epayReqDetails(){
    this.isLoadingCompelete=false;
    let params = {
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
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,      
      filterArray: this.filterArray,
      flag :this.filterflag,
      groupBy: '',
      period: this.advSearchPeriod,
      fromDate: this.advSearchFromDate,
      toDate: this.advSearchToDate,
      filterfield: this.filterfield,
      filterconstraint: this.filterconstraint,
    };
    this.ePayService.epayRequestData(params).subscribe((resp:any)=>{
      this.isLoadingCompelete=true
      if (resp.headerValue !== undefined) {
        this.responseHeader = resp.headerValue;
      }
      if(resp && resp.data && resp.data.length>0){
        this.dataSource = resp?.data;
        this.norecordflag = false;
        this.dataSourceLength = this.dataSource.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        this.dataSourceToPass.paginator = this.commonPagination.paginator;
        this.totalRecords = resp.headerValue.totalCount;
        this.dataSourceToPass.sort=this.sort
      }else{
        this.norecordflag = true;
      }
    },err=>{
      this.isLoadingCompelete = true;
      this.norecordflag = true;
    })
    // this.dataSource= new MatTableDataSource([]);
  }
  refreshSummary() {
    this.epayReqDetails();
  }
  triggerSearchFilter(event:any): void {
    let columnsToSearch = [ 
      {"name":"merchantId", "fieldType":"string"},
      {"name":"merchantName", "fieldType":"string"},
      {"name":"serviceType", "fieldType":"string"}, 
      {"name":"mobile", "fieldType":"string"},
      {"name":"email", "fieldType":"string"}
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
  }
  advancedSearchApply(event:any){
    // this.dataSource.sort((a: any, b: any) => {
    //   if (event.order === 'desc') {
    //     if (a.beneFileUploadDate > b.beneFileUploadDate) {
    //       return -1;
    //     }
    //     if (a.beneFileUploadDate < b.beneFileUploadDate) {
    //       return 1;
    //     }
    //   }
    //   if (event.order === 'asc') {
    //     if (a.beneFileUploadDate < b.beneFileUploadDate) {
    //       return -1;
    //     }
    //     if (a.beneFileUploadDate > b.beneFileUploadDate) {
    //       return 1;
    //     }
    //   }
    //   return 0;
    // });
    this.advSearchPeriod = event.periodModel;
    this.advSearchFromDate = event.fromDate;
    this.advSearchToDate = event.toDate;
    this.filterflag = 'Y';
    this.filterconstraint = 'date';
    this.filterfield = 'merchantId';
    this.epayReqDetails();
  }
  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.epayReqDetails();
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.epayReqDetails();
  }
}
