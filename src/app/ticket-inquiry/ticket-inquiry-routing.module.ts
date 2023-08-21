import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplaintsSummaryLayoutComponent } from './components/complaints-summary-layout/complaints-summary-layout.component';
import { ComplaintsComponent } from './components/complaints/complaints.component';
import { TicketInquiryComponent } from './ticket-inquiry.component';
import { RaisecomplaintstransferComponent } from './components/raisecomplaintstransfer/raisecomplaintstransfer.component';
import { RaisecomplaintspayrollComponent } from './components/raisecomplaintspayroll/raisecomplaintspayroll.component';
import { ComplaintstypeComponent } from './components/complaintstype/complaintstype.component';
import { PosFinanceTicketInquiryComponent } from './components/pos-finance-ticket-inquiry/pos-finance-ticket-inquiry.component';
import { PosFinanceTicketInquirySummaryComponent } from './components/pos-finance-ticket-inquiry-summary/pos-finance-ticket-inquiry-summary.component';
import { EcorpGeneralIssueComponent } from './components/ecorp-general-issue/ecorp-general-issue.component';
import { EcorpGeneralIssueTicketInquiryComponent } from './components/ecorp-general-issue-ticket-inquiry/ecorp-general-issue-ticket-inquiry.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/ticketInquiry/complaints',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TicketInquiryComponent,
    children: [
      { path: 'complaints', component: ComplaintsComponent },
      { path: 'complaintDetailsLayout', component: ComplaintsSummaryLayoutComponent }
    ],
    
  },
  { path: 'RaiseComplaint', component: RaisecomplaintstransferComponent },
  { path: 'inquiry', component: PosFinanceTicketInquiryComponent },
  { path: 'summary', component: PosFinanceTicketInquirySummaryComponent },
  { path: 'ecorp_general_issue', component: EcorpGeneralIssueComponent },

  {
    path: 'ecorp_general_issue_ticket-inquiry',
    component:EcorpGeneralIssueTicketInquiryComponent ,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketInquiryRoutingModule { }
