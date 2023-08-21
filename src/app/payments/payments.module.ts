import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './payments.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { AddBeneficiaryComponent } from './components/add-beneficiary/add-beneficiary.component';
import { BeneficiaryWithinbankComponent } from './components/beneficiary-withinbank/beneficiary-withinbank.component';
import { BeneficiaryLocaltransferComponent } from './components/beneficiary-localtransfer/beneficiary-localtransfer.component';
import { BeneficiaryInternationaltransferComponent } from './components/beneficiary-internationaltransfer/beneficiary-internationaltransfer.component';
import { FundTransferMenuComponent } from './components/fund-transfer-menu/fund-transfer-menu.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

import { FundTransferOwnAccountComponent } from './components/fund-transfer-own-account/fund-transfer-own-account.component';
import { FundTransferWithinBankComponent } from './components/fund-transfer-within-bank/fund-transfer-within-bank.component';
import { FundTransferLocalComponent } from './components/fund-transfer-local/fund-transfer-local.component';
import { FundTransferInternationalComponent } from './components/fund-transfer-international/fund-transfer-international.component';
import { BeneficiaryInquiryComponent } from './components/beneficiary-inquiry/beneficiary-inquiry.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BeneficiaryActivationComponent } from './components/beneficiary-activation/beneficiary-activation.component';
import { BeneficiaryDetailsLayoutComponent } from './components/beneficiary-details-layout/beneficiary-details-layout.component';
import { DeleteBeneficiaryComponent } from './components/delete-beneficiary/delete-beneficiary.component';
import { FundTransferWithinAdhocComponent } from './components/fund-transfer-within-adhoc/fund-transfer-within-adhoc.component';
import { FundTransferLocalAdhocComponent } from './components/fund-transfer-local-adhoc/fund-transfer-local-adhoc.component';
import { FundTransferLocalQuickpayComponent } from './components/fund-transfer-local-quickpay/fund-transfer-local-quickpay.component';
import { PaymentsSingleBeneficiaryDetailsComponent } from './components/payments-single-beneficiary-details/payments-single-beneficiary-details.component';
import { StandingOrderDetailsComponent } from './components/standing-order-details/standing-order-details.component';
import { SiAdditionalDetailsComponent } from './components/si-additional-details/si-additional-details.component';
import { SiOwnTransferComponent } from './components/si-own-transfer/si-own-transfer.component';
import { SiLocalTransferComponent } from './components/si-local-transfer/si-local-transfer.component';
import { SiInternationalTransferComponent } from './components/si-international-transfer/si-international-transfer.component';
import { SiMenuComponent } from './components/si-menu/si-menu.component';
import { FileDetailsComponent } from './components/file-details/file-details.component';
import { ReviewBeneficiaryUploadComponent } from './components/review-beneficiary-upload/review-beneficiary-upload.component';
import { TemplateGuidelineComponent } from './components/template-guideline/template-guideline.component';
import { UploadBulkBeneficiaryComponent } from './components/upload-bulk-beneficiary/upload-bulk-beneficiary.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    PaymentsComponent,
    AddBeneficiaryComponent,
    BeneficiaryWithinbankComponent,
    BeneficiaryLocaltransferComponent,
    BeneficiaryInternationaltransferComponent,
    FundTransferMenuComponent,
    FundTransferOwnAccountComponent,
    FundTransferWithinBankComponent,
    FundTransferLocalComponent,
    FundTransferInternationalComponent,
    BeneficiaryInquiryComponent,
    BeneficiaryActivationComponent,
    BeneficiaryDetailsLayoutComponent,
    DeleteBeneficiaryComponent,
    FundTransferWithinAdhocComponent,
    FundTransferLocalAdhocComponent,
    FundTransferLocalQuickpayComponent,
    PaymentsSingleBeneficiaryDetailsComponent,
    StandingOrderDetailsComponent,
    SiAdditionalDetailsComponent,
    SiOwnTransferComponent,
    SiLocalTransferComponent,
    SiInternationalTransferComponent,
    SiMenuComponent,
    UploadBulkBeneficiaryComponent,
    FileDetailsComponent,
    ReviewBeneficiaryUploadComponent,
    TemplateGuidelineComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    PaymentsRoutingModule,
    CommonComponentsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule,
    MatAutocompleteModule
  ],
})
export class PaymentsModule {}
