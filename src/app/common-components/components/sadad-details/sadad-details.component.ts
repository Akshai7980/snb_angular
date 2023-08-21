import { Component, Input, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-sadad-details',
  templateUrl: './sadad-details.component.html',
  styleUrls: ['./sadad-details.component.scss']
})
export class SadadDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  refNum: any;
  isLoadingCompelete = true;
  sadadDetails: any;
  sadadBillerDetails:any;
  displayedColumns= ['nickName', 'name', 'subscriberId', 'dueDate', 'amount'];
  paymentCCY: any;

  constructor(private commonService:CommonService) {}

  ngOnInit(): void {
    if(this.rootScopeData.myTaskSADADSummaryObject){
      this.refNum = this.rootScopeData.myTaskSADADSummaryObject.ref_NO;
    }else if(this.rootScopeData.transactionInquiry){
      this.refNum = this.rootScopeData.transactionInquiry.referenceNo;
    }
    
    this.getSadadDetails();
  }

  getSadadDetails(){
    this.isLoadingCompelete = false;
    this.commonService.sadadDetailsAPICall(this.refNum).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.sadadDetails = res.data;
      this.sadadBillerDetails = res.data.selectedBillers;
      this.paymentCCY = res.data.paymentCcy;
      
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

}
