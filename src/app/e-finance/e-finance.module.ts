import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EFinanceRoutingModule } from './e-finance-routing.module';
import { FundingFacilityComponent } from './components/funding-facility/funding-facility.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SharedModule } from '../shared/shared.module';
import { FundingFacilityInquiryComponent } from './components/funding-facility-inquiry/funding-facility-inquiry.component';
import { FundingFacilityReviewComponent } from './components/funding-facility-review/funding-facility-review.component';


@NgModule({
  declarations: [
    FundingFacilityComponent,
    FundingFacilityInquiryComponent,
    FundingFacilityReviewComponent
  ],
  imports: [
    CommonModule,
    EFinanceRoutingModule,
    CommonComponentsModule,
    SharedModule
  ]
})
export class EFinanceModule { }
