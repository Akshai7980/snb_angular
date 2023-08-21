import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { CommonService } from '../../services/common.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-duplicate-record-details',
  templateUrl: './duplicate-record-details.component.html',
  styleUrls: ['./duplicate-record-details.component.scss']
})
export class DuplicateRecordDetailsComponent implements OnInit {
  isLoadingCompelete: boolean = true;
  @Input() sortOptions?: any = {};
  @Input() moduleId?: any;
  @Input() refNo? : any;
  @Input() subprdt? :any;
  // @Input() recordSummaryObject: any = {};
  @Output() sortColumnEmit: any = new EventEmitter();
  currentColumn: string = '';
  sortOrder: string = '';
  noRecordFlag: boolean = false;
  noRecordFoundInfoObj = {
    msg: 'LBL_NO_RECORDS_FOUND',
    btnLabel: 'Apply Now',
    btnLink: '/dashboard',
    showBtn: 'true',
    showMsg: 'true',
    showIcon: 'true',
  };
  displayedColumns: any = [];
  printSection = 'recordSummaryPrintSection';
  isShowSummaryTool: boolean = false;
  fromRow: number = 1;
  toRow: number = totalRecordsPerRequest;
  dataRecord: any;
  logo = 'assets/images/snb-logo-print.png';
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
arrayLength:any;
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  recordSummaryDataSource: any = [];
  totalRecords: any;
  recordSummaryObject: any;
  recordArray: any =[];
  constructor( @Optional() @Inject(MAT_DIALOG_DATA) public params: any,private service :CommonService) { }

  ngOnInit() {
    this.getDuplicateRecordsDetails(this.params);
  }

  ngAfterViewInit() {
    if (this.recordSummaryObject && this.recordSummaryObject.data) {
      this.recordSummaryDataSource.paginator = this.commonPagination.paginator;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.recordSummaryObject?.currentValue) {
      this.noRecordFlag = false;
      this.recordSummaryDataSource = new MatTableDataSource(
        changes?.recordSummaryObject?.currentValue.data
      );
      this.recordSummaryDataSource.paginator = this.commonPagination?.paginator;
    }
    if (changes?.sortOptions?.currentValue) {
      this.sortOptions = changes?.sortOptions?.currentValue;
      this.currentColumn = this.sortOptions.sortColumn;
      this.sortOrder = this.sortOptions.sortOrder;
    }
  }

  getDuplicateRecordsDetails(params:any){
    params.fromRow = this.fromRow;
    params.toRow = this.toRow;
    this.service.getDuplicateRecordsDetails(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res.data) {
          // this.fileStatus = res.fileData.fileStatus;
          this.recordArray = this.recordArray.concat(res.data)
          this.sortOptions = res.headerValue;
          this.totalRecords = res.headerValue.totalCount;
          this.arrayLength = this.recordArray.length;
          this.recordSummaryObject = {
            data: this.recordArray,
            displayDetails: [ 
              {
                displayLabel: 'LBL_TRANSACTION_REF',
                displayKey: 'txnId',
              },
              {
                displayLabel: 'LBL_CREDIT_ACCOUNT',
                displayKey: 'beneAccNo',
              },
              // {
              //   displayLabel: 'LBL_DEBIT_ACCOUNT',
              //   displayKey: 'accNo',
              // },
              {
                displayLabel: 'LBL_TYPE',
                displayKey: 'payType',
              },
              {
                displayLabel: 'LBL_AMOUNT',
                displayKey: 'payAmt',
                type:'amount',
                supportValue: 'ccy'  
              },
              // {
              //   displayLabel: 'LBL_RJCT_RSN',
              //   displayKey: 'rejectReason',
              // },
              {
                displayLabel: 'LBL_UTI',
                displayKey: 'utiReference',
              },
              {
                displayLabel: 'LBL_CHILD_REFERENCE',
                displayKey: 'childReference',
              },
              {
                displayLabel: 'LBL_DATE',
                displayKey: 'valueDate',
                type: 'date',
              },
              {
                displayLabel: 'LBL_STATUS',
                displayKey: 'status',
              },
            ],
          };
          this.loadDuplicateDetails();
        }

      },
      (error: any) => {
        // this.showRecordSummary = false;
        this.isLoadingCompelete = true;
        this.noRecordFlag = true;
      }
    );
  }

  loadDuplicateDetails(){
    if (this.recordSummaryObject.data && this.recordSummaryObject.data.length) {
      this.displayedColumns = this.recordSummaryObject.displayDetails.map(
        (column: any) => column.displayKey
      );
      this.recordSummaryDataSource = new MatTableDataSource(
        this.recordSummaryObject.data
      );
      const currencyFormatPipe = new CurrencyFormatPipe();
      const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
      this.dataRecord = this.recordSummaryObject.displayDetails.map((col: any) => {
        return {
          columnLabel: col.displayLabel,
          columnKey: col.displayKey,
          cellData: (element: any) => {
            if (col.type === 'amount' && element[col.displayKey]) {
              if (col.supportValue && element[col.supportValue]) {
                return `${currencyFormatPipe.transform(
                  unformattedAmountPipeFilter.transform(
                    element[col.displayKey],
                    element[col.supportValue]
                  ),
                  element[col.supportValue]
                )} ${element[col.supportValue]}`;
              } else {
                return `${element[col.displayKey]} --`
              }
            }
            return element[col.displayKey]
              ? `${element[col.displayKey]}`
              : '--';
          },
        };
      });
      this.currentColumn = this.sortOptions.sortColumn;
      this.sortOrder = this.sortOptions.sortOrder;
      this.totalRecords = this.sortOptions.totalCount;
    } else {
      this.noRecordFlag = true;
    }
  }

  sortColumn(colName: any) {
    if (!this.currentColumn || !this.sortOrder) return;
    this.currentColumn = colName;
    this.sortOrder === 'desc'
      ? (this.sortOrder = 'asc')
      : (this.sortOrder = 'desc');
    this.fromRow = 1;
    this.toRow = Number(this.toRow - this.fromRow) + 1;
    const data = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortOrder,
      fromRow: this.fromRow,
      toRow: this.toRow,
    };
    this.getDuplicateRecordsDetails(this.params);
    
  }

  paginationChangeClick(params: any) {
    const data = {
      sortColumn: this.currentColumn,
      sortOrder: this.sortOrder,
      fromRow: params.fromRow,
      toRow: params.toRow,
    };
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.sortColumnEmit.emit(data);
    this.getDuplicateRecordsDetails(this.params);
  }

 

  expandPanel(matExpansionPanel: any, event: any): void {
    this.isShowSummaryTool = !this.isShowSummaryTool;
    event.stopPropagation();
    if (!this._isExpansionIndicator(event.target)) {
      this.isShowSummaryTool= false;
      matExpansionPanel.close();
    }
  }

  private _isExpansionIndicator(target: any): boolean {
    const expansionIndicatorClass = 'mat-expansion-indicator';

    return (target.classList && target.classList.contains(expansionIndicatorClass));
  }

}
