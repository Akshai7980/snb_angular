import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PayrollService } from '../../services/payroll.service';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-payroll-file-upload',
  templateUrl: './payroll-file-upload.component.html',
  styleUrls: ['./payroll-file-upload.component.scss'],
})
export class PayrollFileUploadComponent implements OnInit, OnDestroy {
  showUploadDetails: boolean = false;
  showUploadAuth: boolean = false;
  uploadFileDetails: any = {};
  authDataObj: any;
  receiptData: any;
  showReceipt: boolean = false;
  fromData: any = [];
  uploadDetails: any;
  fileDetails: any = [];
  makerDate: string = '';
  otpData: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingCompelete: Boolean = true;
  subscriptions: Subscription[] = [];
  otpError: string = '';
  valueDate: string = '';
  pdfData: any;
  refNum: any;
  templateName: string = '';
  saveReceiptObject: any;
  getValueDate: any;
  constructor(
    private payrollService: PayrollService,
    private downloadAsPdf: downloadAsPdf,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    const date = new Date();
    const currentDateNumber =
      date.getFullYear() +
      '-' +
      ('0' + date.getMonth()).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2);
    const time =
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    this.makerDate = currentDateNumber + ' ' + time;
  }

  getData(event: any, type: string) {
    // debugger;
    switch (type) {
      case 'uploadDetails':
        if (event) {
          this.uploadDetails = event;
          this.uploadFileDetails = this.payrollService.getUploadFileDetails();
        }
        break;
      case 'fileUpload':
        if (event) {
          this.showUploadDetails = true;
        }
        break;
      case 'fileUploadDetails':
        if (event) {
          this.showUploadAuth = true;
          this.showUploadDetails = false;
        } else {
          this.showUploadDetails = false;
          this.showUploadAuth = false;
        }
        break;
      case 'fileUploadAuth':
        if (!event) {
          this.showUploadAuth = false;
          this.showUploadDetails = false;
        } else {
          this.uploadFileDetails = this.payrollService.getUploadFileDetails();
          this.fromData = this.uploadFileDetails.fromAccount;
          this.fileDetails = [
            {
              TEMPLATE_NAME: this.uploadFileDetails?.fileType?.subPdtDesc
                ? this.uploadFileDetails.fileType.subPdtDesc
                : '--',
              FILE_NAME: this.uploadFileDetails?.selectedFile?.title
                ? this.uploadFileDetails.selectedFile.title
                : '--',
            },
          ];
          this.submit();
        }
        break;
    }
  }

  getAuthEmit(event: any) {
    this.authDataObj = event;
  }

  getOtpDetails(event: any) {
    this.otpData = event;
  }

  getChangedDate(value: any) {
    this.valueDate = value;
  }

  submit() {
    this.isLoadingCompelete = false;
    const params = {
      PAYMENT_TYPE: this.uploadFileDetails?.fileType?.subPdtCode
        ? this.uploadFileDetails.fileType.subPdtCode
        : '',
      INPUT_SUB_PRODUCT: this.uploadFileDetails?.fileType?.subPdtCode
        ? this.uploadFileDetails.fileType.subPdtCode
        : '',
      FUNCTION_CODE:
        this.uploadFileDetails?.fileType?.subPdtCode === 'WPSUP'
          ? 'WPSINI'
          : 'BULKUP',
      INPUT_FUNCTION_CODE:
        this.uploadFileDetails?.fileType?.subPdtCode === 'WPSUP'
          ? 'WPSINI'
          : 'BULKUP',
      FILE_NAME: this.uploadFileDetails?.selectedFile?.title
        ? this.uploadFileDetails.selectedFile.title
        : '',
      MAKER_DATE: this.makerDate ? this.makerDate : '',
      TEMPLATE_ID: this.uploadFileDetails?.format?.templateId
        ? this.uploadFileDetails.format.templateId
        : '',
      FILE_SIZE: this.uploadFileDetails?.selectedFile?.size
        ? this.uploadFileDetails.selectedFile.size
        : '',
      FILEFORMAT_CD: this.uploadFileDetails?.format?.type
        ? this.uploadFileDetails.format.type
        : '',
      ACC_NO_REM:
        this.uploadFileDetails.format.type === 'txt'
          ? ''
          : this.uploadFileDetails.fromAccount.OD_ACC_NO,
      CIF_NUM:
        this.uploadFileDetails.format.type === 'txt'
          ? ''
          : this.uploadFileDetails.fromAccount.COD_CORECIF,
      ACTUAL_FILE_NAME: this.uploadFileDetails?.selectedFile?.title
        ? this.uploadFileDetails.selectedFile.title
        : '',
      CRC_SUM: this.uploadFileDetails?.selectedFile?.checkSum
        ? this.uploadFileDetails.selectedFile.checkSum
        : '',
      COMMERCIAL_NO:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.commercialNo
          : '',
      MOL_ID:
        this.uploadFileDetails.format.type === 'csv'
          ? this.uploadFileDetails.molId
          : '',
      UPLOAD_TYPE: this.uploadFileDetails?.fileType?.subPdtDesc
        ? this.uploadFileDetails.fileType.subPdtDesc
        : '',
      INPUT_TXN_STATUS: 'RA',
      IsValidateToken: '',
      AUTH_TYPE_O: this.otpData?.AUTH_TYPE_O ? this.otpData.AUTH_TYPE_O : '',
      PARAM1: this.otpData?.otpValue ? this.otpData.otpValue : '',
      PARAM2: this.otpData?.secAuthRef ? this.otpData.secAuthRef : '',
      SEL_PARSED_RULE_ID: this.authDataObj?.selectedAprover
        ? this.authDataObj.selectedAprover.PARSED_RULE_ID
        : '',
      SELECTION_FLAG: this.authDataObj?.selectedAprover ? 'Y' : 'N',
      USER_NUMBER_LIST: this.authDataObj?.selectedAprover?.OD_USER_NO
        ? `${this.authDataObj.selectedAprover.OD_USER_NO}%${this.authDataObj.selectedAprover.OD_ROLE_DESC}`
        : '',
      sefAuthFlag: this.otpData.flexiAuth.selfAuth === 'true' ? 'Y' : 'N',
      REFERENCE_NUM: this.uploadDetails?.proceedRes?.REFERENCE_NUM
        ? this.uploadDetails.proceedRes.REFERENCE_NUM
        : '',
      odTxnCy: this.uploadDetails?.fileDetails?.odTxnCy
        ? this.uploadDetails.fileDetails.odTxnCy
        : '',
      odFileAmount: this.uploadDetails?.fileDetails?.odFileAmount
        ? this.uploadDetails.fileDetails.odFileAmount
        : '',
      VALUEDATE: this.valueDate ? this.valueDate : '',
    };
    const payRollSubmit = this.payrollService.payrollSubmit(params).subscribe(
      (res: any) => {
        if (res?.dataValue?.OD_STATUS_DESC === 'Success') {
          const refNo =
            res.dataValue && res.dataValue.REFERENCE_NUM
              ? res.dataValue.REFERENCE_NUM
              : res.dataValue.INPUT_REFERENCE_NO;
          this.refNum = refNo;
          this.constructReceiptData(refNo);
          this.showReceipt = true;
          this.isLoadingCompelete = true;
        } else if (res?.dataValue?.OD_STATUS_DESC === 'Failed') {
          this.otpError = this.otpData && this.otpData.AUTH_TYPE_O ==='Token'?'LBL_PVN_TOKEN_ERR':"LBL_PLEASE_ENTER_VALID_OTP"
          // this.otpError = 'LBL_PLEASE_ENTER_VALID_OTP';
          this.isLoadingCompelete = true;
        }
      },
      (err: any) => {
        this.showReceipt = false;
        this.isLoadingCompelete = true;
      }
    );
    this.subscriptions.push(payRollSubmit);
  }

  constructReceiptData(referenceNo: string) {
    if (this.rootScopeData.currentUrl === '/payroll/vendorPayment') {
      this.templateName = 'Vendor Payment Upload';
    } else {
      this.templateName = this.uploadFileDetails?.fileType?.subPdtDesc
        ? this.uploadFileDetails.fileType.subPdtDesc
        : '--';
    }

    this.receiptData = {
      msg1: 'LBL_UPLOAD_SUCCESSFUL',
      msg2: 'LBL_FILE_HAS_UPLOADED',
      referenceNumber: referenceNo,
      receiptDetails: [
        {
          title: 'LBL_FILE_DETAILS',
          isTable: 'false',
          data: '',

          fieldDetails: [
            {
              dispKey: 'LBL_TEMPLATE_NAME',
              dataKey: this.templateName,
            },
            {
              dispKey: 'LBL_UPLOAD_FILE',
              dataKey: this.uploadFileDetails?.selectedFile?.fileActualName
                ? this.uploadFileDetails.selectedFile.fileActualName
                : '--',
            },
            {
              dispKey: 'LBL_VALUE_DATE',
              dataKey: this.getValueDate ? this.getValueDate : "--",
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
        buttonLabel: 'LBL_UPLOAD_ANOTHER_FILE',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };
    if (this.fromData)
      this.receiptData.receiptDetails.push({
        title: 'LBL_FROM',
        isTable: 'false',
        data: '',
        fieldDetails: [
          {
            dispKey: 'LBL_ACTION_BY',
            dataKey: this.rootScopeData?.userInfo?.loginID
              ? this.rootScopeData.userInfo.loginID
              : '--',
          },
          {
            dispKey: 'LBL_ACC_NUMBER',
            dataKey: this.uploadFileDetails?.fromAccount?.OD_ACC_NO
              ? this.uploadFileDetails.fromAccount.OD_ACC_NO
              : '--',
          },
          {
            dispKey: 'LBL_SHORT_NAME',
            dataKey: this.uploadFileDetails?.fromAccount?.ALIAS_NAME
              ? this.uploadFileDetails.fromAccount.ALIAS_NAME
              : '--',
          },
        ],
      });
    this.receiptData.receiptDetails.push({
      title: 'LBL_AUTHORIZATION',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_Next_Approver',
          dataKey:
            this.authDataObj &&
            this.authDataObj.selectedAprover &&
            this.authDataObj.selectedAprover.AUTH_NAME
              ? this.authDataObj.selectedAprover.AUTH_NAME
              : 'Not Provided',
        },
        {
          dispKey: 'LBL_ADD_NEXT_APROVER',
          dataKey:
            this.authDataObj &&
            this.authDataObj.selectedAprover &&
            this.authDataObj.aproveNote
              ? this.authDataObj.aproveNote
              : 'Not Provided',
        },
      ],
    });

    this.saveReceiptObject = {
      "pageheading": this.translateService.instant("LBL_UPLOAD_SUCCESSFUL"),
      "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
      "Description": this.translateService.instant("LBL_FILE_HAS_UPLOADED"),
      "keyValues": [
        {
          "subHead": "File Details",
          "subValue": ""
        },
        {
          "subHead": "Template Name",
          "subValue": this.templateName ? this.templateName: '--'
        },
        {
          "subHead": "Upload File",
          "subValue": this.uploadFileDetails?.selectedFile?.fileActualName
          ? this.uploadFileDetails.selectedFile.fileActualName
          : '--'
        },
        {
          "subHead": "From",
          "subValue": ""
        },
        {
          "subHead": "Action by",
          "subValue": this.rootScopeData?.userInfo?.loginID
          ? this.rootScopeData.userInfo.loginID
          : '--'
        },
        {
          "subHead": "Account Number",
          "subValue": this.uploadFileDetails?.fromAccount?.OD_ACC_NO
          ? this.uploadFileDetails.fromAccount.OD_ACC_NO
          : '--'
        },
        {
          "subHead": "Short Name",
          "subValue": this.uploadFileDetails?.fromAccount?.ALIAS_NAME
          ? this.uploadFileDetails.fromAccount.ALIAS_NAME
          : '--'
        }
      ],
      "pagecall":"payroll",
      "refNo":referenceNo
    }
  }

  initiateAnotherRequest() {
    this.showUploadAuth = false;
    this.showUploadDetails = false;
    this.showReceipt = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  downloadPdf(values:any) {
    let SelectedType = values;
    this.pdfData = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value: this.translateService.instant('LBL_PAYROLL_FILE_UPLOAD_RECEIPT'),
        x: 80,
        y: 35,
      },
      { type: 'setFontSize', size: 10 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setFontSize', size: 10 },
      { type: 'setFillColor', val1: 128, val2: 128, val3: 128 },
      { type: 'drawRect', x: 15, y: 51, w: 90, h: 6, s: 'F' },
      { type: 'setTextColor', val1: 255, val2: 255, val3: 255 },
      { type: 'setFontSize', size: 10 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_TRANSACTION_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FROM'),
        y: 65,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_ACTION_BY'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_ACC_NUMBER'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_SHORT_NAME'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FILE_DETAILS'),
        y: 105,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'normal' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_TEMPLATE_NAME'),
        y: 115,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_UPLOAD_FILE'),
        y: 125,
      },
      {
        type: 'text',
        value: this.rootScopeData?.userInfo?.loginID
          ? this.rootScopeData.userInfo.loginID
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.uploadFileDetails?.fromAccount?.OD_ACC_NO
          ? this.uploadFileDetails.fromAccount.OD_ACC_NO
          : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.uploadFileDetails?.fromAccount?.ALIAS_NAME
          ? this.uploadFileDetails.fromAccount.ALIAS_NAME
          : '--',
        y: 95,
      },
      {
        type: 'text',
        value: this.uploadFileDetails?.fileType?.subPdtDesc
          ? this.uploadFileDetails.fileType.subPdtDesc
          : '--',
        y: 115,
      },
      {
        type: 'text',
        value: this.uploadFileDetails?.selectedFile?.fileActualName
          ? this.uploadFileDetails?.selectedFile?.fileActualName
          : '--',
        y: 125,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_REF_NUMBER'),
        y: 135,
      },
      { type: 'text', value: this.refNum ? this.refNum : '', y: 135 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_FILE_HAS_UPLOADED'),
        y: 145,
      },
    ];

    if(SelectedType === 'save'){
      this.pdfData.push(
        { type: 'save', value:'payrollFileUpload.pdf'}
     )
    }       
     else if(SelectedType === 'print'){
      this.pdfData.push(
        { type: 'print', value:'payrollFileUpload.pdf'}
     )
    }

    // this.pdfData.push({
    //   type: 'save',
    //   value: this.translateService.instant('LBL_PAYROLL_FILE_UPLOAD') + '.pdf',
    // });

    this.downloadAsPdf.downloadpdf(this.pdfData);
  }

  getDateValue(event:any){
    this.getValueDate = event.valueDate;
  }
}
