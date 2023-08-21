import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RootScopeData } from '../../../rootscope-data';
import { RootScopeDeclare } from '../../../rootscope-declare';
import {
  showFilteredRecords,
  showFilteredRows,
} from 'src/app/utility/tableFilter';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { Router } from '@angular/router';
import {
  totalRecordsPerRequest,
  pageOptions,
} from 'src/app/utility/paginator-config';
import { CardsService } from '../../services/cards.service';
import { MaskCardNumberPipe } from 'src/app/pipes/mask-card-number.pipe';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit, AfterViewInit {
  contextMenuList = [];

  creditCardList: any = [];

  creditCardListDataSource: any = {};
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  displayedColumns: string[] = [
    'cardId',
    'holderName',
    'cardType',
    'statusDescription',
    'balance',
    'action',
    'cifNo',
  ];
  dataSourceToPass: any;

  moreActionListActive: any = [
    {
      display_key: 'LBL_VIEW_PIN',
      item_id: 'VIEW_PIN',
    },
    {
      display_key: 'LBL_CHANGE_CARD_LIMIT',
      item_id: 'CHANGE_CARD_LIMIT',
    },
    {
      display_key: 'LBL_STOP_CARD',
      item_id: 'STOP_CARD',
    },
    {
      display_key: 'LBL_CHANGE_WITHDRAWAL_LIMIT',
      item_id: 'CHANGE_WITHDRAWAL_LIMIT',
    },
    {
      display_key: 'LBL_RE_ISSUE_CARD',
      item_id: 'RE_ISSUE_CARD',
    }
  ];

  moreActionListInActive: any = [
    {
      display_key: 'LBL_RE_ISSUE_CARD',
      item_id: 'RE_ISSUE_CARD',
    },
  ];

  rootScopeData: RootScopeDeclare = RootScopeData;
  responseHeader: any = {};
  currentColumn: string = '';
  sortDirection: string = '';
  fromRow: number;
  toRow: number;
  tablePageSize: number[];
  totalRecords: string = '';
  isLoadingComplete: boolean = true;
  noRecordFlag: boolean = false;
  noRecordFoundInfoObj: any = {};
  creditCardListLength: any;

  constructor(private router: Router, private cards: CardsService) {
    this.rootScopeData.activeTabName = 'credit';
    this.rootScopeData.filterTableId = 'creditCardsInquiryTable';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;

    this.responseHeader.sortColumn = '';
    this.responseHeader.sortOrder = 'desc';
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_CREDIT_CARD_RECORDS_FOUND',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'true',
      showMsg: 'true',
      showIcon: 'true',
    };
    // this.responseHeader.totalCount = '10';
    // this.totalRecords = this.responseHeader.totalCount;
    this.getCreditCardList();
    this.getCifLookup();
  }

  ngAfterViewInit(): void {
    this.creditCardListDataSource.paginator = this.commonPagination.paginator;
  }

  getCifLookup() {
    this.isLoadingComplete = false;
    this.cards.getCifLookup().subscribe((res: any) => {
      this.isLoadingComplete = true;
      this.contextMenuList = res?.dataValue.map((val: any) => {
        return {
          displayName: val.cifName,
          CIF_NO: val.cifNo,
          value: val.cifNo,
        };
      });
    }, () => {
      this.isLoadingComplete = true;
    });
  }

  triggerDropdownFilter(event: any) {
    showFilteredRows(this.rootScopeData.filterTableId, event);
  }

  advancedSearchApply(event: any) {
    //login needs to update after API integration
  }

  onActivateCard() {
    const item_id = 'ACTIVATE_CARD';
    const urlToNavigate = this.rootScopeData.urlMapping[item_id];
    this.router.navigate([urlToNavigate]);
  }

  onClickRecord(row: any) {
    const maskCardNumber = new MaskCardNumberPipe();
    this.rootScopeData.creditCardListDetail = row;
    // this.rootScopeData.creditCardListDetail.maskedCardId = maskCardNumber.transform(
    //   row.cardId
    // );
    this.rootScopeData.creditCardListDetail.maskedCardId = row.maskedCardId;
    this.router.navigate(['/cards/creditCardSummaryDetails']);
  }

  selectedRecord(event: any, element: any) {
    event?.stopPropagation();
    this.moreActionListActive = [];
    // if (element.cardStatusCode !== '0') {
      element.subProducts.includes('CRDVWPIN') &&
        this.moreActionListActive.push({
          display_key: 'LBL_VIEW_PIN',
          item_id: 'VIEW_PIN',
        });

      element.subProducts.includes('CRDWITHCH') &&
        this.moreActionListActive.push({
          display_key: 'LBL_CHANGE_WITHDRAWAL_LIMIT',
          item_id: 'CHANGE_WITHDRAWAL_LIMIT',
        });

      element.subProducts.includes('CARDSTP') &&
        this.moreActionListActive.push({
          display_key: 'LBL_STOP_CARD',
          item_id: 'STOP_CARD',
        });

      element.subProducts.includes('CRDCRELIM') &&
        this.moreActionListActive.push({
          display_key: 'LBL_CHANGE_CARD_LIMIT',
          item_id: 'CHANGE_CARD_LIMIT',
        });
    // } else {
      element.subProducts.includes('CRDREISSU') &&
        this.moreActionListActive.push({
          display_key: 'LBL_RE_ISSUE_CARD',
          item_id: 'RE_ISSUE_CARD',
        });
    // }

    // const maskCardNumber = new MaskCardNumberPipe();

    this.rootScopeData.creditCardMoreActionList = element;
    this.rootScopeData.creditCardListDetail = element;
    // this.rootScopeData.creditCardListDetail.maskedCardId = maskCardNumber.transform(
    //   element.cardId
    // );

    this.rootScopeData.creditCardListDetail.maskedCardId = element.maskedCardId;
  }

  // selectedRecord(event: any, element: any) {
  //   const maskCardNumber = new MaskCardNumberPipe();

  //   this.rootScopeData.creditCardMoreActionList = element;
  //   this.rootScopeData.creditCardListDetail = element;
  //   // this.rootScopeData.creditCardListDetail.maskedCardId = maskCardNumber.transform(
  //   //   element.cardId
  //   // );

  //   this.rootScopeData.creditCardListDetail.maskedCardId = element.maskedCardId;
  //   event?.stopPropagation();
  // }

  getCreditCardList() {
    let params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.isLoadingComplete = false;
    this.cards.getCardSummaryList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        let creditCardList = [];
        this.rootScopeData.totalNumberOfCreditCards =
          res.dataValue?.pageDetails.totalNumberOfResults;
        const currencyPipe = new CurrencyFormatPipe();
        if (res.dataValue?.entityCardDetailsList) {
          creditCardList =
            res.dataValue.entityCardDetailsList.entityCardDetails.map(
              (val: any) => {
                return {
                  cardId: val?.cardDetails?.responseCardIdentifier?.pan
                    ? val.cardDetails.responseCardIdentifier.pan
                    : '',
                  holderName: `${val?.cardDetails?.firstName} ${val?.cardDetails?.lastName}`,
                  cardType: val.cardProduct?.description
                    ? val.cardProduct?.description
                    : '',
                  statusDescription: val.cardStatus?.description
                    ? val.cardStatus?.description
                    : '',
                  balance: val.linkedAccountsList?.linkedAccount[0]?.accountDetails
                    ?.availableBalance
                    ? currencyPipe.transform(
                        val.linkedAccountsList?.linkedAccount[0].accountDetails
                          .availableBalance,
                        val.linkedAccountsList?.linkedAccount[0]?.accountDetails
                          ?.curCurrency
                      )
                    : '',
                  currency: val.linkedAccountsList?.linkedAccount[0]
                    ?.accountDetails?.curCurrency
                    ? val.linkedAccountsList?.linkedAccount[0].accountDetails
                        .curCurrency
                    : '',
                  cifNo: val.CifMap[0].shortCIF ? val.CifMap[0].shortCIF : '',
                  accountId: val.linkedAccountsList?.linkedAccount[0]
                    .accountDetails?.accountNumber
                    ? val.linkedAccountsList?.linkedAccount[0].accountDetails
                        .accountNumber
                    : '',
                  expiryDate: val.cardDetails?.expiryDate
                    ? val.cardDetails?.expiryDate
                    : '',
                  creditLimit: val.linkedAccountsList?.linkedAccount[0]
                    ?.accountDetails?.creditLimit
                    ? val.linkedAccountsList?.linkedAccount[0].accountDetails
                        .creditLimit
                    : '',
                  cardProduct: val?.cardProduct,
                  cardStatus: val?.cardStatus,
                  linkedAccountsList: val?.linkedAccountsList,
                  maskedCardId: val?.cardDetails?.responseCardIdentifier?.maskedPan
                    ? val.cardDetails.responseCardIdentifier.maskedPan
                    : '',
                  subProducts: val.CifMap[0].EntlSubProduct
                   ? val.CifMap[0].EntlSubProduct
                   : '',
                  cardStatusCode: val.cardStatus.statusCode
                  ? val.cardStatus.statusCode
                  : ''
                }
              }
            );
          this.creditCardList = creditCardList;
        }

        if (this.creditCardList && this.creditCardList.length) {
          this.noRecordFlag = false;
          this.creditCardListLength = this.creditCardList.length;
          this.totalRecords = res.dataValue.pageDetails.totalNumberOfResults;
          this.creditCardListDataSource = new MatTableDataSource(
            this.creditCardList
          );
          this.creditCardListDataSource.paginator =
            this.commonPagination?.paginator;
        } else {
          this.noRecordFlag = true;
        }
      },
      (error: any) => {
        this.noRecordFlag = true;
        this.isLoadingComplete = true;
      }
    );
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'cardId', fieldType: 'string' },
      { name: 'holderName', fieldType: 'string' },
      { name: 'cardType', fieldType: 'string' },
      { name: 'statusDescription', fieldType: 'string' },
      { name: 'balance', fieldType: 'string' },
    ];

    const tableData = showFilteredRecords(
      this.creditCardList,
      columnsToSearch,
      event.target.value
    );
    if (tableData && tableData.length) {
      this.noRecordFlag = false;
      this.creditCardListDataSource = new MatTableDataSource(tableData);
      this.creditCardListDataSource.paginator = this.commonPagination.paginator;
    } else {
      this.noRecordFlag = true;
    }
  }

  refreshPayrollInquiry() {
    this.getCreditCardList();
  }

  onMoreActionClick(event: any) {}

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getCreditCardList();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getCreditCardList();
  }
}
