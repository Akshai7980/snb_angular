import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { AccountDetailsService } from 'src/app/accounts/services/account-details.service';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { EpayServiceService } from '../../services/epay-service.service';

@Component({
  selector: 'app-transaction-lookup',
  templateUrl: './transaction-lookup.component.html',
  styleUrls: ['./transaction-lookup.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ]
})
export class TransactionLookupComponent implements OnInit {

  noRecordFlag: boolean = false;
  isLoadingComplete: boolean = true;

  setDownload: boolean = true;
  cifNumber: any;
  unitId: any;
  portalAccNumber: any;
  accNumber: any;
  advSearchPeriod = '';
  advSearchFromDate: any;
  advSearchToDate: any;
  cardDetails: any;

  isExpanded: any = false;
  recentTransactionsDataSource: any = {};
  recentTransactions: any = [];

  showTransactionId: number = 0;

  currentColumn: string = 'txnId';
  sortDirection: string = 'desc';
  fromRow: any = '1';
  toRow: any = '5';
  totalRecords: any;
  dataSourceLength: any;
  displayedColumns: string[] = ['transactionReference', 'orderId', 'cardType', 'maskedpan', 'transactionDate', 'feesAmount' , 'action'];
  displayedColumnsForExpandData: String[] = [
    'authorizationNumber',
    'transactionTime',
    'transactionDate',
    'feesAmount',
    'feesAmount',
    'feesAmount'
  ];
  noRecordFoundObject = {
    msg: 'LBL_RECENT_TRANSACTIONS_FOUND',
    showMsg: 'true',
  };

  moreActionLabels: any = [
    {
      display_key: 'LBL_MERCHNT_CLAIM',
      value: 'epayMerchantFinaceDispute',
      item_id: 'EPAY_MERCHANT_FINANCE_DISPUTE',
    },{
      display_key: 'LBL_MADA_REFUND_REQUEST_RECEIPT',
      value: 'epayRefundRequest',
      item_id: 'EPAY_REFUND_REQUEST'
    }
  ];

  statuses: any = [];
  transactionTypes: any = [];

  rootScopeData: RootScopeDeclare = RootScopeData;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  datePipe: any;
  filterArray: any = [];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private ePayService: EpayServiceService
  ) {
    this.rootScopeData.advSearchCurrentPage = 'ePayTransactions';
  }
  ngOnInit(): void {    
    this.getRecentTransactionsList();
  }

  ngAfterViewInit(): void {
    this.recentTransactionsDataSource.paginator =
      this.commonPagination.paginator;
  }
  refreshEPayTransaction() {
    this.getRecentTransactionsList();
  }
  selectedRecord(event: any, element: any) {
    // rootscope set elemetn
    this.rootScopeData.selectedEPayTransaction=element;
  }
  getRecentTransactionsList() {
    // alert("test")
    this.isLoadingComplete = false;
    // console.log("test::9:")
    let params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      "cardTypeList": [], // Harshitha need to confirm, backend query
      "terminalList": [],
      "transactionReference": "",
      "reconciliationFromDate": "",
      "reconciliationToDate": "",
      "authorizationNumber": "", 
      "settled": "", // waiting reply from Backend 
      "dateSort": "", // waiting reply from Backend 
      "pageSize": 50, // waiting reply from Backend 
      "pageNumber": 1, // waiting reply from Backend 
      "offlineReport": true, // waiting reply from Backend 
      "offlineReportOwner": "" // waiting reply from Backend 
    };
    // console.log("test:::")
    this.ePayService.getEpayTransactions(params).subscribe(
      (res: any) => {
        // console.log("TESTLLL::::999999:::::",res)
        this.isLoadingComplete = true;
        // console.log(res?.data?.success?.ecommerceTransactionsList?.ecommerceTransactions,"TEST:::::")
        if (res?.dataValue?.ecommerceTransactionsList?.ecommerceTransactions) {
          this.recentTransactions = res?.dataValue?.ecommerceTransactionsList?.ecommerceTransactions;
          let statusMap: any = {};
          let transactionTypesMap: any = {};
          this.statuses.push('All');
          this.transactionTypes.push('All');

          // this.recentTransactions.forEach((val: any) => {
          //   if (!statusMap[val.status]) {
          //     statusMap[val.status] = val.status;
          //     this.statuses.push(val.status);
          //   }

          //   if (!transactionTypesMap[val.transactionCode]) {
          //     transactionTypesMap[val.transactionCode] = val.transactionCode;
          //     this.transactionTypes.push(val.transactionCode);
          //   }
          // });

          this.recentTransactionsDataSource = new MatTableDataSource(
            this.recentTransactions
          );
          this.totalRecords = this.recentTransactions.length;
          this.dataSourceLength = this.recentTransactions.length;
          // console.log(this.recentTransactions,"TESTLLL:::::")
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  advancedSearchApply(event: any): void {
    const advancedSearchFromDate = event.dateFrom;
    const advancedSearchFromTo = event.dateTo;
    const advancedSearchAmount = event.amountFrom;
    const advancedSearchTo = event.amountTo;
    const advancedSearchSelectedStatus = event.selectedStatus;
    const advancedSearchTransactionType = event.transactionType;

    const tableData = this.recentTransactions.filter((val: any) => {
      const amount: any =
        !advancedSearchAmount || !advancedSearchTo
          ? true
          : parseInt(val.amount) >= parseInt(advancedSearchAmount) &&
          parseInt(val.amount) <= parseInt(advancedSearchTo);
      const date: any =
        new Date(val.date) >= advancedSearchFromDate &&
        new Date(val.date) <= advancedSearchFromTo;
      const type: any =
        !advancedSearchTransactionType ||
          advancedSearchTransactionType === 'All'
          ? true
          : val.transactionCode === advancedSearchTransactionType;
      const status: any =
        !advancedSearchSelectedStatus || advancedSearchSelectedStatus === 'All'
          ? true
          : val.status === advancedSearchSelectedStatus;
      if (amount && date && type && status) return val;
    });
    this.recentTransactionsDataSource = new MatTableDataSource(tableData);
    this.recentTransactionsDataSource.paginator =
      this.commonPagination.paginator;
  }

  triggerSearchFilter(event: any) {
    const columnsToSearch = [
      { name: 'transactionReference', fieldType: 'string' },
      { name: 'orderId', fieldType: 'string' },
      { name: 'cardType', fieldType: 'string' },
      { name: 'maskedpan', fieldType: 'string' },
      { name: 'transactionDate', fieldType: 'string' },
      { name: 'feesAmount', fieldType: 'string' }
    ];
    const tableData = showFilteredRecords(
      this.recentTransactions,
      columnsToSearch,
      event.target.value
    );
    this.recentTransactionsDataSource = new MatTableDataSource(tableData);
    this.recentTransactionsDataSource.paginator =
      this.commonPagination.paginator;
  }
  showTransactionDetails(element: any) {
    this.showTransactionId =
      this.showTransactionId !== element.transactionReference
        ? element.transactionReference
        : 0;

        // console.log(this.showTransactionId,"TEST:::LL::")
  }

  sortColumn(column: any) {
    if (!this.currentColumn || !this.sortDirection) return;
    this.currentColumn = column;
    this.sortDirection === 'desc'
      ? (this.sortDirection = 'asc')
      : (this.sortDirection = 'desc');
    this.toRow = Number(this.toRow - this.fromRow) + 1;
    this.fromRow = 1;
    this.getRecentTransactionsList();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getRecentTransactionsList();
  }

  // showTransferDetails(row: any) {
  //   // no detail page
  // }


  // onClickCancel(){
  //   this.hideTransaction.emit(true)
  // }
  // proceedNext(){
  //   if(this.totalAmount < 0 || this.totalAmount == 0 ){
  //     this.amountValidError = true;
  //     return;
  //   }if (this.selectedRows.length > 0) {
  //     this.dataSource = []
  //     if (this.selectedRows.length > 0) {

  //       this.selectedRows.forEach((element: any) => {
  //         if (element) {
  //           element.IS_SELECTED = false
  //           this.dataSource.push(element)
  //         }
  //       });
  //       this.displayedColumns = [
  //         'refNo',
  //         'sequence',
  //         'cardType',
  //         'cardNo',
  //         'date',
  //         'amount',
  //       ];
  //       this.isProceed = true;
  //       this.hideBtn = true;
  //       this.displayDetals.emit(this.dataSource)
  //       let formatTotal = (this.currencyPipe.transform(this.totalAmount, this.ccy));
  //       this.grandTotal.emit(formatTotal)
  //     }
  //   }
  // }

}
