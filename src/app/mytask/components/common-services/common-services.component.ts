import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-common-services',
  templateUrl: './common-services.component.html',
  styleUrls: ['./common-services.component.scss']
})
export class CommonServicesComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  isLoadingCompelete: boolean = true;
  dataSource: any;
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

  constructor(private router: Router, private myTaskService: MyTaskService) { }

  ngOnInit(): void {
    this.rootScopeData.paymentActiveTabName = 'CommonServices'
    this.tablePageSize = pageOptions;
    this.getcommonServiceSummary();
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    // console.log('rootScopeData:', this.rootScopeData);
  }


  
  getcommonServiceSummary() {
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
      .commonServiceSummary(params)
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

  triggerSearchFilter(event: any): void {
    let columnsToSearch = [
      { name: 'refNo', fieldType: 'string' },
      { name: 'requestType', fieldType: 'amount1' },
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
    this.commonPagination.paginator.firstPage();
    this.getcommonServiceSummary();
  }

  goToDetailsScreen(row: any) {
      this.rootScopeData.nationAddressDetails=row;
      this.router.navigate(['/mytask/nationalAddressDetails']);
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getcommonServiceSummary();
  }

  goToAuthorize(event: any, item: any) {
    event.stopImmediatePropagation();    // 
    this.rootScopeData.myTaskApproveDetails = {
      requestType : item.requestType,
      crNum : item.crNum,
      refNo : item.refNo,
      gcif : this.rootScopeData.userInfo.corpID,
      acc_NO : item.crNum,
      productCode : item.productCode,
      subProdCode : item.subProductCode,
      hostCode : item.hostCode,
      action : item.functionCode,
      version : '1',
      buildNo : item.buildNo,
      streetName : item.streetName,
      distName : item.distName,
      city : item.city,
      zipCode : item.zipCode,
      countryName : item.countryName
    }
    this.router.navigate(['/mytask/authorizeCommon']);
  }

  goToReject(event: any, item: any) {
    event.stopImmediatePropagation();
    this.rootScopeData.myTaskRejectDetails = {
      requestType : item.requestType,
      crNum : item.crNum,
      refNo : item.refNo,
      gcif : this.rootScopeData.userInfo.corpID,
      acc_NO : item.crNum,
      productCode : item.productCode,
      subProdCode : item.subProductCode,
      hostCode : item.hostCode,
      action : item.functionCode,
      version : '1',
      buildNo : item.buildNo,
      streetName : item.streetName,
      distName : item.distName,
      city : item.city,
      zipCode : item.zipCode,
      countryName : item.countryName
    }
   this.router.navigate(['/mytask/rejectCommon']);
  }

  sortColumn(colName: any) {
    if (!this.currentColumn || !this.sortDirection) return;
    this.currentColumn = colName;
    this.sortDirection === 'desc'
      ? (this.sortDirection = 'asc')
      : (this.sortDirection = 'desc');
    (this.fromRow = 0), this.getcommonServiceSummary();
  }

  displayedColumns: string[] = [
    'referenceNo',
    'reqType',
    'action',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

}
