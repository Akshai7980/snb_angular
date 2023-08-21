import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-inquiry',
  templateUrl: './service-inquiry.component.html',
  styleUrls: ['./service-inquiry.component.scss'],
})
export class ServiceInquiryComponent implements OnInit {
  serviceInquiryEmit: any = {};

  serviceDetails: any;

  constructor() {}

  ngOnInit(): void {
    this.serviceInquiryEmit.canProceed = false;
  }

  getServiceInquiryData(event: any) {
    this.serviceInquiryEmit = event;
    this.serviceDetails = event.requestData;
  }
}
