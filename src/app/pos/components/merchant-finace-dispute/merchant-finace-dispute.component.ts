import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { PosService } from '../../services/pos.service';
@Component({
  selector: 'app-merchant-finace-dispute',
  templateUrl: './merchant-finace-dispute.component.html',
  styleUrls: ['./merchant-finace-dispute.component.scss'],
})
export class MerchantFinaceDisputeComponent implements OnInit {
  mobileNumber: any;
  financialType: any;
  description: any;
  email: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  comments: any;
  financialTypeDropdown: any;
  constructor(
    private router: Router,
    private location: Location,
    public posService: PosService
  ) {}

  ngOnInit(): void {
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
  }
  proceedButton(event: any) {
    if (event) {
      const data = {
        email: this.email,
        number: this.mobileNumber,
        financialType: this.financialType,
        description: this.description,
        comments: this.comments
      };

      console.log(data,"data")
      this.rootScopeData.posTransactionMerchantFinaceDetail = data;
      this.router.navigate(['/pos/merchantFinanceDisputeReview']);
    }
  }
  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }

  cancelButton(event: any) {
    if (event) {
      this.mobileNumber = '';
      this.financialType = '';
      this.description = '';
      this.comments = '';
    }
  }

  returntoTransaction(event: any) {
    if (event) {
      this.mobileNumber = '';
      this.financialType = '';
      this.description = '';
      this.comments = '';
      this.location.back();
    }
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
}
