import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { pageOptions, totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { CommonService } from '../../services/common.service';
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { DuplicateRecordDetailsComponent } from '../duplicate-record-details/duplicate-record-details.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-duplicate-records',
  templateUrl: './duplicate-records.component.html',
  styleUrls: ['./duplicate-records.component.scss'],
})
export class DuplicateRecordsComponent implements OnInit {
  @Input() duplicateList: any = [];
  @Input() duplicateDetailsList: any = [];
  @Input() summaryList: any = [];
  @Input() sortOptions?: any = {};
  @Input() moduleId?: any;
  @Input() totalrecords?: any;
  @Output() sortColumnEmitDup: any = new EventEmitter();
  @Output() callDuplicateRecordEmit: any = new EventEmitter();
  @Input() pageCall?: any;
  dataSource: any;
  currentColumn:string='';
  sortOrder:string='';
  printSection="duplicateRecordSummaryPrintSection";
  isShowSummaryTool: boolean = false;
  fromRow: any;
  toRow: any;
   noRecordFlag: boolean = false;
  noRecordFoundInfoObj: any;
  pageLength:any;
  tablePageSize: any;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  details: any;
  isLoadingCompelete: boolean = true;
  rootScopeData:RootScopeDeclare=RootScopeData;
  recordArray: any =[];
  recordSummaryObject: any;
  fileStatus: any;
  lastDate = new Date();
  
  constructor(public dialog: MatDialog, private service :CommonService) { 
    this.fromRow= 1;
    this.toRow= totalRecordsPerRequest;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<PeriodicElementDuplicate>(
      this.duplicateList
    );
    this.dataSource.paginator = this.commonPagination?.paginator;
    this.currentColumn = this.sortOptions.sortColumn;
    this.sortOrder = this.sortOptions.sortOrder;
    this.tablePageSize = pageOptions;
    this.pageLength = this.totalrecords;
    // this.commonPagination.paginator.pageSize = 5;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.duplicateList?.currentValue) {
      this.dataSource = new MatTableDataSource<PeriodicElementDuplicate>(
        changes?.duplicateList?.currentValue
      );
      // this.pageLength = changes?.duplicateList?.currentValue?.length;
      // this.dataSource.paginator = this.paginator;
      if(this.commonPagination?.paginator) {
        this.commonPagination.paginator.pageSize = 5;
      }
      this.dataSource.paginator = this.commonPagination?.paginator;
    }
    if (changes?.sortOptions?.currentValue) {
      this.sortOptions = changes?.sortOptions?.currentValue
      this.currentColumn = this.sortOptions.sortColumn;
      this.sortOrder = this.sortOptions.sortOrder;
    }
    
  }

  displayedColumns: string[] = [
    'transactionId',
    'accNo',
    'seqNo',
    'valueDate',
    'amount',
    'subType',
    'orderDate'
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.commonPagination?.paginator;
  }

  sortColumn(colName: any) {
    if (!this.currentColumn || !this.sortOrder) return;
    this.currentColumn = colName;
    this.sortOrder === 'desc' ? this.sortOrder = 'asc' : this.sortOrder = 'desc';
    const data = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortOrder,
      fromRow: 0,
      toRow: (this.toRow - this.fromRow) + 1
    };
    // this.fetchSummaryRecord();
    // this.paginator.pageIndex = 0;
    this.sortColumnEmitDup.emit(data);
  }

  paginationChangeClick(params: any) {
    const data = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortOrder,
      fromRow: params.fromRow,
      toRow: params.toRow
    }
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.sortColumnEmitDup.emit(data);
  }

  shouldDisplayDate(date:Date) : boolean {
    let vdate = undefined;    
    if(date){
      vdate = new Date(date)
      if (vdate > this.lastDate) {        
          return true;
      }      
    }    
   return false;
    
}

  setSummaryToolFlag() {
    this.isShowSummaryTool = !this.isShowSummaryTool;
  }
  deleteRecord(row:any,event:any){
    let dialogRef = this.dialog.open(DeletePopupComponent,{
      width:'400px'
    });
    const sub = dialogRef.componentInstance.onDelete.subscribe(() => {
    this.deleteSelectedRecord(row);
    this.dialog.closeAll();
    });
  }
  deleteSelectedRecord(data:any){
    this.isLoadingCompelete= false;
    let param={
      accNo:data && data.accNo? data.accNo :"",
      row:data && data.row? data.row :"",
      valueDate:data && data.valueDate? data.valueDate :"",
      amount:data && data.amount? data.amount :"",
    }
    this.service.deleteDuplicateFileRecord(param).subscribe((resp:any)=>{
      this.isLoadingCompelete= true;
      if(resp.dataValue.status==="Success"){
        this.callDuplicateRecordEmit.emit();
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage = "LBL_DELETE_DUPLICATE_RECORD_MSG";
      }else{
        this.rootScopeData.showSystemError = true;
        this.rootScopeData.toastMessage=resp.dataValue.errorDesc;
      }
    },err=>{
      this.isLoadingCompelete= true;
      
    })
  }

  openDialog(event : any) {
      // this.isLoadingCompelete = false;
      const params = {
        refNo: event.transactionId
          ? event.transactionId
          : '',
        subPdt: this.duplicateDetailsList?.subProductCode
          ? this.duplicateDetailsList?.subProductCode
          : '',
        sortColumn: this.currentColumn,
        sortOrder: this.sortOrder,
        fromRow: this.fromRow,
        toRow: this.toRow,
        // pageName:'Inquiry',
        accNo:event.accNo,
        filetype:event.subType,
        seqNo:event.row,
        func: this.duplicateDetailsList.functionCode
      };
            // this.showRecordSummary = true;
            this.dialog.open(DuplicateRecordDetailsComponent, {
              height: '450px',
              width: '845px',
              data: params,
            });
    
  }
}

export interface PeriodicElementDuplicate {
  transactionId: string;
  requester:string;
  accNo: number;
  valueDate: string;
  row  : string;
  amount: number;
  subType:string;
  orderDate:string;
  reject:string;
}
