import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-credit-card-summary',
  templateUrl: './credit-card-summary.component.html',
  styleUrls: ['./credit-card-summary.component.scss'],
})
export class CreditCardSummaryComponent implements OnInit {
  isLoadingComplete: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferSummaryDetails: any = {};
  workFlowHistoryParams: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(): void {
    this.isLoadingComplete = false;
    if (this.rootScopeData.selectedInquiryForStopPayment) {
      this.isLoadingComplete = true;
      this.transferSummaryDetails =
        this.rootScopeData.selectedInquiryForStopPayment;
      this.workFlowHistoryParams = {
        refNum: this.transferSummaryDetails.summary.refNo,
        productCode: this.transferSummaryDetails.summary.productCode,
        subProductCode: this.transferSummaryDetails.summary.subproductCode,
        functionCode: this.transferSummaryDetails.summary.functionCode,
      };
    } else {
      this.router.navigate(['/mytask/cards/creditCard']);
    }
  }

  onClickAuthorize(): void {
    this.router.navigate(['/mytask/creditCardAuthorize']);
  }

  onClickReject(): void {
    this.router.navigate(['/mytask/creditCardReject']);
  }
}
