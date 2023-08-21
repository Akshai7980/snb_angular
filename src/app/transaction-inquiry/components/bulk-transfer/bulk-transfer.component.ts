import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { Router } from '@angular/router';
import {
  showFilteredRecords,
  showFilteredRows,
} from 'src/app/utility/tableFilter';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-bulk-transfer',
  templateUrl: './bulk-transfer.component.html',
  styleUrls: ['./bulk-transfer.component.scss'],
})
export class BulkTransferComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;  
  @ViewChild(MatSort) sort!: MatSort;
  @Output() onRefreshClick = new EventEmitter();

  isLoadingComplete: boolean = true;
  noRecordFlag: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;

  contextMenuList: any = [
    { CIF_NO: 'LBL_CHEQUE_BOOK_REQUEST', value: 'chequeBookRequest' },
    { CIF_NO: 'LBL_BOOK_DEPOSIT', value: 'bookDeposit' },
    { CIF_NO: 'LBL_MANAGE_ALIAS', value: 'manageAlias' },
    { CIF_NO: 'LBL_DWNLD_ESTMNT', value: 'downloadEStatement' },
  ];
  noRecordFoundInfoObj: any = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: '',
    btnLink: '',
    showBtn: 'false',
    showMsg: 'true',
    showIcon: 'true',
  };
  displayedColumns: string[] = [
    'transactionId',
    'accountNumber',
    'records',
    'valueDate',
    'amount',
    'fileName',
    'status',
    'action',
  ];
  bulkTransferDetailsRoute: string = '/transactionInquiry/bulkTransferDetails';

  fromRow: any;
  // toRow: number = totalRecordsPerRequest;
  currentColumn: string = 'odMakerDate';
  sortDirection: string = 'desc';

  fileTransfers: any = [];
  fileTransfersDataSource: any;
  totalRecords: any;
  responseHeader: any;
  dataSourceLength:any;
  dataSource: any = [];
  toRow: any;
  isRefreshFlag: boolean = false;
  refreshClickedFlag: boolean = false;

  filterflag:string ="";
  filterconstraint:any;
  filterfield:any;
  filterValue:any;
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchAccount: any; 
  advancedSearchPeriod: any;
  type:any;
  advancedSearchType: any;
  filterArray: any = [];
  textSearch: string = '';
  tablePageSize: any;
  pageCount:any;

  constructor(private readonly transactionService: TransactionInquiryService, private router:Router) {
    this.rootScopeData.activeTabName = 'bulkTransfer';
    this.rootScopeData.accountsActiveModule="FILEPAYMENTINQ"; 
    this.rootScopeData.advSearchCurrentPage = 'transferInquirySingleTransfer';
    this.fromRow = 1;
    this.tablePageSize = pageOptions;
  }

  /**
   * @description set the transaction details
   */
  ngOnInit(): void {
    this.getBulkTransactionDetails();    
  }
  ngAfterViewInit(): void {
    if(this.fileTransfersDataSource){
      this.fileTransfersDataSource.paginator = this.commonPagination.paginator;
    }
  }
  /**
   * @description get transaction details, set records and zero state
   */
  getBulkTransactionDetails(): void {
    this.isLoadingComplete = false;
    this.transactionService
      .getBulkTransferSummary({
        fromRow: this.fromRow,
        toRow: this.toRow,
        sortingColumn: this.currentColumn,
        sortingOrder: this.sortDirection,
        filterArray: this.filterArray,
        searchText:this.textSearch
      })
      .subscribe((transfers: any) => {
        this.isLoadingComplete = true;
        if (transfers.headerValue !== undefined) {
          this.responseHeader = transfers.headerValue;
        }
        if (transfers.data) {  
          if(transfers.data.length ===0){
            this.noRecordFlag = true;
          }
              
          this.noRecordFlag = false;
          // this.fileTransfers = transfers.data;
          
          // this.fileTransfersDataSource = new MatTableDataSource(
          //   this.fileTransfers
          // );

          // this.dataSource = transfers.data;
          if(this.isRefreshFlag === false){
            this.dataSource = this.dataSource.concat(transfers.data);
          }else{
            this.dataSource = transfers.data;
            this.isRefreshFlag = false;
            this.commonPagination.paginator.firstPage();
          }
          this.refreshClickedFlag = false;
          this.fileTransfersDataSource = new MatTableDataSource(this.dataSource);
          this.dataSourceLength=this.dataSource.length; 
          // this.fileTransfersDataSource.paginator = this.commonPagination.paginator;
          // this.totalRecords = data.headerValue.totalCount;
          this.totalRecords = transfers.headerValue.totalCount;
          this.pageCount = transfers.headerValue.recordCount;
          this.rootScopeData.bulkTransferSummaryCount = this.totalRecords;
          this.fileTransfersDataSource.paginator = this.commonPagination.paginator;
          
        } else {
          this.noRecordFlag = true;
        }
      }),
      (err:any) => {
        this.noRecordFlag = true;
        this.isLoadingComplete = true;
      };
  }

  /**
   * @description filter the transfers based on search input
   * @param event event for search input
   */
  searchTransfers(event: any): void {
    let columnsToSearch = [
      { name: 'odDRefNo', fieldType: 'string' },
      { name: 'accNo', fieldType: 'string' },
      { name: 'noOfSuccessTxn', fieldType: 'string' },
      { name: 'odMakerDate', fieldType: 'date' },
      { name: 'odFileAmount', fieldType: 'ccy1' },
      { name: 'odFileName', fieldType: 'string' },
    ];
    // let tableData = showFilteredRecords(
    //   this.fileTransfers,
    //   columnsToSearch,
    //   event.target.value
    // );
    // this.fileTransfersDataSource = new MatTableDataSource(tableData);
    // this.commonPagination.paginator.firstPage();
    // this.fileTransfersDataSource.paginator = this.commonPagination.paginator;
  }

  /**
   * filter the transfers
   * @param {string} selectedFilterValue selected value from filter
   */
  triggerDropdownFilter(selectedFilterValue: string): void {
    showFilteredRows('fileTransferTransactionInquiry', selectedFilterValue);
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
    this.getBulkTransactionDetails();
  }

  /**
   * @description refresh the transfers records
   */
  refreshSummary(): void {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.totalRecords = this.totalRecords;
    this.pageCount = this.pageCount;
    this.commonPagination.paginator.pageSize = 5;
    this.commonPagination.paginator.firstPage();
    this.refreshClickedFlag = true;
    this.filterArray =[]; 
    this.filterflag='';
    this.currentColumn = 'odMakerDate';

    this.getBulkTransactionDetails();
  }

  /**
   * @description set the selected row in global object to view details
   * @param row selected transfer
   */
  isSelected(row: any): void {
    
    this.rootScopeData.sadadBillerSummaryObject = row;
    this.router.navigate(['/transactionInquiry/bulkTransferDetails']);
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getBulkTransactionDetails();
  }
  selectedRecord(event: any, element: any) {
    this.rootScopeData.sadadBillerSummaryObject = element;
    this.bulkTransferDetailsRoute='/transactionInquiry/bulkTransferDetails'
    event?.stopPropagation();
  }


  advancedSearchApply(event:any){
    this.filterflag ='Y';
    this.filterValue ="";
    //debugger;
    this.advancedSearchFromDate = event.fromDate;
    this.advancedSearchFromTo = event.toDate;    
    this.advancedSearchAccount = event.accountNumber; 
    this.advancedSearchPeriod = event.period; 
    this.advancedSearchType = event.type;
    this.filterArray =[]; 
    if(this.advancedSearchType == 'Date'){
       
      let passingObj = {
        "filterField": "valueDate",
        "filterConstraint": "date",
        "fromDate": this.advancedSearchFromDate,
        "toDate": this.advancedSearchFromTo
      }
       
      this.filterArray.push(passingObj);
     
      let passingObj2 = {
        "filterField": "accNo",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchAccount      
      }
       
      this.filterArray.push(passingObj2);
      
    }   
    else if(this.advancedSearchType == 'Period'){   

      let passingObj2 = {
        "filterField": "SELECTED_RANGE",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchPeriod   
      }
       
      this.filterArray.push(passingObj2);

      let passingObj = {
        "filterField": "accNo",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchAccount      
      }
       
      this.filterArray.push(passingObj);
    }
    
    this.fromRow = 1;
    this.dataSource = [];
    this.fileTransfersDataSource ='';
    this.currentColumn =  event.searchwithin;
    this.sortDirection = event.sortOrder;
    this.getBulkTransactionDetails();
}

callSearchApi(event:any){
  this.textSearch = event.target.value;
  this.dataSource = [];
  this.filterArray=[];
  this.filterflag='';
  this.fromRow = 1;
  this.toRow='';
  this.currentColumn = "odMakerDate",
  this.sortDirection ="desc ",
  this.commonPagination?.paginator?.firstPage();
  this.getBulkTransactionDetails();
}
}
