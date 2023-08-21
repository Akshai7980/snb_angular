import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-qtl-details-layout',
  templateUrl: './qtl-details-layout.component.html',
  styleUrls: ['./qtl-details-layout.component.scss']
})
export class QtlDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.REF_NO,
      productCode:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_PRODUCT_CODE,
      subProductCode:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_SUBPROD_CODE,
      functionCode:this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_FUNCTION_ID,
    }
  }

  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeQtl'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectQtl'])
  }
}
