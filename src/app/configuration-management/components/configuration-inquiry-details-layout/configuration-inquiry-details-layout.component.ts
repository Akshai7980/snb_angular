import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-configuration-inquiry-details-layout',
  templateUrl: './configuration-inquiry-details-layout.component.html',
  styleUrls: ['./configuration-inquiry-details-layout.component.scss']
})
export class ConfigurationInquiryDetailsLayoutComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  workFlowHistoryParams = {};
  printSection: string = '';
  pdfData:any;
  // logo ="assets/images/snb-logo-print.png";
  logo :string ="";
  constructor(private router: Router) { 
    this.logo = logoprint();
    this.setWorkFlowAndHistoryParams()
  }

  ngOnInit(): void {
  }

  setWorkFlowAndHistoryParams(): void {
    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.selectedProxy.REF_NO,
      productCode:
        this.rootScopeData.selectedProxy.OD_PRODUCT_CODE,
      subProductCode:
        this.rootScopeData.selectedProxy.OD_SUBPROD_CODE,
      functionCode:
        this.rootScopeData.selectedProxy.OD_FUNCTION_ID,
      
    };
  }

  back(): void {
    // this.rootScopeData.backToPagination.resFlag = 'Y';
    // this.rootScopeData.backToPagination.resFlagForService = 'Y';
    this.router.navigate(['/configurationManagement/configurationInquiry'])
    // this.location.back();
  }

}
