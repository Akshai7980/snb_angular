import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-sadad-details-layout',
  templateUrl: './sadad-details-layout.component.html',
  styleUrls: ['./sadad-details-layout.component.scss']
})
export class SadadDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router:Router) { }

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
