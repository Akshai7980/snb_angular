import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { totalRecordsPerRequest } from 'src/app/utility/paginator-config';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-record-summary',
  templateUrl: './record-summary.component.html',
  styleUrls: ['./record-summary.component.scss'],
})
export class RecordSummaryComponent implements OnInit {
  @Input() sortOptions?: any = {};
  @Input() moduleId?: any;
  @Input() refNo? : any;
  @Input() subprdt? :any;
  @Input() recordSummaryObject: any = {};
  @Output() sortColumnEmit: any = new EventEmitter();
  @Input() pageCall = false;
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
  data: any;
  logo = 'assets/images/snb-logo-print.png';
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
  isLoadingCompelete: boolean = true;

  @ViewChild('paginator')
  commonPagination!: PaginationComponent;

  recordSummaryDataSource: any = [];
  totalRecords: any;
  constructor() { }

  ngOnInit() {
    this.isLoadingCompelete = false;
    if (this.recordSummaryObject.data && this.recordSummaryObject.data.length) {
      this.isLoadingCompelete = true;
      this.displayedColumns = this.recordSummaryObject.displayDetails.map(
        (column: any) => column.displayKey
      );
      this.recordSummaryDataSource = new MatTableDataSource(
        this.recordSummaryObject.data
      );
      const currencyFormatPipe = new CurrencyFormatPipe();
      const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
      this.data = this.recordSummaryObject.displayDetails.map((col: any) => {
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
      this.isLoadingCompelete = true;
      this.noRecordFlag = true;
      
    }
  }

  ngAfterViewInit() {
    if (this.recordSummaryObject.data) {
      this.recordSummaryDataSource.paginator = this.commonPagination.paginator;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.isLoadingCompelete = false;
    if (changes?.recordSummaryObject?.currentValue) {
      this.isLoadingCompelete = true;
      this.noRecordFlag = false;
      this.recordSummaryDataSource = new MatTableDataSource(
        changes?.recordSummaryObject?.currentValue.data
      );
      this.recordSummaryDataSource.paginator = this.commonPagination?.paginator;
    }
    else{
      this.isLoadingCompelete = true;
    }
    if (changes?.sortOptions?.currentValue) {
      this.isLoadingCompelete = true;
      this.sortOptions = changes?.sortOptions?.currentValue;
      this.currentColumn = this.sortOptions.sortColumn;
      this.sortOrder = this.sortOptions.sortOrder;
    }
    else{
      this.isLoadingCompelete = true;
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
    this.sortColumnEmit.emit(data);
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
