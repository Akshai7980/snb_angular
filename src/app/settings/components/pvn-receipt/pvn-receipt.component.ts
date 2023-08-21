import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { deleteDOMandShowReloginOPtion, logoprint } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-pvn-receipt',
  templateUrl: './pvn-receipt.component.html',
  styleUrls: ['./pvn-receipt.component.scss']
})
export class PvnReceiptComponent implements OnInit {

  printSection:string="";
  logo :string="";
  @Input() receiptDetails: any;
 
  rootScopeData: RootScopeDeclare = RootScopeData

  isLoadingCompelete : boolean = true;
  constructor(private translateService:TranslateService, private commonService:CommonService) { 
    this.logo = logoprint();
  }

  ngOnInit(): void {
    this.printSection="receiptConatiner";
    
  }
  logOut(){
    this.isLoadingCompelete = false;
    this.commonService.logOutApiCall().subscribe((response:any)=>{   
      let resp: any = response;
       this.isLoadingCompelete = true;
          if(resp.logout === "success"){
            deleteDOMandShowReloginOPtion(this.translateService);
            window.location.href="../iportal/jsps/orbilogin.jsp";
          }
    }, error => {
            this.isLoadingCompelete = true;
            deleteDOMandShowReloginOPtion(this.translateService);
            window.location.href="../iportal/jsps/orbilogin.jsp";
    }
    )
  }

}
