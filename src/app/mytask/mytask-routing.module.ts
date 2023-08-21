import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollComponent } from './components/payroll/payroll.component';
import { AuthorizeAramcoPaymentComponent } from './components/authorize-aramco-payment/authorize-aramco-payment.component';
// import { AuthorizationLayoutComponent } from './components/authorization-layout/authorization-layout.component';
import { AuthorizeChequeBookRequestComponent } from './components/authorize-cheque-book-request/authorize-cheque-book-request.component';
import { AuthorizeEsalBillerComponent } from './components/authorize-esal-biller/authorize-esal-biller.component';
import { AuthorizeEsalPaymentComponent } from './components/authorize-esal-payment/authorize-esal-payment.component';
import { AuthorizeSadadBillerComponent } from './components/authorize-sadad-biller/authorize-sadad-biller.component';
import { AuthorizeSadadMoiPaymentComponent } from './components/authorize-sadad-moi-payment/authorize-sadad-moi-payment.component';
import { AuthorizeSadadMoiRefundReqComponent } from './components/authorize-sadad-moi-refund-req/authorize-sadad-moi-refund-req.component';
import { AuthorizeSadadPaymentComponent } from './components/authorize-sadad-payment/authorize-sadad-payment.component';
import { AuthorizeSingleBeneficiaryComponent } from './components/authorize-single-beneficiary/authorize-single-beneficiary.component';
import { AuthorizeSingleTransferComponent } from './components/authorize-single-transfer/authorize-single-transfer.component';
import { BeneficiariesComponent } from './components/beneficiaries/beneficiaries.component';
import { BillerManagementComponent } from './components/biller-management/biller-management.component';
import { BulkFileComponent } from './components/bulk-file/bulk-file.component';
import { DetailsLayoutComponent } from './components/details-layout/details-layout.component';
import { EsalBillerComponent } from './components/esal-biller/esal-biller.component';
import { FileTransferComponent } from './components/file-transfer/file-transfer.component';
import { MyTasksAramcoDetailsLayoutComponent } from './components/my-tasks-aramco-details-layout/my-tasks-aramco-details-layout.component';
import { MyTasksEsalBillerDetailsLayoutComponent } from './components/my-tasks-esal-biller-details-layout/my-tasks-esal-biller-details-layout.component';
import { MyTasksEsalDetailsLayoutComponent } from './components/my-tasks-esal-details-layout/my-tasks-esal-details-layout.component';
import { MyTasksSadadDetailsLayoutComponent } from './components/my-tasks-sadad-details-layout/my-tasks-sadad-details-layout.component';
import { MyTasksSadadMoiDetailsLayoutComponent } from './components/my-tasks-sadad-moi-details-layout/my-tasks-sadad-moi-details-layout.component';
import { MyTasksSadadMoiRefundReqDetailsLayoutComponent } from './components/my-tasks-sadad-moi-refund-req-details-layout/my-tasks-sadad-moi-refund-req-details-layout.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PmtSingleTransferDetailsLayoutComponent } from './components/pmt-single-transfer-details-layout/pmt-single-transfer-details-layout.component';
import { RejectAramcoPaymentComponent } from './components/reject-aramco-payment/reject-aramco-payment.component';
import { RejectChequeBookRequestComponent } from './components/reject-cheque-book-request/reject-cheque-book-request.component';
import { RejectEsalBillerComponent } from './components/reject-esal-biller/reject-esal-biller.component';
import { RejectEsalPaymentComponent } from './components/reject-esal-payment/reject-esal-payment.component';
import { RejectSadadBillerComponent } from './components/reject-sadad-biller/reject-sadad-biller.component';
import { RejectSadadMoiPaymentComponent } from './components/reject-sadad-moi-payment/reject-sadad-moi-payment.component';
import { RejectSadadMoiRefundReqComponent } from './components/reject-sadad-moi-refund-req/reject-sadad-moi-refund-req.component';
import { RejectSadadPaymentComponent } from './components/reject-sadad-payment/reject-sadad-payment.component';
import { RejectSingleBeneficiaryComponent } from './components/reject-single-beneficiary/reject-single-beneficiary.component';
import { RejectSingleTransferPaymentComponent } from './components/reject-single-transfer-payment/reject-single-transfer-payment.component';
import { SadadBillersDetailsLayoutComponent } from './components/sadad-billers-details-layout/sadad-billers-details-layout.component';
// import { RejectLayoutComponent } from './components/reject-layout/reject-layout.component';
// import { RejectReceiptComponent } from './components/reject-receipt/reject-receipt.component';
import { SadadBillersComponent } from './components/sadad-billers/sadad-billers.component';
import { ServiceRequestComponent } from './components/service-request/service-request.component';
import { SingleBeneficiaryDetailsLayoutComponent } from './components/single-beneficiary-details-layout/single-beneficiary-details-layout.component';
import { SingleFileComponent } from './components/single-file/single-file.component';
import { SingleTransferComponent } from './components/single-transfer/single-transfer.component';
// import { SuccessReceiptComponent } from './components/success-receipt/success-receipt.component';
import { MytaskComponent } from './mytask.component';
import { AuthorizedFileUploadComponent } from './components/authorized-file-upload/authorized-file-upload.component';
import { SadadComponent } from './components/sadad/sadad.component';
import { SadadSinglePaymentComponent } from './components/sadad-single-payment/sadad-single-payment.component';
import { SadadFilePaymentComponent } from './components/sadad-file-payment/sadad-file-payment.component';
import { PayrollFileUploadRejectComponent } from './components/payroll-file-upload-reject/payroll-file-upload-reject.component';
import { PayrollFileUploadAuthorizeComponent } from './components/payroll-file-upload-authorize/payroll-file-upload-authorize.component';

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
import { PayrollOnboardingComponent } from '../mytask/components/payroll-onboarding/payroll-onboarding.component';
import { PayrollOnboardingDetailsComponent } from './components/payroll-onboarding-details/payroll-onboarding-details.component';
import { PayrollOnboardingAuthorizeComponent } from './components/payroll-onboarding-authorize/payroll-onboarding-authorize.component';
import { PayrollOnboardingRejectComponent } from './components/payroll-onboarding-reject/payroll-onboarding-reject.component';
import { ReceiptBeneficiaryUploadComponent } from './components/receipt-beneficiary-upload/receipt-beneficiary-upload.component';
import { AuthorizeBulkUploadComponent } from './components/authorize-bulk-upload/authorize-bulk-upload.component';
import { RejectBulkUploadComponent } from './components/reject-bulk-upload/reject-bulk-upload.component';
import { StopPaymentListComponent } from './components/stop-payment-list/stop-payment-list.component';
import { OnboardFileTransfersComponent } from './components/onboard-file-transfers/onboard-file-transfers.component';
import { StopPaymentDetailsComponent } from './components/stop-payment-details/stop-payment-details.component';
import { AuthorizeStopPaymentComponent } from './components/authorize-stop-payment/authorize-stop-payment.component';
import { RejectStopPaymentComponent } from './components/reject-stop-payment/reject-stop-payment.component';
import { AdditionalDetailsSummaryComponent } from './components/additional-details-summary/additional-details-summary.component';
import { AddAccAuthorizeRequestComponent } from './components/add-acc-authorize-request/add-acc-authorize-request.component';
import { AddAccRejectRequestComponent } from './components/add-acc-reject-request/add-acc-reject-request.component';
import { CardsComponent } from './components/cards/cards.component';
import { CreditCardsListComponent } from './components/credit-cards-list/credit-cards-list.component';
import { CreditCardSummaryComponent } from './components/credit-card-summary/credit-card-summary.component';
import { CreditCardAuthorizeComponent } from './components/credit-card-authorize/credit-card-authorize.component';
import { CreditCardRejectComponent } from './components/credit-card-reject/credit-card-reject.component';
import { ETradeComponent } from './components/e-trade/e-trade.component';
import { EtLgListComponent } from './components/et-lg-list/et-lg-list.component';
import { EtLgDetailsComponent } from './components/et-lg-details/et-lg-details.component';
import { EtAuthorizeLgComponent } from './components/et-authorize-lg/et-authorize-lg.component';
import { EtRejectLgComponent } from './components/et-reject-lg/et-reject-lg.component';
import{MadaCardSummaryComponent} from './components/mada-card-summary/mada-card-summary.component';
import{MadaCardDetailsComponent} from './components/mada-card-details/mada-card-details.component';
import{MadaCardAuthorizeComponent} from './components/mada-card-authorize/mada-card-authorize.component';
import{MadaCardRejectComponent} from './components/mada-card-reject/mada-card-reject.component';
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
import { EPaySummaryListComponent } from './components/e-pay-summary-list/e-pay-summary-list.component';
import { EPaySummaryComponent } from './components/e-pay-summary/e-pay-summary.component';
import { EPayDetailsComponent } from './components/e-pay-details/e-pay-details.component';
import { EPayAuthorizeComponent } from './components/e-pay-authorize/e-pay-authorize.component';
import { EPayRejectComponent } from './components/e-pay-reject/e-pay-reject.component';
import { PosTransactionMainComponent } from './components/pos-transaction-main/pos-transaction-main.component';
import { PosTransactionComponent } from './components/pos-transaction/pos-transaction.component';
import { PosUploadComponent } from './components/pos-upload/pos-upload.component';

const routes: Routes = [{
  path: '', component: MytaskComponent,

  children: [
    { path: '', redirectTo: '/mytask/payment/single-payments', pathMatch: 'full' },
    {
      path: 'payment', component: PaymentComponent,
      children: [
        { path: '', redirectTo: '/single-payments', pathMatch: 'full' },
        { path: 'single-payments', component: SingleTransferComponent },
        { path: 'file-payment', component: FileTransferComponent }
       
      ]
    },
    { path: 'serviceRequest', component: ServiceRequestTabComponent ,
    children: [
      { path: '', redirectTo: '/mytask/serviceRequest/deposit', pathMatch: 'full' },
      { path: 'deposit', component: ServiceRequestComponent },
      { path: 'additionalAccount', component: AdditionalAccountComponent }
    ]
  },
    {path: 'posTransaction', component: PosTransactionMainComponent,
    children: [
      { path: '', redirectTo: '/mytask/posTransaction/posService', pathMatch: 'full' },
      { path: 'posService', component: PosTransactionComponent },
      { path: 'posUpload', component: PosUploadComponent }
    ]},

    {
      path: 'beneficiary', component: BeneficiariesComponent,
      children: [
        { path: '', redirectTo: '/mytask/beneficiary/singlefile', pathMatch: 'full' },
        { path: 'singlefile', component: SingleFileComponent },
        { path: 'bulkfile', component: BulkFileComponent }
      ]
    },
    {
      path: 'billerManagement', component: BillerManagementComponent,
      children: [
        { path: '', redirectTo: '/mytask/billerManagement/sadad-billers', pathMatch: 'full' },
        { path: 'sadad-billers', component: SadadBillersComponent},
        { path: 'esal-biller', component: EsalBillerComponent }
      ]
    },
    { path: 'Payroll', component: OnboardFileTransfersComponent, children: [
      { path: '', redirectTo: '/mytask/Payroll/file-upload', pathMatch: 'full' },
      { path: 'file-upload', component: PayrollComponent },
      { path: 'stop-payment', component: StopPaymentListComponent },
    ]},
    { path: 'Onboarding', component: PayrollOnboardingComponent},
    { path: 'commonServices', component: CommonServicesComponent },
    { path: 'sadad-billers', component: SadadBillersComponent },
    { path: 'sadad', component: SadadComponent,
    children: [
      { path: '', redirectTo: '/mytask/sadad/sadadsinglepayment', pathMatch: 'full' },
      { path: 'sadadsinglepayment', component: SadadSinglePaymentComponent },
      { path: 'sadadfilepayment', component: SadadFilePaymentComponent }

    ]  
  },
  
  {
    path: 'cards', component: CardsComponent,
    children: [
      { path: '', redirectTo: '/mytask/cards/creditCard', pathMatch: 'full' },
      { path: 'creditCard', component: CreditCardsListComponent },
      { path: 'madaCardMyTask', component: MadaCardSummaryComponent }
    ]
  },
  { path: 'instantTransferManagement', component: InstantTransferManagementComponent },
  { path: 'eTrade', component: ETradeComponent, children: [
    { path: '', redirectTo: '/mytask/eTrade/lg', pathMatch: 'full' },
    { path: 'lg', component: EtLgListComponent },
  ]},
  { path: 'posFinance', component: PosFinanceComponent, 
    children: [
      {path: '', redirectTo: '/mytask/posFinance', pathMatch: 'full' }
    ]
  },
  { path: 'ePay', component: EPaySummaryListComponent, 
    children: [
      {path: '', redirectTo: '/mytask/ePay', pathMatch: 'full' }
    ]
  }
  ]},
  
  {path: 'authorizeChequeBookRequest', component:AuthorizeChequeBookRequestComponent},
  {path: 'rejectChequeBookRequest', component:RejectChequeBookRequestComponent},
  {path: 'detailsLayout', component:DetailsLayoutComponent},
  {path: 'additionalDetailsSummary', component:AdditionalDetailsSummaryComponent},
  {path: 'additionalAccAuthorizeRequest', component:AddAccAuthorizeRequestComponent},
  {path: 'additionalAccRejectRequest', component:AddAccRejectRequestComponent},
  {path:'singleBeneficiaryDetails',component:SingleBeneficiaryDetailsLayoutComponent},
  {path:'receiptBeneficiaryUpload',component:ReceiptBeneficiaryUploadComponent},
  {path: 'posReview', component:PosReviewTransactionDetailsComponent},
  {path: 'posUploadReview', component:PosReviewTransactionDetailsComponent},
  {path: 'posReject', component:RejectPosTransactionDetailsComponent},
  {path: 'posAuthorize', component:AuthorizePosTransactionDetailsComponent},
  {path:'authFileUpload',component:AuthorizedFileUploadComponent},
  {path:'sadadbillerDetails',component:SadadBillersDetailsLayoutComponent},
  {path: 'authorizeSingleBeneficiaryRequest', component:AuthorizeSingleBeneficiaryComponent},
  {path: 'rejectSingleBeneficiaryRequest', component:RejectSingleBeneficiaryComponent},
  {path: 'singlePmttransferDetails', component:PmtSingleTransferDetailsLayoutComponent},  
  {path:'rejectSingleTransferPmt',component:RejectSingleTransferPaymentComponent},
  {path:'authorizeSingleTransferPmt',component:AuthorizeSingleTransferComponent},
  {path: 'authorizeSadadBillerRequest', component:AuthorizeSadadBillerComponent},
  {path: 'rejectSadadBillerRequest', component:RejectSadadBillerComponent},
  {path: 'rejectPayrollFileUpload', component:PayrollFileUploadRejectComponent},
  {path: 'authorizePayrollFileUpload', component:PayrollFileUploadAuthorizeComponent},
  {path:'payrollOnboardingDetails',component: PayrollOnboardingDetailsComponent},
  {path:'payrollOnboardingAuthorize',component: PayrollOnboardingAuthorizeComponent},
  {path:'payrollOnboardingReject',component: PayrollOnboardingRejectComponent},

  {path: 'sadadDetailsLayout', component:MyTasksSadadDetailsLayoutComponent},
  {path: 'authorizeSadadPayment', component:AuthorizeSadadPaymentComponent},
  {path: 'rejectSadadPayment', component:RejectSadadPaymentComponent},
  {path: 'sadadMoiDetailsLayout', component:MyTasksSadadMoiDetailsLayoutComponent},
  {path: 'authorizeSadadMoiPayment', component:AuthorizeSadadMoiPaymentComponent},
  {path: 'rejectSadadMoiPayment', component:RejectSadadMoiPaymentComponent},
  {path: 'aramcoDetailsLayout', component:MyTasksAramcoDetailsLayoutComponent},
  {path: 'authorizeAramcoPayment', component:AuthorizeAramcoPaymentComponent},
  {path: 'rejectAramcoPayment', component:RejectAramcoPaymentComponent},
  {path: 'sadadMoiRefundReqDetailsLayout', component:MyTasksSadadMoiRefundReqDetailsLayoutComponent},
  {path: 'authorizeSadadMoiRefundReq', component:AuthorizeSadadMoiRefundReqComponent},
  {path: 'rejectSadadMoiRefundReq', component:RejectSadadMoiRefundReqComponent},
  {path: 'esalDetailsLayout', component:MyTasksEsalDetailsLayoutComponent},
  {path: 'authorizeEsalPayment', component:AuthorizeEsalPaymentComponent},
  {path: 'rejectEsalPayment', component:RejectEsalPaymentComponent},
  {path: 'esalBillerDetailsLayout', component:MyTasksEsalBillerDetailsLayoutComponent},
  {path: 'authorizeEsalBiller', component:AuthorizeEsalBillerComponent},
  {path: 'rejectEsalBiller', component:RejectEsalBillerComponent},
  {path: 'authorizeSadadBulkPayment', component:AuthorizeSadadBulkPaymentComponent},
  {path: 'rejectSadadBulkPayment', component:RejectSadadBulkPaymentComponent},
  {path: 'sadadBulkPaymentDetails', component:SadadBulkPaymentDetailsComponent},
  {path: 'instantTransferRegDetailsLayout', component:InstantTransferRegistrationDetailsLayoutComponent},
  {path: 'authorizeIPSRegistration', component:AuthorizeIPSRegistrationComponent},
  {path: 'rejectIPSRegistration', component:RejectIPSRegistrationComponent},
  {path: 'instantTransferDeRegDetailsLayout', component:InstantTransferDeregDetailsLayoutComponent},
  {path: 'authorizeIPSDeRegistration', component:AuthorizeIPSDeregistrationComponent},
  {path: 'rejectIPSDeRegistration', component:RejectIPSDeregistrationComponent},
  {path: 'qtlDetailsLayout', component:QtlDetailsLayoutComponent},
  {path: 'authorizeQtl', component:AuthorizeQtlComponent},
  {path: 'rejectQtl', component:RejectQtlComponent},
  {path: 'authorizeBulkPayment', component:AuthorizeBulkUploadComponent},
  {path: 'rejectBulkPayment', component:RejectBulkUploadComponent},
  {path: 'stopPaymentDetails', component:StopPaymentDetailsComponent},
  {path: 'authorize-stop-payment', component:AuthorizeStopPaymentComponent},
  {path:'reject-stop-payment',component: RejectStopPaymentComponent},
  // {path:'rejectReceipt',component:RejectReceiptComponent}
  {path:'creditCardSummary',component: CreditCardSummaryComponent},
  {path:'creditCardAuthorize',component: CreditCardAuthorizeComponent},
  {path:'creditCardReject',component: CreditCardRejectComponent},
  {path: 'lgDetails', component: EtLgDetailsComponent},
  {path: 'authorizeLg', component: EtAuthorizeLgComponent},
  {path: 'rejectLg', component: EtRejectLgComponent},
  { path: 'madaCardDetails', component: MadaCardDetailsComponent },
  { path: 'madaCardAuthorize', component: MadaCardAuthorizeComponent },
  { path: 'madaCardReject', component: MadaCardRejectComponent },
  {path: 'authorizeCommon', component : AuthorizeCommonServicesComponent},
  {path: 'rejectCommon', component : RejectCommonServicesComponent},
  {path:'nationalAddressDetails',component : NationalAddressDetailsComponent},
  {path:'posFinanceSummary',component : PosFinanceSummaryComponent},
  {path:'posFinanceAuthorize',component : PosFinanceAuthorizeComponent},
  {path:'posFinanceReject',component : PosFinanceRejectComponent},
  {path:'ePaySummary', component: EPaySummaryComponent},
  {path:'ePayDetails', component: EPayDetailsComponent},
  {path:'ePayAuthorize', component: EPayAuthorizeComponent},
  {path:'ePayReject', component: EPayRejectComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MytaskRoutingModule { }
