import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-complaint-summary',
  templateUrl: './complaint-summary.component.html',
  styleUrls: ['./complaint-summary.component.scss']
})
export class ComplaintSummaryComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  complaintDetails: any;
  complaintSummary: any;
  constructor() {
    this.complaintSummary = this.rootScopeData.ticketInquiry.summary;
    this.complaintDetails = this.rootScopeData.ticketInquiry.details[0];     
  }

  ngOnInit(): void {
  }

}
