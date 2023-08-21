import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-merchnat-view',
  templateUrl: './merchnat-view.component.html',
  styleUrls: ['./merchnat-view.component.scss'],
})
export class MerchnatViewComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  back() {
    this.location.back();
  }
}
