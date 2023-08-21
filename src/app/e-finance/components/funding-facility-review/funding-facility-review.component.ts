import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-funding-facility-review',
  templateUrl: './funding-facility-review.component.html',
  styleUrls: ['./funding-facility-review.component.scss'],
})
export class FundingFacilityReviewComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
   detailList:any;
  constructor(private location:Location, private router : Router) {}

  ngOnInit(): void {
   this.detailList =  this.rootScopeData.eFinanceSummary;
  //  console.log(this.detailList);
   
   if (this.detailList === "") {
    this.location.back();
  }
  }
  onBackArrowClick() {
    this.location.back();
  }
  onClickBack() {
    this.router.navigate(['/cards/cardsInquiry'])
  }
}
