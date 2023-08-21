import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-more-action',
  templateUrl: './more-action.component.html',
  styleUrls: ['./more-action.component.scss']
})
export class MoreActionComponent implements OnInit {
  isOpen = false;
  cardData: any = [];
  loanData: any = [];
  depositeData: any = [];
  savingsData: any = [];
  // rootScopeData: RootScopeDeclare = RootScopeData;
  tabType:any;
  isShownviewDetails :boolean = true;
  isShownSwiftAdvice :boolean = false;
  iconName:any = "more-icon";
  @Input() moreActionList: any;
  @Input() hideViewDetails: any;
  @Input() loadIcon: any;
  @Input() currentRecord: any;//
  @Input() selectedPage:any;
  @Input() routepath:any;
  @Input() viewDetails :any;
  //@Input() downloadAdvice :any;
  @Input() menus : any;
  @Output() onMenuClick = new EventEmitter();
  @Output() onviewDetailsClick = new EventEmitter();
  @Output() onDownloadAdviceClick = new EventEmitter();
  @Output() onModifyClick = new EventEmitter();
  @Output() onBeforeMenuClick = new EventEmitter();
  rootScopeData:RootScopeDeclare=RootScopeData;

  showtext : boolean = false;
  constructor(private route: Router) {
 
    // this.tabType = this.rootScopeData.activeTabName;
   }

  ngOnInit(): void {
    let icon = this.loadIcon;
    if(icon == "initiate"){
      this.iconName = "initiate-icon";
    }else if(icon =="text"){
      this.iconName = "";
      this.showtext = true; 

    }
    // if(this.downloadAdvice == true)
    // {
    //   this.isShownSwiftAdvice = true;
    //   this.isShownviewDetails = false;
    // }
    // else{
    //   this.isShownSwiftAdvice = false;
    //   this.isShownviewDetails = false;
    // }
  
  }
  
  showMenuList(event:any){
  //  event?.stopPropagation();
   this.onBeforeMenuClick.emit(this.currentRecord);
  //  if(this.downloadAdvice == false){
  //     this.isShownSwiftAdvice = false;
  //     this.isShownviewDetails = true;
  //  }
   this.isOpen = !this.isOpen;
  }

  menuClick(menuObj:any){
    if(menuObj.item_id==="GENERATE_STATEMENT"){
      this.rootScopeData.checkGnerateStatementEdit = true;
    }
    if(menuObj.item_id==="IBAN"){
      this.rootScopeData.dataFromContextMenu = this.currentRecord;
      this.onMenuClick.emit(menuObj);
      return;
    }

    if(menuObj.item_id==="DOWNLOAD"){
      this.rootScopeData.dataFromContextMenu = this.currentRecord;
      this.onMenuClick.emit(menuObj);
      return;
    }
    this.onMenuClick.emit(menuObj.value);
    this.isOpen = false;
    let urlToNavigate = this.rootScopeData.urlMapping[menuObj.item_id];
    //alert(urlToNavigate);
    this.rootScopeData.dataFromContextMenu = this.currentRecord;
    this.route.navigate([urlToNavigate]);
  }

  viewDetailClick(){
    if(this.routepath === '/transactionInquiry/singleTransferDetailsLayout'){
      this.onviewDetailsClick.emit();
    }else if (this.routepath ==='/accounts/chequedetailsLayout'){
      this.onviewDetailsClick.emit(this.currentRecord);
    }
    else {
      this.route.navigate([this.routepath]);
    }
  }

  // swiftAdviceClick(){
  //   this.onDownloadAdviceClick.emit(this.currentRecord);
  // }
  
  modifyClick(){
    this.onModifyClick.emit(this.currentRecord);
  }
 
}
