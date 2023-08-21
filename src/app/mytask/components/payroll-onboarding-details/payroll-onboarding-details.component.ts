import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payroll-onboarding-details',
  templateUrl: './payroll-onboarding-details.component.html',
  styleUrls: ['./payroll-onboarding-details.component.scss'],
})
export class PayrollOnboardingDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowHistoryParams: any;
  onboardingFeeDetails: any;
  feeDetails: any = {};

  constructor(
    private router: Router,
    private myTaskService: MyTaskService,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.onboardingFeeDetails =
      this.myTaskService.getSelectedElementDetails().onBoardingDetails;
    this.feeDetails = this.myTaskService.getSelectedElementDetails().feeDetails;
    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.pendingActivitiesServiceRequestObject.referenceNo
        ? this.rootScopeData.pendingActivitiesServiceRequestObject.referenceNo
        : '',
      productCode: this.rootScopeData.pendingActivitiesServiceRequestObject
        .product_CODE
        ? this.rootScopeData.pendingActivitiesServiceRequestObject.product_CODE
        : '',
      subProductCode: this.rootScopeData.pendingActivitiesServiceRequestObject
        .subprcode
        ? this.rootScopeData.pendingActivitiesServiceRequestObject.subprcode
        : '',
      functionCode: this.rootScopeData.pendingActivitiesServiceRequestObject
        .function_ID
        ? this.rootScopeData.pendingActivitiesServiceRequestObject.function_ID
        : '',
    };
  }

  onClickBack() {
    this.location.back();
  }

  onClickAuthorize() {
    this.router.navigate(['/mytask/payrollOnboardingAuthorize']);
  }
  onClickReject() {
    this.router.navigate(['/mytask/payrollOnboardingReject']);
  }
}
