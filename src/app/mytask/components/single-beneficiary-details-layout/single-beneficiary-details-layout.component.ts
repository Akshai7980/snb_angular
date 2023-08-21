import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-single-beneficiary-details-layout',
  templateUrl: './single-beneficiary-details-layout.component.html',
  styleUrls: ['./single-beneficiary-details-layout.component.scss']
})
export class SingleBeneficiaryDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.lib_ref_no,
      productCode:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.sub_prod,
      subProductCode:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.sub_prod,
      functionCode:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.bene_id,
    }
  }
  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeSingleBeneficiaryRequest'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectSingleBeneficiaryRequest'])
  }
  back(){
    this.router.navigate(['/mytask/beneficiary/singlefile'])
  }

}
