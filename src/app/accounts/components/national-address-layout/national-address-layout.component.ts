import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { getPdf } from 'src/app/utility/common-utility';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-national-address-layout',
  templateUrl: './national-address-layout.component.html',
  styleUrls: ['./national-address-layout.component.scss']
})
export class NationalAddressLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  printSection:string="";
  constructor(private translateService: TranslateService,  private readonly router: Router) { }

  ngOnInit(): void {
    this.printSection="nationalAddressDetailsPrintSection";
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.pendingActivitiesServiceRequestObject.requestRefNo,
      productCode:this.rootScopeData.pendingActivitiesServiceRequestObject.productCode,
      subProductCode:this.rootScopeData.pendingActivitiesServiceRequestObject.subProductCode,
      functionCode:this.rootScopeData.pendingActivitiesServiceRequestObject.functionCode,
    }
  }
  toPdf(id:any) {
    getPdf(id,this.translateService,'nationalAddress.pdf')
  }
  routeToOtherRequest(): void {
    this.router.navigate(['/accounts/service-request/otherrequest']);
  }
}
