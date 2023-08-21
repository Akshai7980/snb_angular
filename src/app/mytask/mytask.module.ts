import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MytaskRoutingModule } from './mytask-routing.module';
import { MytaskComponent } from './mytask.component';
import { PaymentComponent } from './components/payment/payment.component';
import { BeneficiariesComponent } from './components/beneficiaries/beneficiaries.component';
import { ServiceRequestComponent } from './components/service-request/service-request.component';
import { BulkFileComponent } from './components/bulk-file/bulk-file.component';
import { SingleFileComponent } from './components/single-file/single-file.component';
import { SingleTransferComponent } from './components/single-transfer/single-transfer.component';
import { FileTransferComponent } from './components/file-transfer/file-transfer.component';
import { SharedModule } from '../shared/shared.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SadadBillersComponent } from './components/sadad-billers/sadad-billers.component';
import { DetailsLayoutComponent } from './components/details-layout/details-layout.component';
// import { AuthorizationLayoutComponent } from './components/authorization-layout/authorization-layout.component';
// import { RejectLayoutComponent } from './components/reject-layout/reject-layout.component';
// import { SuccessReceiptComponent } from './components/success-receipt/success-receipt.component';
// import { RejectReceiptComponent } from './components/reject-receipt/reject-receipt.component';
import { AuthorizeChequeBookRequestComponent } from './components/authorize-cheque-book-request/authorize-cheque-book-request.component';
import { RejectChequeBookRequestComponent } from './components/reject-cheque-book-request/reject-cheque-book-request.component';
import { SingleBeneficiaryDetailsLayoutComponent } from './components/single-beneficiary-details-layout/single-beneficiary-details-layout.component';
import { AuthorizeSingleBeneficiaryComponent } from './components/authorize-single-beneficiary/authorize-single-beneficiary.component';
import { RejectSingleBeneficiaryComponent } from './components/reject-single-beneficiary/reject-single-beneficiary.component';
import { PmtSingleTransferDetailsLayoutComponent } from './components/pmt-single-transfer-details-layout/pmt-single-transfer-details-layout.component';
import { AuthorizeSingleTransferComponent } from './components/authorize-single-transfer/authorize-single-transfer.component';
import { RejectSingleTransferPaymentComponent } from './components/reject-single-transfer-payment/reject-single-transfer-payment.component';
import { MyTasksBeneficiaryDetailsComponent } from './components/my-tasks-beneficiary-details/my-tasks-beneficiary-details.component';
import { SadadBillersDetailsComponent } from './components/sadad-billers-details/sadad-billers-details.component';
import { SadadBillersDetailsLayoutComponent } from './components/sadad-billers-details-layout/sadad-billers-details-layout.component';
import { AuthorizeSadadBillerComponent } from './components/authorize-sadad-biller/authorize-sadad-biller.component';
import { RejectSadadBillerComponent } from './components/reject-sadad-biller/reject-sadad-biller.component';
import { MyTasksSadadDetailsLayoutComponent } from './components/my-tasks-sadad-details-layout/my-tasks-sadad-details-layout.component';
import { AuthorizeSadadPaymentComponent } from './components/authorize-sadad-payment/authorize-sadad-payment.component';
import { RejectSadadPaymentComponent } from './components/reject-sadad-payment/reject-sadad-payment.component';
import { MyTasksSadadMoiDetailsLayoutComponent } from './components/my-tasks-sadad-moi-details-layout/my-tasks-sadad-moi-details-layout.component';
import { AuthorizeSadadMoiPaymentComponent } from './components/authorize-sadad-moi-payment/authorize-sadad-moi-payment.component';
import { RejectSadadMoiPaymentComponent } from './components/reject-sadad-moi-payment/reject-sadad-moi-payment.component';
import { MyTasksAramcoDetailsLayoutComponent } from './components/my-tasks-aramco-details-layout/my-tasks-aramco-details-layout.component';
import { AuthorizeAramcoPaymentComponent } from './components/authorize-aramco-payment/authorize-aramco-payment.component';
import { RejectAramcoPaymentComponent } from './components/reject-aramco-payment/reject-aramco-payment.component';
import { MyTasksSadadMoiRefundReqDetailsLayoutComponent } from './components/my-tasks-sadad-moi-refund-req-details-layout/my-tasks-sadad-moi-refund-req-details-layout.component';
import { AuthorizeSadadMoiRefundReqComponent } from './components/authorize-sadad-moi-refund-req/authorize-sadad-moi-refund-req.component';
import { RejectSadadMoiRefundReqComponent } from './components/reject-sadad-moi-refund-req/reject-sadad-moi-refund-req.component';
import { MyTasksEsalDetailsLayoutComponent } from './components/my-tasks-esal-details-layout/my-tasks-esal-details-layout.component';
import { AuthorizeEsalPaymentComponent } from './components/authorize-esal-payment/authorize-esal-payment.component';
import { RejectEsalPaymentComponent } from './components/reject-esal-payment/reject-esal-payment.component';
import { BillerManagementComponent } from './components/biller-management/biller-management.component';
import { EsalBillerComponent } from './components/esal-biller/esal-biller.component';
import { MyTasksEsalBillerDetailsLayoutComponent } from './components/my-tasks-esal-biller-details-layout/my-tasks-esal-biller-details-layout.component';
import { AuthorizeEsalBillerComponent } from './components/authorize-esal-biller/authorize-esal-biller.component';
import { RejectEsalBillerComponent } from './components/reject-esal-biller/reject-esal-biller.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { AuthorizedFileUploadComponent } from './components/authorized-file-upload/authorized-file-upload.component';
import { SadadComponent } from './components/sadad/sadad.component';
import { SadadSinglePaymentComponent } from './components/sadad-single-payment/sadad-single-payment.component';
import { SadadFilePaymentComponent } from './components/sadad-file-payment/sadad-file-payment.component';
import { PayrollFileUploadRejectComponent } from './components/payroll-file-upload-reject/payroll-file-upload-reject.component';
import { PayrollFileUploadAuthorizeComponent } from './components/payroll-file-upload-authorize/payroll-file-upload-authorize.component';

//import { SadadFilePaymentComponent } from './components/sadad-file-payment/sadad-file-payment.component';
import { AuthorizeSadadBulkPaymentComponent } from './components/authorize-sadad-bulk-payment/authorize-sadad-bulk-payment.component';
import { RejectSadadBulkPaymentComponent } from './components/reject-sadad-bulk-payment/reject-sadad-bulk-payment.component';
import { SadadBulkPaymentDetailsComponent } from './components/sadad-bulk-payment-details/sadad-bulk-payment-details.component';
import { InstantTransferManagementComponent } from './components/instant-transfer-management/instant-transfer-management.component';
import { InstantTransferRegistrationDetailsLayoutComponent } from './components/instant-transfer-registration-details-layout/instant-transfer-registration-details-layout.component';
import { AuthorizeIPSRegistrationComponent } from './components/authorize-ipsregistration/authorize-ipsregistration.component';
import { RejectIPSRegistrationComponent } from './components/reject-ipsregistration/reject-ipsregistration.component';
import { InstantTransferDeregDetailsLayoutComponent } from './components/instant-transfer-dereg-details-layout/instant-transfer-dereg-details-layout.component';
import { AuthorizeIPSDeregistrationComponent } from './components/authorize-ipsderegistration/authorize-ipsderegistration.component';
import { RejectIPSDeregistrationComponent } from './components/reject-ipsderegistration/reject-ipsderegistration.component';
import { QtlDetailsLayoutComponent } from './components/qtl-details-layout/qtl-details-layout.component';
import { AuthorizeQtlComponent } from './components/authorize-qtl/authorize-qtl.component';
import { RejectQtlComponent } from './components/reject-qtl/reject-qtl.component';
import { PayrollOnboardingComponent } from './components/payroll-onboarding/payroll-onboarding.component';
import { PayrollOnboardingAuthorizeComponent } from './components/payroll-onboarding-authorize/payroll-onboarding-authorize.component';
import { PayrollOnboardingRejectComponent } from './components/payroll-onboarding-reject/payroll-onboarding-reject.component';
import { PayrollOnboardingDetailsComponent } from './components/payroll-onboarding-details/payroll-onboarding-details.component';
import { ReceiptBeneficiaryUploadComponent } from './components/receipt-beneficiary-upload/receipt-beneficiary-upload.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthorizeBulkUploadComponent } from './components/authorize-bulk-upload/authorize-bulk-upload.component';
import { RejectBulkUploadComponent } from './components/reject-bulk-upload/reject-bulk-upload.component';
import { StopPaymentListComponent } from './components/stop-payment-list/stop-payment-list.component';
import { OnboardFileTransfersComponent } from './components/onboard-file-transfers/onboard-file-transfers.component';
import { StopPaymentDetailsComponent } from './components/stop-payment-details/stop-payment-details.component';
import { StopPaymentFileDetailsComponent } from './components/stop-payment-file-details/stop-payment-file-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { StopPaymentRecordsReviewComponent } from './components/stop-payment-records-review/stop-payment-records-review.component';
import { AuthorizeStopPaymentComponent } from './components/authorize-stop-payment/authorize-stop-payment.component';
import { RejectStopPaymentComponent } from './components/reject-stop-payment/reject-stop-payment.component';
import { AdditionalDetailsSummaryComponent } from './components/additional-details-summary/additional-details-summary.component';
import { AddAccAuthorizeRequestComponent } from './components/add-acc-authorize-request/add-acc-authorize-request.component';
import { AddAccRejectRequestComponent } from './components/add-acc-reject-request/add-acc-reject-request.component';
import { CardsComponent } from './components/cards/cards.component';
import { CreditCardsListComponent } from './components/credit-cards-list/credit-cards-list.component';
import { CreditCardAuthorizeComponent } from './components/credit-card-authorize/credit-card-authorize.component';
import { CreditCardRejectComponent } from './components/credit-card-reject/credit-card-reject.component';
import { CreditCardSummaryComponent } from './components/credit-card-summary/credit-card-summary.component';
import { EtLgListComponent } from './components/et-lg-list/et-lg-list.component';
import { ETradeComponent } from './components/e-trade/e-trade.component';
import { EtLgDetailsComponent } from './components/et-lg-details/et-lg-details.component';
import { EtAuthorizeLgComponent } from './components/et-authorize-lg/et-authorize-lg.component';
import { EtRejectLgComponent } from './components/et-reject-lg/et-reject-lg.component';
import { MadaCardSummaryComponent } from './components/mada-card-summary/mada-card-summary.component';
import { MadaCardDetailsComponent } from './components/mada-card-details/mada-card-details.component';
import { MadaCardAuthorizeComponent } from './components/mada-card-authorize/mada-card-authorize.component';
import { MadaCardRejectComponent } from './components/mada-card-reject/mada-card-reject.component';
import { PosTransactionComponent } from './components/pos-transaction/pos-transaction.component';
import { PostransactionDetailsComponent } from './components/postransaction-details/postransaction-details.component';
import { PosReviewTransactionDetailsComponent } from './components/pos-review-transaction-details/pos-review-transaction-details.component';
import { RejectPosTransactionDetailsComponent } from './components/reject-pos-transaction-details/reject-pos-transaction-details.component';
import { AuthorizePosTransactionDetailsComponent } from './components/authorize-pos-transaction-details/authorize-pos-transaction-details.component';
import { ServiceRequestTabComponent } from './components/service-request-tab/service-request-tab.component';
import { AdditionalAccountComponent } from './components/additional-account/additional-account.component';
import { CommonServicesComponent } from './components/common-services/common-services.component';
import { AuthorizeCommonServicesComponent } from './components/authorize-common-services/authorize-common-services.component';
import { RejectCommonServicesComponent } from './components/reject-common-services/reject-common-services.component';
import { NationalAddressDetailsComponent } from './components/national-address-details/national-address-details.component';
import { PosFinanceComponent } from './components/pos-finance/pos-finance.component';
import { PosFinanceSummaryComponent } from './components/pos-finance-summary/pos-finance-summary.component';
import { PosFinanceAuthorizeComponent } from './components/pos-finance-authorize/pos-finance-authorize.component';
import { PosFinanceRejectComponent } from './components/pos-finance-reject/pos-finance-reject.component';
import { RequestDetailsSummaryComponent } from './components/request-details-summary/request-details-summary.component';
import { CreditCardDetailsComponent } from './components/credit-card-details/credit-card-details.component';
import { EPaySummaryListComponent } from './components/e-pay-summary-list/e-pay-summary-list.component';
import { EPaySummaryComponent } from './components/e-pay-summary/e-pay-summary.component';
import { EPayDetailsComponent } from './components/e-pay-details/e-pay-details.component';
import { EPayRejectComponent } from './components/e-pay-reject/e-pay-reject.component';
import { EPayAuthorizeComponent } from './components/e-pay-authorize/e-pay-authorize.component';
import { PosTransactionMainComponent } from './components/pos-transaction-main/pos-transaction-main.component';
import { PosUploadComponent } from './components/pos-upload/pos-upload.component';

@NgModule({
  declarations: [
    MytaskComponent,
    PaymentComponent,
    BeneficiariesComponent,
    ServiceRequestComponent,
    BulkFileComponent,
    SingleFileComponent,
    SingleTransferComponent,
    FileTransferComponent,
    SadadBillersComponent,
    DetailsLayoutComponent,
    // AuthorizationLayoutComponent,
    // RejectLayoutComponent,
    // SuccessReceiptComponent,
    // RejectReceiptComponent,
    AuthorizeChequeBookRequestComponent,
    RejectChequeBookRequestComponent,
    SingleBeneficiaryDetailsLayoutComponent,
    AuthorizeSingleBeneficiaryComponent,
    RejectSingleBeneficiaryComponent,
    PmtSingleTransferDetailsLayoutComponent,
    AuthorizeSingleTransferComponent,
    RejectSingleTransferPaymentComponent,
    MyTasksBeneficiaryDetailsComponent,
    SadadBillersDetailsComponent,
    SadadBillersDetailsLayoutComponent,
    AuthorizeSadadBillerComponent,
    RejectSadadBillerComponent,
    MyTasksSadadDetailsLayoutComponent,
    AuthorizeSadadPaymentComponent,
    RejectSadadPaymentComponent,
    MyTasksSadadMoiDetailsLayoutComponent,
    AuthorizeSadadMoiPaymentComponent,
    RejectSadadMoiPaymentComponent,
    MyTasksAramcoDetailsLayoutComponent,
    AuthorizeAramcoPaymentComponent,
    RejectAramcoPaymentComponent,
    MyTasksSadadMoiRefundReqDetailsLayoutComponent,
    AuthorizeSadadMoiRefundReqComponent,
    RejectSadadMoiRefundReqComponent,
    MyTasksEsalDetailsLayoutComponent,
    AuthorizeEsalPaymentComponent,
    RejectEsalPaymentComponent,
    BillerManagementComponent,
    EsalBillerComponent,
    MyTasksEsalBillerDetailsLayoutComponent,
    AuthorizeEsalBillerComponent,
    RejectEsalBillerComponent,
    PayrollComponent,
    AuthorizedFileUploadComponent,
    SadadComponent,
    SadadSinglePaymentComponent,
    SadadFilePaymentComponent,
    PayrollFileUploadRejectComponent,
    PayrollFileUploadAuthorizeComponent,
    AuthorizeSadadBulkPaymentComponent,
    RejectSadadBulkPaymentComponent,
    SadadBulkPaymentDetailsComponent,
    InstantTransferManagementComponent,
    InstantTransferRegistrationDetailsLayoutComponent,
    AuthorizeIPSRegistrationComponent,
    RejectIPSRegistrationComponent,
    InstantTransferDeregDetailsLayoutComponent,
    AuthorizeIPSDeregistrationComponent,
    RejectIPSDeregistrationComponent,
    QtlDetailsLayoutComponent,
    AuthorizeQtlComponent,
    RejectQtlComponent,
    PayrollOnboardingComponent,
    PayrollOnboardingAuthorizeComponent,
    PayrollOnboardingRejectComponent,
    PayrollOnboardingDetailsComponent,
    ReceiptBeneficiaryUploadComponent,
    AuthorizeBulkUploadComponent,
    RejectBulkUploadComponent,
    StopPaymentListComponent,
    OnboardFileTransfersComponent,
    StopPaymentDetailsComponent,
    StopPaymentFileDetailsComponent,
    StopPaymentRecordsReviewComponent,
    AuthorizeStopPaymentComponent,
    RejectStopPaymentComponent,
    AdditionalDetailsSummaryComponent,
    AddAccAuthorizeRequestComponent,
    AddAccRejectRequestComponent,
    CardsComponent,
    CreditCardsListComponent,
    CreditCardAuthorizeComponent,
    CreditCardRejectComponent,
    CreditCardSummaryComponent,
    EtLgListComponent,
    ETradeComponent,
    EtLgDetailsComponent,
    EtAuthorizeLgComponent,
    EtRejectLgComponent,
    MadaCardSummaryComponent,
    MadaCardDetailsComponent,
    MadaCardAuthorizeComponent,
    MadaCardRejectComponent,
    PosTransactionComponent,
    PostransactionDetailsComponent,
    PosReviewTransactionDetailsComponent,
    RejectPosTransactionDetailsComponent,
    AuthorizePosTransactionDetailsComponent,
    ServiceRequestTabComponent,
    AdditionalAccountComponent,
    CommonServicesComponent,
    AuthorizeCommonServicesComponent,
    RejectCommonServicesComponent,
    NationalAddressDetailsComponent,
    PosFinanceComponent,
    PosFinanceSummaryComponent,
    PosFinanceAuthorizeComponent,
    PosFinanceRejectComponent,
    RequestDetailsSummaryComponent,
    CreditCardDetailsComponent,
    EPaySummaryListComponent,
    EPaySummaryComponent,
    EPayDetailsComponent,
    EPayAuthorizeComponent,
    EPayRejectComponent,
    PosTransactionMainComponent,
    PosUploadComponent
  ],
  imports: [
    SharedModule,
    CommonComponentsModule,
    HttpClientModule,
    CommonModule,
    MytaskRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatExpansionModule
  ]
})
export class MytaskModule { }
