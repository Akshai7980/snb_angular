import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
// import { expandCollapse } from 'src/app/utility/expandCollapse';
import { DashboardService } from '../../services/dashboard.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';
import { dateFormateChanger } from 'src/app/utility/common-utility';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit {
  @ViewChild(MatSort) sort !: MatSort;
  displayedColumns: string[] = ['LOAN_OD_ACC_NO','CUSTOMER_NAME', 'LOAN_FACILITY_NUM', 'LOAN_TYPE','DUE_DATE','LOAN_OS','HIDE_CONTAINER','HIDE_LOAN_OS','action'];
  printSection:string="";
  dataSourceToPass!: MatTableDataSource<any>;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  isLoansExpand: boolean = false;
  isViewAllBalClicked: boolean = false;
  isViewBalClicked:any = [];
  // contextMenuList: any = [];
  isLoadingCompelete = true;
  dataSourceLength: any;
  summaryData : any;
  filterData:any;
  responseHeader: any;
  contentHeight: any;
  enablePropertty:boolean =true;
  rootScopeData:RootScopeDeclare=RootScopeData;
  @Output() loansDataToPortfolio = new EventEmitter();
  noRecordFoundInfoObj = {
    "msg":"LBL_NO_LOANS_FOUND", 
    "btnLabel":"Apply Now", 
    "btnLink": "/dashboard",
    "showBtn": "true",
    "showMsg": "true",
    "showIcon": "true"
  };
  norecordflag:boolean = false;
  routeDetailScreen:any;
  @Input() langDirection:any;
  totalRecords: any;
  disp = 'hidden';
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
  constructor(private dashboardService:DashboardService,private router:Router) { }
  ngOnInit(): void {
    // this.contextMenuList = [
    //   {"displayName": "LBL_REPAYMENT", "value":"repayment"},
    //   {"displayName": "LBL_DISBURSEMENT", "value":"disbursement"},
    //   {"displayName": "LBL_VIEWDETAILS", "value":"viewDetails"},
    // ];
    // this.getFinanceDetails();
    this.printSection="dashboardLoansContainer";
    this.routeDetailScreen="/accounts/loan-details/loanRecentTransaction";
    this.isViewBalClicked[this.dataSourceLength] = false;
  }

  ngOnChanges(){
    if(this.langDirection)
    {
      this.getFinanceDetails();
    }
  }

  getTableHeight() {
    let that = this;
    window.setTimeout(function() {
      // that.contentHeight = document.getElementById("loanexpandCollapseElement")?.clientHeight + '';
    }, 1000);
  }

  triggerSearchFilter(event:any): void {
    let columnsToSearch = [ 
      {"name":"OD_CCY_CODE", "fieldType":"ccy1"},
      {"name":"CUSTOMER_NAME", "fieldType":"string"},
      {"name":"LOAN_OD_ACC_NO", "fieldType":"string"}, 
      {"name":"LOAN_FACILITY_NUM", "fieldType":"string"},
      {"name":"LOAN_TYPE", "fieldType":"string"},
      {"name":"DUE_DATE", "fieldType":"date"},
      {"name":"LOAN_OS", "fieldType":"amount1"}
      
    ];
    let tableData = showFilteredRecords(this.filterData, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData); 
    if(tableData.length>=200){
      this.disp='visible';
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
    }
    // showFilteredRows('loansDefaultCntr', event.target.value); 
  }

  getFinanceDetails(){
    this.isLoadingCompelete = false;
    this.dashboardService.financeSummaryApiCall().subscribe(
      (response:any) =>{
      this.isLoadingCompelete = true;
		  if(response.HEADER_VALUE != undefined){
			this.responseHeader = response.HEADER_VALUE;
	  	}	
        // this.financeDetailsData=response

        if(response.status === 500){
          this.norecordflag = !this.norecordflag;
          this.enablePropertty = false;
        }
        else {
          for(let i = 0; response.DATA.ALL_RECORDS.length > i; i++) {
            response.DATA.ALL_RECORDS[i].DUE_DATE = dateFormateChanger(response.DATA.ALL_RECORDS[i].DUE_DATE);
          }
          let dataSource=response.DATA.ALL_RECORDS;
          this.summaryData = response.DATA;
          this.filterData = response.DATA.ALL_RECORDS;
          this.dataSourceLength=response.DATA.ALL_RECORDS.length;
          // console.log(this.dataSourceLength)
          this.dataSourceToPass= new MatTableDataSource(dataSource);
          this.sort.sort(({ id: 'LOAN_OD_ACC_NO', start: 'desc'}) as MatSortable);
          this.dataSourceToPass.sort = this.sort;
          if(this.dataSourceLength>=200){
            this.disp='visible';
            this.totalRecords = response.DATA.TOTAL_COUNT;
            this.dataSourceToPass.paginator = this.commonPagination.paginator;
          }
          // let params={
          //   loansCount : this.summaryData.TOTAL_COUNT,
          //   totalBalance : this.summaryData.TOTAL_BALANCE,
          //   currency : this.summaryData.CURRENCY
          // }
          // this.loansDataToPortfolio.emit(params);
          if(dataSource === null || dataSource === '' || dataSource === undefined || dataSource.length === 0){
            this.norecordflag = !this.norecordflag;
          }
          else{
            this.enablePropertty=true;            
          }
        }
        this.emitDataToParent();
      }, 
    error => {
      this.isLoadingCompelete = true;
      this.enablePropertty=false;
      this.norecordflag = !this.norecordflag;
      this.emitDataToParent();
    }
    )
  }

  emitDataToParent() {
    let params={
      loansCount : this.summaryData ? this.summaryData.TOTAL_COUNT : '0',
      totalBalance : this.summaryData? this.summaryData.TOTAL_BALANCE : '0.00',
      currency : this.summaryData ? this.summaryData.CURRENCY : 'SAR'
    }
    this.loansDataToPortfolio.emit(params);
  }

  onViewBalanceClick(index:number){
    this.isViewBalClicked[index] = true;
    event?.stopPropagation();
  }
  onViewAllBalanceClick(){
    this.isViewAllBalClicked = true;
    for(let i=0;i<this.dataSourceLength;i++)
    {
      this.isViewBalClicked[i] = true;
    }
  }
  onHideAllBalanceClick(){
    this.isViewAllBalClicked = false;
    for(let i=0;i<this.dataSourceLength;i++)
    {
      this.isViewBalClicked[i] = false;
    }
  }

  onClickExpand(event:any){
    this.isLoansExpand = !this.isLoansExpand;
    // var setContainer ='loanexpandCollapseElement';
    // var setToolsElement ='loansummaryToolsElement';
    // expandCollapse(this.isLoansExpand,event,setContainer,setToolsElement)
  }

  actionOnMenuClick(msg: any, row?: any) {
    if(msg === "repayment") {
      //repayment related code comes here
    }else if(msg === "disbursement") {
     //disbursement related code comes here
    }else if(msg === "viewDetails") {
	//viewDetails related code comes here
    }
  }

  goToDetailsScreen(data:any){
  this.rootScopeData.loanSummaryobject = data;
  this.router.navigate(['/accounts/loan-details/loanRecentTransaction'])
  }

  selectedRecord(event: any ,element :any){
    this.rootScopeData.loanSummaryobject = element;
    event?.stopPropagation();
  }
  paginationChangeClick(params: any) {

  }

  hideBalance(index:number){
    this.isViewBalClicked[index] = false;
    event?.stopPropagation();
  }
 
}
