import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-stop-payment-details',
  templateUrl: './stop-payment-details.component.html',
  styleUrls: ['./stop-payment-details.component.scss'],
})
export class StopPaymentDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  url: string = '';
  reviewDisplayColumns: string[] = [
    'recordNumber',
    'bank',
    'accountNumber',
    'fullName',
    'amount',
    'uti',
    'childRef',
    'refId',
    'status',
  ];
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: 'Apply Now',
    btnLink: '/dashboard',
    showBtn: 'true',
    showMsg: 'true',
    showIcon: 'true',
  };

  recordsForStopPayment: any = [];
  printSection: string = 'recordSummaryPrintSection';
  logo = 'assets/images/snb-logo-print.png';
  moduleId = 'STPPMNTRECSUM';
  workFlowHistoryParams: any;
  noRecordFlag: boolean = false;
  selectedPayment: any;
  selectedStopPaymentType: string | undefined = '';
  constructor(
    private readonly router: Router,
    private readonly myTaskService: MyTaskService
  ) {}

  ngOnInit(): void {
    if (this.rootScopeData.selectedInquiryForStopPayment) {
      this.selectedPayment = this.rootScopeData.selectedInquiryForStopPayment;
      this.selectedStopPaymentType = this.rootScopeData.selectedStopPaymentType;
      this.url = systemproperty.termsAndConditionsForStopPayment;
      if (this.selectedStopPaymentType === 'record') {
        this.getSelectedRecords();
      }
      this.workFlowHistoryParams = {
        refNum: this.rootScopeData.selectedInquiryForStopPayment.referenceNo,
        productCode: 'PAYMNT',
        subProductCode: 'STPPMNT',
        functionCode: 'STPFNC',
      };
    } else {
      this.router.navigate(['/mytask/Payroll/stop-payment']);
    }
  }

  getSelectedRecords(): void {
    this.myTaskService
      .getRecordsToStop({
        referenceNumber:
          this.rootScopeData.selectedInquiryForStopPayment.referenceNum,
      })
      .subscribe(
        (records: any) => {
          if (records.dataValue && records.dataValue.length) {
            this.recordsForStopPayment = records.dataValue;
          } else {
            this.noRecordFlag = true;
          }
        },
        () => {
          this.noRecordFlag = true;
        }
      );
  }

  rejectStopPayment(): void {
    this.router.navigate(['/mytask/reject-stop-payment']);
  }

  authorizeStopPayment(): void {
    this.router.navigate(['/mytask/authorize-stop-payment']);
  }
}
