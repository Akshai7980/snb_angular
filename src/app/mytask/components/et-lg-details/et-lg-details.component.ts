import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-et-lg-details',
  templateUrl: './et-lg-details.component.html',
  styleUrls: ['./et-lg-details.component.scss'],
})
export class EtLgDetailsComponent implements OnInit {
  workFlowHistoryParams: any = {};
  lgDetails: any = {};
  rootScopeData: RootScopeDeclare = RootScopeData;
  printSection: string = 'etLgDetails';
  moduleId: string = 'LGDETAIL'; // need to confirm with Seshan
  isLoadingComplete: boolean = true;
  lgSummary: any = {};

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    if (this.rootScopeData.selectedInquiryForStopPayment.letterOfGua) {
      this.lgSummary =
        this.rootScopeData.selectedInquiryForStopPayment.letterOfGua;
      this.lgDetails =
        this.rootScopeData.selectedInquiryForStopPayment.lgDetails;
    } else {
      this.router.navigate(['mytask/eTrade/lg']);
    }

    //workflow and history params
    this.workFlowHistoryParams = {
      refNum: this.lgSummary?.refNo ? this.lgSummary.refNo : '',
      productCode: this.lgSummary?.product ? this.lgSummary.product : '',
      subProductCode: this.lgSummary?.subProduct
        ? this.lgSummary.subProduct
        : '',
      functionCode: this.lgSummary?.functionCode
        ? this.lgSummary.functionCode
        : '',
      unit_ID: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
  }

  onBack(): void {
    this.rootScopeData.selectedInquiryForStopPayment = '';
    this.router.navigate(['/mytask/eTrade/lg']);
  }

  authorizeLg(): void {
    this.router.navigate(['/mytask/authorizeLg']);
  }

  rejectLg(): void {
    this.router.navigate(['/mytask/rejectLg']);
  }
}
