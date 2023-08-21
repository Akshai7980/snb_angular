import { Component, Input, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AccountDetailsService } from '../../services/account-details.service';


@Component({
  selector: 'app-transfersummary-details',
  templateUrl: './transfersummary-details.component.html',
  styleUrls: ['./transfersummary-details.component.scss']
})
export class TransfersummaryDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() transfersummaryDetails: any;
  @Input() currentRecord:any;
  proxyName: any;
  showProxy: boolean = false;
  isLoadingCompelete: boolean = true;

  constructor(private accService : AccountDetailsService) { }

  ngOnInit(): void {
   
  }

  

}
