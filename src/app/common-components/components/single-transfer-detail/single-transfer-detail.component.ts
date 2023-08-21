import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyTaskService } from 'src/app/mytask/services/my-task.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-single-transfer-detail',
  templateUrl: './single-transfer-detail.component.html',
  styleUrls: ['./single-transfer-detail.component.scss'],
})
export class SingleTransferDetailComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferDetails: any;
  transferSummary: any;
  constructor() {}

  ngOnInit(): void {
    //debugger;
    this.transferSummary = this.rootScopeData.myTaskSingleTransferPayment.summary;
    this.transferDetails = this.rootScopeData.myTaskSingleTransferPayment.details;
  }
}
