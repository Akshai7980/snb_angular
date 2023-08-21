import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-tradesso-ticketconfirm-popup',
  templateUrl: './tradesso-ticketconfirm-popup.component.html',
  styleUrls: ['./tradesso-ticketconfirm-popup.component.scss']
})
export class TradessoTicketconfirmPopupComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  selectedRadioConfirmTicket = 'useExistingTic';
  useExistingTic: any;
  generateNewTic: any;
  isConfirmTicketValid = false;
  // killFlagValue: string = 'N';
  @ViewChild('openPopup') openPopup!: TemplateRef<any>;
  isLoadingCompelete = true;
  url: any;
  // tokenFromServie: any;
  // pwdFromServie: any;
  constructor(public dialog: MatDialog, private commonService: CommonService) { }

  ngOnInit(): void {
    this.tradeSsoToken();
  }

  tradeSsoToken() {
    this.isLoadingCompelete = false;
    let data = {
      loginId: this.rootScopeData.userInfo.loginID,
      Gcif: this.rootScopeData.userInfo.corpID,
      killFlag: 'N'
    }

    this.commonService.generateTradeTicket(data).subscribe((response: any) => {
      // console.log(response)
      // this.tokenFromServie = response.dataValue.tokenId;
      // this.pwdFromServie = response.dataValue.pwd;
      this.url = response.dataValue.url;
      if (response.dataValue.existTkt === 'Y') {
        this.isLoadingCompelete = true;
        this.dialog.open(this.openPopup,{
          width:'400px',
          disableClose: true
        });
      } else {
        this.launchURL();
        this.rootScopeData.callTradeSSO = false;
      }
    }, error => {
      this.rootScopeData.callTradeSSO = false;
    })
  }

  ticketConfirmClick() {
    if (this.selectedRadioConfirmTicket) {
      this.isLoadingCompelete = false;
      if (this.selectedRadioConfirmTicket === "useExistingTic") {
        this.rootScopeData.callTradeSSO = false;
        this.dialog.closeAll();
        this.launchURL();
      }
      else {
		//this.killFlagValue = 'Y';
        //Submit API Call
        let data = {
          loginId: this.rootScopeData.userInfo.loginID,
          Gcif: this.rootScopeData.userInfo.corpID,
          killFlag: 'Y'
        }    
        this.commonService.generateTradeTicket(data).subscribe((response: any) => {
          // console.log(response)     
          // var token = response.dataValue.tokenId;
          // var pwd = response.dataValue.pwd;
          this.url = response.dataValue.url;
          this.launchURL();
          this.dialog.closeAll();
          this.rootScopeData.callTradeSSO = false;  
          this.isLoadingCompelete = true;
        }, error => {
          this.rootScopeData.callTradeSSO = false;
        });
      }

    }
    else {
      this.isConfirmTicketValid = true;
    }

  }

  launchURL(){
    // this.url = 'http://rhlux50027:9080/peachtree/login?username='+this.rootScopeData.userInfo.loginID+'&password='+pwd+'&loginMode=EGI'
    window.open(this.url, "_blank");
  }

}
