
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-transfersummary-tracker-details',
  templateUrl: './transfersummary-tracker-details.component.html',
  styleUrls: ['./transfersummary-tracker-details.component.scss']
})
export class TransfersummaryTrackerDetailsComponent implements OnInit {
  displayedColumns: string[] = ['bankName', 'senderRef', 'recievedDate', 'sentDate','deduct'];
  dataSourceToPass! : MatTableDataSource<any>;
  @Input() trackerdetails: any;
  @Input() req: any;
  norecordflag: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSource: any;
  isLoadingCompelete = true;
  responseHeader: any;
 
  constructor(private accservice: AccountDetailsService) {
    
  }

  ngOnInit(): void {
    console.log('trackerdetails', this.trackerdetails);
    this.dataSourceToPass = new MatTableDataSource([this.trackerdetails]);
  }

}
