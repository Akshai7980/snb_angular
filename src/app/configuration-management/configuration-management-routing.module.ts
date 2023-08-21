import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationInquiryDetailsLayoutComponent } from './components/configuration-inquiry-details-layout/configuration-inquiry-details-layout.component';
import { ConfigurationInquiryComponent } from './components/configuration-inquiry/configuration-inquiry.component';
import { QuickTransferConfigComponent } from './components/quick-transfer-config/quick-transfer-config.component';
import { QuickTransferLimitComponent } from './components/quick-transfer-limit/quick-transfer-limit.component';

const routes: Routes = [
  { path: '', redirectTo: '/configurationManagement/configurationInquiry', pathMatch: 'full'},
  { path:'configurationInquiry',component:ConfigurationInquiryComponent },
  { path:'quickTransferConfig', component:QuickTransferConfigComponent },
  { path:'quickTransferLimit',component:QuickTransferLimitComponent },
  { path: 'configurationInquiryDetailsLayout', component: ConfigurationInquiryDetailsLayoutComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationManagementRoutingModule { }
