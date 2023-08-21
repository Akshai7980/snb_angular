import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-service-inquiry-request-summary',
  templateUrl: './service-inquiry-request-summary.component.html',
  styleUrls: ['./service-inquiry-request-summary.component.scss']
})
export class ServiceInquiryRequestSummaryComponent implements OnInit {
  isLoadingComplete: boolean = true;

  transferSummaryDetails: any = {};
  workFlowAndHistoryParams: any = {};
  printSection = 'serviceInquiryRequestSummary';
  logo = 'assets/images/snb-logo-print.png';

  @Output() getServiceInquiryEmit = new EventEmitter<any>();
  @Input() serviceDetails: any;

  constructor() { }

  ngOnInit(): void {
    this.workFlowAndHistoryParams = {
      refNum: this.serviceDetails.refNo,
      productCode: "CORESVS",
      subProductCode: "SERINQ",
      functionCode: "SINQFNC",
    };
  }

  onClickBackArrow() {
    this.getServiceInquiryEmit.emit({canProceed: false});
  }

}
