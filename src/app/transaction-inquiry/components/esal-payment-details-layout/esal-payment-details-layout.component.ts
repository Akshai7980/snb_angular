import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';
@Component({
  selector: 'app-esal-payment-details-layout',
  templateUrl: './esal-payment-details-layout.component.html',
  styleUrls: ['./esal-payment-details-layout.component.scss']
})
export class EsalPaymentDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router : Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.transactionInquiry.referenceNo,
      productCode:this.rootScopeData.transactionInquiry.productCode,
      subProductCode:this.rootScopeData.transactionInquiry.subProdCode,
      functionCode:this.rootScopeData.transactionInquiry.functionCode,
    }
  }
  onClickBack() {
    this.router.navigate(['/transactionInquiry/sadadTransfer'])
  }
}
