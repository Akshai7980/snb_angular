import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PosService } from '../../services/pos.service';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import {
  pageOptions,
  totalRecordsPerRequest,
} from 'src/app/utility/paginator-config';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-pos-terminal-management-account',
  templateUrl: './pos-terminal-management-account.component.html',
  styleUrls: ['./pos-terminal-management-account.component.scss'],
})
export class PosTerminalManagementAccountComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSource: any;
  selection: any;
  dataSource2: any;
  selection2: any;
  dataSource3: any;
  selection3: any;
  dataSourceToPass: any;
  dataSourceToPass2: any;
  dataSourceToPass3: any;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  responseHeader: any;
  norecordflag: boolean = false;
  dataSourceLength: any;
  totalRecords: any;
  merchnatData: any;
  merchnatDataSelected: boolean = false;
  constructor(private router: Router, public posService: PosService) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }
  showViewAcc: boolean = false;
  showAccSelect: boolean = true;
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
    'shopEnglishName',
    'action',
  ];

  displayedColumns3: string[] = [
    'retailerId',
    'retailerName',
    'retailerAddress',
    'action',
  ];

  moreActionListInActive: any = [];
  moreActionListInActive2: any = [];

  ngOnInit() {
    this.getAccountList();
    this.getMerchantList();
    this.getTerminalList();
  }

  getAccountList() {
    this.posService.getAccountList().subscribe(
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
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
        }
      },
      (error) => {}
    );
  }

  getMerchantList() {
    const params = {};
    this.posService.getMerchantList(params).subscribe(
      (res: any) => {
        this.dataSource2 = res.data.MerchantList.merchants;
        this.dataSourceToPass2 = new MatTableDataSource(this.dataSource2);
        this.selection2 = new SelectionModel(true, []);
      },
      (error) => {}
    );
  }

  getTerminalList() {
    const params = {};
    this.posService.getTerminalList(params).subscribe(
      (res: any) => {
        this.dataSource3 = res.data.success;
        this.dataSourceToPass3 = new MatTableDataSource(this.dataSource3);
        this.selection3 = new SelectionModel(true, []);
      },
      (error) => {}
    );
  }

  logSelection(event: any) {
    if (event) {
      this.rootScopeData.accountDataSelect = this.selection.selected;
      this.showViewAcc = true;
      this.rootScopeData.showMerchantSelect = true;
      this.showAccSelect = false;
      this.getMerchantList();
    } else {
      this.showViewAcc = false;
      this.rootScopeData.showMerchantSelect = false;
      this.showAccSelect = true;
    }
  }
  backToAcc(event: any) {
    if (event) {
      this.selection.clear();
      this.showViewAcc = false;
      this.showAccSelect = true;
      this.selection2.clear();
      this.rootScopeData.showMerchantSelect = false;
      this.rootScopeData.showViewMerchant = false;
      this.rootScopeData.showAddNewTerminal = false;
      this.rootScopeData.showAddNewMerchantContainer = false;
      this.showTerminalSelect = false;
    }
  }

  backToMerchant(event: any) {
    if (event) {
      this.rootScopeData.showMerchantSelect = true;
      this.rootScopeData.showViewMerchant = false;
      this.showTerminalSelect = false;
      this.rootScopeData.showAddNewTerminal = false;
      this.selection2.clear();
    }
  }

  logSelectionMerchant(event: any) {
    if (event) {
      this.rootScopeData.showViewMerchant = true;
      this.rootScopeData.showMerchantSelect = false;
      this.showTerminalSelect = true;
      this.showViewTerminal = false;
      this.merchnatDataSelected = false;
      this.merchnatData = [];
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
    // this.dataSource.paginator=this.commonPagination.paginator;
    // showFilteredRows(this.rootScopeData.filterTableId, event.target.value);
  }

  triggerSearchFilter2(event: any) {
    let columnsToSearch = [
      { name: 'merchantNameInEnglish', fieldType: 'string' },
      { name: 'merchantNameInArabic', fieldType: 'string' },
      { name: 'merchantNumber', fieldType: 'string' },
      { name: 'STATUS', fieldType: 'string' },
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
      { name: 'STATUS', fieldType: 'string' },
      { name: 'retailerAddress', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource3,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass3 = new MatTableDataSource(tableData);
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getAccountList();
  }

  selectedRecord(event: any, element: any) {
    if (this.moreActionListInActive == 0) {
      let merchnatView = {
        display_key: 'LBL_VIEW',
        value: 'Merchant_View',
        item_id: 'Merchant_View',
      };
      this.moreActionListInActive.push(merchnatView);
      let merchnatEdit = {
        display_key: 'LBL_EDIT',
        value: 'Merchant_Edit',
        item_id: 'Merchant_Edit',
      };
      this.moreActionListInActive.push(merchnatEdit);

      event?.stopPropagation();
    }
  }
  selectedRecord2(event: any, element: any) {
    if (this.moreActionListInActive2 == 0) {
      let terminalView = {
        display_key: 'LBL_VIEW',
        value: 'Terminal_View',
        item_id: 'Terminal_View',
      };
      this.moreActionListInActive2.push(terminalView);
      let terminalDelete = {
        display_key: 'LBL_DELETE',
        value: 'Terminal_Delete',
        item_id: 'Terminal_Delete',
      };
      this.moreActionListInActive2.push(terminalDelete);
      let terminalRequestForStand = {
        display_key: 'LBL_REQUEST_FOR_STAND',
        value: 'Terminal_Request_For_Stand',
        item_id: 'Terminal_Request_For_Stand',
      };
      this.moreActionListInActive2.push(terminalRequestForStand);
      let terminalPosMaintenance = {
        display_key: 'LBL_POS_MAINTENANCE',
        value: 'Terminal_Pos_Maintenance',
        item_id: 'Terminal_Pos_Maintenance',
      };
      this.moreActionListInActive2.push(terminalPosMaintenance);
      let terminalPosPaperRoll = {
        display_key: 'LBL_POS_PAPER_ROLL',
        value: 'Terminal_Pos_Paper_Roll',
        item_id: 'Terminal_Pos_Paper_Roll',
      };
      this.moreActionListInActive2.push(terminalPosPaperRoll);
      let terminalMadaMaterial = {
        display_key: 'LBL_MADA_MATERIAL',
        value: 'Terminal_Mada_Material',
        item_id: 'Terminal_Mada_Material',
      };
      this.moreActionListInActive2.push(terminalMadaMaterial);
      event?.stopPropagation();
    }
  }
  addNew(event: any) {
    if (event) {
      this.rootScopeData.showAddNewMerchantContainer = true;
      this.rootScopeData.showMerchantSelect = false;
    }
  }
  addNewTerminal() {
    this.rootScopeData.showAddNewTerminal = true;
    this.showTerminalSelect = false;
  }
  getMerchnatDataEmit(event: any) {
    this.merchnatData = event;
    this.rootScopeData.merchnatData = this.merchnatData;
    this.merchnatDataSelected = true;
  }
}
