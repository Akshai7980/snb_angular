import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-mada-card-details',
  templateUrl: './mada-card-details.component.html',
  styleUrls: ['./mada-card-details.component.scss'],
})
export class MadaCardDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowHistoryParams: any;
  selectedTransfer: any;
  workFlowAndHistoryParams: any;
  printDomWithId: string = 'fileTransferDetails';
  moduleId: string = 'PENDSADUPSUM';
  recordSummary: any = [];
  sortOptions: any = [];
  isLoadingComplete: boolean = false;
  showRecordSummary: boolean = false;
  recordSummaryObject: any = [];
  isSadadMoi: boolean = false;
  historyParams: any;
  selectedDetail: any;
  constructor(
    private router: Router,
    private location: Location,
    private mytaskService: MyTaskService
  ) {}

  ngOnInit(): void {
    // if (this.rootScopeData.myTaskSADADBulkUploadSummaryObject) {
    //   this.selectedTransfer = this.rootScopeData.myTaskSADADBulkUploadSummaryObject;
    // }
    // this.selectedDetail = this.mytaskService.getSelectedElementDetails();
    this.selectedTransfer = this.mytaskService.getSelectedElementDetails();
    // console.log(this.selectedTransfer, 'this.selectedTransfer');
    // this.selectedTransfer = this.selectedDetail;
    // console.log(this.selectedDetail,"TEST::::LLL:::")
    // this.getMadaCardDetail();

    this.setWorkFlowAndHistoryParams();
    // this.workFlowHistoryParams={
    //   refNum:this.rootScopeData.myTaskSADADSummaryObject.ref_NO,
    //   productCode:this.rootScopeData.myTaskSADADSummaryObject.product_CODE,
    //   subProductCode:this.rootScopeData.myTaskSADADSummaryObject.subprcode,
    //   functionCode:this.rootScopeData.myTaskSADADSummaryObject.function_ID,
    // }
  }

  

  onClickAuthorize() {
    this.router.navigate(['/mytask/madaCardAuthorize']);
  }
  onClickReject() {
    this.router.navigate(['/mytask/madaCardReject']);
  }
  onBackArrowClick() {
    this.router.navigate(['/mytask/cards/madaCardMyTask']);
  }
  /**
   * @description set the request payload for workflow and history api call
   */
  setWorkFlowAndHistoryParams(): void {
    //console.log(this.selectedTransfer,"TEST");
    this.workFlowAndHistoryParams = {
      refNum: this.selectedDetail?.row?.refNo,
      productCode: this.selectedDetail?.row?.productCode,
      subProductCode: this.selectedDetail?.row?.subproductCode,
      functionCode: this.selectedDetail?.row?.functionCode,
    };
    this.historyParams = {
      refNum: this.selectedDetail?.row?.refNo,
      productCode: this.selectedDetail?.row?.productCode,
      subProductCode: this.selectedDetail?.row?.subproductCode,
      functionCode: this.selectedDetail?.row?.functionCode,
    };
  }
}
