import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-esal-payment-details',
  templateUrl: './esal-payment-details.component.html',
  styleUrls: ['./esal-payment-details.component.scss']
})
export class EsalPaymentDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  refNum: any;
  isLoadingCompelete = true;
  esalDetails: any;
  esalBillerDetails:any;
  displayedColumns= ['nickName', 'name', 'subscriberId', 'dueDate', 'amount'];
  paymentCCY: any;

  constructor(private commonService:CommonService) {}

  ngOnInit(): void {
    if(this.rootScopeData.myTasksESALSummaryObject){
      this.refNum = this.rootScopeData.myTasksESALSummaryObject.ref_NO;
    }else if(this.rootScopeData.transactionInquiry){
      this.refNum = this.rootScopeData.transactionInquiry.referenceNo;
    }
    
    this.getEsalDetails();
  }

  getEsalDetails(){
    this.isLoadingCompelete = false;
    this.commonService.esalDetailsAPICall(this.refNum).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.esalDetails = res.data;
      this.esalBillerDetails = res.data.selectedBillers;
      this.paymentCCY = res.data.paymentCcy;
      
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

}
