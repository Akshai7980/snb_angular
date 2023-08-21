import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss']
})
export class MailboxComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  constructor() {
    this.rootScopeData.activeTabName = 'mailbox';
    this.rootScopeData.paymentActiveTabName = 'mailbox';
  }

  ngOnInit(): void {
    
  }

}
