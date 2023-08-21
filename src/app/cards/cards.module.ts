import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SharedModule } from '../shared/shared.module';
import { CardsRoutingModule } from './cards-routing.module';
import { CardsInquiryComponent } from './components/cards-inquiry/cards-inquiry.component';
import { MadaCardComponent } from './components/mada-card/mada-card.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { CreditCardPaymentComponent } from './components/credit-card-payment/credit-card-payment.component';
import { CardLimitMultipleComponent } from './components/card-limit-multiple/card-limit-multiple.component';
import { CardInquiryLayoutComponent } from './components/card-inquiry-layout/card-inquiry-layout.component';
import { ActivateCardComponent } from './components/activate-card/activate-card.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MadaCardDetailsComponent } from './components/mada-card-details/mada-card-details.component';
import { MadaCardDetailsSectionComponent } from './components/mada-card-details-section/mada-card-details-section.component';
import { AddMadaCardComponent } from './components/add-mada-card/add-mada-card.component';
import { AccountDetailsForCardComponent } from './components/account-details-for-card/account-details-for-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivateCardReviewComponent } from './components/activate-card-review/activate-card-review.component';
import { ActivateCardLayoutComponent } from './components/activate-card-layout/activate-card-layout.component';
import { CreditCardSummaryDetailsComponent } from './components/credit-card-summary-details/credit-card-summary-details.component';
import { CreditCardRecentTransactionsComponent } from './components/credit-card-recent-transactions/credit-card-recent-transactions.component';
import { CreditCardStatementsComponent } from './components/credit-card-statements/credit-card-statements.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreditCardTransferSummaryDetailsComponent } from './components/credit-card-transfer-summary-details/credit-card-transfer-summary-details.component';
import { CreditCardLimitComponent } from './components/credit-card-limit/credit-card-limit.component';
import { CreditViewPinComponent } from './components/credit-view-pin/credit-view-pin.component';
import { CreditViewPinLayoutComponent } from './components/credit-view-pin-layout/credit-view-pin-layout.component';
import { CreditViewPinReviewComponent } from './components/credit-view-pin-review/credit-view-pin-review.component';
import { ReIssueCreditCardComponent } from './components/re-issue-credit-card/re-issue-credit-card.component';
import { ReIssueCreditCardLayoutComponent } from './components/re-issue-credit-card-layout/re-issue-credit-card-layout.component';
import { ReIssueCreditCardReviewComponent } from './components/re-issue-credit-card-review/re-issue-credit-card-review.component';
import { StopCreditCardComponent } from './components/stop-credit-card/stop-credit-card.component';
import { CreditCardChangeWithdrawalLimitComponent } from './components/credit-card-change-withdrawal-limit/credit-card-change-withdrawal-limit.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StopMadaCardComponent } from './components/stop-mada-card/stop-mada-card.component';
import { ReissueMadaCardComponent } from './components/reissue-mada-card/reissue-mada-card.component';
import { LinkAdditionalMadaCardComponent } from './components/link-additional-mada-card/link-additional-mada-card.component';
import { PosPurchaseLimitMadaCardComponent } from './components/pos-purchase-limit-mada-card/pos-purchase-limit-mada-card.component';
import { ServiceInquiryComponent } from './components/service-inquiry/service-inquiry.component';
import { ServiceInquiryLayoutComponent } from './components/service-inquiry-layout/service-inquiry-layout.component';
import { ServiceInquiryRequestSummaryComponent } from './components/service-inquiry-request-summary/service-inquiry-request-summary.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CreditCardShowPinComponent } from './components/credit-card-show-pin/credit-card-show-pin.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    CardsInquiryComponent,
    MadaCardComponent,
    CreditCardComponent,
    CreditCardPaymentComponent,
    CardLimitMultipleComponent,
    CardInquiryLayoutComponent,
    ActivateCardComponent,
    MadaCardDetailsComponent,
    MadaCardDetailsSectionComponent,
    AddMadaCardComponent,
    AccountDetailsForCardComponent,
    ActivateCardReviewComponent,
    ActivateCardLayoutComponent,
    AccountDetailsForCardComponent,
    CreditCardSummaryDetailsComponent,
    CreditCardRecentTransactionsComponent,
    CreditCardStatementsComponent,
    CreditCardTransferSummaryDetailsComponent,
    CreditViewPinComponent,
    CreditViewPinLayoutComponent,
    CreditViewPinReviewComponent,
    CreditCardLimitComponent,
    CreditCardTransferSummaryDetailsComponent,
    CreditViewPinComponent,
    ReIssueCreditCardComponent,
    ReIssueCreditCardLayoutComponent,
    ReIssueCreditCardReviewComponent,
    CreditViewPinComponent,
    StopCreditCardComponent,
    CreditCardChangeWithdrawalLimitComponent,
    StopMadaCardComponent,
    ReissueMadaCardComponent,
    LinkAdditionalMadaCardComponent,
    PosPurchaseLimitMadaCardComponent,
    ServiceInquiryComponent,
    ServiceInquiryLayoutComponent,
    ServiceInquiryRequestSummaryComponent,
    CreditCardShowPinComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    SharedModule,
    MatTableModule,
    MatCheckboxModule,
    CardsRoutingModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatDialogModule
  ],
  exports: [
    CreditCardShowPinComponent
  ]
})
export class CardsModule {}
