import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  constructor() {
    this.rootScopeData.activeTabName = 'trash';
    this.rootScopeData.paymentActiveTabName = 'trash';
  }

  ngOnInit(): void {
    
  }

}
