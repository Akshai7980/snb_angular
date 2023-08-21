import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationManagementService } from 'src/app/configuration-management/services/configuration-management.service';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-instant-transfer-registration-details',
  templateUrl: './instant-transfer-registration-details.component.html',
  styleUrls: ['./instant-transfer-registration-details.component.scss']
})
export class InstantTransferRegistrationDetailsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  details: any;
  isLoadingCompelete = true;
  displayedColumns= ['accNumber', 'nickName', 'fullName', 'status', 'balance'];
  refNum: any;
  fromDataObj=[{
   accNum:'',
   fullname:'',
   nickName:'',
   status:'',
   balance:'',
   ccyCode:''
  }]

  constructor(private commonService:CommonService, private configManagement: ConfigurationManagementService,private translateService: TranslateService) {}

  ngOnInit(): void {
    if(this.rootScopeData.pendingActivitiesInstantTransferSummaryObject){
      this.refNum = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.REF_NO;
    }
    this.getAccBalanceAndStatus();
  }

  getAccBalanceAndStatus(){
    this.isLoadingCompelete = false;
    this.configManagement.fetchAccounts().subscribe((res: any) => {
    this.isLoadingCompelete = true;
      if (res.DATA){
        for(let i=0;i<res.DATA.ALL_RECORDS.length;i++){
          if(this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO === res.DATA.ALL_RECORDS[i].OD_ACC_NO){
            let crntAvail_amount = res.DATA.ALL_RECORDS[i].CURR_AVAIL_BAL_AMT;
            let convtd_ccy = res.DATA.ALL_RECORDS[i].OD_CCY_CODE;
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            let convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            Object.assign(this.rootScopeData.dataFromContextMenu,{"HIDDEN":this.translateService.instant('LBL_HIDDEN')})
            this.fromDataObj[0].accNum = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ACC_NO;
            this.fromDataObj[0].fullname = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.OD_ACC_NAME;
            this.fromDataObj[0].nickName = this.rootScopeData.pendingActivitiesInstantTransferSummaryObject.ALIAS_NAME;
            this.fromDataObj[0].status = res.DATA.ALL_RECORDS[i].STATUS;
            this.fromDataObj[0].balance = this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":convtd_amount;
            this.fromDataObj[0].ccyCode = res.DATA.ALL_RECORDS[i].OD_CCY_CODE;
          }
        }
      }
       
    });
  }

}
