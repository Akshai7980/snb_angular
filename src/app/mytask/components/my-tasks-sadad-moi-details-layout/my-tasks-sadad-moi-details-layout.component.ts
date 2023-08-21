import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-my-tasks-sadad-moi-details-layout',
  templateUrl: './my-tasks-sadad-moi-details-layout.component.html',
  styleUrls: ['./my-tasks-sadad-moi-details-layout.component.scss']
})
export class MyTasksSadadMoiDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.myTaskSADADMOISummaryObject.ref_NO,
      productCode:this.rootScopeData.myTaskSADADMOISummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTaskSADADMOISummaryObject.subprcode,
      functionCode:this.rootScopeData.myTaskSADADMOISummaryObject.function_ID,
    }
  }

  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeSadadMoiPayment'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectSadadMoiPayment'])
  }
  back(){
    this.router.navigate(['/mytask/payment/single-payments'])
  }
}
