import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountDetailsService } from '../../services/account-details.service';
import { Subscription } from 'rxjs';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-additional-account-form',
  templateUrl: './additional-account-form.component.html',
  styleUrls: ['./additional-account-form.component.scss'],
})
export class AdditionalAccountFormComponent implements OnInit {
  submitted: boolean = false;
  currency: any;
  currencyList: any;
  reason: any;
  reasonList: any;
  account: any = '';
  accountList: any;
  isLoadingCompelete: boolean = true;
  subscriptions: Subscription[] = [];
  rootScopeData: RootScopeDeclare = RootScopeData;
  cif_no: any;
  @Output() accountEmitData = new EventEmitter<any>();
  showProceed: boolean = false;
  showEligibleAccountError: boolean = false;
  countryCode : any = '';
  showNationalIdError :boolean = false;
  showNationalIDValidationMsg :string='';
  localCurrencyList : any =[];
  localAccountList : any =[];
linkAccModal : any;
  constructor(public accountService: AccountDetailsService) {}

  ngOnInit(): void {
    this.getcurrencyName();
    this.getReason();
    this.getAccount();
  }

  getcurrencyName() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.isLoadingCompelete = false;
    const curName = this.accountService.getCurrency(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data[0].currencyDetails) {
          this.isLoadingCompelete = true;

          this.currencyList = this.localCurrencyList = res.data[0].currencyDetails;
        } else {
          this.isLoadingCompelete = false;
        }
      },
      (error) => {
        this.isLoadingCompelete = false;
      }
    );
    this.subscriptions.push(curName);
  }

  getReason() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.isLoadingCompelete = false;

    const reason = this.accountService.getReason(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        if (res.data[0].reasonDetails) {
          this.isLoadingCompelete = true;

          this.reasonList = this.localReasonList = res.data[0].reasonDetails;
        } else {
          this.isLoadingCompelete = false;
        }
      },
      (error) => {
        this.isLoadingCompelete = false;
      }
    );
    this.subscriptions.push(reason);
  }

  getAccount() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.isLoadingCompelete = false;
    const account = this.accountService.getAccount(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.DATA.ALL_RECORDS) {
          this.accountList =  this.localAccountList = res.DATA.ALL_RECORDS;
        } 
      },
      (error) => {
        this.isLoadingCompelete = true;
      }
    );
    this.subscriptions.push(account);
  }

  onCancel() {
    this.currency = '';
    this.reason = '';
    this.account = '';
    this.showEligibleAccountError = false;
    this.showNationalIdError = false;
  }
  onSelectedAccount(event: any, type: any) {
    if (event) {
      this.cif_no = type.COD_CORECIF;
      this.countryCode = type.REQ_COUNTRY_CODE;
      let params = {
        coreCif: type.COD_CORECIF
      }
      this.isLoadingCompelete = false;
      this.accountService.getCorporateAccountDetails(params).subscribe((res:any)=>{
        this.isLoadingCompelete = true;

        if(res.dataValue.validateAddAccount === "SUCCESS"){
          this.showProceed = true;
          this.showEligibleAccountError = false;
        }else if(res.dataValue.validateAddAccount === "FAILURE"){
          this.showProceed = false;
          this.showEligibleAccountError = true;
        }else {
          this.showProceed = true;
          this.showEligibleAccountError = false;
        }
      },
      (error) => {
        this.isLoadingCompelete = true;
      })
      this.account = type;
      this.linkAccModal = type.OD_ACC_NO;
    }
  }

  onProceedNext() {
      this.isLoadingCompelete = false;
      let param = {
        currency : this.currency.currencyId,
        country : this.countryCode,
        cif : this.cif_no,
        reasonCode : this.reason.reasonId,
        productType : this.currency.productType
      }
      this.accountService.ValidateAdditionalAccount(param).subscribe((res : any) => {
        this.isLoadingCompelete = true;
        if(res && res.dataValue && res.dataValue.res_ErrorCode && 
          res.dataValue.res_ErrorCode.toLowerCase() === '00000'){
            this.submitted = true;
            this.showNationalIdError = false;
            const data = {
              currency: this.currency.currencyId,
              reason: this.reason.reason,
              account: this.account,
              canProceed: this.submitted,
              CIF_NUM: this.cif_no,
              currency_DESC : this.currency.currencyName,
              reasonId : this.reason.reasonId
            };
            this.accountEmitData.emit(data);
        }
        else if(res && res.dataValue && res.dataValue.res_ErrorCode && 
          res.dataValue.res_ErrorCode.toLowerCase() !== '00000'){
            this.showNationalIdError = true;
            this.showNationalIDValidationMsg = res.dataValue.res_ErrorMessage;
          //   this.rootScopeData.showSystemError = true;
          //  this.rootScopeData.toastMessage = "LBL_REQ_CANT_PROCEED_CONTACT_ASST";
          }
      },
      error => {
        this.isLoadingCompelete = true;
      });
    
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  searchCountry(event: any) {
    const searchValue: string = event?.target?.value;
    this.currencyList = this.localCurrencyList;
    this.currencyList = this.currencyList.filter((res: any) =>
      (res?.currencyName as string)?.toLowerCase().includes(searchValue?.toLowerCase()))
  }
  currencyModal : any;
  resetCountryInput(event: any) {
    const blurredValue: string = event?.target?.value;
    const countryFound = this.currencyList.filter((res: any) =>
      (res?.currencyName as string)?.toLowerCase() === blurredValue?.toLowerCase());
    if (countryFound?.length > 0) {
      this.currencyModal = countryFound[0].currencyName;
      // this.setCurrency();
    } else {
      this.currency = "";
      this.currencyModal = '';
      // this.setCurrency();
    }
  }
  setCurrency(value : any){
    this.currency = value;
    this.currencyModal = value.currencyName;
  }

  localReasonList : any =[];
  reasonModal : any;
  searchReaon(event : any){
    const searchValue: string = event?.target?.value;
    this.reasonList = this.localReasonList;
    this.reasonList = this.reasonList.filter((eachCountry: any) =>
      (eachCountry?.reason as string)?.toLowerCase().includes(searchValue?.toLowerCase()))
  }

  resetReasonInput(event : any){
    const blurredValue: string = event?.target?.value;
    const reasonFound = this.reasonList.filter((res: any) =>
      (res?.reason as string)?.toLowerCase() === blurredValue?.toLowerCase());
    if (reasonFound?.length > 0) {
      this.reasonModal = reasonFound[0].reason;
      // this.setCurrency();
    } else {
      this.reason = "";
      this.reasonModal = '';
      // this.setCurrency();
    }
  }
  setReason(value : any)
{
  this.reason = value;
  this.reasonModal = value.reason;
}


searchLink(event : any) {
  const searchValue: string = event?.target?.value;
  this.accountList = this.localAccountList;
  this.accountList = this.accountList.filter((res: any) =>
    (res?.OD_ACC_NO as string)?.toLowerCase().includes(searchValue?.toLowerCase()))
}


resetLinkInput(event :any){
  const blurredValue: string = event?.target?.value;
  const accFound = this.accountList.filter((res: any) =>
    (res?.OD_ACC_NO as string)?.toLowerCase() === blurredValue?.toLowerCase());
  if (accFound?.length > 0) {
    this.linkAccModal = accFound[0].OD_ACC_NO;
    // this.setCurrency();
  } else {
    this.account = "";
    this.linkAccModal = '';
    // this.setCurrency();
  }
}

// setAccountLink(value :any){
//   this.account = value;
//   this.linkAccModal = value.OD_ACC_NO;
// }


}
