import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-payroll-onboarding-details',
  templateUrl: './payroll-onboarding-details.component.html',
  styleUrls: ['./payroll-onboarding-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayrollOnboardingDetailsComponent implements OnInit, OnDestroy {

  isLoadingCompelete: boolean = true;
  subscriptions: Subscription[] = [];
  accountLists: Array<any> = []
  onboardingFeeDetails: any = {};
  selectAccountError: boolean = false;
  @Output() onProceedEmit = new EventEmitter<string>();
  accNoReadonly: boolean = false;
  accountDetails: any = {};
  @Input() makeSelectable : any;

  constructor(private payrollService: PayrollService) { }

  ngOnInit(): void {
    this.getFeeAccountLookup();
  }

  ngOnChanges(){
    if(this.makeSelectable){
      this.accNoReadonly = true;
      this.clearData();
    }
  }

  clearData() {
    this.onboardingFeeDetails = {};
    this.accNoReadonly = false;
  }

  getFeeAccountLookup() {
    this.isLoadingCompelete = false;
    const accountDetails = this.payrollService.getAccountDetails().subscribe(res => {
      this.isLoadingCompelete = true;
      if (res.DATA) {
        this.accountLists = res.DATA?.ALL_RECORDS
      }
    }, err => {
      this.isLoadingCompelete = true;
    })
    this.subscriptions.push(accountDetails);
  }

  onSelectedAccountNumber(account: any) {
    this.accountDetails = account;
    this.selectAccountError = false;
    this.getOnboardingFeeDetails();
  }

  getOnboardingFeeDetails() {
    this.isLoadingCompelete = false;
    const onboardingDetails = this.payrollService.getOnboardingFeeDetails(this.accountDetails).subscribe(res => {
      this.isLoadingCompelete = true;
      if (res.data) {
        this.onboardingFeeDetails = res.data;
        for (const key in this.onboardingFeeDetails) {
          if (key === 'setupFee' || key === 'monthlyFee' || key === 'prepaidCards' || key === 'perSNBrecord' || key === 'perSarieRecord') {
            const value = this.onboardingFeeDetails[key];
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            const convertedAmount = currencyFormatPipeFilter.transform(
              value,
              this.onboardingFeeDetails.ccy
            );
            this.onboardingFeeDetails[key] = convertedAmount;
          }
        }
      }
    }, err => {
      this.isLoadingCompelete = true;
    })
    this.subscriptions.push(onboardingDetails);
  }

  proceedNext(): void {
    if (!this.accountDetails.OD_ACC_NO && !this.accountDetails.UNIT_ID) {
      this.selectAccountError = true;
      return;
    }
    this.accNoReadonly = true;
    let data = this.onboardingFeeDetails;
    data.accDetails = this.accountDetails;
    this.onProceedEmit.emit(data);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
