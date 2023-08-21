import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-request-details-summary',
  templateUrl: './request-details-summary.component.html',
  styleUrls: ['./request-details-summary.component.scss']
})
export class RequestDetailsSummaryComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() { }

  ngOnInit(): void {
    console.log(this.rootScopeData.posFinanceRequestMytaskSummaryDetails)
  }

}
