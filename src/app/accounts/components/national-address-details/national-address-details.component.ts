import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';
import { AccountDetailsService } from '../../services/account-details.service';
@Component({
  selector: 'app-national-address-details',
  templateUrl: './national-address-details.component.html',
  styleUrls: ['./national-address-details.component.scss']
})
export class NationalAddressDetailsComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete = true;
  logo :string ="";
  printSection:string="";
  chargeAmt: any;
  taxAmt: any;
  nationalDetails:any={};

  constructor(private accService:AccountDetailsService) { this.logo = logoprint();}

  ngOnInit(): void {
    this.printSection="chequeBookDetailsPrintSection";
    this.getNationalAddressDetails();
  }
  getNationalAddressDetails(){
    this.isLoadingCompelete = false;
    let params={
      "id":"92167354",
      "productName":"CUSER",
      "subProductName":"UPNATAD",
      "functionCode":"UPNTFNC",
      "unitId":this.rootScopeData.userInfo.UNIT_ID
    }
    this.accService.getNationAddressDetails(params).subscribe((resp:any)=>{
      this.isLoadingCompelete = true;
      if(resp && resp.dataValue) {
        this.nationalDetails = resp.dataValue;
      }else{
        this.isLoadingCompelete = true;    
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
      }
    },error => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
      this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
    })
  }
}
