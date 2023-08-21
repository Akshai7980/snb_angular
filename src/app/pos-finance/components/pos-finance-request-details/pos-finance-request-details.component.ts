import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PosFinanceService } from '../../services/pos-finance.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pos-finance-request-details',
  templateUrl: './pos-finance-request-details.component.html',
  styleUrls: ['./pos-finance-request-details.component.scss'],
})
export class PosFinanceRequestDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  fromDataDetailsObj: any = {};
  setColumnWidth: boolean = true;
  clearFlag: boolean = false;
  checked: boolean = false;
  value: any = 0;
  fetchDetails: boolean = false;
  isChecked: string = '24 Months';
  progressBar: boolean = false;
  financeAmount: any;
  rmreferels: any;
  maximumAmountError: boolean = false;
  limitRmReferalNumber: boolean = false;
  tenorDetails: any;
  interval: any;
  posFinanceRequestDetails: any;
  requestDetails: any = [];
  requestIdDetailList: any;
  showErrorMsg: boolean = false;
  notification: boolean = false;
  backButton: boolean = false;
  constructor(
    private router: Router,
    private _location: Location,
    private posService: PosFinanceService
  ) {}

  ngOnInit() {
    this.posFinanceRequestDetails = this.rootScopeData.posFinanceRequestDetails;
    if (JSON.stringify(this.posFinanceRequestDetails) === '{}') {
      this._location.back();
    }

    this.constructFromTable();
  }

  constructFromTable() {
    this.fromDataDetailsObj = {
      title: 'Account',
      data: [this.posFinanceRequestDetails],
      fieldDetails: [
        {
          dispKey: 'LBL_ACC_NUMBER',
          dataKey: 'OD_ACC_NO',
        },
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'ALIAS_NAME',
        },
        {
          dispKey: 'LBL_FULL_NAME',
          dataKey: 'LIAS_NAME',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'STATUS',
        },
        {
          dispKey: 'LBL_BALANCE',
          dataKey: 'CURR_AVAIL_BAL_AMOUNT_NEW',
          dataKeySupport: 'OD_CCY_CODE',
        },
      ],
    };
  }

  getDisplayStatus(event: any, type: string) {
    if (type === 'fromData') {
      if (event === 'iconClick') {
        this._location.back();
      }
    }
  }

  requestIdDetails() {
    const params = {
      cif: this.posFinanceRequestDetails.COD_CORECIF,
    };

    this.posService.getRequestId(params).subscribe((res) => {
      this.requestDetails = res;

      this.requestIdDetailList = this.requestDetails.data;
    });
  }

  counterStart() {
    this.requestIdDetails();
    this.fetchDetails = true;
    this.interval = setInterval(() => {
      this.value += 10;
      setTimeout(() => {
        if (
          this.requestDetails && this.requestIdDetailList && 
          Object.keys(this.requestIdDetailList).length
        ) {
          if (this.requestIdDetailList.status === 'Approved') {
            this.notification = false;
            if (this.value === 40) {
              if (
                this.requestIdDetailList.requestID === '' ||
                this.requestIdDetailList.requestID === undefined ||
                this.requestIdDetailList.requestID === null
              ) {
                this.showErrorMsg = true;
                this.backButton = true;

                this.stopProgress();
              }
            } else if (this.value === 80) {
              if (
                this.requestIdDetailList.maxAmt === '' ||
                this.requestIdDetailList.maxAmt === undefined ||
                this.requestIdDetailList.maxAmt === null
              ) {
                this.showErrorMsg = true;
                this.backButton = true;

                this.stopProgress();
              }
            } else if (
              this.value === 100 &&
              this.requestIdDetailList.maxAmt != '' &&
              this.requestIdDetailList.requestID != ''
            ) {
              this.progressBar = true;
              clearInterval(this.interval);
            }
          } else {
            this.showErrorMsg = false;

            this.notification = true;
            this.backButton = true;

            this.stopProgress();
          }
        } else {
          this.showErrorMsg = true;
          this.backButton = true;
          this.stopProgress();
        }
      }, 3000);
    }, 2000);
  }

  displayContent(type: string) {
    if (type) {
      this.isChecked = type;
    }
  }
  cancel() {
    this._location.back();
  }
  stopProgress() {
    clearInterval(this.interval);
    this.fetchDetails = false;
    this.checked = false;
    this.value = 0;
    this.progressBar = false;
  }
  proceedToReview() {
    let withoutDecimalAmount = Math.trunc(
      this.posFinanceRequestDetails.maxAmount
    );
    if (withoutDecimalAmount < this.financeAmount) {
      this.maximumAmountError = true;
    } else {
      this.maximumAmountError = false;
      this.router.navigate(['/posFinance/posRequestReview']);
      const tenorDetailsList = {
        financeAmount: this.financeAmount,
        rmReferals: this.rmreferels,
        tenorMonths: this.isChecked,
        requestId: this.requestIdDetailList.requestID,
        maximumAmount: this.requestIdDetailList.maxAmt,
        currency: this.requestIdDetailList.currency,
        crNumber: this.requestIdDetailList.crNumber,
      };
      this.rootScopeData.posFinanceRequestDetailsList = tenorDetailsList;
    }
  }
  allowNumbersOnly(e: any) {
    var theEvent = e || window.event;
    var code = e.which ? e.which : e.keyCode;
    code = String.fromCharCode(code);
    if (code.length == 0) return;
    var regex = /^[0-9.,\b]+$/;
    if (!regex.test(code)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
  }
   
  }
  checkMaximumAmount() {
    let withoutDecimalAmount = this.requestIdDetailList.maxAmt.replace(
      /,/g,
      ''
    );
    withoutDecimalAmount = parseFloat(withoutDecimalAmount);

    if (withoutDecimalAmount < this.financeAmount) {
      this.maximumAmountError = true;
    } else {
      this.maximumAmountError = false;
    }
  }
}
