import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { CardsService } from '../../services/cards.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-account-details-for-card',
  templateUrl: './account-details-for-card.component.html',
  styleUrls: ['./account-details-for-card.component.scss']
})


export class AccountDetailsForCardComponent implements OnInit, AfterViewInit {

  @Output() selectedAccount = new EventEmitter<any>();

  displayedColumns: string[] = ['accNumber', 'nickName', 'fullName', 'status', 'balance'];
  //debitAccountDetailsObj:any;
  debitDataObj: any;
  currentColumn: string = 'accNumber';
  sortDirection: string = 'desc';
  noRecordFoundInfoObj = {
    "msg": "LBL_NO_ACCOUNTS_FND",
    "showMsg": "true",
    "showIcon": "true"
  };

  fromRow: any = "1";
  toRow: any = "5";
  searchShownFlag = true;

  noRecordFlag: boolean = false;
  isLoadingComplete: boolean = true;

  accountDetailsToPass: any;
  dataSourceLength: any;
  totalRecords: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  fromAccounts: any = [];
  fromAccountsObject: any;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  constructor(private cardsService: CardsService, private translateService: TranslateService,) { }

  ngOnInit(): void {
    this.getDebitData();
  }

  ngAfterViewInit(): void {
    //this.accountDetailsToPass.paginator = this.commonPagination.paginator;
  }


  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    //this.getAccountDetails();
    this.getDebitData();
  }

  getDebitData() {
    this.isLoadingComplete = false;
    // this.cardservice.getDebitLookUp().subscribe((debData: any) => {
    //   this.isLoadingComplete = true;
    //   if (debData) {
    //     let debitData = debData.DATA.ALL_RECORDS;

    //     for (let i in debitData) {         
    //       let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMT;
    //       let convtd_ccy = debitData[i].OD_CCY_CODE;
    //       let convtd_amount ='';
    //       if(crntAvail_amount && convtd_ccy){
    //         let currencyFormatPipeFilter = new CurrencyFormatPipe();
    //          convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
    //          debitData[i].CURR_AVAIL_BAL_AMT = convtd_amount;
    //          debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
    //       }               
    //     } 

    //     this.debitDataObj = {
    //       "title": "LBL_FROM",
    //       "data": debitData,
    //       "fieldDetails": [
    //         {
    //           "dispKey": "LBL_NICKNAME",
    //           "dataKey": "ALIAS_NAME"
    //         },
    //         {
    //           "dispKey": "LBL_ACC_NUMBER",
    //           "dataKey": "OD_ACC_NO"
    //         },
    //         {
    //           "dispKey": "LBL_FULL_NAME",
    //           "dataKey": "LIAS_NAME"
    //         },
    //         {
    //           "dispKey": "LBL_STATUS",
    //           "dataKey": "STATUS"
    //         },
    //         {
    //           "dispKey": "LBL_BALANCE",
    //           "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMT",
    //           "dataKeySupport":"OD_CCY_CODE"
    //         }
    //       ]
    //     };
    //   }
    // }, error => {
    //   this.isLoadingComplete = true;
    // })
    this.isLoadingComplete = false;
    this.cardsService.getAccountsforAddMada().subscribe(
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
  onFromAccountSelection(event: any) {

  }
  triggerSearchFilter(event: any) {
    // const columnsToSearch = [
    //   { "name": "accNumber", "fieldType": "string" },
    //   { "name": "nickName", "fieldType": "string" },
    //   { "name": "fullName", "fieldType": "string" },
    //   { "name": "status", "fieldType": "string" },
    //   { "name": "balance", "fieldType": "string" }
    // ];
    // // let tableData = showFilteredRecords(this.accountDetails, columnsToSearch, event.target.value);
    // this.accountDetailsToPass = new MatTableDataSource(tableData);
    // this.accountDetailsToPass.paginator = this.commonPagination.paginator;
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getDebitData();
  }

  goToDetailsScreen(event: any) {
    //console.log(event,"TEST::LL::")
    this.selectedAccount.emit(event)
  }

  getDatas(event: any) {

  }

}
