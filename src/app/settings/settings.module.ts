import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AppearanceComponent } from './components/appearance/appearance.component';
import { ManageAlertsComponent } from './components/manage-alerts/manage-alerts.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgxPrintModule } from 'ngx-print';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChangePassConfirmPopupComponent } from './components/change-pass-confirm-popup/change-pass-confirm-popup.component';
import { UpdateNationalIdComponent } from './components/update-national-id/update-national-id.component';
import { UpdateNationalAddressComponent } from './components/update-national-address/update-national-address.component';
import { UpdateCrExpiryComponent } from './components/update-cr-expiry/update-cr-expiry.component';
import { ChangePvnComponent } from './components/change-pvn/change-pvn.component';
import { PvnReceiptComponent } from './components/pvn-receipt/pvn-receipt.component';
import { FatcaComponent } from './components/fatca/fatca.component';
import { TokenInquiryComponent } from './components/token-inquiry/token-inquiry.component';
import { TokenRequestComponent } from './components/token-request/token-request.component';


@NgModule({
  declarations: [
    SettingsComponent,
    PreferencesComponent,
    UserProfileComponent,
    AppearanceComponent,
    ManageAlertsComponent,
    ChangePasswordComponent,
    ChangePassConfirmPopupComponent,
    UpdateNationalIdComponent,
    UpdateNationalAddressComponent,
    UpdateCrExpiryComponent,
    FatcaComponent,
    ChangePvnComponent,
    PvnReceiptComponent,
    TokenInquiryComponent,
    TokenRequestComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    CommonComponentsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    NgxPrintModule,
    MatSlideToggleModule
  ]
})
export class SettingsModule { }
