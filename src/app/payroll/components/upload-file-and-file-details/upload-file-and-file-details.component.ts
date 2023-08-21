import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PayrollService } from '../../services/payroll.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';

@Component({
  selector: 'app-upload-file-and-file-details',
  templateUrl: './upload-file-and-file-details.component.html',
  styleUrls: ['./upload-file-and-file-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UploadFileAndFileDetailsComponent implements OnInit, OnDestroy {
  debitDataObj: any;
  fileDetails: any;
  dropDownArrow: boolean = false;
  @Input() dropDown: boolean = false;
  showNext: boolean = true;
  @Output() getClickEmit = new EventEmitter<boolean>();
  @Output() getFileDetailsEmit = new EventEmitter();
  @Output() getAuthEmit = new EventEmitter<any>();
  @Output() onAccountClickEmit = new EventEmitter<any>();
  @Output() getShowProceedBalanceValidation = new EventEmitter<any>();
  authDetails: any;
  tooltipAcc: boolean = false;
  id: any = 'myDialog';
  uploadFileDetails: any = {};
  isLoadingCompelete: boolean = true;
  data: any = [];
  subscriptions: Subscription[] = [];
  fileUploadedDetails: any = {};
  isLoadingCompeleteMedium: boolean = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  showFileErrMsg: boolean = false;
  balanceValidation: boolean = false;
  getBalanceAmount: any;
  fileApiAutoFetch:any;

  constructor(
    private payrollService: PayrollService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dropDownArrow = this.dropDown;
    this.uploadFileDetails = this.payrollService.getUploadFileDetails();

    if (this.uploadFileDetails.format.type === 'csv') {
      this.data[0] = this.uploadFileDetails.fromAccount;
      this.constructDebitTable(this.data);
    }
    this.fetchFileDetails();
    //this.accNoValidation();
    this.onUploadDownload();
  }

  constructDebitTable(debitData: any) {
    this.getBalanceAmount = debitData;
    this.debitDataObj = {
      title: 'LBL_FROM',
      data: debitData,
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

  getDatas(event: any, type: string) {
    switch (type) {
      case 'authorization':
        this.authDetails = event;
        this.getAuthEmit.emit(this.authDetails);
    }
  }

  fetchFileDetails() {
    this.isLoadingCompeleteMedium = false;
    const params = {
      REFERENCE_NUM: this.uploadFileDetails?.proceedRes?.REFERENCE_NUM
        ? this.uploadFileDetails.proceedRes.REFERENCE_NUM
        : '',
      subProductName: this.uploadFileDetails?.fileType?.subPdtCode
        ? this.uploadFileDetails.fileType.subPdtCode
        : '',
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    // let fileApiAutoFetch: any;
    const intervalLimit = Number(
      systemproperty.fetchFileDetailsPayrollPPPInterval
    );

      this.rootScopeData.validationErrorToast = true;
      this.rootScopeData.validationToastMessage ="File is Uploading";
    const fileDetails = this.payrollService.getFileDetails(params).subscribe(
      (res: any) => {
        if (res.data) {
          if (
            res.data.fileStatusCd === 'VERFAL' ||
            res.data.fileStatusCd === 'CONFAL' ||
            res.data.fileStatusCd === 'REJCTD' ||
            res.data.fileStatusCd === 'FAILED'
          ) {
            this.rootScopeData.validationErrorToast = false;
            this.showFileErrMsg = true;
            let showErrorMsg = res.data.rejectReason;
            if (res.data.fileStatusCd === 'CONFAL') {
              this.rootScopeData.showSystemError = true;
              this.rootScopeData.toastMessage = showErrorMsg;
            }
          } else {
            this.showFileErrMsg = false;
          }
          this.fileDetails = res.data;
          this.getFileDetailsEmit.emit(this.fileDetails);

          if (
            this.fileDetails.odFileAmount &&
            this.getBalanceAmount &&
            this.getBalanceAmount[0].CURR_AVAIL_BAL_AMOUNT_NEW
          ) {
            const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
            const uploadAmount = Number(
              unformattedAmountPipeFilter.transform(
                this.fileDetails.odFileAmount,
                'SAR'
              )
            );
            const debitAmount = Number(
              unformattedAmountPipeFilter.transform(
                this.getBalanceAmount[0].CURR_AVAIL_BAL_AMOUNT_NEW,
                'SAR'
              )
            );

            this.balanceValidation = false;
            this.getShowProceedBalanceValidation.emit(this.balanceValidation);
            // if (uploadAmount < debitAmount) {
            //   this.balanceValidation = false;
            //   this.getShowProceedBalanceValidation.emit(this.balanceValidation);
            //   // this.getAuthorizationData();
            // } else {
            //   this.balanceValidation = true;
            //   this.getShowProceedBalanceValidation.emit(this.balanceValidation);
            // }
          }
        }

        if (
          res.data.fileStatusCd === 'PNCONV' ||
          res.data.fileStatusCd === null
        ) {
         this.fileApiAutoFetch = setTimeout(() => {
            this.fetchFileDetails();
          }, intervalLimit);
        } else {
          this.rootScopeData.validationErrorToast = false;
          if (this.fileApiAutoFetch) {
            clearTimeout(this.fileApiAutoFetch);
          }
          this.isLoadingCompeleteMedium = true;
        }
      },
      (error: any) => {
        this.rootScopeData.validationErrorToast = false;
        this.fileApiAutoFetch = setTimeout(() => {
          this.fetchFileDetails();
        }, intervalLimit);
      }
    );
    this.subscriptions.push(fileDetails);
  }

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }

  toCancel() {
    this.showNext = false;
    this.getClickEmit.emit(this.showNext);
  }

  submit() {
    if (this.fileDetails?.fileStatusCd === 'PNRFV') {
      this.showNext = true;
      this.getClickEmit.emit(this.showNext);
    }
  }

  onUploadDownload() {
 
    this.fileUploadedDetails = {
      flag: 'FILEDLD',
      moduleId: 'FILEDLD',
      fileName: this.uploadFileDetails?.selectedFile?.title
        ? this.uploadFileDetails?.selectedFile?.title
        : '',
      fileActualName: this.uploadFileDetails?.selectedFile?.fileActualName
        ? this.uploadFileDetails?.selectedFile?.fileActualName
        : '',
      attachmentRefNumber: '',
    };
  }

  // accNoValidation() {
  //   if (this.uploadFileDetails.format.type === 'csv') {

  //     this.isLoadingCompelete = false;
  //     let param = {
  //       accNo: this.uploadFileDetails?.fromAccount?.OD_ACC_NO ? this.uploadFileDetails.fromAccount.OD_ACC_NO : "",
  //       unitId: this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : '',
  //       SUB_TYPE: this.uploadFileDetails?.fileType?.subType ? this.uploadFileDetails.fileType.subType : ""
  //     };

  //     const accNoValidation = this.payrollService
  //       .accountNumberValidation(param)
  //       .subscribe(
  //         (res: any) => {
  //           this.isLoadingCompelete = true;
  //           if (
  //             res.dataValue.isAccountValid === 'NO' ||
  //             res.dataValue.isAccountValid === 'No'
  //           ) {
  //             this.tooltipAcc = true;
  //             if (this.tooltipAcc) {
  //               this.openDialogWithTemplateRef(this.id);
  //             }
  //           } else {
  //             this.tooltipAcc = false;
  //           }
  //         },
  //         (error: any) => {
  //           this.isLoadingCompelete = true;
  //         }
  //       );
  //     this.subscriptions.push(accNoValidation);
  //   }
  // }

  onArrowClick() {
    this.onAccountClickEmit.emit();
  }

  ngOnDestroy(): void {
    // this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    
    clearTimeout(this.fileApiAutoFetch);
    this.rootScopeData.validationErrorToast = false;
  }
}
