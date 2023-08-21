import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-credit-card-details',
  templateUrl: './credit-card-details.component.html',
  styleUrls: ['./credit-card-details.component.scss']
})
export class CreditCardDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferSummaryDetails: any = {};
  displayedColumns = ['cardName', 'cardNo', 'cardType', 'currentLmt', 'newLmt']
  constructor() { }

  ngOnInit(): void {
    if (this.rootScopeData.selectedInquiryForStopPayment) {
      this.transferSummaryDetails =
        this.rootScopeData.selectedInquiryForStopPayment;
    }
  }

}
