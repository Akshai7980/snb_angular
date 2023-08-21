import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pos-review-transaction-details',
  templateUrl: './pos-review-transaction-details.component.html',
  styleUrls: ['./pos-review-transaction-details.component.scss']
})
export class PosReviewTransactionDetailsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  rejectScreen(){
    this.router.navigate(['/mytask/posReject']);
  }
  authorizeScreen(){
    this.router.navigate(['/mytask/posAuthorize']);
  }
}
