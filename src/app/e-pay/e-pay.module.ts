import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EPayRoutingModule } from './e-pay-routing.module';
import { ApplyForEpayComponent } from './components/apply-for-epay/apply-for-epay.component';
import { EPayServiceInquiryComponent } from './components/e-pay-service-inquiry/e-pay-service-inquiry.component';
import { NewMerchantDetailsComponent } from './components/new-merchant-details/new-merchant-details.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { EPayRequestComponent } from './components/e-pay-request/e-pay-request.component';
import { EpayDownloadCenterComponent } from './components/epay-download-center/epay-download-center.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SharedModule } from '../shared/shared.module';
import { EPayTransactionsComponent } from './components/e-pay-transactions/e-pay-transactions.component';
import { TransactionLookupComponent } from './components/transaction-lookup/transaction-lookup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';
import { EPayStatementsComponent } from './components/e-pay-statements/e-pay-statements.component';
import { EPayDebitComponent } from './components/e-pay-debit/e-pay-debit.component';
import { MerchantLookupComponent } from './components/merchant-lookup/merchant-lookup.component';
import { MultiClaimReqLayoutComponent } from './components/multi-claim-req-layout/multi-claim-req-layout.component';
import { MultiClaimMerchantDetailsComponent } from './components/multi-claim-merchant-details/multi-claim-merchant-details.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MultiClaimClaimDetailsComponent } from './components/multi-claim-claim-details/multi-claim-claim-details.component';
import { MerchantFinanceDisputeComponent } from './components/merchant-finance-dispute/merchant-finance-dispute.component';
import { RefundRequestComponent } from './components/refund-request/refund-request.component';

@NgModule({
  declarations: [
    ApplyForEpayComponent,
    EPayServiceInquiryComponent,
    NewMerchantDetailsComponent,
    EPayRequestComponent,
    EpayDownloadCenterComponent,
    EPayTransactionsComponent,
    TransactionLookupComponent,
    EPayStatementsComponent,
    EPayDebitComponent,
    MerchantLookupComponent,
    MultiClaimReqLayoutComponent,
    MultiClaimMerchantDetailsComponent,
    MultiClaimClaimDetailsComponent,
    MerchantFinanceDisputeComponent,
    RefundRequestComponent
  ],
  imports: [
    CommonModule,
    EPayRoutingModule,
    MatSelectModule,
    FormsModule,
    CommonComponentsModule,
    SharedModule,
    MatCheckboxModule,
    MatButtonToggleModule
  ],providers:[CurrencyFormatPipe]
})
export class EPayModule { }
