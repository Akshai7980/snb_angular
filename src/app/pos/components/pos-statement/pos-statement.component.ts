import { Component, Input, OnInit } from '@angular/core';
import { PosService } from '../../services/pos.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-pos-statement',
  templateUrl: './pos-statement.component.html',
  styleUrls: ['./pos-statement.component.scss'],
})
export class PosStatementComponent implements OnInit {
  showGenerateStatement: boolean = false;
  showpos: boolean = true;
  merchantDetail: any;
  showReceipt: boolean = false;
  receiptData: any;
  statementDetailData: any;
  @Input() showIntialPageEmit: any;
  referenceNumber: string = '';
  rootScopeData: RootScopeDeclare = RootScopeData;
  isLoadingComplete: boolean = true;

  constructor(private readonly posService: PosService) {}

  ngOnInit(): void {}
  showEmitData(event: any) {
    this.merchantDetail = event;
    this.showGenerateStatement = event.proceed;
    this.showpos = !event.proceed;
  }

  showItialPage(event: any) {
    this.showGenerateStatement = !event.clear;
    this.showpos = event.clear;
    //this.showIntialPageEmit = event;
  }

  submitfn(event: any) {
    this.statementDetailData = event;
    this.isLoadingComplete = false;

    let merchant: {
      MERCHANTARBNAME: any;
      MERCHANTENGNAME: any;
      MERCHANTNUMBER: any;
      SHOPNAME: any;
    }[] = [];
    this.merchantDetail.merchant.forEach((element: any) => {
      merchant.push({
        MERCHANTARBNAME: element?.merchantNameInArabic
          ? element.merchantNameInArabic
          : '',
        MERCHANTENGNAME: element?.merchantNameInEnglish
          ? element.merchantNameInEnglish
          : '',
        MERCHANTNUMBER: element?.merchantNumber ? element.merchantNumber : '',
        SHOPNAME: element?.shopEnglishName ? element.shopEnglishName : '',
      });
    });

    let terminal: { TERMINALID: any; TERMINALTYPE: any }[] = [];
    this.merchantDetail.terminal.forEach((element: any) => {
      terminal.push({
        TERMINALID: element?.retailerId ? element.retailerId : '',
        TERMINALTYPE: element?.retailerName ? element.retailerName : '',
      });
    });

    let account: {
      ACCNO: any;
      NICKNAME: any;
      FULLNAME: any;
      STATUS: any;
      BALANCE: any;
      CURRENCY: any;
    }[] = [];
    this.merchantDetail.account.forEach((element: any) => {
      account.push({
        ACCNO: element?.OD_ACC_NO ? element.OD_ACC_NO : '',
        NICKNAME: element?.ALIAS_NAME ? element.ALIAS_NAME : '',
        FULLNAME: element?.OD_ACC_NAME ? element.OD_ACC_NAME : '',
        STATUS: element?.STATUS ? element.STATUS : '',
        BALANCE: element?.CURR_AVAIL_BAL_AMT ? element.CURR_AVAIL_BAL_AMT : '',
        CURRENCY: element?.OD_CCY_CODE ? element.OD_CCY_CODE : '',
      });
    });

    const params = {
      INPUT_CIF_NO: this.rootScopeData.creditCardMoreActionList.cifNo
        ? this.rootScopeData.creditCardMoreActionList.cifNo
        : '',
      INPUT_UNIT_ID: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      ACCNO: this.merchantDetail.account[0].OD_ACC_NO,
      NICKNAME: this.merchantDetail.account[0].ALIAS_NAME,
      FULLNAME: this.merchantDetail.account[0].OD_ACC_NAME,
      STATUS: this.merchantDetail.account[0].STATUS,
      BALANCE: this.merchantDetail.account[0].CURR_AVAIL_BAL_AMT,
      MERCHANT: [merchant],
      TERMINAL: [terminal],
      CARDTYPE: this.statementDetailData.cardValue,
      PERIOD: this.statementDetailData.periodValue,
      DATESORT: this.statementDetailData.dateSortData,
      SETTLED: this.statementDetailData.settledData,
      AMOUNT_FROM: this.statementDetailData.amountFromData,
      AMOUNT_TO: this.statementDetailData.amountToData,
      SEQUENCE: this.statementDetailData.sequenceData,
      AUTHORIZATIONNUMBER: this.statementDetailData.authNumberData,
      EXPORTAS: this.statementDetailData.cardTypeData,
    };
    this.posService.posStatementSubmit(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        if (
          res &&
          res.dataValue &&
          res.dataValue.STATUS &&
          res.dataValue.STATUS === 'SUCCESS'
        ) {
          this.referenceNumber = res.dataValue.INPUT_REFERENCE_NO;
          this.showReceipt = true;
          this.constructReceiptData(this.referenceNumber);
        }
      },
      (error: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  constructReceiptData(refNumber: any) {
    this.receiptData = {
      msg1: 'LBL_REQUEST_SUCCSFL',
      msg2: 'LBL_YOUR_POS_STATEMENT_IS_READY_TO_DOWNLOAD',
      referenceNumber: refNumber,

      receiptDetails: [],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      initiateButton: {
        buttonLabel: 'LBL_GENERATE_ANOTHER_STATEMENT',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    let date = {
      title: 'LBL_STATEMENT_DETAILS',
      isTable: 'false',
      data: this.statementDetailData,
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: this.statementDetailData.cardValue
            ? this.statementDetailData.cardValue
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_PERIOD',
          dataKey: this.statementDetailData.periodValue
            ? this.statementDetailData.periodValue
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_DATE',
          dataKey:
            this.statementDetailData.dateFrom && this.statementDetailData.dateTo
              ? this.statementDetailData.dateFrom +
                ' - ' +
                this.statementDetailData.dateTo
              : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_SETTLED',
          dataKey: this.statementDetailData.settledData
            ? this.statementDetailData.settledData
            : ' LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_DATE_SORT',
          dataKey: this.statementDetailData.dateSortData
            ? this.statementDetailData.dateSortData
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_AMOUNT',
          dataKey:
            this.statementDetailData.amountFromData &&
            this.statementDetailData.amountToData
              ? this.statementDetailData.amountFromData +
                ' SAR' +
                ' - ' +
                this.statementDetailData.amountToData +
                ' SAR'
              : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_SEQUENCE',
          dataKey: this.statementDetailData.sequenceData
            ? this.statementDetailData.sequenceData
            : ' LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_AUTHORIZATION_NUMBER',
          dataKey: this.statementDetailData.authNumberData
            ? this.statementDetailData.authNumberData
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_EXPORT_AS',
          dataKey: this.statementDetailData.cardTypeData
            ? this.statementDetailData.cardTypeData
            : 'LBL_NOT_PROVIDED',
        },
      ],
    };

    let withoutDate = {
      title: 'LBL_STATEMENT_DETAILS',
      isTable: 'false',
      data: this.statementDetailData,
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: this.statementDetailData.cardValue
            ? this.statementDetailData.cardValue
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_PERIOD',
          dataKey: this.statementDetailData.periodValue
            ? this.statementDetailData.periodValue
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: '',
          dataKey: '',
        },
        {
          dispKey: 'LBL_SETTLED',
          dataKey: this.statementDetailData.settledData
            ? this.statementDetailData.settledData
            : ' LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_DATE_SORT',
          dataKey: this.statementDetailData.dateSortData
            ? this.statementDetailData.dateSortData
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_AMOUNT',
          dataKey:
            this.statementDetailData.amountFromData &&
            this.statementDetailData.amountToData
              ? this.statementDetailData.amountFromData +
                ' SAR' +
                ' - ' +
                this.statementDetailData.amountToData +
                ' SAR'
              : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_SEQUENCE',
          dataKey: this.statementDetailData.sequenceData
            ? this.statementDetailData.sequenceData
            : ' LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_AUTHORIZATION_NUMBER',
          dataKey: this.statementDetailData.authNumberData
            ? this.statementDetailData.authNumberData
            : 'LBL_NOT_PROVIDED',
        },
        {
          dispKey: 'LBL_EXPORT_AS',
          dataKey: this.statementDetailData.cardTypeData
            ? this.statementDetailData.cardTypeData
            : 'LBL_NOT_PROVIDED',
        },
      ],
    };

    if (this.statementDetailData.periodValue === 'Custom Date')
      this.receiptData.receiptDetails.push(date);
    else this.receiptData.receiptDetails.push(withoutDate);
  }

  initiateAnotherRequest() {
    this.showpos = true;
    this.showGenerateStatement = false;
    this.showReceipt = false;
  }
}
