import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { deleteDOMandShowReloginOPtion } from 'src/app/utility/common-utility';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() langChangeDirection = new EventEmitter()
  rootScopeData: RootScopeDeclare = RootScopeData;
  searchStatus=false;
  searchText: any=[];
  filteredItems: any;
  urlToNavigate:any;
  // searchOptions = [
  //   {data:'Dashboard',path:'/dashboard'},
  //    {data:'Accounts',path:'/accounts/accounts-inquiry/casa'},
  //    {data:'Payments',path:'/payments'},
  //    {data:'Generate Statement',path:'/accounts/generate-statement'},
  //    {data:'Cheque Book Request',path:'/accounts/chequebook-request'},
  //    {data:'View e-Statement',path:'/accounts/view-estatement'},
  //    {data:'My Task',path:'/mytask/payment/single-payments'},
  //    {data:'Service Request',path:'/mytask/serviceRequest'},
  //    {data:'Beneficiaries',path:'/mytask/beneficiary/singlefile'},
  //    {data:'Sadad Billers',path:'/mytask/sadad-billers'},
  //    {data:'Notifications',path:'/notifications/notification/alerts'},
  //    {data:'MailBox',path:'/notifications/mailbox/inbox'},
  //    {data:'Settings',path:'/settings/preferences'},
  //    {data:'Preferences',path:'/settings/preferences'},
  //    {data:'User Profile',path:'/settings/userProfile'},
  //    {data:'Appearance',path:'/settings/appearance'},
  //    {data:'Manage Alerts',path:'/settings/manageAlerts'},
  //    {data:'Change Password',path:'/settings/changePassword'},

   

  // ];
 
  

  isLoadingCompelete = true;
  constructor(private commonService:CommonService,private route: Router,public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  langChange(){
    let selectedLanguage = this.rootScopeData.userInfo.mLanguage;
    if(selectedLanguage == 'en_US') {
      this.rootScopeData.userInfo.mLanguage = 'ar_SA';
    }else{
      this.rootScopeData.userInfo.mLanguage = 'en_US';
    }
  this.langChangeDirection.emit()
}
filterItem(value: any) {
  this.filteredItems = Object.assign([], this.rootScopeData.userEntitlements.quickSearchMenu).filter(
    (search: { item_id: string; }) => search.item_id.toLowerCase().indexOf(value.toLowerCase()) > -1
  )
}

clickRouter(selectedValue:any)
{
  let vSelectedvalue = selectedValue;
  this.urlToNavigate = this.rootScopeData.urlMapping[vSelectedvalue];
  this.route.navigate([this.urlToNavigate]);
}


logOut(){
 
    let dialogRef = this.dialog.open(LogoutConfirmationComponent,{
      width:'400px'
    });   
    const sub = dialogRef.componentInstance.onLogout.subscribe(() => {
      this.dialog.closeAll();
     }); 
 
}
search(){
  this.searchStatus = !this.searchStatus
}
inputSearch(){

}


}
