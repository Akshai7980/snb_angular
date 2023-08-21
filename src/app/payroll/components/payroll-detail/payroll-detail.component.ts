import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { PayrollService } from '../../services/payroll.service';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './payroll-detail.component.html',
  styleUrls: ['./payroll-detail.component.scss'],
})
export class PayrollDetailComponent implements OnInit {
  selectedType: any;
  fileSize = 10;
  fileName: string = '';
  file: any;
  csvField: boolean = false;
  uploadInput: any;
  file_size: string = '';
  clearFields: any;
  fileDetails: any;
  fileTypes: any = [];
  fileFormats: any = [];
  showNext: boolean = false;
  @Output() getClickEmit = new EventEmitter<boolean>();
  @Output() getFormData = new EventEmitter<any>();
  @Output() getValueDate = new EventEmitter<any>();
  showOtherFields: boolean = false;
  selectedDebitObj: boolean = false;
  debitDataObj: any;
  showButtons: boolean = false;
  fileTypeError: any;
  formatTypeError: any;
  fileType: string = '';
  fileFormat: string = '';
  commNo: string = '';
  molId: string = '';
  showUploadSection: boolean = false;
  showCommErrMsg: boolean = false;
  showMolIdErrMsg: boolean = false;
  showValidErrMsg: boolean = false;
  errorObj: any = {
    fromDateErr: false,
    toDateErr: false,
    exportErr: false,
    periodErr: false,
  };
  dateErrorMsg: any;
  noRecordFoundInfoObj!: {
    msg: string;
    btnLabel: string;
    btnLink: string;
    showBtn: string;
    showMsg: string;
    showIcon: string;
  };
  advSearchPeriod: any;
  advSearchFromDate: any;
  advSearchToDate: any;
  filterFlag: any;
  filterField: any;
  filterConstraint: any;
  responseHeader: any;
  enableProperty: boolean = true;
  totalRecords: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSourceLength: any;
  dataSourceToPass: any;
  commonPagination: any;
  businessDates: any;
  selectFormat: any;
  csvClicked: boolean = false;
  txtClicked: boolean = true;

  currentDay: string = '';
  fileSizeValidationErrorMessage: boolean = false;
  fileTypeValidationErrorMessage: boolean = false;
  fileNameValidationErrorMessage: boolean = false;

  fileChecksum: string = '';
  isLoadingCompelete: boolean = true;
  uploadFileDetails: any = {};
  debitData: any;
  clearFlag: boolean = false;
  validDates: any = [];
  makerDate: string = '';
  downloadTemplateData: any = {};
  startDate: any = '';
  tooltipAcc: boolean = false;
  id: any = 'myDialog';
  effectiveDate: any;
  cutOffTime: any;
  isVendorPayment: boolean = false;

  constructor(
    private payrollService: PayrollService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUploadFileType();
    this.toFormatMakerDate();
    this.toConstructNoRecord();
    this.toUploadInput();
    this.uploadFileDetails = this.payrollService.getUploadFileDetails();

    if (this.rootScopeData.currentUrl === '/payroll/vendorPayment') {
      this.selectedType = {
        subPdtCode: 'BULKPAY',
      };
      this.isVendorPayment = true;
      this.getUploadFormats();
      this.fileType = '89';
    }
  }

  toFormatMakerDate() {
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

  toConstructNoRecord() {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_PAYROLL_TRANSACTION',
      btnLabel: 'LBL_APPLY_NOW',
      btnLink: '/dashboard',
      showBtn: 'true',
      showMsg: 'true',
      showIcon: 'true',
    };
  }

  toUploadInput() {
    this.uploadInput = {
      uploadFileTitle: 'Upload File',
      supportedFileSize: systemproperty.payrollDetailSupportedFileSize,
    };
  }

  onSelectedType(event: any, type: any) {
    if (event) {
      this.fileTypeError = false;
      this.selectedType = type;
      this.fileFormat = '';
      this.showUploadSection = false;
      this.csvField = false;
      this.showOtherFields = false;
      this.getUploadFormats();
    }
  }

  onSelectedFile(event: any, format: any) {
    this.selectFormat = format;
    if (event) {
      if (this.isVendorPayment && this.fileFormat === 'txt') {
        this.uploadInput.supportedFileTypes = ['txt'];
        this.showUploadSection = true;
        this.fileTypeError = false;
        this.formatTypeError = false;
        return;
      }

      if (this.fileType) {
        this.fileTypeError = false;
        if (this.fileFormat) {
          this.formatTypeError = false;
          if (this.fileFormat === 'csv') {
            this.uploadInput.supportedFileTypes = ['csv'];
            if (this.fileType === 'WPSUP' && this.fileFormat === 'csv') {
              this.csvField = true;
            } else {
              this.csvField = false;
            }

            this.showOtherFields = true;
            this.csvClicked = true;
            this.txtClicked = false;
            this.showUploadSection = false;
            // this.fetchBusinessDays();
          } else {
            this.uploadInput.supportedFileTypes = ['txt'];
            this.showButtons = false;
            this.csvClicked = false;
            this.txtClicked = true;
            this.csvField = false;
            this.showOtherFields = false;
            this.showUploadSection = true;
            this.selectedDebitObj = false;
          }
          if (this.isVendorPayment) {
            this.selectedType = {
              subPdtCode: 'BULKPAY',
            };
          }

          if (
            this.selectedType.subPdtCode === 'SALPAY' &&
            this.selectFormat.type === 'csv'
          ) {
            this.fetchDebitAccPayroll();
          } else if (
            this.selectedType.subPdtCode === 'WPSUP' &&
            this.selectFormat.type === 'csv'
          ) {
            this.entitledDebitAccountWps();
          } else if (
            this.selectedType.subPdtCode === 'BULKPAY' &&
            this.selectFormat.type === 'csv'
          ) {
            this.getVendorUploadData();
          }
        }
        this.fileTypeValidationErrorMessage = false;
        this.fileSizeValidationErrorMessage = false;
        this.fileNameValidationErrorMessage = false;
      } else {
        this.fileFormat = '';
        this.fileTypeError = true;
      }
    }
    this.onClickDownload();
  }

  onFileAdded(eventData: {
    title: string;
    size: string;
    format: string;
    typeValidFlag: boolean;
    fileSizeValidFlag: boolean;
    isFileNameValid?: boolean;
  }) {
    this.fileName = eventData.title;
    this.file_size = eventData.size;
    this.fileSizeValidationErrorMessage = false;
    this.fileTypeValidationErrorMessage = false;
    this.fileNameValidationErrorMessage = false;
    if (eventData.typeValidFlag) {
      this.fileTypeValidationErrorMessage = false;
      if (eventData.isFileNameValid) {
        this.fileNameValidationErrorMessage = false;
        if (!eventData.fileSizeValidFlag) {
          this.fileSizeValidationErrorMessage = false;
        } else {
          this.fileSizeValidationErrorMessage = true;
        }
      } else {
        this.fileNameValidationErrorMessage = true;
      }
    } else {
      this.fileTypeValidationErrorMessage = true;
    }
    if (
      this.fileName &&
      !this.fileSizeValidationErrorMessage &&
      !this.fileTypeValidationErrorMessage &&
      !this.fileNameValidationErrorMessage
    ) {
      if (eventData.format === 'txt' && !this.commNo && !this.isVendorPayment) {
        this.showButtons = true;
        this.file = eventData;
        this.onChangeUpdate();
      } else if (eventData.format === 'csv') {
        this.showButtons = true;
        this.file = eventData;
        this.onChangeUpdate();
      } else if (
        eventData.format === 'txt' &&
        !this.commNo &&
        this.isVendorPayment
      ) {
        this.showButtons = true;
        this.file = eventData;
        this.onChangeUpdate();
      }
    } else {
      this.showButtons = false;
    }
  }

  getUploadFileType() {
    this.isLoadingCompelete = false;
    const params = {
      action: 'GET_USRENT_SNB_UPLOAD',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      subPdtCode:
        this.rootScopeData.currentUrl === '/payroll/vendorPayment' ? '89' : '',
    };
    this.payrollService.getFileType(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data) {
          this.fileTypes = res.data.entitledSubPdt;
        }
      },
      (err) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  moiValidation(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57) && charCode != 45) {
      return false;
    }
    return true;
  }

  toValidateMOLID(event: any) {
    const molId = event.target.value;
    if (molId) {
      if (/[,\-]/.test(molId)) {
        this.showValidErrMsg = false;
        const molSplit = molId.split('-');
        if (Number(molSplit[0]) === 0) {
          this.showValidErrMsg = true;
        } else if (molSplit[0].charAt(0) === '0') {
          this.showValidErrMsg = true;
        } else if (molSplit[1].charAt(0) === '0') {
          this.showValidErrMsg = true;
        }
      } else {
        this.showValidErrMsg = true;
      }
    } else {
      this.showMolIdErrMsg = true;
    }
  }

  comValidation(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }
  fromValue(event: any) {
    if (event) {
      this.dateErrorMsg = false;
      var endDate = new Date(event);
      this.currentDay =
        '' +
        endDate.getDate().toString().padStart(2, '0') +
        '/' +
        (endDate.getMonth() + 1).toString().padStart(2, '0') +
        '/' +
        endDate.getFullYear();
      this.errorObj.fromDateErr = false;
      this.getValueDate.emit(this.currentDay);
      this.onChangeUpdate();
    }
  }

  onChangeUpdate() {
    this.showButtons = false;
    if (!this.fileType || !this.fileFormat || !this.fileName) return;
    if (this.fileFormat === 'csv' && this.fileType === 'WPSUP')
      if (!this.currentDay || !this.commNo || !this.molId) return;
    if (
      this.fileFormat === 'csv' &&
      (this.fileType === 'SALPAY' || this.fileType === 'BULKPAY')
    )
      if (!this.currentDay) return;
    this.showButtons = true;
  }

  getUploadFormats() {
    this.isLoadingCompelete = false;
    if (this.selectedType) {
      this.fileTypeError = false;
      const params = {
        typeCode:
          this.rootScopeData.currentUrl === '/payroll/vendorPayment'
            ? '89'
            : this.selectedType.subPdtCode,
        action: 'GET_USRENT_FORMAT',
        unitId: this.rootScopeData?.userInfo?.UNIT_ID
          ? this.rootScopeData.userInfo.UNIT_ID
          : '',
      };
      this.payrollService.getUploadFormat(params).subscribe(
        (res: any) => {
          this.isLoadingCompelete = true;
          if (res.data) {
            this.fileFormats = res.data.format;
          }
        },
        (err) => {
          this.isLoadingCompelete = true;
        }
      );
    } else {
      this.fileTypeError = true;
    }
  }

  fetchBusinessDays() {
    this.isLoadingCompelete = false;
    // if (this.fileType && this.fileFormat) {
    const params = {
      transactionType: 'SARIE',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.payrollService.getBusinessDaysList(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res && res.dataValue && res.dataValue.businessDaysList) {
          this.businessDates = res.dataValue.businessDaysList;
          if (this.businessDates) {
            this.businessDates.forEach((element: any) => {
              const time = moment(element.businessDay, 'DD/MM/YYYY').set({
                hour: 0,
                minute: 0,
                second: 0,
              });

              this.validDates.push(time.valueOf());
            });
            const sortedAscDate = this.validDates.sort(
              (objA: any, objB: any) => objA - objB
            );

            this.cutOffTime = parseInt(this.cutOffTime);
            let validateTime = 1400;

            if (this.effectiveDate == '0' && this.cutOffTime < validateTime) {
              this.startDate = new Date(sortedAscDate[0]);
            } else if (
              this.effectiveDate == '0' &&
              this.cutOffTime > validateTime
            ) {
              this.startDate = new Date(sortedAscDate[1]);
            } else if (this.effectiveDate >= '1') {
              this.startDate = new Date(sortedAscDate[this.effectiveDate]);
            }
          }
        }
      },
      (err) => {
        this.isLoadingCompelete = true;
      }
    );
    // }
  }

  entitledDebitAccountWps() {
    this.isLoadingCompelete = false;
    this.payrollService.entitledDebitAccount().subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.DATA.ALL_RECORDS) {
          let debitData = res.DATA.ALL_RECORDS;

          for (let i in debitData) {
            let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMOUNT_NEW;
            let convtd_ccy = debitData[i].OD_CCY_CODE;
            let convtd_amount = '';
            if (crntAvail_amount && convtd_ccy) {
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              convtd_amount = currencyFormatPipeFilter.transform(
                crntAvail_amount.trim(),
                convtd_ccy
              );
              debitData[i].CURR_AVAIL_BAL_AMOUNT_NEW = convtd_amount;
            }
          }

          this.constructDebitTable(debitData);
        }
      },
      (err) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  constructDebitTable(debitDetails: any) {
    debitDetails.forEach((element: any) => {
      element.ALIAS_NAME = element?.ALIAS_NAME ? element.ALIAS_NAME : '--';
      element.OD_ACC_NO = element?.OD_ACC_NO ? element.OD_ACC_NO : '--';
      element.LIAS_NAME = element?.LIAS_NAME ? element.LIAS_NAME : '--';
      element.STATUS = element?.STATUS ? element.STATUS : '--';
      element.OD_CCY_CODE = element?.CURR_AVAIL_BAL_AMOUNT_NEW
        ? element.OD_CCY_CODE
        : '';
      element.CURR_AVAIL_BAL_AMOUNT_NEW = element?.CURR_AVAIL_BAL_AMOUNT_NEW
        ? element.CURR_AVAIL_BAL_AMOUNT_NEW
        : '--';
    });
    this.debitDataObj = {
      title: 'LBL_FROM',
      data: debitDetails,
      fieldDetails: [
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'ALIAS_NAME',
        },
        {
          dispKey: 'LBL_ACC_NUMBER',
          dataKey: 'OD_ACC_NO',
        },
        {
          dispKey: 'LBL_FULL_NAME',
          dataKey: 'LIAS_NAME',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'STATUS',
        },
        {
          dispKey: 'LBL_BALANCE',
          dataKey: 'CURR_AVAIL_BAL_AMOUNT_NEW',
          dataKeySupport: 'OD_CCY_CODE',
        },
      ],
    };
  }

  afterFromAccountSelection(fromAccount: any) {
    this.debitData = fromAccount;
    if (fromAccount) {
      this.selectedDebitObj = true;
      this.accNoValidation();
    }
    if (fromAccount === 'iconClick') {
      this.selectedDebitObj = false;
    } else {
      this.clearFlag = false;
    }
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }
  accNoValidation() {
    if (this.fileFormat === 'csv') {
      this.isLoadingCompelete = false;
      let param = {
        accNo: this.debitData?.OD_ACC_NO ? this.debitData.OD_ACC_NO : '',
        unitId: this.rootScopeData?.userInfo?.UNIT_ID
          ? this.rootScopeData.userInfo.UNIT_ID
          : '',
        SUB_TYPE:
          this.rootScopeData.currentUrl === '/payroll/vendorPayment'
            ? '89'
            : this.selectedType?.subPdtCode
            ? this.selectedType.subType
            : '',
      };

      const accNoValidation = this.payrollService
        .accountNumberValidation(param)
        .subscribe(
          (res: any) => {
            this.isLoadingCompelete = true;
            if (res.dataValue.errorCode === '0') {
              this.fetchBusinessDays();
              if (
                res.dataValue.isAccountValid === 'NO' ||
                res.dataValue.isAccountValid === 'No'
              ) {
                this.tooltipAcc = true;
                if (this.tooltipAcc) {
                  this.openDialogWithTemplateRef(this.id);
                }
              } else {
                this.tooltipAcc = false;
              }

              this.effectiveDate = res.dataValue.effectiveDays;
              this.cutOffTime = res.dataValue.cutOffTime;
            } else if (res.dataValue.errorCode === '1') {
              this.selectedDebitObj = false;
              // this.clearFlag = false;
              this.rootScopeData.showSystemError = true;
              this.rootScopeData.toastMessage = 'LBL_ERROR_UNABLE_TO_PROCESS';
            }
          },
          (error: any) => {
            this.isLoadingCompelete = true;
          }
        );
      // this.subscriptions.push(accNoValidation);
    }
  }

  onChangeCommNo() {
    if (this.commNo) this.showCommErrMsg = false;
  }

  onChangeMolId() {
    if (this.molId) this.showMolIdErrMsg = false;
    this.showValidErrMsg = false;
  }

  proceedNext() {
    let fileType;
    this.fileTypes.forEach((val: any) => {
      if (val.subPdtCode === this.fileType) fileType = val;
    });
    if (!this.fileType) {
      this.fileTypeError = true;

      return;
    } else if (!this.fileFormat) {
      this.formatTypeError = true;
      return;
    } else if (!this.fileName) {
      return;
    } else if (this.fileFormat === 'csv' && this.fileType === 'WPSUP') {
      if (!this.currentDay) {
        this.dateErrorMsg = true;
        return;
      } else if (!this.commNo) {
        this.showCommErrMsg = true;
        return;
      } else if (!this.molId) {
        this.showMolIdErrMsg = true;
        return;
      } else if (this.showValidErrMsg) {
        return;
      }
    }
    this.isLoadingCompelete = false;
    //As needed PPP
    // if(this.currentDay)
    // {
    //  let splitedDate = this.currentDay.split('/');
    //  let toMMDDYYYYFormat = splitedDate[0]+ +splitedDate[1]+ +splitedDate[2];
    //   this.currentDay = toMMDDYYYYFormat;
    // }
    const params = {
      PAYMENT_TYPE: 'PAYROLL',
      INPUT_SUB_PRODUCT: this.selectedType?.subPdtCode
        ? this.selectedType.subPdtCode
        : '',
      FILE_NAME: this.file?.title ? this.file.title : '',
      MAKER_DATE: this.makerDate ? this.makerDate : '',
      TEMPLATE_ID: this.selectFormat?.templateId
        ? this.selectFormat.templateId
        : '',
      FILE_SIZE: this.file?.size ? this.file.size : '',
      FILEFORMAT_CD: this.selectFormat?.type ? this.selectFormat.type : '',
      ACC_NO_REM:
        this.selectFormat.type === 'csv' || this.selectFormat.type === 'CSV'
          ? this.debitData.OD_ACC_NO
          : '',
      CIF_NUM:
        this.selectFormat.type === 'csv' || this.selectFormat.type === 'CSV'
          ? this.debitData.COD_CORECIF
          : '',
      ACTUAL_FILE_NAME: this.file?.fileActualName
        ? this.file.fileActualName
        : '',
      CRC_SUM: this.file?.checkSum ? this.file.checkSum : '',
      COMMERCIAL_NO:
        this.selectFormat.type === 'csv' ||
        (this.selectFormat.type === 'CSV' &&
          this.selectedType.subPdtCode === 'WPS')
          ? this.commNo
          : '',
      MOL_ID:
        this.selectFormat.type === 'csv' ||
        (this.selectFormat.type === 'CSV' &&
          this.selectedType.subPdtCode === 'WPS')
          ? this.molId
          : '',
      UPLOAD_TYPE:
        this.rootScopeData.currentUrl === '/payroll/vendorPayment'
          ? 'Vender Payment Upload'
          : this.selectedType?.subPdtDesc
          ? this.selectedType.subPdtDesc
          : '',
      SUB_TYPE:
        this.rootScopeData.currentUrl === '/payroll/vendorPayment'
          ? '89'
          : this.selectedType?.subPdtCode
          ? this.selectedType.subType
          : '',
      VALUEDATE: this.currentDay ? this.currentDay : '',
    };

    this.payrollService.fileUploadProceed(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data.STATUS === 'SUCCESS') {
          this.showNext = true;
          this.getClickEmit.emit(this.showNext);

          let data;
          if (this.fileFormat === 'txt') {
            data = {
              fileType: this.selectedType,
              format: this.selectFormat,
              selectedFile: this.file,
              proceedRes: res.data,
              fileDetails: '',
            };
          } else {
            data = {
              fileType: this.selectedType,
              format: this.selectFormat,
              selectedFile: this.file,
              valueDate: this.currentDay,
              commercialNo: this.commNo,
              molId: this.molId,
              fromAccount: this.debitData,
              proceedRes: res.data,
              fileDetails: '',
            };
          }
          this.payrollService.setUploadFileDetails(data);
          this.getFormData.emit(data);
        }
        if (res.data.STATUS === 'FAILURE') {
          this.showNext = false;
          this.isLoadingCompelete = true;
          this.getClickEmit.emit(this.showNext);
        }
      },
      (error) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  toCancel() {
    this.showOtherFields = false;
    this.showButtons = false;
    this.showUploadSection = false;
    this.fileFormats = [];
    this.fileFormat = '';
    this.fileType = '';
    this.csvField = false;
    this.selectedDebitObj = false;
    this.showButtons = false;
    this.commNo = '';
    this.molId = '';
    this.currentDay = '';
    this.file = '';
    this.fileName = '';
    this.fileTypeValidationErrorMessage = false;
    this.fileSizeValidationErrorMessage = false;
    this.fileNameValidationErrorMessage = false;
    if (this.isVendorPayment) {
      this.selectedType = {
        subPdtCode: 'BULKPAY',
      };
      this.fileType = '89';
      this.getUploadFormats();
    }
  }

  fetchDebitAccPayroll() {
    this.isLoadingCompelete = false;
    this.payrollService.getDebitAccPayroll().subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.DATA.ALL_RECORDS) {
          let debitData = res.DATA.ALL_RECORDS;

          for (let i in debitData) {
            let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMOUNT_NEW;
            let convtd_ccy = debitData[i].OD_CCY_CODE;
            let convtd_amount = '';
            if (crntAvail_amount && convtd_ccy) {
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              convtd_amount = currencyFormatPipeFilter.transform(
                crntAvail_amount.trim(),
                convtd_ccy
              );
              debitData[i].CURR_AVAIL_BAL_AMOUNT_NEW = convtd_amount;
            }
          }

          this.constructDebitTable(debitData);
        }
      },
      (err) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  getVendorUploadData() {
    this.isLoadingCompelete = false;
    this.payrollService.getVendorUpload().subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.DATA.ALL_RECORDS) {
          let debitData = res.DATA.ALL_RECORDS;

          for (let i in debitData) {
            let crntAvail_amount = debitData[i].CURR_AVAIL_BAL_AMOUNT_NEW;
            let convtd_ccy = debitData[i].OD_CCY_CODE;
            let convtd_amount = '';
            if (crntAvail_amount && convtd_ccy) {
              let currencyFormatPipeFilter = new CurrencyFormatPipe();
              convtd_amount = currencyFormatPipeFilter.transform(
                crntAvail_amount.trim(),
                convtd_ccy
              );
              debitData[i].CURR_AVAIL_BAL_AMOUNT_NEW = convtd_amount;
            }
          }

          this.constructDebitTable(debitData);
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  onClickDownload() {
    this.downloadTemplateData = {
      flag: 'SALPAY',
      moduleId: 'TMPDOWNLD',
      subPdt: this.selectedType.subPdtCode,
      exportType: this.selectFormat.type,
      templateId: this.selectFormat.templateId,
    };
  }
}
