import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PaymentsServiceService } from '../../services/payments-service.service';

@Component({
  selector: 'app-si-menu',
  templateUrl: './si-menu.component.html',
  styleUrls: ['./si-menu.component.scss'],
})
export class SiMenuComponent implements OnInit {
  isLoadingComplete = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  transferTypes: any;
  constructor(
    private readonly paymentService: PaymentsServiceService,
    private readonly router: Router
  ) {
    this.rootScopeData.changeHeading = 'LBL_STANDING_ORDERS';
    // this.setActiveTab();
    this.rootScopeData.hideTabs = false;
  }

  ngOnInit(): void {
    this.getTransferTypes();
  }

  getTransferTypes() {
    this.isLoadingComplete = false;
    this.paymentService.getTransferTypeApiCall().subscribe(
      (response: any) => {
        if (response) {
          this.isLoadingComplete = true;
          this.transferTypes =
            response.data && response.data[0] && response.data[0].entitledSubPdt
              ? response.data[0].entitledSubPdt
              : [];
          this.transferTypes.forEach((element: any) => {
            if (element.subPdtCode === 'BKSIBT') {
              element.lbl = 'LBL_WITHIN_SNB';
              element.route = 'standingOrders/withinBank';
            } else if (element.subPdtCode === 'BKSIFT') {
              element.lbl = 'LBL_BKSIFT';
              element.route = 'standingOrders/ownAccount';
            } else if (element.subPdtCode === 'BKSRNT') {
              element.lbl = 'LBL_BKSRNT';
              element.route = 'standingOrders/localTransfer';
            } else if (element.subPdtCode === 'TELTRF') {
              element.lbl = 'LBL_INTERNATIONAL';
              element.route = 'standingOrders/internationalTransfer';
            }
          });
          // this.rootScopeData.paymentActiveTabName = 'BKSIFT';
        }
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }

  // setActiveTab(): void {
  //   const route = this.router.url;
  //   if (route === 'standingOrders/withinBank') {
  //     this.rootScopeData.paymentActiveTabName = 'BKSIBT';
  //   } else if (route === 'standingOrders/ownAccount') {
  //     this.rootScopeData.paymentActiveTabName = 'BKSIFT';
  //   } else if (route === 'standingOrders/localTransfer') {
  //     this.rootScopeData.paymentActiveTabName = 'BKSRNT';
  //   } else if (route === 'standingOrders/internationalTransfer') {
  //     this.rootScopeData.paymentActiveTabName = 'TELTRF';
  //   }
  // }

  routeToTable(transferType: any): void {
    this.router.navigate([transferType.route]);
    this.rootScopeData.paymentActiveTabName = transferType.subPdtCode;
  }
}
