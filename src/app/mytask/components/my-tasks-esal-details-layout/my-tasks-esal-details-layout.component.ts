import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-my-tasks-esal-details-layout',
  templateUrl: './my-tasks-esal-details-layout.component.html',
  styleUrls: ['./my-tasks-esal-details-layout.component.scss']
})
export class MyTasksEsalDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.myTasksESALSummaryObject.ref_NO,
      productCode:this.rootScopeData.myTasksESALSummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTasksESALSummaryObject.subprcode,
      functionCode:this.rootScopeData.myTasksESALSummaryObject.function_ID,
    }
  }

  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeEsalPayment'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectEsalPayment'])
  }
  back() {
    this.router.navigate(['/mytask/payment/single-payments'])
  }

}
