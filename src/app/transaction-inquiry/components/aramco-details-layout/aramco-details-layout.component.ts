import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';
@Component({
  selector: 'app-aramco-details-layout',
  templateUrl: './aramco-details-layout.component.html',
  styleUrls: ['./aramco-details-layout.component.scss']
})
export class AramcoDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  constructor(private router : Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.aramcoSummaryObject.referenceNo,
      productCode:this.rootScopeData.aramcoSummaryObject.productCode,
      subProductCode:this.rootScopeData.aramcoSummaryObject.subProdCode,
      functionCode:this.rootScopeData.aramcoSummaryObject.functionCode,
    }
  }
  onClickBack() {
    this.rootScopeData.backToPagination.resFlag = 'Y';
    this.rootScopeData.backToPagination.resFlagForService = 'Y';
    this.router.navigate(['/transactionInquiry/aramcoTransfer'])
  }
}
