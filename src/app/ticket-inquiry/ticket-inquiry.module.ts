import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketInquiryRoutingModule } from './ticket-inquiry-routing.module';
import { TicketInquiryComponent } from './ticket-inquiry.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { SharedModule } from '../shared/shared.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ComplaintsSummaryLayoutComponent } from './components/complaints-summary-layout/complaints-summary-layout.component';
import { ComplaintSummaryComponent } from './components/complaint-summary/complaint-summary.component';
import { RaisecomplaintstransferComponent } from './components/raisecomplaintstransfer/raisecomplaintstransfer.component';
import { RaisecomplaintspayrollComponent } from './components/raisecomplaintspayroll/raisecomplaintspayroll.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ComplaintstypeComponent } from './components/complaintstype/complaintstype.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PosFinanceTicketInquiryComponent } from './components/pos-finance-ticket-inquiry/pos-finance-ticket-inquiry.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PosFinanceTicketInquirySummaryComponent } from './components/pos-finance-ticket-inquiry-summary/pos-finance-ticket-inquiry-summary.component';
import { EcorpGeneralIssueComponent } from './components/ecorp-general-issue/ecorp-general-issue.component';
import { EcorpGeneralIssueDetailsComponent } from './components/ecorp-general-issue-details/ecorp-general-issue-details.component';
import { EcorpGeneralIssueReviewComponent } from './components/ecorp-general-issue-review/ecorp-general-issue-review.component';
import { EcorpGeneralIssueTicketInquiryComponent } from './components/ecorp-general-issue-ticket-inquiry/ecorp-general-issue-ticket-inquiry.component';

@NgModule({
  declarations: [
    TicketInquiryComponent,
    ComplaintsComponent,
    ComplaintsSummaryLayoutComponent,
    ComplaintSummaryComponent,
    RaisecomplaintstransferComponent,
    RaisecomplaintspayrollComponent,
    ComplaintstypeComponent,
    PosFinanceTicketInquiryComponent,
    PosFinanceTicketInquirySummaryComponent,
    EcorpGeneralIssueComponent,
    EcorpGeneralIssueDetailsComponent,
    EcorpGeneralIssueReviewComponent,
    EcorpGeneralIssueTicketInquiryComponent
  ],
  imports: [
    CommonModule,
    TicketInquiryRoutingModule,
    SharedModule,
    CommonComponentsModule,
    MatButtonToggleModule,
    MatSelectModule,
    FormsModule,
    MatTooltipModule
  ]
})
export class TicketInquiryModule { }
