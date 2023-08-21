import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { showFilteredRows } from 'src/app/utility/tableFilter';
// import { expandCollapse } from 'src/app/utility/expandCollapse';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  displayedColumns: string[] = ['depositAccountNumber', 'depositType', 'tenor', 'rateofInterest', 'maturityAmount','action'];
  dataSourceToPass: any;
  isViewBalClicked:any = [];
  dataSourceLength: any;
  isViewAllBalClicked: boolean = false;
  depositSummaryData: any;
  responseHeader: any;
  dataSource: any;
  isDepositExpand: boolean = false;
  contextMenuList: any = [];
  contentHeight: any;
  printSection:string="";
  noRecordFoundInfoObj = {
    "msg":"LBL_NO_INVSTMNT_FND", 
    "btnLabel":"Invest Now", 
    "btnLink": "/dashboard",
    "showBtn": "true",
    "showMsg": "true",
    "showIcon": "true"
  };
  norecordflag:boolean = false;
  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {
    this.contextMenuList = [
      {"displayName": "LBL_CHEQUE_BOOK_REQUEST", "value":"cheqeBookRequest"},
      {"displayName": "LBL_BOOK_DEPOSIT", "value":"bookDeposit"},
      {"displayName": "LBL_MANAGE_ALIAS", "value":"manageAlias"},
      {"displayName": "LBL_DWNLD_ESTMNT", "value":"downloadEStatement"}
    ];
    this.getDepositSummary();
    this.isViewBalClicked[this.dataSourceLength] = false;
    this.printSection="dashboardDepositsContainer";
  }

  getTableHeight() {
    let that = this;
    window.setTimeout(function() {
      that.contentHeight = document.getElementById("depositexpandCollapseElement")?.clientHeight + '';
    }, 1000);
  }
  
  triggerSearchFilter(event:any): void {
    showFilteredRows('DepositDefaultCntr', event.target.value); 
  }

  getDepositSummary(){
    this.dashboardService.depositSummaryApiCall().subscribe(
      (data: any) =>{
		  if(data.HEADER_VALUE != undefined){
		  	this.responseHeader = data.HEADER_VALUE;
		  }
      this.depositSummaryData = data;
      this.dataSource = this.depositSummaryData.DATA.ALL_RECORDS;
      this.dataSourceLength=this.depositSummaryData.DATA.ALL_RECORDS.length;
      this.dataSourceToPass= new MatTableDataSource(this.dataSource);
      if(this.dataSource == null || this.dataSource == '' || this.dataSource == undefined){
        this.norecordflag = !this.norecordflag;
      }
        
      }, (error: any) => {
  
      }
      
    )       
  }

  onViewBalanceClick(index:number){
    this.isViewBalClicked[index] = true;
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
    this.isDepositExpand = !this.isDepositExpand;
    // var setContainer ='depositexpandCollapseElement';
    // var setToolsElement ='depositsummaryToolsElement';
    // expandCollapse(this.isDepositExpand,event,setContainer,setToolsElement)
  }

  actionOnMenuClick(msg: any, row?: any) {
    if(msg == "cheqeBookRequest") {
      //cheqeBookRequest related code comes here
    }else if(msg == "bookDeposit") {
     //bookDeposit related code comes here
    }else if(msg == "manageAlias") {
	//manageAlias related code comes here
    }else if(msg == "downloadEStatement") {
      //cash withdrawl related code comes here
    }
    
  }

}
