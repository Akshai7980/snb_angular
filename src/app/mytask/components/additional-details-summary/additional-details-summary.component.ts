import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-additional-details-summary',
  templateUrl: './additional-details-summary.component.html',
  styleUrls: ['./additional-details-summary.component.scss'],
})
export class AdditionalDetailsSummaryComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  workFlowHistoryParams: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.pendingActivitiesServiceRequestObject.refNo,
      productCode:
        this.rootScopeData.pendingActivitiesServiceRequestObject.productCode,
      subProductCode:
        this.rootScopeData.pendingActivitiesServiceRequestObject.subproductCode,
      functionCode:
        this.rootScopeData.pendingActivitiesServiceRequestObject.functionCode,
    };
  }

  onApproveClick() {
    this.router.navigate(['/mytask/additionalAccAuthorizeRequest']);
  }

  onRejectClick() {
    this.router.navigate(['/mytask/additionalAccRejectRequest']);
  }
  back(){
    this.router.navigate(['/mytask/serviceRequest/additionalAccount']);
  }
}
