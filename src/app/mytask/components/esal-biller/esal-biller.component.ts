import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';


@Component({
  selector: 'app-esal-biller',
  templateUrl: './esal-biller.component.html',
  styleUrls: ['./esal-biller.component.scss']
})
export class EsalBillerComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength:any;
  rootScopeData:RootScopeDeclare=RootScopeData
  noRecordFoundInfoObj: any;
  dataSourceToPass:any;
  displayedColumns: string[] = ['payerId','shortName','fullName', 'action'];
  dataSource: any=[];
  norecordflag:boolean = false;
  tablePageSize :any;
  fromRow:any;
  toRow:any;
  totalRecords: any;
  isLoadingCompelete = true;
  currentColumn: string = '';
  sortDirection: string = '';
  responseHeader: any;
  isRefreshFlag: boolean = false;
  refreshClickedFlag: boolean = false;
  advancedSearchName: any;
  advancedSearchRefNum: any;
  filterArray: any;
  constructor(private mytaskService:MyTaskService, private router:Router) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.rootScopeData.advSearchCurrentPage = 'esalBiller'
   }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'esalbillers';
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_RECORDS_FOUND", 
      "btnLabel":"Apply Now", 
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    let defaultPassingObj ={  
      "filterField": "",
      "filterConstraint": "contains",
      "filterValue": "",
    }
    this.filterArray =[defaultPassingObj];
    this.currentColumn ='payerId';
    this.sortDirection ='desc';
    this.getEsalBillerDetails();
  }


  getEsalBillerDetails(){
    let params = {
      fromRow:this.fromRow,
      toRow:this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      filterArray: this.filterArray
    };
    this.isLoadingCompelete = false;
    this.mytaskService.pendingEsalBillerSummaryApi(params).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
      // this.dataSource = res.dataValue;
      if(this.isRefreshFlag === false){
        this.dataSource = this.dataSource.concat(res.dataValue);
      }else{
        this.dataSource = res.dataValue;
        this.isRefreshFlag = false;
      }
      this.refreshClickedFlag = false;
      this.dataSourceLength=this.dataSource.length;
      this.dataSourceToPass= new MatTableDataSource(this.dataSource)
      this.dataSourceToPass.paginator=this.commonPagination.paginator;
      this.totalRecords = res.headerValue.totalCount;
      this.rootScopeData.esalBillerMyTasksCount = this.totalRecords;
        if(this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0){
        this.norecordflag = true;
      }
    }, (error: any) => {
      this.isLoadingCompelete = true;
      this.norecordflag = true;
    })
  }

triggerSearchFilter(event:any){
  let columnsToSearch = [ 
    {"name":"payerId", "fieldType":"string"},
    {"name":"shortName", "fieldType":"string"}, 
    {"name":"payerFullName", "fieldType":"string"}
    
  ];
  debugger;
  let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
  this.dataSourceToPass= new MatTableDataSource(tableData);
  this.dataSourceToPass.paginator=this.commonPagination.paginator;
  // showFilteredRows('esalbillersDefaultCntr', event.target.value); 
}

refreshSummary(){
  this.fromRow = 1
  this.toRow = undefined;
  this.isRefreshFlag = true;
  this.dataSource = [];
  this.commonPagination.paginator.pageSize = 5;
  this.totalRecords = this.totalRecords;
  this.commonPagination.paginator.firstPage();
  this.refreshClickedFlag = true;
  this.getEsalBillerDetails();
}

paginationChangeClick(params:any){
  // console.log("SPEVENT====>",params)
  this.fromRow = params.fromRow;
  this.toRow= params.toRow;
  this.getEsalBillerDetails();
}

goToDetailsScreen(row:any){  
  this.rootScopeData.pendingActivitiesEsalBillerSummaryObj= row;
  this.router.navigate(['/mytask/esalBillerDetailsLayout']);
}

onApproveClick(event: any, row: any) {
  event.stopImmediatePropagation();
  this.rootScopeData.pendingActivitiesEsalBillerSummaryObj= row;
  this.router.navigate(['/mytask/authorizeEsalBiller']);
}


onRejectClick(event: any, row: any) {
  event.stopImmediatePropagation(); 
  this.rootScopeData.pendingActivitiesEsalBillerSummaryObj= row;
  this.router.navigate(['/mytask/rejectEsalBiller']);
}

sortColumn(colName: any) {
  this.currentColumn = colName;
  if (this.sortDirection === 'desc') {
    this.sortDirection = 'asc';
  } else if (this.sortDirection === 'asc') {
    this.sortDirection = 'desc';
  }
  this.getEsalBillerDetails();
}
advancedSearchApply(event:any){
debugger;
  this.advancedSearchName = event.name; 
  this.advancedSearchRefNum = event.refNum; 

  this.filterArray =[]; 
  
    let passingObj = {
      "filterField": "payerId",
      "filterConstraint": "contains",
      "filterValue": this.advancedSearchName,
    }
     
    this.filterArray.push(passingObj);

    let passingObj1 = {
      "filterField": "payerFullName",
      "filterConstraint": "contains",
      "filterValue": this.advancedSearchRefNum      
    }
     
    this.filterArray.push(passingObj1);

    this.dataSource = [];
  this.getEsalBillerDetails();
}
}
