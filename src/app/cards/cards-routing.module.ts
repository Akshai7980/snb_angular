import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardInquiryLayoutComponent } from './components/card-inquiry-layout/card-inquiry-layout.component';
import { AddMadaCardComponent } from './components/add-mada-card/add-mada-card.component';
import { CardLimitMultipleComponent } from './components/card-limit-multiple/card-limit-multiple.component';
import { CardsInquiryComponent } from './components/cards-inquiry/cards-inquiry.component';
import { CreditCardPaymentComponent } from './components/credit-card-payment/credit-card-payment.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { MadaCardComponent } from './components/mada-card/mada-card.component';
import {MadaCardDetailsComponent} from './components/mada-card-details/mada-card-details.component';
import { CreditCardSummaryDetailsComponent } from './components/credit-card-summary-details/credit-card-summary-details.component';
import { CreditCardTransferSummaryDetailsComponent } from './components/credit-card-transfer-summary-details/credit-card-transfer-summary-details.component';
import { CreditCardLimitComponent } from './components/credit-card-limit/credit-card-limit.component';
import { CreditViewPinComponent } from './components/credit-view-pin/credit-view-pin.component';
import { ReIssueCreditCardComponent } from './components/re-issue-credit-card/re-issue-credit-card.component';
import { StopCreditCardComponent } from './components/stop-credit-card/stop-credit-card.component';
import { CreditCardChangeWithdrawalLimitComponent } from './components/credit-card-change-withdrawal-limit/credit-card-change-withdrawal-limit.component';
import { ActivateCardComponent } from './components/activate-card/activate-card.component';
import {StopMadaCardComponent} from './components/stop-mada-card/stop-mada-card.component';
import { ReissueMadaCardComponent } from './components/reissue-mada-card/reissue-mada-card.component';
import {PosPurchaseLimitMadaCardComponent} from './components/pos-purchase-limit-mada-card/pos-purchase-limit-mada-card.component';
import {LinkAdditionalMadaCardComponent} from './components/link-additional-mada-card/link-additional-mada-card.component';
import { ServiceInquiryComponent } from './components/service-inquiry/service-inquiry.component';

const routes: Routes = [
  { path: '', redirectTo: '/cards/cardsInquiry', pathMatch: 'full' },
  {
    path: 'cardsInquiry',
    component: CardsInquiryComponent,
    children: [
      { path: '', redirectTo: 'credit', pathMatch: 'full' },
      { path: 'MADA', component: MadaCardComponent },
      { path: 'credit', component: CreditCardComponent },
      { path: 'layout', component: CardInquiryLayoutComponent },
    ],
  },
  { path: 'creditCardPayment', component: CreditCardPaymentComponent },
  { path: 'cardLimitMultiple', component: CardLimitMultipleComponent },
  { path: 'mada-card-detail', component: MadaCardDetailsComponent },
  { path: 'addMadaCard', component: AddMadaCardComponent },
  { path: 'creditCardSummaryDetails', component: CreditCardSummaryDetailsComponent },
  { path: 'creditCardTransferSummary', component: CreditCardTransferSummaryDetailsComponent },
  { path: 'creditCardLimit', component: CreditCardLimitComponent },
  { path: 'creditViewPin', component: CreditViewPinComponent },
  { path: 'reIssueCreditCard', component: ReIssueCreditCardComponent },
  { path: 'stopCard', component: StopCreditCardComponent },
  { path: 'changeWithdrawalLimit', component: CreditCardChangeWithdrawalLimitComponent },
  { path: 'activateCard', component: ActivateCardComponent },
  { path: 'stopMadaCard', component: StopMadaCardComponent },
  { path: 'posPurchaseLimit', component: PosPurchaseLimitMadaCardComponent },
  { path: 'linkAdditionalAcc', component: LinkAdditionalMadaCardComponent },
  { path: 'reissueMada', component: ReissueMadaCardComponent },
  { path: 'serviceInquiry', component: ServiceInquiryComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardsRoutingModule {}
