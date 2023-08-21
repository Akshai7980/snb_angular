import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { AccountDetailsService } from '../../services/account-details.service';
import { CommonInjectServiceService } from '../../services/common-inject-service.service';
import { dateFormateChanger } from 'src/app/utility/common-utility';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  @ViewChild(MatSort) sort !: MatSort;
  dataSourceLength:any;
  rootScopeData:RootScopeDeclare=RootScopeData
  dataSourceToPass:any;
  displayedColumns: string[] = ['CUSTOMER_NAME', 'LOAN_OD_ACC_NO','LOAN_FACILITY_NUM', 'LOAN_TYPE','LOAN_APPROVED_LIMIT','HIDE_LOAN_APPROVED_LIMIT','DUE_DATE','LOAN_OS_AMT','HIDE_LOAN_OS_AMT','COD_CORECIF','action'];
  dataSource: any;
  isEditIconShow = false;
  noRecordFoundInfoObj = {
    "msg":"LBL_NO_LOANS_FOUND", 
    "btnLabel":"Apply Now", 
    "btnLink": "/dashboard",
    "showBtn": "true",
    "showMsg": "true",
    "showIcon": "true"
  };
  norecordflag:boolean = false;
  isNickNameEditible=false;
  editSelected=true;
  curerentSelection:any;
  responseHeader: any;
  totalRecords: any;
  tablePageSize :any;
  fromRow:any;
  toRow:any;
  isLoadingCompelete = true;
  enablePropertty:boolean =true;
  routeDetailScreen:any;
  @Input() proopertyenable: any;
  contextMenuList: any = [];

  constructor(private accountService:AccountDetailsService, private router:Router,private service: CommonInjectServiceService) { 
    this.rootScopeData.activeTabName='loans';
    this.rootScopeData.accountsActiveModule ='LOANSUM';
    this.rootScopeData.filterTableId = 'loansInquirytable';
    this.routeDetailScreen ="/accounts/loan-details/loanRecentTransaction";
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }
  

  ngOnInit(): void {
    this.contextMenuList = [
      {"displayName": "LBL_CHEQUE_BOOK_REQUEST", "value":"cheqeBookRequest"},
      {"displayName": "LBL_BOOK_DEPOSIT", "value":"bookDeposit"},
      {"displayName": "LBL_MANAGE_ALIAS", "value":"manageAlias"},
      {"displayName": "LBL_DWNLD_ESTMNT", "value":"downloadEStatement"} 
    ];
    this.getLoanInfo();
  }

  // formatDateInMMddYYYYFormat(dateString: any):Date {
  //   return dateFormateChanger(dateString);
  // }

  refreshSummary(){
    this.getLoanInfo();
  }
  getLoanInfo(){
    let flag="N";
    this.isLoadingCompelete = false;
    this.accountService.getloansSummaryDtls(flag).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      if(res.HEADER_VALUE !== undefined){
		  	this.responseHeader = res.HEADER_VALUE;
		  }
      if(res.status === 500){
        this.enablePropertty = false;
        this.norecordflag = true;
        this.service.changeData("false");  //invoke new Data
      }
      else{
      for(let i = 0; res.DATA.ALL_RECORDS.length > i; i++) {
        res.DATA.ALL_RECORDS[i].DUE_DATE_TO_SEARCH = res.DATA.ALL_RECORDS[i].DUE_DATE;
        res.DATA.ALL_RECORDS[i].DUE_DATE = dateFormateChanger(res.DATA.ALL_RECORDS[i].DUE_DATE);
      }
      this.dataSourceToPass = res.DATA.ALL_RECORDS;
      this.dataSource = this.dataSourceToPass;
      this.norecordflag = false;
      this.service.changeData("true");  //invoke new Data
      this.dataSourceLength=this.dataSourceToPass.length;
      this.dataSourceToPass= new MatTableDataSource(this.dataSource);
      this.dataSourceToPass.paginator=this.commonPagination.paginator;
      this.sort.sort(({ id: 'DUE_DATE', start: 'desc'}) as MatSortable);
      this.dataSourceToPass.sort = this.sort;
      this.totalRecords = res.DATA.TOTAL_COUNT;
      this.rootScopeData.accountsSummaryObject = res.DATA.ALL_RECORDS;
      this.rootScopeData.loanSummaryCount = res.DATA.TOTAL_COUNT;
      }
      if(this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0){
            this.norecordflag = true;
            this.service.changeData("false");  //invoke new Data
      }
    }, (error: any) => {
      this.isLoadingCompelete = true;
      this.norecordflag = true;
      this.service.changeData("false");  //invoke new Data
    })
  }
isSelected(row:any){
  this.rootScopeData.loanSummaryobject = row;
  this.router.navigate(['/accounts/loan-details/loanRecentTransaction'])
}


nickNameEditClick(i:any){
  this.curerentSelection=i;
  this.editSelected=false
  this.isEditIconShow = true;
    this.isNickNameEditible=false;
  }
  closeNickName(i:any){
    this.curerentSelection = null;
  }
  isSelectedRow(res:any){ 
    if(this.editSelected){
      this.isSelected(res)
    }
    else{
      this.editSelected=true;
      this.isEditIconShow = false;
    }
  }

  paginationChangeClick(params:any){
    // console.log("SPEVENT====>",params)
    this.fromRow = params.fromRow;
    this.toRow= params.toRow;
    this.getLoanInfo();
  }

  selectedRecord(event: any ,element :any){
    this.rootScopeData.loanSummaryobject = element;
    event?.stopPropagation();
  }
  triggerDropdownFilter(event:any):void{
    showFilteredRows('loansInquirytable', event); 
  }
  triggerSearchFilter(event:any){
    let columnsToSearch = [ 
      {"name":"CUSTOMER_NAME", "fieldType":"string"},
      {"name":"LOAN_OD_ACC_NO", "fieldType":"string"},
      {"name":"LOAN_FACILITY_NUM", "fieldType":"string"}, 
      {"name":"LOAN_TYPE", "fieldType":"string"},
      {"name":"DUE_DATE_TO_SEARCH", "fieldType":"date"},
      {"name":"CIF_NO", "fieldType":"string"},
      {"name":"LOAN_CCY", "fieldType":"ccy1"},
      {"name":"LOAN_APPROVED_LIMIT", "fieldType":"amount1"},
      {"name":"LOAN_OS_AMT", "fieldType":"amount1"},

    ];
    
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData); 
    this.dataSourceToPass.paginator = this.commonPagination.paginator;
  }
}
