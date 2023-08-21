import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-pos-transaction-main',
  templateUrl: './pos-transaction-main.component.html',
  styleUrls: ['./pos-transaction-main.component.scss'],
})
export class PosTransactionMainComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {}

  ngOnInit(): void {
    this.rootScopeData.paymentActiveTabName = 'PosTransaction';
  }
}
