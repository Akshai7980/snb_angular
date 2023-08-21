import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  netPositionData:any;
  netData:any;
  isLoadingCompelete = true;
  netAssetData:any;
  netLiabilityData:any;
  isTimeOutForApiCall:any;
  loginDetails:any=[];
  equivalentCurrency:string="";
  totalaccounts = 0;
  assetPercent:any;
  liabilityPercent:any;
  separator:any='.'
  amountFormat:any="##,##,###.##"
  @Input() accountsData:any;
  @Input() loansData:any;

  rootScopeData: RootScopeDeclare = RootScopeData;
  netAssetCurrency: any;
  netLiablityCurrency: any;
  constructor(private dashboardService:DashboardService,private route:Router) { }

  ngOnInit(): void {
    this.equivalentCurrency=this.rootScopeData.equivalentCurrency;
    // this.getNetPositionData();  
    this.getseparators();
  }

  ngOnChanges(){
    this.isLoadingCompelete = false;
    if(this.accountsData || this.loansData){
        this.getTotalAccounts();
        this.getAssetsAndLiablities();
    }else if(!this.accountsData && !this.loansData){
        this.isLoadingCompelete = true;
    }
  }


  getseparators(){       
    this.amountFormat=this.rootScopeData.userInfo.mAmtFormat; 
    if(this.amountFormat)
    {
      if(this.amountFormat.lastIndexOf('.')>this.amountFormat.lastIndexOf(',')){
        this.separator='.'
      }else{
        this.separator=','
      }
    }
    
    
  }

  getTotalAccounts(){
    /*Deposits and cards counts to be added */
    this.isLoadingCompelete = true;
    let accountsCount = this.rootScopeData.userEntitlements.tabs.CASA_INQ && this.accountsData ? this.accountsData.accountsCount : 0;
    let loansCount = this.rootScopeData.userEntitlements.tabs.LOAN_INQ && this.loansData ? this.loansData.loansCount : 0;
    this.totalaccounts = accountsCount+loansCount;
  }
  getAssetsAndLiablities(){
    /* deposits to be added in Assets and Cards to be added in Liablities*/
    this.isLoadingCompelete = true;
    let accountAssets = this.rootScopeData.userEntitlements.tabs.CASA_INQ && this.accountsData ? this.accountsData.totalBalance : 0;
    let loanLiablities = this.rootScopeData.userEntitlements.tabs.LOAN_INQ && this.loansData ? this.loansData.totalBalance : 0;
    this.netAssetData = accountAssets;
    this.netAssetCurrency = this.netAssetData ? this.accountsData.currency:'';
    this.netLiabilityData = loanLiablities;
    this.netLiablityCurrency = this.netLiabilityData ? this.loansData.currency:'';    
    loanLiablities = parseFloat(loanLiablities);
    accountAssets = parseFloat(accountAssets);

    if(accountAssets <= 0) {
      this.assetPercent = 0;
    }else {
      this.assetPercent = (accountAssets)*100/(accountAssets+loanLiablities);
    }
  }

  // getNetPositionData(){
  //   this.isLoadingCompelete = false;
  //   this.dashboardService.getNetPositionApiCall().subscribe(
  //     response =>{
  //       this.isLoadingCompelete = true;
  //      this.netPositionData=response;
  //      this.netData=this.netPositionData.DATA.ALL_RECORDS[0].NET_POSITION;
  //      this.netAssetData=this.netPositionData.DATA.ALL_RECORDS[0].ASSET;
  //      this.netLiabilityData=this.netPositionData.DATA.ALL_RECORDS[0].LIABILTY;
  //      this.totalaccounts=this.netPositionData.DATA.ALL_RECORDS[0].TOTAL_ACCOUNTS;
  //      this.assetPercent=this.netPositionData.DATA.ALL_RECORDS[0].ASSET_PERCENT;
  //      this.liabilityPercent=this.netPositionData.DATA.ALL_RECORDS[0].LIABILTY_PERCENT;

  //      this.netData=this.netData.replace(/\,/g,''); 
  //      this.netData=parseInt(this.netData,10);

  //      this.netAssetData=this.netAssetData.replace(/\,/g,''); 
  //      this.netAssetData=parseInt(this.netAssetData,10);

  //      this.netLiabilityData=this.netLiabilityData.replace(/\,/g,''); 
  //      this.netLiabilityData=parseInt(this.netLiabilityData,10);
  //      this.isTimeOutForApiCall = false;
  //     },
  //     error =>{
  //       // to do error handling
  //       this.isLoadingCompelete = true;
  //       this.isTimeOutForApiCall = true;
  //     }
  //   )
  // }
}

