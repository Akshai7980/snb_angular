import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SadadMoiComponent } from './components/sadad-moi/sadad-moi.component';
import { SadadPaymentsComponent } from './components/sadad-payments/sadad-payments.component';
import { AddSadadBillerComponent } from './components/add-sadad-biller/add-sadad-biller.component';
import { AddESALPayerComponent } from './components/add-esal-payer/add-esal-payer.component';
import { SadadEsalComponent } from './components/sadad-esal/sadad-esal.component';
import { SadadBillerInquiryComponent } from './components/sadad-biller-inquiry/sadad-biller-inquiry.component';
import { BillsInquiryComponent } from './components/bills-inquiry/bills-inquiry.component';
import { SadadBillerDetailsLayoutComponent } from './components/sadad-biller-details-layout/sadad-biller-details-layout.component';
import { DeleteSadadBillerComponent } from './components/delete-sadad-biller/delete-sadad-biller.component';
import { SadadMoiRefundComponent } from './components/sadad-moi-refund/sadad-moi-refund.component';
import { SadadBulkPaymentComponent } from './components/sadad-bulk-payment/sadad-bulk-payment.component';
import { SadadMoiBulkPaymentComponent } from './components/sadad-moi-bulk-payment/sadad-moi-bulk-payment.component';
import { EsalBillerInquiryComponent } from './components/esal-biller-inquiry/esal-biller-inquiry.component';
import { EsalBillerDetailsLayoutComponent } from './components/esal-biller-details-layout/esal-biller-details-layout.component';
import { DeleteEsalBillerComponent } from './components/delete-esal-biller/delete-esal-biller.component';

const routes: Routes = [
  { path: '', redirectTo: '/sadad/sadadPayments', pathMatch: 'full'},
  {path:'sadadPayments',component:SadadPaymentsComponent},
  {path:'addSadadBiller', component:AddSadadBillerComponent },
  {path:'sadadMoi',component:SadadMoiComponent},
  {path:'addEsalPayer',component:AddESALPayerComponent},
  {path:'sadadEsal',component:SadadEsalComponent},
  {path:'bulkPayment',component:SadadBulkPaymentComponent},
  { path: 'billsInquiry', component: BillsInquiryComponent,
  children: [
    { path: '', redirectTo: 'sadadBillerInquiry', pathMatch: 'full' },
    {path:'sadadBillerInquiry',component:SadadBillerInquiryComponent},
    {path:'esalBillerInquiry',component:EsalBillerInquiryComponent}
  ]},
  {path:'sadadBillerDetails',component:SadadBillerDetailsLayoutComponent},
  {path:'deleteSadadBiller',component:DeleteSadadBillerComponent},
  {path: 'sadadRefund', component: SadadMoiRefundComponent},
  {path:'bulkPaymentMOI',component:SadadMoiBulkPaymentComponent},
  {path:'esalBillerDetailsLayout',component:EsalBillerDetailsLayoutComponent},
  {path:'deleteEsalBiller',component:DeleteEsalBillerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SadadRoutingModule { }
