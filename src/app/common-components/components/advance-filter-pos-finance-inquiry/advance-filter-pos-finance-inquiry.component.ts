import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PosFinanceService } from 'src/app/pos-finance/services/pos-finance.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-advance-filter-pos-finance-inquiry',
  templateUrl: './advance-filter-pos-finance-inquiry.component.html',
  styleUrls: ['./advance-filter-pos-finance-inquiry.component.scss'],
})
export class AdvanceFilterPosFinanceInquiryComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  isLoadingComplete: boolean = true;
  fromDateError = false;
  toDateError = false;
  fromDate: any;
  clearFlag: boolean = false;
  toDate: any;
  toDateValue: any;
  showDateErrorMessage: boolean = false;
  minDate: any;
  maxDate = new Date();
  fromDateValue: any;
  reqId: any;
  status: any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  statuslist: any;
  constructor(private posFinanceService: PosFinanceService) {}

  ngOnInit(): void {
    this.getPosFinanceInquiryList();
  }

  getPosFinanceInquiryList() {
    const params = {
      sortColumn: '',
      sortOrder: '',
      fromRowNo: '',
      toRowNo: '',
      filterField: '',
      filterConstraint: '',
      status: '',
      fromDate: '',
      toDate: '',
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      filterFlag: '',
    };
    this.posFinanceService
      .getPosFinanceInquiryList(params)
      .subscribe((res: any) => {
        this.statuslist = res.data;
        this.statuslist = this.getUniqueListBy(
          this.statuslist,
          'statusDesc'
        );
      });
  }

  getUniqueListBy(arr: any, key: any) {
    return [
      ...new Map(
        arr.map((item: { [x: string]: any }) => [item[key], item])
      ).values(),
    ];
  }

  stopAdvancedSearchClose(event: any): void {
    event.stopImmediatePropagation();
  }
  onClickClear(): void {
    this.reqId = '';
    this.status = '';
    this.fromDate = '';
    this.toDate = '';
    this.fromDateValue='';
    this.toDateValue='';
    this.fromDateError = false;
    this.toDateError = false;
    this.clearFlag = !this.clearFlag;
  }

  onClickApply(): void {
    const params = {
      reqId: this.reqId,
      status: this.status,
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
    this.clearFlag = false;
  }

  getFromDate(event: any) {
    this.fromDate =
      '' +
      (event.getDate() > 9 ? event.getDate() : '0' + event.getDate()) +
      '/' +
      (event.getMonth() + 1 > 9
        ? event.getMonth() + 1
        : '0' + (event.getMonth() + 1)) +
      '/' +
      event.getFullYear();
    if (!(this.toDateValue && this.toDateValue.getTime() >= event.getTime())) {
      this.fromDateValue = event;
    }
    this.fromDateError = false;
    this.getCheck();
  }
  getToDate(event: any) {
    this.toDate =
      '' +
      (event.getDate() > 9 ? event.getDate() : '0' + event.getDate()) +
      '/' +
      (event.getMonth() + 1 > 9
        ? event.getMonth() + 1
        : '0' + (event.getMonth() + 1)) +
      '/' +
      event.getFullYear();
    this.toDateValue = event;
    this.toDateError = false;
    this.getCheck();
  }
  getCheck() {
    if (this.toDateValue && this.fromDateValue) {
      if (this.toDateValue.getTime() < this.fromDateValue.getTime()) {
        this.toDate = '';
        this.toDateValue = null;
      }
    }
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
