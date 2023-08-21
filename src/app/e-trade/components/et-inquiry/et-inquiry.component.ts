import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { ETradeService } from '../../services/e-trade.service';

@Component({
  selector: 'app-et-inquiry',
  templateUrl: './et-inquiry.component.html',
  styleUrls: ['./et-inquiry.component.scss'],
})
export class EtInquiryComponent implements OnInit {
  isLoadingComplete: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;

  fromAccounts: any = [];
  fromAccountsObject: any;
  selectedFromAccount: any;

  showLgList: boolean = false;
  lgList: any = [];

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  @ViewChild(MatSort) sort!: MatSort;
  lgListDataSource = new MatTableDataSource();
  moreActionsList = [
    {
      display_key: 'LBL_AMEND',
      value: 'amendLg',
      item_id: 'E_TRADE_AMEND',
    },
  ];
  displayedColumns = [
    'lgNumber',
    'lgObligationCodeDescriptionEng',
    'customerNameEng',
    'lgTextLanguage',
    'status',
    'action',
  ];
  noRecordFound: boolean = false;
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_LG_FOUND',
    showBtn: 'false',
    showMsg: 'true',
    showIcon: 'true',
  };

  showDetails: boolean = false;
  applicantDetails: any;
  issueDetails: any;

  constructor(private readonly eTradeService: ETradeService) {}

  ngOnInit(): void {
    this.rootScopeData.advSearchCurrentPage = 'eTradeInquiry';
    this.isLoadingComplete = false;
    this.eTradeService.getFromAccounts().subscribe(
      (accounts: any) => {
        this.isLoadingComplete = true;
        if (accounts.DATA && accounts.DATA.ALL_RECORDS) {
          this.fromAccounts = accounts.DATA.ALL_RECORDS;
          this.fromAccountsObject = {
            title: 'LBL_FROM',
            data: this.fromAccounts,
            fieldDetails: [
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'LIAS_NAME',
              },
              {
                dispKey: 'LBL_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: 'CURR_AVAIL_BAL_AMOUNT_NEW',
                dataKeySupport: 'OD_CCY_CODE',
              },
            ],
          };
          if (accounts.DATA.ALL_RECORDS.length === 1) {
            this.onFromAccountSelection(accounts.DATA.ALL_RECORDS[0]);
          }
        }
        // this.rootScopeData.userInfo.maskingFlag
        // ? 'HIDDEN'
        // :
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  onFromAccountSelection(account: any): void {
    if (account === 'iconClick') {
      this.lgList = [];
      this.lgListDataSource = new MatTableDataSource();
      this.showLgList = false;
    } else {
      this.isLoadingComplete = false;
      this.selectedFromAccount = account;
      this.eTradeService
        .getLgList({
          cif: this.selectedFromAccount.COD_CORECIF,
          unitId: this.selectedFromAccount.UNIT_ID,
        })
        .subscribe(
          (lg: any) => {
            this.isLoadingComplete = true;
            if (lg.dataValue && lg.dataValue.lg && lg.dataValue.lg.length) {
              this.lgList = lg.dataValue.lg.map((lg: any) => {
                return {
                  ...lg,
                  lgTextLanguage: lg.lgTextLanguage === 'E' ? 'English' : 'Arabic'
                }
              });
              this.lgListDataSource = new MatTableDataSource(this.lgList);
              this.lgListDataSource.paginator = this.commonPagination.paginator;
              this.lgListDataSource.sort = this.sort;
              this.noRecordFound = false;
            } else {
              this.noRecordFound = true;
            }
          },
          () => {
            this.noRecordFound = true;
            this.isLoadingComplete = true;
          }
        );
      this.showLgList = true;
    }
  }

  triggerSearchFilter(filterValues: any) {
    const columnsToSearch = [
      { name: 'lgNumber', fieldType: 'string' },
      { name: 'lgObligationCodeDescriptionEng', fieldType: 'string' },
      { name: 'customerNameEng', fieldType: 'string' },
      { name: 'lgTextLanguage', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
    ];
    const tableData = showFilteredRecords(
      this.lgList,
      columnsToSearch,
      filterValues.target.value
    );
    this.lgListDataSource = new MatTableDataSource(tableData);
    this.lgListDataSource.paginator = this.commonPagination.paginator;
  }

  refreshLgList(): void {
    this.onFromAccountSelection(this.selectedFromAccount);
  }

  selectedRecord(event: any, lg: any): void {
    this.eTradeService
      .getDetails({
        lgNumber: lg.lgNumber,
      })
      .subscribe(
        (applicant) => {
          this.isLoadingComplete = true;
          this.applicantDetails = applicant.data[0];
          this.rootScopeData.selectedInquiryForStopPayment = {
            fromAccount: this.selectedFromAccount,
            toAccount: this.applicantDetails,
            lg: lg,
          };
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
    event?.stopImmediatePropagation();
  }

  showLgDetails(lg: any): void {
    this.isLoadingComplete = false;
    this.eTradeService
      .getDetails({
        lgNumber: lg.lgNumber,
      })
      .subscribe(
        (applicant) => {
          this.isLoadingComplete = true;
          if (!applicant.data) {
            this.rootScopeData.showSystemError = true;
            this.rootScopeData.toastMessage = "LBL_UNABLE_TO_FETCH_LG_DETAILS";
          }
          this.applicantDetails = applicant.data[0];
          this.rootScopeData.selectedInquiryForStopPayment = {
            fromAccount: this.selectedFromAccount,
            toAccount: this.applicantDetails,
            lg: lg,
          };
          this.showDetails = true;
        },
        () => {
          this.isLoadingComplete = true;
        }
      );
  }

  closeDetails(close: boolean): any {
    if (close) {
      this.showDetails = false;
      this.onFromAccountSelection('iconClick');
    }
  }

  advancedSearchApply(searchValues: any): void {
    // const keys = ['lgObligationCodeDescriptionEng', 'lgTextLanguage', 'customerNameEng', 'status'];
    // const values = [searchValues.type, searchValues.language, searchValues.fullName, searchValues.status];
    let filteredData = this.lgList.filter((x:any)=>
     x.lgTextLanguage.toLowerCase().includes(searchValues.language.toLowerCase())  &&
      x.customerNameEng.toLowerCase().includes(searchValues.fullName.toLowerCase()) && 
      x.lgObligationCodeDescriptionEng.toLowerCase().includes(searchValues.type.toLowerCase()) && 
      x.status.toLowerCase().includes(searchValues.status.toLowerCase()))
      this.lgListDataSource = new MatTableDataSource(filteredData);
      this.lgListDataSource.paginator = this.commonPagination.paginator;
  }

}
 