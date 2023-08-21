import { Component, Input, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-advanced-filter-pos-transaction',
  templateUrl: './advanced-filter-pos-transaction.component.html',
  styleUrls: ['./advanced-filter-pos-transaction.component.scss']
})
export class AdvancedFilterPosTransactionComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  rootScopeData: RootScopeDeclare = RootScopeData;  
  clearFlag: boolean = false;
  showDateErrorMessage: boolean = false;
  dateFrom: any;
  dateTo: any;
  maxDate: any;
  minDate: any;
  fromDateValue: any;
  transaction= [
    {viewValue: 'All'},
    { viewValue: 'ARAMCO Invoice Payments'},
    { viewValue: 'Activate Merchant'},
    { viewValue: 'Account Activation'},
    { viewValue: 'Add Ecommerce Merchant'},
    
  ];
  status= [
    {viewValue: 'All'},
    { viewValue: 'Discard'},
    { viewValue: 'Pending'}
    
  ];
  constructor() { }

  ngOnInit(): void {
  }
  stopAdvancedSearchClose(event: any) {
    event.stopImmediatePropagation();
  }
  getFromDate(event: any) {
    this.dateFrom = event;
  }
  getToDate(event: any) {
    this.dateTo = event;
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
