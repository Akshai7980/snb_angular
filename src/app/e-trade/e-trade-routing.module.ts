import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtAmendLgComponent } from './components/et-amend-lg/et-amend-lg.component';
import { EtInquiryComponent } from './components/et-inquiry/et-inquiry.component';
import { EtIssueLgComponent } from './components/et-issue-lg/et-issue-lg.component';
import { EtRegistrationComponent } from './components/et-registration/et-registration.component';

const routes: Routes = [
  { path: '', redirectTo: '/eTrade/inquiry', pathMatch: 'full' },
  { path: 'registration', component: EtRegistrationComponent },
  { path: 'inquiry', component: EtInquiryComponent },
  { path: 'issueLg', component: EtIssueLgComponent },
  { path: 'amend', component: EtAmendLgComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ETradeRoutingModule {}
