import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplyForEpayComponent } from './components/apply-for-epay/apply-for-epay.component';
import { EPayRequestComponent } from './components/e-pay-request/e-pay-request.component';
import { EPayServiceInquiryComponent } from './components/e-pay-service-inquiry/e-pay-service-inquiry.component';
import { EPayStatementsComponent } from './components/e-pay-statements/e-pay-statements.component';
import { EPayTransactionsComponent } from './components/e-pay-transactions/e-pay-transactions.component';
import { EpayDownloadCenterComponent } from './components/epay-download-center/epay-download-center.component';
import { MerchantFinanceDisputeComponent } from './components/merchant-finance-dispute/merchant-finance-dispute.component';
import { MultiClaimReqLayoutComponent } from './components/multi-claim-req-layout/multi-claim-req-layout.component';
import { RefundRequestComponent } from './components/refund-request/refund-request.component';

const routes: Routes = [
  { path: '', redirectTo: '/epay/applyEpay', pathMatch: 'full'},
  {path:'applyEpay',component:ApplyForEpayComponent},
  {path:'epayServiceInquiry',component:EPayServiceInquiryComponent,
  children: [
    { path: '', redirectTo: 'epayRequest', pathMatch: 'full' },
    {path:'epayRequest',component:EPayRequestComponent},
    {path:'epayDownload',component:EpayDownloadCenterComponent}
  ]
  },
  {path:'epayTransactions',component:EPayTransactionsComponent},
  {path:'epayMerchantFinaceDispute',component:MerchantFinanceDisputeComponent},
  {path:'epayRefundrequest', component: RefundRequestComponent},
  {path:'epayStatements',component:EPayStatementsComponent},
  {
    path: 'multiClaimReq',
    component: MultiClaimReqLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EPayRoutingModule { }
