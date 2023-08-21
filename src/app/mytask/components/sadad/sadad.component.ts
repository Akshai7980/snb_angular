import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-sadad',
  templateUrl: './sadad.component.html',
  styleUrls: ['./sadad.component.scss']
})
export class SadadComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  pendingActivitiesCountData:any=[];
  paymentTransactionTotalCount:number=0;
  filePaymentsTotalCount:number=0;


  constructor(private mytaskService:MyTaskService, private router:Router) { 
    this.rootScopeData.myTaskSadadFilePaymentCount = 0;
  }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'singlepayments';
    this.rootScopeData.paymentActiveTabName = 'sadad'
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
