import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest  } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { TicketServiceService } from '../../services/ticket-service.service';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss']
})
export class ComplaintsComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  @ViewChild(MatSort) sort!: MatSort;
  dataSourceToPass !: MatTableDataSource<any>;
  noRecordFlag : boolean = false;
  printSection:string="";
  filterflag:string ="";
  filterArray:any;
  noRecordFoundInfoObj:any;
  dataSource:any=[];
  isLoadingCompelete = true;
  rootScopeData:RootScopeDeclare=RootScopeData;
  dataSourceLength: any;
  totalRecords: any;
  fromRow: any;
  toRow: any;
  displayedColumns = ['reqNo','serviceTyp','reqStatus','mobNo','creationDate','closureDate'];
  responseHeader: any;
  currentColumn: string = '';
  sortDirection:string='';
  isRefreshFlag: boolean = false;
  details:any;
  tablePageSize: any;
  reqType  : any = 'Default';
  noRecordFoundObject = {
    msg: 'LBL_NO_RECORDS_FOUND',
    showMsg: 'true'
  };

  constructor(private ticketService:TicketServiceService,private router :Router) { 
    this.rootScopeData.advSearchCurrentPage = 'ticketInquiryComplaints'
    this.rootScopeData.accountsActiveModule = '';
    this.currentColumn = 'makerDate';
    this.sortDirection = 'desc';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.printSection="complaintsPrintSection";
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_BENEFICIARY_FOUND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "true",
      "showMsg": "true",
      "showIcon": "true"
    };
    let defaultPassingObj ={  
      "filterField": "",
      "filterConstraint": "contains",
      "filterValue": "",
    }
    this.filterArray =[defaultPassingObj];
    this.getComplaintsDetails();
  }
  advancedSearchApply(event:any){
    this.isLoadingCompelete= false;
    debugger 
    let type : any = '';
    if(event.serviceType == 'DR' || event.serviceType == 'CR'){
      type = 'Corporate'
      this.reqType = 'ServiceType'
    }
    let param = {
      reqType :  this.reqType,
      cifNo : this.rootScopeData.userInfo.primaryCif,
      srNo : '',
      createdFrom : event.fromDate,
      createdTo : event.toDate,
      status : event.requestStatus,
      type : type,
      area : '',
      subArea : '',
      service : ''
    };
    this.ticketService.getComplaintsList(param).subscribe((res:any)=>{
      this.isLoadingCompelete=true;
      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
      if ((res && res.status) || (res.dataValue && !res.dataValue.serviceRequest.length)) {
        this.noRecordFlag = true;
      } else {
        // this.dataSource = data.data;
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(res.dataValue.serviceRequest);
        }else{
          this.dataSource = res.dataValue.serviceRequest;
          this.isRefreshFlag = false;
        }
        this.dataSourceLength = this.dataSource.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        if(this.dataSource.length > 0){
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
        }
        this.totalRecords = res.headerValue.totalCount;
      }
    },err=>{
      this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })



  }
  triggerSearchFilter(event:any): void {
    let columnsToSearch = [ 
      {"name":"SRNumber", "fieldType":"string"},
      {"name":"SRService", "fieldType":"string"}, 
      {"name":"status", "fieldType":"string"},
      {"name":"mobileNumber", "fieldType":"string"},
      {"name":"createdDate", "fieldType":"string"},
      {"name":"closedDate", "fieldType":"string"}
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
  }
  triggerDropdownFilter(event: any): void {
    showFilteredRows('complaintsList', event);
  }
  refreshSummary(){
    this.fromRow = 1
    this.toRow = undefined;
    this.dataSource = [];
    this.getComplaintsDetails();
  }
  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === '' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }else {
      this.sortDirection = '';
    }
    this.getComplaintsDetails();
  }
  redirectToDetails(element:any){
    this.setDetails(
      element,
      '/ticketInquiry/complaintDetailsLayout'
    );
  }

  getComplaintsDetails(){
    
    this.isLoadingCompelete= false;
    let param = {
      reqType :  this.reqType,
      cifNo : this.rootScopeData.userInfo.primaryCif,
      srNo : '',
      createdFrom : '',
      createdTo : '',
      status : '',
      type : '',
      area : '',
      subArea : '',
      service : ''
    };
    this.ticketService.getComplaintsList(param).subscribe((res:any)=>{
      this.isLoadingCompelete=true;
      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
      if ((res && res.status) || (res.dataValue && !res.dataValue.serviceRequest.length)) {
        this.noRecordFlag = true;
      } else {
        // this.dataSource = data.data;
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(res.dataValue.serviceRequest);
        }else{
          this.dataSource = res.dataValue.serviceRequest;
          this.isRefreshFlag = false;
        }
        this.dataSourceLength = this.dataSource.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        this.dataSourceToPass.paginator = this.commonPagination.paginator;
        this.totalRecords = res.headerValue.totalCount;
      }
    },err=>{
      this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }
  setDetails(data: any, path: string){
    this.isLoadingCompelete = false;
    let param;
    this.ticketService.getComplaintsSummary(param).subscribe(
      (response:any) => {
        this.details = response.data;
        this.rootScopeData.ticketInquiry = {
          details: this.details,
          summary: data
        };
        this.isLoadingCompelete = true;
        this.router.navigate([path]);
      },
      (error) => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    );
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getComplaintsDetails();
  }
}
