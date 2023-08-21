import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { EpayServiceService } from '../../services/epay-service.service';

@Component({
  selector: 'app-multi-claim-merchant-details',
  templateUrl: './multi-claim-merchant-details.component.html',
  styleUrls: ['./multi-claim-merchant-details.component.scss'],
})
export class MultiClaimMerchantDetailsComponent implements OnInit {
  accountListObj: any;
  merchantListObj: any;

  selectedAccountListObj: any;
  selectedMerchantListObj: any;

  isLoadingComplete: boolean = true;

  accountList: any = [];
  merchantList: any = [];

  selectedAccount: any;
  selectedMerchant: any;

  rootScopeData: RootScopeDeclare = RootScopeData;

  @Output() merchantDetailsEmit: EventEmitter<any> = new EventEmitter();

  constructor(private ePayService: EpayServiceService) {}

  ngOnInit(): void {
    this.getMultiClaimAccountList();
  }

  getMultiClaimAccountList() {
    this.isLoadingComplete = false;
    this.ePayService.getMultiClaimAccountList().subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        const currencyPipe = new CurrencyFormatPipe();
        if (res.DATA?.ALL_RECORDS && res.DATA?.ALL_RECORDS.length > 0) {
          this.accountList = res.DATA?.ALL_RECORDS.map((val: any) => {
            return {
              formattedBalance:
                val.CURR_AVAIL_BAL_AMT && val.OD_CCY_CODE
                  ? currencyPipe.transform(
                      val.CURR_AVAIL_BAL_AMT,
                      val.OD_CCY_CODE
                    )
                  : '',
              ...val,
            };
          });
        }
        this.constructAccountList(this.accountList);
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  constructAccountList(data: any, type?: string) {
    const obj = {
      title: 'LBL_ACCOUNT',
      data,
      fieldDetails: [
        {
          dispKey: 'LBL_ACC_NUMBER',
          dataKey: 'OD_ACC_NO',
        },
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'ALIAS_NAME',
        },
        {
          dispKey: 'LBL_FULL_NAME',
          dataKey: 'OD_ACC_NAME',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'STATUS',
        },
        {
          dispKey: 'LBL_BALANCE',
          dataKey: 'formattedBalance',
          dataKeySupport: 'OD_CCY_CODE',
        },
      ],
    };
    if (type === 'selected') {
      this.selectedAccountListObj = obj;
    } else {
      this.accountListObj = obj;
    }
  }

  getSelectedAccount(type: string) {
    if (type === 'iconClick') {
      this.accountListObj = null;
      this.selectedAccount = null;
      this.getMultiClaimAccountList();
      this.merchantListObj = null;
      this.selectedMerchant = null;
      this.emitData();
    } else {
      this.selectedAccount = type;
      this.getMerchantList();
      this.emitData();
    }
  }

  getMerchantList() {
    this.isLoadingComplete = false;
    const params = {
      moduleId: 'EPYSRCH',
      productName: 'CORESVS',
      subProductName: 'EPYMCD',
      functionCode: 'EPYMCDFNC',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      accNo: this.selectedAccount.OD_ACC_NO,
    };
    this.ePayService.getEPayMerchantList(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res.data?.merchants && res.data?.merchants.length > 0) {
          this.merchantList = res.data?.merchants;
        }
        this.constructMerchantList(this.merchantList);
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  constructMerchantList(data: any, type?: string) {
    const obj = {
      title: type === 'selected' ? '' : 'LBL_SELECT_MERCHANT',
      data,
      fieldDetails: [
        {
          dispKey: 'LBL_MERCHANT_NAME',
          dataKey: 'merchantEnglishName',
        },
        {
          dispKey: 'LBL_MERCHANT_ID',
          dataKey: 'merchantAccountNumber',
        },
      ],
    };
    if (type === 'selected') {
      this.selectedMerchantListObj = obj;
    } else {
      this.merchantListObj = obj;
    }
  }

  getSelectedMerchant(type: string) {
    if (type !== 'iconClick') {
      this.selectedMerchant = type;
      this.constructMerchantList([this.selectedMerchant], 'selected');
      this.constructAccountList([this.selectedAccount], 'selected');
      this.emitData();
    }
  }

  onClickSelectedAccount(type: string) {
    if (type === 'iconClick') {
      this.constructAccountList(this.accountList);
      this.selectedAccount = null;
      this.merchantListObj = null;
      this.selectedMerchant = null;
      this.emitData();
    }
  }

  onClickSelectedMerchant(type: string) {
    if (type === 'iconClick') {
      this.constructAccountList([this.selectedAccount]);
      this.constructMerchantList(this.merchantList);
      this.selectedMerchant = null;
      this.emitData();
    }
  }

  emitData() {
    const data = {
      selectedAccount: this.selectedAccount,
      selectedMerchant: this.selectedMerchant
    };
    this.merchantDetailsEmit.emit(data);
  }

  toCancel() {
    this.getSelectedAccount('iconClick');
  }
}
