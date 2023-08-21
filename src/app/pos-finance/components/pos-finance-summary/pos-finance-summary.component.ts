import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PosFinanceService } from '../../services/pos-finance.service';

@Component({
  selector: 'app-pos-finance-summary',
  templateUrl: './pos-finance-summary.component.html',
  styleUrls: ['./pos-finance-summary.component.scss'],
})
export class PosFinanceSummaryComponent implements OnInit {
  printSection: string = 'posFinanceSummaryPrintSection';
  logo = 'assets/images/snb-logo-print.png';

  isLoadingComplete: boolean = true;

  posFinanceSummaryDetails: any = {};
  workFlowHistoryParams: any;
  moduleId: any = 'POSFININQDET';
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private posFinanceService: PosFinanceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!Object.keys(this.rootScopeData.posFinanceSummaryRecord).length)
      this.router.navigate(['/posFinance/posInquiry']);

    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.posFinanceSummaryRecord.refNo,
      productCode: this.rootScopeData.posFinanceSummaryRecord.productCode,
      subProductCode: this.rootScopeData.posFinanceSummaryRecord.subproductCode,
      functionCode: this.rootScopeData.posFinanceSummaryRecord.functionCode,
    };
    this.getPosFinanceSummaryDetails();
  }

  getPosFinanceSummaryDetails() {
    const params = {
      REFERENCE_NUM: this.rootScopeData.posFinanceSummaryRecord.refNo,
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.isLoadingComplete = false;
    this.posFinanceService
      .getPosFinanceSummaryDetails(params)
      .subscribe((res: any) => {
        this.posFinanceSummaryDetails = res.data;
        this.isLoadingComplete = true;
      });
  }
}
