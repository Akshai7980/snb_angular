import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

import { TransactionInquiryService } from '../../services/transaction-inquiry.service';


@Component({
  selector: 'app-transferinqurirypaymentstatus',
  templateUrl: './transferinqurirypaymentstatus.component.html',
  styleUrls: ['./transferinqurirypaymentstatus.component.scss']
})
export class TransferinqurirypaymentstatusComponent implements OnInit {
  @Input() req:any;
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
 @Input() paymentStatusDetails :any;
  
  constructor(private transactionservice: TransactionInquiryService) { }

  ngOnInit(): void {
    
  }
  
}


