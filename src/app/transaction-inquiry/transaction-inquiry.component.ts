import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from '../rootscope-data';
import { RootScopeDeclare } from '../rootscope-declare';
import { showFilteredRows } from '../utility/tableFilter';

@Component({
  selector: 'app-transaction-inquiry',
  templateUrl: './transaction-inquiry.component.html',
  styleUrls: ['./transaction-inquiry.component.scss']
})
export class TransactionInquiryComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  contextMenuList: any = [];
  // logo ="assets/images/logo.png";
  logo="assets/images/snb-logo-print.png"
  printSection:string="";
  route: any;
  @Output() onMenuClick = new EventEmitter();
  @Output() onRefreshClick = new EventEmitter();  
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
  constructor() { 
    this.rootScopeData.lhsActiveComp = 'transactionInquiry';
 }

  ngOnInit(): void {
    this.printSection="transactionInquiryPrintSection";
    this.contextMenuList = [
      {"displayName": "LBL_CHEQUE_BOOK_REQUEST", "value":"cheqeBookRequest"},
      {"displayName": "LBL_BOOK_DEPOSIT", "value":"bookDeposit"},
      {"displayName": "LBL_MANAGE_ALIAS", "value":"manageAlias"},
      {"displayName": "LBL_DWNLD_ESTMNT", "value":"downloadEStatement"} 
    ];
  }

  triggerSearchFilter(event:any): void {
    showFilteredRows(this.rootScopeData.filterTableId, event.target.value); 
  }

  triggerDropdownFilter(event:any):void{
    showFilteredRows(this.rootScopeData.filterTableId, event); 
  }

  refreshSummary(){
    this.onRefreshClick.emit('Y');
  }
}
