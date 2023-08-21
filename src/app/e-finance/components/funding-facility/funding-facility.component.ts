import { logoprint } from 'src/app/utility/common-utility';
import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-funding-facility',
  templateUrl: './funding-facility.component.html',
  styleUrls: ['./funding-facility.component.scss'],
})
export class FundingFacilityComponent implements OnInit {
  logo: string = '';
  printSection: string = '';

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {
    this.logo = logoprint();
    this.printSection = 'efinancePrintSection';
    this.rootScopeData.accountsActiveModule = 'FACILITYDETAILS';
  }

  ngOnInit(): void { }
}
