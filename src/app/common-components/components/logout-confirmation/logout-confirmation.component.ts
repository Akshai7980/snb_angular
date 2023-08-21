import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonUtility } from 'src/app/utility/common-utility';
import { ɵparseCookieValue } from '@angular/common';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-logout-confirmation',
  templateUrl: './logout-confirmation.component.html',
  styleUrls: ['./logout-confirmation.component.scss']
})
export class LogoutConfirmationComponent implements OnInit {

  @Output() onLogout = new EventEmitter()
  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor(private commonService: CommonService,private commonutil :CommonUtility) { }

  ngOnInit(): void {
  }


  logoutClick() {
    localStorage.setItem('rtl',this.rootScopeData.userInfo.mLanguage === 'ar_SA'?'true':'false');
    this.commonutil.logoutClick();  
   
    // this.commonService.logOutApiCall().subscribe((response: any) => {
    //   let resp: any = response;
    //   if (resp.logout === "success") {
    //     this.deleteAllCookies();
    //     deleteDOMandShowReloginOPtion();       
    //     window.location.href = "../iportal/jsps/orbilogin.jsp";
    //   }
    // }, error => {
    //   this.deleteAllCookies();
    //    deleteDOMandShowReloginOPtion();
    //    window.location.href = "../iportal/jsps/orbilogin.jsp";
    // }
    // ) 
  }


  // deleteAllCookies() {
  //   sessionStorage.clear();   
  //   let cookies = document.cookie.split(";");
  //   for (let i = 0; i < cookies.length; i++) {
  //     let cookie = cookies[i];
  //     let eqPos = cookie.indexOf("=");
  //     let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //     document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
  //   }
  // }
}



