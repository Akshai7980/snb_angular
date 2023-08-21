import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { environment } from 'src/environments/environment';
import { AccountDetailsService } from '../../services/account-details.service';
import { CommonInjectServiceService } from '../../services/common-inject-service.service';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { CommonService } from 'src/app/common-components/services/common.service';

@Component({
  selector: 'app-downloadcenter',
  templateUrl: './downloadcenter.component.html',
  styleUrls: ['./downloadcenter.component.scss']
})
export class DownloadcenterComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  displayedColumns: string[] = ['nickName', 'fullName', 'accNumber','type','COD_CORECIF','status', 'accBalance','equivalentAmt','action'];
  noRecordFoundInfoObj: any;
  norecordflag:boolean = false;
  dataSource: any = [];
  dataSourceToPass:any;
  dataSourceLength: any;
  tablePageSize :any;
  fromRow:any;
  toRow:any;
  totalRecords: any;
  currentColumn:string='';
  sortDirection:string='';
  downloadUrlBasePath: string = '';
  filterflag:string ="";
  enablePropertty:boolean =true;
  filterconstraint:string ="";
  filterfield:string="";
  maxdate=new Date()
  @Output() enabledProperty = new EventEmitter();
  @Output() onMenuClick = new EventEmitter();


  @Output() childEvent:EventEmitter<any> = new EventEmitter()
  rootScopeData:RootScopeDeclare=RootScopeData;
  responseHeader: any;
  isLoadingCompelete = true;
  advSearchPeriod = "";
  advSearchSearchWithin = "";
  advSearchSortOrder = "";
  advSearchFromDate = "";
  advSearchToDate = "";
  isRefreshFlag: boolean = false;
  constructor(private accountService:AccountDetailsService,private service: CommonInjectServiceService,private commonService:CommonService) {
    this.rootScopeData.activeTabName='downloadcenter';
    this.rootScopeData.filterTableId = 'downloadCenterInquiryTable'
    this.rootScopeData.advSearchCurrentPage = 'downloadCenterInquiryTable'
    this.rootScopeData.accountsActiveModule = 'STMTINQ'

    this.currentColumn ='reqDateTime';
    this.sortDirection ='desc';
    
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
   }

  ngOnInit(): void {
  
    this.downloadUrlBasePath = `${environment.restDownloadAPI}`
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_DOWNLOAD_CENTER", 
      "btnLabel":"Apply Now", 
      "btnLink": "/dashboard",
      "showBtn": "true",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getDownlaodDetails();
  }
  getDownlaodDetails(){
    this.isLoadingCompelete=false;
    let params = {
      fromRow: this.fromRow,
      toRow:this.toRow,
      sortcolumn :this.currentColumn,
      sortDirection: this.sortDirection,
      period:this.advSearchPeriod,
      fromDate : this.advSearchFromDate,
      toDate : this.advSearchToDate ,
      filterflag : this.filterflag  ,
      filterfield : this.filterfield,
      filterconstraint : this.filterconstraint       
    };
    this.accountService.getServicereqdowncenterDtls(params).subscribe((res:any)=>{
      this.isLoadingCompelete=true;
      if(res.headerValue !== undefined){
		  	this.responseHeader = res.headerValue;
		  }
      if(res.status === 500){
        this.norecordflag = true;
        this.enablePropertty = false;
        this.service.changeData("false");  //invoke new Data
      }
      else {
      this.totalRecords = this.responseHeader.totalCount;
      this.rootScopeData.accountsSummaryObject = res.data;
      this.rootScopeData.downloadcentersummarycount = this.responseHeader.totalCount;
      this.enablePropertty = true;
      this.norecordflag = false;
      if(this.isRefreshFlag === false){
        this.dataSource = this.dataSource.concat(res.data);
      }else{
        this.dataSource = res.data;
        this.isRefreshFlag = false;
      }
      // this.dataSource = res.data;
      this.service.changeData("true");  //invoke new Data
      this.dataSourceLength=this.dataSource.length;
      this.dataSourceToPass= new MatTableDataSource(this.dataSource)
      this.commonPagination.paginator.firstPage();
      this.dataSourceToPass.paginator=this.commonPagination.paginator;
      }

		  if(this.dataSource ===null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0){
            this.norecordflag = true;
            // this.enablePropertty = false;
            this.service.changeData("false");  //invoke new Data
          }
    }, (error: any) => {
      this.isLoadingCompelete=true;
      this.norecordflag=true;
      // this.enablePropertty = false;
      this.service.changeData("false");  //invoke new Data
      // this.rootScopeData.showSystemError = true;
    })
  }
  paginationChangeClick(params:any){
    this.fromRow = params.fromRow;
    this.toRow= params.toRow;
    this.getDownlaodDetails();
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getDownlaodDetails();   
  }

  triggerSearchFilter(event:any){
    let columnsToSearch = [ 
      {"name":"criteriaType", "fieldType":"string"},
      {"name":"stmtStatus", "fieldType":"string"}, 
      {"name":"statementPeriod", "fieldType":"string"},
      {"name":"statFormat", "fieldType":"string"},
      {"name":"txnRefNo", "fieldType":"string"},
      {"name":"reqDateTime", "fieldType":"date"},
      {"name":"totalNumber", "fieldType":"string"}
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
    this.commonPagination.paginator.firstPage();
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows(this.rootScopeData.filterTableId, event.target.value);
  }
 
    refreshSummary(){
      this.fromRow = 1
      this.toRow = undefined;
      this.isRefreshFlag = true;
      this.dataSource = [];
      this.commonPagination.paginator.firstPage();
      this.getDownlaodDetails();
    }

    advancedSearchApply(event:any){
      this.advSearchPeriod = "date";
      this.advSearchFromDate = event.fromDate;
      this.advSearchToDate = event.toDate;  
       this.filterflag ='Y';
       this.filterconstraint ="date";
       this.filterfield='reqDateTime';
       this.fromRow = 1;
      this.dataSource = [];
      this.getDownlaodDetails();
  }



  downloadStatements(selectedrow :any){
    document.getElementById('download_'+selectedrow.txnRefNo)?.classList.add('showLoader');
       let fromToDate = selectedrow.statementPeriod;
       fromToDate = fromToDate.replaceAll(' ', '');
       let url = this.downloadUrlBasePath + '?moduleId=EXPORTSTMNT' + '&exportFormat=PDF&reqId=' + selectedrow.txnRefNo + '&filePath=' +selectedrow.zipPath+ '&simulate=N&statementPeriod=' +fromToDate; 
     
      this.isLoadingCompelete = false;
      let params = {
        "moduleId": "EXPORTSTMNT",
        "exportFormat": "PDF",
        "reqId":selectedrow.txnRefNo,
        "filePath":selectedrow.zipPath,
        "simulate":"N",
        "statementPeriod":fromToDate
      }
      this.commonService.downloadDocumentPost(params).subscribe((res:any)=>{
        this.isLoadingCompelete = true;
        const src = 'data:application/'+"PDF"+';base64,'+ res.fileContent; // contentType of File pdf/csv/xls
        const link = document.createElement("a")
        link.href = src
        link.download = res.fileName; //Dynamic FileName 
        link.click();
        link.remove();
        document.getElementById('download_'+selectedrow.txnRefNo)?.classList.remove('showLoader');
        // if (res.status == 200) {
        //   window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');         
        // }
      },error=>{
        document.getElementById('download_'+selectedrow.txnRefNo)?.classList.remove('showLoader');
        if (error.status == 200) {    
          // window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');
        } 
        else {
          this.isLoadingCompelete = true;
        }
      })


    
      // this.accountService.exportDocument(url).subscribe(response => {
      //   document.getElementById('download_'+selectedrow.txnRefNo)?.classList.remove('showLoader');
      //   if (response.status == 200) {
      //     window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');         
      //   }
      // }, error => {
      //   document.getElementById('download_'+selectedrow.txnRefNo)?.classList.remove('showLoader');
      //   if (error.status == 200) {    
      //     window.open(url+'&_dinsess='+this.rootScopeData.userInfo._cpReqToken+'&langId='+this.rootScopeData.userInfo.mLanguage, '_self');
      //   } 
      // });
  
  
    
  
  }

  triggerDropdownFilter(event:any):void{
    showFilteredRows(this.rootScopeData.filterTableId, event); 
  }



}
