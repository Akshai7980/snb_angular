import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  style,
  state,
  animate,
  transition,
  trigger,
} from '@angular/animations';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import {
  showFilteredRows,
  showFilteredRecords,
} from 'src/app/utility/tableFilter';
import { AccountDetailsService } from '../../services/account-details.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { dateFormateChanger } from 'src/app/utility/common-utility';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { pageOptions } from 'src/app/utility/paginator-config';

@Component({
  selector: 'app-loan-recent-transaction',
  templateUrl: './loan-recent-transaction.component.html',
  styleUrls: ['./loan-recent-transaction.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class LoanRecentTransactionComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  rootScopeData: RootScopeDeclare = RootScopeData;
  loanRecentTransaction: any = [];
  isLoadingCompelete = true;
  displayedColumns: string[] = [
    'res_Val_Dt',
    'res_LoanTypeDesc',
    'res_LoanRefNo',
    'res_Narrative',
    'res_Credit',
    'hide_res_Credit',
    'res_Debit',
    'hide_res_Debit',
    'res_Balance',
    'hide_res_Balance',
  ];
  dataSourceToPass: any;
  advSearchPeriod = '';
  advSearchFromDate: any;
  advSearchToDate: any;
  advSearch: boolean = false;
  norecordflag: boolean = false;
  noRecordFoundInfoObj: any;
  loanAccNum = '';
  dateArray: any;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  totalRecords: any;
  fromRow: any;
  toRow: any;
  tablePageSize: any;
  constructor(
    public accService: AccountDetailsService,
    public datepipe: DatePipe
  ) {
    this.loanAccNum = this.rootScopeData.loanSummaryobject.LOAN_OD_ACC_NO;
    this.rootScopeData.activeTabName = 'loanRecentTransaction';
    this.rootScopeData.advSearchCurrentPage = 'loanDetailsRecentTransactions';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_RECENT_TRANSACTIONS',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'true',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.getLoanRecentTransaction();
  }

  triggerSearchFilter(event: any): void {
    let columnsToSearch = [
      { name: 'res_Txn_CCY', fieldType: 'ccy1' },
      { name: 'res_Val_Dt', fieldType: 'date' },
      { name: 'res_Credit', fieldType: 'amount1' },
      { name: 'res_LoanRefNo', fieldType: 'string' },
      { name: 'res_LoanTypeDesc', fieldType: 'string' },
      { name: 'res_Balance', fieldType: 'amount1' },
    ];
    let tableData = showFilteredRecords(
      this.loanRecentTransaction,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);
  }

  getLoanRecentTransaction() {
    this.isLoadingCompelete = false;
    let params = {
      period: this.advSearchPeriod,
      fromDate: this.advSearchFromDate,
      toDate: this.advSearchToDate,
      data: this.rootScopeData.loanSummaryobject,
    };
    this.accService
      .loanRecentTransactionsApiCall(
        this.rootScopeData.loanSummaryobject.LOAN_OD_ACC_NO,
        params
      )
      .subscribe(
        (res: any) => {
          this.isLoadingCompelete = true;

          if (res.status === 500) {
            this.norecordflag = true;
          } else {
            this.norecordflag = false;
            for (let i = 0; res.DATA.ALL_RECORD.length > i; i++) {
              if (res.DATA.ALL_RECORD[i].res_Val_Dt.includes('/')) {
                this.dateArray = res.DATA.ALL_RECORD[i].res_Val_Dt.split('/');
              } else {
                this.dateArray = res.DATA.ALL_RECORD[i].res_Val_Dt.split('-');
              }
              let day = Number(this.dateArray[0]);
              let month = Number(this.dateArray[1]);
              let year = Number(this.dateArray[2]);
              let date =
                (day > 9 ? day : '0' + day) +
                '/' +
                (month > 9 ? month : '0' + month) +
                '/' +
                year;
              res.DATA.ALL_RECORD[i].res_Val_Dt = dateFormateChanger(date);
            }
            this.loanRecentTransaction = res.DATA.ALL_RECORD;
            this.dataSourceToPass = new MatTableDataSource(
              this.loanRecentTransaction
            );
            this.totalRecords = res.DATA.TOTAL_COUNT;
            this.dataSourceToPass.paginator = this.commonPagination.paginator;
            this.sort.sort({ id: 'res_Val_Dt', start: 'desc' } as MatSortable);
            this.dataSourceToPass.sort = this.sort;
          }
          if (
            this.dataSourceToPass === null ||
            this.dataSourceToPass === '' ||
            this.dataSourceToPass === undefined
          ) {
            this.norecordflag = true;
          }
        },
        (error: any) => {
          this.isLoadingCompelete = true;
          this.norecordflag = true;
        }
      );
  }

  refreshSummary() {
    this.getLoanRecentTransaction();
    // this.onRefreshClick.emit('Y');
  }

  advancedSearchApply(event: any) {
    this.advSearchPeriod = '';
    this.advSearchFromDate = '';
    this.advSearchToDate = '';
    this.advSearchPeriod = event.period;

    let latest_fromdate = event.fromDate;
    let dateArray;
    if (latest_fromdate) {
      if (latest_fromdate.includes('/')) {
        dateArray = latest_fromdate.split('/');
      } else {
        dateArray = latest_fromdate.split('-');
      }

      let day = Number(dateArray[0]);
      let month = Number(dateArray[1]);
      let year = Number(dateArray[2]);
      this.advSearchFromDate =
        (day > 9 ? day : '0' + day) +
        '/' +
        (month > 9 ? month : '0' + month) +
        '/' +
        year;
      // let splitedFromDate = latest_fromdate.split("",10);
      // let fromoMMDDYYYYFormat = splitedFromDate[3]+ +splitedFromDate[4] +"/"+splitedFromDate[0]+ +splitedFromDate[1] +"/"+ splitedFromDate[6]+ +splitedFromDate[7] +splitedFromDate[8]+ +splitedFromDate[9];
      // this.advSearchFromDate =this.datepipe.transform(fromoMMDDYYYYFormat, 'dd-MM-yyyy');
    }
    let latest_toDate = event.toDate;
    if (latest_toDate) {
      if (latest_fromdate.includes('/')) {
        dateArray = latest_toDate.split('/');
      } else {
        dateArray = latest_toDate.split('-');
      }
      let day = Number(dateArray[0]);
      let month = Number(dateArray[1]);
      let year = Number(dateArray[2]);
      this.advSearchToDate =
        (day > 9 ? day : '0' + day) +
        '/' +
        (month > 9 ? month : '0' + month) +
        '/' +
        year;
      // let splitedDate = latest_toDate.split("",10);
      // let toMMDDYYYYFormat = splitedDate[3]+ +splitedDate[4] +"/"+splitedDate[0]+ +splitedDate[1] +"/"+ splitedDate[6]+ +splitedDate[7] +splitedDate[8]+ +splitedDate[9];
      // this.advSearchToDate =this.datepipe.transform(toMMDDYYYYFormat, 'dd-MM-yyyy');
    }
    this.getLoanRecentTransaction();
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getLoanRecentTransaction();
  }
}
