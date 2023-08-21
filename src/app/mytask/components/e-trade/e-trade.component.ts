import { Component, OnDestroy, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-e-trade',
  templateUrl: './e-trade.component.html',
  styleUrls: ['./e-trade.component.scss'],
})
export class ETradeComponent implements OnInit, OnDestroy {
  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor() {}

  ngOnInit(): void {
    this.rootScopeData.paymentActiveTabName = 'eTrade';
    this.rootScopeData.advSearchCurrentPage = 'eTradeLg';
  }

  ngOnDestroy(): void {
    this.rootScopeData.advSearchCurrentPage = '';
  }
}
