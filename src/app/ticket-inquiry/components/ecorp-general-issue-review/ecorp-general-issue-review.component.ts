import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TicketServiceService } from '../../services/ticket-service.service';

@Component({
  selector: 'app-ecorp-general-issue-review',
  templateUrl: './ecorp-general-issue-review.component.html',
  styleUrls: ['./ecorp-general-issue-review.component.scss'],
})
export class EcorpGeneralIssueReviewComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  fromDataDetailsObj: any = {};
  clearFlag: boolean = false;
  setColumnWidth: boolean = true;
  fileUploadedDetails: any = {};

  ecorpGeneralBrowseDetails: any;
  showReceipt: boolean = false;
  receiptData: any;
  isSelfAuth: boolean = false;
  secAuthRef: string = '';
  otpError: string = '';
  userOtpValue: any;
  hideInitiateButton: boolean = true;
  authType: any;
  format: boolean = false;
  submitData: any;
  isLoadingComplete: boolean = true;
  cancelbtn: boolean = true;
  @Input() ecropGeneralDetails: any;
  @Output() hideDebitLookup = new EventEmitter<boolean>();
  @Output() cancelBtn = new EventEmitter<boolean>();
  constructor(private readonly ticketService: TicketServiceService) {}

  ngOnInit(): void {
    console.log(this.ecropGeneralDetails)
    this.onUploadDownload();
  }

  onUploadDownload() {
    this.fileUploadedDetails = {
      fileName: this.ecropGeneralDetails.uploadData?.title
        ? this.ecropGeneralDetails.uploadData?.title
        : 'Not Provided',
      fileActualName: this.ecropGeneralDetails.uploadData?.fileActualName
        ? this.ecropGeneralDetails.uploadData?.fileActualName
        : 'Not Provided',
      moduleId: 'GENERALCOMPLIENTREQUEST',
    };
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_REQUEST_SUCCSFL',
      msg2: 'LBL_YOUR_ECORP_GENERAL_ISSUE_HAS_BEEN_RAISED',
      referenceNumber: refNumber ? refNumber : '--',

      receiptDetails: [
        {
          title: 'LBL_FROM',
          isTable: 'false',
          data: this.ecropGeneralDetails.ecropAccDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_ACTION_BY',
              dataKey: this.rootScopeData.userInfo.loginID
                ? this.rootScopeData.userInfo.loginID
                : '--',
            },
            {
              dispKey: 'LBL_Account_Number',
              dataKey: this.ecropGeneralDetails.ecropAccDetails.OD_ACC_NO
                ? this.ecropGeneralDetails.ecropAccDetails.OD_ACC_NO
                : '--',
            },
            {
              dispKey: 'LBL_NICK_NAME',
              dataKey: this.ecropGeneralDetails.ecropAccDetails.ALIAS_NAME
                ? this.ecropGeneralDetails.ecropAccDetails.ALIAS_NAME
                : '--',
            },
          ],
        },
        {
          title: 'LBL_ISSUE_DETAILS',
          isTable: 'false',
          data: this.ecropGeneralDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_MOBILE_NUMBER',
              dataKey: this.ecropGeneralDetails.mobile
                ? this.ecropGeneralDetails.mobile
                : '--',
            },
            {
              dispKey: 'LBL_DESCRIPTION',
              dataKey: this.ecropGeneralDetails.describtionDetails
                ? this.ecropGeneralDetails.describtionDetails
                : 'Not Provided',
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_GENERATE_ANOTHER_STATEMENT',
      },

      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
  }

  setSecondFactorValue(secondFactorValue: any): void {
    this.secAuthRef = secondFactorValue.data.secfRefNo;
  }
  getOtpValue(otpValue: any) {
    if (otpValue) {
      this.otpError = '';
      this.userOtpValue = otpValue;
      this.submit();
    } else {
      this.userOtpValue = '';
    }
  }

  submit() {
    if (!this.userOtpValue) {
      this.otpError = 'LBL_PLS_ENTER_OTP';
      return;
    } else if (this.userOtpValue.length < 4) {
      this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
      return;
    }
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      param1: this.userOtpValue,
      param2: this.secAuthRef,
      accNo: this.ecropGeneralDetails.ecropAccDetails.OD_ACC_NO,
      COD_CORECIF: this.ecropGeneralDetails.ecropAccDetails.COD_CORECIF,
      mobileNo: this.ecropGeneralDetails.mobile,
      description: this.ecropGeneralDetails.describtionDetails,
      fileName: this.ecropGeneralDetails
        ? this.ecropGeneralDetails.uploadData.fileActualName
        : '',
      fileExt: this.ecropGeneralDetails
        ? this.ecropGeneralDetails.uploadData.format
        : '',
      fileData: this.ecropGeneralDetails
        ? this.ecropGeneralDetails.converterFormat
        : '',
    };
    this.ticketService.submitApi(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        this.submitData = res.dataValue;

        if (this.submitData.STATUS === 'SUCCESS') {
          this.showReceipt = true;
          this.hideDebitLookup.emit(this.showReceipt);

          this.constructReceiptData(this.submitData.INPUT_REFERENCE_NO);
        }
      },
      (error) => {
        this.isLoadingComplete = false;
      }
    );
  }
  cancel() {
    this.cancelBtn.emit(this.cancelbtn);
  }
  getAuthType(val: any) {
    this.authType = val;
  }
}
