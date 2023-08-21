import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { getPdf, logoprint } from 'src/app/utility/common-utility';
@Component({
  selector: 'app-complaints-summary-layout',
  templateUrl: './complaints-summary-layout.component.html',
  styleUrls: ['./complaints-summary-layout.component.scss']
})
export class ComplaintsSummaryLayoutComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowHistoryParams = {};
  printSection: string = '';
  logo :string ="";
  constructor(private location: Location,private translateService:TranslateService) { 
    this.logo = logoprint();
    this.setWorkFlowAndHistoryParams()
  }

  ngOnInit(): void {
    this.printSection="complaintsSummaryPrinSection";
    if (!this.rootScopeData.ticketInquiry) {
      this.location.back();
    }
  }
  setWorkFlowAndHistoryParams(): void {
    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.ticketInquiry.summary.referenceNo,
      productCode:
        this.rootScopeData.ticketInquiry.summary.product_CODE,
      subProductCode:
        this.rootScopeData.ticketInquiry.summary.subProductCode,
      functionCode:
        this.rootScopeData.ticketInquiry.summary.function_ID,
      
    };
  }
  back(): void {
    this.location.back();
  }
  printPdf(id:any) {
    getPdf(id,this.translateService,'singleTransferDetails.pdf')
  }
}
