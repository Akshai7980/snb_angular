import { Component, Input, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-bulk-transfer-details-view',
  templateUrl: './bulk-transfer-details-view.component.html',
  styleUrls: ['./bulk-transfer-details-view.component.scss'],
})
export class BulkTransferDetailsViewComponent implements OnInit {
  selectedTransfer: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() filestatus : any;
  fileUploadedDetails:any;
  constructor() {}

  ngOnInit(): void {
    this.selectedTransfer = this.rootScopeData.sadadBillerSummaryObject;
    this.fileUploadedDetails={
      "fileName":"",
      "fileActualName":this.selectedTransfer.odFileName,
      "moduleId":"FILEDLD"
    }
  }
}
