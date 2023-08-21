import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  pendingActivitiesCountData:any=[];
  paymentTransactionTotalCount:number=0;
  filePaymentsTotalCount:number=0;

  constructor(private mytaskService:MyTaskService, private router:Router) { 
   
  }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'singlepayments';
    this.rootScopeData.paymentActiveTabName = 'payments'
      this.getAllCounts();
  }

  getAllCounts(){
    
    this.mytaskService.pendingActivitesCountApiCall().subscribe(
      response =>{
        this.pendingActivitiesCountData=response.dataValue;
        this.filePaymentsTotalCount = this.pendingActivitiesCountData.fupCount;
        this.paymentTransactionTotalCount=this.pendingActivitiesCountData.payCount;
      },
      error =>{
      }
    )
  }

}
