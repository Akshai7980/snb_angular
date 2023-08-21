import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EpayServiceService } from 'src/app/e-pay/services/epay-service.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-e-pay-summary',
  templateUrl: './e-pay-summary.component.html',
  styleUrls: ['./e-pay-summary.component.scss'],
})
export class EPaySummaryComponent implements OnInit {
  
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingComplete: boolean = true;
  requestSummaryDetails: any = {};
  workFlowHistoryParams: any;
  showRecSumm: boolean = false;
  recordSummaryObject: any;
  
  sortOptions: any = {
    sortColumn: 'transactionDate',
    sortOrder: 'asc',
    fromRow: 0,
    toRow: 5,
    totalCount: ''
  };

  recordSummaryModuleId: string = 'EPYMULCLMRCRDSUMMY';

  constructor(
    private router: Router,
    private ePayService: EpayServiceService
  ) {}

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(): void {
    this.isLoadingComplete = false;
    if (this.rootScopeData.selectedEPay) {
      this.isLoadingComplete = true;
      this.requestSummaryDetails = this.rootScopeData.selectedEPay;
      if (this.requestSummaryDetails.summary.subproductCode === 'EPYMCD') this.getRecordSummary()
      this.workFlowHistoryParams = {
        refNum: this.requestSummaryDetails.summary.refNo,
        productCode: this.requestSummaryDetails.summary.productCode,
        subProductCode: this.requestSummaryDetails.summary.subproductCode,
        functionCode: this.requestSummaryDetails.summary.functionCode
      };
    } else {
      this.router.navigate(['/mytask/ePay']);
    }
  }

  getRecordSummary(data?: any) {
    const params = {
      sortOrder: this.sortOptions.sortOrder,
      sortColumn: this.sortOptions.sortColumn,
      fromRowNo: this.sortOptions.fromRowNo,
      toRowNo: this.sortOptions.toRowNo,
      refNo: this.requestSummaryDetails.details.refNo ? this.requestSummaryDetails.details.refNo : ''
    };
    this.isLoadingComplete = false;
    this.ePayService.getMultiClaimRecordSummary(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.data) {
          const recordSummaryList = res.data.map((val: any) => {
            return {
              currency: 'SAR',
              ...val
            };
          });
          this.sortOptions.totalCount = res.headerValue.totalCount;
          this.rootScopeData.totalRecrdsCount = res.headerValue.totalCount;
          this.showRecSumm = true;
          this.recordSummaryObject = {
            data: recordSummaryList,
            displayDetails: [
              {
                displayLabel: 'LBL_TRANSACTION_DATE',
                displayKey: 'transactionDate',
              },
              {
                displayLabel: 'LBL_TRANS_SEQ_NUM',
                displayKey: 'transSeqNo',
              },
              {
                displayLabel: 'LBL_TRANSACTION_TYPE',
                displayKey: 'transType',
              },
              {
                displayLabel: 'LBL_APPROVAL_CODE',
                displayKey: 'aproveCode',
              },
              {
                displayLabel: 'LBL_AMOUNT',
                displayKey: 'amount',
                type: 'amount',
                supportValue: 'currency',
              },
            ],
          };
        }
      },
      (error: any) => {
        this.showRecSumm = true;
        this.isLoadingComplete = true;
      }
    );
  }

  onSortColumn(event: any) {
    this.sortOptions.sortColumn = event.sortColumn;
    this.sortOptions.sortOrder = event.sortOrder;
    this.sortOptions.fromRow = event.fromRow;
    this.sortOptions.toRow = event.toRow;
    this.getRecordSummary();
  }

  onClickAuthorize(): void {
    this.router.navigate(['/mytask/ePayAuthorize']);
  }

  onClickReject(): void {
    this.router.navigate(['/mytask/ePayReject']);
  }
}
