import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-single-file',
  templateUrl: './single-file.component.html',
  styleUrls: ['./single-file.component.scss']
})
export class SingleFileComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  noRecordFoundInfoObj: any;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  dataSourceToPass: any;
  displayedColumns: string[] = ['nickname', 'name', 'accountnumber', 'paymenttype', 'bank', 'action'];
  dataSource: any = [];
  norecordflag: boolean = false;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  totalRecords: any;
  responseHeader: any;
  sortDirection: string = '';
  currentColumn: string = '';
  isLoadingCompelete = true;
  isRefreshFlag: boolean = false;
  refreshClickedFlag: boolean = false;
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchName: any;
  advancedSearchBankName: any;
  filterArray: any;
  advancedSearchpaymentType: any;

  constructor(private mytaskService: MyTaskService, private router: Router, private commonService: CommonService) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.rootScopeData.advSearchCurrentPage = 'singleFile'
  }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'singlefile';
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_REQUEST_FOUND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    let defaultPassingObj ={  
      "filterField": "",
      "filterConstraint": "contains",
      "filterValue": "",
    }
    this.filterArray =[defaultPassingObj];
    this.getPaymentDetails();
  }

  getPaymentDetails() {
    this.isLoadingCompelete = false;
    let params = {
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      fromRow: this.fromRow,
      toRow: this.toRow,
      filterArray: this.filterArray,
    }
    this.mytaskService.getSingleInprogressSummary(params).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      //this.dataSource = res.data;
      if (this.isRefreshFlag === false) {
        this.dataSource = this.dataSource.concat(res.dataValue);
      } else {
        this.dataSource = res.dataValue;
        this.isRefreshFlag = false;
      }
      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
      if (res.status === 500 || !this.dataSource) {
        this.norecordflag = true;
      } else if (this.dataSource) {
        this.refreshClickedFlag = false;
        this.dataSourceLength = this.dataSource.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource)
        this.dataSourceToPass.paginator = this.commonPagination.paginator;
        this.totalRecords = res.headerValue.totalCount;
        this.rootScopeData.singleBeneficiaryCount = this.totalRecords
      }
      if(this.dataSource && this.dataSource.length === 0){
        this.norecordflag = true;
      }
    }, (error: any) => {
      this.isLoadingCompelete = true;
      this.norecordflag = true;
    })
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [
      { "name": "bene_id", "fieldType": "string" },
      { "name": "bene_name", "fieldType": "string" },
      { "name": "account_no", "fieldType": "string" },
      { "name": "sub_product", "fieldType": "string" },
      { "name": "bene_bank_name", "fieldType": "string" }
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

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === '') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else {
      this.sortDirection = '';
    }
    this.fromRow = 1;
    this.isRefreshFlag = true;
    this.getPaymentDetails();
  }


  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getPaymentDetails();
  }
  goToDetailsScreen(row: any) {
    let showContactDetails = false;
    if (row.sub_prod === 'TELTRF') {
      showContactDetails = true
    } else {
      showContactDetails = false
    }
    Object.assign(row, { showContactDetailsFlag: showContactDetails });
    this.rootScopeData.pendingActivitiesSingleBeneficiaryObject = row;
    this.router.navigate(['/mytask/singleBeneficiaryDetails']);
  }
  onApproveClick(event: any, row: any) {
    event.stopImmediatePropagation();
    let showContactDetails = false;
    if (row.sub_prod === 'TELTRF') {
      showContactDetails = true
    } else {
      showContactDetails = false
    }
    Object.assign(row, { showContactDetailsFlag: showContactDetails });
    this.rootScopeData.pendingActivitiesSingleBeneficiaryObject = row;
    this.isLoadingCompelete = false;
    this.mytaskService.getBeneficiaryInProgressDetails(row.bene_id,row.sub_prod).subscribe((data: any) => {
      this.isLoadingCompelete = true;
      if (data.data) {
        this.rootScopeData.singleBeneficiaryDetailsObject = data.data;
        this.router.navigate(['/mytask/authorizeSingleBeneficiaryRequest']);
      }
    }, (error: any) => {
      this.isLoadingCompelete = true;
    })
  }


  onRejectClick(event: any, row: any) {
    event.stopImmediatePropagation();
    let showContactDetails = false;
    if (row.sub_prod === 'TELTRF') {
      showContactDetails = true
    } else {
      showContactDetails = false
    }
    Object.assign(row, { showContactDetailsFlag: showContactDetails });
    this.rootScopeData.pendingActivitiesSingleBeneficiaryObject = row;
    this.isLoadingCompelete = false;
    this.mytaskService.getBeneficiaryInProgressDetails(row.bene_id,row.sub_prod).subscribe((data: any) => {
      this.isLoadingCompelete = true;
      if (data.data) {
        this.rootScopeData.singleBeneficiaryDetailsObject = data.data;
        this.router.navigate(['/mytask/rejectSingleBeneficiaryRequest']);
      }
    }, (error: any) => {
      this.isLoadingCompelete = true;
    })

  }

  advancedSearchApply(event:any){
    //debugger;
    this.advancedSearchFromDate = event.dateFrom;
    this.advancedSearchFromTo = event.dateTo;
    this.advancedSearchName = event.name; 
    this.advancedSearchBankName = event.bankName; 
    this.advancedSearchpaymentType = event.paymentType; 

    this.filterArray =[]; 
    // if(this.advancedSearchFromDate && this.advancedSearchFromTo){
       
      let passingObj = {
        "filterField": "valueDate",
        "filterConstraint": "date",
        "filterValue": "",
        "fromAmt": "",
        "toAmt": "",
        "fromDate": this.advancedSearchFromDate,
        "toDate": this.advancedSearchFromTo
      }
       
      this.filterArray.push(passingObj);

      let passingObj1 = {
        "filterField": "bene_name",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchName      
      }
       
      this.filterArray.push(passingObj1);

      let passingObj2 = {
        "filterField": "bene_bank_name",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchBankName      
      }
       
      this.filterArray.push(passingObj2);
      let passingObj3 = {
        "filterField": "sub_product",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchpaymentType      
      }
       
      this.filterArray.push(passingObj3);
    // }   
    this.dataSource = [];
    this.getPaymentDetails();
  }
}
