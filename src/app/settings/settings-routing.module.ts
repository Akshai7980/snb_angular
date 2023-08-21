import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppearanceComponent } from './components/appearance/appearance.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangePvnComponent } from './components/change-pvn/change-pvn.component';
import { FatcaComponent } from './components/fatca/fatca.component';
import { ManageAlertsComponent } from './components/manage-alerts/manage-alerts.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { TokenInquiryComponent } from './components/token-inquiry/token-inquiry.component';
import { TokenRequestComponent } from './components/token-request/token-request.component';
import { UpdateCrExpiryComponent } from './components/update-cr-expiry/update-cr-expiry.component';
import { UpdateNationalAddressComponent } from './components/update-national-address/update-national-address.component';
import { UpdateNationalIdComponent } from './components/update-national-id/update-national-id.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  // { path: '', component: SettingsComponent ,
  // children: [
  //   { path: '', redirectTo: '/settings/preferences', pathMatch: 'full' },
  //   {path: 'preferences', component: PreferencesComponent},
  //   {path: 'userProfile', component: UserProfileComponent},
  //   {path: 'appearance', component: AppearanceComponent},
  //   {path: 'manageAlerts', component: ManageAlertsComponent},
  //   {path: 'changePassword', component: ChangePasswordComponent}
    
  // ]},
  
  {path:'updateNID', component:UpdateNationalIdComponent},
  {path:'updateNationalAddress', component:UpdateNationalAddressComponent},
  {path:'updateCrExpiry',component:UpdateCrExpiryComponent},
  {path:'authentication/changePVN',component:ChangePvnComponent},
  {path:'updateCrExpiry',component:UpdateCrExpiryComponent},
  {path:'fatca',component:FatcaComponent},
  {path:'tokenInquiry',component:TokenInquiryComponent},
  {path:'tokenRequest',component:TokenRequestComponent},
  {path: 'preferences', component: PreferencesComponent},
  {path: 'userProfile', component: UserProfileComponent},
  {path: 'appearance', component: AppearanceComponent},
  {path: 'manageAlerts', component: ManageAlertsComponent},
  {path: 'changePassword', component: ChangePasswordComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
