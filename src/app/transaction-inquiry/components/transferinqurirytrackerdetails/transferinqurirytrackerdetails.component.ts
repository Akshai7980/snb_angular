import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from 'src/app/common-components/services/common.service';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';



@Component({
  selector: 'app-transferinqurirytrackerdetails',
  templateUrl: './transferinqurirytrackerdetails.component.html',
  styleUrls: ['./transferinqurirytrackerdetails.component.scss']
})
export class TransferinqurirytrackerdetailsComponent implements OnInit {

  displayedColumns: string[] = ['bankName', 'senderRef', 'recievedDate', 'sentDate','deduct'];
  dataSourceToPass: any;
  @Input() req: any;
  norecordflag: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSource: any;
  isLoadingCompelete = true;
  responseHeader: any;
  sortDirection: string = '';
  currentColumn: string = '';
  @Input() transfersummaryDetails : any;
  constructor(private transactionservice: TransactionInquiryService) {
    this.currentColumn ='bank_NAME';
    this.sortDirection ='desc';
  }

  ngOnInit(): void {
    this.dataSourceToPass = new MatTableDataSource([this.transfersummaryDetails]);
  }

}
