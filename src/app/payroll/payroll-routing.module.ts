import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollFileUploadComponent } from './components/payroll-file-upload/payroll-file-upload.component';
import { PayrollOnboardingComponent } from './components/payroll-onboarding/payroll-onboarding.component';
import { SpAccountsComponent } from './components/sp-accounts/sp-accounts.component';
import { SpDetailsComponent } from './components/sp-details/sp-details.component';
import { SpPaymentReviewComponent } from './components/sp-payment-review/sp-payment-review.component';
import { PayrollComponent } from './payroll.component';

const routes: Routes = [
  {
    path: '',
    component: PayrollComponent,
    children: [
      { path: '', redirectTo: '/payroll/fileUpload', pathMatch: 'full' },
      { path: 'fileUpload', component: PayrollFileUploadComponent },
      { path: 'onboarding', component: PayrollOnboardingComponent },
      { path: 'vendorPayment', component: PayrollFileUploadComponent },
      {
        path: 'stop-payment',
        component: SpAccountsComponent,
      },
      {
        path: 'stop-payment-details',
        component: SpDetailsComponent,
      },
      {
        path: 'stop-payment-review',
        component: SpPaymentReviewComponent,
      },
      {
        path: 'vendor-stop-payment',
        component: SpAccountsComponent,
      },
      {
        path: 'vendor-stop-payment-details',
        component: SpDetailsComponent,
      },
      {
        path: 'vendor-stop-payment-review',
        component: SpPaymentReviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
