import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleTransferComponent } from './components/single-transfer/single-transfer.component';
import { TransactionInquiryComponent } from './transaction-inquiry.component';
import { BulkTransferComponent } from './components/bulk-transfer/bulk-transfer.component';
import { SadadTransactionComponent } from './components/sadad-transaction/sadad-transaction.component';
import { StandingOrderComponent } from './components/standing-order/standing-order.component';
import { AramcoTransactionComponent } from './components/aramco-transaction/aramco-transaction.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { DividendsComponent } from './components/dividends/dividends.component';
import { SingleTransferDetailLayoutComponent } from './components/single-transfer-detail-layout/single-transfer-detail-layout.component';
import { AuthorizeSingleTransferComponent } from './components/authorize-single-transfer/authorize-single-transfer.component';
import { RejectSingleTransferComponent } from './components/reject-single-transfer/reject-single-transfer.component';
import { SadadDetailsLayoutComponent } from './components/sadad-details-layout/sadad-details-layout.component';
import { CancelTransactionComponent } from './components/cancel-transaction/cancel-transaction.component';
import { SadadMoiDetailsLayoutComponent } from './components/sadad-moi-details-layout/sadad-moi-details-layout.component';
import { AramcoDetailsLayoutComponent } from './components/aramco-details-layout/aramco-details-layout.component';
import { SadadMoiRefundReqDetailsLayoutComponent } from './components/sadad-moi-refund-req-details-layout/sadad-moi-refund-req-details-layout.component';
import { EsalPaymentDetailsLayoutComponent } from './components/esal-payment-details-layout/esal-payment-details-layout.component';
import { BulkTransferDetailsComponent } from './components/bulk-transfer-details/bulk-transfer-details.component';
import { StandingOrderDetailLayoutComponent } from './components/standing-order-detail-layout/standing-order-detail-layout.component';
import { TransferinqurirysummaryComponent } from './components/transferinqurirysummary/transferinqurirysummary.component';
import { CancelSiTransactionComponent } from './components/cancel-si-transaction/cancel-si-transaction.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/transactionInquiry/singleTransfer',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TransactionInquiryComponent,
    children: [
      { path: 'singleTransfer', component: SingleTransferComponent },
      { path: 'bulkTransfer', component: BulkTransferComponent },
      { path: 'standingOrder', component: StandingOrderComponent },
      { path: 'sadadTransfer', component: SadadTransactionComponent },
      { path: 'aramcoTransfer', component: AramcoTransactionComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'dividends', component: DividendsComponent },
    ],
  },
  {
    path: 'singleTransferDetailsLayout',
    component: SingleTransferDetailLayoutComponent,
  },
  {
    path: 'authorizeSingleTransfer',
    component: AuthorizeSingleTransferComponent,
  },
  { path: 'rejectSingleTransfer', component: RejectSingleTransferComponent },
  { path: 'cancelSingleTransfer', component: CancelTransactionComponent },
  { path: 'sadadDetailsLayout', component: SadadDetailsLayoutComponent },
  { path: 'sadadMoiDetailsLayout', component: SadadMoiDetailsLayoutComponent },
  { path: 'aramcoDetailsLayout', component: AramcoDetailsLayoutComponent },
  { path: 'sadadMoiRefundReqDetailsLayout', component: SadadMoiRefundReqDetailsLayoutComponent },
  { path: 'esalPaymentDetailsLayout', component: EsalPaymentDetailsLayoutComponent },
  {
    path: 'bulkTransferDetails', component: BulkTransferDetailsComponent
  },
  {
    path: 'standingOrderDetails', component: StandingOrderDetailLayoutComponent
  },
  { path: 'swift-gpi', component: TransferinqurirysummaryComponent },
  { path: 'cancelSITransfer', component: CancelSiTransactionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionInquiryRoutingModule {}
