import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-beneficiary-details-layout',
  templateUrl: './beneficiary-details-layout.component.html',
  styleUrls: ['./beneficiary-details-layout.component.scss']
})
export class BeneficiaryDetailsLayoutComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  workFlowHistoryParams: any;
  isInActivate: boolean = false;
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.workFlowHistoryParams={
      refNum:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.odLibRefNo,
      productCode:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.sub_prod,
      subProductCode:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.odSubProd,
      functionCode:this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.bene_id,
    }

    if(this.rootScopeData.pendingActivitiesSingleBeneficiaryObject.isCallBackSuccess === "Active"){
      this.isInActivate = false;
    }else{
      this.isInActivate = true;
    }

  }
  onClickAuthorize(){
    this.router.navigate(['/mytask/authorizeSingleBeneficiaryRequest'])
  }
  onClickReject(){
    this.router.navigate(['/mytask/rejectSingleBeneficiaryRequest'])
  }

  onClickActivate(){
    let beneficiarySelectedSingle:any=[];
    beneficiarySelectedSingle.push(this.rootScopeData.pendingActivitiesSingleBeneficiaryObject);
    this.rootScopeData.selectedBeneficiary = beneficiarySelectedSingle;
    this.router.navigate(['/payments/beneficiaryActivation']);
  }
  onClickBack(){
    this.router.navigate(['/payments/beneficiaryInquiry'])
  }
}
