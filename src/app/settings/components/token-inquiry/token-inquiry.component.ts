import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
@Component({
  selector: 'app-token-inquiry',
  templateUrl: './token-inquiry.component.html',
  styleUrls: ['./token-inquiry.component.scss']
})
export class TokenInquiryComponent implements OnInit {
  isLoadingCompelete: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  token: any;
  showSoftToken: boolean = false;
  dataSourceToPass: any;
  dataSource: any;
  dataSourceLength: any;
  regcode: any;
  review: Boolean = false;
  secAuthRef: any;
  otpError: string = '';
  userOtpValue: any;
  initReqParam = {
    accNo: "",
    amt: "",
    pdroductCode: "",
    subPrdCode: "",
    cif: "",
    unitId: "",
    ccy: ""
  }
  showAuthentication: boolean = true;
  showReceipt: boolean = false;
  url:string='';
  receiptData: any;
  regCodeErr:any;
  displayedColumns: string[] = ['accNumber', 'fullName', 'serialNumber', 'activationCode', 'activeToken'];
  constructor(private settingService: SettingsService,private router:Router) { }

  ngOnInit(): void {
    this.tokenInquiry()
  }
  tokenInquiry() {
    this.isLoadingCompelete = false
    this.settingService.tokenInquiryApi().subscribe((response: any) => {
      this.isLoadingCompelete = true
      if (response && response.data && response.data.tokenDetails.length > 0) {
        this.token = response.data.tokenDetails[0]
        this.dataSourceToPass = [this.token];
        this.dataSource = this.dataSourceToPass;
        this.dataSourceLength = this.dataSourceToPass.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource);
      }
    }, error => {
      this.isLoadingCompelete = true;
      this.rootScopeData.showSystemError = true;
    })
    this.dataSource = new MatTableDataSource([]);
  }
  activeSoftToken() {
    this.showSoftToken = true;
  }
  onClickCancel() {
    this.showSoftToken = false;
    this.review = false;
    this.regcode = "";
  }
  onClickSubmit() {
    this.regCodeErr=!this.regcode?"LBL_REGISTRATION_CODE_ERR":""
    if(!this.regCodeErr){
      this.review = true;
    }

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
  onClickFinalSubmit() {
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
    let showCallBackComponentFlag = this.rootScopeData.callBackOTPEntitlement.beneRegistrationCallBack === 'Y' ? true:false;
    this.receiptData = {
      "msg1": "LBL_REQUEST_SUCCSFL",
      "msg2": "LBL_TOKEN_SUCCESS_MSG",
      "showCallBackComponent":showCallBackComponentFlag,
      "referenceNumber": refNo,
      "receiptDetails": [
        {
          "title": "LBL_TOKEN_DETAILS",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_SERIAL_NUMBER",
              "dataKey": this.token.serialNumber
            },
            {
              "dispKey": "LBL_ACTIVATION_CODE",
              "dataKey": this.token.activationCode
            },
            {
              "dispKey": "LBL_REGISTRATION_CODE",
              "dataKey": this.regcode
            }
          ]
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
  validate(event:any){
      this.regCodeErr=event.target.value.trim()===''?"LBL_REGISTRATION_CODE_ERR":""
  }

  getCancelBtnClick(){
    this.showReceipt = false;
    this.showSoftToken = false;
    this.review = false;
    this.regcode = "";
  }
}
