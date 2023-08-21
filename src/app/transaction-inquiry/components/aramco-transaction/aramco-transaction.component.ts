import {Component,OnInit,ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-aramco-transaction',
  templateUrl: './aramco-transaction.component.html',
  styleUrls: ['./aramco-transaction.component.scss'],
})
export class AramcoTransactionComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  fromRow: any;
  noRecordFoundInfoObj: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  routeDetailScreen="/transactionInquiry/aramcoDetailsLayout";
  toRow: any;
  dataSourceToPass: any;
  dataSourceLength: any;
  dataSource: any = [];
  totalRecords: any;
  tablePageSize: any;
  norecordflag: boolean = false;
  currentColumn: string = '';
  sortDirection: string = '';
  refreshClickedFlag = false;
  isLoadingComplete = true;
  responseHeader: any;
  isRefreshFlag: boolean = false;
  advancedSearchFromDate: any;
  filterArray: any = [];
  advancedSearchType: any;
  advancedSearchFromTo: any;
  advancedinvoiceNumber: any;
  advancedSearchsearchWithIN: any;
  advancedSearchdateOrder: any;
  advancedSearchaccnum: any;
  advancedSearchremitterId: any;
  advancedSearchamountFrom: any;
  advancedSearchamountTO: any;
  advancedSearchreqtype: any;
  filterflag: string = '';
  advancedSearchstatus: any;
  textSearch: string = '';
  pageCount:any;
  constructor(private transactionService: TransactionInquiryService,private router: Router) {
    this.rootScopeData.activeTabName = 'aramcoTransfer';
    this.rootScopeData.advSearchCurrentPage = 'aramcoTransaction';
    this.rootScopeData.accountsActiveModule="ARMCOSUM"; 
    this.currentColumn = 'odMakerDate';
    this.sortDirection = 'desc';
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
    this.tablePageSize = pageOptions;
  }
  //  changed based on data
  displayedColumns: string[] = [
    'refNumber',
    'debitAccNo',
    'remitterID',
    // 'odMakerID',
    'invoiceAmount',    
    'txnType',
    'status',
    'action',
  ];
  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      btnLabel: '',
      btnLink: '',
      showBtn: 'false',
      showMsg: 'true',
      showIcon: 'true',
    };

    if(this.rootScopeData.backToPagination.resFlagForService === 'Y'){
      this.fromRow = 1;
      this.toRow = this.rootScopeData.backToPagination.toRow;
      this.getAramcoSummaryData();
      this.rootScopeData.backToPagination.resFlagForService = 'N';
    }else{
      this.getAramcoSummaryData();
    }
    // this.getAramcoSummaryData();
  }
  getAramcoSummaryData() {
    this.isLoadingComplete = false;
    let params = {
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,      
      filterArray: this.filterArray,
      filterFlag:this.filterflag,
      searchText:this.textSearch
    };
    this.transactionService.getAramcoTransactionSummary(params).subscribe(
      (data: any) => {
        this.isLoadingComplete = true;
        if ((data && data.status) || (data.data && !data.data.length)) {
          this.norecordflag = true;
        } else {
          this.norecordflag = false;
          if(data.headerValue !== undefined){
            this.responseHeader = data.headerValue;
          }
          this.dataSourceToPass = data.data;
          // this.dataSource = this.dataSourceToPass;
          if(this.isRefreshFlag === false){
            this.dataSource = this.dataSource.concat(data.data);
          }else{            
            this.dataSource = data.data;
            this.isRefreshFlag = false;
            this.commonPagination.paginator.firstPage();
          }
          this.refreshClickedFlag = false;
          this.dataSourceLength = this.dataSource.length;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.totalRecords = data.headerValue.totalCount;
          this.pageCount = data.headerValue.recordCount;
          this.rootScopeData.aramcoSummaryCount = this.totalRecords;
          
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
        this.norecordflag = true;
      }
    );
  }
  triggerSearchFilter(event: any): void {
    let columnsToSearch = [ 
      {"name":"currency", "fieldType":"ccy1"},
      {"name":"referenceNo", "fieldType":"string"},
      {"name":"debitAccNo", "fieldType":"string"}, 
      {"name":"remitterID", "fieldType":"string"},
      {"name":"odMakerID", "fieldType":"string"},
      {"name":"odStatus", "fieldType":"string"},
      {"name":"invoiceAmount", "fieldType":"amount1"}
    ];
    // let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    // this.dataSourceToPass= new MatTableDataSource(tableData);
    // this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows("aramcoInquirytable", event.target.value);
  }

  triggerDropdownFilter(event: any): void {
    showFilteredRows(this.rootScopeData.filterTableId, event);
  }

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.totalRecords = this.totalRecords;
    this.pageCount = this.pageCount;
    this.commonPagination.paginator.pageSize = 5;
    this.commonPagination.paginator.firstPage();
    this.refreshClickedFlag = true;
    this.getAramcoSummaryData();
    this.filterArray =[]; 
    this.filterflag='';
  }
  redirectToDetails(row: any) {
    this.rootScopeData.aramcoSummaryObject = row;
    this.router.navigate(['/transactionInquiry/aramcoDetailsLayout'])
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.rootScopeData.backToPagination.fromRow = params.fromRow;
    this.rootScopeData.backToPagination.toRow = params.toRow;
    this.rootScopeData.backToPagination.resFlag = 'N';
    this.getAramcoSummaryData();
  }

  selectedRecord(event: any ,element :any){
    this.rootScopeData.aramcoSummaryObject = element;
    event?.stopPropagation();
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    this.isRefreshFlag = true;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.fromRow = 1;
    this.isRefreshFlag = true;
    this.getAramcoSummaryData();
  }

  advancedSearchApply(event:any){
    //debugger;
    this.filterflag ='Y';
    this.advancedSearchaccnum = event.accNum ? event.accNum :'';
    this.advancedSearchremitterId = event.remitter ?event.remitter :'';
    this.advancedSearchamountFrom = event.amountFrom?event.amountFrom :'';
    this.advancedSearchamountTO = event.amountTo ? event.amountTo :'';
    this.advancedSearchreqtype = event.reqType ? event.reqType :'';
    this.currentColumn = 'odMakerDate';
    this.filterArray =[]; 
    // if(this.advancedSearchType == 'invoice'){
       
      let passingObj = {
        "filterField": "referenceNo",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchaccnum,
      }       
      this.filterArray.push(passingObj);

      let passingObj1 = {
        "filterField": "remitterID",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchremitterId,
      }       
      this.filterArray.push(passingObj1);

      let passingObj2 = {
        "filterField": "invoiceAmount",
        "filterConstraint": "amt",
        "fromAmt": this.advancedSearchamountFrom,
        "toAmt": this.advancedSearchamountTO,
      }       
      this.filterArray.push(passingObj2);
      let passingObj3 = {
        "filterField": "txnType",
        "filterConstraint": "contains",
        "filterValue" : this.advancedSearchreqtype
      }    
      this.filterArray.push(passingObj3);


    this.fromRow = 1;
    this.dataSource = [];
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.getAramcoSummaryData();
}

callSearchApi(event:any){
  this.textSearch = event.target.value;
  this.dataSource = [];
  this.filterArray=[];
  this.filterflag='';
  this.fromRow=1;
  this.toRow='';
  this.commonPagination?.paginator?.firstPage();
  this.getAramcoSummaryData();
}
}
