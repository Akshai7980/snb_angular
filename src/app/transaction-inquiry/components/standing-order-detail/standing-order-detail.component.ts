import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-standing-order-detail',
  templateUrl: './standing-order-detail.component.html',
  styleUrls: ['./standing-order-detail.component.scss']
})
export class StandingOrderDetailComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  standingOrderData: any;
  standingOrderDetails: any;
  paymentDetails: any;
  constructor() { }
  

  ngOnInit(): void {
    var paymentFrequencies = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'EOD'];
    this.standingOrderData = this.rootScopeData.standingOrderDetails.summary;
    this.standingOrderDetails = this.rootScopeData.standingOrderDetails.details;
    this.paymentDetails = this.rootScopeData.standingOrderDetails.paymentDetails;
  }

}
