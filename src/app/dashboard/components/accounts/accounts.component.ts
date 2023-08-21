import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccountDetailsService } from 'src/app/accounts/services/account-details.service';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
//import { expandCollapse } from 'src/app/utility/expandCollapse';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { DashboardService } from '../../services/dashboard.service';



@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  @ViewChild(MatSort) sort !: MatSort;
  displayedColumns: string[] = ['OD_ACC_NO','ALIAS_NAME','OD_ACC_TYPE_2','CURR_AVAIL_BAL_AMOUNT_NEW','HIDE_CONTAINER','HIDE_CURR_AVAIL_BAL_AMOUNT_NEW','action'];
  dataSourceToPass!: MatTableDataSource<any>;
  isViewBalClicked:any = [];
  dataSourceLength: any;
  isViewAllBalClicked: boolean = false;
  // accountSummaryData: any;
  responseHeader: any;
  // dataSource: any;
  isAccountsExpand: boolean = false;
  contextMenuList: any = [];
  printSection:string="";
  noRecordFoundInfoObj: any;
  contentHeight: any;
  isLoadingCompelete = true;
  norecordflag:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  enablePropertty:boolean =true;
  summaryData: any;
  routeDetailScreen:any;
  @Output() accountsDataToPortfolio = new EventEmitter();
  filterData: any;
  @Input() langDirection:any;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  totalRecords: any;
  disp = 'hidden'
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
  constructor(private dashboardService:DashboardService,private router:Router, private accountService : AccountDetailsService) {
    this.contextMenuList = [
      { "display_key": 'LBL_VIEW_E_STATEMENT', "value": 'viewEStatement', "item_id": 'VIEW_E-STATEMENT' },
      { "display_key": 'LBL_GENERATE_STATEMENT', "value": 'generateStatement', "item_id": 'GENERATE_STATEMENT' }
    ]
   }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_ACCOUNTS_FND", 
      "btnLabel":"Apply Now", 
      "btnLink": "/dashboard",
      "showBtn": "true",
      "showMsg": "true",
      "showIcon": "true"
    };
    // this.getAccountsSummary();
    this.isViewBalClicked[this.dataSourceLength] = false;
    this.printSection="dashboardAccountsContainer";
    this.routeDetailScreen="accounts/account-details/recenttransaction";
  }

  ngOnChanges(){
    if(this.langDirection)
    {
      this.getAccountsSummary();
    }
  }

  getTableHeight() {
    let that = this;
    window.setTimeout(function() {
      // that.contentHeight = document.getElementById("accexpandCollapseElement")?.clientHeight + '';
    }, 1000);
  }

  triggerSearchFilter(event:any): void {
    let columnsToSearch = [ 
      {"name":"OD_CCY_CODE", "fieldType":"ccy1"},
      {"name":"ALIAS_NAME", "fieldType":"string"},
      {"name":"OD_ACC_NO", "fieldType":"string"}, 
      {"name":"OD_ACC_TYPE_2", "fieldType":"string"},
      {"name":"CURR_AVAIL_BAL_AMOUNT_NEW", "fieldType":"amount1"},
      
    ];
    let tableData = showFilteredRecords(this.filterData, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData); 
    if(tableData.length>=200){
      this.disp='visible';
      this.dataSourceToPass.paginator = this.commonPagination.paginator;

     }
    // showFilteredRows('accountsDefaultCntr', event.target.value); 
  }

  getAccountsSummary(){
    this.isLoadingCompelete = false;
    this.dashboardService.getAccountSummaryCall().subscribe(
      (data: any) =>{
      this.isLoadingCompelete = true;
		  if(data.HEADER_VALUE != undefined){
		  	this.responseHeader = data.HEADER_VALUE;
		  }
      if(data.status === 500){
        this.norecordflag = !this.norecordflag;
        this.enablePropertty = true;
      }
      else {
        let dataSource = data.DATA.ALL_RECORDS;
        this.summaryData = data.DATA;
        this.filterData = data.DATA.ALL_RECORDS;
        this.dataSourceLength=data.DATA.ALL_RECORDS.length;
        this.dataSourceToPass= new MatTableDataSource(dataSource);
        this.dataSourceToPass.sort = this.sort;
        // this.sort.sort(({ id: 'OD_ACC_NO', start: 'desc'}) as MatSortable);
        // this.dataSourceToPass.sort = this.sort;
        // console.log( this.dataSourceLength)
        if(this.dataSourceLength>=200){
          this.disp='visible';
          this.totalRecords = data.DATA.TOTAL_COUNT;
          this.dataSourceToPass.paginator = this.commonPagination.paginator;

         }
        if(dataSource === null || dataSource === '' || dataSource === undefined || dataSource.length === 0){
          this.norecordflag = !this.norecordflag;
          this.enablePropertty = false;  
         }
    }
    this.emitDataToParent();
    }, (error: any) => {
      this.isLoadingCompelete = true;
      this.enablePropertty=false;
      this.norecordflag=true;
      this.emitDataToParent();
    }
      
    )       
  }

  emitDataToParent() {
    let params={
      accountsCount : this.summaryData ? this.summaryData.TOTAL_COUNT : '0',
      totalBalance : this.summaryData ? this.summaryData.TOTAL_BALANCE : '0.00',
      currency : this.summaryData ? this.summaryData.CURRENCY : 'SAR'
    }
    this.accountsDataToPortfolio.emit(params);
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
  
    this.isAccountsExpand = !this.isAccountsExpand;
    // var setContainer ='accexpandCollapseElement';
    // var setToolsElement ='accsummaryToolsElement';
    // expandCollapse(this.isAccountsExpand,event,setContainer,setToolsElement)
  }

  goToDetailsScreen(data:any){
    this.rootScopeData.accountsSummaryObject = data;
    this.router.navigate(['accounts/account-details/recenttransaction']);
  }

  selectedRecord(event: any ,element :any){
    this.rootScopeData.generateAccountsSummaryObject = element;
    this.rootScopeData.accountsSummaryObject = element;
    this.rootScopeData.SelectedaccountsSummaryObject = element;
    event?.stopPropagation();
  }
  paginationChangeClick(params: any) {

  }

  hideBalance(index:number){
    this.isViewBalClicked[index] = false;
    event?.stopPropagation();
  }

  menuClick(event:any){
    if(event.item_id == "IBAN"){
      this.isLoadingCompelete = false;
      let params ={
        "moduleId": "DOWNIBANLETR",
        "accountNo": event.accNo,
        "cifNo": this.rootScopeData.dataFromContextMenu.COD_CORECIF,
      };
      let exportType ="PDF"
      this.accountService.downlodIBAN(params).subscribe((response:any)=>{
        this.isLoadingCompelete = true;
        if(response && response.dataValue){
          const src = 'data:application/'+response.dataValue.format+';base64,'+ response.dataValue.filecontent; // contentType of File pdf/csv/xls
          const link = document.createElement("a")
          link.href = src
          link.download = response.dataValue.filename; //Dynamic FileName
          link.click();
          link.remove();
        }
      }, error => {
        this.isLoadingCompelete = true;
      })
    }
  }
}
