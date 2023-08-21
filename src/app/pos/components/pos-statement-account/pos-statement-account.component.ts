import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { PosService } from '../../services/pos.service';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-pos-statement-account',
  templateUrl: './pos-statement-account.component.html',
  styleUrls: ['./pos-statement-account.component.scss'],
})
export class PosStatementAccountComponent implements OnInit {
  dataSource: any = [];
  dataSourceToPass: any;
  selection: any;
  responseHeader: any;
  norecordflag: boolean = false;
  displayedColumns: string[] = [
    'select',
    'accNumber',
    'nickName',
    'fullName',
    'status',
    'balance',
  ];

  dataSource2: any;
  dataSourceToPass2: any;
  selection2: any;
  responseHeader2: any;
  norecordflag2: boolean = false;
  displayedColumns2: string[] = [
    'select',
    'merchantName',
    'merchantNameArabic',
    'merchantNumber',
    'status',
    'shopName',
  ];

  dataSource3: any;
  dataSourceToPass3: any;
  selection3: any;
  responseHeader3: any;
  norecordflag3: boolean = false;
  displayedColumns3: string[] = [
    'select',
    'terminalID',
    'terminalType',
    'status',
    'shopName',
  ];

  isLoadingCompelete = true;
  showViewAcc: boolean = false;
  showAccSelect: boolean = true;
  showViewMerchant: boolean = false;
  showMerchantSelect: boolean = false;
  showTerminalSelect: boolean = false;
  showViewTerminal: boolean = false;
  showGenerateStatement: boolean = false;

  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: 'Apply Now',
    btnLink: '/dashboard',
    showBtn: 'true',
    showMsg: 'true',
    showIcon: 'true',
  };

  @Output() showGenerateStatementPage = new EventEmitter<any>();

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private readonly posService: PosService) {}

  ngOnInit() {
    this.getAllAccountList();
    this.getAllMerchantList();
    this.getAllTerminalList();
  }

  getAllAccountList() {
    this.isLoadingCompelete = false;

    this.posService.getAccountList().subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        this.selection = new SelectionModel(true, []);

        if (res === null || res === '' || res === undefined) {
          this.norecordflag = !this.norecordflag;
        }

        if (res.HEADER_VALUE !== undefined) {
          this.responseHeader = res.HEADER_VALUE;
        }

        this.dataSource = res.DATA.ALL_RECORDS;

        if (
          this.dataSource === null ||
          this.dataSource === '' ||
          this.dataSource === undefined ||
          this.dataSource.length === 0
        ) {
          this.norecordflag = !this.norecordflag;
        }

        if (this.dataSource) {
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        }
      },
      (error) => {
        this.isLoadingCompelete = true;

        this.norecordflag = true;
      }
    );
  }

  getAllMerchantList() {
    this.isLoadingCompelete = false;

    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      merchantAccountNumber: this.selection?.selected[0]?.OD_ACC_NO
        ? this.selection.selected[0].OD_ACC_NO
        : '',
    };

    this.posService.getMerchantList(params).subscribe(
      // may the request will change
      (res: any) => {
        this.isLoadingCompelete = true;

        this.selection2 = new SelectionModel(true, []);
        if (res === null || res === '' || res === undefined) {
          this.norecordflag2 = !this.norecordflag2;
        }
        if (res.headerValue !== undefined) {
          this.responseHeader2 = res.headerValue;
        }
        this.dataSource2 = res.data.MerchantList.merchants; // need to change functionality if anything changed in api.

        if (
          this.dataSource2 === null ||
          this.dataSource2 === '' ||
          this.dataSource2 === undefined ||
          this.dataSource2.length === 0
        ) {
          this.norecordflag2 = !this.norecordflag2;
        }
        if (this.dataSource2) {
          this.dataSourceToPass2 = new MatTableDataSource(this.dataSource2);
        }
      },
      (error) => {
        this.isLoadingCompelete = true;

        this.norecordflag2 = true;
      }
    );
  }

  getAllTerminalList() {
    this.isLoadingCompelete = false;

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
        this.isLoadingCompelete = true;

        this.selection3 = new SelectionModel(true, []);
        if (res === null || res === '' || res === undefined) {
          this.norecordflag3 = !this.norecordflag3;
        }
        if (res.headerValue !== undefined) {
          this.responseHeader3 = res.headerValue;
        }
        this.dataSource3 = res.data.success; // need to change functionality if anything changed in api.

        if (
          this.dataSource3 === null ||
          this.dataSource3 === '' ||
          this.dataSource3 === undefined ||
          this.dataSource3.length === 0
        ) {
          this.norecordflag3 = !this.norecordflag3;
        }
        if (this.dataSource3) {
          this.dataSourceToPass3 = new MatTableDataSource(this.dataSource3);
        }
      },
      (error) => {
        this.isLoadingCompelete = true;

        this.norecordflag3 = true;
      }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceToPass.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSourceToPass.data.forEach((row: any) =>
          this.selection.select(row)
        );
  }

  logSelection(event: any) {
    if (event) {
      this.showViewAcc = true;
      this.showMerchantSelect = true;
      this.showAccSelect = false;
      this.getAllMerchantList();
    } else {
      this.showViewAcc = false;
      this.showMerchantSelect = false;
      this.showAccSelect = true;
    }
  }

  backToAcc(event: any) {
    if (event) {
      this.showViewAcc = false;
      this.showAccSelect = true;
      this.showMerchantSelect = false;
      this.showViewMerchant = false;
      this.showTerminalSelect = false;
      this.selection2.clear();
    }
  }

  backToMerchant(event: any) {
    if (event) {
      this.showViewMerchant = false;
      this.showMerchantSelect = true;
      this.showTerminalSelect = false;
      this.selection3.clear();
    }
  }

  isAllSelectedMerchant() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.dataSourceToPass2.data.length;
    return numSelected === numRows;
  }

  masterToggleMerchant() {
    this.isAllSelectedMerchant()
      ? this.selection2.clear()
      : this.dataSourceToPass2.data.forEach((row: any) =>
          this.selection2.select(row)
        );
  }

  logSelectionMerchant(event: any) {
    if (event) {
      this.showViewMerchant = true;
      this.showMerchantSelect = false;
      this.showTerminalSelect = true;
      this.showViewTerminal = false;
      this.getAllTerminalList();
    }
  }

  isAllSelectedTerminal() {
    const numSelected = this.selection3.selected.length;
    const numRows = this.dataSourceToPass3.data.length;
    return numSelected === numRows;
  }

  masterToggleTerminal() {
    this.isAllSelectedTerminal()
      ? this.selection3.clear()
      : this.dataSourceToPass3.data.forEach((row: any) =>
          this.selection3.select(row)
        );
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
      { name: 'select', fieldType: 'checkbox' },
      { name: 'accNumber', fieldType: 'string' },
      { name: 'nickName', fieldType: 'string' },
      { name: 'fullName', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'balance', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );

    // if (tableData && tableData.length > 0) {
    this.dataSourceToPass = new MatTableDataSource(tableData);
    // } else {
    //   this.norecordflag = true;
    // }
  }

  triggerSearchFilter2(event: any) {
    let columnsToSearch = [
      { name: 'merchantName', fieldType: 'string' },
      { name: 'merchantNameArabic', fieldType: 'string' },
      { name: 'merchantNumber', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'shopName', fieldType: 'string' },
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
      { name: 'terminalID', fieldType: 'string' },
      { name: 'terminalType', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
      { name: 'shopName', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource3,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass3 = new MatTableDataSource(tableData);
  }
}
