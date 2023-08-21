import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-sadad-moi-refund-req-details',
  templateUrl: './sadad-moi-refund-req-details.component.html',
  styleUrls: ['./sadad-moi-refund-req-details.component.scss']
})
export class SadadMoiRefundReqDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  refNum: any;
  isLoadingCompelete = true;
  sadadMoiRefundReqDetails: any;
  sadadMoiRefundReqDynamicValues: any;
  
  constructor(private commonService:CommonService) {}

  ngOnInit(): void {
    if(this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject){
      this.refNum = this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject.ref_NO;
    }else if(this.rootScopeData.transactionInquiry){
      this.refNum = this.rootScopeData.transactionInquiry.referenceNo;
    }
    this.getSadadMoiRefundReqDetails();
  }

  getSadadMoiRefundReqDetails(){
    this.isLoadingCompelete = false;
    this.commonService.sadadMOIRefundReqDetailsAPICall(this.refNum).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.sadadMoiRefundReqDetails = res.data[0];
      this.sadadMoiRefundReqDynamicValues = res.data[0].parameters;
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }
}
