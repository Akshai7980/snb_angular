import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength:any;
  rootScopeData:RootScopeDeclare=RootScopeData;
  displayedColumns: string[] = ['messages', 'datetime'];
  dataSource: any = [];
  noRecordFoundInfoObj: any;
  dataSourceToPass:any;
  norecordflag:boolean = false;
  tablePageSize :any;
  fromRow:any;
  toRow:any;
  totalRecords: any;
  isLoadingCompelete = true;
  sortDirection:string='';
  currentColumn: string = '';
  responseHeader: any;
  enabledProperty:boolean=false;
  isRefreshFlag: boolean = false;


  constructor(private notificationService:NotificationsService) { 
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
    this.rootScopeData.activeTabName = 'announcement';

    this.currentColumn ='OD_MAKER_DATE';
    this.sortDirection ='asc';
  }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_ANNOUNCEMENT_FOUND", 
      "btnLabel":"Apply Now", 
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getannouncementDetails();
  }

  getannouncementDetails(){
    this.isLoadingCompelete = false;

    let params = {
      sortcolumn :this.currentColumn,
      sortDirection:this.sortDirection,
      fromRow : this.fromRow,
      toRow : this.toRow,
    };
    this.notificationService.getAnnouncementsSummary(params).subscribe((res:any)=>{
      this.isLoadingCompelete = true;

      
      if (res.HEADER_VALUE !== undefined) {
        this.responseHeader = res.HEADER_VALUE;
      }
      if(res.status === 500){
        this.enabledProperty = false;
        this.norecordflag = true;
      }
      else {
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(res.DATA.ALL_RECORDS);
        }else{
          this.dataSource = res.DATA.ALL_RECORDS;
          this.isRefreshFlag = false;
        }
        // this.dataSource=res.DATA.ALL_RECORDS;
        this.rootScopeData.announcementSummaryCount= this.responseHeader.totalCount;
        this.dataSourceLength=this.dataSource.length;
        this.enabledProperty = true;
        this.norecordflag = false;
        this.dataSourceToPass= new MatTableDataSource(this.dataSource)
        this.dataSourceToPass.paginator=this.commonPagination.paginator;
        this.totalRecords = res.HEADER_VALUE.totalCount;
      }
        if(this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0){
          this.norecordflag = true;
          }
    }, error =>{
      this.isLoadingCompelete = true;
      this.norecordflag = true;
      this.enabledProperty = false;
    })
  }
  triggerSearchFilter(event :any){
    let columnsToSearch = [ 
      {"name":"WELCOMEMESSAGE", "fieldType":"string"},
      {"name":"OD_MAKER_DATE", "fieldType":"string"}
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows('announcementDefaultCntr', event.target.value); 
  }

  refreshSummary()
  {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.firstPage();
    this.getannouncementDetails();
  }

  paginationChangeClick(params:any){
    // console.log("SPEVENT====>",params)
    this.fromRow = params.fromRow;
    this.toRow= params.toRow;
    this.getannouncementDetails();
  }


  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getannouncementDetails();
  }

}
