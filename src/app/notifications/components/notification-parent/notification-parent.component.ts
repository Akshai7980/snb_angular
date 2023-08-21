import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-notification-parent',
  templateUrl: './notification-parent.component.html',
  styleUrls: ['./notification-parent.component.scss']
})
export class NotificationParentComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;

  constructor() {
    this.rootScopeData.activeTabName = 'alerts';
    this.rootScopeData.paymentActiveTabName = 'notifications';
  }

  ngOnInit(): void {
    
  }

}
