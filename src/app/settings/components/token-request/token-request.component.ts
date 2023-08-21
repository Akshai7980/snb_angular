import { Component, OnInit } from '@angular/core';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../services/settings.service';
@Component({
  selector: 'app-token-request',
  templateUrl: './token-request.component.html',
  styleUrls: ['./token-request.component.scss']
})
export class TokenRequestComponent implements OnInit {
  debitDataObj:any;
  DebitClearFlag:boolean = false;
  searchShownFlag:boolean = true;
  selectedDebitObj:any;
  isLoadingCompelete: boolean = false;
  debitData: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  fromAccountDetails: any = [];
  showFeeDetails:boolean = false;
  feeDetailsObj:any;
  totalFee: any;
  showAuthentication:boolean = false;
  initReqParam = {
    accNo: "",
    amt: "",
    pdroductCode: "",
    subPrdCode: "",
    cif: "",
    unitId: "",
    ccy: ""
  }
  otpError: string = '';
  secAuthRef: any;
  userOtpValue: any;
  showReceipt:boolean = false;
  receiptData: any;
  url:string='';
  constructor(private translateService: TranslateService, private settingService: SettingsService) { }

  ngOnInit(): void {
    this.isLoadingCompelete = true;
    this.getDebitData();
  }
  getDebitData() {
    this.isLoadingCompelete = false;
    // this.rootScopeData.changeHeading = "";
    this.settingService.tokenRequestApi().subscribe((debData: any) => {
      if (debData) {
        this.isLoadingCompelete = true;
        this.debitData = debData.DATA.ALL_RECORDS;
        //
        for (let i in this.debitData) {
          let crntAvail_amount = this.debitData[i].CURR_AVAIL_BAL_AMOUNT_NEW;
          let convtd_ccy = this.debitData[i].OD_CCY_CODE;
          let convtd_amount = '';
          if (crntAvail_amount && convtd_ccy) {
            let currencyFormatPipeFilter = new CurrencyFormatPipe();
            convtd_amount = currencyFormatPipeFilter.transform(crntAvail_amount.trim(), convtd_ccy);
            this.debitData[i].CURR_AVAIL_BAL_AMOUNT_NEW = convtd_amount;
            this.debitData[i].HIDDEN = this.translateService.instant('LBL_HIDDEN');
          }
        }
        this.debitDataObj = {
          "title": "LBL_SELECT_ACC",
          "accdetails":"LBL_ACCOUNT_DETAILS",
          "data": this.debitData,
          "fieldDetails": [
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_NICKNAME",
              "dataKey": "ALIAS_NAME"
            },
            {
              "dispKey": "LBL_FULL_NAME",
              "dataKey": "OD_ACC_NAME"
            },
            {
              "dispKey": "LBL_STATUS",
              "dataKey": "STATUS"
            },
            {
              "dispKey": "LBL_BALANCE",
              "dataKey": this.rootScopeData.userInfo.maskingFlag ? "HIDDEN":"CURR_AVAIL_BAL_AMOUNT_NEW",
              "dataKeySupport": "OD_CCY_CODE"
            }
          ]
        };

      }
    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  afterFromAccountSelection(event:any){ 
    if (event == 'iconClick') {
      this.debitDataObj = "";
      this.getDebitData();
      this.showFeeDetails = false 
      
    } else {
      this.fromAccountDetails[0] = event;
      this.feeDetails();
    }    

  }
  feeDetails(){
    this.isLoadingCompelete = false;
    this.settingService.feeDetails().subscribe((res:any)=>{
      this.isLoadingCompelete = true
      if (res && res.data && res.data.length>0 && res.data[0].chargeInfo) {
        this.showFeeDetails = true
        this.feeDetailsObj = res.data[0].chargeInfo[0]
        this.totalFee = Number(this.feeDetailsObj.tax )+ Number(this.feeDetailsObj.vat);
      }
    }, error => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;

    })
  }
  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = "";
      this.userOtpValue = otpValue;
      this.onClickFinalSubmit();
    } else {
      this.userOtpValue = "";
    }
  }
  onClickCancel(){
    this.showFeeDetails =false;
    this.showAuthentication = false;
    this.debitDataObj = "";
    this.getDebitData();
  }
  onClickSubmit(){
    this.showAuthentication = true;
  }
  onClickFinalSubmit(){
    let isOtpValid = true;
    if (this.showAuthentication) {
      if (!this.userOtpValue || this.userOtpValue.length !== 4) {
        this.otpError = "LBL_PLS_ENTER_OTP";
        isOtpValid = false;
        return;
      }
    }
    if (isOtpValid) {
      this.isLoadingCompelete = false;
      let param;
      this.showAuthentication = false;
      this.settingService.submiNationalApi(this.initReqParam).subscribe((response: any) => {
        this.isLoadingCompelete = true;
        if (response) {
          if (response.dataValue && response.dataValue.OD_STATUS_DESC === "Failed") {
            this.otpError = "LBL_PLEASE_ENTER_VALID_OTP";
          } else {
            this.showAuthentication = false;
            this.rootScopeData.changeHeading = "";
            let refNo = response.dataValue && response.dataValue.INPUT_REFERENCE_NO ? response.dataValue.INPUT_REFERENCE_NO : "";
            this.constructReceiptData(refNo);
            this.showReceipt = true;
          }
        } else {
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
  constructReceiptData(refNo:any){
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    Object.assign(this.fromAccountDetails[0], { USER_ID: userId })
    this.receiptData = {
      "msg1": "LBL_REQUEST_SUCCSFL",
      "msg2": "LBL_SOFT_TOKEN_SUCCESS_MSG",
      "referenceNumber": refNo,
      "receiptDetails": [
        {
          "title": "LBL_TOKEN_DETAILS",
          "isTable": "true",
          "data": this.fromAccountDetails,
          "fieldDetails": [
            {
              "dispKey": "LBL_ACTION_BY",
              "dataKey": "USER_ID"
            },
            {
              "dispKey": "LBL_ACC_NUMBER",
              "dataKey": "OD_ACC_NO"
            },
            {
              "dispKey": "LBL_NICK_NAME",
              "dataKey": "ALIAS_NAME"
            }
          ]
        },
        {
          "title": "LBL_TOKEN_DETAILS",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_FEE",
              "dataKey":  this.feeDetailsObj ? this.feeDetailsObj.tax+" " +this.feeDetailsObj.ccy:""
            },
            {
              "dispKey": "LBL_VAT",
              "dataKey": this.feeDetailsObj ? this.feeDetailsObj.vat+" " +this.feeDetailsObj.ccy:""
            },
            {
              "dispKey": "LBL_TOTAL_FEES",
              "dataKey":  this.totalFee ?this.totalFee + " " + this.feeDetailsObj.ccy:""
            }
          ]
        },
        {
          "title": "LBL_TOKEN_DETAILS",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_SERIAL_NUMBER",
              "dataKey": "65341- 67459"
            },
            {
              "dispKey": "LBL_ACTIVATION_CODE",
              "dataKey":"2132-6745-9867-1212"
            }
          ]
        },
        {
          "title":"LBL_TOKEN_REQ_NOTE"
        }
      ],
      "printButton": {
        "buttonLabel": "LBL_PRINT_RECEIPT",
        "buttonIcon": "./assets/images/PrinterIcon.png"
      },
      "saveButton": {
        "buttonLabel": "LBL_SAVE_RECEIPT",
        "buttonIcon": "./assets/images/saveReceipt.svg"
      },
      "finishButton": {
        "buttonLabel": "LBL_FINISH",
        "buttonPath": "/dashboard"
      }
    };
  }
}
