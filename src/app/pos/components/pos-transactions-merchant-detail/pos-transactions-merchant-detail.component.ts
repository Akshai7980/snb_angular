import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { PosService } from '../../services/pos.service';

import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { AccountDetailsService } from 'src/app/accounts/services/account-details.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-pos-transactions-merchant-detail',
  templateUrl: './pos-transactions-merchant-detail.component.html',
  styleUrls: ['./pos-transactions-merchant-detail.component.scss'],
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
export class PosTransactionsMerchantDetailComponent implements OnInit {
  showInitialPage: boolean = false;
  @Output() goToInitialPage = new EventEmitter<any>();
  dataSource: any;
  dataSourceLength: any;
  responseHeader: any;
  totalRecords: any;

  contextMenuList: any = [];
  displayedColumns: string[] = [
    'termID',
    'sequence',
    'cardType',
    'cardNumber',
    'Date',
    'amountinSAR',
    'action',
  ];
  moreActionListInActive: any = [];
  expandedElement: any;
  expandedRows: { [key: number]: boolean } = {};
  dataSourceToPass!: MatTableDataSource<any>;
  rootScopeData: RootScopeDeclare = RootScopeData;
  displayedColumnsWithExpand = [
    'expand',
    'res_Txn_Dt',
    'res_Description',
    'res_Credit_Amt',
    'hide_res_Credit_Amt',
    'res_Running_Bal',
    'hide_res_Running_Bal',
    'res_TxnType',
    'Action',
  ];
  moduleId: string = 'POSTRNSCTIN';

  setDownload: boolean = true;
  constructor(
    public posService: PosService,
    public accService: AccountDetailsService
  ) {}

  ngOnInit() {
    this.getTransactionList();
    this.rootScopeData.advSearchCurrentPage = 'posTransaction';
  }

  clearAllFields() {
    this.showInitialPage = true;
    const data = {
      clear: this.showInitialPage,
    };
    this.goToInitialPage.emit(data);
  }

  getTransactionList() {
    this.posService.getTransactionList().subscribe(
      (res: any) => {
        this.dataSource = res.data.transactionDetails;
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
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        }
      },
      (error) => {}
    );
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'termID', fieldType: 'string' },
      { name: 'sequence', fieldType: 'string' },
      { name: 'cardType', fieldType: 'string' },
      { name: 'Date', fieldType: 'string' },
      { name: 'amountinSAR', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);
  }

  selectedRecord(event: any, element: any) {
    this.rootScopeData.posSelectedTransaction = element;

    if (this.moreActionListInActive == 0) {
      let merchantFinaceDispute = {
        display_key: 'LBL_MERCHANT_FINANCE_DISPUTE',
        value: 'merchant_finace_dispute',
        item_id: 'MERCHANT_FINANCE_DISPUTE',
      };
      this.moreActionListInActive.push(merchantFinaceDispute);
      let refundRequest = {
        display_key: 'LBL_REFUND_REQUEST',
        value: 'refund_request',
        item_id: 'REFUND_REQUEST',
      };
      this.moreActionListInActive.push(refundRequest);
      let feeDebitInquiry = {
        display_key: 'LBL_FEE_DEBIT_INQUIRY',
        value: 'FEE_DEBIT_INQUIRY',
        item_id: 'FEE_DEBIT_INQUIRY',
      };
      this.moreActionListInActive.push(feeDebitInquiry);
    }

    event?.stopPropagation();
  }

  getNarrationAPICall(data: any) {
    let params = {
      accNumber: this.rootScopeData.accDetailsObject.res_Acc_No,
      recordId: data.recordId,
    };
    // this.isLoadingCompelete = false;
    this.accService.getNarrationAPI(params).subscribe(
      (response: any) => {
        // this.isLoadingCompelete = true;
        Object.assign(data, { NARRATION: response.DATA.res_description });
      },
      (error: any) => {
        // this.isLoadingCompelete = true;
      }
    );
  }

  refreshSummary() {
    this.getTransactionList();
  }
}
