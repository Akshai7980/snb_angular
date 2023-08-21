import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { MyTaskService } from '../../services/my-task.service';

@Component({
  selector: 'app-sadad-billers',
  templateUrl: './sadad-billers.component.html',
  styleUrls: ['./sadad-billers.component.scss']
})
export class SadadBillersComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength:any;
  rootScopeData:RootScopeDeclare=RootScopeData
  noRecordFoundInfoObj: any;
  selectedGroup: string = '';
  dataSourceToPass:any;
  displayedColumns: string[] = ['name','shortName','customerNumber', 'subscriberID', 'action'];
  dataSource: any=[];
  norecordflag:boolean = false;
  tablePageSize :any;
  fromRow:any;
  toRow:any;
  totalRecords: any;
  isLoadingCompelete = true;
  currentColumn: string = '';
  sortDirection: string = '';
  responseHeader: any;
  isRefreshFlag: boolean = false;
  refreshClickedFlag: boolean = false;
  advancedSearchFromDate: any;
  advancedSearchFromTo: any;
  advancedSearchName: any;
  advancedSearchBankName: any;
  filterArray: any;
  advancedSearchpaymentType: any;

  constructor(private mytaskService:MyTaskService, private router:Router) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
    this.rootScopeData.advSearchCurrentPage = 'singleFile'
   }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'sadadbillers';
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_REQUEST_FOUND", 
      "btnLabel":"Apply Now", 
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
    this.currentColumn ='maker_date';
    this.sortDirection ='desc';
    this.getSadadBillRequestDetails();
  }


  getSadadBillRequestDetails(){
    let params = {
      fromRow: this.fromRow,
      toRow: this.toRow,
      groupBy: this.selectedGroup,
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      filterArray: this.filterArray
    };
    this.isLoadingCompelete = false;
    this.mytaskService.pendingSadadBillerSummaryApi(params).subscribe((res:any)=>{
      this.isLoadingCompelete = true;
      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
      // this.dataSource = res.data;
      if(this.isRefreshFlag === false){
        this.dataSource = this.dataSource.concat(res.data);
      }else{
        this.dataSource = res.data;
        this.isRefreshFlag = false;
      }
      this.refreshClickedFlag = false;
      this.dataSourceLength=this.dataSource.length;
      this.dataSourceToPass= new MatTableDataSource(this.dataSource)
      this.dataSourceToPass.paginator=this.commonPagination.paginator;
      this.totalRecords = res.headerValue.totalCount;
      this.rootScopeData.sadadBillerMyTasksCount = this.totalRecords;
		        if(this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length===0){
            this.norecordflag = !this.norecordflag;
          }
    }, (error: any) => {
      this.isLoadingCompelete = true;
    })
  }

triggerSearchFilter(event:any){
  let columnsToSearch = [ 
    {"name":"BillerName", "fieldType":"string"},
    {"name":"nickName", "fieldType":"string"}, 
    {"name":"consumerNumber", "fieldType":"string"},
    {"name":"SubscriberID", "fieldType":"string"}
    
  ];
  let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
  this.dataSourceToPass= new MatTableDataSource(tableData);
  this.dataSourceToPass.paginator=this.commonPagination.paginator;
  // showFilteredRows('sadadbillersDefaultCntr', event.target.value); 
}

refreshSummary(){
  this.fromRow = 1
  this.toRow = undefined;
  this.isRefreshFlag = true;
  this.dataSource = [];
  this.commonPagination.paginator.pageSize = 5;
  this.totalRecords = this.totalRecords;
  this.commonPagination.paginator.firstPage();
  this.sortDirection ='desc';
  this.refreshClickedFlag = true;
  this.getSadadBillRequestDetails();
}

paginationChangeClick(params:any){
  // console.log("SPEVENT====>",params)
  this.fromRow = params.fromRow;
  this.toRow= params.toRow;
  this.getSadadBillRequestDetails();
}

goToDetailsScreen(row:any){  
  this.rootScopeData.pendingActivitiesSadadBillerSummaryObj= row;
  this.router.navigate(['/mytask/sadadbillerDetails']);
}

onApproveClick(event: any, row: any) {
  event.stopImmediatePropagation();
  this.rootScopeData.pendingActivitiesSadadBillerSummaryObj= row;
  this.isLoadingCompelete = false;
  this.mytaskService.getSadadGalleryDetails(row).subscribe((data:any)=>{
    this.isLoadingCompelete = true;
    if(data.data){
      this.rootScopeData.pendingActivitiesSadadBillerDetailsObj =  data.data[0];
      this.router.navigate(['/mytask/authorizeSadadBillerRequest']);
    }
  }, (error: any) => {
    this.isLoadingCompelete= true;
  })
}


onRejectClick(event: any, row: any) {
  event.stopImmediatePropagation(); 
  this.rootScopeData.pendingActivitiesSadadBillerSummaryObj= row;
  this.isLoadingCompelete = false;
  this.mytaskService.getSadadGalleryDetails(row).subscribe((data:any)=>{
    this.isLoadingCompelete = true;
    if(data.data){
      this.rootScopeData.pendingActivitiesSadadBillerDetailsObj = data.data[0];
      this.router.navigate(['/mytask/rejectSadadBillerRequest']);
    }
  }, (error: any) => {
    this.isLoadingCompelete= true;
  })

}

sortColumn(colName: any) {
  this.currentColumn = colName;
  if (this.sortDirection === 'desc') {
    this.sortDirection = 'asc';
  } else if (this.sortDirection === 'asc') {
    this.sortDirection = 'desc';
  }
  this.getSadadBillRequestDetails();
}

advancedSearchApply(event:any){

  this.advancedSearchFromDate = event.dateFrom;
  this.advancedSearchFromTo = event.dateTo;
  this.advancedSearchName = event.name; 
  this.advancedSearchBankName = event.bankName; 
  this.advancedSearchpaymentType = event.paymentType; 

  this.filterArray =[]; 
  if(this.advancedSearchFromDate && this.advancedSearchFromTo){
      let fromDate=this.getDateFormat(this.advancedSearchFromDate)
      let toDate=this.getDateFormat(this.advancedSearchFromTo)
    let passingObj = {
      "filterField": "valueDate",
      "filterConstraint": "date",
      "filterValue": "",
      "fromAmt": "",
      "toAmt": "",
      "fromDate": fromDate,
      "toDate": toDate
    }
     
    this.filterArray.push(passingObj);

    let passingObj1 = {
      "filterField": "name",
      "filterConstraint": "contains",
      "filterValue": this.advancedSearchName      
    }
     
    this.filterArray.push(passingObj1);

    let passingObj2 = {
      "filterField": "bankName",
      "filterConstraint": "contains",
      "filterValue": this.advancedSearchBankName      
    }
     
    this.filterArray.push(passingObj2);
    let passingObj3 = {
      "filterField": "paymentType",
      "filterConstraint": "contains",
      "filterValue": this.advancedSearchpaymentType      
    }
     
    this.filterArray.push(passingObj3);
  }   
  this.dataSource = [];
  this.getSadadBillRequestDetails();
}

getDateFormat(dateFrmat:any){
    let date= dateFrmat.getDate()<10?"0"+dateFrmat.getDate():dateFrmat.getDate();
      let month = (dateFrmat.getMonth()+1)<10?"0"+(dateFrmat.getMonth()+1):(dateFrmat.getMonth()+1);
      let year = dateFrmat.getFullYear();
      let formatedDate=date+"/"+month+"/"+year

  return formatedDate;
}
}
