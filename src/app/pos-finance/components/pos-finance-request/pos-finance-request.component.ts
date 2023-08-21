import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PosFinanceService } from '../../services/pos-finance.service';

@Component({
  selector: 'app-pos-finance-request',
  templateUrl: './pos-finance-request.component.html',
  styleUrls: ['./pos-finance-request.component.scss'],
})
export class PosFinanceRequestComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSource: any;
  selection: any;

  dataSourceToPass: any;

  responseHeader: any;
  norecordflag: boolean = false;
  dataSourceLength: any;
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: 'Apply Now',
    btnLink: '/dashboard',
    showBtn: 'true',
    showMsg: 'true',
    showIcon: 'true',
  };
  constructor(
    private router: Router,
    public posFinanceService: PosFinanceService
  ) {
    if (this.rootScopeData.posFinanceRequestMytaskSummaryDetails === '') {
      this.router.navigate(['/posFinance/posRequest']);
    }
  }

  displayedColumns: string[] = [
    'OD_ACC_NO',
    'ALIAS_NAME',
    'LIAS_NAME',
    'STATUS',
    'CURR_AVAIL_BAL_AMOUNT_NEW',
  ];

  moreActionListInActive: any = [];
  moreActionListInActive2: any = [];

  ngOnInit() {
    this.getAccountList();
  }

  getAccountList() {
    this.posFinanceService.getAccountList().subscribe(
      (res: any) => {
        this.dataSource = res.DATA.ALL_RECORDS;

        this.dataSourceLength = this.dataSource.length;

        if (res.headerValue !== undefined) {
          this.responseHeader = res.headerValue;
        }
        if (
          this.dataSource === null ||
          this.dataSource === '' ||
          this.dataSource === undefined ||
          this.dataSource.length === 0
        ) {
          this.norecordflag = true;
        }
        if (this.dataSource) {
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        }
      },
      (error) => {
        this.norecordflag = true;
      }
    );
  }
  selected(event: any) {
    this.rootScopeData.posFinanceRequestDetails = event;
    this.router.navigate(['/posFinance/posRequestDetails']);
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'OD_ACC_NO', fieldType: 'string' },
      { name: 'ALIAS_NAME', fieldType: 'string' },
      { name: 'LIAS_NAME', fieldType: 'string' },
      { name: 'STATUS', fieldType: 'string' },
      { name: 'CURR_AVAIL_BAL_AMOUNT_NEW', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );

    if (tableData && tableData.length) {
      this.norecordflag = false;
      this.dataSourceToPass = new MatTableDataSource(tableData);
    } else {
      this.norecordflag = true;
    }
  }
}
