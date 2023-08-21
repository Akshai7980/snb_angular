import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-stop-payment-file-details',
  templateUrl: './stop-payment-file-details.component.html',
  styleUrls: ['./stop-payment-file-details.component.scss'],
})
export class StopPaymentFileDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  fileDetails: any;
  downloadFileDetails: any;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    if (this.rootScopeData.selectedInquiryForStopPayment) {
      this.fileDetails = this.rootScopeData.selectedInquiryForStopPayment;
      this.downloadFileDetails = {
        fileName: '',
        moduleId: 'STPPMNTDOWNLD',
        fileActualName: this.fileDetails.fileName,
        attachmentRefNumber: '',
        referenceNum: this.fileDetails.referenceNum,
      };
    } else {
      this.router.navigate(['/mytask/Payroll/stop-payment']);
    }
  }
}
