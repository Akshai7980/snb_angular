import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-biller-management',
  templateUrl: './biller-management.component.html',
  styleUrls: ['./biller-management.component.scss']
})
export class BillerManagementComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  pendingActivitiesCountData:any=[];
  paymentTransactionTotalCount:number=0;
  filePaymentsTotalCount:number=0;

  constructor(private mytaskService:MyTaskService, private router:Router) { 
   
  }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'sadadbillers';
    this.rootScopeData.paymentActiveTabName = 'billermanagement'
  }

}
