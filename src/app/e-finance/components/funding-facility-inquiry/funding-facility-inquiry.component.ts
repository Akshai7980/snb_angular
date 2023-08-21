import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import {
  pageOptions,
  totalRecordsPerRequest,
} from 'src/app/utility/paginator-config';
import {
  showFilteredRecords,
  showFilteredRows,
} from 'src/app/utility/tableFilter';
import { EFinanceService } from '../../services/e-finance.service';

@Component({
  selector: 'app-funding-facility-inquiry',
  templateUrl: './funding-facility-inquiry.component.html',
  styleUrls: ['./funding-facility-inquiry.component.scss'],
})
export class FundingFacilityInquiryComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  curerentSelection: any;
  dataSourceToPass: any;
  displayedColumns: string[] = [
    'facilityId',
    'productName',
    'facilityStructureAvailableLimit',
    'availableLimit',
    'action',
  ];
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: 'Apply Now',
    btnLink: '/dashboard',
    showBtn: 'true',
    showMsg: 'true',
    showIcon: 'true',
  };
  dataSource: any;
  selectedGroup: string = '';
  fromRow: any;
  toRow: any;
  filterArray: any = [];
  noRecordFlag: boolean = false;
  tablePageSize: any;
  totalRecords: any;
  isLoadingCompelete = true;
  currentColumn: any = 'facilityId';
  sortDirection: any = 'desc';
  isRefreshFlag: boolean = false;
  routeDetailScreen: any;
  filterConstraint: any;
  status: any;
  filterField: any;
  fromDate: any;
  toDate: any;
  filterFlag: any;
  facilityId: any;
  convertedArray: any;

  productName: any;

  facilityLimitFrom: any;
  facilityLimitTo: any;

  availableAmountFrom: any;

  availableAmountTo: any;

  refreshClickedFlag = false;

  contextMenuList = [];

  @Output() dataSourceLengthValue = new EventEmitter();
  constructor(
    private eFinanceService: EFinanceService,
    private router: Router
  ) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.rootScopeData.advSearchCurrentPage = 'eFinance';
    this.rootScopeData.filterTableId = 'eFinanceTable';
    this.getFundedFacilityList();
    this.getPoSFinanceInquiryCiflkp();
  }

  goToDetailsScreen(row: any) {
    this.rootScopeData.eFinanceSummary = row;
    this.router.navigate(['/eFinance/fundingFacilityReview']);
  }
  advancedSearchApply(event: any) {
    this.facilityId = event.facilityId;
    this.productName = event.ProductName;
    this.facilityLimitFrom = event.fromLimit;
    this.facilityLimitTo = event.toLimit;
    this.availableAmountFrom = event.fromAmount;
    this.availableAmountTo = event.toAmount;
    this.filterConstraint = 'contains';
    this.filterFlag = 'Y';
    this.getFundedFacilityList();
  }
  getFundedFacilityList() {
    this.isLoadingCompelete = false;

    let params = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortDirection,
      fromRowNo: this.fromRow,
      toRowNo: this.toRow,
      filterField: this.productName,
      filterConstraint: this.filterConstraint,
      facilityLimitFrom: this.facilityLimitFrom,
      facilityLimitTo: this.facilityLimitTo,
      availableAmountFrom: this.availableAmountFrom,
      availableAmountTo: this.availableAmountTo,
      facilityId: this.facilityId,
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      filterFlag: this.filterFlag,
    };
    this.eFinanceService.getFundedFacilityList(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;

        if (this.isRefreshFlag === false) {
          this.dataSource = res.data;
          this.convertedArray = this.dataSource.map(function (item: any) {
            var obj = item.facilityDetails;
            for (var o in item) {
              if (o != 'facilityDetails') obj[o] = item[o];
            }
            return obj;
          });
        } else {
          this.dataSource = res.data;
          this.convertedArray = this.dataSource.map(function (item: any) {
            var obj = item.facilityDetails;
            for (var o in item) {
              if (o != 'facilityDetails') obj[o] = item[o];
            }
            return obj;
          });
          this.isRefreshFlag = false;
        }
        this.refreshClickedFlag = false;
        if (this.dataSource) {
          this.noRecordFlag = false;
          this.dataSourceLength = this.dataSource.length;
          this.dataSourceToPass = new MatTableDataSource(this.convertedArray);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.totalRecords = res.headerValue.totalCount;
        } else {
          this.noRecordFlag = true;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
        // this.rootScopeData.benUploadBeneficiaryCount = 0;
      }
    );
  }
  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getFundedFacilityList();
  }
  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { name: 'facilityId', fieldType: 'string' },
      { name: 'productName', fieldType: 'string' },
      { name: 'facilityStructureAvailableLimit', fieldType: 'string' },
      { name: 'availableLimit', fieldType: 'string' },
    ];

    let tableData = showFilteredRecords(
      this.convertedArray,
      columnsToSearch,
      event.target.value
    );
    this.dataSourceToPass = new MatTableDataSource(tableData);

    if (tableData && tableData.length) {
      this.noRecordFlag = false;
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
    } else {
      this.noRecordFlag = true;
    }
  }

  refreshSummary() {
    this.getFundedFacilityList();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getFundedFacilityList();
  }

  selectedRecord(event: any, element: any) {
    this.rootScopeData.eFinanceSummary = element;
    this.routeDetailScreen = '/eFinance/fundingFacilityReview';
    event?.stopPropagation();
  }

  getPoSFinanceInquiryCiflkp() {
    this.eFinanceService.getPoSFinanceInquiryCiflkp().subscribe((res: any) => {
      this.contextMenuList = res?.dataValue.map((val: any) => {
        return {
          displayName: val.cifName,
          CIF_NO: val.cifNo,
          value: val.cifNo,
        };
      });
    });
  }

  triggerDropdownFilter(event: any) {
    showFilteredRows(this.rootScopeData.filterTableId, event);
  }
}
