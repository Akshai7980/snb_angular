import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { logoprint } from 'src/app/utility/common-utility';
import { RootScopeData } from '../../../rootscope-data';
import { RootScopeDeclare } from '../../../rootscope-declare';
import { showFilteredRows } from '../../../utility/tableFilter';
import { CommonInjectServiceService } from '../../services/common-inject-service.service';

@Component({
  selector: 'app-accounts-inquiry',
  templateUrl: './accounts-inquiry.component.html',
  styleUrls: ['./accounts-inquiry.component.scss']
})
export class AccountsInquiryComponent implements OnInit {


  contextMenuList: any = [];
  rootScopeData:RootScopeDeclare=RootScopeData;
  logo :string="";
  printSection:string="";
  route: any;
  enablePropertty:boolean =true;
  propertyValue :string="";
  @Input() proopertyenable :any;
  @Output() onMenuClick = new EventEmitter();
  @Output() onRefreshClick = new EventEmitter();
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
  constructor( private service: CommonInjectServiceService) {this.rootScopeData.lhsActiveComp = 'accountInquiry'; this.logo = logoprint(); }

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
  //   showFilteredRows(this.rootScopeData.filterTableId, event.target.value); 
  // }

  // triggerDropdownFilter(event:any):void{
  //   showFilteredRows(this.rootScopeData.filterTableId, event); 
  // }


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

  // refreshSummary(){
  //   this.onRefreshClick.emit('Y');
  // }

  // onOutletLoaded(component :any){
  //   debugger
  //  if(component.enablePropertty == false){
  //      this. enablePropertty = false;
  //  }
  //  else{
  //   this.enablePropertty = true;
  //  }
   

  // }

  // ngOnChanges(component :any) { 
  //   component.enablePropertty.detectChanges();
  //   debugger;
  //   if(component.enablePropertty == false){
  //     this. enablePropertty = false;
  // }
  // else{
  //  this.enablePropertty = true;
  // }
  // }












}
