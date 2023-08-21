import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionInquiryRoutingModule } from './transaction-inquiry-routing.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SharedModule } from '../shared/shared.module';
import { TransactionInquiryComponent } from './transaction-inquiry.component';
import { SingleTransferComponent } from './components/single-transfer/single-transfer.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BulkTransferComponent } from './components/bulk-transfer/bulk-transfer.component';
import { StandingOrderComponent } from './components/standing-order/standing-order.component';
import { SadadTransactionComponent } from './components/sadad-transaction/sadad-transaction.component';
import { AramcoTransactionComponent } from './components/aramco-transaction/aramco-transaction.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { DividendsComponent } from './components/dividends/dividends.component';
import { SingleTransferDetailLayoutComponent } from './components/single-transfer-detail-layout/single-transfer-detail-layout.component';
import { AuthorizeSingleTransferComponent } from './components/authorize-single-transfer/authorize-single-transfer.component';
import { RejectSingleTransferComponent } from './components/reject-single-transfer/reject-single-transfer.component';
import { SingleTransferDetailsComponent } from './components/single-transfer-details/single-transfer-details.component';
import { SadadDetailsLayoutComponent } from './components/sadad-details-layout/sadad-details-layout.component';
import { CancelTransactionComponent } from './components/cancel-transaction/cancel-transaction.component';
import { CancelTransactionReviewComponent } from './components/cancel-transaction-review/cancel-transaction-review.component';
import { SadadMoiDetailsLayoutComponent } from './components/sadad-moi-details-layout/sadad-moi-details-layout.component';
import { AramcoDetailsLayoutComponent } from './components/aramco-details-layout/aramco-details-layout.component';
import { SadadMoiRefundReqDetailsLayoutComponent } from './components/sadad-moi-refund-req-details-layout/sadad-moi-refund-req-details-layout.component';
import { EsalPaymentDetailsLayoutComponent } from './components/esal-payment-details-layout/esal-payment-details-layout.component';
import { BulkTransferDetailsComponent } from './components/bulk-transfer-details/bulk-transfer-details.component';
import { BulkTransferDetailsViewComponent } from './components/bulk-transfer-details-view/bulk-transfer-details-view.component';
import { StandingOrderDetailComponent } from './components/standing-order-detail/standing-order-detail.component';
import { StandingOrderDetailLayoutComponent } from './components/standing-order-detail-layout/standing-order-detail-layout.component';
import { TransferinqurirysummaryComponent } from './components/transferinqurirysummary/transferinqurirysummary.component';
import { TransferinqurirydetailsComponent } from './components/transferinqurirydetails/transferinqurirydetails.component';
import { TransferinqurirypaymentstatusComponent } from './components/transferinqurirypaymentstatus/transferinqurirypaymentstatus.component';
import { TransferinqurirytrackerdetailsComponent } from './components/transferinqurirytrackerdetails/transferinqurirytrackerdetails.component';
import { CancelSiTransactionComponent } from './components/cancel-si-transaction/cancel-si-transaction.component';
import { CancelSiTransactionReviewComponent } from './components/cancel-si-transaction-review/cancel-si-transaction-review.component';

@NgModule({
  declarations: [
    TransactionInquiryComponent,
    SingleTransferComponent,
    BulkTransferComponent,
    StandingOrderComponent,
    SadadTransactionComponent,
    AramcoTransactionComponent,
    PayrollComponent,
    DividendsComponent,
    SingleTransferDetailLayoutComponent,
    AuthorizeSingleTransferComponent,
    RejectSingleTransferComponent,
    SingleTransferDetailsComponent,
    SadadDetailsLayoutComponent,
    CancelTransactionComponent,
    CancelTransactionReviewComponent,
    SadadMoiDetailsLayoutComponent,
    AramcoDetailsLayoutComponent,
    SadadMoiRefundReqDetailsLayoutComponent,
    EsalPaymentDetailsLayoutComponent,
    BulkTransferDetailsComponent,
    BulkTransferDetailsViewComponent,
    StandingOrderDetailComponent,
    StandingOrderDetailLayoutComponent,
    TransferinqurirysummaryComponent,
    TransferinqurirydetailsComponent,
    TransferinqurirypaymentstatusComponent,
    TransferinqurirytrackerdetailsComponent,
    CancelSiTransactionComponent,
    CancelSiTransactionReviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CommonComponentsModule,
    TransactionInquiryRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class TransactionInquiryModule { }
