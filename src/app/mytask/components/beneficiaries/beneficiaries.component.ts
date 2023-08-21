import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-beneficiaries',
  templateUrl: './beneficiaries.component.html',
  styleUrls: ['./beneficiaries.component.scss']
})
export class BeneficiariesComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData
  singleMenu: any;
  bulkMenu: any;
  constructor() { }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'singlefile';
    this.rootScopeData.paymentActiveTabName = 'beneficiary';
    //this.singleMenu = 'active';
    this.menuclick(this.rootScopeData.activeTabName);
  }

  menuclick(menu: any) {
    //debugger;
    if (menu === 'singlefile') {
      this.singleMenu = 'active';
      this.bulkMenu = '';
    }
    else if (menu === 'bulkfile') {
      this.singleMenu = '';
      this.bulkMenu = 'active';
    }

  }

}
