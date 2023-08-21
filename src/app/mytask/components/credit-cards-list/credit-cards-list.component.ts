import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-credit-cards-list',
  templateUrl: './credit-cards-list.component.html',
  styleUrls: ['./credit-cards-list.component.scss'],
})
export class CreditCardsListComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  noRecordFlag: boolean = false;
  isLoadingComplete: boolean = true;

  creditCardListDataSource: any = {};
  creditCardList: any = [];

  currentColumn: string = 'refNo';
  sortDirection: string = 'desc';
  fromRow: any = '1';
  toRow: any = totalRecordsPerRequest;
  totalRecords: any;
  dataSourceLength: any;
  displayedColumns: string[] = [
    'refNo',
    'cardNo',
    'cardName',
    'serviceType',
    'status',
    'cardDate',
    'action',
  ];
  noRecordFoundObject = {
    msg: 'LBL_NO_RECORDS_FOUND',
    showMsg: 'true',
  };

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  filterField: any;
  filterConstraint: any;
  fromDate: any;
  toDate: any;
  filterflag: any;

  constructor(
    private router: Router,
    private readonly myTaskService: MyTaskService
  ) {
    this.rootScopeData.activeTabName = 'creditCard';
    this.rootScopeData.advSearchCurrentPage = 'creditCardList';
  }

  ngOnInit(): void {
    this.getCreditCardList();
    this.rootScopeData.activeTabName = 'creditCard';
    this.rootScopeData.advSearchCurrentPage = 'creditCardList';
  }

  getCreditCardList(): void {
    this.isLoadingComplete = false;
    this.myTaskService
      .getCreditCardSummary({
        unitId: this.rootScopeData.userInfo.UNIT_ID,
        fromRow: this.fromRow,
        toRow: this.toRow,
        sortColumn: this.currentColumn,
        sortOrder: this.sortDirection,
        filterField: this.filterField,
        fromDate: this.fromDate,
        toDate: this.toDate,
        filterflag: this.filterflag,
      })
      .subscribe(
        (cards: any) => {
          this.isLoadingComplete = true;
          if (cards && cards.data && cards.data.length) {
            this.creditCardList = cards.data;
            this.creditCardListDataSource = new MatTableDataSource(
              this.creditCardList
            );
            this.totalRecords = cards.headerValue.totalCount;
            this.rootScopeData.creditSummaryCount = this.totalRecords;
            this.dataSourceLength = this.creditCardList.length;
            this.creditCardListDataSource.paginator =
              this.commonPagination.paginator;
          }else{
            this.noRecordFlag=true
          }
        },
        () => {
          this.noRecordFlag=true
          this.isLoadingComplete = true;
        }
      );
  }

  advancedSearchApply(event: any): void {
    this.currentColumn = 'cardDate';
    this.sortDirection = event.sortOrder;
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.filterflag = 'Y';
    this.filterField = event.serviceType;
    this.getCreditCardList();
  }

  triggerSearchFilter(event: any): void {
    const columnsToSearch = [
      { name: 'refNo', fieldType: 'string' },
      { name: 'cardNo', fieldType: 'string' },
      { name: 'cardName', fieldType: 'string' },
      { name: 'serviceType', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'cardDate', fieldType: 'date' },
    ];
    const tableData = showFilteredRecords(
      this.creditCardList,
      columnsToSearch,
      event.target.value
    );
    this.creditCardListDataSource = new MatTableDataSource(tableData);
    this.creditCardListDataSource.paginator = this.commonPagination.paginator;
  }

  refreshCreditCardList(): void {
    this.getCreditCardList();
  }

  setModuleId(row: any): string {
    let moduleId = '';
    switch (row.subproductCode) {
      case 'CARDSTP':
        return 'CARDSTPDETAILS';
      case 'CARDACT':
        return 'CARDACTDETAILS';
      case 'CRDVWPIN':
        return 'VEIWPINDETAILS';
      case 'CRDWITHCH':
        return 'CRDWTHDRWDETAILS';
      case 'CRDCRELIM':
        return 'CARDLMTDETAILS';
      case 'CARDPAY':
        return 'CRDPAYDETAILS';
      case 'CRDREISSU':
        return 'CRDREISDETAILS';
      case 'CRDLIMAD':
        return 'CRDLMTADJDETAILS';
    }
    return moduleId;
  }

  sortColumn(column: any): void {
    if (!this.currentColumn || !this.sortDirection) return;
    this.currentColumn = column;
    this.sortDirection === 'desc'
      ? (this.sortDirection = 'asc')
      : (this.sortDirection = 'desc');
    this.toRow = Number(this.toRow - this.fromRow) + 1;
    this.fromRow = 1;
    this.getCreditCardList();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getCreditCardList();
  }

  showDetails(row: any, url: string): void {
    this.isLoadingComplete = false;

    this.myTaskService
      .getServiceTypeBasedDetails({
        unitId: this.rootScopeData.userInfo.UNIT_ID,
        refNo: row.refNo,
        moduleId: this.setModuleId(row),
      })
      .subscribe(
        (details: any) => {
          this.isLoadingComplete = true;
          if (details && details.data) {
            this.rootScopeData.selectedInquiryForStopPayment = {
              summary: row,
              details: details.data,
            };
            this.router.navigate([url]);
          }
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  onClickAuthorize(event: any, element: any): void {
    event.stopImmediatePropagation();
    this.showDetails(element, '/mytask/creditCardAuthorize');
  }

  onClickReject(event: any, element: any): void {
    event.stopImmediatePropagation();
    this.showDetails(element, '/mytask/creditCardReject');
  }
}
