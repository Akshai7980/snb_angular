import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { EpayServiceService } from '../../services/epay-service.service';
import { MatSort } from '@angular/material/sort';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
@Component({
  selector: 'app-epay-download-center',
  templateUrl: './epay-download-center.component.html',
  styleUrls: ['./epay-download-center.component.scss']
})
export class EpayDownloadCenterComponent implements OnInit {
  @ViewChild(MatSort) sort !: MatSort;
  dataSource: any;
  norecordflag: boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  displayedColumns: string[] = ['documentId', 'name', 'createdAt', 'status', 'count','action'];
  isLoadingCompelete = true;
  isLoadingSmallCompelete:boolean=true;
  dataSourceToPass:any;
  dataSourceLength:any;
  sortDirection: string = '';
  currentColumn: string = '';
  downloadUrlBasePath:any;
  responseHeader: any;
  fromRow: any;
  toRow: any;
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
    this.rootScopeData.activeTabName='epayDownload';
    this.currentColumn = 'makerDate';
    this.sortDirection = 'desc';
    this.fromRow = 1;
    this.rootScopeData.advSearchCurrentPage = 'ePaySeriveInquiry';
   }

  ngOnInit(): void {
    this.epayDownloadDetails();
  }
  epayDownloadDetails(){
    this.isLoadingCompelete=false
    let request={
          "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : "",
          "userId": this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '',
          "documentType": "ECOM"
   }
    this.ePayService.epayDownloadData(request).subscribe((resp:any)=>{
      this.isLoadingCompelete=true
      if (resp.headerValue !== undefined) {
        this.responseHeader = resp.headerValue;
      }
      if(resp && resp.data && resp.data?.success && resp.data?.success?.userDocumentsList?.userDocument?.length>0){
        this.dataSourceToPass = resp.data?.success?.userDocumentsList?.userDocument;
        this.dataSource = this.dataSourceToPass;
        this.norecordflag = false;
        this.dataSourceLength = this.dataSourceToPass.length;
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
    this.dataSource= new MatTableDataSource([]);
  }
  refreshSummary() {
    this.epayDownloadDetails();
  }
  triggerSearchFilter(event:any): void {
    let columnsToSearch = [ 
      {"name":"documentId", "fieldType":"string"},
      {"name":"name", "fieldType":"string"},
      {"name":"createdAt", "fieldType":"string"}, 
      {"name":"status", "fieldType":"string"},
      {"name":"count", "fieldType":"string"}
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
  }
  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.epayDownloadDetails();
  }
  downloadStatements(selectedrow: any) {
   
    this.isLoadingCompelete = false;
    const params = {
      documentId: selectedrow?.documentId,
      createdAt: selectedrow?.createdAt
    };
    this.ePayService.ePayDownloadRequest(params).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      if (res.data?.statement) {
        const src = 'data:application/pdf;base64,'+ res?.data;
        const link = document.createElement("a");
        link.href = src;
        link.download = selectedrow.documentId;
        link.click();
        link.remove();
      }
    }, () => {
      this.isLoadingCompelete = true;
    })
  }
  advancedSearchApply(event:any){
    this.dataSource.sort((a: any, b: any) => {
      if (event.order === 'desc') {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
      }
      if (event.order === 'asc') {
        if (a.createdAt < b.createdAt) {
          return -1;
        }
        if (a.createdAt > b.createdAt) {
          return 1;
        }
      }
      return 0;
    });
    this.advSearchPeriod = event.periodModel;
    this.advSearchFromDate = event.fromDate;
    this.advSearchToDate = event.toDate;
    this.filterflag = 'Y';
    this.filterconstraint = 'date';
    this.filterfield = 'createdAt';
    this.epayDownloadDetails();
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.epayDownloadDetails();
  }
}
