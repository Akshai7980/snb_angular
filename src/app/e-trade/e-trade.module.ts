import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ETradeRoutingModule } from './e-trade-routing.module';
import { EtCompanyInfoComponent } from './components/et-company-info/et-company-info.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { EtRegistrationComponent } from './components/et-registration/et-registration.component';
import { EtUserInfoComponent } from './components/et-user-info/et-user-info.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { EtInquiryComponent } from './components/et-inquiry/et-inquiry.component';
import { EtIssueLgComponent } from './components/et-issue-lg/et-issue-lg.component';
import { EtLgIssueDetailsComponent } from './components/et-lg-issue-details/et-lg-issue-details.component';
import { EtApplicantDetailsComponent } from './components/et-applicant-details/et-applicant-details.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { EtLgDetailsComponent } from './components/et-lg-details/et-lg-details.component';
import { EtAmendLgComponent } from './components/et-amend-lg/et-amend-lg.component';
import { NgxNumToWordsModule } from 'ngx-num-to-words';

@NgModule({
  declarations: [
    EtRegistrationComponent,
    EtCompanyInfoComponent,
    EtUserInfoComponent,
    EtInquiryComponent,
    EtIssueLgComponent,
    EtLgIssueDetailsComponent,
    EtApplicantDetailsComponent,
    EtLgDetailsComponent,
    EtAmendLgComponent,
  ],
  imports: [
    CommonModule,
    ETradeRoutingModule,
    CommonComponentsModule,
    SharedModule,
    HttpClientModule,
    MatSelectModule,
    FormsModule,
    MatSortModule,
    NgxNumToWordsModule
  ],
})
export class ETradeModule {}
