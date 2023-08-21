import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-sp-record-stop',
  templateUrl: './sp-record-stop.component.html',
  styleUrls: ['./sp-record-stop.component.scss'],
})
export class SpRecordStopComponent implements OnInit {

  fileData: any = {};
  workflowAndHistoryRequestPayload = {};
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor() {}

  ngOnInit(): void {
    this.setWorkflowHistoryParams();
    this.fileData = this.rootScopeData.stopPaymentTransferDetails;
  }

  setWorkflowHistoryParams(): void {
    this.workflowAndHistoryRequestPayload = {
      refNum: this.rootScopeData.stopPaymentTransferDetails.referenceNum,
      productCode: "PAYMNT",
      subProductCode: "STPPMNT",
      functionCode: "STPFNC",
    };
  }
}
