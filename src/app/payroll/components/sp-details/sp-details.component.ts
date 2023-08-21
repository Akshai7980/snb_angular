import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-sp-details',
  templateUrl: './sp-details.component.html',
  styleUrls: ['./sp-details.component.scss'],
})
export class SpDetailsComponent implements OnInit {
  // flags
  isLoadingComplete: boolean = true;
  isShowDetails: boolean = false;

  selectedStopPaymentType: string = 'file';
  rootScopeData: RootScopeDeclare = RootScopeData;
  fileData: any = {};

  @Output() showScreenEmit = new EventEmitter();
  isVendorPayment: boolean = false;

  constructor(
    private readonly router: Router,
    private payrollService: PayrollService
  ) {}

  ngOnInit(): void {
    this.isVendorPayment =
      this.router.url === '/payroll/vendor-stop-payment-details';
    if (this.rootScopeData.selectedInquiryForStopPayment) {
      this.getFileDetails();
    } else {
      this.returnToSummary();
    }
    if (this.rootScopeData.selectedStopPaymentType) {
      this.selectedStopPaymentType = this.rootScopeData.selectedStopPaymentType;
      this.rootScopeData.selectedStopPaymentType = '';
    }
  }

  getFileDetails() {
    this.isLoadingComplete = false;
    this.payrollService
      .getStopPaymentTransferDetails({
        refNo:
          this.rootScopeData.selectedInquiryForStopPayment.transactionRefNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID,
      })
      .subscribe(
        (res) => {
          this.isLoadingComplete = true;
          this.fileData = res.data;
          this.rootScopeData.stopPaymentTransferDetails = this.fileData;
          this.isShowDetails = true;
        },
        (err) => {
          this.isShowDetails = true;
          this.isLoadingComplete = true;
        }
      );
  }

  changeStopPaymentType(selectedStopType: string): void {
    this.selectedStopPaymentType = selectedStopType;
  }

  returnToSummary(): void {
    this.isVendorPayment
      ? this.router.navigate(['/payroll/vendor-stop-payment'])
      : this.router.navigate(['/payroll/stop-payment']);
  }

  proceedForAuthentication(): void {
    this.rootScopeData.selectedProxy = this.selectedStopPaymentType;
    this.isVendorPayment
      ? this.router.navigate(['/payroll/vendor-stop-payment-review'])
      : this.router.navigate(['/payroll/stop-payment-review']);
  }
}
