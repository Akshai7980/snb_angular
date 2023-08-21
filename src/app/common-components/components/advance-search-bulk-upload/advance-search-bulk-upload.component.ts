import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyTaskService } from 'src/app/mytask/services/my-task.service';

@Component({
  selector: 'app-advance-search-bulk-upload',
  templateUrl: './advance-search-bulk-upload.component.html',
  styleUrls: ['./advance-search-bulk-upload.component.scss'],
})
export class AdvanceSearchBulkUploadComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  @Input() bulkUploadSummaryObj: any;
  status: any;
  statusErrorMessage: boolean = false;

  leftToggle = true;
  rightToggle = false;
  clearFlag: boolean = false;
  showDateErrorMessage: boolean = false;
  dateOrderErrorMessage: boolean = false;
  periodErrorMessage: boolean = false;
  dateFrom: any;
  dateTo: any;
  period: any;
  maxDate: any;
  minDate: any;
  fromDateValue: any;
  toDateValue: any;
  dateOrder: any;
  dataSource: any;
  statusDropDown: any;
  fromDateErrorMessage:boolean = false; 
  toDateErrorMessage:boolean = false;
  maxFromDate = new Date();
  maxToDate = new Date();
  minFromDate :any;
  minToDate :any;
  constructor() {}

  ngOnInit(): void {
    this.statusValue();
  }
  statusValue() {
    this.statusDropDown = this.getUniqueListBy(
      this.bulkUploadSummaryObj,
      'beneFileStatus'
    );
  }

  getUniqueListBy(arr: any, key: any) {
    return [
      ...new Map(
        arr.map((item: { [x: string]: any }) => [item[key], item])
      ).values(),
    ];
  }

  leftToggleCntl() {
    if ((this.leftToggle = true)) {
      document.getElementById('rightToggle')?.classList.remove('active');

      document.getElementById('leftToggle')?.classList.add('active');
      this.rightToggle = false;
      this.onClickClear();

    }
  }

  rightToggleCntl() {
    if ((this.rightToggle = true)) {
      document.getElementById('leftToggle')?.classList.remove('active');

      document.getElementById('rightToggle')?.classList.add('active');
      this.leftToggle = false;
      this.onClickClear();
    }
  }

  stopAdvancedSearchClose(event: any) {
    event.stopImmediatePropagation();
  }

  getFromDate(event: any) {
    this.dateFrom = event;
    this.minToDate = this.dateFrom
  }
  getToDate(event: any) {
    this.dateTo = event;
    this.maxFromDate = this.dateTo
  }

  onClickApply() {
    let params;
    // if (this.leftToggle) {
    //   if (this.dateFrom && this.dateTo && this.status && this.dateOrder) {
    //     params = {
    //       dateFrom: this.dateFrom,
    //       dateTo: this.dateTo,
    //       status: this.status,
    //       order: this.dateOrder,
    //       isdate: this.leftToggle ? true : false,
    //     };
    //     this.advancedSearchParams.emit(params);

    //     this.showAdvancedSearchPopup = false;
    //     // this.dateFrom = '';
    //     // this.dateTo = '';
    //     // this.status = '';
    //     // this.dateOrder = '';
    //     // this.clearFlag = !this.clearFlag;
    //     this.clearFlag = false;
    //   }else {
    //     this.showDateErrorMessage = this.dateFrom ? false : true;
    //     this.statusErrorMessage = this.status ? false : true;
    //     this.dateOrderErrorMessage = this.dateOrder ? false : true;
    //   }
    // } else if (this.rightToggle) {
    //   if (this.period && this.status && this.dateOrder) {
    //     params = {
    //       period: this.period,
    //       status: this.status,
    //       order: this.dateOrder,
    //       isdate: this.leftToggle ? true : false,
    //     };

    //     this.advancedSearchParams.emit(params);

    //     this.showAdvancedSearchPopup = false;
    //     // this.period = '';
    //     // this.status = '';
    //     // this.dateOrder = '';
    //     // this.clearFlag = !this.clearFlag;
    //     this.clearFlag = false;
    //   } else {
    //     this.statusErrorMessage = this.status ? false : true;
    //     this.periodErrorMessage = this.period ? false : true;
    //     this.dateOrderErrorMessage = this.status ? false : true;
    //   }
    // }
    if (this.leftToggle) {
      if(this.dateFrom || this.dateTo){
        if(this.dateFrom && this.dateTo){
          // this.showDateErrorMessage = false;
          this.fromDateErrorMessage=false;
          this.toDateErrorMessage=false;
        }else{
          // this.showDateErrorMessage = true;
          this.fromDateErrorMessage = this.dateFrom ? false : true;
          this.toDateErrorMessage = this.dateTo ? false : true;
        }
      }
      if(this.status || this.dateOrder ||(this.dateFrom && this.dateTo)){
        params = {
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
          status: this.status,
          order: this.dateOrder,
          isdate: this.leftToggle ? true : false,
        };
        this.advancedSearchParams.emit(params);
        this.clearFlag = false;
        this.showAdvancedSearchPopup = false;
      }
      if(!this.fromDateErrorMessage && !this.toDateErrorMessage){
        this.showAdvancedSearchPopup = false;
      }else{
        this.showAdvancedSearchPopup = true;
      }
    }else if (this.rightToggle){
      if (this.period || this.status || this.dateOrder) {
        params = {
          period: this.period,
          status: this.status,
          order: this.dateOrder,
          isdate: this.leftToggle ? true : false,
        };
        this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;
        this.clearFlag = false;
      }
  }
}
  onClickClear() {
    this.dateFrom = '';
    this.dateTo = '';
    this.status = '';
    this.dateOrder = '';
    this.period = '';
    this.showDateErrorMessage = false;
    this.dateOrderErrorMessage = false;
    this.statusErrorMessage = false;
    this.periodErrorMessage = false;
    this.clearFlag = !this.clearFlag;
    this.fromDateErrorMessage = false;
    this.toDateErrorMessage = false;
    this.minFromDate='';
    this.minToDate='';
    this.maxFromDate = new Date();
    this.maxToDate = new Date();
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
