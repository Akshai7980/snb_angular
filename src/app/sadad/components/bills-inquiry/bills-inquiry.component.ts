import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonInjectServiceService } from 'src/app/accounts/services/common-inject-service.service';
import { RootScopeData } from '../../../rootscope-data';
import { RootScopeDeclare } from '../../../rootscope-declare';
import { showFilteredRows } from '../../../utility/tableFilter';


@Component({
  selector: 'app-bills-inquiry',
  templateUrl: './bills-inquiry.component.html',
  styleUrls: ['./bills-inquiry.component.scss']
})
export class BillsInquiryComponent implements OnInit {
  contextMenuList: any = [];
  rootScopeData:RootScopeDeclare=RootScopeData;
  printSection:string="";
  route: any;
  enablePropertty:boolean =true;
  propertyValue :string="";
  @Input() proopertyenable :any;
  @Output() onMenuClick = new EventEmitter();
  @Output() onRefreshClick = new EventEmitter();
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
  constructor( private service: CommonInjectServiceService) {this.rootScopeData.lhsActiveComp = 'accountInquiry' }

  ngOnInit(): void {
    this.printSection="accountsPrintSection";

    this.contextMenuList = [
      {"displayName": "LBL_CHEQUE_BOOK_REQUEST", "value":"cheqeBookRequest"},
      {"displayName": "LBL_BOOK_DEPOSIT", "value":"bookDeposit"},
      {"displayName": "LBL_MANAGE_ALIAS", "value":"manageAlias"},
      {"displayName": "LBL_DWNLD_ESTMNT", "value":"downloadEStatement"} 
    ];
  }


 
  // triggerSearchFilter(event:any): void {
  //   // showFilteredRows(this.rootScopeData.filterTableId, event.target.value); 
  // }

  triggerDropdownFilter(event:any):void{
    showFilteredRows(this.rootScopeData.filterTableId, event); 
  }


  ngAfterViewInit() {
    
    setInterval(()=>{
      this.service.data$.subscribe(n => this.propertyValue = n)
      if(this.propertyValue === "false")
      {
        this.enablePropertty = false;
      }
      else{
        this.enablePropertty = true;
      }
    },100)
    
  }

}
