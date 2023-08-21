import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { StatementsComponent } from './components/statements/statements.component';
import { CasaComponent } from './components/casa/casa.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ChequeBookRequestComponent } from './components/cheque-book-request/cheque-book-request.component';
import { LoansComponent } from './components/loans/loans.component';
import { DepositsComponent } from './components/deposits/deposits.component';
import { ExternalAccountsComponent } from './components/external-accounts/external-accounts.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { GenerateStatementComponent } from './components/generate-statement/generate-statement.component';
import { BookDepositComponent } from './components/book-deposit/book-deposit.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { GenericServiceRequestComponent } from './components/generic-service-request/generic-service-request.component';
import { ViewEstatementComponent } from './components/view-estatement/view-estatement.component';
import { ServicerequestComponent } from './components/servicerequest/servicerequest.component';
import { DownloadcenterComponent } from './components/downloadcenter/downloadcenter.component';
import { OtherrequestComponent } from './components/otherrequest/otherrequest.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { LoanRecentTransactionComponent } from './components/loan-recent-transaction/loan-recent-transaction.component';
import { LoanRepaymentScheduleComponent } from './components/loan-repayment-schedule/loan-repayment-schedule.component';
import { NgxPrintModule } from 'ngx-print';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { AccountsInquiryComponent } from './components/accounts-inquiry/accounts-inquiry.component';
import { ChequeDetailsLayoutComponent } from './components/cheque-details-layout/cheque-details-layout.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AdditionalAccountComponent } from './components/additional-account/additional-account.component';
import { AdditionalAccountReviewComponent } from './components/additional-account-review/additional-account-review.component';
import { AdditionalAccountFormComponent } from './components/additional-account-form/additional-account-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VatInvoiceComponent } from './components/vat-invoice/vat-invoice.component';
import { BalanceCertificationComponent } from './components/balance-certification/balance-certification.component';
import { ServiceInquiryAdditionalAccountComponent } from './components/service-inquiry-additional-account/service-inquiry-additional-account.component';
import { AdditionalRequestComponent } from './components/additional-request/additional-request.component';
import { TransferSummaryComponent } from './components/transfer-summary/transfer-summary.component';
import { TransfersummaryDetailsComponent } from './components/transfersummary-details/transfersummary-details.component';
import { TransfersummaryPaymentsDetailsComponent } from './components/transfersummary-payments-details/transfersummary-payments-details.component';
import { TransfersummaryTrackerDetailsComponent } from './components/transfersummary-tracker-details/transfersummary-tracker-details.component';
import { NationalAddressDetailsComponent } from './components/national-address-details/national-address-details.component';
import { NationalAddressLayoutComponent } from './components/national-address-layout/national-address-layout.component';
import { CrExpiryLayoutComponent } from './components/cr-expiry-layout/cr-expiry-layout.component';
import { CrExpiryDetailsComponent } from './components/cr-expiry-details/cr-expiry-details.component';
import { ViewMT103Component } from './components/view-mt103/view-mt103.component';
@NgModule({
  declarations: [
    AccountsComponent,
    AccountDetailsComponent,
	RecentTransactionsComponent,
    StatementsComponent,
    CasaComponent,
    ChequeBookRequestComponent,
    LoansComponent,
    DepositsComponent,
    ExternalAccountsComponent,
    GenerateStatementComponent,
    BookDepositComponent,
    GenericServiceRequestComponent,
    ViewEstatementComponent,
    ServicerequestComponent,
    DownloadcenterComponent,
    OtherrequestComponent,
    ViewEstatementComponent,
    LoanDetailsComponent,
    LoanRecentTransactionComponent,
    LoanRepaymentScheduleComponent,
    AccountsInquiryComponent,
    ChequeDetailsLayoutComponent,
    AdditionalAccountComponent,
    AdditionalAccountReviewComponent,
    AdditionalAccountFormComponent,
    VatInvoiceComponent,
    BalanceCertificationComponent,
    ServiceInquiryAdditionalAccountComponent,
    AdditionalRequestComponent,
    TransferSummaryComponent,
    TransfersummaryDetailsComponent,
    TransfersummaryPaymentsDetailsComponent,
    TransfersummaryTrackerDetailsComponent,
    NationalAddressDetailsComponent,
    NationalAddressLayoutComponent,
    CrExpiryLayoutComponent,
    CrExpiryDetailsComponent,
    ViewMT103Component, 
      
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    CommonComponentsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    NgxPrintModule,
    MatSortModule,
    MatMenuModule,
    MatExpansionModule,
    MatAutocompleteModule,
    ReactiveFormsModule
    
    // CurrencyFormatPipe
  ]
})
export class AccountsModule { }
