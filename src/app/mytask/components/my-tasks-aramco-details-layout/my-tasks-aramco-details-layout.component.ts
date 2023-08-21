import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-my-tasks-aramco-details-layout',
  templateUrl: './my-tasks-aramco-details-layout.component.html',
  styleUrls: ['./my-tasks-aramco-details-layout.component.scss']
})
export class MyTasksAramcoDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.myTasksARAMCOSummaryObject.ref_NO,
      productCode:this.rootScopeData.myTasksARAMCOSummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTasksARAMCOSummaryObject.subprcode,
      functionCode:this.rootScopeData.myTasksARAMCOSummaryObject.function_ID,
    }
  }

  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeAramcoPayment'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectAramcoPayment'])
  }
  back() {
    this.router.navigate(['/mytask/payment/single-payments'])
  }

}
