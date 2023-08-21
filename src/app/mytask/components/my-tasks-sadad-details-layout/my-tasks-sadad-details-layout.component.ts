import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-my-tasks-sadad-details-layout',
  templateUrl: './my-tasks-sadad-details-layout.component.html',
  styleUrls: ['./my-tasks-sadad-details-layout.component.scss']
})
export class MyTasksSadadDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.myTaskSADADSummaryObject.ref_NO,
      productCode:this.rootScopeData.myTaskSADADSummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTaskSADADSummaryObject.subprcode,
      functionCode:this.rootScopeData.myTaskSADADSummaryObject.function_ID,
    }
  }

  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeSadadPayment'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectSadadPayment'])
  }
  back(){
    this.router.navigate(['/mytask/payment/single-payments'])
  }

}
