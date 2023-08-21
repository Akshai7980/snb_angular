import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-mada-card-summary',
  templateUrl: './mada-card-summary.component.html',
  styleUrls: ['./mada-card-summary.component.scss'],
})
export class MadaCardSummaryComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  noRecordFlag: boolean = false;
  isLoadingCompelete: boolean = true;
  dataSource: any;
  madaCardListDataSource: any = {};
  dataSourceToPass: any;

  currentColumn: string = 'refNo';
  sortDirection: string = 'desc';
  fromRow: any = '1';
  toRow: any = '5';
  totalRecords: any;
  dataSourceLength: any;
  displayedColumns: string[] = [
    'refNo',
    'atmCardNumber',
    'cardName',
    'serviceType',
    'statusDesc',
    'cardDate',
    'action',
  ];
  noRecordFoundObject = {
    msg: 'LBL_NO_RECORDS_FOUND',
    showMsg: 'true',
  };

  filterField: any;
  filterConstraint: any;
  fromDate: any;
  toDate: any;
  filterflag: any;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  constructor(private router: Router, private mytaskService: MyTaskService) {
    this.rootScopeData.activeTabName = 'madaCardMyTask';
    this.rootScopeData.advSearchCurrentPage = 'madaCardList';
  }

  ngOnInit(): void {
    this.getMadaCardList();
    this.rootScopeData.activeTabName = 'madaCardMyTask';
    this.rootScopeData.advSearchCurrentPage = 'madaCardList';
  }

  ngAfterViewInit(): void {
    // this.dataSourceToPass.paginator = this.commonPagination?.paginator;
  }

  getMadaCardList() {
    this.isLoadingCompelete = false;
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      filterField: this.filterField,
      filterConstraint: this.filterConstraint,
      fromDate: this.fromDate,
      toDate: this.toDate,
      filterflag: this.filterflag,
    };

    this.mytaskService.getMadaCardSummary(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
        this.dataSource = res.data;
        
        this.rootScopeData.madaCardCount = res?.headerValue?.totalCount;
        if (this.dataSource && this.dataSource.length > 0) {
          this.totalRecords = this.dataSource.length
          this.noRecordFlag = false;
          this.dataSourceLength = this.dataSource.length;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination?.paginator;
        } else {
          this.noRecordFlag = true;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
      }
    );
  }

  advancedSearchApply(event: any) {
    this.currentColumn = 'cardDate';
    this.sortDirection = event.sortOrder;
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.filterflag = 'Y';
    this.filterConstraint = 'contains';
    this.filterField = event.serviceType;
    this.getMadaCardList();
  }

  triggerSearchFilter(event: any) {
    const columnsToSearch = [
      { name: 'refNo', fieldType: 'string' },
      { name: 'atmCardNumber', fieldType: 'string' },
      { name: 'cardName', fieldType: 'string' },
      { name: 'serviceType', fieldType: 'string' },
      { name: 'statusDesc', fieldType: 'string' },
      { name: 'cardDate', fieldType: 'date' },
    ];
    // const tableData = showFilteredRecords(this.madaCardList, columnsToSearch, event.target.value);
    // this.dataSourceToPass = new MatTableDataSource(tableData);
    // this.dataSourceToPass.paginator = this.commonPagination.paginator;
    let tableData = showFilteredRecords(
      this.dataSource,
      columnsToSearch,
      event.target.value
    ); if(tableData.length > 0){
      this.dataSourceToPass = new MatTableDataSource(tableData);
      this.dataSourceToPass.paginator = this.commonPagination?.paginator;
      this.noRecordFlag=false;
    }else{
      this.noRecordFlag=true
    }
    
  }

  refreshmadaCardList() {
    this.getMadaCardList();
  }

  sortColumn(column: any) {
    if (!this.currentColumn || !this.sortDirection) return;
    this.currentColumn = column;
    this.sortDirection === 'desc'
      ? (this.sortDirection = 'asc')
      : (this.sortDirection = 'desc');
    this.toRow = Number(this.toRow - this.fromRow) + 1;
    this.fromRow = 1;
    this.getMadaCardList();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getMadaCardList();
  }

  showDetails(row: any) {
    this.isLoadingCompelete = false;
    let params: any;
    if (row.subproductCode === "MADAREQ") {
      params = {
        moduleId: "NEWCARDDETAILS",
        refNo: row?.refNo,
        unitId: this.rootScopeData.userInfo?.UNIT_ID ? this.rootScopeData.userInfo?.UNIT_ID : "",
      };

    } else if (row.subproductCode === "LINKADDI") {
      params = {
        moduleId: "LINKADDACCDETAILS",
        refNo: row?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }

    } else if (row.subproductCode === "MADREISS") {
      params = {
        moduleId: "REISSUEMADADETAIL",
        refNo: row?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }

    } else if (row.subproductCode === "MADPOSLIM") {
      params = {
        moduleId: "MADAPOSLMTDETAIL",
        refNo: row?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }

    } else if (row.subproductCode === "MADSTOP") {
      params = {
        moduleId: "STPMADADETAIL",
        refNo: row?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }

    }
    this.cardDetailService(params, row, 'detail');
  }

  cardDetailService(params: any, row: any, path: any) {
    // console.log(row, "TESSTLLLLL::::row");console.log(params, "TESSTLLLLL::::params");
    this.mytaskService.getMadaCardDetail(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        const updatedRowResponse = {
          res: res,
          // res:res[3], // local testing purpose
          row: row
        }
        this.mytaskService.setSelectedElementDetails(updatedRowResponse);
        // console.log(updatedRowResponse,"TESTLL::KK");
        if (path === "detail") {
          this.router.navigate(['/mytask/madaCardDetails']);
        } else if (path === "authorize") {
          this.router.navigate(['/mytask/madaCardAuthorize']);
        } else if (path === "reject") {
          this.router.navigate(['/mytask/madaCardReject']);
        }

      },
      (error: any) => {
        // this.isLoadingCompelete = true;
      }
    );
  }

  onClickAuthorize(event: any, element: any): void {
    event.stopImmediatePropagation();
    // this.mytaskService.setSelectedElementDetails(element);
    this.isLoadingCompelete = false;
    let params: any;
    if (element.subproductCode === "MADAREQ") {
      params = {
        moduleId: "NEWCARDDETAILS",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo?.UNIT_ID ? this.rootScopeData.userInfo?.UNIT_ID : "",
      };

    } else if (element.subproductCode === "LINKADDI") {
      params = {
        moduleId: "LINKADDACCDETAILS",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }

    } else if (element.subproductCode === "MADREISS") {
      params = {
        moduleId: "REISSUEMADADETAIL",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }

    } else if (element.subproductCode === "MADPOSLIM") {
      params = {
        moduleId: "MADAPOSLMTDETAIL",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }

    } else if (element.subproductCode === "MADSTOP") {
      params = {
        moduleId: "STPMADADETAIL",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }
    }
    this.cardDetailService(params, element, 'authorize');
  }

  onClickReject(event: any, element: any): void {
    event.stopImmediatePropagation();
    let params: any;
    if (element.subproductCode === "MADAREQ") {
      params = {
        moduleId: "NEWCARDDETAILS",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo?.UNIT_ID ? this.rootScopeData.userInfo?.UNIT_ID : "",
      };
    } else if (element.subproductCode === "LINKADDI") {
      params = {
        moduleId: "LINKADDACCDETAILS",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }
    } else if (element.subproductCode === "MADREISS") {
      params = {
        moduleId: "REISSUEMADADETAIL",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }
    } else if (element.subproductCode === "MADPOSLIM") {
      params = {
        moduleId: "MADAPOSLMTDETAIL",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }
    } else if (element.subproductCode === "MADSTOP") {
      params = {
        moduleId: "STPMADADETAIL",
        refNo: element?.refNo,
        unitId: this.rootScopeData.userInfo.UNIT_ID ? this.rootScopeData.userInfo.UNIT_ID : "",
      }
    }
    this.cardDetailService(params, element, 'reject');
    // this.router.navigate(['/mytask/madaCardReject']);
  }
}
