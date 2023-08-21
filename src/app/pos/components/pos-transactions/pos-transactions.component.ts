import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-pos-transactions',
  templateUrl: './pos-transactions.component.html',
  styleUrls: ['./pos-transactions.component.scss'],
})
export class PosTransactionsComponent implements OnInit {
  showMerchantDetail: boolean = false;
  showTransaction: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {}

  ngOnInit(): void {}
  showEmitData(event: any) {
    this.rootScopeData.posTransactionMerchantDetail = event;

    this.rootScopeData.showMerchantDetail = event.proceed;
    this.rootScopeData.showtransaction = !event.proceed;
  }
  showItialPage(event: any) {
    this.rootScopeData.showMerchantDetail = !event.clear;
    this.rootScopeData.showtransaction = event.clear;
  }
}
