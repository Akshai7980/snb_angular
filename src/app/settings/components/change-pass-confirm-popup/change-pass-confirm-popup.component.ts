import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/common-components/services/common.service';
import { deleteDOMandShowReloginOPtion } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-change-pass-confirm-popup',
  templateUrl: './change-pass-confirm-popup.component.html',
  styleUrls: ['./change-pass-confirm-popup.component.scss']
})
export class ChangePassConfirmPopupComponent implements OnInit {
  @Output() onClose = new EventEmitter()
  constructor(private commonService: CommonService,private transService : TranslateService) { }

  ngOnInit(): void {
  }


  confirm() {
    // this.onLogout.emit();
    this.commonService.logOutApiCall().subscribe((response: any) => {
      let resp: any = response;
      if (resp.logout === "success") {
        this.deleteAllCookies();
        deleteDOMandShowReloginOPtion(this.transService);       
        // window.location.href = "../iportal/jsps/orbilogin.jsp";
      }
    }, error => {
      this.deleteAllCookies();
       deleteDOMandShowReloginOPtion(this.transService);
      //  window.location.href = "../iportal/jsps/orbilogin.jsp";
    }
    )
  }


  deleteAllCookies() {
    sessionStorage.clear();   
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
    }
  }
}
