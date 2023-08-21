import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PosService } from '../../services/pos.service';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-pos-transactions-account-detail',
  templateUrl: './pos-transactions-account-detail.component.html',
  styleUrls: ['./pos-transactions-account-detail.component.scss'],
})
export class PosTransactionsAccountDetailComponent implements OnInit {
  dataSource: any;
  selection: any;
  dataSource2: any;
  selection2: any;
  dataSource3: any;
  selection3: any;
  dataSourceToPass: any;
  dataSourceToPass2: any;
  dataSourceToPass3: any;

  responseHeader: any;
  // norecordflag: boolean;
  dataSourceLength: any;
  totalRecords: any;
  constructor(public posService: PosService) { }
  showViewAcc: boolean = false;
  showAccSelect: boolean = true;
  showViewMerchant: boolean = false;
  showMerchantSelect: boolean = false;
  showTerminalSelect: boolean = false;
  showViewTerminal: boolean = false;
  showGenerateStatement: boolean = false;
  @Output() showGenerateStatementPage = new EventEmitter<any>();
  rootScopeData: RootScopeDeclare = RootScopeData;

  displayedColumns: string[] = [
    'OD_ACC_NO',
    'ALIAS_NAME',
    'OD_ACC_NAME',
    'STATUS',
    'CURR_AVAIL_BAL_AMT',
  ];

  displayedColumns2: string[] = [
    'merchantNameInEnglish',
    'merchantNameInArabic',
    'merchantNumber',
    'status',
    'shopEnglishName',
  ];

  displayedColumns3: string[] = [
    'retailerId',
    'retailerName',
    'status',
    'retailerAddress',
  ];
  ngOnInit() {
    this.getAccountList();
  }

  getAccountList() {
    this.posService.getTransactionAccountList().subscribe(
      (res: any) => {
        this.dataSource = res.DATA.ALL_RECORDS;
        this.dataSourceLength = this.dataSource.length;

        if (res.headerValue !== undefined) {
          this.responseHeader = res.headerValue;
          this.totalRecords = this.responseHeader.totalCount;
        }
        if (
          this.dataSource === null ||
          this.dataSource === '' ||
          this.dataSource === undefined ||
          this.dataSource.length === 0
        ) {
        }
        if (this.dataSource) {
          this.selection = new SelectionModel(true, []);
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        }
      },
      (error) => { }
    );
  }

  getMerchantList() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      merchantAccountNumber: this.selection?.selected[0]?.OD_ACC_NO
        ? this.selection.selected[0].OD_ACC_NO
        : '',
    };

    this.posService.getMerchantList(params).subscribe(
      (res: any) => {
        this.dataSource2 = res.data.MerchantList.merchants;
        this.dataSourceToPass2 = new MatTableDataSource(this.dataSource2);
        this.selection2 = new SelectionModel(true, []);
      },
      (error) => { }
    );
  }

  getTerminalList() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      accountNumber: this.selection2?.selected[0]?.merchantAccountNumber
        ? this.selection2.selected[0]?.merchantAccountNumber
        : '',
    };

    this.posService.getTerminalList(params).subscribe(
      (res: any) => {
        this.dataSource3 = res.data.success;
        this.dataSourceToPass3 = new MatTableDataSource(this.dataSource3);
        this.selection3 = new SelectionModel(true, []);
      },
      (error) => { }
    );
  }

  logSelection(event: any) {
    if (event) {
      this.showViewAcc = true;
      this.showMerchantSelect = true;
      this.showAccSelect = false;
      this.getMerchantList();
    } else {
      this.showViewAcc = false;
      this.showMerchantSelect = false;
      this.showAccSelect = true;
    }
  }
  backToAcc(event: any) {
    if (event) {
      this.selection.clear();
      this.showViewAcc = false;
      this.showAccSelect = true;
      this.selection2.clear();
      this.showMerchantSelect = false;
      this.showViewMerchant = false;
      this.showTerminalSelect = false;
    }
  }

  backToMerchant(event: any) {
    if (event) {
      this.selection2.clear();
      this.showViewMerchant = false;
      this.showMerchantSelect = true;
      this.showTerminalSelect = false;
    }
  }

  logSelectionMerchant(event: any) {
    if (event) {
      this.showViewMerchant = true;
      this.showMerchantSelect = false;
      this.showTerminalSelect = true;
      this.showViewTerminal = false;
      this.getTerminalList();
    }
  }

  logSelectionTerminal(event: any) {
    if (event) {
      this.showGenerateStatement = true;
      this.proceedfn();
    }
  }

  proceedfn() {
    const data = {
      account: this.selection.selected,
      merchant: this.selection2.selected,
      terminal: this.selection3.selected,
      proceed: this.showGenerateStatement,
    };
    this.showGenerateStatementPage.emit(data);
  }

  initialState() {
    this.selection.clear();
  }
  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'OD_ACC_NO', fieldType: 'string' },
      { name: 'ALIAS_NAME', fieldType: 'string' },
      { name: 'OD_ACC_NAME', fieldType: 'string' },
      { name: 'STATUS', fieldType: 'string' },
      { name: 'CURR_AVAIL_BAL_AMT', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);
  }

  triggerSearchFilter2(event: any) {
    let columnsToSearch = [
      { name: 'merchantNameInEnglish', fieldType: 'string' },
      { name: 'merchantNameInArabic', fieldType: 'string' },
      { name: 'merchantNumber', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'shopEnglishName', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource2,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass2 = new MatTableDataSource(tableData);
  }

  triggerSearchFilter3(event: any) {
    let columnsToSearch = [
      { name: 'retailerId', fieldType: 'string' },
      { name: 'retailerName', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'retailerAddress', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource3,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass3 = new MatTableDataSource(tableData);
  }
}
