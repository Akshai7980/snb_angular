import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import {
  showFilteredRecords,
  showFilteredRows,
} from 'src/app/utility/tableFilter';
import { TicketServiceService } from '../../services/ticket-service.service';

@Component({
  selector: 'app-pos-finance-ticket-inquiry',
  templateUrl: './pos-finance-ticket-inquiry.component.html',
  styleUrls: ['./pos-finance-ticket-inquiry.component.scss']
})
export class PosFinanceTicketInquiryComponent implements OnInit {

  printSection: string = 'posFinanceTicketInquiryPrintSection';
  logo = 'assets/images/snb-logo-print.png';

  // contextMenuList = [
  //   { displayName: 'LBL_ALL', value: 'all', CIF_NO: '12032021354313' },
  //   // {
  //   //   displayName: 'LBL_NO_PAYROLL_INQUIRY_FOUND',
  //   //   value: 'debit',
  //   //   CIF_NO: '12032021354313',
  //   // },
  // ];
  contextMenuList : any = [];

  moreActions: any = [
    {
      display_key: 'LBL_VIEWDETAILS',
      item_id: 'TICKET_INQUIRY_SUMMARY',
    },
  ];

  displayedColumns: string[] = [
    'reqNo',
    'serviceType',
    'reqStatus',
    'mobileNo',
    'creationDate',
    'closureDate'
  ];

  posFinanceTicketInquiryList: any = [];
  dataSourceLength: any;
  posFinanceTicketInquiryListDataSource: any = {};
  totalRecords: string = '';
  isLoadingComplete: boolean = true;
  noRecordFlag: boolean = false;
  noRecordFoundInfoObj: any = {};
  fromRow: number;
  toRow: number;
  currentColumn: string = 'refNo';
  sortDirection: string = 'desc';

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private ticketService: TicketServiceService,
    private router: Router
  ) {
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.rootScopeData.advSearchCurrentPage = 'posFinanceTicketInquiryList';
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      showMsg: 'true',
      showIcon: 'true',
    };
   this.getCifContextLists();
    this.getPosFinanceInquiryList();
  }

  ngAfterViewInit(): void {
    this.posFinanceTicketInquiryListDataSource.paginator =
      this.commonPagination.paginator;
  }

  triggerDropdownFilter(event: any) {
    showFilteredRows(this.rootScopeData.filterTableId, event);
  }

  advancedSearchApply(event: any) {
    //login needs to update after API integration
    // console.log(event);
  }

  triggerSearchFilter(event: any) {
    const columnsToSearch = [
      { name: 'reqNo', fieldType: 'string' },
      { name: 'serviceType', fieldType: 'string' },
      { name: 'reqStatus', fieldType: 'string' },
      { name: 'mobileNo', fieldType: 'string' },
      { name: 'creationDate', fieldType: 'string' },
      { name: 'closureDate', fieldType: 'string' }
    ];
    const tableData = showFilteredRecords(
      this.posFinanceTicketInquiryList,
      columnsToSearch,
      event.target.value
    );
    this.posFinanceTicketInquiryListDataSource = new MatTableDataSource(tableData);
    this.posFinanceTicketInquiryListDataSource.paginator =
      this.commonPagination.paginator;
  }

  refreshPayrollInquiry() {
    // update logic based on params for API
    this.getPosFinanceInquiryList();
  }

  getPosFinanceInquiryList() {
    this.isLoadingComplete = false;
    this.ticketService.getPosFinanceTicketInquiryList().subscribe((res: any) => {
      this.isLoadingComplete = true;
      this.totalRecords = res.data.length;
      this.posFinanceTicketInquiryList = res.data;
      this.posFinanceTicketInquiryListDataSource = new MatTableDataSource(res.data);
      this.posFinanceTicketInquiryListDataSource.paginator =
        this.commonPagination.paginator;
      this.dataSourceLength = res.data.length;
    },
    error => {
      this.isLoadingComplete = true;
    });
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
  }

  selectedRecord(event: any, element: any) {
    event?.stopPropagation();
    this.rootScopeData.posFinanceTicketInquirySummaryRecord = element;
  }

  onClickRecord(row: any) {
    this.rootScopeData.posFinanceTicketInquirySummaryRecord = row;
    this.router.navigate(['/ticketInquiry/summary']);

  }

  getCifContextLists(){
	this.isLoadingComplete = false;
    let param = {
      "productName":"CORESVS",
      "subProductName":"RSECMPT",
      "functionCode":"TRFFNC"
    }
		
    this.ticketService.getCifLookUP(param).subscribe((res : any) => {
	this.isLoadingComplete = true;
      if(res && res.dataValue){
        let data = res.dataValue;
            data.forEach((item : any ) => {
              this.contextMenuList.push({displayName: 'LBL_NO_PAYROLL_INQUIRY_FOUND',
                  value: 'debit', CIF_NO :  item.cifNo})
            });
      }

    }, error => {
      this.isLoadingComplete = true;
    });
  }

}
