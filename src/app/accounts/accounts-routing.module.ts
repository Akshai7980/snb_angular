import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { BookDepositComponent } from './components/book-deposit/book-deposit.component';
import { CasaComponent } from './components/casa/casa.component';
import { ChequeBookRequestComponent } from './components/cheque-book-request/cheque-book-request.component';
import { DepositsComponent } from './components/deposits/deposits.component';
import { ExternalAccountsComponent } from './components/external-accounts/external-accounts.component';
import { GenerateStatementComponent } from './components/generate-statement/generate-statement.component';
import { GenericServiceRequestComponent } from './components/generic-service-request/generic-service-request.component';
import { LoanDetailsComponent } from './components/loan-details/loan-details.component';
import { LoanRecentTransactionComponent } from './components/loan-recent-transaction/loan-recent-transaction.component';
import { LoanRepaymentScheduleComponent } from './components/loan-repayment-schedule/loan-repayment-schedule.component';
import { LoansComponent } from './components/loans/loans.component';
import { RecentTransactionsComponent } from './components/recent-transactions/recent-transactions.component';
import { StatementsComponent } from './components/statements/statements.component';
import { ViewEstatementComponent } from './components/view-estatement/view-estatement.component';
import { ServicerequestComponent } from './components/servicerequest/servicerequest.component';
import { DownloadcenterComponent } from './components/downloadcenter/downloadcenter.component';
import { OtherrequestComponent } from './components/otherrequest/otherrequest.component';
import { AccountsInquiryComponent } from './components/accounts-inquiry/accounts-inquiry.component';
import { ChequeDetailsLayoutComponent } from './components/cheque-details-layout/cheque-details-layout.component';
import {AdditionalAccountComponent} from './components/additional-account/additional-account.component';
import { VatInvoiceComponent } from './components/vat-invoice/vat-invoice.component';
import { BalanceCertificationComponent } from './components/balance-certification/balance-certification.component';
import { ServiceInquiryAdditionalAccountComponent } from './components/service-inquiry-additional-account/service-inquiry-additional-account.component';
import { AdditionalRequestComponent } from './components/additional-request/additional-request.component';
import { TransferSummaryComponent } from './components/transfer-summary/transfer-summary.component';
import { NationalAddressLayoutComponent } from './components/national-address-layout/national-address-layout.component';
import { CrExpiryLayoutComponent } from './components/cr-expiry-layout/cr-expiry-layout.component';
import { ViewMT103Component } from './components/view-mt103/view-mt103.component';
const routes: Routes = [
  { path: '', component: AccountsComponent},
  { path: 'accounts-inquiry', component: AccountsInquiryComponent,
  children: [
    { path: '', redirectTo: 'casa', pathMatch: 'full' },
    { path: "casa", component: CasaComponent },
    { path: "loans", component: LoansComponent },
    { path: "deposits", component: DepositsComponent },
    { path: "external-account", component: ExternalAccountsComponent },
  ] },
  {path:'account-details',component:AccountDetailsComponent,
  children: [
    {path:'',redirectTo:'/recenttransaction',pathMatch:'full'},
    {path:'recenttransaction' , component:RecentTransactionsComponent},
    {path:'statements' , component:StatementsComponent}]
    },
    {path:'service-request',component:ServicerequestComponent,
    children: [
      {path:'',redirectTo:'downloadcenter',pathMatch:'full'},
      {path:'downloadcenter' , component:DownloadcenterComponent},
      {path:'otherrequest' , component:OtherrequestComponent},
      {path:'additionalrequest' , component:AdditionalRequestComponent}]
      },
    {path:'loan-details',component:LoanDetailsComponent,
  children: [
    {path:'',redirectTo:'/loanRecentTransaction',pathMatch:'full'},
    {path:'loanRecentTransaction' , component:LoanRecentTransactionComponent},
    {path:'loanRepaymentSchedule' , component:LoanRepaymentScheduleComponent}]
    },
    {path:'chequebook-request', component:ChequeBookRequestComponent},
    {path:'generate-statement', component:GenerateStatementComponent},
    {path:'book-deposit', component:BookDepositComponent},
    {path:'generic-servicerequest', component:GenericServiceRequestComponent},
    {path:'view-estatement', component:ViewEstatementComponent},
    {path:'chequedetailsLayout', component:ChequeDetailsLayoutComponent},
    {path:'additional-account', component:AdditionalAccountComponent},
    {path:'vat-invoice',component:VatInvoiceComponent},
    {path:'additional-account', component:AdditionalAccountComponent},
    {path:'balance-certificate',component:BalanceCertificationComponent},
    {path: "additionalAccount", component: ServiceInquiryAdditionalAccountComponent },
    {path:'transferSummary' , component: TransferSummaryComponent},
    {path:'nationalAddressDetails',component:NationalAddressLayoutComponent},
    {path:'crExpiryDetails',component:CrExpiryLayoutComponent},
    {path:'viewMT103', component : ViewMT103Component}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
