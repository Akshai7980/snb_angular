import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PosService } from '../../services/pos.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-generate-statement',
  templateUrl: './generate-statement.component.html',
  styleUrls: ['./generate-statement.component.scss'],
})
export class GenerateStatementComponent implements OnInit {
  periods: any = [];
  settled: any = [];
  dateSort: any = [];
  exportType: any;
  showDateErrorMessage: boolean = false;
  dateFrom: any;
  dateTo: any;
  maxDate: any;
  minDate: any;
  clearFlag: boolean = false;
  fromDateValue: any;
  cardValue: any;
  periodValue: any;
  settledData: any;
  dateSortData: any;
  amountData: any = '';
  amountToData: any = '';
  sequenceData: any;
  authNumberData: any;
  cardTypeData: any;
  showInitialPage: boolean = false;
  @Output() goToInitialPage = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();

  showIntialPageEmit: any;
  showDate: boolean = false;
  showAmtError: boolean = false;

  @Input() merchantDetail: any;

  rootScopeData: RootScopeDeclare = RootScopeData;
  cardType: any = [];

  constructor(private readonly posService: PosService) {}

  ngOnInit() {
    this.getAllCardType();
    this.getAllPeriod();
    this.getDateSorts();
    this.getExportType();
    this.getAllSettled();
  }

  getFromDate(event: any) {
    var endDate = new Date(event);
    this.dateFrom =
      '' +
      endDate.getDate().toString().padStart(2, '0') +
      '/' +
      (endDate.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      endDate.getFullYear();
  }

  getToDate(event: any) {
    var endDate = new Date(event);
    this.dateTo =
      '' +
      endDate.getDate().toString().padStart(2, '0') +
      '/' +
      (endDate.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      endDate.getFullYear();
  }

  getAllCardType() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.posService.getCardType(params).subscribe(
      (res: any) => {
        if (
          res &&
          res.data &&
          res.data.length > 0 &&
          res.data[0].cardType &&
          res.data[0].cardType.length > 0
        ) {
          this.cardType = res.data[0].cardType;
        }
      },
      (error: any) => {}
    );
  }

  getAllPeriod() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.posService.getPeriod(params).subscribe(
      (res: any) => {
        if (
          res &&
          res.data &&
          res.data.length > 0 &&
          res.data[0].cardPeriod &&
          res.data[0].cardPeriod.length > 0
        ) {
          this.periods = res.data[0].cardPeriod;
        }
      },
      (error: any) => {}
    );
  }

  getAllSettled() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.posService.getSettled(params).subscribe(
      (res: any) => {
        if (
          res &&
          res.data &&
          res.data.length > 0 &&
          res.data[0].settledOption &&
          res.data[0].settledOption.length > 0
        ) {
          this.settled = res.data[0].settledOption;
        }
      },
      (error) => {}
    );
  }

  getDateSorts() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.posService.getDateSort(params).subscribe(
      (res: any) => {
        if (
          res &&
          res.data &&
          res.data.length > 0 &&
          res.data[0].sortDate &&
          res.data[0].sortDate.length > 0
        ) {
          this.dateSort = res.data[0].sortDate;
        }
      },
      (error: any) => {}
    );
  }

  getExportType() {
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.posService.getExportType(params).subscribe(
      (res: any) => {
        if (
          res &&
          res.data &&
          res.data.length > 0 &&
          res.data[0].exportAs &&
          res.data[0].exportAs.length > 0
        ) {
          this.exportType = res.data[0].exportAs;
        }
      },
      (error) => {}
    );
  }

  clearAllFields() {
    this.cardValue = '';
    this.periodValue = '';
    this.settledData = '';
    this.dateSortData = '';
    this.amountData = '';
    this.amountToData = '';
    this.sequenceData = '';
    this.authNumberData = '';
    this.cardTypeData = '';
    this.clearFlag = true;
    this.showInitialPage = true;
    const data = {
      clear: this.showInitialPage,
    };

    this.goToInitialPage.emit(data);
  }

  submitfn() {
    const data = {
      clear: this.showInitialPage ? this.showInitialPage : '',
      cardValue: this.cardValue ? this.cardValue : '',
      periodValue: this.periodValue ? this.periodValue : '',
      settledData: this.settledData ? this.settledData : '',
      dateSortData: this.dateSortData ? this.dateSortData : '',
      amountFromData: this.amountData ? this.amountData : '',
      amountToData: this.amountToData ? this.amountToData : '',
      sequenceData: this.sequenceData ? this.sequenceData : '',
      authNumberData: this.authNumberData ? this.authNumberData : '',
      cardTypeData: this.cardTypeData ? this.cardTypeData : '',
      dateFrom: this.dateFrom ? this.dateFrom : '',
      dateTo: this.dateTo ? this.dateTo : '',
    };
    if (this.showAmtError === false) {
      this.submit.emit(data);
    }
  }

  showDateValue(event: any) {
    if (event === 'Custom Date') {
      this.showDate = true;
    } else if (event !== 'Custom Date') {
      this.showDate = false;
    }
  }

  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }

  checkAmount() {
    if (this.amountData > this.amountToData) {
      this.showAmtError = true;
    } else {
      this.showAmtError = false;
    }
  }
}
