import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-refund-request',
  templateUrl: './refund-request.component.html',
  styleUrls: ['./refund-request.component.scss'],
})
export class RefundRequestComponent implements OnInit {
  financialTypeDropdown: any;
  amountType: any;
  showAmountConatiner: boolean = false;
  uploadInput: any;
  clearFields: any;
  downloadTemplateData: any = {};
  selectedType: any;
  selectFormat: any;
  selectedDebitObj: boolean = false;
  csvClicked: boolean = false;
  txtClicked: boolean = true;
  fileSizeValidationErrorMessage: boolean = false;
  fileTypeValidationErrorMessage: boolean = false;
  fileNameValidationErrorMessage: boolean = false;
  fileSize = 10;
  mobileNumber: any;
  financialType: any;
  amount: any;
  description: any;
  amountValue: any;
  email: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private router: Router,
    private location: Location,
    public posService: PosService
  ) {}
  ngOnInit() {
    if (
      this.rootScopeData.posTransactionMerchantDetail === '' ||
      this.rootScopeData.posTransactionMerchantDetail.length === 0
    ) {
      this.rootScopeData.showtransaction = true;
      this.rootScopeData.showMerchantDetail = false;
      this.router.navigate(['/pos/posTransactions']);
    }

    this.getEmail();
    this.getFinancialTypeDropdown();
    this.getAmountTypeDropdown();
  }
  showAmountValue(event: any) {
    console.log(event);

    if (event.amountType == 'Partial' || event.amountType == 'partial') {
      this.showAmountConatiner = true;
    } else if (event.amountType == 'Full' || event.amountType == 'full') {
      this.showAmountConatiner = false;
    }
  }
  onClickDownload() {
    this.downloadTemplateData = {
      flag: 'SALPAY',
      moduleId: 'TMPDOWNLD',
      subPdt: this.selectedType.subPdtCode,
      exportType: this.selectFormat.type,
      templateId: this.selectFormat.templateId,
    };
  }
  proceedButton(event: any) {
    if (event) {
      const data = {
        email: this.email,
        mobile: this.mobileNumber,
        financialType: this.financialType,
        amountType: this.amount,
        amountValue: this.amountValue,
        description: this.description,
      };
      this.rootScopeData.posTransactionRefundRequestDetail = data;
      this.router.navigate(['/pos/refundRequestReview']);
    }
  }
  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }

  cancelButton() {
    this.mobileNumber = '';
    this.financialType = '';
    this.amount = '';
    this.description = '';
    this.amountValue = '';
    this.showAmountConatiner = false;
  }

  returntoTransaction() {
    this.mobileNumber = '';
    this.financialType = '';
    this.amount = '';
    this.description = '';
    this.amountValue = '';
    this.showAmountConatiner = false;
    this.location.back();
  }

  cancelMerchantDetail() {
    this.rootScopeData.showtransaction = true;
    this.rootScopeData.showMerchantDetail = false;
    this.location.back();
  }

  getEmail() {
    this.posService.getEmail().subscribe(
      (res: any) => {
        if (res.data) {
          this.email = res.data.emailAdd;
        }
      },
      (error) => {}
    );
  }

  getFinancialTypeDropdown() {
    this.posService.getFinancialTypeDropdown().subscribe(
      (res: any) => {
        if (res.data) {
          this.financialTypeDropdown = res.data[0].financialClaimType;
          console.log(
            this.financialTypeDropdown,
            ' this.financialTypeDropdown'
          );
        }
      },
      (error) => {}
    );
  }

  getAmountTypeDropdown() {
    this.posService.getAmountTypeDropdown().subscribe(
      (res: any) => {
        if (res.data) {
          this.amountType = res.data[0].amountType;
          console.log(
            this.financialTypeDropdown,
            ' this.financialTypeDropdown'
          );
        }
      },
      (error) => {}
    );
  }
}
