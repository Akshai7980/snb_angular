import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyTaskService } from 'src/app/mytask/services/my-task.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-advanced-filter-mada-card-list',
  templateUrl: './advanced-filter-mada-card-list.component.html',
  styleUrls: ['./advanced-filter-mada-card-list.component.scss'],
})
export class AdvancedFilterMadaCardListComponent implements OnInit {
  dateTime = 'desc';
  period = 'all';
  leftToggle = true;
  rightToggle = false;
  fromDate: any;
  clearFlag: boolean = false;
  toDate: any;
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();
  showDateErrorMessage: boolean = false;
  fromDateValue: any;
  toDateValue: any;
  serviceType: any = 'all';
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSource: any;
  serviceTypeList: any;
  constructor(private mytaskService: MyTaskService) {}

  ngOnInit(): void {
    this.getServiceType();
  }

  leftToggleCntl() {
    document.getElementById('leftToggle')?.classList.add('active');
    document.getElementById('rightToggle')?.classList.remove('active');
    this.leftToggle = true;
    this.rightToggle = false;
  }

  rightToggleCntl() {
    document.getElementById('rightToggle')?.classList.add('active');
    document.getElementById('leftToggle')?.classList.remove('active');
    this.rightToggle = true;
    this.leftToggle = false;
  }

  stopAdvancedSearchClose(event: any) {
    event.stopImmediatePropagation();
  }

  onClickApply() {
    if (this.leftToggle && (!this.fromDate || !this.toDate)) {
      this.showDateErrorMessage = true;
      return;
    }

    if (this.leftToggle === false) {
      let date = new Date();
      let startDate;
      let endDate;
      if (this.period === 'all') {
        this.fromDate = '';
        this.toDate = '';
      }
      if (this.period === 'monthly') {
        startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.fromDate =
          '' +
          startDate.getDate() +
          '/' +
          (startDate.getMonth() + 1) +
          '/' +
          startDate.getFullYear();
        this.toDate =
          '' +
          endDate.getDate() +
          '/' +
          (endDate.getMonth() + 1) +
          '/' +
          endDate.getFullYear();
      }
      if (this.period === 'quarterly') {
        startDate = new Date(
          date.getFullYear(),
          date.getMonth() - 3,
          date.getDate()
        );
        endDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0
        );
        this.fromDate =
          '' +
          startDate.getDate() +
          '/' +
          (startDate.getMonth() + 1) +
          '/' +
          startDate.getFullYear();
        this.toDate =
          '' +
          endDate.getDate() +
          '/' +
          (endDate.getMonth() + 1) +
          '/' +
          endDate.getFullYear();
      }
      if (this.period === 'yearly') {
        startDate = new Date(
          date.getFullYear() - 1,
          date.getMonth(),
          date.getDate()
        );
        endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.fromDate =
          '' +
          startDate.getDate() +
          '/' +
          (startDate.getMonth() + 1) +
          '/' +
          startDate.getFullYear();
        this.toDate =
          '' +
          endDate.getDate() +
          '/' +
          (endDate.getMonth() + 1) +
          '/' +
          endDate.getFullYear();
      }
    }
    const params = {
      sortOrder: this.dateTime,
      fromDate: this.fromDate,
      toDate: this.toDate,
      serviceType: this.serviceType,
    };
    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
    this.showDateErrorMessage = false;
    // this.period = 'all';
    // this.fromDate = '';
    // this.toDate = '';
    // this.leftToggleCntl();
    this.clearFlag = false;
    // this.clearFlag = !this.clearFlag;
  }

  onClickClear() {
    this.dateTime = 'desc';
    this.period = 'all';
    this.serviceType = 'all';
    this.leftToggle = true;
    this.rightToggle = false;
    this.fromDateValue='';
    this.toDateValue='';
    this.clearFlag = !this.clearFlag;
    this.leftToggleCntl();
  }

  getFromDate(event: any) {
    this.fromDate =
      '' +
      event.getDate() +
      '/' +
      (event.getMonth() + 1) +
      '/' +
      event.getFullYear();
    if (!(this.toDateValue && this.toDateValue.getTime() >= event.getTime())) {
      this.fromDateValue = event;
    }
  }

  getToDate(event: any) {
    this.toDate =
      '' +
      event.getDate() +
      '/' +
      (event.getMonth() + 1) +
      '/' +
      event.getFullYear();
    this.toDateValue = event;
  }

  getServiceType() {
    const params = {
      unitId: this.rootScopeData.userInfo.UNIT_ID,
      fromRow: '',
      toRow: '',
      sortcolumn: '',
      sortDirection: '',
      filterField: '',
      filterConstraint: '',
      fromDate: '',
      toDate: '',
      filterflag: '',
    };

    this.mytaskService.getMadaCardSummary(params).subscribe(
      (res: any) => {
        this.serviceTypeList = res.data;
      },
      (error: any) => {}
    );
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
