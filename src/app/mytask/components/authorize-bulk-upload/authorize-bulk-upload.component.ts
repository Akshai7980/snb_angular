import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { PaymentsServiceService } from 'src/app/payments/services/payments-service.service';
import { MyTaskService } from '../../services/my-task.service';
import { Router } from '@angular/router';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-authorize-bulk-upload',
  templateUrl: './authorize-bulk-upload.component.html',
  styleUrls: ['./authorize-bulk-upload.component.scss'],
})
export class AuthorizeBulkUploadComponent implements OnInit {
  fileUploadedDetails: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingCompelete: boolean = true;
  isLoadingCompeletesmall: boolean = true;
  fileDetailsData: any;
  receiptData: any;
  selectedApprover: any;
  authError: string = '';
  authorizeList: any = [];
  receiptForm: boolean = false;
  fileDetails: any;
  showFiledetail: boolean = false;
  uploadFailed: boolean = false;
  noRecordFoundInfoObj:any;
  rejectReason: any;
  countServiceCalled: number = 0;
  pdfData: any;
  refNo: any;
  saveReceiptObject:any;
  constructor(
    private location: Location,
    private paymentsService: PaymentsServiceService,
    private myTaskService: MyTaskService,
    private route: Router,
    private translateService: TranslateService,private downloadAsPdf:downloadAsPdf
  ) {}

  ngOnInit() {
    this.fileUploadedDetails = {
      fileName:
        this.rootScopeData.pendingActivitiesBulkUploadObject.beneFileName,
      fileActualName:
        this.rootScopeData.pendingActivitiesBulkUploadObject.beneFileName,
      moduleId: 'MYBENEUPSUMY',
    };

    this.getFieldDetailsName();
    this.fetchSelfAuthDetails();
  }

  fetchSelfAuthDetails() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
        amt : '0',
        pdroductCode : 'PAYMNT',
        subPrdCode : 'BENEUP',
        cif : "",
        accNo : "",
    };
    this.isLoadingCompelete = false;
    this.paymentsService.getAuthorizationData(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data.authList.length > 0) {
          this.authorizeList = res.data.authList;
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  getFieldDetailsName() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      refNo:
        this.rootScopeData.pendingActivitiesBulkUploadObject.beneReferenceNo,
    };
    this.isLoadingCompeletesmall = false;
    let fileApiAutoFetch: any;
    const intervalLimit = Number(
      systemproperty.fetchFileDetailsPayrollPPPInterval
    );
    var dataFlag = true;

    this.paymentsService.getFieldDetails(params).subscribe(
      (res: any) => {
        this.isLoadingCompeletesmall = true;
        if (res) {
          this.isLoadingCompeletesmall = true;
          this.fileDetailsData = [res.data];
          this.showFiledetail = false;

          this.fileDetails = res.data;
          if (res.data.fileStatusCd === 'PNAUTH') {
            this.isLoadingCompeletesmall = true;
            this.showFiledetail = true;
            this.uploadFailed = false;
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
            this.isLoadingCompeletesmall = true;
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
            this.isLoadingCompeletesmall = true;
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
            this.isLoadingCompeletesmall = false;
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
        this.isLoadingCompeletesmall = false;
      }
    );
  }



  onBackArrowClick() {
    this.location.back();
  }

  authorizationDetails(event: any) {
    this.selectedApprover = event;
  }

  submit() {
    let params = {
      INPUT_REFERENCE_NO:
        this.rootScopeData.pendingActivitiesBulkUploadObject.beneReferenceNo,
      INPUT_VER_NO:
        this.rootScopeData.pendingActivitiesBulkUploadObject.versionNo,
      UNIT_ID: this.rootScopeData.userInfo.UNIT_ID,
      VALUE_DATE:
        this.rootScopeData.pendingActivitiesBulkUploadObject.valueDate,
    };
    this.isLoadingCompelete = false;

    this.myTaskService.benAuthorize(params).subscribe(
      (res) => {
        this.isLoadingCompelete = true;
        let vdata: any = [];
        vdata = res;
        if (vdata.dataValue.STATUS === 'Success') {
          this.constructReceiptData(vdata.dataValue.SELECTED_RECORDS);
          this.refNo = vdata.dataValue.SELECTED_RECORDS;
          this.receiptForm = true;
        }
      },
      (error) => {
        this.isLoadingCompelete = false;
      }
    );
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_BENEFICIARY_APPROVED',
      referenceNumber: refNumber,
      authorizeButtonRouterPath: '/mytask/serviceRequest',
      finishButtonRouterPath: '/dashboard',
      receiptDetails: [
        {
          title: 'LBL_BENEFICIARY_DETAILS',
          isTable: 'false',
          data: this.fileDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_FILE_NAME',
              dataKey:
                this.rootScopeData.pendingActivitiesBulkUploadObject
                  .beneFileName,
            },
            {
              dispKey: '',
              dataKey: '',
            },
            {
              dispKey: '',
              dataKey: '',
            },
          ],
        },
        {
          title: 'LBL_FILE_DETAILS',
          isTable: 'false',
          data: this.fileDetails,
          fieldDetails: [
            {
              dispKey: 'LBL_TOTAL_RECAORDS',
              dataKey: this.fileDetails.totalRecord,
            },
            {
              dispKey: 'LBL_SUCCESSFUL_RECORDS',
              dataKey: this.fileDetails.successfulRecord,
            },
            {
              dispKey: 'LBL_REJECTED_RECORDS',
              dataKey: this.fileDetails.rejectedRecord,
            },
          ],
        },
        {
          title: 'LBL_AUTHORIZATION',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_Next_Approver',
              dataKey: this.selectedApprover?.selectedAprover
                ? this.selectedApprover.selectedAprover.AUTH_NAME
                : 'LBL_NOT_PROVIDED',
            },
            {
              dispKey: 'LBL_ADD_NEXT_APROVER',
              dataKey: this.selectedApprover?.aproveNote
                ? this.selectedApprover.aproveNote
                : 'LBL_NOT_PROVIDED',
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
        buttonLabel: 'LBL_MAKE_ANOTHER_AUTHORIZATION',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    this.saveReceiptObject = {
        "pageheading": this.translateService.instant("LBL_UPLOAD_SUCCESSFUL"),
        "subHeading": this.translateService.instant("LBL_TRANSACTION_DETAILS"),
        "Description": this.translateService.instant("LBL_BENEFICIARY_APPROVED"),
        "keyValues": [
          {
            "subHead": "Upload Details",
            "subValue": ""
          },
          {
            "subHead": "Template Name",
            "subValue": this.rootScopeData.pendingActivitiesBulkUploadObject.templateName
            ? this.rootScopeData.pendingActivitiesBulkUploadObject.templateName : "--"
          },
          {
            "subHead": "File Name",
            "subValue": this.rootScopeData.pendingActivitiesBulkUploadObject.beneFileName
            ? this.rootScopeData.pendingActivitiesBulkUploadObject.beneFileName : "--"
          },
          {
            "subHead": "File Details",
            "subValue": ""
          },
          {
            "subHead": "Total Records",
            "subValue": this.fileDetails.totalRecord ? this.fileDetails.totalRecord : "--"
          },
          {
            "subHead": "Successful Records",
            "subValue": this.fileDetails.successfulRecord ? this.fileDetails.successfulRecord : "--"
          },
          {
            "subHead": "Rejected Records",
            "subValue": this.fileDetails.rejectedRecord ? this.fileDetails.rejectedRecord : "--"
          }
        ],
        "pagecall":"bulkbeneficiary",
        "refNo":refNumber
      }
  }

  initiateAnotherRequest() {
    this.route.navigate(['/mytask/beneficiary/bulkfile']);
  }
  downloadPdf(values:any)
  { 
  let SelectedType = values;
  this.pdfData = 
  [
    { type:'setFontSize', size:11},
    { type: 'setFont',fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setTextColor', val1:0, val2:0, val3:0},
    { type: 'title', value:this.translateService.instant("LBL_AUTHORIZE_BULK_UPLOAD"), x:80, y:35},
    { type:'setFontSize', size:10},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'},
    { type:'setFontSize', size:10},
    { type: 'setFillColor', val1:128, val2:128, val3:128},
    { type: 'drawRect', x:15, y:51, w:90, h:6, s:"F"},
    { type:'setTextColor', val1:255, val2:255, val3:255},
    { type:'setFontSize', size:10},
    { type: 'heading', value:this.translateService.instant('LBL_TRANSACTION_DETAILS'), y:55},
    { type:'setFontSize', size:9},
    { type:'setTextColor', val1:0, val2:0, val3:0}, 
    { type: 'heading', value:this.translateService.instant('LBL_BENEFICIARY_DETAILS'), y:65},
    { type:'setFont', fontName:'Amiri-Regular', fontStyle:'normal'}, 
    { type: 'heading', value:this.translateService.instant('LBL_FILE_NAME'), y:75},
    { type: 'heading', value:this.translateService.instant('LBL_FILE_DETAILS'), y:85},
    { type: 'heading', value:this.translateService.instant('LBL_TOTAL_RECAORDS'), y:95},
    { type: 'heading', value:this.translateService.instant('LBL_SUCCESSFUL_RECORDS'), y:105},
    { type: 'heading', value:this.translateService.instant('LBL_REJECTED_RECORDS'), y:115},
    { type: 'text', value:this.rootScopeData.pendingActivitiesBulkUploadObject.beneFileName ? this.rootScopeData.pendingActivitiesBulkUploadObject.beneFileName : '', y:75},
    { type: 'text', value:this.fileDetails.totalRecord ? this.fileDetails.totalRecord : '', y:95},
    { type: 'text', value:this.fileDetails.successfulRecord ? this.fileDetails.successfulRecord : '', y:105},
    { type: 'text', value:this.fileDetails.rejectedRecord ? this.fileDetails.rejectedRecord : '', y:115},
    { type: 'heading', value:this.translateService.instant('LBL_REF_NUMBER'), y:125},
    { type: 'text', value: this.refNo? this.refNo : '', y:125},
    { type: 'heading', value:this.translateService.instant('LBL_BENEFICIARY_APPROVED'), y:135},
    
  ]
  

  if(SelectedType === 'save'){
    this.pdfData.push(
      { type: 'save', value:'Authorize-BulkUpload.pdf'}
   )
  }       
   else if(SelectedType === 'print'){
    this.pdfData.push(
      { type: 'print', value:'Authorize-BulkUpload.pdf'}
   )
  }

 this.downloadAsPdf.downloadpdf(this.pdfData);

}
cancel(){
  this.route.navigate(['/mytask/payment/single-payments'])
}
}
