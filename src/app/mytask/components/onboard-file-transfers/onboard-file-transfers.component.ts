import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-onboard-file-transfers',
  templateUrl: './onboard-file-transfers.component.html',
  styleUrls: ['./onboard-file-transfers.component.scss'],
})
export class OnboardFileTransfersComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  totalPayrollCount = 0;
  totalStopPaymentCount = 0;
  constructor() {}

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'fileUpload';
    this.rootScopeData.paymentActiveTabName = 'Payroll';
  }
}
