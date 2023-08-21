import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-details-layout',
  templateUrl: './details-layout.component.html',
  styleUrls: ['./details-layout.component.scss']
})
export class DetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.pendingActivitiesServiceRequestObject.ref_NO,
      productCode:this.rootScopeData.pendingActivitiesServiceRequestObject.product_CODE,
      subProductCode:this.rootScopeData.pendingActivitiesServiceRequestObject.subprcode,
      functionCode:this.rootScopeData.pendingActivitiesServiceRequestObject.function_ID,
    }
  }

  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeChequeBookRequest'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectChequeBookRequest'])
  }
  back(){
    this.router.navigate(['/mytask/serviceRequest'])
  }

}
