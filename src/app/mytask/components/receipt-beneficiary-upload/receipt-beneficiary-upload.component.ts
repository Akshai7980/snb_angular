import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentsServiceService } from 'src/app/payments/services/payments-service.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';

@Component({
  selector: 'app-receipt-beneficiary-upload',
  templateUrl: './receipt-beneficiary-upload.component.html',
  styleUrls: ['./receipt-beneficiary-upload.component.scss'],
})
export class ReceiptBeneficiaryUploadComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  fileUploadedDetails: any;
  isLoadingCompelete: boolean = true;
  fileDetailsData: any;
  showRecSumm: boolean = false;
  isLoadingCompeleteRecordSummary: boolean = true;
  recordSummaryObject: any = {};
  workFlowHistoryParams: any;
  sortOptions: any = {
    sortColumn: 'odRefNo',
    sortOrder: 'desc',
    fromRow: 0,
    toRow: 5,
  };
  showFiledetail: boolean = false;
  uploadFailed: boolean = false;
  noRecordFoundInfoObj:any;
  rejectReason: any;
  countServiceCalled: number = 0;
  moduleId: string = 'MYBENEUPSUMY';
  displayOption: any = [
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
  ];
  constructor(
    private router: Router,
    private paymentsService: PaymentsServiceService
  ) { }

  ngOnInit() {
    this.fileUploadedDetails = {
      fileName:
        this.rootScopeData.pendingActivitiesBulkUploadObject.beneFileName,
      fileActualName:
        this.rootScopeData.pendingActivitiesBulkUploadObject.beneFileName,
      moduleId: 'MYBENEUPSUMY',
    };
  //  this.getRecordSummaryData(this.sortOptions);
    this.getFieldDetailsName();
    this.workFlowHistoryParams = {
      refNum:
        this.rootScopeData.pendingActivitiesBulkUploadObject.beneReferenceNo,
      productCode:
        this.rootScopeData.pendingActivitiesBulkUploadObject.productCode,
      subProductCode:
        this.rootScopeData.pendingActivitiesBulkUploadObject.subProductCode,
      functionCode:
        this.rootScopeData.pendingActivitiesBulkUploadObject.functionCode,
    };
  }

  getFieldDetailsName() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      refNo:
        this.rootScopeData.pendingActivitiesBulkUploadObject.beneReferenceNo,
    };
    this.isLoadingCompelete = false;
    let fileApiAutoFetch: any;
    const intervalLimit = Number(
      systemproperty.fetchFileDetailsPayrollPPPInterval
    );
    var dataFlag = true;
    this.paymentsService.getFieldDetails(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res) {
          this.isLoadingCompelete = true;
          this.fileDetailsData = [res.data];
          this.showFiledetail = false;

          if (res.data.fileStatusCd === 'PNAUTH') {
            this.isLoadingCompelete = true;
            this.showFiledetail = true;
            this.uploadFailed = false;
            this.getRecordSummaryData(this.sortOptions);
            if (fileApiAutoFetch) {
              clearTimeout(fileApiAutoFetch);
            }
          } 
          else if(res.data.fileStatusCd === 'CONFAL'){
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
          }else if (
            res.data.fileStatusCd === 'VERFAL' ||
            res.data.fileStatusCd === 'REJCTD' ||
            res.data.fileStatusCd === 'FAILED'
          ){            this.uploadFailed = true;
            this.showFiledetail = true;
            this.rejectReason = res.data?.rejectReason;
            this.isLoadingCompelete = true;
            this.getRecordSummaryData(this.sortOptions);

            if (fileApiAutoFetch) {
              clearTimeout(fileApiAutoFetch);
            }


          }else if (JSON.stringify(res.data) === '{}') {
            this.noRecordFoundInfoObj = {
              msg: 'LBL_NO_FILE_DETAIL_FOUND',
              btnLabel: 'Apply Now',
              btnLink: '/dashboard',
              showBtn: 'true',
              showMsg: 'true',
              showIcon: 'true',
            };
            this.showFiledetail = false;
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

          else {
            this.isLoadingCompelete = false;
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

            this.showFiledetail = false;
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
        this.isLoadingCompelete = false;
      }
    );
  }
  getRecordSummaryData(data?: any) {
    const params = {
      sortColumn: data?.sortColumn,
      sortOrder: data?.sortOrder,
      fromRow: data?.fromRow,
      toRow: data?.toRow,
      refNo:
      this.rootScopeData.pendingActivitiesBulkUploadObject.beneReferenceNo,
    };
    this.paymentsService.getBeneficiaryLists(params).subscribe(
      (res: any) => {
        this.isLoadingCompeleteRecordSummary = true;
        if (res.data === null) {
          this.showRecSumm = true;
          this.recordSummaryObject = {
            data: [],
            displayDetails: this.displayOption,
          };
        }

        if (res.data) {
          this.isLoadingCompeleteRecordSummary = true;
          this.showRecSumm = true;

          this.recordSummaryObject = {
            data: res.data,
            displayDetails: this.displayOption,
          };
        }
      },
      (error: any) => {
        this.showRecSumm = true;
        this.isLoadingCompeleteRecordSummary = false;
      }
    );
  }

  onSortColumn(event: any) {
    this.getRecordSummaryData(event);
  }

  onClickAuthorize() {
    this.router.navigate(['/mytask/authorizeBulkPayment']);
  }
  onClickReject() {
    this.router.navigate(['/mytask/rejectBulkPayment']);
  }
  back() {
    this.router.navigate(['/mytask/beneficiary']);
  }
}
