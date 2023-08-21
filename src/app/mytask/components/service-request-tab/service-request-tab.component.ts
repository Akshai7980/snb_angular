import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-service-request-tab',
  templateUrl: './service-request-tab.component.html',
  styleUrls: ['./service-request-tab.component.scss']
})
export class ServiceRequestTabComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData
  deposit: any;
  additionalAccount: any;
  constructor() { }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'deposit';
    this.rootScopeData.paymentActiveTabName = 'serviceRequest';
    //this.singleMenu = 'active';
    this.menuclick(this.rootScopeData.activeTabName);
  }

  menuclick(menu: any) {
    if (menu === 'deposit') {
      this.deposit = 'active';
      this.additionalAccount = '';
    }
    else if (menu === 'additionalAccount') {
      this.deposit = '';
      this.additionalAccount = 'active';
    }

  }
}
