import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Input,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';

@Component({
  selector: 'app-sp-inquiry-summary',
  templateUrl: './sp-inquiry-summary.component.html',
  styleUrls: ['./sp-inquiry-summary.component.scss'],
})
export class SpInquirySummaryComponent implements OnInit, AfterViewInit {
  isLoadingComplete: boolean = true;
  noRecordFlag: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() payrollInquiryList: any;
  payrollInquiryListDataSource: any = {};
  moduleId: string = '';
  totalRecords: any;
  dataSourceLength: any;
  filterArray: any = [];
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  @ViewChild(MatSort) sort!: MatSort;

  noRecordFoundObject = {
    msg: 'LBL_NO_PAYROLL_INQUIRY_FOUND',
    btnLabel: 'LBL_APPLY_NOW',
    btnLink: '/dashboard',
    showBtn: 'false',
    showMsg: 'true',
    showIcon: 'true',
  };

  displayedColumns: string[] = [
    'transactionRefNo',
    'fromAccountId',
    'totalRecords',
    'valueDate',
    'totalAmount',
    'fileName',
    'fileType',
  ];
  printSection = 'payrollInquiryRecords';
  logo = 'assets/images/snb-logo-print.png';
  isVendorPayment: boolean = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.rootScopeData.filterTableId = 'stopPaymentInquiryTable';
    this.isVendorPayment = this.router.url === '/payroll/vendor-stop-payment';
    this.rootScopeData.selectedRecordsForReview = [];
    if (this.payrollInquiryList && this.payrollInquiryList.length) {
      this.payrollInquiryListDataSource = new MatTableDataSource(
        this.payrollInquiryList
      );
      setTimeout(() => {
        this.payrollInquiryListDataSource.sort = this.sort;
      });
      this.totalRecords = this.payrollInquiryList.length;
    } else {
      this.noRecordFlag = true;
    }
  }

  ngAfterViewInit(): void {
    this.payrollInquiryListDataSource.paginator =
      this.commonPagination.paginator;
  }

  showDetails(selectedInquiry: any): void {
    this.rootScopeData.selectedInquiryForStopPayment = selectedInquiry;
    this.isVendorPayment
      ? this.router.navigate(['payroll/vendor-stop-payment-details'])
      : this.router.navigate(['payroll/stop-payment-details']);
  }

  triggerSearchFilter(event: any) {
    const tableData = showFilteredRecords(
      this.payrollInquiryList,
      [
        { name: 'transactionRefNo', fieldType: 'string' },
        { name: 'fromAccountId', fieldType: 'string' },
        { name: 'totalRecords', fieldType: 'string' },
        { name: 'valueDate', fieldType: 'date' },
        { name: 'totalAmount', fieldType: 'amount1' },
        { name: 'fileName', fieldType: 'string' },
        { name: 'fileType', fieldType: 'string' },
      ],
      event.target.value
    );
    this.payrollInquiryListDataSource = new MatTableDataSource(tableData);
    this.payrollInquiryListDataSource.paginator =
      this.commonPagination.paginator;
    setTimeout(() => {
      this.payrollInquiryListDataSource.sort = this.sort;
    });
  }
}
