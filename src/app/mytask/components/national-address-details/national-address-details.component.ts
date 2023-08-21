import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { SettingsService } from 'src/app/settings/services/settings.service';
@Component({
  selector: 'app-national-address-details',
  templateUrl: './national-address-details.component.html',
  styleUrls: ['./national-address-details.component.scss']
})
export class NationalAddressDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  nationalDetails = RootScopeData.nationAddressDetails;
  natAddressDet : any;
  workFlowHistoryParams: any;
  constructor(private location: Location, private settingService : SettingsService) { 
  }

  ngOnInit(): void {
    // console.log('nationalDetails', this.nationalDetails);
    if(this.nationalDetails.subProductCode == 'UPNATAD'){
      this.getNatAddDet();
    }
    this.workFlowHistoryParams={
      refNum: this.nationalDetails.refNo,
      productCode: this.nationalDetails.productCode,
      subProductCode: this.nationalDetails.subProductCode,
      functionCode: this.nationalDetails.functionCode,
    }
  }
  back(): void {
    this.location.back();
  }

  getNatAddDet(){
    let param  = {
      cifId  : this.nationalDetails && this.nationalDetails.cifNo ?  this.nationalDetails.cifNo : '',
      unitId : this.rootScopeData && this.rootScopeData.userInfo &&  this.rootScopeData.userInfo.unitID ? this.rootScopeData.userInfo.unitID : ''
    }
    this.settingService.getNationalAddressDetails(param).subscribe((res : any) => {
      if(res && res.dataValue){
      this.natAddressDet = res.dataValue;
      }
    });
  }

}
