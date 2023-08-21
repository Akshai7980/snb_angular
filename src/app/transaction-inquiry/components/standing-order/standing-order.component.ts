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
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { TransactionInquiryService } from '../../services/transaction-inquiry.service';

@Component({
  selector: 'app-standing-order',
  templateUrl: './standing-order.component.html',
  styleUrls: ['./standing-order.component.scss'],
})
export class StandingOrderComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  @ViewChild(MatSort) sort!: MatSort;
  contextMenuList: any = [];
  fromRow: any;
  noRecordFoundInfoObj: any;
  rootScopeData: RootScopeDeclare = RootScopeData;

  toRow: any;
  dataSourceToPass: any;
  dataSourceLength: any;
  dataSource: any =[];
  totalRecords: any;
  tablePageSize: any;
  noRecordFlag: boolean = false;
  pageCount:any;

  isLoadingComplete = true;
  transactionInquiryStandingOrderDetailsRoute='/transactionInquiry/standingOrderDetails';
  responseHeader: any;
  currentColumn: string = '';
  sortDirection: string = '';
  @Output() onRefreshClick = new EventEmitter();
  isRefreshFlag: boolean =false;
  debitDetails: any;
  refreshClickedFlag = false;
  filterflag: string = '';
  filterValue: any;
  filterArray: any =[];
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchAmount: any;
  advancedSearchTo: any;
  advancedSearchTransactionType: any;
  advancedSearchType: any;
  advancedSearchPeriod: any;
  textSearch: string = '';
  constructor(private transactionService: TransactionInquiryService,private router: Router) {
    this.rootScopeData.activeTabName = 'standingOrder';
    this.rootScopeData.filterTableId = "accountsInquirytable";
    this.rootScopeData.advSearchCurrentPage = 'singleTransferTransactionInquiry'
    this.rootScopeData.accountsActiveModule="STNDINSTRINQ"; 
    this.fromRow = 1;
    this.currentColumn = 'valueDate';
    this.sortDirection = 'desc';
  }
  //  changed basdded on data
  displayedColumns: string[] = [
    'SIrefNo',
    'FROM',
    'PAYMENT_TYPE',
    'AMT',
    'STATUS',
    'BENEFICIARY_ACCOUNT',
    'action',
  ];
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
    //   { displayName: 'LBL_CHEQUE_BOOK_REQUEST', value: 'cheqeBookRequest' },
    //   { displayName: 'LBL_BOOK_DEPOSIT', value: 'bookDeposit' },
    //   { displayName: 'LBL_MANAGE_ALIAS', value: 'manageAlias' },
    //   { displayName: 'LBL_DWNLD_ESTMNT', value: 'downloadEStatement' },
    // ];
    let defaultPassingObj ={  
      "filterField": "",
      "filterConstraint": "contains",
      "filterValue": "",
    }
    this.filterArray =[defaultPassingObj];
    this.getDetails()
  }
  getDetails() {
    let params={
      moduleId:"STNDINSTRINQ",
      fromRow: this.fromRow,
      toRow: this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      filterArray: this.filterArray,
      flag :this.filterflag,
      searchText:this.textSearch
    }
    this.isLoadingComplete=false
    this.transactionService.getStandingOrderDetails(params).subscribe((data: any) => {
      this.isLoadingComplete = true;
      if (data.headerValue !== undefined) {
        this.responseHeader = data.headerValue;
      }
      if(data.data){
        // this.dataSourceToPass = data.data;
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(data.data);
        }else{
          this.dataSource = data.data;
          this.isRefreshFlag = false;
          this.commonPagination.paginator.firstPage();
        }
        this.refreshClickedFlag = false;
        // this.dataSource = this.dataSourceToPass;
        this.dataSourceLength = this.dataSource.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        this.dataSourceToPass.paginator = this.commonPagination.paginator;
        this.dataSourceToPass.sort = this.sort;
        // this.totalRecords = data.data.length;\
        this.totalRecords = data.headerValue.totalCount;
        this.pageCount = data.headerValue.recordCount;
        this.rootScopeData.standingOrderSummaryCount = this.totalRecords;
        // this.rootScopeData.accountsSummaryObject = data.data;
        this.noRecordFlag = false;
      }else{
        this.noRecordFlag = true;
      }
      // if (
      //   this.dataSource == null ||
      //   this.dataSource == '' ||
      //   this.dataSource == undefined || this.dataSource.length === 0
      // ) {
      //   this.noRecordFlag = !this.noRecordFlag;
      // }
    },
      (error: any) => {
        this.isLoadingComplete = true;
      });
  }
  triggerSearchFilter(event: any): void {
    let columnsToSearch = [ 
      {"name":"siCurrency", "fieldType":"ccy1"},
      {"name":"benefAcNo", "fieldType":"string"},
      {"name":"beneficiaryName", "fieldType":"string"}, 
      {"name":"debitAccount", "fieldType":"string"},
      {"name":"pymtType", "fieldType":"string"},
      {"name":"siRefNo", "fieldType":"string"},
      {"name":"nxtPymntDate", "fieldType":"date"},
      {"name":"siStatus", "fieldType":"string"},
      {"name":"siAmt", "fieldType":"amount1"}
    ];
    // let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    // this.dataSourceToPass= new MatTableDataSource(tableData);
    // this.commonPagination.paginator.firstPage();
    // this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows(this.rootScopeData.filterTableId, event.target.value);
  }

  // triggerDropdownFilter(event: any): void {
  //   showFilteredRows(this.rootScopeData.filterTableId, event);
  // }
  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.pageSize = 5;
    this.commonPagination.paginator.firstPage();
    this.onRefreshClick.emit('Y');
    this.refreshClickedFlag = true;
    this.filterArray =[]; 
    this.filterflag='';
    this.getDetails();
  }
  isSelectedRow(row: any) {
    // debugger
    this.isLoadingComplete = false; 
    this.rootScopeData.accountsSummaryObject = row;
    let params = {
      refNo: row.siRefNo
    }
    this.transactionService.getStandingOrderDetailPage(params).subscribe((resd:any)=>{
      this.isLoadingComplete = true;
      var standingDetails  = resd.data[0];
      let detparams = {
        "OD_ACC_NO": row.debitAccount,
        "COD_CORECIF": "",
        "REQ_COUNTRY_CODE": "SA",
        "UNIT_ID": "IGTSA"
      }
      this.transactionService.getAccountDetails(detparams).subscribe((res:any)=>{
        this.debitDetails = res.DATA;

        this.rootScopeData.standingOrderDetails = {
          details: standingDetails,
          summary: this.rootScopeData.accountsSummaryObject,
          paymentDetails: this.debitDetails.ACC_DETAILS
        }
  
        this.isLoadingComplete = true;
        this.router.navigate(['/transactionInquiry/standingOrderDetails']);
      })
      
    },
    (error) => {
      this.isLoadingComplete = true;
    })
  }
  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getDetails();
  }
  selectedRecord(event: any, element: any) {
    // this.rootScopeData.aramcoSummaryObject = element;
    this.rootScopeData.accountsSummaryObject = element;    
    this.isLoadingComplete = false;
    let params = {
      refNo: element.siRefNo
    }

    this.transactionService.getStandingOrderDetailPage(params).subscribe((resd:any)=>{
      this.isLoadingComplete = true;
      var standingDetails  = resd.data[0];
      let detparams = {
        "OD_ACC_NO": element.debitAccount,
        "COD_CORECIF": "",
        "REQ_COUNTRY_CODE": "SA",
        "UNIT_ID": "IGTSA"
      }
      this.transactionService.getAccountDetails(detparams).subscribe((res:any)=>{
        this.debitDetails = res.DATA;

        this.rootScopeData.standingOrderDetails = {
          details: standingDetails,
          summary: this.rootScopeData.accountsSummaryObject,
          paymentDetails: this.debitDetails.ACC_DETAILS
        }
  
        this.isLoadingComplete = true;
      })
      this.contextMenuList = [];
      if (element.siStatus == "Active") {
        let cancelMenu = { "display_key": 'LBL_CANCEL_TRANSACTION', "value": 'cancelTransaction', "item_id": 'CANCEL_SI_TRANSACTION' }
        this.contextMenuList.push(cancelMenu);
      }
      if (element.siStatus == "Active") {
        if(element.pymtType === "Own Account Transfer" || element.paymentMode === "BKSIFT"){
        let amend = { "display_key": 'LBL_AMEND', "value": 'amendTransaction', "item_id": 'STANDING_AMEND_OWN' };
        this.contextMenuList.push(amend);  
        }
        if(element.pymtType === "International Fund Transfer" || element.paymentMode === "TELTRF"){
        let amend = { "display_key": 'LBL_AMEND', "value": 'amendTransaction', "item_id": 'STANDING_AMEND_INTERNATIONAL' };
        this.contextMenuList.push(amend);  
        }
        if(element.pymtType === "Transfer Within Bank" || element.paymentMode === "BKSIBT"){
        let amend = { "display_key": 'LBL_AMEND', "value": 'amendTransaction', "item_id": 'STANDING_AMEND_WITHIN' };
        this.contextMenuList.push(amend); 
        }
        if(element.pymtType === "Domestic Fund Transfer" || element.paymentMode === "BKSRNT"){
          let amend = { "display_key": 'LBL_AMEND', "value": 'amendTransaction', "item_id": 'STANDING_AMEND_LOCAL' };
          this.contextMenuList.push(amend); 
        }
       }
      
    },
    (error) => {
      this.isLoadingComplete = true;
    }) 


    event?.stopPropagation();
   
    // let clone = { "display_key": 'LBL_CLONE_TRANSACTION', "value": 'cloneTransaction' };
    // this.contextMenuList.push(clone);
    // event?.stopPropagation();
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
    this.getDetails();
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
    // this.currentColumn =  event.searchwithin;
    // this.sortDirection = event.sortOrder;
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
        "filterField": "pymtType",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchTransactionType      
      }
       
      this.filterArray.push(passingObj2);

      let passingObj1 = {
        "filterField": "siAmt",
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
        "filterField": "pymtType",
        "filterConstraint": "contains",
        "filterValue": this.advancedSearchTransactionType      
      }
       
      this.filterArray.push(passingObj);

      let passingObj1 = {
        "filterField": "siAmt",
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
    this.getDetails();
}


menuClick(data:any,element:any){
  if(data === "amendTransaction"){
    // this.rootScopeData.isCloneClicked = true;
   if(element.pymtType === "Own Account Transfer" || element.paymentMode === "BKSIFT"){
      Object.assign(element,{amend: "Y"})
      this.rootScopeData.ownAccountSITransactionObject = element;
    }
    if(element.pymtType === "Transfer Within Bank" || element.paymentMode === "BKSIBT"){
      Object.assign(element,{amend: "Y"})
      this.rootScopeData.withinBankSITransactionObject = element;
    }
    if(element.pymtType === "Domestic Fund Transfer" || element.paymentMode === "BKSRNT"){
      Object.assign(element,{amend: "Y"})
      this.rootScopeData.localSITransactionObject = element;
    }
    if(element.pymtType === "International Fund Transfer" || element.paymentMode === "TELTRF"){
      Object.assign(element,{amend: "Y"})
      this.rootScopeData.internationalSITransactionObject = element;
    }
  }
  else if(data === "cancelTransaction"){
    this.rootScopeData.internationalSITransactionObject = element;
  }
  
}

callSearchApi(event:any){
  this.textSearch = event.target.value;
  this.dataSource = [];
  this.filterArray=[];
  this.filterflag='';
  this.fromRow=1;
  this.toRow='';
  this.commonPagination?.paginator?.firstPage();
  this.getDetails();
}
}
