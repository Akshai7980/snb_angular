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
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-credit-card-recent-transactions',
  templateUrl: './credit-card-recent-transactions.component.html',
  styleUrls: ['./credit-card-recent-transactions.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CreditCardRecentTransactionsComponent implements OnInit {
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

  showTransactionId: string = '';

  currentColumn: string = 'txnId';
  sortDirection: string = 'desc';
  fromRow: any = '1';
  toRow: any = '5';
  totalRecords: any;
  dataSourceLength: any;
  displayedColumns: string[] = ['date', 'description', 'amount', 'action'];
  displayedColumnsForExpandData: String[] = [
    'refNum',
    'narration',
    'uniqueTransactionSeqNo',
  ];
  noRecordFoundObject = {
    msg: 'LBL_RECENT_TRANSACTIONS_FOUND',
    showMsg: 'true',
  };

  moreActionLabels: any = [
    {
      display_key: 'LBL_DOWNLOAD_TRANSACTION',
      value: 'Download',
      item_id: '#',
    },
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
    private accService: AccountDetailsService,
    private cardsService: CardsService
  ) {
    this.rootScopeData.advSearchCurrentPage = 'creditCardSummary';
  }

  ngOnInit(): void {
    this.cardDetails = this.rootScopeData.creditCardListDetail;
    this.getRecentTransactionsList();
  }

  ngAfterViewInit(): void {
    this.recentTransactionsDataSource.paginator =
      this.commonPagination.paginator;
  }

  getRecentTransactionsList() {
    this.isLoadingComplete = false;
    const params = {
      accountId: this.cardDetails?.cardId ? this.cardDetails.cardId : ''
    };
    this.cardsService.getRecentTransactions(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        if (res.data.record) {
          this.recentTransactions = res.data.record;
          let statusMap: any = {};
          let transactionTypesMap: any = {};
          this.statuses.push('All');
          this.transactionTypes.push('All');

          this.recentTransactions.forEach((val: any) => {
            if (!statusMap[val.status]) {
              statusMap[val.status] = val.status;
              this.statuses.push(val.status);
            }

            if (!transactionTypesMap[val.transactionCode]) {
              transactionTypesMap[val.transactionCode] = val.transactionCode;
              this.transactionTypes.push(val.transactionCode);
            }
          });

          this.recentTransactionsDataSource = new MatTableDataSource(
            this.recentTransactions
          );
          this.totalRecords = this.recentTransactions.length;
          this.dataSourceLength = this.recentTransactions.length;
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
      { name: 'date', fieldType: 'date' },
      { name: 'description', fieldType: 'string' },
      { name: 'amount', fieldType: 'amount1' },
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

  refreshPayrollInquiry() {
    this.getRecentTransactionsList();
  }

  showTransactionDetails(element: any) {
    this.showTransactionId =
      this.showTransactionId !== element.recordNumber
        ? element.recordNumber
        : '';
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

  showTransferDetails(row: any) {
    this.router.navigate(['/cards/creditCardTransferSummary']);
  }

  getNarrationAPIForPdfCall(data: any) {
    this.isLoadingComplete = false;
    let params = {
      accNumber: this.rootScopeData.accDetailsObject?.res_Acc_No
        ? this.rootScopeData.accDetailsObject?.res_Acc_No
        : '',
      recordId: data.recordId ? data.recordId : '',
    };
    this.accService.getNarrationAPI(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.DATA.res_description) {
          Object.assign(data, {
            NARRATION: res.DATA.res_description,
          });
          this.openPDF(data);
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  openPDF(data: any): void {
    // Object.assign(data, {
    //   branchName: this.rootScopeData.accountsSummaryObject.BRANCH_NAME,
    // // });
    // // Object.assign(data, {
    //   accountName: this.rootScopeData.accDetailsObject.res_Account_Name,
    // // });
    // // Object.assign(data, {
    //   accountType: this.rootScopeData.accountsSummaryObject.OD_ACC_TYPE_2,
    // });
    if (data) {
      let amount;
      let formattedAmount;
      if (data.res_Flag == 'CR') {
        amount = data.res_Credit_Amt;
      } else if (data.res_Flag == 'DR') {
        amount = data.res_Debit_Amt;
      }
      Object.assign(data, { amount: amount });

      let currencyPipe = new CurrencyFormatPipe();
      if (data.res_Txn_CCY) {
        formattedAmount = currencyPipe.transform(data.amount, data.res_Txn_CCY);
      }

      const transactionAmount: any =
        currencyPipe.transform(
          data.amount ? data.amount : '0',
          data.currencyCode
        ) +
        ' ' +
        data.currencyCode;

      let datePipe = new DateFormatPipe();
      let txnDate = this.datePipe?.transform(data.res_Txn_Dt, 'dd-MM-yyyy');
      Object.assign(data, { txnDate: txnDate });
      let processDate = this.datePipe?.transform(data.res_Txn_Dt, 'dd-MM-yyyy');
      Object.assign(data, { processDate: processDate });

      let PDF = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = PDF.internal.pageSize.getWidth();
      //const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let img = new Image();
      img.src = 'assets/images/snb-logo-print.png';
      PDF.addImage(img, 'png', 90, 3, 30, 20);

      PDF.setFontSize(11);
      PDF.setFont('helvetica', 'bold');
      PDF.text(
        this.translateService.instant('LBL_ACC_TRANSACTION_DET_RECEIPT'),
        70,
        35
      );

      PDF.rect(10, 38, 190, 160);
      PDF.rect(15, 60, 180, 130);

      PDF.setFontSize(10);
      PDF.setFont('helvetica', 'bold');
      //PDF.text("Outgoing internal transfer", (pdfWidth/2 - 25), 45);

      PDF.setDrawColor(128);
      PDF.setFillColor(128, 128, 128);
      PDF.rect(15, 51, 90, 6, 'F');

      PDF.setFontSize(10);
      PDF.setTextColor(255, 255, 255);
      PDF.setFont('helvetica', 'bold');
      PDF.text(
        this.translateService.instant('LBL_TRANSACTION_DETAILS'),
        pdfWidth / 2 - 85,
        55
      );

      //if(this.rootScopeData.userInfo.mLanguage == 'en_US'){
      // if (true) {
      //   PDF.setFontSize(9);
      //   PDF.setTextColor(0, 0, 0);
      //   PDF.setFont('helvetica', 'normal');
      //   PDF.text('Account Number', pdfWidth / 2 - 85, 65);
      //   PDF.text('Date', pdfWidth / 2 - 85, 75);
      //   PDF.text('Description', pdfWidth / 2 - 85, 85);
      //   PDF.text('Amount', pdfWidth / 2 - 85, 95);
      //   PDF.text('Processing Date', pdfWidth / 2 - 85, 105);
      //   PDF.text('Branch', pdfWidth / 2 - 85, 115);
      //   PDF.text('Account Name', pdfWidth / 2 - 85, 125);
      //   PDF.text('Account Type', pdfWidth / 2 - 85, 135);
      //   PDF.text('Transaction Description', pdfWidth / 2 - 85, 145);
      //   PDF.text('Beneficiary name', pdfWidth / 2 - 85, 155);
      // } else {
      PDF.setFontSize(9);
      PDF.setTextColor(0, 0, 0);
      //PDF.addFont("assets/fonts/Amiri-Regular.ttf", 'Amiri', 'sans-serif');
      PDF.addFont('assets/fonts/Amiri-Regular.ttf', 'Amiri', 'normal');
      PDF.setFont('Amiri');
      // let accNo = this.translateService.instant('LBL_ACC_NUMBER');
      PDF.text(
        this.translateService.instant('LBL_DATE'),
        pdfWidth / 2 - 85,
        65
      );
      PDF.text(
        this.translateService.instant('LBL_DESCRIPTION'),
        pdfWidth / 2 - 85,
        75
      );
      PDF.text(
        this.translateService.instant('LBL_DR_CR_AMOUNT') +
          this.translateService.instant('LBL_SAR'),
        pdfWidth / 2 - 85,
        85
      );
      PDF.text(
        this.translateService.instant('LBL_REF_NUMBER'),
        pdfWidth / 2 - 85,
        95
      );
      PDF.text(
        this.translateService.instant('LBL_NARRATION'),
        pdfWidth / 2 - 85,
        105
      );
      PDF.text(
        this.translateService.instant('LBL_UNIQ_TRANS_SEQ_NUM'),
        pdfWidth / 2 - 85,
        115,
        {
          maxWidth: 50,
        }
      );
      // PDF.text(
      //   this.translateService.instant('LBL_ACCOUNT_NAME'),
      //   pdfWidth / 2 - 85,
      //   125
      // );
      // PDF.text(
      //   this.translateService.instant('LBL_ACCOUNT_TYPE'),
      //   pdfWidth / 2 - 85,
      //   135
      // );
      // PDF.text(
      //   this.translateService.instant('LBL_TRAN_DESC'),
      //   pdfWidth / 2 - 85,
      //   145
      // );
      // PDF.text(
      //   this.translateService.instant('LBL_BENEFICIARY_NAME'),
      //   pdfWidth / 2 - 85,
      //   155
      // );
      // }
      PDF.text(data.date.toString(), pdfWidth / 2 - 33, 65);
      PDF.text(data.description, pdfWidth / 2 - 33, 75);
      PDF.text(transactionAmount, pdfWidth / 2 - 33, 85, {
        maxWidth: 110,
      });
      PDF.text(data.refNo ? data.refNo : '', pdfWidth / 2 - 33, 95);
      PDF.text(data.description, pdfWidth / 2 - 33, 105);
      PDF.text(data.transactionCode.toString(), pdfWidth / 2 - 33, 115);
      // PDF.text(
      //   data.accountName ? data.accountName : '',
      //   pdfWidth / 2 - 33,
      //   125
      // );
      // PDF.text(
      //   data.accountType ? data.accountType : '',
      //   pdfWidth / 2 - 33,
      //   135
      // );
      // PDF.text(data.NARRATION ? data.NARRATION : '', pdfWidth / 2 - 33, 145, {
      //   maxWidth: 110,
      // });
      // PDF.text(
      //   data.res_beneName ? data.res_beneName : '',
      //   pdfWidth / 2 - 33,
      //   155
      // );

      PDF.setFontSize(6);
      PDF.setTextColor(63, 153, 124);
      PDF.text(
        'The Saudi National Bank | A Saudi Joint Stock Company | Paid-up Capital SAR 44,780,000,000 | VAT Number 300002471110003 | C.R. 4030001588',
        30,
        220
      );
      PDF.text(
        'Under the supervision and control of The Saudi Central Bank | Licensed pursuant to Royal Decree No. 3737 issued on 20/4/1373H (corresponding to 26/12/1953G',
        23,
        227
      );
      PDF.text(
        'Head Office The Saudi National Bank Tower King Abdullah Financial District | King Fahd Road | 3208 - Al Aqeeq District | Unit No. 778 | Riyadh 13519 – 6676 | 920001000 | www.alahli.com | Any reference ',
        10,
        234
      );
      PDF.text(
        'to the National Commercial Bank, NCB or the Bank shall mean the Saudi National Bank',
        60,
        237
      );
      PDF.save('RecentTransaction.pdf');
    }
  }
}
