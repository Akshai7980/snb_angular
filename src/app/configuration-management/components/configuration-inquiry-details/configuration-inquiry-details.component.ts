import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-configuration-inquiry-details',
  templateUrl: './configuration-inquiry-details.component.html',
  styleUrls: ['./configuration-inquiry-details.component.scss']
})
export class ConfigurationInquiryDetailsComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  showProxyDetails: any;
  constructor() { }

  ngOnInit(): void {
    //debugger
    this.showProxyDetails = this.rootScopeData.selectedProxy;
  }

}
