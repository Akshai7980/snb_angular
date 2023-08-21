import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadCenterComponent } from './components/download-center/download-center.component';
import { FeeDebitInquiryReviewComponent } from './components/fee-debit-inquiry-review/fee-debit-inquiry-review.component';
import { FeeDebitInquiryComponent } from './components/fee-debit-inquiry/fee-debit-inquiry.component';
import { MadaMaterialReviewComponent } from './components/mada-material-review/mada-material-review.component';
import { MerchantFinaceDisputeComponent } from './components/merchant-finace-dispute/merchant-finace-dispute.component';
import { MerchantFinanceDisputeReviewComponent } from './components/merchant-finance-dispute-review/merchant-finance-dispute-review.component';
import { MerchnatEditReviewComponent } from './components/merchnat-edit-review/merchnat-edit-review.component';
import { MerchnatEditComponent } from './components/merchnat-edit/merchnat-edit.component';
import { MerchnatViewComponent } from './components/merchnat-view/merchnat-view.component';
import { PosMaintenenaceReviewComponent } from './components/pos-maintenenace-review/pos-maintenenace-review.component';
import { PosMultiClaimRequestReviewComponent } from './components/pos-multi-claim-request-review/pos-multi-claim-request-review.component';
import { PosMultiClaimRequestComponent } from './components/pos-multi-claim-request/pos-multi-claim-request.component';
import { PosPaperRollReviewComponent } from './components/pos-paper-roll-review/pos-paper-roll-review.component';
import { PosServiceRequestComponent } from './components/pos-service-request/pos-service-request.component';
import { PosStatementComponent } from './components/pos-statement/pos-statement.component';
import { PosTerminalAddNewTerminalComponent } from './components/pos-terminal-add-new-terminal/pos-terminal-add-new-terminal.component';
import { PosTerminalManagementComponent } from './components/pos-terminal-management/pos-terminal-management.component';
import { PosTransactionsComponent } from './components/pos-transactions/pos-transactions.component';
import { RefundRequestReviewComponent } from './components/refund-request-review/refund-request-review.component';
import { RefundRequestComponent } from './components/refund-request/refund-request.component';
import { RequestForStandReviewComponent } from './components/request-for-stand-review/request-for-stand-review.component';
import { ServiceComponent } from './components/service/service.component';
import { TerminalAddReviewComponent } from './components/terminal-add-review/terminal-add-review.component';
import { TerminalDeleteReviewComponent } from './components/terminal-delete-review/terminal-delete-review.component';
import { TerminalDeleteComponent } from './components/terminal-delete/terminal-delete.component';
import { TerminalMadaMaterialComponent } from './components/terminal-mada-material/terminal-mada-material.component';
import { TerminalManagementAddNewMerchantComponent } from './components/terminal-management-add-new-merchant/terminal-management-add-new-merchant.component';
import { TerminalManagementAddComponent } from './components/terminal-management-add/terminal-management-add.component';
import { TerminalManagementReviewComponent } from './components/terminal-management-review/terminal-management-review.component';
import { TerminalPosMaintenanceComponent } from './components/terminal-pos-maintenance/terminal-pos-maintenance.component';
import { TerminalPosPapperRollComponent } from './components/terminal-pos-papper-roll/terminal-pos-papper-roll.component';
import { TerminalRequestForStandComponent } from './components/terminal-request-for-stand/terminal-request-for-stand.component';
import { TerminalViewComponent } from './components/terminal-view/terminal-view.component';

const routes: Routes = [
  { path: '', redirectTo: '/pos/posStatement', pathMatch: 'full' },
  {
    path: 'posStatement',
    component: PosStatementComponent,
  },
  {
    path: 'posServiceRequest',
    component: PosServiceRequestComponent,
    children: [
      { path: '', redirectTo: 'service', pathMatch: 'full' },
      { path: 'service', component: ServiceComponent },
      { path: 'downloadcenter', component: DownloadCenterComponent },
    ],
  },
  {
    path: 'posTransactions',
    component: PosTransactionsComponent,
  },
  {
    path: 'posMultiClaimRequest',
    component: PosMultiClaimRequestComponent,
  },
  {
    path: 'posMultiClaimRequestReview',
    component: PosMultiClaimRequestReviewComponent,
  },

  { path: 'merchantFinaceDispute', component: MerchantFinaceDisputeComponent },
  { path: 'refundRequest', component: RefundRequestComponent },
  { path: 'feeDebitInquiry', component: FeeDebitInquiryComponent },
  {
    path: 'merchantFinanceDisputeReview',
    component: MerchantFinanceDisputeReviewComponent,
  },
  { path: 'refundRequestReview', component: RefundRequestReviewComponent },
  { path: 'feeDebitInquiryReview', component: FeeDebitInquiryReviewComponent },
  {
    path: 'posTerminalManagement',
    component: PosTerminalManagementComponent,
  },
  {
    path: 'addNewMerchant',
    component: TerminalManagementAddNewMerchantComponent,
  },
  { path: 'addNewTerminal', component: PosTerminalAddNewTerminalComponent },
  { path: 'merchnat_view', component: MerchnatViewComponent },
  { path: 'merchnat_edit', component: MerchnatEditComponent },
  { path: 'terminal_view', component: TerminalViewComponent },
  { path: 'terminal_delete', component: TerminalDeleteComponent },
  {
    path: 'terminal_request_for-stand',
    component: TerminalRequestForStandComponent,
  },
  {
    path: 'terminal_pos_maintenance',
    component: TerminalPosMaintenanceComponent,
  },
  {
    path: 'terminal_pos_paper_roll',
    component: TerminalPosPapperRollComponent,
  },
  { path: 'terminal_mada_material', component: TerminalMadaMaterialComponent },
  { path: 'merchnat_review', component: MerchnatEditReviewComponent },
  { path: 'terminal_delete_review', component: TerminalDeleteReviewComponent },
  {
    path: 'terminal_request-for-stand-review',
    component: RequestForStandReviewComponent,
  },
  {
    path: 'terminal_pos-maintenance-review',
    component: PosMaintenenaceReviewComponent,
  },
  {
    path: 'terminal_pos-paper-roll-review',
    component: PosPaperRollReviewComponent,
  },
  {
    path: 'terminal_mada-material-review',
    component: MadaMaterialReviewComponent,
  },
  {
    path: 'terminal_management_add',
    component: TerminalManagementAddComponent,
  },
  {
    path: 'terminal_management_add-review',
    component: TerminalManagementReviewComponent,
  },
  { path: 'terminal_add-review', component: TerminalAddReviewComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosRoutingModule {}
