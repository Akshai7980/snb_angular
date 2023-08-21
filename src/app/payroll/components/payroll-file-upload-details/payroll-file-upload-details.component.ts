import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { environment } from 'src/environments/environment';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-payroll-file-upload-details',
  templateUrl: './payroll-file-upload-details.component.html',
  styleUrls: ['./payroll-file-upload-details.component.scss'],
})
export class PayrollFileUploadDetailsComponent implements OnInit {
  debitDataObj: any;
  showNext: boolean = true;
  isLoadingCompelete: boolean = true;
  @Output() getClickEmit = new EventEmitter<boolean>();
  @Output() getAuthEmit = new EventEmitter<any>();
  @Output() getOtpDetailsEmit = new EventEmitter<any>();
  @Input() uploadFileDetails: any;
  errorCode: string = '';
  url:string = ''
  authOptions: any;
  authDetails: any;
  dropDownArrow: boolean = false;
  showComMol: boolean = false;
  fileDetails: any;
  userOtpValue: any = '';
  otpError: string | undefined;
  secAuthRef: any;
  flexiAuthData: any;
  showAuthorization = false;
  showAuthentication = false;
  checkFlexiAuth: boolean = false;
  initReqParam={
    accNo:"",
    amt:"",
    pdroductCode:"",
    subPrdCode:"",
    cif:"",
    unitId:"",
    ccy:""
  }
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() otpErrorFromParent : any;
  authType: any;
  constructor(private payrollService: PayrollService) {}

  ngOnInit(): void {
    this.url = systemproperty.termsAndConditionsForPayrollUpload;
    if (
      this.uploadFileDetails?.fileType?.subPdtDesc === 'WPS Upload' &&
      this.uploadFileDetails.format === 'csv'
    ) {
      this.showComMol = true;
    }
    this.getAuthorizationData();
    this.fetchFileDetails();
  }

  getDatas(event: any, type: string) {
    switch (type) {
      case 'authorization':
        this.authDetails = event;
        this.getAuthorizationData();
        this.getAuthEmit.emit(this.authDetails);
        break;
    }
  }

  fetchFileDetails() {
    const params = {
      REFERENCE_NUM: this.uploadFileDetails?.proceedRes?.REFERENCE_NUM ? this.uploadFileDetails.proceedRes.REFERENCE_NUM : "",
      subProductName: this.uploadFileDetails?.fileType?.subPdtCode ? this.uploadFileDetails.fileType.subPdtCode : "",
      unitId: this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
    };
    this.payrollService.getFileDetails(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;

        if (res.data) {
          this.fileDetails = res.data;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  getAuthorizationData() {
    this.isLoadingCompelete = false;

    const params = {
      unitId:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.fromAccount.UNIT_ID
          : '',
      cif:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.fromAccount.CIF_NUM
          : '',
      productCode: 'PAYMNT',
      subProdCode: this.uploadFileDetails?.fileType?.subPdtCode,
      funcCode:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.fromAccount.FUNCTION_CODE
          : '',
      amount:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.fileDetails.odFileAmount
          : '',
      accNo:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.fromAccount.OD_PORTAL_ACC_NO
          : '',
      pymntCurrency:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.fromAccount.OD_CCY_CODE
          : '',
      debitCurrency:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.fromAccount.OD_CCY_CODE
          : '',
    };

      this.initReqParam.accNo=this.uploadFileDetails && this.uploadFileDetails.fromAccount && this.uploadFileDetails.fromAccount.OD_PORTAL_ACC_NO ? this.uploadFileDetails.fromAccount.OD_PORTAL_ACC_NO : "";
      this.initReqParam.amt=this.uploadFileDetails ? this.uploadFileDetails.fileDetails && this.uploadFileDetails.fileDetails.odFileAmount : "";
      this.initReqParam.pdroductCode="PAYMNT";
      this.initReqParam.subPrdCode=this.uploadFileDetails && this.uploadFileDetails?.fileType && this.uploadFileDetails.fileType.subPdtCode ? this.uploadFileDetails.fileType.subPdtCode : "";
      this.initReqParam.cif=this.uploadFileDetails && this.uploadFileDetails.fromAccount && this.uploadFileDetails.fromAccount.CIF_NUM ? this.uploadFileDetails.fromAccount.CIF_NUM : "";
      this.initReqParam.unitId=this.uploadFileDetails && this.uploadFileDetails.fromAccount && this.uploadFileDetails.fromAccount.UNIT_ID ? this.uploadFileDetails.fromAccount.UNIT_ID : "";
      this.initReqParam.ccy=this.uploadFileDetails && this.uploadFileDetails.fromAccount && this.uploadFileDetails.fromAccount.OD_CCY_CODE ? this.uploadFileDetails.fromAccount.OD_CCY_CODE : "";

    this.payrollService.getAuthData(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        this.flexiAuthData = res.data;
        if (res.data.selfAuth == "true") {
          this.showAuthentication = true;
        }
        if (res.data.flexiAuth == "true") {
          this.showAuthorization = true;
          this.checkFlexiAuth = true;
          this.authOptions = res.data.authList;
        }
        // if (res.data.authList) {
        //   this.authOptions = res.data.authList;
        // }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  toCancel() {
    this.showNext = false;
    this.getClickEmit.emit(this.showNext);
  }

  submit() {
    // if (!this.userOtpValue) {
    //   this.otpError = 'LBL_PLS_ENTER_OTP';
    //   return;
    // } else if (this.userOtpValue.length < 4) {
    //   this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
    //   return;
    // }

    if (this.showAuthentication ) {
      if (!this.userOtpValue || this.userOtpValue.length !== 4) {
        this.otpError = "LBL_PLS_ENTER_OTP";
        return;
      }
    }
    const data = {
      otpValue: this.userOtpValue,
      secAuthRef: this.secAuthRef,
      flexiAuth: this.flexiAuthData,
      AUTH_TYPE_O:this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    };
    this.getOtpDetailsEmit.emit(data);
    this.showNext = true;
    this.getClickEmit.emit(this.showNext);
    if(this.otpErrorFromParent){
      this.otpError = this.otpErrorFromParent;
    }
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      if (otpValue.length == 4) this.otpError = '';
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.submit()
    } else {
      this.userOtpValue = '';
    }
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
