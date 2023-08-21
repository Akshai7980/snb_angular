import { Component, Input, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-transferinqurirydetails',
  templateUrl: './transferinqurirydetails.component.html',
  styleUrls: ['./transferinqurirydetails.component.scss']
})
export class TransferinqurirydetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferDetails: any;
  transferSummary: any;
  debitDetails: any;
  proxyName: any;
  showProxy: boolean = false;
  printSection: string = '';
  isLoadingCompelete : boolean = true;
  @Input() transfersummaryDetails : any;
  constructor(private transactionservice: TransactionInquiryService) {}

  ngOnInit(): void {
  
  }

 
}

