import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeletePopupComponent } from 'src/app/common-components/components/delete-popup/delete-popup.component';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { totalRecordsPerRequest, pageOptions } from 'src/app/utility/paginator-config';
import { showFilteredRecords, showFilteredRows } from 'src/app/utility/tableFilter';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.scss']
})
export class SentComponent implements OnInit {
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength:any;
  rootScopeData:RootScopeDeclare=RootScopeData;
  displayedColumns: string[] = ['messages', 'datetime', 'transactiontype','action'];
  dataSource: any =[];
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
  constructor(private notificationService:NotificationsService,public dialog: MatDialog) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;
    this.rootScopeData.activeTabName = 'sent';

    this.currentColumn ='messageStrTs';
    this.sortDirection ='asc';
   }

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      "msg":"LBL_NO_SENTMAIL_FOUND", 
      "btnLabel":"Apply Now", 
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getInboxDetails();
  }

  getInboxDetails(){
    this.isLoadingCompelete = false;

    let params = {
      sortcolumn :this.currentColumn,
      sortDirection:this.sortDirection,
      fromRow : this.fromRow,
      toRow : this.toRow,
    };
    
    this.notificationService.getSentMailsummaryApiCall(params).subscribe((res:any)=>{
      this.isLoadingCompelete = true;

      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }
      if(res.status === 500){
        this.enabledProperty = false;
        this.norecordflag = true;
      }
      else {
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(res.data);
        }else{
          this.dataSource = res.data;
          this.isRefreshFlag = false;
        }
    // this.dataSource = res.data;
    this.rootScopeData.sentMailSummaryCount = this.responseHeader.totalCount;
    this.dataSourceLength=this.dataSource.length;
    this.enabledProperty = true;
    this.norecordflag = false;
    this.dataSourceToPass= new MatTableDataSource(this.dataSource)
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
    this.totalRecords = this.responseHeader.totalCount;
      }
		if(this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0){
      this.norecordflag = true;
      }
    },error =>{
      this.isLoadingCompelete = true;
      this.norecordflag = true;
      this.enabledProperty = false;
    })
  }
  triggerSearchFilter(event:any){
    let columnsToSearch = [ 
      {"name":"messageStrTs", "fieldType":"string"},
      {"name":"odRelNumber", "fieldType":"string"}, 
      {"name":"odMailSubject", "fieldType":"string"}
    ];
    let tableData = showFilteredRecords(this.dataSource, columnsToSearch, event.target.value); 
    this.dataSourceToPass= new MatTableDataSource(tableData);
    this.dataSourceToPass.paginator=this.commonPagination.paginator;
    // showFilteredRows('sentDefaultCntr', event.target.value); 
  }

  refreshSummary(){
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.firstPage();
    this.getInboxDetails();
  }

  paginationChangeClick(params:any){
    // console.log("SPEVENT====>",params)
    this.fromRow = params.fromRow;
    this.toRow= params.toRow;
    this.getInboxDetails();
  }

  popupFunction(data:any){
    let dialogRef = this.dialog.open(DeletePopupComponent,{
      width:'400px'
    });
    const sub = dialogRef.componentInstance.onDelete.subscribe(() => {
     this.deleteRecord(data.odRelNumber);
     this.dialog.closeAll();
    });
  }

  deleteRecord(refNum:any){
    this.isLoadingCompelete = false;
    this.notificationService.deleteAlertAPiCall(refNum).subscribe(
      data =>{
        this.isLoadingCompelete = true;
        let vres:any = [];
        vres = data;
        if (vres.data[0].deleteDesc === "Success"){
          this.rootScopeData.showSystemError = true;
          this.rootScopeData.toastMessage = "LBL_SENTMAIL_DELETE_TOAST";
          this.getInboxDetails();
        }
        }, error => {
          this.isLoadingCompelete = true;
      }
      
    )
  
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === 'desc' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getInboxDetails();
  }
}
