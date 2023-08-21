import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import {
  totalRecordsPerRequest,
  pageOptions,
} from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';
@Component({
  selector: 'app-sadad-single-payment',
  templateUrl: './sadad-single-payment.component.html',
  styleUrls: ['./sadad-single-payment.component.scss']
})
export class SadadSinglePaymentComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  curerentSelection: any;
  dataSourceToPass: any;
  displayedColumns: string[] = [
    'nickName',
    'transactionType',
    'date',
    'referenceNo',
    'paymentAmt',
    'action',
  ];
  dataSource: any = [];
  noRecordFoundInfoObj: any;
  selectedGroup: string = '';
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  totalRecords: any;
  filterArray: any = [];
  isLoadingComplete = true;
  isRefreshFlag:boolean = false
  noRecordFlag: boolean = false;
  responseHeader: any;
  filterflag:string ="";
  filterconstraint:any;
  filterfield:any;
  filterValue:any;
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchAmount: any;
  advancedSearchTo: any;
  advancedSearchTransactionType: any;
  type:any;
  advancedSearchType: any;
  currentColumn: string = '';
  sortDirection: string = '';
  refreshClickedFlag: boolean = false;
  advancedSearchRefNo: any;

  constructor(private myTaskService: MyTaskService, private router: Router) { 
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.rootScopeData.advSearchCurrentPage = 'sadadSinglePayment'
    
  }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'singlepayments';
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_TRSFR_FND',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'false',
      showMsg: 'true',
      showIcon: 'true',
    };
    let defaultPassingObj =[
      {
        "filterField":'',
        "filterConstraint":'',
        "filterValue":'',
        "fromAmt":'',
        "toAmt":'',
        "fromDate":'',
        "toDate":''
      },
      {  
      "filterField": "",
      "filterConstraint": "contains",
      "filterValue": "",
    }]
    this.filterArray =defaultPassingObj;
    this.currentColumn ='maker_DATE';
    this.sortDirection ='desc';
    this.getPaymentDetails();
  }

  getPaymentDetails() {
    let params = {
      groupBy: this.selectedGroup,
      fromRow: this.fromRow,
      toRow: this.toRow,
      filterArray: this.filterArray,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      flag :this.filterflag
    };
    this.isLoadingComplete = false;
    this.myTaskService.getSadadSinglePaymentSummary(params).subscribe(
      (res: any) => {
        if ((res && res.status) || (res.dataValue && !res.dataValue.length)) {
          this.noRecordFlag = true;
          this.isLoadingComplete = true;
        } else {
          this.isLoadingComplete = true;
          if (res.headerValue !== undefined) {
            this.responseHeader = res.headerValue;
          }
          //this.dataSource = res.dataValue;
          if(this.isRefreshFlag === false){
            this.dataSource = this.dataSource.concat(res.dataValue);
          }else{
            this.dataSource = res.dataValue;
            this.isRefreshFlag = false;
          }
          this.refreshClickedFlag = false;
          this.dataSourceLength = this.dataSource.length;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.totalRecords = res.headerValue.totalCount;
          this.rootScopeData.myTaskSadadPaymentCount = res.headerValue.totalCount;
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
        this.noRecordFlag = true;
      }
    );
  }

  triggerSearchFilter(event: any) {
    let columnsToSearch = [ 
      {"name":"payment_CURRENCY", "fieldType":"ccy1"},
      {"name":"bene_ACC_NO", "fieldType":"string"},
      {"name":"function_ID_DISPVAL", "fieldType":"string"}, 
      {"name":"maker_DATE", "fieldType":"date"},
      {"name":"ref_NO", "fieldType":"string"},
      {"name":"payment_AMOUNT", "fieldType":"amount1"},
      
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows('singletransferDefaultCntr', event.target.value);
  }

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.pageSize = 5;
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.firstPage();
    this.sortDirection = 'desc';
    this.refreshClickedFlag = true;
    this.getPaymentDetails();
  }

  paginationChangeClick(params: any) {
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

  /**
   * @description set root scope data and redirect to details page
   * @param transfer selected payment transfer
   */
  goToDetailsPage(transfer: any): void {
    if(transfer.subprcode === 'SADADPAY'){
      this.rootScopeData.myTaskSADADSummaryObject = transfer;
      this.router.navigate(['/mytask/sadadDetailsLayout']);
    }
    if(transfer.subprcode === 'SADMOIPAY'){
      this.rootScopeData.myTaskSADADMOISummaryObject = transfer;
      this.router.navigate(['/mytask/sadadMoiDetailsLayout']);
    }
    if(transfer.subprcode === 'SADMOIRF'){
      this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject = transfer;
      this.router.navigate(['/mytask/sadadMoiRefundReqDetailsLayout']);
    }
    if(transfer.subprcode === 'ESALPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/esalDetailsLayout']);
    }
    if(transfer.subprcode === 'ESALONEPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/esalDetailsLayout']);
    }
  }

  /**
   * @description set root scope data and redirect to approval page
   * @param event click event for approval
   * @param transfer selected payment transfer
   */
  onApproveClick(event: any, transfer: any) {
    event.stopImmediatePropagation();
    if(transfer.subprcode === 'SADADPAY'){
      this.rootScopeData.myTaskSADADSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeSadadPayment']);
    }
    if(transfer.subprcode === 'SADMOIPAY'){
      this.rootScopeData.myTaskSADADMOISummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeSadadMoiPayment']);
    }
    if(transfer.subprcode === 'SADMOIRF'){
      this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeSadadMoiRefundReq']);
    }
    if(transfer.subprcode === 'ESALPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeEsalPayment']);
    }
    if(transfer.subprcode === 'ESALONEPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeEsalPayment']);
    }
  }

  /**
   * @description set root scope data and redirect to reject page
   * @param event click event for approval
   * @param transfer selected payment transfer
   */
  onRejectClick(event: any, transfer: any) {
    event.stopImmediatePropagation();
    if(transfer.subprcode === 'SADADPAY'){
      this.rootScopeData.myTaskSADADSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectSadadPayment']);
    }
    if(transfer.subprcode === 'SADMOIPAY'){
      this.rootScopeData.myTaskSADADMOISummaryObject = transfer;
      this.router.navigate(['/mytask/rejectSadadMoiPayment']);
    }
    if(transfer.subprcode === 'SADMOIRF'){
      this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectSadadMoiRefundReq']);
    }
    if(transfer.subprcode === 'ESALPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectEsalPayment']);
    }
    if(transfer.subprcode === 'ESALONEPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectEsalPayment']);
    }
  }
  /**
   * @description get details of payment and route to the path
   * @param transfer payment transfer summary
   * @param path route path
   */
 
  advancedSearchApply(event :any)
  {
     
    this.filterflag ='Y';
    this.filterValue ="";
    this.advancedSearchFromDate = event.dateFrom;
    this.advancedSearchFromTo = event.dateTo;
    this.advancedSearchAmount = event.amount; 
    this.advancedSearchTo = event.to; 
    this.advancedSearchTransactionType = event.paymentType; 
    this.advancedSearchRefNo = event.refNum; 
    // this.advancedSearchType = event.type;

    this.filterArray =[]; 
    if(this.advancedSearchType == 'Date'){
       
      let passingObj = {
        "filterField": "maker_DATE",
        "filterConstraint": "date",
        "filterValue": "",
        "fromAmt": "",
        "toAmt": "",
        "fromDate": this.advancedSearchFromDate,
        "toDate": this.advancedSearchFromTo
      }
       
      this.filterArray.push(passingObj);
     
      let passingObj2 = {
        "filterField": "function_ID_DISPVAL",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchTransactionType      
      }
       
      this.filterArray.push(passingObj2);

      let passingObj3 = {
        "filterField": "ref_NO",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchRefNo  
      }
      this.filterArray.push(passingObj3);
    }   
    else if(this.advancedSearchType == 'Amount'){
       
      let passingObj1 = {
        "filterField": "payment_AMOUNT",
        "filterConstraint": "amt",
        "filterValue": "",
        "fromAmt": this.advancedSearchAmount,
        "toAmt": this.advancedSearchTo,
        "fromDate": "",
        "toDate": ""
      }
       
      this.filterArray.push(passingObj1);

      let passingObj2 = {
        "filterField": "function_ID_DISPVAL",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchTransactionType      
      }
       
      this.filterArray.push(passingObj2);
      let passingObj3 = {
        "filterField": "ref_NO",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchRefNo  
      }
      this.filterArray.push(passingObj3);
    }
    this.dataSource = [];
     this.getPaymentDetails();
  }

}

