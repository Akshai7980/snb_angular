import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosRoutingModule } from './pos-routing.module';
import { PosComponent } from './pos.component';
import { PosStatementComponent } from './components/pos-statement/pos-statement.component';
import { PosStatementAccountComponent } from './components/pos-statement-account/pos-statement-account.component';
import { PosServiceRequestComponent } from './components/pos-service-request/pos-service-request.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DownloadCenterComponent } from './components/download-center/download-center.component';
import { ServiceComponent } from './components/service/service.component';
import { GenerateStatementComponent } from './components/generate-statement/generate-statement.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PosTerminalManagementComponent } from './components/pos-terminal-management/pos-terminal-management.component';
import { PosTransactionsComponent } from './components/pos-transactions/pos-transactions.component';
import { PosTransactionsMerchantDetailComponent } from './components/pos-transactions-merchant-detail/pos-transactions-merchant-detail.component';
import { PosTransactionsAccountDetailComponent } from './components/pos-transactions-account-detail/pos-transactions-account-detail.component';
import { MerchantFinaceDisputeComponent } from './components/merchant-finace-dispute/merchant-finace-dispute.component';
import { RefundRequestComponent } from './components/refund-request/refund-request.component';
import { FeeDebitInquiryComponent } from './components/fee-debit-inquiry/fee-debit-inquiry.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MerchantFinanceDisputeReviewComponent } from './components/merchant-finance-dispute-review/merchant-finance-dispute-review.component';
import { RefundRequestReviewComponent } from './components/refund-request-review/refund-request-review.component';
import { FeeDebitInquiryReviewComponent } from './components/fee-debit-inquiry-review/fee-debit-inquiry-review.component';
import { PosTerminalManagementAccountComponent } from './components/pos-terminal-management-account/pos-terminal-management-account.component';
import { TerminalManagementAddNewMerchantComponent } from './components/terminal-management-add-new-merchant/terminal-management-add-new-merchant.component';
import { PosTerminalAddNewTerminalComponent } from './components/pos-terminal-add-new-terminal/pos-terminal-add-new-terminal.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MerchnatViewComponent } from './components/merchnat-view/merchnat-view.component';
import { MerchnatEditComponent } from './components/merchnat-edit/merchnat-edit.component';
import { TerminalViewComponent } from './components/terminal-view/terminal-view.component';
import { TerminalDeleteComponent } from './components/terminal-delete/terminal-delete.component';
import { TerminalRequestForStandComponent } from './components/terminal-request-for-stand/terminal-request-for-stand.component';
import { TerminalPosMaintenanceComponent } from './components/terminal-pos-maintenance/terminal-pos-maintenance.component';
import { TerminalPosPapperRollComponent } from './components/terminal-pos-papper-roll/terminal-pos-papper-roll.component';
import { TerminalMadaMaterialComponent } from './components/terminal-mada-material/terminal-mada-material.component';
import { MerchnatEditReviewComponent } from './components/merchnat-edit-review/merchnat-edit-review.component';
import { TerminalDeleteReviewComponent } from './components/terminal-delete-review/terminal-delete-review.component';
import { RequestForStandReviewComponent } from './components/request-for-stand-review/request-for-stand-review.component';
import { PosMaintenenaceReviewComponent } from './components/pos-maintenenace-review/pos-maintenenace-review.component';
import { PosPaperRollReviewComponent } from './components/pos-paper-roll-review/pos-paper-roll-review.component';
import { MadaMaterialReviewComponent } from './components/mada-material-review/mada-material-review.component';
import { TerminalManagementAddComponent } from './components/terminal-management-add/terminal-management-add.component';
import { TerminalManagementReviewComponent } from './components/terminal-management-review/terminal-management-review.component';
import { TerminalAddReviewComponent } from './components/terminal-add-review/terminal-add-review.component';
import { PosMultiClaimRequestComponent } from './components/pos-multi-claim-request/pos-multi-claim-request.component';
import { PosMultiClaimRequestAccountDetailComponent } from './components/pos-multi-claim-request-account-detail/pos-multi-claim-request-account-detail.component';
import { PosMultiClaimRequestMerchantDetailComponent } from './components/pos-multi-claim-request-merchant-detail/pos-multi-claim-request-merchant-detail.component';
import { PosMultiClaimRequestReviewComponent } from './components/pos-multi-claim-request-review/pos-multi-claim-request-review.component';

@NgModule({
  declarations: [
    PosComponent,
    PosStatementComponent,
    PosStatementAccountComponent,
    PosServiceRequestComponent,
    DownloadCenterComponent,
    ServiceComponent,
    GenerateStatementComponent,
    PosTerminalManagementComponent,
    PosTransactionsComponent,
    PosTransactionsMerchantDetailComponent,
    PosTransactionsAccountDetailComponent,
    MerchantFinaceDisputeComponent,
    RefundRequestComponent,
    FeeDebitInquiryComponent,
    MerchantFinanceDisputeReviewComponent,
    RefundRequestReviewComponent,
    FeeDebitInquiryReviewComponent,
    PosTerminalManagementAccountComponent,
    TerminalManagementAddNewMerchantComponent,
    PosTerminalAddNewTerminalComponent,
    MerchnatViewComponent,
    MerchnatEditComponent,
    TerminalViewComponent,
    TerminalDeleteComponent,
    TerminalRequestForStandComponent,
    TerminalPosMaintenanceComponent,
    TerminalPosPapperRollComponent,
    TerminalMadaMaterialComponent,
    MerchnatEditReviewComponent,
    TerminalDeleteReviewComponent,
    RequestForStandReviewComponent,
    PosMaintenenaceReviewComponent,
    PosPaperRollReviewComponent,
    MadaMaterialReviewComponent,
    TerminalManagementAddComponent,
    TerminalManagementReviewComponent,
    TerminalAddReviewComponent,
    PosMultiClaimRequestComponent,
    PosMultiClaimRequestAccountDetailComponent,
    PosMultiClaimRequestMerchantDetailComponent,
    PosMultiClaimRequestReviewComponent,
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    SharedModule,
    PosRoutingModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonToggleModule,
  ],
})
export class PosModule {}
