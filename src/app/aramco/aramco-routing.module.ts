import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AramcoInvoiceInquiryComponent } from './components/aramco-invoice-inquiry/aramco-invoice-inquiry.component';
import { AramcoMakePaymentComponent } from './components/aramco-make-payment/aramco-make-payment.component';

const routes: Routes = [
  { path: '', redirectTo: '/aramco/makePayment', pathMatch: 'full' },
  { path: 'makePayment', component: AramcoMakePaymentComponent },
  { path: 'invoiceInquiry', component: AramcoInvoiceInquiryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AramcoRoutingModule { }
