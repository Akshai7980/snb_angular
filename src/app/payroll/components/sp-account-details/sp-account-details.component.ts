import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-sp-account-details',
  templateUrl: './sp-account-details.component.html',
  styleUrls: ['./sp-account-details.component.scss'],
})
export class SpAccountDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  selectedAccount: any;
  constructor() {}

  ngOnInit(): void {
    this.selectedAccount = this.rootScopeData.accountsSummaryObject;
  }
}
