import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
@Component({
  selector: 'app-pos-multi-claim-request',
  templateUrl: './pos-multi-claim-request.component.html',
  styleUrls: ['./pos-multi-claim-request.component.scss'],
})
export class PosMultiClaimRequestComponent implements OnInit {
  showMerchantDetail: boolean = false;
  showtransaction: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {}

  ngOnInit(): void {}
  showEmitData(event: any) {
    this.rootScopeData.posMultiClaimRequestMerchantDetail = event;

    this.rootScopeData.showMerchantDetail = event.proceed;
    this.rootScopeData.showtransaction = !event.proceed;
  }
  showItialPage(event: any) {
    this.rootScopeData.showMerchantDetail = !event.clear;
    this.rootScopeData.showtransaction = event.clear;
  }
}
