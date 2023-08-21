import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosFinanceInquiryComponent } from './components/pos-finance-inquiry/pos-finance-inquiry.component';
import { PosFinanceRequestDetailsComponent } from './components/pos-finance-request-details/pos-finance-request-details.component';
import { PosFinanceRequestReviewComponent } from './components/pos-finance-request-review/pos-finance-request-review.component';
import { PosFinanceRequestComponent } from './components/pos-finance-request/pos-finance-request.component';
import { PosFinanceSummaryComponent } from './components/pos-finance-summary/pos-finance-summary.component';

const routes: Routes = [
  { path: '', redirectTo: '/posFinance/posRequest', pathMatch: 'full' },
  {
    path: 'posRequest',
    component: PosFinanceRequestComponent,
  },
  {
    path: 'posInquiry',
    component: PosFinanceInquiryComponent,
  },
  {
    path: 'posRequestDetails',
    component: PosFinanceRequestDetailsComponent,
  },
  {
    path: 'posRequestReview',
    component: PosFinanceRequestReviewComponent,
  },
  {
    path: 'posFinanceSummary',
    component: PosFinanceSummaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosFinanceRoutingModule { }
