import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardBaseComponent } from './components/dashboard-base/dashboard-base.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { TaskComponent } from './components/task/task.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { LoansComponent } from './components/loans/loans.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { MarketPlaceComponent } from './components/market-place/market-place.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SharedModule } from '../shared/shared.module';
//import {NgxPrintModule} from 'ngx-print';
import { PaymentsRoutingModule } from '../payments/payments-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import { EmailPopupComponent } from './components/email-popup/email-popup.component';
import { MatTableModule } from '@angular/material/table';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { FormsModule } from '@angular/forms';
import { DepositComponent } from './components/deposit/deposit.component';
import { CardsComponent } from './components/cards/cards.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { CreditLimitComponent } from './components/credit-limit/credit-limit.component';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    DashboardBaseComponent,
    PortfolioComponent,
    TaskComponent,
    CreditLimitComponent,
    AccountsComponent,
    LoansComponent,
    PromotionsComponent,
    AnnouncementsComponent,
    MarketPlaceComponent,
    EmailPopupComponent,
    DepositComponent,
    CardsComponent 
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatProgressBarModule,
  //  NgxPrintModule,
    PaymentsRoutingModule,
    MatDialogModule,
    CommonComponentsModule,
    MatTableModule,
    FormsModule,
    NgxChartsModule,
    MatSelectModule,
    MatSortModule
  ],
  exports: [
    DashboardBaseComponent,
    PortfolioComponent,
    TaskComponent,
    CreditLimitComponent,
    AccountsComponent,
    LoansComponent,
    PromotionsComponent,
    AnnouncementsComponent,
    MarketPlaceComponent
  ]
})
export class DashboardModule { }
