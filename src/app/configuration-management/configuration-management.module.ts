import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationInquiryComponent } from './components/configuration-inquiry/configuration-inquiry.component';
import { QuickTransferConfigComponent } from './components/quick-transfer-config/quick-transfer-config.component';
import { QuickTransferLimitComponent } from './components/quick-transfer-limit/quick-transfer-limit.component';
import { ConfigurationManagementRoutingModule } from './configuration-management-routing.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';
import { ProxyIdentifierComponent } from './components/proxy-identifier/proxy-identifier.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QuickTransferLimitPreviewComponent } from './components/quick-transfer-limit/quick-transfer-limit-preview/quick-transfer-limit-preview.component';
import { DeregistrationProxyIdentifierComponent } from './components/deregistration-proxy-identifier/deregistration-proxy-identifier.component';
import { ConfigurationInquiryDetailsComponent } from './components/configuration-inquiry-details/configuration-inquiry-details.component';
import { ConfigurationInquiryDetailsLayoutComponent } from './components/configuration-inquiry-details-layout/configuration-inquiry-details-layout.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ConfigurationInquiryComponent,
    QuickTransferConfigComponent,
    QuickTransferLimitComponent,
    ProxyIdentifierComponent,
    QuickTransferLimitPreviewComponent,
    DeregistrationProxyIdentifierComponent,
    ConfigurationInquiryDetailsComponent,
    ConfigurationInquiryDetailsLayoutComponent
  ],
  // imports: [
  //   CommonModule
  // ]
  imports: [
    CommonModule,
    ConfigurationManagementRoutingModule,
    CommonComponentsModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    SharedModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  exports:[],
  providers:[CurrencyFormatPipe]
})
export class ConfigurationManagementModule { }
