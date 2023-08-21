import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';

import { MatSelectModule } from '@angular/material/select';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { PayrollFileUploadComponent } from './components/payroll-file-upload/payroll-file-upload.component';
import { PayrollFileUploadDetailsComponent } from './components/payroll-file-upload-details/payroll-file-upload-details.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

import { PayrollDetailComponent } from './components/payroll-detail/payroll-detail.component';
import { PayrollFileSummaryDetailsComponent } from './components/payroll-file-summary-details/payroll-file-summary-details.component';
import { UploadFileAndFileDetailsComponent } from './components/upload-file-and-file-details/upload-file-and-file-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PayrollOnboardingDetailsComponent } from './components/payroll-onboarding-details/payroll-onboarding-details.component';
import { PayrollOnboardingComponent } from './components/payroll-onboarding/payroll-onboarding.component';
import { SpInquirySummaryComponent } from './components/sp-inquiry-summary/sp-inquiry-summary.component';
import { SpDetailsComponent } from './components/sp-details/sp-details.component';
import { SpStopFileComponent } from './components/sp-stop-file/sp-stop-file.component';
import { SpRecordStopComponent } from './components/sp-record-stop/sp-record-stop.component';
import { SpPaymentReviewComponent } from './components/sp-payment-review/sp-payment-review.component';
import { SpUploadDetailsComponent } from './components/sp-upload-details/sp-upload-details.component';
import { EditableRecordSummaryComponent } from './components/editable-record-summary/editable-record-summary.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpAccountsComponent } from './components/sp-accounts/sp-accounts.component';
import { SpAccountDetailsComponent } from './components/sp-account-details/sp-account-details.component';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    PayrollFileUploadComponent,
    PayrollFileUploadDetailsComponent,
    PayrollDetailComponent,
    PayrollFileSummaryDetailsComponent,
    UploadFileAndFileDetailsComponent,
    PayrollOnboardingComponent,
    PayrollOnboardingDetailsComponent,
    SpInquirySummaryComponent,
    SpDetailsComponent,
    SpStopFileComponent,
    SpRecordStopComponent,
    SpPaymentReviewComponent,
    SpUploadDetailsComponent,
    EditableRecordSummaryComponent,
    SpAccountsComponent,
    SpAccountDetailsComponent,
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MatSelectModule,
    CommonComponentsModule,
    SharedModule,
    FormsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSortModule
  ],
})
export class PayrollModule {}
