import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchnat-edit',
  templateUrl: './merchnat-edit.component.html',
  styleUrls: ['./merchnat-edit.component.scss'],
})
export class MerchnatEditComponent implements OnInit {
  shopName = [
    { value: 'Abha' },
    { value: 'Ad-Dilam' },
    { value: 'Al-Abwa' },
    { value: 'Al Artaweeiyah' },
    { value: 'Badr' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}
  merchnatReview() {
    this.router.navigate(['/pos/merchnat_review']);
  }

  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }
}
