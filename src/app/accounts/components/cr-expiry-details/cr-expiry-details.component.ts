import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';
import { AccountDetailsService } from '../../services/account-details.service';

@Component({
  selector: 'app-cr-expiry-details',
  templateUrl: './cr-expiry-details.component.html',
  styleUrls: ['./cr-expiry-details.component.scss']
})
export class CrExpiryDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingCompelete = true;
  logo: string = "";
  printSection: string = "";
  crExpiryDetails: any = {};

  constructor(private accService: AccountDetailsService) { this.logo = logoprint(); }

  ngOnInit(): void {
    this.printSection = "chequeBookDetailsPrintSection";
    this.getCrExpiryDetails();
  }
  getCrExpiryDetails() {
    this.isLoadingCompelete = false;
    let params = {
      "subProductName": "UPDCREX",
      "unitId": this.rootScopeData.userInfo.UNIT_ID
    }
    this.accService.getCrExpiryDetails(params).subscribe((resp: any) => {
      this.isLoadingCompelete = true;
      if (resp && resp.data && resp.data.length > 0) {
        this.crExpiryDetails = resp.data[0];
      }
      else {
        this.isLoadingCompelete = true;
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    }, error => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }

}
