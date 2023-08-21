import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-my-tasks-sadad-moi-refund-req-details-layout',
  templateUrl: './my-tasks-sadad-moi-refund-req-details-layout.component.html',
  styleUrls: ['./my-tasks-sadad-moi-refund-req-details-layout.component.scss']
})
export class MyTasksSadadMoiRefundReqDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject.ref_NO,
      productCode:this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject.product_CODE,
      subProductCode:this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject.subprcode,
      functionCode:this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject.function_ID,
    }
  }

  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeSadadMoiRefundReq'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectSadadMoiRefundReq'])
  }
  back(){
    this.router.navigate(['/mytask/payment/single-payments'])
  }
}
