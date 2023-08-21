import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { PosService } from '../../services/pos.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';
import { AccountDetailsService } from 'src/app/accounts/services/account-details.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pos-multi-claim-request-merchant-detail',
  templateUrl: './pos-multi-claim-request-merchant-detail.component.html',
  styleUrls: ['./pos-multi-claim-request-merchant-detail.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PosMultiClaimRequestMerchantDetailComponent implements OnInit {
  showInitialPage: boolean = false;
  @Output() goToInitialPage = new EventEmitter<any>();
  dataSource: any;
  dataSourceLength: any;
  responseHeader: any;
  totalRecords: any;

  contextMenuList: any = [];
  displayedColumns: string[] = [
    'termID',
    'sequence',
    'cardType',
    'cardNumber',
    'Date',
    'amountinSAR',
    'action',
  ];
  moreActionListInActive: any = [];
  expandedElement: any;
  expandedRows: { [key: number]: boolean } = {};
  dataSourceToPass!: MatTableDataSource<any>;
  rootScopeData: RootScopeDeclare = RootScopeData;
  displayedColumnsWithExpand = [
    'expand',
    'res_Txn_Dt',
    'res_Description',
    'res_Credit_Amt',
    'hide_res_Credit_Amt',
    'res_Running_Bal',
    'hide_res_Running_Bal',
    'res_TxnType',
    'Action',
  ];

  financialTypeDropdown: any;
  amountType = [{ value: 'Full' }, { value: 'Partial' }];
  showAmountConatiner: boolean = false;
  uploadInput: any;
  clearFields: any;
  downloadTemplateData: any = {};
  selectedType: any;
  selectFormat: any;
  selectedDebitObj: boolean = false;
  csvClicked: boolean = false;
  txtClicked: boolean = true;
  fileSizeValidationErrorMessage: boolean = false;
  fileTypeValidationErrorMessage: boolean = false;
  fileNameValidationErrorMessage: boolean = false;
  fileSize = 10;
  mobileNumber: any;
  financialType: any;
  comment: any;
  description: any;
  amountValue: any;
  email: string = '';
  leftToggle = true;
  rightToggle = false;
  file_size: string = '';

  filename: any;
  actualFileName: any;
  fileFormat: any;
  fileChecksum: any;
  proceedBtnShow: boolean = false;
  constructor(
    public posService: PosService,
    public accService: AccountDetailsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTransactionList();
    this.rootScopeData.advSearchCurrentPage = 'posTransaction';
    this.uploadInput = {
      uploadFileTitle: 'Upload File',
      supportedFileTypes: systemproperty.posMultiClaim,
      supportedFileSize: systemproperty.benUploadSupportedFileSize,
    };

    this.getEmail();
    this.getFinancialTypeDropdown();
  }

  clearAllFields() {
    this.showInitialPage = true;
    const data = {
      clear: this.showInitialPage,
    };
    this.goToInitialPage.emit(data);
  }

  leftToggleCntl() {
    document.getElementById('leftToggle')?.classList.add('active');
    document.getElementById('rightToggle')?.classList.remove('active');
    this.leftToggle = true;
    this.rightToggle = false;
  }
  rightToggleCntl() {
    document.getElementById('rightToggle')?.classList.add('active');
    document.getElementById('leftToggle')?.classList.remove('active');
    this.rightToggle = true;
    this.leftToggle = false;
  }

  getTransactionList() {
    this.posService.getTransactionList().subscribe(
      (res: any) => {
        this.dataSource = res.data;
        this.dataSourceLength = this.dataSource.length;

        if (res.headerValue !== undefined) {
          this.responseHeader = res.headerValue;
          this.totalRecords = this.responseHeader.totalCount;
        }
        if (
          this.dataSource === null ||
          this.dataSource === '' ||
          this.dataSource === undefined ||
          this.dataSource.length === 0
        ) {
        }
        if (this.dataSource) {
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        }
      },
      (error) => {}
    );
  }

  onFileAdded(eventData: any) {
    this.filename = eventData.title;
    this.actualFileName = eventData.fileActualName;
    this.file_size = eventData.size;
    this.fileFormat = eventData.format;
    this.fileChecksum = eventData.checkSum;
    this.fileTypeValidationErrorMessage = eventData.typeValidFlag
      ? false
      : true;
    this.fileSizeValidationErrorMessage = eventData.fileSizeValidFlag
      ? true
      : false;
    this.fileNameValidationErrorMessage = eventData.isFileNameValid
      ? false
      : true;

    if (
      this.filename &&
      !this.fileSizeValidationErrorMessage &&
      !this.fileTypeValidationErrorMessage &&
      !this.fileNameValidationErrorMessage
    ) {
      this.proceedBtnShow = true;
    } else {
      this.proceedBtnShow = false;
    }
  }

  getEmail() {
    this.posService.getEmail().subscribe(
      (res: any) => {
        if (res.data) {
          this.email = res.data.emailAdd;
        }
      },
      (error) => {}
    );
  }

  getFinancialTypeDropdown() {
    this.posService.getFinancialTypeDropdown().subscribe(
      (res: any) => {
        if (res.data) {
          this.financialTypeDropdown = res.data[0].financialClaimType;
          console.log(
            this.financialTypeDropdown,
            ' this.financialTypeDropdown'
          );
        }
      },
      (error) => {}
    );
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'termID', fieldType: 'string' },
      { name: 'sequence', fieldType: 'string' },
      { name: 'cardType', fieldType: 'string' },
      { name: 'Date', fieldType: 'string' },
      { name: 'amountinSAR', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);
  }

  selectedRecord(event: any, element: any) {
    this.rootScopeData.posSelectedTransaction = element;

    if (this.moreActionListInActive == 0) {
      let merchantFinaceDispute = {
        display_key: 'LBL_MERCHANT_FINANCE_DISPUTE',
        value: 'merchant_finace_dispute',
        item_id: 'MERCHANT_FINANCE_DISPUTE',
      };
      this.moreActionListInActive.push(merchantFinaceDispute);
      let refundRequest = {
        display_key: 'LBL_REFUND_REQUEST',
        value: 'refund_request',
        item_id: 'REFUND_REQUEST',
      };
      this.moreActionListInActive.push(refundRequest);
      let feeDebitInquiry = {
        display_key: 'LBL_FEE_DEBIT_INQUIRY',
        value: 'FEE_DEBIT_INQUIRY',
        item_id: 'FEE_DEBIT_INQUIRY',
      };
      this.moreActionListInActive.push(feeDebitInquiry);
    }

    event?.stopPropagation();
  }

  getNarrationAPICall(data: any) {
    let params = {
      accNumber: this.rootScopeData.accDetailsObject.res_Acc_No,
      recordId: data.recordId,
    };
    // this.isLoadingCompelete = false;
    this.accService.getNarrationAPI(params).subscribe(
      (response: any) => {
        // this.isLoadingCompelete = true;
        Object.assign(data, { NARRATION: response.DATA.res_description });
      },
      (error: any) => {
        // this.isLoadingCompelete = true;
      }
    );
  }

  refreshSummary() {
    this.getTransactionList();
  }

  showAmountValue(event: any) {
    if (event.value == 'Partial') {
      this.showAmountConatiner = true;
    } else if (event.value == 'Full') {
      this.showAmountConatiner = false;
    }
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
  proceedButton(event: any) {
    if (event) {
      const data = {
        email: this.email,
        mobile: this.mobileNumber,
        financialType: this.financialType,
        comment: this.comment,
        description: this.description,
        fileName: this.filename,
        actualFileName: this.actualFileName,
        file_size: this.file_size,
        fileChecksum: this.fileChecksum,
        merchantFinace: this.leftToggle ? true : false,
      };
      this.rootScopeData.posTransactionRefundRequestDetail = data;
      this.router.navigate(['/pos/posMultiClaimRequestReview']);
      console.log(
        this.rootScopeData.posTransactionRefundRequestDetail,
        'this.rootScopeData.posTransactionRefundRequestDetail'
      );
    }
  }
  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }

  cancelButton() {
    this.mobileNumber = '';
    this.financialType = '';
    this.comment = '';
    this.description = '';
    this.showAmountConatiner = false;
  }
}
