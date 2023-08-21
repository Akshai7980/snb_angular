import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-card-transfer-summary-details',
  templateUrl: './credit-card-transfer-summary-details.component.html',
  styleUrls: ['./credit-card-transfer-summary-details.component.scss']
})
export class CreditCardTransferSummaryDetailsComponent implements OnInit {

  isLoadingComplete: boolean = true;

  transferSummaryDetails: any = {};
  printSection = 'transferSummaryDetails';
  logo = 'assets/images/snb-logo-print.png';

  constructor() { }

  ngOnInit(): void {
  }

}
