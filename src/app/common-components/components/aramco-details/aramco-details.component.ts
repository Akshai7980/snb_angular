import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-aramco-details',
  templateUrl: './aramco-details.component.html',
  styleUrls: ['./aramco-details.component.scss']
})
export class AramcoDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  refNum: any;
  isLoadingCompelete = true;
  aramcoDetails: any;
  aramcoInvoiceDetails:any;
  displayedColumns= ['invoiceNumber', 'valueDate', 'dueOn', 'invoiceAmount', 'amountInSar'];

  constructor(private commonService:CommonService) {}

  ngOnInit(): void {
    if(this.rootScopeData.aramcoSummaryObject){
      this.refNum = this.rootScopeData.aramcoSummaryObject.referenceNo;
    }else if(this.rootScopeData.myTasksARAMCOSummaryObject){
      this.refNum = this.rootScopeData.myTasksARAMCOSummaryObject.ref_NO;
    }
    this.getAramcoDetails();
  }

  getAramcoDetails(){
    this.isLoadingCompelete = false;
    this.commonService.aramcoDetailsAPICall(this.refNum).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      this.aramcoDetails = res.data;
      this.aramcoInvoiceDetails = res.data.invoiceTxns;
    }, (error: any) => {
      this.isLoadingCompelete= true;
    })
  }

}
