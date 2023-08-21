import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-single-beneficiary-details',
  templateUrl: './single-beneficiary-details.component.html',
  styleUrls: ['./single-beneficiary-details.component.scss']
})
export class SingleBeneficiaryDetailsComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  singleBeneficiaryDetailsData: any;
  childValues: any;
  parentValues: any;
  subProduct: any;
  beneId: any;
  constructor(private commonService:CommonService) { }

  ngOnInit(): void {
    this.singleBeneficiaryDetailsData = this.rootScopeData.pendingActivitiesSingleBeneficiaryObject;
    // if(this.singleBeneficiaryDetailsData.beneInquiry === "true"){
    //     this.subProduct = this.singleBeneficiaryDetailsData.subProduct
    //     this.beneId = this.singleBeneficiaryDetailsData.beneAliasName
    // }else{
    //   this.subProduct = this.singleBeneficiaryDetailsData.sub_product
    //   this.beneId = this.singleBeneficiaryDetailsData.bene_id
    // }
    // this.getSingleBeneficiaryDetails(this.beneId);
  }
  // getSingleBeneficiaryDetails(data:any){
  //   this.isLoadingCompelete = false;
  //   this.commonService.getSingleBeneficiaryDetails(data).subscribe((data:any)=>{
  //     this.isLoadingCompelete = true;
  //     if(data.data){
  //       this.rootScopeData.singleBeneficiaryDetailsObject = data.data;
  //       this.childValues = data.data.childValues;
  //       this.parentValues = data.data.parentValues;
  //     }
  //   }, (error: any) => {
  //     this.isLoadingCompelete= true;
  //   })
  // }
}
