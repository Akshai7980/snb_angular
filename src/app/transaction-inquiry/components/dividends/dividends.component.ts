import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRows } from 'src/app/utility/tableFilter';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-dividends',
  templateUrl: './dividends.component.html',
  styleUrls: ['./dividends.component.scss']
})
export class DividendsComponent implements OnInit {
  index=-1;
 showDrop=false;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  
  @ViewChild(MatSort) sort !: MatSort;
  contextMenuList: any = [];
  fromRow:any;
  noRecordFoundInfoObj:any
  rootScopeData:RootScopeDeclare=RootScopeData;

  toRow:any;
  dataSourceToPass:any
  dataSourceLength:any;
  dataSource:any
  totalRecords: any;
  tablePageSize :any;
  norecordflag:boolean = true;

  isLoadingCompelete = true;
  @Output() onRefreshClick = new EventEmitter();
  constructor(private transactionService:TransactionInquiryService) {
    this.rootScopeData.activeTabName='dividends';
   }
    //  changed based on data
   displayedColumns: string[] = ['TO', 'FROM', 'PAYMENT_TYPE','VALUE_DATE', 'STATUS','AMT','action'];
  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_RECORDS_FOUND", 
      "btnLabel":"", 
      "btnLink": "",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.contextMenuList = [
      {"displayName": "LBL_CHEQUE_BOOK_REQUEST", "value":"cheqeBookRequest"},
      {"displayName": "LBL_BOOK_DEPOSIT", "value":"bookDeposit"},
      {"displayName": "LBL_MANAGE_ALIAS", "value":"manageAlias"},
      {"displayName": "LBL_DWNLD_ESTMNT", "value":"downloadEStatement"} 
    ];
    // this.getDetails()
  }
  getDetails(){
    this.transactionService.getDividendsDetails().subscribe((data:any)=>{
      this.isLoadingCompelete = false;
      this.dataSourceToPass=data.DATA.ALL_RECORDS;
      this.dataSource=this.dataSourceToPass
      this.dataSourceLength=this.dataSourceToPass.length;
      this.dataSourceToPass= new MatTableDataSource(this.dataSource);
      this.dataSourceToPass.paginator=this.commonPagination.paginator;
      this.dataSourceToPass.sort = this.sort;
      this.totalRecords = data.DATA.TOTAL_COUNT;
      this.rootScopeData.accountsSummaryObject = data.DATA.ALL_RECORDS;
      if(this.dataSource == null || this.dataSource == '' || this.dataSource == undefined){
        this.norecordflag = !this.norecordflag;
      }
    }),(error: any) => {
      this.isLoadingCompelete = true;
    }
  }
  triggerSearchFilter(event:any): void {
    showFilteredRows(this.rootScopeData.filterTableId, event.target.value); 
  }

  triggerDropdownFilter(event:any):void{
    showFilteredRows(this.rootScopeData.filterTableId, event); 
  }

  refreshSummary(){
    this.onRefreshClick.emit('Y');
  }
  isSelected(row:any){
    this.rootScopeData.accountsSummaryObject = row;
  }
  paginationChangeClick(params:any){
    this.fromRow = params.fromRow;
    this.toRow= params.toRow;
    this.getDetails();
  }
  displayDropDown(i:any){
    this.showDrop=!this.showDrop
    this.index=i;
  }

}
