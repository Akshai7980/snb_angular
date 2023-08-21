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
  selector: 'app-single-transfer',
  templateUrl: './single-transfer.component.html',
  styleUrls: ['./single-transfer.component.scss'],
})
export class SingleTransferComponent implements OnInit {
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
  isRefreshFlag: boolean = false;
  refreshClickedFlag: boolean = false;

  constructor(private myTaskService: MyTaskService, private router: Router) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.rootScopeData.advSearchCurrentPage = 'singleTransfer'
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
    this.currentColumn ='value_DATE';
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
    this.myTaskService.getSinglePaymentSummary(params,this.filterArray).subscribe(
      (res: any) => {
        if ((res && res.status) || (res.dataValue && !res.dataValue.length)) {
          this.noRecordFlag = true;
          this.isLoadingComplete = true;
        } else {
          this.isLoadingComplete = true;
          if (res.headerValue !== undefined) {
            this.responseHeader = res.headerValue;
          }
          // this.dataSource = res.dataValue;
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
      {"name":"ref_NO", "fieldType":"string"},
      {"name":"value_DATE", "fieldType":"date"},
      {"name":"payment_AMOUNT", "fieldType":"amount1"}
      
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
    this.fromRow = 1;
    this.isRefreshFlag = true;
    this.getPaymentDetails();
  }

  /**
   * @description set root scope data and redirect to details page
   * @param transfer selected payment transfer
   */
  goToDetailsPage(transfer: any): void {
    if (transfer.subprcode === 'BKSIFT' || transfer.subprcode === 'TELTRF' || transfer.subprcode === 'BKSRNT' || transfer.subprcode === 'BKSIBT' || transfer.subprcode === 'RECPAY' ) {
      this.setDetails(transfer, '/mytask/singlePmttransferDetails');
    }
    if(transfer.subprcode === 'SADADPAY'){
      this.rootScopeData.myTaskSADADSummaryObject = transfer;
      this.router.navigate(['/mytask/sadadDetailsLayout']);
    }
    if(transfer.subprcode === 'SADMOIPAY'){
      this.rootScopeData.myTaskSADADMOISummaryObject = transfer;
      this.router.navigate(['/mytask/sadadMoiDetailsLayout']);
    }
    if(transfer.subprcode === 'ARAMCOPAY'){
      this.rootScopeData.myTasksARAMCOSummaryObject = transfer;
      this.router.navigate(['/mytask/aramcoDetailsLayout']);
    }
    if(transfer.subprcode === 'SADMOIRF'){
      this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject = transfer;
      this.router.navigate(['/mytask/sadadMoiRefundReqDetailsLayout']);
    }
    if(transfer.subprcode === 'ESALPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/esalDetailsLayout']);
    }
    if(transfer.subprcode === 'ARCODIRPAY'){
      this.rootScopeData.myTasksARAMCOSummaryObject = transfer;
      this.router.navigate(['/mytask/aramcoDetailsLayout']);
    }
    //
    // if(transfer.subprcode === 'RECPAY'){
    //   this.rootScopeData.myTasksARAMCOSummaryObject = transfer;
    //   this.router.navigate(['/mytask/aramcoDetailsLayout']);
    // }
  }

  /**
   * @description set root scope data and redirect to approval page
   * @param event click event for approval
   * @param transfer selected payment transfer
   */
  onApproveClick(event: any, transfer: any) {
    event.stopImmediatePropagation();
    if (transfer.subprcode === 'BKSIFT' || transfer.subprcode === 'TELTRF' || transfer.subprcode === 'BKSRNT' || transfer.subprcode === 'BKSIBT' || transfer.subprcode === 'RECPAY' ) {
      this.setDetails(transfer, '/mytask/authorizeSingleTransferPmt');
    }
    if(transfer.subprcode === 'SADADPAY'){
      this.rootScopeData.myTaskSADADSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeSadadPayment']);
    }
    if(transfer.subprcode === 'SADMOIPAY'){
      this.rootScopeData.myTaskSADADMOISummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeSadadMoiPayment']);
    }
    if(transfer.subprcode === 'ARAMCOPAY'){
      this.rootScopeData.myTasksARAMCOSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeAramcoPayment']);
    }
    if(transfer.subprcode === 'SADMOIRF'){
      this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeSadadMoiRefundReq']);
    }
    if(transfer.subprcode === 'ESALPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeEsalPayment']);
    }
    if(transfer.subprcode === 'ARCODIRPAY'){
      this.rootScopeData.myTasksARAMCOSummaryObject = transfer;
      this.router.navigate(['/mytask/authorizeAramcoPayment']);
    }
  }

  /**
   * @description set root scope data and redirect to reject page
   * @param event click event for approval
   * @param transfer selected payment transfer
   */
  onRejectClick(event: any, transfer: any) {
    event.stopImmediatePropagation();
    this.isLoadingComplete = false;
    if (transfer.subprcode === 'BKSIFT' || transfer.subprcode === 'TELTRF' || transfer.subprcode === 'BKSRNT' || transfer.subprcode === 'BKSIBT'  || transfer.subprcode === 'RECPAY') {
      this.setDetails(transfer, '/mytask/rejectSingleTransferPmt');
    }
    if(transfer.subprcode === 'SADADPAY'){
      this.rootScopeData.myTaskSADADSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectSadadPayment']);
    }
    if(transfer.subprcode === 'SADMOIPAY'){
      this.rootScopeData.myTaskSADADMOISummaryObject = transfer;
      this.router.navigate(['/mytask/rejectSadadMoiPayment']);
    }
    if(transfer.subprcode === 'ARAMCOPAY'){
      this.rootScopeData.myTasksARAMCOSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectAramcoPayment']);
    }
    if(transfer.subprcode === 'SADMOIRF'){
      this.rootScopeData.myTasksSADADMOIRefundReqSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectSadadMoiRefundReq']);
    }
    if(transfer.subprcode === 'ESALPAY'){
      this.rootScopeData.myTasksESALSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectEsalPayment']);
    }
    if(transfer.subprcode === 'ARCODIRPAY'){
      this.rootScopeData.myTasksARAMCOSummaryObject = transfer;
      this.router.navigate(['/mytask/rejectAramcoPayment']);
    }
  }
  /**
   * @description get details of payment and route to the path
   * @param transfer payment transfer summary
   * @param path route path
   */
  setDetails(transfer: any, path: string): void {
    this.isLoadingComplete = false;
    let params = {
      txnRefNo: transfer.ref_NO,
      productCode: transfer.product_CODE,
      subProductCode: transfer.payment_MODE,
      functionCode: transfer.function_ID,
      unit_ID: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.myTaskService.getSinglePaymentDetails(params).subscribe(
      (response) => {
        this.rootScopeData.myTaskSingleTransferPayment = {
          details: response.data,
          summary: transfer,
        };
        this.isLoadingComplete = true;
        this.router.navigate([path]);
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }
  advancedSearchApply(event :any)
  {
     
    this.filterflag ='Y';
    this.filterValue ="";
    this.advancedSearchFromDate = event.dateFrom;
    this.advancedSearchFromTo = event.dateTo;
    this.advancedSearchAmount = event.amount; 
    this.advancedSearchTo = event.to; 
    this.advancedSearchTransactionType = event.transactionType; 
    this.advancedSearchType = event.type;

    this.filterArray =[]; 
    if(this.advancedSearchType == 'Date'){
       
      let passingObj = {
        "filterField": "value_DATE",
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
    }
     
    this.dataSource = [];
     this.getPaymentDetails();
  }

}
