import { Component, OnInit, Input } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-e-pay-details',
  templateUrl: './e-pay-details.component.html',
  styleUrls: ['./e-pay-details.component.scss']
})
export class EPayDetailsComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  requestSummaryDetails: any;
  fileUploadedDetails: any;

  @Input() pageName: string = '';

  constructor() { }

  ngOnInit(): void {
    if (this.rootScopeData.selectedEPay) {
      this.requestSummaryDetails = this.rootScopeData.selectedEPay;
      this.fileUploadedDetails = {
        flag: 'FILEDLD',
        moduleId: 'FILEDLD',
        fileName: this.requestSummaryDetails.details.fileName,
        fileActualName: this.requestSummaryDetails.details.fileName,
      };
    }
  }

}
