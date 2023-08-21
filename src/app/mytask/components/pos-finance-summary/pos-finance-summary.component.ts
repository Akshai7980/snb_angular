import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-pos-finance-summary',
  templateUrl: './pos-finance-summary.component.html',
  styleUrls: ['./pos-finance-summary.component.scss'],
})
export class PosFinanceSummaryComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowHistoryParams: any;
  isLoadingComplete: boolean = true;
  posFinanceSummaryDetails: any = {};
  printSection: string = 'posFinanceRequestSummaryDetails';
  moduleId: string = 'MYTASKPOSFINDET';
  posFinanceRequestMytaskSummaryDetails: any;
  constructor(private router: Router, private myTaskService: MyTaskService) {}

  ngOnInit(): void {
    this.posFinanceRequestMytaskSummaryDetails =
      this.rootScopeData.posFinanceRequestMytaskSummaryDetails;

    if (this.rootScopeData.posFinanceRequestMytaskSummaryDetails === '') {
      this.router.navigate(['/mytask/posFinance']);
    }

    this.workFlowHistoryParams = {
      refNum:
        this.rootScopeData.posFinanceRequestMytaskSummaryDetails.row.refNo,
      productCode:
        this.rootScopeData.posFinanceRequestMytaskSummaryDetails.row
          .productCode,
      subProductCode:
        this.rootScopeData.posFinanceRequestMytaskSummaryDetails.row
          .subproductCode,
      functionCode:
        this.rootScopeData.posFinanceRequestMytaskSummaryDetails.row
          .functionCode,
    };
  }
  onClickAuthorize(event: any): void {
    this.router.navigate(['/mytask/posFinanceAuthorize']);
    event.stopImmediatePropagation();
  }

  onClickReject(event: any): void {
    this.router.navigate(['/mytask/posFinanceReject']);
    event.stopImmediatePropagation();
  }
}
