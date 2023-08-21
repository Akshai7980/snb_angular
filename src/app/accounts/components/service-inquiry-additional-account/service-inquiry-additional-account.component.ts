import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-inquiry-additional-account',
  templateUrl: './service-inquiry-additional-account.component.html',
  styleUrls: ['./service-inquiry-additional-account.component.scss'],
})
export class ServiceInquiryAdditionalAccountComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  logo: string = '';
  workFlowHistoryParams: any;

  constructor(private router:Router) {
    this.logo = logoprint();
  }

  ngOnInit(): void {
    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.pendingActivitiesAdditionalRequestObject.refNo,
      productCode:
        this.rootScopeData.pendingActivitiesAdditionalRequestObject.productCode,
      subProductCode:
        this.rootScopeData.pendingActivitiesAdditionalRequestObject
          .subProductCode,
      functionCode:
        this.rootScopeData.pendingActivitiesAdditionalRequestObject
          .functionCode,
    };
  }
  onBackArrowClick(){
    this.router.navigate(['/accounts/service-request/additionalrequest'])
  }
}
