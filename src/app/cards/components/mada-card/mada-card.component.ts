import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { CardsService } from '../../services/cards.service';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { MaskCardNumberPipe } from 'src/app/pipes/mask-card-number.pipe';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-mada-card',
  templateUrl: './mada-card.component.html',
  styleUrls: ['./mada-card.component.scss']
})
export class MadaCardComponent implements OnInit {

  //rootScopeData:RootScopeDeclare=RootScopeData;
  printSection: string = "";

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  totalRecords: any;
  dataSourceToPass: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  displayedColumns: string[] = ['maskedpan', 'name', 'statusDescription', 'expires', 'action'];
  dataSource: any;
  noRecordFoundInfoObj: any;
  norecordflag: boolean = false;
  isLoadingCompelete = true;
  sortDirection: string = '';
  currentColumn: string = '';
  enablePagination: boolean = true;
  routeDetailScreen: any;
  @Output() childEvent: EventEmitter<any> = new EventEmitter()
  responseHeader: any;
  advSearchPeriod = "";
  advSearchSearchWithin = "";
  advSearchSortOrder = "";
  advSearchFromDate = "";
  advSearchToDate = "";
  filterflag: string = "";
  filterconstraint: string = "";
  filterfield: string = "";
  maxdate = new Date();

  constructor(private datepipe: DatePipe, private cardsService: CardsService, private router: Router) {
    this.rootScopeData.activeTabName = 'MADA';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;

    this.rootScopeData.advSearchCurrentPage = 'madaCardList';
    //this.rootScopeData.accountsActiveModule = 'CASASUMMARY';
  }

  // madaCardList: any = [
  //   {
  //     txnId: "5421321343135",
  //     madaCardNumber: "10001010123000",
  //     name: "Dameer Ashan",
  //     serviceType: "Change card limit",
  //     status: "Pending",
  //     date: "10/10/2022",
  //     totalCredit:"1000000",
  //     changes:"1",
  //     currentLimit:"500",
  //     newLimit:"700",
  //     odTxnCy:"SAR"
  //   },
  //   {
  //     txnId: "5421321343136",
  //     madaCardNumber: "10001010123008",
  //     name: "Zemir Khan",
  //     serviceType: "Change card limit",
  //     status: "Pending",
  //     date: "10/10/2022",
  //     totalCredit:"1000000",
  //     changes:"1",
  //     currentLimit:"400",
  //     newLimit:"500",
  //     odTxnCy:"SAR"
  //   },
  //   {
  //     txnId: "5421321343137",
  //     madaCardNumber: "10001010123010",
  //     name: "Sheik Ashan",
  //     serviceType: "Change card limit",
  //     status: "Pending",
  //     date: "10/10/2022",
  //     totalCredit:"1000000",
  //     changes:"9",
  //     currentLimit:"700",
  //     newLimit:"1000",
  //     odTxnCy:"SAR"
  //   },
  //   {
  //     txnId: "5421321343139",
  //     madaCardNumber: "10001010123004",
  //     name: "Imitiz Shah",
  //     serviceType: "Change card limit",
  //     status: "Pending",
  //     date: "10/10/2022",
  //     totalCredit:"1000000",
  //     changes:"1",
  //     currentLimit:"500",
  //     newLimit:"600",
  //     odTxnCy:"SAR"
  //   },
  //   {
  //     txnId: "5421321343140",
  //     madaCardNumber: "10001010123100",
  //     name: "Feroz khan",
  //     serviceType: "Change card limit",
  //     status: "Pending",
  //     date: "10/10/2022",
  //     totalCredit:"1000000",
  //     changes:"1",
  //     currentLimit:"500",
  //     newLimit:"700",
  //     odTxnCy:"SAR"
  //   },
  //   {
  //     txnId: "5421321343151",
  //     madaCardNumber: "10001010123108",
  //     name: "Alamin Ashan",
  //     serviceType: "Change card limit",
  //     status: "Pending",
  //     date: "10/10/2022",
  //     totalCredit:"1000000",
  //     changes:"1",
  //     currentLimit:"500",
  //     newLimit:"700",
  //     odTxnCy:"SAR"
  //   },
  // ]

  moreActionListActive: any = [{
    display_key: 'LBL_LINK_ADDITIONAL_ACCOUNT',
    item_id: 'LINK_ADDITIONAL_ACCOUNT_CARD',
  }];
  // {
  //   display_key: 'LBL_STOP_CARD',
  //   item_id: 'STOP_MADA_CARD',
  // },
  // {
  //   display_key: 'LBL_POS_PURCHASE_LIMIT',
  //   item_id: 'POS_PURCHASE_LIMIT',
  // },
  // {
  //   display_key: 'LBL_LINK_ADDITIONAL_ACCOUNT',
  //   item_id: 'LINK_ADDITIONAL_ACCOUNT_CARD',
  // },
  // {
  //   display_key: 'LBL_RE_ISSUE_CARD',
  //   item_id: 'REISSUE_MADA_CARD',
  // }
  // ]

  moreActionListInActive: any = [
    {
      display_key: 'LBL_RE_ISSUE_CARD',
      item_id: 'REISSUE_MADA_CARD',
    }
  ]


  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_MADA_CARD_RECORDS_FOUND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "true",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getMadaSummaryRequest();
    this.printSection = "madaCardDetailsPrintSection";
  }

  getMadaSummaryRequest() {
    this.isLoadingCompelete = false;
    let params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection
    };
    this.cardsService.getMadaCardSummary(params).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      this.dataSource = res?.dataValue?.atm;
      this.dataSourceLength = this.dataSource.length;

      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
      if (
        this.dataSource === null ||
        this.dataSource === '' ||
        this.dataSource === undefined ||
        this.dataSource.length === 0
      ) {
        this.norecordflag = true;
      }
      if (res.dataValue?.atm) {
        this.totalRecords = res.dataValue?.atm.length;
        this.norecordflag = false;
        this.rootScopeData.MADASummaryCount = this.responseHeader?.totalCount;

        this.dataSourceLength = this.dataSource.length;
        // console.log(this.dataSource,"TEST::::LL::")
        this.dataSourceToPass = new MatTableDataSource(this.dataSource);

        this.dataSourceToPass.paginator = this.commonPagination?.paginator;

        // if(res?.atm?.)
      }

      // if (this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0) {
      //   this.norecordflag = !this.norecordflag;
      //   this.enablePagination = false;
      // }
    }, (error: any) => {
      this.isLoadingCompelete = true;
      this.norecordflag = true;
      this.enablePagination = false;
      //this.service.changeData("false");  //invoke new Data
      // this.rootScopeData.showSystemError = true;
    })
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getMadaSummaryRequest();
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getMadaSummaryRequest();
  }


  goToDetailsScreen(data: any) {
    // if (data.subProductCode === "CHEQUES") {
    const maskcardnumber = new MaskCardNumberPipe();
    this.rootScopeData.selectedMada = data;
    this.rootScopeData.selectedMada.expiryDate = this.datepipe.transform(this.rootScopeData.selectedMada.expires, 'dd/MM/yyyy')
    // this.rootScopeData.selectedMada.maskedCardNo = maskcardnumber.transform(data.pan);
    this.rootScopeData.selectedMada.maskedCardNo = data?.maskedpan
    this.router.navigate(['cards/mada-card-detail']);
    // }
  }

  contextMenuEmit(data: any) {
    // console.log("test", data)
  }

  selectedRecord(event: any, element: any) {

    this.constructContextMenu(element);
    this.rootScopeData.selectedMada = element;
    const maskcardnumber = new MaskCardNumberPipe();
    this.rootScopeData.selectedMada.expiryDate = this.datepipe.transform(this.rootScopeData.selectedMada.expires, "dd/MM/yyyy")
    // this.rootScopeData.selectedMada.maskedCardNo = maskcardnumber.transform(element.pan);
    this.rootScopeData.selectedMada.maskedCardNo = element?.maskedpan
    event?.stopPropagation();
  }

  constructContextMenu(elem: any) {
    let contextMenu: any = [];

    // Showing action menu based on Status, 0 means showing only, Re-issue option, if not showing all options from 'EntlSubProduct'
    // if(elem.status !== "0"){
    //   for(const rowObj of elem.EntlSubProduct){
    //     contextMenu.push({ "display_key": "LBL_" + rowObj, "item_id": rowObj })      
    //   }
    //   this.moreActionListActive = contextMenu;
    // }else{
    //   this.moreActionListActive=this.moreActionListInActive
    // }

        for (const rowObj of elem?.EntlSubProduct) {
          contextMenu.push({ "display_key": "LBL_" + rowObj, "item_id": rowObj })
        }
        this.moreActionListActive = contextMenu;

    // for (let i = 0; i < elem?.EntlSubProduct.length; i++) {
    //   contextMenu.push({ "display_key": "LBL_" + elem?.EntlSubProduct[i], "item_id": elem?.EntlSubProduct[i] })
    //   // this.moreActionListActive.push({"display_key":elem?.EntlSubProduct[i], "item_id": elem?.EntlSubProduct[i]})
    //   this.moreActionListActive = contextMenu;
    // }
  }

  refreshSummary() {
    this.getMadaSummaryRequest();
  }

  advancedSearchApply(event: any) {

  }


  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { "name": "pan", "fieldType": "string" },
      { "name": "name", "fieldType": "string" },
      { "name": "statusDescription", "fieldType": "string" },
      { "name": "expires", "fieldType": "string" }
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value);
    if (tableData && tableData.length) {
      this.norecordflag = false;
      this.dataSourceToPass = new MatTableDataSource(tableData);
      this.dataSourceToPass.paginator = this.commonPagination?.paginator;
    } else {
      this.norecordflag = true;
    }
    // this.dataSourceToPass = new MatTableDataSource(tableData);
    // this.dataSourceToPass.paginator = this.commonPagination.paginator;
    // showFilteredRows('singleInprogressDefaultCntr', event.target.value); 
  }

}
