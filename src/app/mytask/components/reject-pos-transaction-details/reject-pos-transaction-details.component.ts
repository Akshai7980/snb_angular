import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-reject-pos-transaction-details',
  templateUrl: './reject-pos-transaction-details.component.html',
  styleUrls: ['./reject-pos-transaction-details.component.scss'],
})
export class RejectPosTransactionDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {}

  ngOnInit(): void {}
}
