import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-sp-stop-file',
  templateUrl: './sp-stop-file.component.html',
  styleUrls: ['./sp-stop-file.component.scss'],
})
export class SpStopFileComponent implements OnInit {
  workflowAndHistoryRequestPayload = {};
  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor() {}

  ngOnInit(): void {
    this.setWorkflowHistoryParams();
  }

  setWorkflowHistoryParams(): void {
    this.workflowAndHistoryRequestPayload = {
      refNum: this.rootScopeData.stopPaymentTransferDetails.referenceNum,
      productCode: 'PAYMNT',
      subProductCode: 'STPPMNT',
      functionCode: 'STPFNC',
    };
  }
}
