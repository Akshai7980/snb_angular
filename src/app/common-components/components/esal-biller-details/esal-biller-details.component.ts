import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-esal-biller-details',
  templateUrl: './esal-biller-details.component.html',
  styleUrls: ['./esal-biller-details.component.scss']
})
export class EsalBillerDetailsComponent implements OnInit {

  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  logo :string="";
  printSection:string="";
  payerId: any;
  payerNickName: any;
  payerName: any;
  refNum: any;
  constructor(private commonService:CommonService) { this.logo = logoprint();}

  ngOnInit(): void {
    this.printSection="esalBillerDetailsPrintSection";
    if(this.rootScopeData.esalBillerSummaryObject){
      this.payerId=this.rootScopeData.esalBillerSummaryObject.payerId;
      this.payerName=this.rootScopeData.esalBillerSummaryObject.payerFullName;
      this.payerNickName=this.rootScopeData.esalBillerSummaryObject.payerShortName;
      this.refNum = this.rootScopeData.esalBillerSummaryObject.referenceNumber;
    }
    if(this.rootScopeData.pendingActivitiesEsalBillerSummaryObj){
      this.payerId=this.rootScopeData.pendingActivitiesEsalBillerSummaryObj.payerId;
      this.payerName=this.rootScopeData.pendingActivitiesEsalBillerSummaryObj.payerFullName;
      this.payerNickName=this.rootScopeData.pendingActivitiesEsalBillerSummaryObj.shortName;
      this.refNum = this.rootScopeData.pendingActivitiesEsalBillerSummaryObj.referenceNumber;
    }
   
  }

}
