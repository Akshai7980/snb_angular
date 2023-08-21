import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-service-inquiry-layout',
  templateUrl: './service-inquiry-layout.component.html',
  styleUrls: ['./service-inquiry-layout.component.scss'],
})
export class ServiceInquiryLayoutComponent implements OnInit, AfterViewInit {
  contextMenuList = [];
  creditCardList: any = [];
  creditCardListDataSource: any = {};
  serviceTypes: any = [];
  cardTypes: any = [];

  displayedColumns: string[] = [
    'cardNo',
    'cardName',
    'cardType',
    'cardDate',
    'serviceType',
    'cifNo'
  ];
  dataSourceToPass: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  tablePageSize: number[];
  fromRow: number;
  toRow: number;
  filterArray: any = [];

  noRecordFlag: boolean = false;
  responseHeader: any = {};
  currentColumn: string = 'cardNo';
  sortDirection: string = 'desc';
  totalRecords: string = '';
  isLoadingComplete: boolean = true;
  noRecordFoundInfoObj: any = {
    msg: 'LBL_NO_RECORDS_FOUND',
    showMsg: 'true',
  };
  printSection = 'serviceInquirySummaryTable';
  logo = 'assets/images/snb-logo-print.png';
  @Output() getServiceInquiryEmit = new EventEmitter<any>();
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  constructor(private cardService: CardsService) {
    this.rootScopeData.activeTabName = 'credit';
    this.rootScopeData.filterTableId = 'serviceInquirytable';
    this.rootScopeData.advSearchCurrentPage = 'serviceInquiryCredit';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;

    //Change the login after API integration
    this.responseHeader.sortColumn = '';
    this.responseHeader.sortOrder = 'desc';
  }

  ngOnInit(): void {
    this.getCreditCardList();
    this.getCifLookup();
  }

  ngAfterViewInit(): void {
    this.creditCardListDataSource.paginator = this.commonPagination.paginator;
  }

  getCifLookup() {
    this.isLoadingComplete = false;
    this.cardService.getCifLookup().subscribe((res: any) => {
      this.isLoadingComplete = true;
      this.contextMenuList = res?.dataValue.map((val: any) => {
        return {
          displayName: val.cifName,
          CIF_NO: val.cifNo,
          value: val.cifNo
        }
      })
    }, () => {
      this.isLoadingComplete = true;
    })
  }

  triggerDropdownFilter(event: any) {
    showFilteredRows(this.rootScopeData.filterTableId, event);
  }

  advancedSearchApply(event: any) {
    const fromDate = event.fromDate;
    const toDate = event.toDate;
    const serviceType = event.serviceType;
    const cardType = event.cardType;
    const type = event.type;
    this.sortDirection = event.sortOrder;
    const period = event.period;

    this.filterArray = [];

    let passingObj1 = {
      filterField: 'serviceType',
      filterConstraint: 'contains',
      filterValue: '',
      fromAmt: '',
      toAmt: '',
      fromDate: '',
      toDate: '',
      serviceType: serviceType,
      cardType: ''
    };

    this.filterArray.push(passingObj1);

    passingObj1 = {
      filterField: 'cardType',
      filterConstraint: 'contains',
      filterValue: '',
      fromAmt: '',
      toAmt: '',
      fromDate: '',
      toDate: '',
      serviceType: '',
      cardType: cardType
    };

    this.filterArray.push(passingObj1);

    if (type == 'Date') {
      passingObj1 = {
        filterField: 'cardDate',
        filterConstraint: 'date',
        filterValue: '',
        fromAmt: '',
        toAmt: '',
        fromDate: fromDate,
        toDate: toDate,
        serviceType: '',
        cardType: ''
      };

      this.filterArray.push(passingObj1);
    } else {
      passingObj1 = {
        filterField: 'period',
        filterConstraint: 'contains',
        filterValue: period,
        fromAmt: '',
        toAmt: '',
        fromDate: '',
        toDate: '',
        serviceType: '',
        cardType: ''
      };

      this.filterArray.push(passingObj1);
    }
    this.getCreditCardList();
  }

  triggerSearchFilter(event: any) {
    const columnsToSearch = [
      { name: 'cardNo', fieldType: 'string' },
      { name: 'cardName', fieldType: 'string' },
      { name: 'cardType', fieldType: 'string' },
      { name: 'cardDate', fieldType: 'date' },
      { name: 'serviceType', fieldType: 'string' },
    ];
    const tableData = showFilteredRecords(
      this.creditCardList,
      columnsToSearch,
      event.target.value
    );
    this.creditCardListDataSource = new MatTableDataSource(tableData);
    this.creditCardListDataSource.paginator = this.commonPagination.paginator;
  }

  refreshPayrollInquiry() {
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.getCreditCardList();
  }

  selectedRecord(event: any, element: any) {
    event?.stopPropagation();
  }

  getCreditCardList() {
    this.isLoadingComplete = false;
    const params = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortDirection,
      fromRowNo: this.fromRow,
      toRowNo: this.toRow,
      filterMap: this.filterArray,
      unitId: this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : ''
    };
    this.cardService.getServiceInquiryLists(params).subscribe((res: any) => {
      this.isLoadingComplete = true;
      if (res.data.length <= 0) {
        this.noRecordFlag = true;
        return;
      }
      this.creditCardList = res.data;
      this.serviceTypes = [];
      this.cardTypes = [];
      let serviceTypesMap: any = {};
      let cardTypesMap: any = {};
      this.creditCardList.forEach((val: any) => {
        // this.serviceTypes
        serviceTypesMap[val.serviceType] = val.serviceType;
        cardTypesMap[val.cardType] = val.cardType;
      });
      this.serviceTypes = Object.keys(serviceTypesMap);
      this.cardTypes = Object.keys(cardTypesMap);
      this.creditCardListDataSource = new MatTableDataSource(this.creditCardList);
      this.totalRecords = res.headerValue.totalCount;
      this.creditCardListDataSource.paginator = this.commonPagination.paginator;
    }, () => {
      this.isLoadingComplete = true;
    });
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
  }

  onClickRecord(row: any) {
    const data = {
      requestData: row,
      canProceed: true,
    };
    this.getServiceInquiryEmit.emit(data);
  }
}
