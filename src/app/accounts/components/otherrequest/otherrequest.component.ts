import { Component, OnInit,  ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { AccountDetailsService } from '../../services/account-details.service';
import { CommonInjectServiceService } from '../../services/common-inject-service.service';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
@Component({
  selector: 'app-otherrequest',
  templateUrl: './otherrequest.component.html',
  styleUrls: ['./otherrequest.component.scss']
})
export class OtherrequestComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  tablePageSize :any;
  fromRow:any;
  toRow:any;
  totalRecords: any;
  dataSourceToPass:any;
  rootScopeData:RootScopeDeclare=RootScopeData;
  displayedColumns: string[] = ['nickName', 'fullName', 'accNumber','refNum', 'accBalance','action'];
  dataSource: any = [];
  noRecordFoundInfoObj: any;
  norecordflag:boolean = false;
  isLoadingCompelete = true;
  sortDirection:string='';
  currentColumn:string='';
  enablePropertty:boolean =true;
  routeDetailScreen:any;
  @Output() childEvent:EventEmitter<any> = new EventEmitter()
  responseHeader: any;
  advSearchPeriod = "";
  advSearchSearchWithin = "";
  advSearchSortOrder = "";
  advSearchFromDate = "";
  advSearchToDate = "";
  filterflag:string ="";
  filterconstraint:string ="";
  filterfield:string="";
  maxdate=new Date()
  isRefreshFlag: boolean = false;
  constructor(private accountService:AccountDetailsService,private router:Router,private service: CommonInjectServiceService) { 
    this.rootScopeData.activeTabName='otherrequest';
    this.rootScopeData.filterTableId = 'otherRequestsInquiryTable'
    this.rootScopeData.accountsActiveModule = 'OTHERREQINQ'
    this.rootScopeData.advSearchCurrentPage = 'downloadCenterInquiryTable'

    this.currentColumn ='submittedOn';
    this.sortDirection ='desc';
    
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_OTHER_REQUEST", 
      "btnLabel":"Apply Now", 
      "btnLink": "/dashboard",
      "showBtn": "true",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getOtherRequest();
    this.routeDetailScreen ='/accounts/chequedetailsLayout';
  }
  getOtherRequest(){
    this.isLoadingCompelete=false;
    let params = {
      fromRow: this.fromRow,
      toRow:this.toRow,
      sortcolumn :this.currentColumn,
      sortDirection: this.sortDirection,
      period:this.advSearchPeriod,
     
      fromDate : this.advSearchFromDate,
      toDate : this.advSearchToDate,
      filterflag : this.filterflag,
      filterfield : this.filterfield,
      filterconstraint : this.filterconstraint     
    };
    this.accountService.getOtherReqDtls(params).subscribe((res:any)=>{
      this.isLoadingCompelete=true;
      if(res.headerValue !== undefined){
		  	this.responseHeader = res.headerValue;
		  }
      if(res.status === 500){
        this.enablePropertty = false;
        this.service.changeData("false");  //invoke new Data
      }
      else {
      this.totalRecords = this.responseHeader.totalCount;
      this.rootScopeData.otherReqSummaryCount = this.responseHeader.totalCount;
      if(this.isRefreshFlag === false){
        this.dataSource = this.dataSource.concat(res.data);
      }else{
        this.dataSource = res.data;
        this.isRefreshFlag = false;
      }
      // this.dataSource = res.data;
      this.service.changeData("true");  //invoke new Data
      this.dataSourceLength=this.dataSource.length;
      this.dataSourceToPass= new MatTableDataSource(this.dataSource)
      this.dataSourceToPass.paginator=this.commonPagination.paginator;
      }
		  if(this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0){
            this.norecordflag = !this.norecordflag;
            this.enablePropertty = false;
            this.service.changeData("false");  //invoke new Data
      }
    }, (error: any) => {
      this.isLoadingCompelete=true;
      this.norecordflag=true;
      this.enablePropertty = false;
      this.service.changeData("false");  //invoke new Data
      // this.rootScopeData.showSystemError = true;
    })
  }
  paginationChangeClick(params:any){
    this.fromRow = params.fromRow;
    this.toRow= params.toRow;
    this.getOtherRequest();
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getOtherRequest();
   
  }

  // sortup(colName :any){
  //   this.sortColumn = colName;
  //   this.sortDirection='asc';
  //   this.getOtherRequest();
  //   }
    
  //   sortdown(colName:any){
  //   this.sortColumn = colName;
  //   this.sortDirection='desc';
  //   this.getOtherRequest();
  //   }

    goToDetailsScreen(data:any){
      if(data.subProductCode === "CHEQUES"){
        this.rootScopeData.pendingActivitiesServiceRequestObject = data;
        this.router.navigate(['/accounts/chequedetailsLayout']);
      }else if(data.subProductCode === "UPNATAD"){
        this.rootScopeData.pendingActivitiesServiceRequestObject = data;
        this.router.navigate(['/accounts/nationalAddressDetails']);
      }else if(data.subProductCode === "UPDCREX"){
        this.rootScopeData.pendingActivitiesServiceRequestObject = data;
        this.router.navigate(['/accounts/crExpiryDetails']);
      }
    }

    selectedRecord(event: any ,element :any){
      this.rootScopeData.pendingActivitiesServiceRequestObject = element;
      event?.stopPropagation();
    }

    refreshSummary(){
      this.fromRow = 1
      this.toRow = undefined;
      this.isRefreshFlag = true;
      this.dataSource = [];
      this.commonPagination.paginator.firstPage();
      this.getOtherRequest();
    }

    triggerSearchFilter(event:any){
      let columnsToSearch = [ 
        {"name":"accountNumber", "fieldType":"string"},
        {"name":"requestType", "fieldType":"string"}, 
        {"name":"statusDes", "fieldType":"string"},
        {"name":"requestRefNo", "fieldType":"string"},
        {"name":"submittedOn", "fieldType":"date"}
      ];
      let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
      this.dataSourceToPass= new MatTableDataSource(tableData);
      this.commonPagination.paginator.firstPage();
      this.dataSourceToPass.paginator=this.commonPagination.paginator;
      // showFilteredRows(this.rootScopeData.filterTableId, event.target.value);
    }
   
    
      advancedSearchApply(event:any){
        this.advSearchPeriod = "date";
        this.advSearchFromDate = event.fromDate;
        this.advSearchFromDate = event.toDate;
        this.filterflag ='Y';
        this.filterconstraint ="date";
        this.filterfield='submittedOn';
        this.fromRow = 1;
        this.dataSource = [];
        this.getOtherRequest();
    }
    routeToDetailsScreen(event:any){
      this.goToDetailsScreen(event)
    }
}
