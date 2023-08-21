import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-editable-record-summary',
  templateUrl: './editable-record-summary.component.html',
  styleUrls: ['./editable-record-summary.component.scss'],
})
export class EditableRecordSummaryComponent implements OnInit, AfterViewInit {
  isLoadingComplete = true;
  noRecordFlag: boolean = false;
  isShowSummaryTool: boolean = true;

  @Input() recordSummaryReview!: boolean;
  selectedAll: any;
  dataSourceLength: any;
  totalRecords: any;
  recordSummaryDataToPass: any = new MatTableDataSource([]);
  selectedRecordsForReview: any = [];
  rootScopeData: RootScopeDeclare = RootScopeData;
  moduleId: string = '';

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  noRecordFoundInfoObj: any = {
    msg: 'LBL_NO_SUMMARY_FOUND',
    btnLabel: 'LBL_APPLY_NOW',
    btnLink: '/dashboard',
    showBtn: 'false',
    showMsg: 'true',
    showIcon: 'true',
  };
  sortDirection: string = 'recordNumber';
  currentColumn: string = 'desc';

  displayColumns: string[] = [
    'checkbox',
    'recordNo',
    'beneficiaryBankId',
    'fromAccountId',
    'beneficiaryName',
    'amount',
    'uti',
    'childRef',
    'transactionReference',
    'status',
    'remove',
  ];
  recordSummaryData = [];

  constructor(private router: Router, private payrollService: PayrollService) {}

  ngOnInit(): void {
    if (this.recordSummaryReview) {
      this.displayColumns.shift();
      this.isLoadingComplete = true;
      this.recordSummaryDataToPass = new MatTableDataSource(
        this.rootScopeData.selectedRecordsForReview
      );
      this.dataSourceLength =
        this.rootScopeData.selectedRecordsForReview.length;
      this.recordSummaryData = this.rootScopeData.selectedRecordsForReview;
      this.selectedRecordsForReview = this.recordSummaryData;
      this.rootScopeData.selectedRecordsForReview = this.recordSummaryData;
      this.moduleId = 'STPPMNTRECSUM';
    } else {
      this.displayColumns.splice(-1);
      this.getRecordDetails(
        this.payrollService.getStopPaymentRecordSummary({
          refNo: this.rootScopeData.stopPaymentTransferDetails.referenceNum,
          fileSeqNo: this.rootScopeData.selectedInquiryForStopPayment.fileSeqNo,
        })
      );
      this.moduleId = 'STOPPMNTFILETRANLIST';
      this.rootScopeData.selectedRecordsForReview = [];
    }
  }

  ngAfterViewInit(): void {
    if (this.commonPagination)
      this.recordSummaryDataToPass.paginator = this.commonPagination.paginator;
  }

  getRecordDetails(method: any) {
    this.isLoadingComplete = false;
    method.subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        this.recordSummaryDataToPass = new MatTableDataSource(
          res.dataValue.records
        );
        this.dataSourceLength = res.dataValue.records.length;
        this.recordSummaryData = res.dataValue.records;
        this.totalRecords = res.dataValue.totalRecords;
        if (this.recordSummaryReview) {
          this.selectedRecordsForReview = this.recordSummaryData;
          this.rootScopeData.selectedRecordsForReview = this.recordSummaryData;
        }
        if (this.commonPagination && !this.recordSummaryReview)
          this.recordSummaryDataToPass.paginator =
            this.commonPagination.paginator;
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  triggerSearchFilter(event: any): void {
    const columnsToSearch = [
      { name: 'recordNo', fieldType: 'string' },
      { name: 'beneficiaryBankId', fieldType: 'string' },
      { name: 'fromAccountId', fieldType: 'string' },
      { name: 'beneficiaryName', fieldType: 'string' },
      { name: 'amount', fieldType: 'string' },
      { name: 'uti', fieldType: 'string' },
      { name: 'transactionReference', fieldType: 'string' },
      { name: 'status', fieldType: 'string' },
    ];
    const tableData = showFilteredRecords(
      this.recordSummaryData,
      columnsToSearch,
      event.target.value
    );
    this.recordSummaryDataToPass = new MatTableDataSource(tableData);
    if (!this.recordSummaryReview)
      this.recordSummaryDataToPass.paginator = this.commonPagination.paginator;
    if (this.selectedRecordsForReview.length !== this.recordSummaryData.length)
      this.selectedAll = false;
  }

  triggerCheckAll(): void {
    if (this.recordSummaryDataToPass.filteredData.length <= 0) return;
    this.selectedRecordsForReview = [];

    this.recordSummaryDataToPass.filteredData.forEach((val: any) => {
      val.selected = this.selectedAll;
      this.selectedAll && this.selectedRecordsForReview.push(val);
    });

    this.rootScopeData.selectedRecordsForReview = this.selectedRecordsForReview;
  }

  triggerCheckIfAllSelected(selectedObj: any, isChecked: any) {
    if (isChecked) {
      this.selectedRecordsForReview.push(selectedObj);
      selectedObj.selected = true;
      this.selectedAll = true;
    }

    if (!isChecked) {
      this.selectedRecordsForReview = this.selectedRecordsForReview.filter(
        (val: any) => val.recordNo !== selectedObj.recordNo
      );
      selectedObj.selected = false;
    }

    if (
      this.selectedRecordsForReview.length !==
      this.recordSummaryDataToPass.filteredData.length
    )
      this.selectedAll = false;

    this.rootScopeData.selectedRecordsForReview = this.selectedRecordsForReview;
    if (this.recordSummaryReview) {
      this.recordSummaryData = this.selectedRecordsForReview;
      this.recordSummaryDataToPass = new MatTableDataSource(
        this.recordSummaryData
      );
      if (this.selectedRecordsForReview.length <= 0) {
        this.router.navigate(['/payroll/stop-payment-details']);
        this.rootScopeData.selectedStopPaymentType = 'record';
      }
    }
  }

  expandPanel(matExpansionPanel: any, event: any): void {
    if (
      event.target.classList &&
      event.target.classList.contains('mat-expansion-indicator')
    ) {
      this.isShowSummaryTool
        ? matExpansionPanel.close()
        : matExpansionPanel.open();
      this.isShowSummaryTool = !this.isShowSummaryTool;
    } else {
      !this.isShowSummaryTool
        ? matExpansionPanel.close()
        : matExpansionPanel.open();
    }
  }
}
