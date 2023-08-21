import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundingFacilityReviewComponent } from './components/funding-facility-review/funding-facility-review.component';
import { FundingFacilityComponent } from './components/funding-facility/funding-facility.component';

const routes: Routes = [
  { path: '', redirectTo: '/eFinance/fundingFacility', pathMatch: 'full' },
  {
    path: 'fundingFacility',
    component: FundingFacilityComponent,
  },
  {
    path: 'fundingFacilityReview',
    component: FundingFacilityReviewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EFinanceRoutingModule { }
