import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-proxy-identifier-deregistration',
  templateUrl: './proxy-identifier-deregistration.component.html',
  styleUrls: ['./proxy-identifier-deregistration.component.scss']
})
export class ProxyIdentifierDeregistrationComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  deRegReason:any;
  constructor() {
   }

  ngOnInit(): void {
    if(this.rootScopeData.pendingActivitiesInstantTransferSummaryObject){
      this.deRegReason = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.REASON_DESC;
    }
  }

}
