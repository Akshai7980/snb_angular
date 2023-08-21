import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsComponent } from './payments.component';
import { AddBeneficiaryComponent } from './components/add-beneficiary/add-beneficiary.component';
import { BeneficiaryWithinbankComponent } from './components/beneficiary-withinbank/beneficiary-withinbank.component';
import { BeneficiaryLocaltransferComponent } from './components/beneficiary-localtransfer/beneficiary-localtransfer.component';
import { BeneficiaryInternationaltransferComponent } from './components/beneficiary-internationaltransfer/beneficiary-internationaltransfer.component';

import { FundTransferMenuComponent } from './components/fund-transfer-menu/fund-transfer-menu.component';
import { FundTransferOwnAccountComponent } from './components/fund-transfer-own-account/fund-transfer-own-account.component';
import { FundTransferWithinBankComponent } from './components/fund-transfer-within-bank/fund-transfer-within-bank.component';
import { FundTransferLocalComponent } from './components/fund-transfer-local/fund-transfer-local.component';
import { FundTransferInternationalComponent } from './components/fund-transfer-international/fund-transfer-international.component';
import { BeneficiaryInquiryComponent } from './components/beneficiary-inquiry/beneficiary-inquiry.component';
import { BeneficiaryActivationComponent } from './components/beneficiary-activation/beneficiary-activation.component';
import { BeneficiaryDetailsLayoutComponent } from './components/beneficiary-details-layout/beneficiary-details-layout.component';
import { DeleteBeneficiaryComponent } from './components/delete-beneficiary/delete-beneficiary.component';
import { StandingOrderDetailsComponent } from './components/standing-order-details/standing-order-details.component';
import { SiOwnTransferComponent } from './components/si-own-transfer/si-own-transfer.component';
import { SiLocalTransferComponent } from './components/si-local-transfer/si-local-transfer.component';
import { SiInternationalTransferComponent } from './components/si-international-transfer/si-international-transfer.component';
import { SiMenuComponent } from './components/si-menu/si-menu.component';
import { UploadBulkBeneficiaryComponent } from './components/upload-bulk-beneficiary/upload-bulk-beneficiary.component';

const routes: Routes = [
  { path: '', component: PaymentsComponent },
  {
    path: 'addBeneficiary',
    component: AddBeneficiaryComponent,
    children: [
      { path: '', redirectTo: 'beneficiaryWithinbank', pathMatch: 'full' },
      {
        path: 'beneficiaryWithinbank',
        component: BeneficiaryWithinbankComponent,
      },
      {
        path: 'beneficiaryLocal',
        component: BeneficiaryLocaltransferComponent,
      },
      {
        path: 'beneficiaryInternational',
        component: BeneficiaryInternationaltransferComponent,
      },
    ],
  },
  {
    path: 'fundTransfer',
    component: FundTransferMenuComponent,
    children: [
      { path: '', redirectTo: 'ownAccount', pathMatch: 'full' },
      { path: 'ownAccount', component: FundTransferOwnAccountComponent },
      { path: 'withinBank', component: FundTransferWithinBankComponent },
      { path: 'LocalTransfer', component: FundTransferLocalComponent },
      { path: 'international', component: FundTransferInternationalComponent },
    ],
  },
  { path: 'beneficiaryInquiry', component: BeneficiaryInquiryComponent },
  { path: 'uploadBulkBeneficiary', component: UploadBulkBeneficiaryComponent },
  { path: 'beneficiaryActivation', component: BeneficiaryActivationComponent },
  {
    path: 'beneficiaryDetailsLayout',
    component: BeneficiaryDetailsLayoutComponent,
  },
  { path: 'deleteBeneficiary', component: DeleteBeneficiaryComponent },
  {
    path: 'standingOrders',
    component: SiMenuComponent,
    children: [
      { path: '', redirectTo: 'ownAccount', pathMatch: 'full' },
      { path: 'ownAccount', component: SiOwnTransferComponent },
      { path: 'withinBank', component: StandingOrderDetailsComponent },
      { path: 'localTransfer', component: SiLocalTransferComponent },
      {
        path: 'internationalTransfer',
        component: SiInternationalTransferComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {}
