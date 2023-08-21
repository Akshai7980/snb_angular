import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-sp-accounts',
  templateUrl: './sp-accounts.component.html',
  styleUrls: ['./sp-accounts.component.scss'],
})
export class SpAccountsComponent implements OnInit {
  isLoadingComplete: boolean = true;

  rootScopeData: RootScopeDeclare = RootScopeData;
  clearFlag: boolean = true;
  fromAccountsObject: any;
  noAccountsFound: boolean = false;

  fromAccount: any;
  minStartDate = new Date();
  minEndDate = new Date();
  maxStartDate: Date | undefined;
  maxEndDate: Date | undefined;
  startDate: any;
  endDate: any;
  uploadType: any;
  uploadTypes: string[] = ['WPS', 'Others (DCI)'];

  showTransactions: boolean = false;
  transactions: any[] = [];
  noTransactionsFound: boolean = false;
  startDateError: boolean = false;
  endDateError: boolean = false;
  isVendorPayment: boolean = false;

  constructor(
    private readonly payrollService: PayrollService,
    private readonly datePipe: DatePipe,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getAccounts();
  }
  getAccounts(): void {
    this.isLoadingComplete = false;
    this.payrollService.getStopPaymentAccounts().subscribe(
      (accounts: any) => {
        this.isLoadingComplete = true;
        const currencyFormatPipeFilter = new CurrencyFormatPipe();
        if (
          accounts.DATA &&
          accounts.DATA.ALL_RECORDS &&
          accounts.DATA.ALL_RECORDS.length
        ) {
          this.fromAccountsObject = {
            title: 'LBL_FROM',
            data: accounts.DATA.ALL_RECORDS.map((record: any) => {
              return {
                ...record,
                CURR_AVAIL_BAL_AMT: currencyFormatPipeFilter.transform(
                  record.CURR_AVAIL_BAL_AMT,
                  record.OD_CCY_CODE
                ),
              };
            }),
            fieldDetails: [
              {
                dispKey: 'LBL_NICKNAME',
                dataKey: 'ALIAS_NAME',
              },
              {
                dispKey: 'LBL_ACC_NUMBER',
                dataKey: 'OD_ACC_NO',
              },
              {
                dispKey: 'LBL_FULL_NAME',
                dataKey: 'OD_ACC_NAME',
              },
              {
                dispKey: 'LBL_STATUS',
                dataKey: 'STATUS',
              },
              {
                dispKey: 'LBL_BALANCE',
                dataKey: 'CURR_AVAIL_BAL_AMT',
                dataKeySupport: 'OD_CCY_CODE',
              },
            ],
          };
        } else {
          this.noAccountsFound = true;
        }
      },
      () => {
        this.noAccountsFound = true;
        this.isLoadingComplete = true;
      }
    );
  }
  onFromAccountSelection(accountDetails: any): void {
    if (accountDetails === 'iconClick') {
      this.fromAccount = undefined;
      this.showTransactions = false;
      this.startDate = undefined;
      this.endDate = null;
      this.startDateError = false;
      this.endDateError = false;
      this.uploadType = null;
    } else {
      this.isVendorPayment = this.router.url === '/payroll/vendor-stop-payment';
      if (this.isVendorPayment) {
        this.uploadType = 'Vendor Payment';
      }
      this.rootScopeData.accountsSummaryObject = this.fromAccount =
        accountDetails;
    }
  }

  onUploadTypeSelection(selectedType: any): void {
    this.uploadType = selectedType;
  }

  toValue(toDate: any): void {
    this.endDate = toDate;
    if (!this.startDate) {
      this.maxStartDate = toDate;
    }
  }

  fromValue(startDate: any): void {
    this.startDate = startDate;
    if (startDate) {
      this.minEndDate = startDate;
    }
  }

  searchStopPaymentTransactions(): void {
    if (this.startDate && this.endDate) {
      this.isLoadingComplete = false;
      this.payrollService
        .getStopPaymentInquiryList({
          fileType: this.uploadType
            ? this.uploadType === 'WPS'
              ? 'WPS'
              : 'DCI'
            : '',
          fromDate: this.datePipe.transform(this.startDate, 'dd/MM/yyyy'),
          toDate: this.datePipe.transform(this.endDate, 'dd/MM/yyyy'),
          fromAccountId: this.fromAccount.OD_ACC_NO,
          unitId: this.fromAccount.UNIT_ID,
        })
        .subscribe(
          (response: any) => {
            this.isLoadingComplete = true;
            if (
              response.data &&
              response.data &&
              response.data.record &&
              response.data.record.length
            ) {
              this.transactions = response.data.record;
            }
            this.showTransactions = true;
          },
          () => {
            this.isLoadingComplete = true;
          }
        );
    } else {
      this.startDateError = this.startDate ? false : true;
      this.endDateError = this.endDate ? false : true;
    }
  }

  clearSearch(): void {
    this.showTransactions = false;
    this.clearFlag = true;
    this.transactions = [];
    this.startDate = undefined;
    this.endDate = undefined;
    if (!this.isVendorPayment) {
      this.uploadType = null;
    }
    this.startDateError = false;
    this.endDateError = false;
    this.maxEndDate = undefined;
    this.maxStartDate = undefined;
  }
}
