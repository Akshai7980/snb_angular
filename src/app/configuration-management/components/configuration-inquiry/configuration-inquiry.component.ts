import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { ConfigurationManagementService } from '../../services/configuration-management.service';
import { Router } from '@angular/router';
import { showFilteredRows } from 'src/app/utility/tableFilter';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { MatTableDataSource } from '@angular/material/table';
import { logoprint } from 'src/app/utility/common-utility';
@Component({
  selector: 'app-configuration-inquiry',
  templateUrl: './configuration-inquiry.component.html',
  styleUrls: ['./configuration-inquiry.component.scss'],
})
export class ConfigurationInquiryComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  logo :string="";
  @Input() debitAccDetails: any;
  debitDataObj: any;
  selectedDebitObj: any;
  selectedQuickTransferTo: any;
  resetRemain = false;
  amountDetailsObj: any;
  amount = 0;
  pmtType: any;
  amountToPass = '';
  authDataObj: any;
  total = '';
  receiptData: any;
  fieldSet: any;
  hideAll = false;
  hideAddtional = false;
  errorCode: any;
  otpError: string = '';
  otpValue: any;
  displayedColumns: string[] = [
    
    'accountNumber',
    'refNumber',
    'cif',
    'date',
    'status',
    'rejectreason',
    'action',
  ];
  dataSourceToPass: any;
  dataSource: any;
  secAuthRef: any;
  authOptions: any;
  toggleHide: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;

  isLoadingComplete: boolean = false;
  noRecord: boolean = true;
  isProceed: boolean = false;

  displayColumns: string[] = [
    
    'accountNumber',
    'refNumber',
    'cif',
    'date',
    'status',
    'rejectreason',
    'action',
  ];
  actionsList = [
    // { display_key: 'LBL_MODIFY', value: 'modify', item_id: 'QUICK_TRANSFER_CONFIGURATION' }
    { display_key: 'LBL_VIEWDETAILS', value: 'viewDetails', item_id: 'QUICK_TRANSFER_CONFIGURATION_DETAILS_PAGE' }
  ];

  debitAccountList: any = [];
  printSection='';
  contextMenuList: any = [];
  totalRecords: any;
  norecordflag:boolean=false;
  tablePageSize :any;
  fromRow:any;
  toRow:any;
  noRecordFoundInfoObj: any;
  responseHeader:any;
  currentColumn: string = '';
  sortDirection: string = '';
  filterArray: any = [];
  constructor(
    private  configManagement: ConfigurationManagementService,
    private  router: Router
  ) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.logo = logoprint();
  }

  ngOnInit(): void {
    this.getDebitData();
    this.printSection="configurationInquiry";
    this.rootScopeData.filterTableId="configTable"
    this.contextMenuList = [
      {"displayName": "LBL_CHEQUE_BOOK_REQUEST", "value":"cheqeBookRequest"},
      {"displayName": "LBL_BOOK_DEPOSIT", "value":"bookDeposit"},
      {"displayName": "LBL_MANAGE_ALIAS", "value":"manageAlias"},
      {"displayName": "LBL_DWNLD_ESTMNT", "value":"downloadEStatement"} 
    ];
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
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
    this.currentColumn ='';
    this.sortDirection ='desc';
  }

  getDebitData(): void {
    this.isLoadingComplete = false;
    this.configManagement.getIPSRegistrationSummary().subscribe(
      (registrations: any) => {
        this.isLoadingComplete = true;
        if (registrations && registrations.headerValue !== undefined) {
          this.responseHeader = registrations.headerValue;
        }
        if (registrations && registrations.data && registrations.data.length) {
          this.dataSource = registrations.data;
          this.dataSourceLength = this.dataSource.length;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
          this.dataSourceToPass.paginator = this.commonPagination.paginator;
          this.totalRecords = this.dataSource.length;
          this.norecordflag = false;
        } else {
          this.norecordflag = true;
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  modifyRegistration(action: string, selectedElement: any): void {
    // if (action === 'modify') {
    //   this.rootScopeData.selectedProxy = selectedElement;
    //   this.rootScopeData.isIpsRegistration = false;
    // }
    if (action === 'viewDetails') {
      this.rootScopeData.selectedProxy = selectedElement;
      // this.rootScopeData.isIpsRegistration = false;
    }
    if(action === 'viewDetailsRow'){
      this.rootScopeData.selectedProxy = selectedElement;
      this.router.navigate(['/configurationManagement/configurationInquiryDetailsLayout']);
    }
  }

  triggerSearchFilter(event:any){
    // console.log(this.rootScopeData.filterTableId)
    showFilteredRows(this.rootScopeData.filterTableId, event.target.value);
  }
  triggerDropdownFilter(event:any):void{
    showFilteredRows(this.rootScopeData.filterTableId, event); 
  }
  paginationChangeClick(params: any) {
    // console.log("SPEVENT====>",params)
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getDebitData();
  }
  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortDirection === 'desc') {
      this.sortDirection = 'asc';
    } else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getDebitData();
  }

  stopRowClick(event:any){
    event?.stopPropagation();
  }
}
