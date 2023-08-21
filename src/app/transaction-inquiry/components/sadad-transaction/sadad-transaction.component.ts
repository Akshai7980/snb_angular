import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';
import { pageOptions, totalRecordsPerRequest} from 'src/app/utility/paginator-config';

@Component({
  selector: 'app-sadad-transaction',
  templateUrl: './sadad-transaction.component.html',
  styleUrls: ['./sadad-transaction.component.scss'],
})
export class SadadTransactionComponent implements OnInit {
  index = -1;
  showDrop = false;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  @ViewChild(MatSort) sort!: MatSort;
  contextMenuList: any = [];
  moreActions: any[] = [];
  fromRow: any;
  noRecordFoundInfoObj: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  transactionInquirySadadTransferDetailsRoute: string = '';
  toRow: any;
  dataSourceToPass: any;
  dataSourceLength: any;
  dataSource: any = [];
  totalRecords: any;
  tablePageSize: any;
  noRecordFlag: boolean = false;
  refreshClickedFlag = false;
  currentColumn = "";
  sortDirection = "";
  pageCount:any;

  isLoadingComplete = true;
  @Output() onRefreshClick = new EventEmitter();
  responseHeader: any;
  isRefreshFlag: boolean = false;
  filterArray:any;
  filterflag : string = '';

  constructor(
    private transactionService: TransactionInquiryService,
    private readonly router: Router
  ) {
    this.rootScopeData.activeTabName = 'sadadTransfer';
    this.rootScopeData.advSearchCurrentPage='transactionInquirySADAD';
    this.rootScopeData.accountsActiveModule="BILPAYSUMM";
    this.currentColumn = 'valueDate';
    this.sortDirection = 'desc';
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
    this.tablePageSize = pageOptions;
  }
  displayedColumns: string[] = [
    'BILLER',
    'SERVICE_TYPE',
    'FROM',
    'REFNUMBER',
    'VALUE_DATE',
    'STATUS',
    'AMT',
    'action',
  ];
  textSearch: string = '';
  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      btnLabel: '',
      btnLink: '',
      showBtn: 'false',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.contextMenuList = [
      { displayName: 'LBL_CHEQUE_BOOK_REQUEST', value: 'cheqeBookRequest' },
      { displayName: 'LBL_BOOK_DEPOSIT', value: 'bookDeposit' },
      { displayName: 'LBL_MANAGE_ALIAS', value: 'manageAlias' },
      { displayName: 'LBL_DWNLD_ESTMNT', value: 'downloadEStatement' },
    ];
    this.moreActions = [
      { display_key: 'LBL_CANCEL_TRANSACTION', value: 'cancelTransaction' },
      { display_key: 'LBL_CLONE_TRANSACTION', value: 'cloneTransaction' },
    ];
    this.getSadadTransactionDetails();
  }
  
  getSadadTransactionDetails() {
    this.isLoadingComplete = false;
    let params = {
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      searchText:this.textSearch,
      filterArray: this.filterArray,
      filterFlag:this.filterflag   
    };
    this.transactionService.getSadadTransactionDetails(params).subscribe((data: any) => {
      // debugger;
      if (data.headerValue !== undefined) {
        this.responseHeader = data.headerValue;
      }
      if((data.status === 500) || (data.data && !data.data.length)){
        this.isLoadingComplete = true;
        this.noRecordFlag = true;
      }else{
        this.isLoadingComplete = true;
        // this.dataSource = data.data;
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(data.data);
        }else{
          // debugger;
          this.dataSource = data.data;
          this.isRefreshFlag = false;
          this.commonPagination.paginator.firstPage();
        }
        // debugger;
        this.refreshClickedFlag = false;
        // this.dataSourceToPass = this.dataSource;
        
        this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        this.dataSourceToPass.paginator = this.commonPagination.paginator;
        this.dataSourceLength = this.dataSourceToPass.length;
        this.dataSourceToPass.sort = this.sort;
        this.totalRecords = data.headerValue.totalCount;
        this.pageCount = data.headerValue.recordCount;
        this.rootScopeData.sadadSummaryCount = this.totalRecords;
        // this.noRecordFlag = this.dataSource ? false : true;
        this.noRecordFlag = false;
      }
      },
      (error: any) => {
        this.isLoadingComplete = true;
        this.noRecordFlag = true;
      });
  }
 
  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.fromRow = 1;
    this.isRefreshFlag = true;
    this.getSadadTransactionDetails();
  }

  triggerSearchFilter(event: any): void {
    let columnsToSearch = [ 
      {"name":"beneAccNo", "fieldType":"string"}, 
      {"name":"beneName", "fieldType":"string"}, 
      {"name":"serviceType", "fieldType":"string"}, 
      {"name":"debitAccNo", "fieldType":"string"}, 
      {"name":"referenceNo", "fieldType":"string"}, 
      {"name":"valueDate", "fieldType":"date"}, 
      {"name":"odStatus", "fieldType":"string"}, 
      {"name":"paymentAmount", "fieldType":"amount"}, 
    ];
    // let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    // this.dataSourceToPass= new MatTableDataSource(tableData);
    // this.commonPagination.paginator.firstPage();
    // this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows('accountsInquirytable', event.target.value);
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
    this.getSadadTransactionDetails();
    this.onRefreshClick.emit('Y');
    this.filterArray =[]; 
    this.filterflag='';
  }
  redirectToDetails(element: any) {
    this.rootScopeData.transactionInquiry = element;
    if(element.subProdCode === "SADADPAY"){
    this.router.navigate(['/transactionInquiry/sadadDetailsLayout']);
    }
    if(element.subProdCode === "SADMOIPAY"){
      this.router.navigate(['/transactionInquiry/sadadMoiDetailsLayout']);
    }
    if(element.subProdCode === "SADMOIRF"){
      this.router.navigate(['/transactionInquiry/sadadMoiRefundReqDetailsLayout']);
    }
    if(element.subProdCode === "ESALPAY"){
      this.router.navigate(['/transactionInquiry/esalPaymentDetailsLayout']);
    }
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getSadadTransactionDetails();
  }
  displayDropDown(i: any) {
    this.showDrop = !this.showDrop;
    this.index = i;
  }

  selectedRecord(event: any, element: any): void {
    this.rootScopeData.transactionInquiry = element;
    if(element.subProdCode === "SADADPAY"){
      this.transactionInquirySadadTransferDetailsRoute = "/transactionInquiry/sadadDetailsLayout";
      }
      if(element.subProdCode === "SADMOIPAY"){
        this.transactionInquirySadadTransferDetailsRoute = "/transactionInquiry/sadadMoiDetailsLayout";
      }
      if(element.subProdCode === "SADMOIRF"){
        this.transactionInquirySadadTransferDetailsRoute = "/transactionInquiry/sadadMoiRefundReqDetailsLayout";
      }
      if(element.subProdCode === "ESALPAY"){
        this.transactionInquirySadadTransferDetailsRoute = "/transactionInquiry/esalPaymentDetailsLayout";
      }
    event?.stopPropagation();
  }
  advancedSearchApply(event:any){
    // console.log(event)
    this.filterflag ='Y';
    this.filterArray =[]; 
    // if(this.advancedSearchType == 'invoice'){
       
      let passingObj = {
        "filterField": "beneName",
        "filterConstraint": "contains",
        "filterValue": event?.biller,
      }       
      this.filterArray.push(passingObj);

      let passingObj1 = {
        "filterField": "valueDate",
        "filterConstraint": "date",
        "filterValue": "",
        "fromAmt": "",
        "toAmt": "",
        "fromDate": event?.fromDate,
        "toDate": event?.toDate
      }       
      this.filterArray.push(passingObj1);

      let passingObj2 = {
        "filterField": "paymentAmount",
        "filterConstraint": "amt",
        "fromAmt": event?.fromAmount,
        "toAmt": event?.toAmount,
      }       
      this.filterArray.push(passingObj2);

      let passingObj3 = {
        "filterField": "referenceNo",
        "filterConstraint": "contains",
        "filterValue": event?.referenceNo,
        
      }       
      this.filterArray.push(passingObj3);

      let passingObj4 = {
        "filterField": "serviceType",
        "filterConstraint": "contains",
        "filterValue": event?.serviceType,
       
      }       
      this.filterArray.push(passingObj4);
     
      this.sortColumn = event.sortColumn;
this.sortDirection = event.orderType;
		
    this.fromRow = 1;
    this.dataSource = [];
    this.getSadadTransactionDetails();
  }

  callSearchApi(event:any){
    this.textSearch = event.target.value;
    this.dataSource = [];
    this.filterArray=[];
    this.filterflag='';
    this.fromRow=1;
    this.toRow='';
    this.commonPagination?.paginator?.firstPage();
    this.getSadadTransactionDetails();
  }
}
