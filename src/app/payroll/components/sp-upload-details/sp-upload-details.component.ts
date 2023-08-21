import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-sp-upload-details',
  templateUrl: './sp-upload-details.component.html',
  styleUrls: ['./sp-upload-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpUploadDetailsComponent implements OnInit {
  fileUploadedDetails: any;
  transferDetails: any = {};
  fileStatus: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {}

  ngOnInit(): void {
    this.transferDetails = this.rootScopeData.stopPaymentTransferDetails;
    this.fileUploadedDetails = {
      fileName: '',
      moduleId: 'STPPMNTDOWNLD',
      fileActualName: this.transferDetails.fileName,
      attachmentRefNumber: this.transferDetails.referenceNum,
    };
    this.fileStatus =
      this.transferDetails.fileStatusCd === 'APVAUTH'
        ? 'LBL_APPROVED'
        : this.transferDetails.fileStatusCd === 'REJAUTH'
        ? 'LBL_REJECTED'
        : 'LBL_PENDING';
  }
}
