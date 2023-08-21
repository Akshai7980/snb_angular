import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-sadad-moi-details',
  templateUrl: './sadad-moi-details.component.html',
  styleUrls: ['./sadad-moi-details.component.scss']
})
export class SadadMoiDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  refNum: any;
  isLoadingCompelete = true;
  sadadMoiDetails: any;
  sadadMoiDynamicValues: any;
  
  constructor(private commonService:CommonService) {}

  ngOnInit(): void {
    if(this.rootScopeData.myTaskSADADMOISummaryObject){
      this.refNum = this.rootScopeData.myTaskSADADMOISummaryObject.ref_NO;
    }else if(this.rootScopeData.transactionInquiry){
      this.refNum = this.rootScopeData.transactionInquiry.referenceNo;
    }
    this.getSadadMoiDetails();
  }

  getSadadMoiDetails(){
    this.isLoadingCompelete = false;
    this.commonService.sadadMOIDetailsAPICall(this.refNum).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.sadadMoiDetails = res.data[0];
      this.sadadMoiDynamicValues = res.data[0].parameters;
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }
}
