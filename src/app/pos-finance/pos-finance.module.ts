import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosFinanceRoutingModule } from './pos-finance-routing.module';
import { PosFinanceRequestComponent } from './components/pos-finance-request/pos-finance-request.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SharedModule } from '../shared/shared.module';
import { PosFinanceInquiryComponent } from './components/pos-finance-inquiry/pos-finance-inquiry.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PosFinanceRequestDetailsComponent } from './components/pos-finance-request-details/pos-finance-request-details.component';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PosFinanceRequestReviewComponent } from './components/pos-finance-request-review/pos-finance-request-review.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PosFinanceSummaryComponent } from './components/pos-finance-summary/pos-finance-summary.component';

@NgModule({
  declarations: [
    PosFinanceRequestComponent,
    PosFinanceRequestDetailsComponent,
    PosFinanceRequestReviewComponent,
    PosFinanceInquiryComponent,
    PosFinanceSummaryComponent,
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    SharedModule,
    PosFinanceRoutingModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
})
export class PosFinanceModule { }
