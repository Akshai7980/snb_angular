import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { LhsMenusComponent } from './components/lhs-menus/lhs-menus.component';
import { ShortProfileComponent } from './components/short-profile/short-profile.component';
import { SearchComponent } from './components/search/search.component';
import { SummaryToolsComponent } from './components/summary-tools/summary-tools.component';

import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { MoreActionComponent } from './components/more-action/more-action.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgxPrintModule } from 'ngx-print';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { RefreshComponent } from './components/refresh/refresh.component';
import { NoRecordFoundComponent } from './components/no-record-found/no-record-found.component';
import { SelectionComponent } from './components/selection/selection.component';
import { MatMenuModule } from '@angular/material/menu';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DeletePopupComponent } from './components/delete-popup/delete-popup.component';
import { EmptyTrashPopupComponent } from './components/empty-trash-popup/empty-trash-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteSuccessPopupComponent } from './components/delete-success-popup/delete-success-popup.component';
import { DebitLookupComponent } from './components/debit-lookup/debit-lookup.component';
import { MatTableModule } from '@angular/material/table';
import { AdvancedFilterAccountsComponent } from './components/advanced-filter-accounts/advanced-filter-accounts.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AjaxLoaderComponent } from './components/ajax-loader/ajax-loader.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { MatCardModule } from '@angular/material/card';
import { AdditionalDetailsComponent } from './components/additional-details/additional-details.component';
import { ExportStatementsComponent } from './components/export-statements/export-statements.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WorkFlowComponent } from './components/work-flow/work-flow.component';
import { HistoryComponent } from './components/history/history.component';
import { ChequeBookDetailsComponent } from './components/cheque-book-details/cheque-book-details.component';
import { DailyLimitComponent } from './components/daily-limit/daily-limit.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { AuthorizeChequeBookRequestComponent } from './components/authorize-cheque-book-request/authorize-cheque-book-request.component';
import { RejectChequeBookRequestComponent } from './components/reject-cheque-book-request/reject-cheque-book-request.component';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { SecondaryButtonComponent } from './components/secondary-button/secondary-button.component';
import { PrimaryButtonComponent } from './components/primary-button/primary-button.component';
import { TertiaryButtonComponent } from './components/tertiary-button/tertiary-button.component';
import { OtpComponent } from './components/otp/otp.component';
import { SystemErrorComponent } from './components/system-error/system-error.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { BeneficiaryDetailsComponent } from './components/beneficiary-details/beneficiary-details.component';
import { AdvancedFilterLoansComponent } from './components/advanced-filter-loans/advanced-filter-loans.component';
import { AmountDetailsComponent } from './components/amount-details/amount-details.component';
import { AdditionalDetailsPaymentsComponent } from './components/additional-details-payments/additional-details-payments.component';
import { AjaxLoaderSmallComponent } from './components/ajax-loader-small/ajax-loader-small.component';
import { AjaxLoaderMediumComponent } from './components/ajax-loader-medium/ajax-loader-medium.component';
import { BasketComponent } from './components/basket/basket.component';
import { CurrencyDropdownComponent } from './components/currency-dropdown/currency-dropdown.component';
import { SingleTransferDetailComponent } from './components/single-transfer-detail/single-transfer-detail.component';
import { CallBackComponent } from './components/call-back/call-back.component';
import { LogoutConfirmationComponent } from './components/logout-confirmation/logout-confirmation.component';
import { SingleBeneficiaryDetailsComponent } from './components/single-beneficiary-details/single-beneficiary-details.component';
import { AdvancedFiltercommonComponent } from './components/advanced-filtercommon/advanced-filtercommon.component';
import { TimeoutPopupComponent } from './components/timeout-popup/timeout-popup.component';
import { MessagePopupComponent } from './components/message-popup/message-popup.component';
import { AdvancedFilterBeneficiaryComponent } from './components/advanced-filter-beneficiary/advanced-filter-beneficiary.component';
import { AdvancedFilterTransctnInquirySadadComponent } from './components/advanced-filter-transctn-inquiry-sadad/advanced-filter-transctn-inquiry-sadad.component';
import { AdvancedFilterSingleTransferComponent } from './components/advanced-filter-single-transfer/advanced-filter-single-transfer.component';
import { AdvancedFilterBeneficiariesSingleComponent } from './components/advanced-filter-beneficiaries-single/advanced-filter-beneficiaries-single.component';
import { AdvancedFilterAramcoComponent } from './components/advanced-filter-aramco/advanced-filter-aramco.component';
import { AdvancedFilterTransactionInquirySingleTransferComponent } from './components/advanced-filter-transaction-inquiry-single-transfer/advanced-filter-transaction-inquiry-single-transfer.component';
import { TradessoTicketconfirmPopupComponent } from './components/tradesso-ticketconfirm-popup/tradesso-ticketconfirm-popup.component';
import { MatRadioModule } from '@angular/material/radio';
import { AdvancedFilterSadadPaymentsComponent } from './components/advanced-filter-sadad-payments/advanced-filter-sadad-payments.component';
import { SadadDetailsComponent } from './components/sadad-details/sadad-details.component';
import { SadadBillerDetailsComponent } from './components/sadad-biller-details/sadad-biller-details.component';
import { StandingInstructionsComponent } from './components/standing-instructions/standing-instructions.component';
import { SimpleAdditionalDetailsPaymentsComponent } from './components/simple-additional-details-payments/simple-additional-details-payments.component';
import { SadadMoiDetailsComponent } from './components/sadad-moi-details/sadad-moi-details.component';
import { DownloadTemplateComponent } from './components/download-template/download-template.component';
import { ExecutionDetailsComponent } from './components/execution-details/execution-details.component';
import { AramcoDetailsComponent } from './components/aramco-details/aramco-details.component';
import { SadadMoiRefundReqDetailsComponent } from './components/sadad-moi-refund-req-details/sadad-moi-refund-req-details.component';
import { EsalPaymentDetailsComponent } from './components/esal-payment-details/esal-payment-details.component';
import { EsalBillerDetailsComponent } from './components/esal-biller-details/esal-biller-details.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { RecordSummaryComponent } from './components/record-summary/record-summary.component';
import { DuplicateRecordsComponent } from './components/duplicate-records/duplicate-records.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { InstantTransferRegistrationDetailsComponent } from './components/instant-transfer-registration-details/instant-transfer-registration-details.component';
import { ProxyIdentifierRegistrationComponent } from './components/proxy-identifier-registration/proxy-identifier-registration.component';
import { UploadedFileDownloadComponent } from './components/uploaded-file-download/uploaded-file-download.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { IntantTransferDeregisterDetailsComponent } from './components/intant-transfer-deregister-details/intant-transfer-deregister-details.component';
import { ProxyIdentifierDeregistrationComponent } from './components/proxy-identifier-deregistration/proxy-identifier-deregistration.component';
import { QtlDetailsComponent } from './components/qtl-details/qtl-details.component';
import { AdvancedFilterSadadFilePaymentsComponent } from './components/advanced-filter-sadad-file-payments/advanced-filter-sadad-file-payments.component';
import { AdvanceSearchBulkUploadComponent } from './components/advance-search-bulk-upload/advance-search-bulk-upload.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdvancedFilterStopPaymentSummaryComponent } from './components/advanced-filter-stop-payment-summary/advanced-filter-stop-payment-summary.component';
import { AdditionalAccountRequestComponent } from './components/additional-account-request/additional-account-request.component';
import { AdvanceFilterPosServiceRequestComponent } from './components/advance-filter-pos-service-request/advance-filter-pos-service-request.component';
import { AdvancedFilterCreditCardListComponent } from './components/advanced-filter-credit-card-list/advanced-filter-credit-card-list.component';
import { AdvancedFilterPosTransactionComponent } from './components/advanced-filter-pos-transaction/advanced-filter-pos-transaction.component';
import { AdvancedFilterServiceInquiryComponent } from './components/advanced-filter-service-inquiry/advanced-filter-service-inquiry.component';
import { DownloadBalanceConfirmaionComponent } from './components/download-balance-confirmaion/download-balance-confirmaion.component';
import { AdvanceFilterETradeInquiryComponent } from './components/advance-filter-e-trade-inquiry/advance-filter-e-trade-inquiry.component';
import { ExecutionDetailsTableComponent } from './components/execution-details-table/execution-details-table.component';
import { AdvanceFilterTicketInquiryComponent } from './components/advance-filter-ticket-inquiry/advance-filter-ticket-inquiry.component';
import { SecondaryPaginationComponent } from './components/secondary-pagination/secondary-pagination.component';
import { AdvanceFilterPosFinanceInquiryComponent } from './components/advance-filter-pos-finance-inquiry/advance-filter-pos-finance-inquiry.component';
import { AdvancedFilterPosFinanceTicketInquiryComponent } from './components/advanced-filter-pos-finance-ticket-inquiry/advanced-filter-pos-finance-ticket-inquiry.component';
import { CommonMessagePopupComponent } from './components/common-message-popup/common-message-popup.component';
import { AdvancedFilterBillerinquirySadadComponent } from './components/advanced-filter-billerinquiry-sadad/advanced-filter-billerinquiry-sadad.component';
import { AdvancedFilterMytaskPosFinanceListComponent } from './components/advanced-filter-mytask-pos-finance-list/advanced-filter-mytask-pos-finance-list.component';
import { AdvanceSearchFilterEfinanceComponent } from './components/advance-search-filter-efinance/advance-search-filter-efinance.component';
import { ErrorValidationToastComponent } from './components/error-validation-toast/error-validation-toast.component';
import { AdvancedFilterMadaCardListComponent } from './components/advanced-filter-mada-card-list/advanced-filter-mada-card-list.component';
import { AdvancedFilterCreditCardSummaryComponent } from './components/advanced-filter-credit-card-summary/advanced-filter-credit-card-summary.component';
import { DuplicateRecordDetailsComponent } from './components/duplicate-record-details/duplicate-record-details.component';
import { AdvancedFilterAramcoInvoiceComponent } from './components/advanced-filter-aramco-invoice/advanced-filter-aramco-invoice.component';
import { AdvancedFilterSingleTransferTransactionInquiryComponent } from './components/advanced-filter-single-transfer-transaction-inquiry/advanced-filter-single-transfer-transaction-inquiry.component';
import { AdvancedFilterEPayServiceInquiryComponent } from './components/advanced-filter-e-pay-service-inquiry/advanced-filter-e-pay-service-inquiry.component';
import { AdvancedFilterEPayTransactionComponent } from './components/advanced-filter-epay-transaction/advanced-filter-epay-transaction.component';
import { AdvancedFilterEPaySummaryLisComponent } from './components/advanced-filter-e-pay-summary-list/advanced-filter-e-pay-summary-list.component';
import { AdvanceFilterSadadBillerComponent } from './components/advance-filter-sadad-biller/advance-filter-sadad-biller.component';
import { AdvanceFilterEsalBillerComponent } from './components/advance-filter-esal-biller/advance-filter-esal-biller.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LhsMenusComponent,
    ShortProfileComponent,
    FooterComponent,
    SearchComponent,
    SummaryToolsComponent,
    MoreActionComponent,
    FilterComponent,
    RefreshComponent,
    NoRecordFoundComponent,
    SelectionComponent,
    DatePickerComponent,
    DeletePopupComponent,
    EmptyTrashPopupComponent,
    DeleteSuccessPopupComponent,
    DebitLookupComponent,
    AuthorizationComponent,
    PaginationComponent,
    AjaxLoaderComponent,
    AdditionalDetailsComponent,
    //DebitLookupComponent,
    AdvancedFilterAccountsComponent,
    PaginationComponent,
    ExportStatementsComponent,
    AuthenticationComponent,
    WorkFlowComponent,
    HistoryComponent,
    ChequeBookDetailsComponent,
    DailyLimitComponent,
    TooltipComponent,
    DailyLimitComponent,
    AuthorizeChequeBookRequestComponent,
    RejectChequeBookRequestComponent,
	  ReceiptComponent,
    SecondaryButtonComponent,
    PrimaryButtonComponent,
    TertiaryButtonComponent,
    OtpComponent,
    SystemErrorComponent,
    AccountDetailsComponent,
    BeneficiaryDetailsComponent,
    AdvancedFilterLoansComponent,
    AmountDetailsComponent,
    AdditionalDetailsPaymentsComponent,
    AjaxLoaderSmallComponent,
    AjaxLoaderMediumComponent,
    BasketComponent,
    AjaxLoaderMediumComponent,
    CurrencyDropdownComponent,
    SingleTransferDetailComponent,
    CallBackComponent,
    LogoutConfirmationComponent,
    SingleBeneficiaryDetailsComponent,
    AdvancedFiltercommonComponent,
    TimeoutPopupComponent,
    MessagePopupComponent,
    AdvancedFilterBeneficiaryComponent,
    AdvancedFilterTransctnInquirySadadComponent,
    AdvancedFilterSingleTransferComponent,
    AdvancedFilterBeneficiariesSingleComponent,
    AdvancedFilterAramcoComponent,
    AdvancedFilterTransactionInquirySingleTransferComponent,
    TradessoTicketconfirmPopupComponent,
    AdvancedFilterSadadPaymentsComponent,
    SadadDetailsComponent,
    SadadBillerDetailsComponent,
    StandingInstructionsComponent,
    SimpleAdditionalDetailsPaymentsComponent,
    SadadMoiDetailsComponent,
    ExecutionDetailsComponent,
    AramcoDetailsComponent,
    SadadMoiRefundReqDetailsComponent,
    DownloadTemplateComponent,
    FileUploadComponent,
    EsalPaymentDetailsComponent,
    EsalBillerDetailsComponent,
    RecordSummaryComponent,
    DuplicateRecordsComponent,
    InstantTransferRegistrationDetailsComponent,
    ProxyIdentifierRegistrationComponent,
    UploadedFileDownloadComponent,
    IntantTransferDeregisterDetailsComponent,
    ProxyIdentifierDeregistrationComponent,
    QtlDetailsComponent,
    AdvancedFilterSadadFilePaymentsComponent,
    AdvanceSearchBulkUploadComponent,
    AdvancedFilterStopPaymentSummaryComponent,
    AdditionalAccountRequestComponent,
    AdvanceFilterPosServiceRequestComponent,
    AdvancedFilterCreditCardListComponent,
    AdvancedFilterPosTransactionComponent,
    AdvancedFilterServiceInquiryComponent,
    DownloadBalanceConfirmaionComponent,
    AdvanceFilterETradeInquiryComponent,
    ExecutionDetailsTableComponent,
    AdvanceFilterTicketInquiryComponent,
    SecondaryPaginationComponent,
    AdvanceFilterPosFinanceInquiryComponent,
    AdvancedFilterPosFinanceTicketInquiryComponent,
    AdvancedFilterBillerinquirySadadComponent,
    AdvancedFilterMytaskPosFinanceListComponent,
    AdvanceSearchFilterEfinanceComponent,
    CommonMessagePopupComponent,
    ErrorValidationToastComponent,
    AdvancedFilterMadaCardListComponent,
    AdvancedFilterCreditCardSummaryComponent,
    DuplicateRecordDetailsComponent,
    AdvancedFilterAramcoInvoiceComponent,
    AdvancedFilterSingleTransferTransactionInquiryComponent,
    AdvancedFilterEPayServiceInquiryComponent,
    AdvancedFilterEPayTransactionComponent,
    AdvancedFilterEPaySummaryLisComponent,
    AdvanceFilterSadadBillerComponent,
    AdvanceFilterEsalBillerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    OverlayModule,
    NgxPrintModule,
    MatAutocompleteModule,
    FormsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatSlideToggleModule ,
    MatTooltipModule  
  ],
  exports: [
    HeaderComponent,
    LhsMenusComponent,
    ShortProfileComponent,
    FooterComponent,
    SearchComponent,
    SummaryToolsComponent,
    MoreActionComponent,
    FilterComponent,
    RefreshComponent,
    NoRecordFoundComponent,
    SelectionComponent,
    DatePickerComponent,
    DebitLookupComponent,
    AuthorizationComponent,
    PaginationComponent,
    AjaxLoaderComponent,
    AdditionalDetailsComponent,
    //DebitLookupComponent,
    AdvancedFilterAccountsComponent,
    DatePickerComponent,
    PaginationComponent,
    AjaxLoaderMediumComponent,
    ExportStatementsComponent,
    AuthenticationComponent,
    WorkFlowComponent,
    HistoryComponent,
    ChequeBookDetailsComponent,
    DailyLimitComponent,
    TooltipComponent,
    DailyLimitComponent,
    AuthorizeChequeBookRequestComponent,
    RejectChequeBookRequestComponent,
	  ReceiptComponent,
    SecondaryButtonComponent,
    PrimaryButtonComponent,
    TertiaryButtonComponent,
    OtpComponent,
    SystemErrorComponent,
    AccountDetailsComponent,
    BeneficiaryDetailsComponent,
    AmountDetailsComponent,
    AdditionalDetailsPaymentsComponent,
    AjaxLoaderSmallComponent,
    BasketComponent,
    AjaxLoaderSmallComponent,
    CurrencyDropdownComponent,
    SingleTransferDetailComponent,
    CallBackComponent,
    LogoutConfirmationComponent,
    SingleBeneficiaryDetailsComponent,
    MessagePopupComponent,
    AdvancedFilterTransctnInquirySadadComponent,
    TradessoTicketconfirmPopupComponent,
    AdvancedFilterSadadPaymentsComponent,
    SadadDetailsComponent,
    SadadBillerDetailsComponent,
    StandingInstructionsComponent,
    SimpleAdditionalDetailsPaymentsComponent,
    SadadMoiDetailsComponent,
    ExecutionDetailsComponent,
    AramcoDetailsComponent,
    SadadMoiRefundReqDetailsComponent,
    DownloadTemplateComponent,
    FileUploadComponent,
    EsalPaymentDetailsComponent,
    EsalBillerDetailsComponent,
    RecordSummaryComponent,
    DuplicateRecordsComponent,
    MatTableModule,
    MatPaginatorModule,
    InstantTransferRegistrationDetailsComponent,
    ProxyIdentifierRegistrationComponent,
    UploadedFileDownloadComponent,
    IntantTransferDeregisterDetailsComponent,
    ProxyIdentifierDeregistrationComponent,
    QtlDetailsComponent,
    AdditionalAccountRequestComponent,
    ExecutionDetailsTableComponent,
    SecondaryPaginationComponent,
    ErrorValidationToastComponent,
    DuplicateRecordDetailsComponent,
    AdvanceFilterSadadBillerComponent,
    AdvanceFilterEsalBillerComponent,
    // SecondaryPaginationComponent
 ],

 providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class CommonComponentsModule {}
