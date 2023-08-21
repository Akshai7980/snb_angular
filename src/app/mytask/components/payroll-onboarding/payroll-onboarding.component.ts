import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import {
  showFilteredRecords,
  showFilteredRows,
} from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';
import {
  totalRecordsPerRequest,
  pageOptions,
} from 'src/app/utility/paginator-config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payroll-onboarding',
  templateUrl: './payroll-onboarding.component.html',
  styleUrls: ['./payroll-onboarding.component.scss'],
})
export class PayrollOnboardingComponent implements OnInit {
  isLoadingCompelete: boolean = true;
  dataSource: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  onBoardingData: any = [];
  tablePageSize: any;
  noRecordFlag: boolean = false;
  subscriptions: Subscription[] = [];
  fromRow: any;
  toRow: any;
  dataSourceLength: any;
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_REC',
    btnLabel: 'LBL_APPLY_NOW',
    btnLink: '/dashboard',
    showBtn: 'false',
    showMsg: 'true',
    showIcon: 'true',
  };
  feeDetails: any = {};
  currentColumn: any = 'referenceNo';
  sortDirection: any = 'desc';
  isRefreshFlag: boolean = false;
  totalRecords: any;
  refreshClickedFlag: boolean = false;

  constructor(private router: Router, private myTaskService: MyTaskService) {}

  ngOnInit(): void {
    this.tablePageSize = pageOptions;
    this.rootScopeData.paymentActiveTabName = 'PayrollOnboarding';
    this.getOnboardingSummary();
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    // console.log('rootScopeData:', this.rootScopeData);
  }

  getOnboardingSummary() {
    const params = {
      groupBy: '',
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortColumn: this.currentColumn,
      sortDirection: this.sortDirection,
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      accCcy: this.rootScopeData.equivalentCurrency,
    };
    this.isLoadingCompelete = false;
    const onboardSummary = this.myTaskService
      .payrollOnboardingSummary(params)
      .subscribe(
        (res: any) => {
          this.isLoadingCompelete = true;
          if (res.data.length > 0) {
            // this.onBoardingData = res.data;
            if(this.isRefreshFlag === false){
              this.onBoardingData = this.onBoardingData.concat(res.data);
            }else{
              this.onBoardingData = res.data;
              this.isRefreshFlag = false;
            }
            this.refreshClickedFlag = false;
            this.dataSource = new MatTableDataSource(this.onBoardingData);
            this.totalRecords = res.headerValue.totalCount;
            this.dataSource.paginator = this.commonPagination.paginator;
            this.noRecordFlag = false;
          } else {
            this.noRecordFlag = true;
          }
        },
        (err: any) => {
          this.isLoadingCompelete = true;
          this.noRecordFlag = true;
        }
      );
    this.subscriptions.push(onboardSummary);
  }

  fetchFeeDetails(accDetails: any, routeUrl: string) {
    this.rootScopeData.pendingActivitiesServiceRequestObject=accDetails
    const params = {
      accNo: accDetails.accNo,
      subProductName: 'PAYONBD',
      unitId: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.isLoadingCompelete = false;
    this.myTaskService.getFeeDetailsPayrollOnboarding(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data) {
          this.feeDetails = res.data;
          for (const key in this.feeDetails) {
            if (
              key === 'setupFee' ||
              key === 'monthlyFee' ||
              key === 'prepaidCards' ||
              key === 'perSNBrecord' ||
              key === 'perSarieRecord'
            ) {
              const value = this.feeDetails[key];
              if(value) {
                let currencyFormatPipeFilter = new CurrencyFormatPipe();
                const convertedAmount = currencyFormatPipeFilter.transform(
                  value,
                  this.onBoardingData.ccy
                );
                this.feeDetails[key] = convertedAmount;
              }
            }
          }
          const data = {
            feeDetails: this.feeDetails,
            onBoardingDetails: accDetails,
          };
          this.myTaskService.setSelectedElementDetails(data);
          this.router.navigate([routeUrl]);
        }
      },
      (err) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  triggerSearchFilter(event: any): void {
    let columnsToSearch = [
      { name: 'referenceNo', fieldType: 'string' },
      { name: 'setupFee', fieldType: 'amount1' },
      { name: 'accNo', fieldType: 'string' },
      { name: 'statusDesc', fieldType: 'string' },
    ];
    let tableData = showFilteredRecords(
      this.onBoardingData,
      columnsToSearch,
      event.target.value
    );
    showFilteredRows('serviceRequestDefaultCntr', event.target.value);
    this.dataSource = new MatTableDataSource(tableData);
    this.dataSource.paginator = this.commonPagination.paginator;
  }

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.pageSize = 5;
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.firstPage();
    this.refreshClickedFlag = true;
    this.getOnboardingSummary();
  }

  goToDetailsScreen(row: any) {
    this.fetchFeeDetails(row, '/mytask/payrollOnboardingDetails');
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getOnboardingSummary();
  }

  goToAuthorize(event: any, element: any) {
    event.stopImmediatePropagation();
    this.fetchFeeDetails(element, '/mytask/payrollOnboardingAuthorize');
  }

  goToReject(event: any, element: any) {
    event.stopImmediatePropagation();
    this.fetchFeeDetails(element, '/mytask/payrollOnboardingReject');
  }

  sortColumn(colName: any) {
    if (!this.currentColumn || !this.sortDirection) return;
    this.currentColumn = colName;
    this.sortDirection === 'desc'
      ? (this.sortDirection = 'asc')
      : (this.sortDirection = 'desc');
    (this.fromRow = 0), this.getOnboardingSummary();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  displayedColumns: string[] = [
    'referenceNo',
    'setupFee',
    'accNo',
    'statusDesc',
    'action',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
}
