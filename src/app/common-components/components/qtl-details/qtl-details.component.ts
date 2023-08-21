import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-qtl-details',
  templateUrl: './qtl-details.component.html',
  styleUrls: ['./qtl-details.component.scss']
})
export class QtlDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  details: any;
  
  constructor() {}

  ngOnInit(): void {
    if(this.rootScopeData.pendingActivitiesInstantTransferSummaryObject){
      this.details = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject;
    }
  }

  

}
