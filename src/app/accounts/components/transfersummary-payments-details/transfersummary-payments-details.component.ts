import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-transfersummary-payments-details',
  templateUrl: './transfersummary-payments-details.component.html',
  styleUrls: ['./transfersummary-payments-details.component.scss']
})
export class TransfersummaryPaymentsDetailsComponent implements OnInit {

  @Input() req:any;
  dataSourceLength: any;
  norecordflag:boolean = false;
  rootScopeData:RootScopeDeclare=RootScopeData;
  dataSourceToPass: any;
  dataSource: any;
  isLoadingCompelete = true;
  displayedColumns = [
  {key:"LBL_PAYMENT_STATUS"},
  {key:"LBL_ORDER_DATE"},
  {key:"LBL_CREDIT_VALUE_DATE"}  
  ];

 @Input() paymentStatusDetails: any;
  
  
  constructor(private accservice: AccountDetailsService) { }

  ngOnInit(): void {
   
  }

}

