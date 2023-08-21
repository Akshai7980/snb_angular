import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-sadad-file-payment',
  templateUrl: './sadad-file-payment.component.html',
  styleUrls: ['./sadad-file-payment.component.scss']
})
export class SadadFilePaymentComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  curerentSelection: any;
  dataSourceToPass: any;
  displayedColumns: string[] = ['odDRefNo', 'accNo', 'odNoOfTrans', 'odFileAmount', 'odMakerDate', 'odStatus', 'uploadType', 'odFileName', 'action'];
  dataSource: any = [];
  noRecordFoundInfoObj: any;
  selectedGroup: string = '';
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  filterArray: any = [];
  totalRecords: any;
  norecordflag: boolean = false;
  isLoadingCompelete = true;
  sortDirection: string = '';
  responseHeader: any;
  currentColumn: any;
  filterflag: string = "";
  filterconstraint: any;
  filterfield: any;
  filterValue: any;
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchAmount: any;
  advancedSearchTo: any;
  advancedSearchdateOrderType: any;
  advancedSearchUploadType: any;
  advancedSearchStatusType: any;
  type: any;
  advancedSearchType: string = "Date";
  isRefreshFlag : boolean = false;
  refreshClickedFlag: boolean = false;

  constructor(private mytaskService: MyTaskService, private router: Router) { }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'filepayment';
    this.rootScopeData.advSearchCurrentPage = 'sadadfilepayment';
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_TRSFR_FND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.currentColumn = 'odMakerDate';
    this.sortDirection = 'desc';
    this.getPaymentDetails();
  }


  getPaymentDetails() {
    let params = {
      groupBy: this.selectedGroup,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      unitId: this.rootScopeData.userInfo.UNIT_ID || '',
      filterArray: this.filterArray
    };
    this.isLoadingCompelete = false;
    this.rootScopeData.myTaskSadadFilePaymentCount = 0;
    this.mytaskService.filePaymentsSummary(params).subscribe((res: any) => {
      // console.log("Response::",res);
      this.isLoadingCompelete = true;
      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
        this.rootScopeData.myTaskSadadFilePaymentCount = res.headerValue.totalCount;
      }

      //this.dataSource = res.data;
      if(this.isRefreshFlag === false){
        this.dataSource = this.dataSource.concat(res.data);
      }else{
        this.dataSource = res.data;
        this.isRefreshFlag = false;
      }
      this.refreshClickedFlag = false;
      this.dataSourceLength = this.dataSource.length;
      this.dataSourceToPass = new MatTableDataSource(this.dataSource)
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
      this.totalRecords = res.headerValue.totalCount;
      if (this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSourceLength === 0) {
        this.norecordflag = !this.norecordflag;
      }
    }, (error: any) => {
      this.isLoadingCompelete = true;
    })
  }

  onApproveClick(event: any, row: any) {
    event.stopImmediatePropagation();
    //this.rootScopeData.myTaskSADADBulkUploadSummaryObject = row;
    this.mytaskService.setSelectedElementDetails(row);
    this.router.navigate(['/mytask/authorizeSadadBulkPayment']);
  }
  goToDetailsPage(transfer: any): void {
    // this.rootScopeData.myTaskSADADBulkUploadSummaryObject = transfer;
    this.mytaskService.setSelectedElementDetails(transfer);
    this.router.navigate(['/mytask/sadadBulkPaymentDetails']);
  }

  onRejectClick(event: any, row: any) {
    event.stopImmediatePropagation();
    // this.rootScopeData.myTaskSADADBulkUploadSummaryObject = row;
    this.mytaskService.setSelectedElementDetails(row);
    this.router.navigate(['/mytask/rejectSadadBulkPayment']);
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { "name": "odMakerDate", "fieldType": "string" },
      { "name": "odDRefNo", "fieldType": "string" },
      { "name": "odNoOfTrans", "fieldType": "string" },
      { "name": "accNo", "fieldType": "string" },
      { "name": "uploadType", "fieldType": "string" },
      { "name": "odFileName", "fieldType": "string" },
      { "name": "odStatus", "fieldType": "string" }
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value);
    this.dataSourceToPass = new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator = this.commonPagination.paginator;
    // showFilteredRows('singleInprogressDefaultCntr', event.target.value); 
  }

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.pageSize = 5;
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.firstPage();
    this.sortDirection = '';
    this.refreshClickedFlag = true;
    this.getPaymentDetails();
  }

  paginationChangeClick(params: any) {
    // console.log("SPEVENT====>",params)
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getPaymentDetails();
  }


  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getPaymentDetails();
  }

  advancedSearchApply(event: any) {
    this.filterflag = 'Y';
    this.filterValue = "";
    this.advancedSearchFromDate = event.dateFrom;
    this.advancedSearchFromTo = event.dateTo;
    this.advancedSearchAmount = event.amount;
    this.advancedSearchTo = event.to;
    this.advancedSearchdateOrderType = event.dateOrderType;
    this.advancedSearchUploadType = event.uploadType;
    this.advancedSearchStatusType = event.statusType;


    this.filterArray = [];
    if (this.advancedSearchType === 'Date') {

      let passingObj = {
        "filterField": "odMakerDate",
        "filterConstraint": "date",
        "filterValue": "",
        "fromAmt": "",
        "toAmt": "",
        "fromDate": this.advancedSearchFromDate,
        "toDate": this.advancedSearchFromTo,
      }

      this.filterArray.push(passingObj);

      let passingObj2 = {
        "filterField": "uploadType",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchUploadType
      }

      this.filterArray.push(passingObj2);

      let passingObj3 = {
        "filterField": "statusType",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchStatusType
      }

      this.filterArray.push(passingObj3);

      let passingObj4 = {
        "filterField": "odMakerDate",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchdateOrderType
      }
      this.filterArray.push(passingObj4);
    }
    else if (this.advancedSearchType == 'Amount') {

      let passingObj1 = {
        "filterField": "odFileAmount",
        "filterConstraint": "amt",
        "filterValue": "",
        "fromAmt": this.advancedSearchAmount,
        "toAmt": this.advancedSearchTo,
        "fromDate": "",
        "toDate": ""
      }

      this.filterArray.push(passingObj1);

      let passingObj2 = {
        "filterField": "uploadType",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchUploadType
      }

      this.filterArray.push(passingObj2);

      let passingObj3 = {
        "filterField": "statusType",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchStatusType
      }

      this.filterArray.push(passingObj3);

      let passingObj4 = {
        "filterField": "odMakerDate",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchdateOrderType
      }

      this.filterArray.push(passingObj4);
    }

    this.dataSource = [];
    this.getPaymentDetails();
  }

}
