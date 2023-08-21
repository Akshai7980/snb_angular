import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonMessagePopupComponent } from 'src/app/common-components/components/common-message-popup/common-message-popup.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-dashboard-base',
  templateUrl: './dashboard-base.component.html',
  styleUrls: ['./dashboard-base.component.scss']
})
export class DashboardBaseComponent implements OnInit {
  logo :string ="";
  rootScopeData:RootScopeDeclare=RootScopeData;
  accountsData: any;
  loansData: any;
  constructor( public dialog: MatDialog) {this.logo = logoprint(); }

  ngOnInit(): void {
     if(this.rootScopeData && this.rootScopeData.userInfo && this.rootScopeData.userInfo.natIdExpiryAlert === 'Y'){
      this.getExpiryIDPopup();
     }
  }

  accountsDataToPortfolio(data:any){
    this.accountsData = data;
  }
  loansDataToPortfolio(data:any){
    this.loansData = data;
  }

  getExpiryIDPopup(){

    let dialogRef = this.dialog.open(CommonMessagePopupComponent, {
      width: '600px',
      hasBackdrop : false,
      data: {
        title: "LBL_NOTIFICATION",
        content: "LBL_EXPIRY_ID_CONTENT",
        btnLabel:"LBL_UPDATE_ID",
        btnRoute : "/settings/updateNID"
      }
    });
  }

}
