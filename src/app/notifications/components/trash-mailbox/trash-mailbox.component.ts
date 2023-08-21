import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CommonInjectServiceService } from 'src/app/accounts/services/common-inject-service.service';
import { DeletePopupComponent } from 'src/app/common-components/components/delete-popup/delete-popup.component';
import { DeleteSuccessPopupComponent } from 'src/app/common-components/components/delete-success-popup/delete-success-popup.component';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-trash-mailbox',
  templateUrl: './trash-mailbox.component.html',
  styleUrls: ['./trash-mailbox.component.scss']
})
export class TrashMailboxComponent implements OnInit {
  [x: string]: any;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  dataSourceLength: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  displayedColumns: string[] = ['datetime', 'refno', 'subject', 'action'];
  dataSource: any = [];
  noRecordFoundInfoObj: any;
  dataSourceToPass: any;
  norecordflag: boolean = false;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  totalRecords: any;
  isLoadingCompelete = true;
  sortDirection: string = '';
  currentColumn: string = '';
  responseHeader: any;
  deleteButton: boolean = false;
  isRefreshFlag: boolean = false;
  constructor(private notificationService: NotificationsService, public dialog: MatDialog,private service: CommonInjectServiceService) {
    this.tablePageSize = pageOptions;
    this.fromRow = 1;
    // this.toRow = totalRecordsPerRequest;

    this.currentColumn ='messageStrTs';
    this.sortDirection ='asc';
   }

  ngOnInit(): void {
    this.rootScopeData.activeTabName = 'trash';
    this.noRecordFoundInfoObj = {
      "msg": "LBL_NO_TRASH_FOUND",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
    this.getTrashDetails();
    this.rootScopeData.activeTabName = 'trash';
    this.rootScopeData.paymentActiveTabName = 'trash'
  }

  getTrashDetails() {
    this.isLoadingCompelete = false;

    let params = {
      sortcolumn: this.currentColumn,
      sortDirection: this.sortDirection,
      fromRow : this.fromRow,
      toRow : this.toRow,
    };

    this.notificationService.getTrashSummaryAPiCall(params).subscribe((res: any) => {
      this.isLoadingCompelete = true;

      if (res.headerValue !== undefined) {
        this.responseHeader = res.headerValue;
      }

      if (res.status === 500) {
        this.enabledProperty = false;
        this.norecordflag = true;
        this.service.changeData("false");  //invoke new Data
      }
      else {
        if(this.isRefreshFlag === false){
          this.dataSource = this.dataSource.concat(res.data);
        }else{
          this.dataSource = res.data;
          this.isRefreshFlag = false;
        }
        // this.dataSource = res.data;
        this.enabledProperty = true;
        this.service.changeData("true");  //invoke new Data
        this.dataSourceLength = this.dataSource.length;
        this.dataSourceToPass = new MatTableDataSource(this.dataSource)
        this.dataSourceToPass.paginator = this.commonPagination.paginator;
        this.totalRecords = res.headerValue.totalCount;
        this.rootScopeData.trashSummaryCount = this.responseHeader.totalCount;
      }
      if (this.dataSource === null || this.dataSource === '' || this.dataSource === undefined || this.dataSource.length === 0) {
        this.norecordflag = true;
        this.service.changeData("false");  //invoke new Data
      }

    }, error => {
      this.isLoadingCompelete = true;
      this.norecordflag = true;
      this.enabledProperty = false;
      this.service.changeData("false");  //invoke new Data
    })
  }
  // triggerSearchFilter(event :any){
  //   showFilteredRows('alertsDefaultCntr', event.target.value); 
  // }

  popupFunction(data: any) {
    let dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '400px'
    });
    const sub = dialogRef.componentInstance.onDelete.subscribe(() => {
      this.deleteRecord(data.mailId);
      this.dialog.closeAll();
    });
  }

  deleteRecord(refNum: any) {
    this.isLoadingCompelete = false;
    let type = "trash";
    this.notificationService.deleteTrashAPiCall(refNum, type).subscribe(
      data => {
        this.isLoadingCompelete = true;
        let vres: any = [];
        vres = data;
        if (vres.data[0].deleteDesc === "Success") {
          // console.log(vres.data[0].refNum);
          let succDialog = this.dialog.open(DeleteSuccessPopupComponent, {
            width: '400px',
            data: {
              data: refNum
            }
          });
          const subNew = succDialog.componentInstance.onOkClick.subscribe(() => {
            this.getTrashDetails();
            this.dialog.closeAll();
          });
        }
      }, error => {
        this.isLoadingCompelete = true;
      }

    )

  }

  refreshSummary() {
    this.fromRow = 1
    this.toRow = undefined;
    this.isRefreshFlag = true;
    this.dataSource = [];
    this.commonPagination.paginator.firstPage();
    this.getTrashDetails();
  }

  paginationChangeClick(params: any) {
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getTrashDetails();
  }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if(this.sortDirection === '' ) {
      this.sortDirection = 'asc';
    }else if(this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    this.getTrashDetails();
  }

  // checkUncheckAll() {
  //   for (let i = 0; i < this.dataSource.length; i++) {
  //     this.dataSource[i].isSelected = this.isMasterSel;
  //   }
  // }
  // // Check All Checkbox Checked
  // isAllSelected() {
  //   this.isMasterSel = this.dataSource.every(function(item:any) {
  //       return item.isSelected == true;
  //     })
  // }

  // gettrashSelected(value: any,index :any){
  //   debugger;
  // this.selectedRecords.push(value);
  // }

  // isUncheckAll()
  // {
  //   for (let i = 0; i < this.dataSource.length; i++) {
  //     this.dataSource[i].isSelected = true;
  //   }
  // }

  // triggerCheckAll(checkbox: any): void {
  //   if(this.selectedAll) {
  //     if(this.dataSource && this.dataSource.length > 0) {
  //       this.deleteButton = true;
  //     }
  //   }else {
  //     this.deleteButton = false;
  //   }
  //   for (let i = 0; i < this.dataSource.length; i++) {
  //     this.dataSource[i].selected = this.selectedAll;
  //   }
  // }

  // triggercheckIfAllSelected(checkbox: any, elm: any, ind: any) {
  //     this.dataSource[ind].selected = elm.selected;
  //     this.deleteButton = false;
  //     for (let i = 0; i < this.dataSource.length; i++) {
  //       if(this.dataSource[i].selected) {
  //         this.deleteButton = true;
  //         break;
  //       }
  //     }
  //     for (let i = 0; i < this.dataSource.length; i++) {
  //       if(!this.dataSource[i].selected) {
  //         this.selectedAll = false;
  //         break;
  //       }
  //     }
  // }


}
