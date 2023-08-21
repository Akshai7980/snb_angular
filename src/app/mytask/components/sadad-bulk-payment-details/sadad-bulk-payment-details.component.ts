import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';
import { Location } from '@angular/common';
import {SadadPaymentService} from  '../../../sadad/services/sadad-payment.service';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';

@Component({
  selector: 'app-sadad-bulk-payment-details',
  templateUrl: './sadad-bulk-payment-details.component.html',
  styleUrls: ['./sadad-bulk-payment-details.component.scss']
})
export class SadadBulkPaymentDetailsComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  selectedTransfer:any;
  workFlowAndHistoryParams: any;
  printDomWithId: string = 'fileTransferDetails';
  moduleId: string = 'PENDSADUPSUM';
  recordSummary: any = [];
  sortOptions: any = [];
  isLoadingComplete:boolean = false;
  showRecordSummary:boolean = false;  
  recordSummaryObject:any=[];
  isSadadMoi:boolean = false;
  historyParams:any;
  fileUploadedDetails: any;

  constructor(private sadadService: SadadPaymentService, private router:Router, private mytaskService:MyTaskService, private location:Location) { }

  ngOnInit(): void {
    // if (this.rootScopeData.myTaskSADADBulkUploadSummaryObject) {
    //   this.selectedTransfer = this.rootScopeData.myTaskSADADBulkUploadSummaryObject;
    // }
    this.selectedTransfer=this.mytaskService.getSelectedElementDetails();
    this.fileUploadedDetails={
      "fileName":"",
      "fileActualName":this.selectedTransfer.odFileName,
      "moduleId":"FILEDLD"
    }
    this.isSadadMoi = this.selectedTransfer.uploadType === 'SADMOIUP';
    this.setWorkFlowAndHistoryParams();
    // this.workFlowHistoryParams={
    //   refNum:this.rootScopeData.myTaskSADADSummaryObject.ref_NO,
    //   productCode:this.rootScopeData.myTaskSADADSummaryObject.product_CODE,
    //   subProductCode:this.rootScopeData.myTaskSADADSummaryObject.subprcode,
    //   functionCode:this.rootScopeData.myTaskSADADSummaryObject.function_ID,
    // }
    this.getRecordSummaryData({
      sortColumn: 'transactionId',
      sortOrder: 'desc',
      fromRow: 1,
      toRow: totalRecordsPerRequest,
    });
  }

  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeSadadBulkPayment']);
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectSadadBulkPayment']);
  }
  onBackArrowClick(){
    this.location.back();
  }
    /**
   * @description set the request payload for workflow and history api call
   */
     setWorkFlowAndHistoryParams(): void {
      //console.log(this.selectedTransfer,"TEST");
      this.workFlowAndHistoryParams = {
        moduleId: this.isSadadMoi ? 'SADMOIWRKFLW' : 'SADWRKFLW',
        refNum: this.selectedTransfer.odDRefNo,
        productCode: this.selectedTransfer.odProductCode,
        subProductCode: this.selectedTransfer.odSubprodCode,
        functionCode: this.selectedTransfer.odFunctionCode,
      };
      this.historyParams = {
        moduleId: this.isSadadMoi ? 'SADMOIHISTORY' : 'SADHISTORY',
        refNum: this.selectedTransfer.odDRefNo,
        productCode: this.selectedTransfer.odProductCode,
        subProductCode: this.selectedTransfer.odSubprodCode,
        functionCode: this.selectedTransfer.odFunctionCode,
      };
    }

    // record summary
    getRecordSummaryData(data: any): void {
      //console.log("TEST",this.rootScopeData.myTaskSADADSummaryObject)
      const params = {
        moduleId: this.isSadadMoi ? 'SADMOIRECSUMY' : 'SADRECSUMY',
        productName: "PAYMNT",
        subPdt: this.isSadadMoi ? "SADMOIUP":"SADPAYUP",
        functionCode: "BULKUP",
        odDRefNo: this.selectedTransfer.odDRefNo || '',
        sortColumn: data?.sortColumn,
        sortOrder: data?.sortOrder,
        fromRow: data?.fromRow,
        toRow: data?.toRow
      };
      this.isLoadingComplete = false;
  
      this.sadadService.getRecordSummary(params).subscribe(
        (records: any) => {
          this.isLoadingComplete = true;
          if (records.data) {
            this.sortOptions = records.headerValue;
            this.recordSummaryObject = {
              data: records.data,
              displayDetails: [
                {
                  displayLabel: 'LBL_Transaction_Id',
                  displayKey: 'transactionId',
                },
                {
                  displayLabel: 'LBL_BILLER',
                  displayKey: 'biller',
                },
                {
                  displayLabel: 'LBL_SERVICE_TYPE',
                  displayKey: 'service',
                },
                {
                  displayLabel: 'LBL_ACCOUNT',
                  displayKey: 'debitAcc',
                },
                {
                  displayLabel: 'LBL_AMOUNT',
                  displayKey: 'payAmt',
                  type: 'amount',
                  supportValue: 'ccy',
                },
                {
                  displayLabel: 'LBL_STATUS',
                  displayKey: 'status',
                },
                {                
                  displayLabel: 'LBL_RJCT_RSN',
                  displayKey: 'rejectReason',
                }
              ]              
            };
            this.showRecordSummary = true;
            
          }
        },
        () => {
          this.isLoadingComplete = true;
          this.showRecordSummary = false;
        }
      );
    }
  
    onSortColumn(details: any): void {
      this.getRecordSummaryData(details);
    }
    // record summary    
    back(){
      this.router.navigate(['/mytask/sadad/sadadfilepayment'])
    }
}
