import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-single-transfer-details',
  templateUrl: './single-transfer-details.component.html',
  styleUrls: ['./single-transfer-details.component.scss'],
})
export class SingleTransferDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferDetails: any;
  transferSummary: any;
  debitDetails: any;
  proxyName: any;
  showProxy: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.transferSummary = this.rootScopeData.transactionInquiry.summary;
    this.transferDetails = this.rootScopeData.transactionInquiry.details;
    this.debitDetails = this.rootScopeData.transactionInquiry.paymentDetails;

    if(this.transferDetails.paymentType === "MOBILE"){
      this.showProxy = true;
      this.transferSummary.benefAccNo =('' + this.transferSummary.benefAccNo).slice(0,5)+('' + this.transferSummary.benefAccNo).slice(2, this.transferSummary.benefAccNo.length-2)
      .replace(/./g, "*")
      + ('' + this.transferSummary.benefAccNo).slice(-3);
      this.proxyName = this.transferDetails.PhoneNo;
      this.proxyName =('' + this.proxyName).slice(0,4)+('' + this.proxyName).slice(2, this.proxyName.length-2)
      .replace(/./g, "*")
      + ('' + this.proxyName).slice(-2);
    }else if(this.transferDetails.paymentType === "EMAIL"){
      this.showProxy = true;
      this.transferSummary.benefAccNo =('' + this.transferSummary.benefAccNo).slice(0,5)+('' + this.transferSummary.benefAccNo).slice(2, this.transferSummary.benefAccNo.length-2)
      .replace(/./g, "*")
      + ('' + this.transferSummary.benefAccNo).slice(-3);
      this.proxyName = this.transferDetails.emaildId;
      this.proxyName =('' + this.proxyName).slice(0,4)+('' + this.proxyName).slice(2, this.proxyName.length-2)
      .replace(/./g, "*")
      + ('' + this.proxyName).slice(-2);
    }else if(this.transferDetails.paymentType === "NATIONAL_ID"){
      this.showProxy = true;
      this.transferSummary.benefAccNo =('' + this.transferSummary.benefAccNo).slice(0,5)+('' + this.transferSummary.benefAccNo).slice(2, this.transferSummary.benefAccNo.length-2)
      .replace(/./g, "*")
      + ('' + this.transferSummary.benefAccNo).slice(-3);
      this.proxyName = this.transferDetails.NationalId;
      this.proxyName =('' + this.proxyName).slice(0,4)+('' + this.proxyName).slice(2, this.proxyName.length-2)
      .replace(/./g, "*")
      + ('' + this.proxyName).slice(-2);
    } else{
      this.showProxy = false;
    }
  }
}
