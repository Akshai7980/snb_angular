import { Component,OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';



@Component({
  selector: 'app-proxy-identifier-registration',
  templateUrl: './proxy-identifier-registration.component.html',
  styleUrls: ['./proxy-identifier-registration.component.scss']
})
export class ProxyIdentifierRegistrationComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  isMobileToggleChecked:any;
  isEmailToggleChecked:any;
  isNationalIdToggleChecked:any;
  mobileNumber: any;
  emailId: any;
  nationalId: any;
  constructor() {
   }

  ngOnInit(): void {
    if(this.rootScopeData.pendingActivitiesInstantTransferSummaryObject){
       this.isMobileToggleChecked = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_1_KEY === "Y" ? "true":"false"
       this.isEmailToggleChecked = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_2_KEY === "Y" ? "true":"false"
       this.isNationalIdToggleChecked = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_3_KEY === "Y" ? "true":"false"
       this.mobileNumber = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_1_VALUE ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_1_VALUE:"--";
       this.emailId = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_2_VALUE ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_2_VALUE:"--";
       this.nationalId = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_3_VALUE ? this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.PROXY_3_VALUE:"--";
    }
  }

}
