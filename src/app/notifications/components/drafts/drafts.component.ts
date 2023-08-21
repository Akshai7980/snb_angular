import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { showFilteredRows } from 'src/app/utility/tableFilter';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength:any;
  rootScopeData:RootScopeDeclare=RootScopeData;
  displayedColumns: string[] = ['messages', 'datetime', 'transactiontype','action'];
  dataSource: any;
  noRecordFoundInfoObj: any;
  dataSourceToPass:any;
  norecordflag:boolean = false;
  tablePageSize :any;
  fromRow:any;
  toRow:any;
  totalRecords: any;
  isLoadingCompelete = true;
  constructor(private notificationService:NotificationsService) { 
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    this.toRow = totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'drafts';
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_DRAFTS", 
      "btnLabel":"Apply Now", 
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getdraftsummary();
  }


  getdraftsummary(){
    this.isLoadingCompelete = false;
    this.notificationService.getViewTrashSummaryAPiCall().subscribe((res:any)=>{
      this.isLoadingCompelete = true;
    this.dataSource = res.data;
    this.dataSourceLength=this.dataSource.length;
    this.dataSourceToPass= new MatTableDataSource(this.dataSource)
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
    this.totalRecords = res.data.TOTAL_COUNT;
		if(this.dataSource === null || this.dataSource === '' || this.dataSource === undefined){
      this.norecordflag = !this.norecordflag;
      }
    },error =>{
      this.isLoadingCompelete = true;
    })
  }
  triggerSearchFilter(event:any){
    showFilteredRows('draftDefaultCntr', event.target.value); 
  }

  refreshSummary(){
    this.getdraftsummary();
  }

  paginationChangeClick(params:any){
    // console.log("SPEVENT====>",params)
    this.fromRow = params.fromRow;
    this.toRow= params.toRow;
    this.getdraftsummary();
  }

}
