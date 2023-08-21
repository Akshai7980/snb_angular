import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-et-company-info',
  templateUrl: './et-company-info.component.html',
  styleUrls: ['./et-company-info.component.scss'],
})
export class EtCompanyInfoComponent implements OnInit {
  @Input() companyInformation: any;
  constructor() {}

  ngOnInit(): void {}
}
