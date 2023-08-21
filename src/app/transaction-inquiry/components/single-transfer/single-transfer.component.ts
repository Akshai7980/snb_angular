import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { MyTaskService } from 'src/app/mytask/services/my-task.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import {
  pageOptions,
  totalRecordsPerRequest,
} from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

const TRANSACTION_ENQUIRY_DETAILS_ROUTE = '';

@Component({
  selector: 'app-single-transfer',
  templateUrl: './single-transfer.component.html',
  styleUrls: ['./single-transfer.component.scss'],
})
export class SingleTransferComponent implements OnInit {
  index = -1;
  showDrop = false;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  @ViewChild(MatSort) sort!: MatSort;
  responseHeader: any;
  contextMenuList: any = [];
  fromRow: any;
  toRow: any;
  dataSourceToPass: any;
  dataSourceLength: any;
  dataSource: any = [];
  totalRecords: any;
  tablePageSize: any;
  noRecordFlag: boolean = false;
  noRecordFoundInfoObj: any;
  isLoadingComplete = true;
  rootScopeData: RootScopeDeclare = RootScopeData;
  currentColumn: string = '';
  sortDirection: string = '';
  details :any;
  filterflag:string ="";
  filterconstraint:any;
  filterfield:any;
  filterValue:any;
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchAmount: any;
  advancedSearchTo: any;
  advancedSearchTransactionType: any;
  advancedSearchPeriod: any;
  type:any;
  advancedSearchType: any;
  filterArray: any = [];


  displayedColumns: string[] = [
    'TO',
    'FROM',
    'PAYMENT_TYPE',    
    'referenceNo',
    'VALUE_DATE',
    'STATUS',
    'AMT',
    'ACTION',
  ];
  transactionInquirySingleTransferDetailsRoute =
    '/transactionInquiry/singleTransferDetailsLayout';
  isRefreshFlag: boolean = false;
  debitDetails: any;
  refreshClickedFlag: boolean = false;
  textSearch: string = '';
  pageCount:any;

  constructor(
    private transactionService: TransactionInquiryService,
    private router: Router,
    private readonly myTaskService: MyTaskService
  ) {
    this.rootScopeData.activeTabName = 'singleTransfer';
    this.rootScopeData.advSearchCurrentPage = 'singleTransferTransactionInquiry'
    this.rootScopeData.accountsActiveModule = 'SINPYTSUM';
    this.currentColumn = 'makerDate';
    this.sortDirection = 'desc';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      btnLabel: '',
      btnLink: '',
      showBtn: 'false',
      showMsg: 'true',
      showIcon: 'true',
    };
    // this.contextMenuList = [
    //   { "display_key": 'LBL_CANCEL_TRANSACTION', "value": 'cancelTransaction', "item_id": 'CANCEL_TRANSACTION' },
    //   { "display_key": 'LBL_CLONE_TRANSACTION', "value": 'cloneTransaction' }
    // ];
    let defaultPassingObj ={  
      "filterField": "",
      "filterConstraint": "contains",
      "filterValue": "",
    }
    this.filterArray =[defaultPassingObj];
    // this.getTransactionDetails();
    if(this.rootScopeData.backToPagination.resFlagForService === 'Y'){
      this.fromRow = 1;
      this.toRow = this.rootScopeData.backToPagination.toRow;
      this.getTransactionDetails();
      this.rootScopeData.backToPagination.resFlagForService = 'N';
    }else{
      this.getTransactionDetails();
    }
  }

  getTransactionDetails() {
    this.isLoadingComplete = false;
    let params = {
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,      
      filterArray: this.filterArray,
      flag :this.filterflag,
      searchText:this.textSearch
    };
 
    this.transactionService.getSingleTransactionSummary(params).subscribe(
      (data: any) => {
        this.isLoadingComplete = true;
        if (data.headerValue !== undefined) {
          this.responseHeader = data.headerValue;
        }
        if ((data && data.status) || (data.data && !data.data.length)) {
          this.noRecordFlag = true;
        } else {
          this.noRecordFlag = false;
          // this.dataSource = data.data;
          if(this.isRefreshFlag === false){
            this.dataSource = this.dataSource.concat(data.data);
          }else{
            this.dataSource = data.data;
            this.isRefreshFlag = false;
         this.commonPagination.paginator.firstPage();
          }
          this.refreshClickedFlag = false;
          this.dataSourceLength = this.dataSource.length;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.totalRecords = data.headerValue.totalCount;
          this.pageCount = data.headerValue.recordCount;
          this.rootScopeData.singleTransferSummaryCount = this.totalRecords;
          
        }        
      },
      (error: any) => {
        this.isLoadingComplete = true;
        this.noRecordFlag = true;
      }
    );
  }
  triggerSearchFilter(event: any): void {
    let columnsToSearch = [ 
      {"name":"debitCurrency", "fieldType":"ccy1"},
      {"name":"benefAccNo", "fieldType":"string"},
      {"name":"benefName", "fieldType":"string"}, 
      {"name":"debitAccNo", "fieldType":"string"},
      {"name":"createdBy", "fieldType":"string"},
      {"name":"transactionType", "fieldType":"string"},
      {"name":"referenceNo", "fieldType":"string"},
      {"name":"valueDate", "fieldType":"date"},
      {"name":"odStatus", "fieldType":"date"},
      {"name":"paymentAmt", "fieldType":"amount1"}
    ];
    // let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    // this.dataSourceToPass= new MatTableDataSource(tableData);
    // // debugger;
    // this.commonPagination.paginator.firstPage();
    // this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows('singleTransferInquirytable', event.target.value);
  }



  triggerDropdownFilter(event: any): void {
    showFilteredRows(this.rootScopeData.filterTableId, event);
  }

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.pageSize = 5; //set pagination selected size to 5
    this.totalRecords = this.totalRecords; // set length value again while refresh
    this.pageCount = this.pageCount;
    this.commonPagination.paginator.firstPage(); //set pagination to go to first page
    this.refreshClickedFlag = true;
    this.filterArray =[]; 
    this.filterflag='';
    this.currentColumn = 'makerDate';
    this.sortDirection = 'desc';
    this.getTransactionDetails();
  }

  redirectToDetails(transaction: any) {
    this.setDetails(
      transaction,
      '/transactionInquiry/singleTransferDetailsLayout'
    );
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.rootScopeData.backToPagination.fromRow = params.fromRow;
    this.rootScopeData.backToPagination.toRow = params.toRow;
    this.rootScopeData.backToPagination.resFlag = 'N';
    this.getTransactionDetails();
  }
  selectedRecord(event: any, element: any) {  
    // this.rootScopeData.transactionInquiry = {
    //   summary : element,
    // };
    this.isLoadingComplete = false;
    let params = {
      txnRefNo: element.ref_NO,
      productCode: element.product_CODE,
      subProductCode: element.subProductCode,
      functionCode: element.function_ID,
      unit_ID: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.myTaskService.getSinglePaymentDetails(params).subscribe(
      (response) => {
        this.details = response.data;
        this.rootScopeData.transactionInquiry = {
          details: this.details,
          summary: element
        };
        this.isLoadingComplete = true;
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
    this.contextMenuList = [];
    if(element.subprcode === "TELTRF" && element.statusCode == "AH"){
      let swiftMenu = { "display_key": 'LBL_SWIFT_GPI_TRACKER', "value": 'swift', "item_id": 'SWIFT_GPI' }
      this.contextMenuList.push(swiftMenu);
    }
    if (element.statusCode == "FH") {
      let cancelMenu = { "display_key": 'LBL_CANCEL_TRANSACTION', "value": 'cancelTransaction', "item_id": 'CANCEL_TRANSACTION' }
      this.contextMenuList.push(cancelMenu);
    }
    if (element.statusCode == "AH" || element.statusCode == "RH") {
    if(element.subprcode === "BKSIFT"){
    let clone = { "display_key": 'LBL_CLONE_TRANSACTION', "value": 'cloneTransaction', "item_id": 'BKSIFT' };
    this.contextMenuList.push(clone);  
    }
    if(element.subprcode === "BKSIBT"){
    let clone = { "display_key": 'LBL_CLONE_TRANSACTION', "value": 'cloneTransaction', "item_id": 'BKSIBT' };
    this.contextMenuList.push(clone);  
    }
    if(element.subprcode === "BKSRNT"){
    let clone = { "display_key": 'LBL_CLONE_TRANSACTION', "value": 'cloneTransaction', "item_id": 'BKSRNT' };
    this.contextMenuList.push(clone); 
    }
    if(element.subprcode === "TELTRF"){
      let clone = { "display_key": 'LBL_CLONE_TRANSACTION', "value": 'cloneTransaction', "item_id": 'TELTRF' };
      this.contextMenuList.push(clone); 
    }
   }
   //EDIT OPTION
   if (element.statusCode == "RO") {
    if(element.subprcode === "BKSIFT"){
    let clone = { "display_key": 'LBL_EDIT', "value": 'editTransaction', "item_id": 'BKSIFT' };
    this.contextMenuList.push(clone);  
    }
    if(element.subprcode === "BKSIBT"){
    let clone = { "display_key": 'LBL_EDIT', "value": 'editTransaction', "item_id": 'BKSIBT' };
    this.contextMenuList.push(clone);  
    }
    if(element.subprcode === "BKSRNT"){
    let clone = { "display_key": 'LBL_EDIT', "value": 'editTransaction', "item_id": 'BKSRNT' };
    this.contextMenuList.push(clone); 
    }
    if(element.subprcode === "TELTRF"){
      let clone = { "display_key": 'LBL_EDIT', "value": 'editTransaction', "item_id": 'TELTRF' };
      this.contextMenuList.push(clone); 
    }
   }
    event?.stopPropagation();
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
    this.getTransactionDetails();
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
      subProductCode: transfer.subProductCode,
      functionCode: transfer.function_ID,
      unit_ID: this.rootScopeData.userInfo.UNIT_ID,
    };
    this.myTaskService.getSinglePaymentDetails(params).subscribe(
      (response) => {
        this.details = response.data;
        let detparams = {
          "OD_ACC_NO": this.details.debitNumber,
          "COD_CORECIF": this.details.cifNo,
          "REQ_COUNTRY_CODE": this.details.debitCountryCode,
          "UNIT_ID": this.details.unitId
        }

        this.transactionService.getAccountDetails(detparams).subscribe((res:any)=>{
          this.debitDetails = res.DATA;

          this.rootScopeData.transactionInquiry = {
            details: this.details,
            summary: transfer,
            paymentDetails: this.debitDetails.ACC_DETAILS
          };
          this.isLoadingComplete = true;
          this.router.navigate([path]);
        })
        this.isLoadingComplete = true;
      },
      (error) => {
        this.isLoadingComplete = true;
      }
    );
  }

  advancedSearchApply(event:any){
    this.filterflag ='Y';
    this.filterValue ="";
    //debugger;
    this.advancedSearchFromDate = event.fromDate;
    this.advancedSearchFromTo = event.toDate;
    this.advancedSearchAmount = event.fromAmount; 
    this.advancedSearchTo = event.toAmount; 
    this.advancedSearchTransactionType = event.transactionType; 
    this.advancedSearchType = event.type;
    this.sortDirection = event.sortOrder;
    this.currentColumn = 'makerDate';
    this.advancedSearchPeriod = event.period; 

    this.filterArray =[]; 
    if(this.advancedSearchType == 'Date'){
       
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
     
      let passingObj2 = {
        "filterField": "transactionType",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchTransactionType      
      }
       
      this.filterArray.push(passingObj2);

      let passingObj1 = {
        "filterField": "paymentAmt",
        "filterConstraint": "amt",
        "filterValue": "",
        "fromAmt": this.advancedSearchAmount,
        "toAmt": this.advancedSearchTo,
        "fromDate": "",
        "toDate": ""
      }
       
      this.filterArray.push(passingObj1);
    }   
    else if(this.advancedSearchType == 'Period'){
       
      let passingObj = {
        "filterField": "transactionType",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchTransactionType      
      }
       
      this.filterArray.push(passingObj);

      let passingObj1 = {
        "filterField": "paymentAmt",
        "filterConstraint": "amt",
        "filterValue": "",
        "fromAmt": this.advancedSearchAmount,
        "toAmt": this.advancedSearchTo,
        "fromDate": "",
        "toDate": ""
      }
       
      this.filterArray.push(passingObj1);

      let passingObj2 = {
        "filterField": "SELECTED_RANGE",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchPeriod,
        "filterKey":"valueDate"   
      }
       
      this.filterArray.push(passingObj2);
    }
    this.fromRow = 1;
  this.dataSource = [];
    this.getTransactionDetails();
}
menuClick(data:any,element:any){
if(data === "cloneTransaction"){
  this.rootScopeData.isCloneClicked = true;
 if(element.subprcode === "BKSIFT"){
    Object.assign(element,{clone: "Y"})
    this.rootScopeData.ownAccountCloneTransactionObject = element;
  }
  if(element.subprcode === "BKSIBT"){
    Object.assign(element,{clone: "Y"})
    this.rootScopeData.withinBankCloneTransactionObject = element;
  }
  if(element.subprcode === "BKSRNT"){
    Object.assign(element,{clone: "Y"})
    this.rootScopeData.localCloneTransactionObject = element;
  }
  if(element.subprcode === "TELTRF"){
    Object.assign(element,{clone: "Y"})
    this.rootScopeData.internationalCloneTransactionObject = element;
  }
}
else if(data === "editTransaction"){
  this.rootScopeData.isCloneClicked = true;
 if(element.subprcode === "BKSIFT"){
    Object.assign(element,{clone: "Y"})
    Object.assign(element,{edit: "Y"})
    this.rootScopeData.ownAccountCloneTransactionObject = element;
  }
  if(element.subprcode === "BKSIBT"){
    Object.assign(element,{clone: "Y"})
    Object.assign(element,{edit: "Y"})
    this.rootScopeData.withinBankCloneTransactionObject = element;
  }
  if(element.subprcode === "BKSRNT"){
    Object.assign(element,{clone: "Y"})
    Object.assign(element,{edit: "Y"})
    this.rootScopeData.localCloneTransactionObject = element;
  }
  if(element.subprcode === "TELTRF"){
    Object.assign(element,{clone: "Y"})
    Object.assign(element,{edit: "Y"})
    this.rootScopeData.internationalCloneTransactionObject = element;
  }
}
else if(data == "swift"){
  this.rootScopeData.accDetailsObject = {};
  this.rootScopeData.accDetailsObject.ref_NO = element.ref_NO;
  this.setDetails(
    element,
    '/transactionInquiry/swift-gpi'
  );
}
}

callSearchApi(event:any){
  this.textSearch = event.target.value;
  this.dataSource = [];
  this.fromRow = 1;
  this.toRow='';
  this.filterArray=[];
  this.filterflag ='';
  this.currentColumn = 'makerDate';
  this.sortDirection = 'desc';
  this.commonPagination?.paginator?.firstPage();
  this.getTransactionDetails();
}
}
