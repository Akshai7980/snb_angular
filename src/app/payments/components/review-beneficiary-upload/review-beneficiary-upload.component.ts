import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { PaymentsServiceService } from '../../services/payments-service.service';

@Component({
  selector: 'app-review-beneficiary-upload',
  templateUrl: './review-beneficiary-upload.component.html',
  styleUrls: ['./review-beneficiary-upload.component.scss'],
})
export class ReviewBeneficiaryUploadComponent implements OnInit {
  authOptions: any;
  errorCode: string = '';
  authDataObj: any;
  otpError: string = '';
  userOtpValue: any;
  secAuthRef: any;
  fileDetailsData: any = '';
  submitbtn: boolean = false;
  cancelbtn: boolean = true;
  isLoadingCompelete: boolean = true;
  isLoadingCompeleteRecordSummary: boolean = true;
  fileUploadedDetails: any;
  moduleId: string = 'BENEUPTXNSUMY';
  isLoadingCompeleteScreen = true;
  subscriptions: Subscription[] = [];
  totalRecord: string = '';
  successfulRecord: string = '';
  rejectedRecord: string = '';
  sefAuthFlag: string = '';
  isSingleUser: boolean = false;
  isCorporateUser: boolean = false;
  authData = {
    param1: '',
    param2: '',
    authName: '',
    authNote: '',
    totalRecord: '',
    successfulRecord: '',
    rejectedRecord: '',
    submit: false,
    PARSED_RULE_ID: '',
    SELECTION_FLAG: '',
    sefAuthFlag: '',
    isSingleUser: false,
    AUTH_TYPE_O:''
  };
  recordSummaryObject: any = {};
  showRecSumm: boolean = false;
  sortOptions: any = {
    sortColumn: 'odRefNo',
    sortOrder: 'desc',
    fromRow: 0,
    toRow: 5,
  };
  rootScopeData: RootScopeDeclare = RootScopeData;
  showFiledetail: boolean = false;
  noRecordFoundInfoObj: any;
  uploadFailed: boolean = false;
  rejectReason: any;

  @Output() submitBtn = new EventEmitter();
  @Output() cancelBtn = new EventEmitter();

  @Input() uploadDetailsData: any;
  @Input() otpErrorFromParent: any;
  initReqParam = {
    accNo: '',
    amt: '0',
    pdroductCode: 'PAYMNT',
    subPrdCode: 'BENEUP',
    cif: '',
    unitId: '',
  };
  accNo: any;
  countServiceCalled: number = 0;
  showAuthorization: boolean = false;
  showAuthentication: boolean = false;
  authType: any;
  constructor(private paymentsService: PaymentsServiceService) { }

  ngOnInit() {
    if (
      this.rootScopeData.userInfo.isSingleUser === 'Y' ||
      this.rootScopeData.userInfo.isSingleUser === 'y'
    ) {
      this.isSingleUser = true;
    }
    if (
      this.rootScopeData.userInfo.isSoloCorporate === 'Y' ||
      this.rootScopeData.userInfo.isSoloCorporate === 'y'
    ) {
      this.isCorporateUser = true;
    }

    this.getFieldDetailsName();
    // this.getRecordSummaryData(this.sortOptions);
    this.fileUploadedDetails = {
      fileName: this.uploadDetailsData.fileName,
      fileActualName: this.uploadDetailsData.actualFileName,
      moduleId: 'FILEDLD',
    };
  }

  getDatas(event: any, filed: string) {
    switch (filed) {
      case 'authorization':
        this.authDataObj = event;
        break;
    }
  }

  getFieldDetailsName() {
    // debugger
    const params = {
      unitId: this.uploadDetailsData.unitId,
      refNo: this.uploadDetailsData.refNo,
    };
    this.isLoadingCompelete = false;
    let fileApiAutoFetch: any;
    const intervalLimit = Number(
      systemproperty.fetchFileDetailsPayrollPPPInterval
    );
    var dataFlag = true;
    this.paymentsService.getFieldDetails(params).subscribe(
      (res: any) => {
        // this.isLoadingCompelete = true;
        if (res) {
          // this.isLoadingCompelete = true;
          this.fileDetailsData = [res.data];
          this.showFiledetail = false;

          if (res.data.fileStatusCd === 'PNAUTH') {
            this.isLoadingCompelete = true;
            this.submitbtn = true;
            this.totalRecord = res.data.totalRecord;
            this.successfulRecord = res.data.successfulRecord;
            this.rejectedRecord = res.data.rejectedRecord;
            this.showFiledetail = true;
            this.uploadFailed = false;
            this.getRecordSummaryData(this.sortOptions);
            if (fileApiAutoFetch) {
              clearTimeout(fileApiAutoFetch);
            }
          } else if (res.data.fileStatusCd === 'CONFAL') {
            this.noRecordFoundInfoObj = {
              msg: 'LBL_CONVERSION_FAILED',
              btnLabel: 'Apply Now',
              btnLink: '/dashboard',
              showBtn: 'true',
              showMsg: 'true',
              showIcon: 'true',
            };

            this.showFiledetail = false;
            this.isLoadingCompelete = true;
            if (fileApiAutoFetch) {
              clearTimeout(fileApiAutoFetch);
            }
          } else if (
            res.data.fileStatusCd === 'VERFAL' ||
            res.data.fileStatusCd === 'REJCTD' ||
            res.data.fileStatusCd === 'FAILED'
          ) {
            // this.noRecordFoundInfoObj = {
            //   msg: 'LBL_VERIFICATION_FAILED',
            //   btnLabel: 'Apply Now',
            //   btnLink: '/dashboard',
            //   showBtn: 'true',
            //   showMsg: 'true',
            //   showIcon: 'true',
            // };
            // this.uploadFailed = true;
            this.totalRecord = res.data.totalRecord;
            this.successfulRecord = res.data.successfulRecord;
            this.rejectedRecord = res.data.rejectedRecord;
            this.showFiledetail = true;
            this.rejectReason = res.data?.rejectReason;

            // this.showFiledetail = false;
            this.isLoadingCompelete = true;
            this.getRecordSummaryData(this.sortOptions);
            if (fileApiAutoFetch) {
              clearTimeout(fileApiAutoFetch);
            }

            // }
            // else {
            //   if (fileApiAutoFetch) {
            //     clearTimeout(fileApiAutoFetch);
            //   }
            //   // this.isLoadingCompeleteMedium = true;
            // }

            // if(this.countServiceCalled <=5){
            //   this.countServiceCalled= this.countServiceCalled+1;
            //   this.getFieldDetailsName();
            // }
          } else if (JSON.stringify(res.data) === '{}') {
            this.noRecordFoundInfoObj = {
              msg: 'LBL_NO_FILE_DETAIL_FOUND',
              btnLabel: 'Apply Now',
              btnLink: '/dashboard',
              showBtn: 'true',
              showMsg: 'true',
              showIcon: 'true',
            };
            this.showFiledetail = false;
            this.showRecSumm = false;
            // this.isLoadingCompelete = true;
            if (dataFlag === true) {
              fileApiAutoFetch = setTimeout(() => {
                if (this.countServiceCalled <= 20) {
                  // this.isLoadingCompelete = true;
                  this.countServiceCalled = this.countServiceCalled + 1;
                  this.getFieldDetailsName();
                } else {
                  this.isLoadingCompelete = true;
                }
              }, intervalLimit);
            }
          } else {
            this.isLoadingCompelete = false;
            // this.getFieldDetailsName();

            this.submitbtn = false;
            this.showFiledetail = false;
            this.noRecordFoundInfoObj = {
              msg: 'LBL_NO_FILE_DETAIL_FOUND',
              btnLabel: 'Apply Now',
              btnLink: '/dashboard',
              showBtn: 'true',
              showMsg: 'true',
              showIcon: 'true',
            };
            if (dataFlag === true) {
              fileApiAutoFetch = setTimeout(() => {
                if (this.countServiceCalled <= 20) {
                  // this.isLoadingCompelete = true;
                  this.countServiceCalled = this.countServiceCalled + 1;
                  this.getFieldDetailsName();
                } else {
                  this.isLoadingCompelete = true;
                }
              }, intervalLimit);
            }

          }
        }
      },
      (error) => {
        this.noRecordFoundInfoObj = {
          msg: 'LBL_NO_FILE_DETAIL_FOUND',
          btnLabel: 'Apply Now',
          btnLink: '/dashboard',
          showBtn: 'true',
          showMsg: 'true',
          showIcon: 'true',
        };
        this.showFiledetail = false;
        this.showRecSumm = false;
        if (dataFlag === true) {
          fileApiAutoFetch = setTimeout(() => {
            if (this.countServiceCalled <= 20) {
              // this.isLoadingCompelete = true;
              this.countServiceCalled = this.countServiceCalled + 1;
              this.getFieldDetailsName();
            } else {
              this.isLoadingCompelete = true;
            }
          }, intervalLimit);
        }
        this.isLoadingCompelete = true;
      }
    );
  }

  getAuthorizationData() {
    const params = {
      unitId: this.uploadDetailsData.unitId,
    };
    this.isLoadingCompeleteScreen = false;
    this.paymentsService.getAuthorizationData(this.initReqParam).subscribe(
      (res: any) => {
        this.isLoadingCompeleteScreen = true;
        this.sefAuthFlag = res.data.selfAuth;
        if (res) {

          if (res.data.selfAuth == "true") {
            this.showAuthentication = true;
          }
          if (res.data.flexiAuth == "true") {
            this.showAuthorization = true;
            this.authOptions = res.data.authList;
          }
        }
      },
      (error) => {
        this.isLoadingCompeleteScreen = true;
      }
    );
  }

  onSecondFactorValue(authValue: any) {
    let authenticationValue = authValue;
    this.secAuthRef = authenticationValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.submitfn()
    } else {
      this.userOtpValue = '';
    }
  }
  cancelfn() {
    this.cancelBtn.emit(this.cancelbtn);
  }

  submitfn() {
    // debugger
    this.authData = {
      param2: this.secAuthRef,
      param1: this.userOtpValue,
      authName:
        this.authDataObj &&
          this.authDataObj.selectedAprover &&
          this.authDataObj.selectedAprover.AUTH_NAME
          ? this.authDataObj.selectedAprover.AUTH_NAME
          : 'LBL_NOT_PROVIDED',
      authNote:
        this.authDataObj &&
          this.authDataObj.selectedAprover &&
          this.authDataObj.aproveNote
          ? this.authDataObj.aproveNote
          : 'LBL_NOT_PROVIDED',
      submit: this.submitbtn,
      totalRecord: this.totalRecord,
      successfulRecord: this.successfulRecord,
      rejectedRecord: this.rejectedRecord,
      PARSED_RULE_ID:
        this.authDataObj && this.authDataObj.selectedAprover
          ? this.authDataObj.selectedAprover.PARSED_RULE_ID
          : '',
      SELECTION_FLAG:
        this.authDataObj && this.authDataObj.selectedAprover ? 'Y' : '',
      sefAuthFlag: this.sefAuthFlag,
      isSingleUser: this.isSingleUser,
      AUTH_TYPE_O : this.authType === 'OTP'?'O':this.authType === 'Token'? 'EH' : this.authType === 'sftToken' ? 'ES': ''
    };
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {

      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    this.submitBtn.emit(this.authData);
    if (this.otpErrorFromParent) {
      this.otpError = this.otpErrorFromParent;
    }
  }
  onSortColumn(event: any) {
    this.getRecordSummaryData(event);
  }

  getRecordSummaryData(data?: any) {
    const params = {
      sortColumn: data?.sortColumn,
      sortOrder: data?.sortOrder,
      fromRow: data?.fromRow,
      toRow: data?.toRow,
      unitId: this.uploadDetailsData.unitId,
      refNo: this.uploadDetailsData.refNo,
    };
    this.isLoadingCompeleteRecordSummary = false;

    this.paymentsService.getBeneficiaryLists(params).subscribe(
      (res: any) => {
        this.isLoadingCompeleteRecordSummary = true;
        this.accNo = res.data[0].accountNo;
        this.initReqParam.amt = '0';
        this.initReqParam.pdroductCode = 'PAYMNT';
        this.initReqParam.subPrdCode = 'BENEUP';
        this.initReqParam.cif = this.accNo;
        this.initReqParam.accNo = this.accNo;
        this.initReqParam.unitId =
          this.uploadDetailsData && this.uploadDetailsData.unitId
            ? this.uploadDetailsData.unitId
            : '';
        this.getAuthorizationData();
        if (res.data === null) {
          this.showRecSumm = true;
          this.recordSummaryObject = {
            data: [],
            displayDetails: [
              {
                displayLabel: 'LBL_TRANSACTION_ID',
                displayKey: 'odRefNo',
              },
              {
                displayLabel: 'LBL_ACC_NUMBER',
                displayKey: 'accountNo',
              },
              {
                displayLabel: 'LBL_NICK_NAME',
                displayKey: 'alliasName',
              },
              {
                displayLabel: 'LBL_BANK',
                displayKey: 'bankName',
              },
              {
                displayLabel: 'LBL_TYPE',
                displayKey: 'beneType',
              },
              {
                displayLabel: 'LBL_STATUS',
                displayKey: 'status',
              },
              {
                displayLabel: 'LBL_RJCT_RSN',
                displayKey: 'errorDesc',
              },
            ],
          };
        }

        if (res.data) {
          this.isLoadingCompeleteRecordSummary = true;
          this.showRecSumm = true;
          this.recordSummaryObject = {
            data: res.data,
            displayDetails: [
              {
                displayLabel: 'LBL_TRANSACTION_ID',
                displayKey: 'odRefNo',
              },
              {
                displayLabel: 'LBL_ACC_NUMBER',
                displayKey: 'accountNo',
              },
              {
                displayLabel: 'LBL_NICK_NAME',
                displayKey: 'alliasName',
              },
              {
                displayLabel: 'LBL_BANK',
                displayKey: 'bankName',
              },
              {
                displayLabel: 'LBL_TYPE',
                displayKey: 'beneType',
              },
              {
                displayLabel: 'LBL_STATUS',
                displayKey: 'status',
              },
              {
                displayLabel: 'LBL_RJCT_RSN',
                displayKey: 'errorDesc',
              },
            ],
          };
        }
      },
      (error: any) => {
        this.isLoadingCompeleteRecordSummary = true;
        this.showRecSumm = true;
      }
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  getAuthType(val: any) {
    this.authType = val
  }
}
