import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from 'src/app/common-components/services/common.service';

@Component({
  selector: 'app-pmt-single-transfer-details-layout',
  templateUrl: './pmt-single-transfer-details-layout.component.html',
  styleUrls: ['./pmt-single-transfer-details-layout.component.scss'],
})
export class PmtSingleTransferDetailsLayoutComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowHistoryParams: any;
  printSection: string = '';
  constructor(
    private location: Location,
    private readonly router: Router,
    private readonly commonService: CommonService
  ) {}

  ngOnInit(): void {
    if (!this.rootScopeData.myTaskSingleTransferPayment) {
      this.location.back();
    }
    this.workFlowHistoryParams = this.setWorkFlowParams();
    this.printSection = 'singleTransferDetails';
  }

  setWorkFlowParams(): any {
    return {
      refNum:this.rootScopeData.myTaskSingleTransferPayment.details.txnRefNo,
      productCode:this.rootScopeData.myTaskSingleTransferPayment.summary.product_CODE,
      subProductCode:this.rootScopeData.myTaskSingleTransferPayment.details.subProduct,
      functionCode:this.rootScopeData.myTaskSingleTransferPayment.details.functionCode,
    };
  }

  onClickAuthorize() {
    this.router.navigate(['/mytask/authorizeSingleTransferPmt']);
  }

  onClickReject() {
    this.router.navigate(['/mytask/rejectSingleTransferPmt']);
  }

  toPdf() {
    this.commonService.downloadPdf(
      'singlePaymentTransferDetails',
      'SingleTransferDetails'
    );
  }
  back(): void {
    this.router.navigate(['/mytask/payment/single-payments']);
  }
}
