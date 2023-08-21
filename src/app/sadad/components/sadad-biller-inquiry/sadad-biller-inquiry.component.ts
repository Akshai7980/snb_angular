import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonInjectServiceService } from 'src/app/accounts/services/common-inject-service.service';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { SadadPaymentService } from '../../services/sadad-payment.service';



@Component({
  selector: 'app-sadad-biller-inquiry',
  templateUrl: './sadad-biller-inquiry.component.html',
  styleUrls: ['./sadad-biller-inquiry.component.scss']
})
export class SadadBillerInquiryComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  dataSourceLength: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSourceToPass: any;
  displayedColumns: string[] = ['shortName', 'gcif', 'billerGroup', 'billerCompany', 'subscriberNumber', 'action'];
  dataSource: any=[];
  noRecordFoundInfoObj: any;
  norecordflag: boolean = false;
  responseHeader: any;
  totalRecords: any;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  isLoadingCompelete = true;
  errorMessage: boolean = false;
  nickName: any;
  editedNickName: any;
  enablePropertty:boolean =true;
  routeDetailScreen:any;
  sortDirection: string = '';
  currentColumn: string = '';
  isRefreshFlag: boolean=false;
  refreshClickedFlag = false;
  billerGroupCode: any = '';
  billerCompanyCode: any = '';
  filterArray: any = [];
  filterflag:string ="";
  constructor(private sadadService:SadadPaymentService,private service: CommonInjectServiceService,private router:Router,private commonService:CommonService) {
    this.rootScopeData.activeTabName = 'sadadBiller';
    this.rootScopeData.accountsActiveModule = 'SADADREGBILLS';
    this.rootScopeData.filterTableId = 'sadadBillerInquirytable';
    this.rootScopeData.advSearchCurrentPage = 'sadadBillerInquiry';
    this.currentColumn = 'makerDate';
    this.sortDirection = 'desc';
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_BILLERS_FOUND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "true",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getSadadBillerInfo();
  }

 

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.totalRecords = this.totalRecords;
    this.commonPagination.paginator.pageSize = 5;
    this.commonPagination.paginator.firstPage();
    this.refreshClickedFlag = true;
    this.getSadadBillerInfo();
  }
  getSadadBillerInfo() {
    this.isLoadingCompelete = false;
    let params={
      fromRow:this.fromRow,
      toRow:this.toRow,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,     
      filterArray: this.filterArray,
      flag :this.filterflag
    }
    this.sadadService.getSadadBillerInfo(params).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
     
      if(res.status === 500){
        this.enablePropertty = false;
        this.norecordflag = true;
        this.service.changeData("false");  //invoke new Data
      }
      else {
      // this.dataSourceToPass = res.data;
      // this.dataSource = this.dataSourceToPass;

      if(this.isRefreshFlag === false){
        this.dataSource = this.dataSource.concat(res.data);
      }else{
        this.dataSource = res.data;
        this.isRefreshFlag = false;
      }
      this.refreshClickedFlag = false;
      this.norecordflag = false;
      this.service.changeData("true");  //invoke new Data
      this.dataSourceLength = this.dataSource.length;
      this.rootScopeData.accountsSummaryObject=res.data;
      this.dataSourceToPass = new MatTableDataSource(this.dataSource);
      if(this.dataSource.length > 0){
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
      }
      this.totalRecords = res.headerValue.totalCount;
      this.rootScopeData.sadadBillerInquiryCount = this.totalRecords
      }
      if (this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0) {
         this.norecordflag = true;
         this.service.changeData("false");  //invoke new Data
       }

    }, (error: any) => {
      this.isLoadingCompelete = true;
      this.norecordflag = true;
      this.service.changeData("false");  //invoke new Data
    }
    )
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getSadadBillerInfo();
  }

  goToDetailsScreen(element :any){
    this.rootScopeData.sadadBillerSummaryObject = element;
    this.router.navigate(['/sadad/sadadBillerDetails'])
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getSadadBillerInfo();
  }

  deleteSadadBiller(element:any,event:any){
   event.stopImmediatePropagation();
   this.isLoadingCompelete = false;
    this.commonService.sadadBillerdetailsDetailsApiCall(element.refNo,element.nickName).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      if(res.data[0]){
        Object.assign(res.data[0],{refNum:element.refNo})
        this.rootScopeData.deleteSadadBillerObject = res.data[0];
        this.router.navigate(['/sadad/deleteSadadBiller'])
      }
      
    }, (error: any) => {
      this.isLoadingCompelete= true;
      this.rootScopeData.showSystemError = true;
    })
  }

  triggerSearchFilter(event:any): void {
    let columnsToSearch = [ 
      {"name":"nickName", "fieldType":"string"},
      {"name":"billerGroupName", "fieldType":"string"},
      {"name":"billerName", "fieldType":"string"}, 
      {"name":"billAccount", "fieldType":"string"}
      
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows(this.rootScopeData.filterTableId, event.target.value); 
  }

  advancedSearchApply(event:any){
    this.filterflag ='Y';
    this.filterArray =[]; 
    let passingObj = {
      "filterField": "billerGroupName",
      "filterConstraint": "contains",
      "filterValue": event.billerGroupName      
    }
    this.filterArray.push(passingObj);
    let passingObj1 = {
      "filterField": "billerName",
      "filterConstraint": "contains",
      "filterValue": event.billerCompanyName      
    } 
    this.filterArray.push(passingObj1);
    this.getSadadBillerInfo();
  }
}


