import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PaymentsServiceService } from '../../services/payments-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fund-transfer-menu',
  templateUrl: './fund-transfer-menu.component.html',
  styleUrls: ['./fund-transfer-menu.component.scss']
})
export class FundTransferMenuComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData
  isLoadingCompelete = false;
  paymentName = "";
  transTypeObj: any;

  constructor(private router: Router, private paymentService: PaymentsServiceService) {
    this.rootScopeData.lhsActiveComp = 'fundTransfer';
    this.rootScopeData.changeHeading = 'LBL_MAKE_PYMNT';
    this.rootScopeData.hideTabs = false;
    //this.rootScopeData.paymentActiveTabName = 'BKSIFT';
   }

  ngOnInit(): void {  
    this.isLoadingCompelete = true;
    this.getTransferType();
  }

  getTransferType() {
    this.isLoadingCompelete = false;
    this.paymentService.getTransferTypeApiCall().subscribe((response: any) => {
        if(response){
          this.isLoadingCompelete = true;
          this.transTypeObj =   response.data && response.data[0] && response.data[0].entitledSubPdt ? response.data[0].entitledSubPdt : "";
          // this.rootScopeData.paymentActiveTabName = this.transTypeObj[0].subPdtCode;
          this.transTypeObj.forEach((element:any) => {
            if( element.subPdtCode==='BKSIBT'){
              element.lbl="LBL_WITHIN_SNB"
            }else if(element.subPdtCode==='BKSIFT'){
              element.lbl="LBL_BKSIFT"
            }else if(element.subPdtCode==='BKSRNT'){
              element.lbl="LBL_BKSRNT"
            }else if(element.subPdtCode==='TELTRF'){
              element.lbl="LBL_INTERNATIONAL"
            }
          });
        }
      }, error => {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
      }
    )
  }

  transTypeRoute(subProd:any){
    let PaymentRoute = this.rootScopeData.urlMapping[subProd];
    this.router.navigate([PaymentRoute]);
  }
}
