import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-credit-card-payment-layout',
  templateUrl: './credit-card-payment-layout.component.html',
  styleUrls: ['./credit-card-payment-layout.component.scss'],
})
export class CreditCardPaymentLayoutComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;

  viewPinDetails: any = [
    {
      name: 'Dameer Ahsan',
      number: 'SA1010 0100 1000 0000 0011',
      shortName: 'Dameer',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
    {
      name: 'Dameer Ahsan',
      number: 'SA1010 0100 1000 0000 0011',
      shortName: 'Dameer',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
    {
      name: 'Dameer Ahsan',
      number: 'SA1010 0100 1000 0000 0011',
      shortName: 'Dameer',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
    {
      name: 'Dameer Ahsan',
      number: 'SA1010 0100 1000 0000 0011',
      shortName: 'Dameer',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
    {
      name: 'Dameer Ahsan',
      number: 'SA1010 0100 1000 0000 0011',
      shortName: 'Dameer',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
  ];

  creditCardList: any = [
    {
      name: 'Dameer Ahsan',
      number: '1010 XXXX XXXX 0011',
      type: 'MADA Card',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
    {
      name: 'Dameer Ahsan',
      number: '1010 XXXX XXXX 0011',
      type: 'VISA Card',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
    {
      name: 'Dameer Ahsan',
      number: '1010 XXXX XXXX 0011',
      type: 'MADA Card',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
    {
      name: 'Dameer Ahsan',
      number: '1010 XXXX XXXX 0011',
      type: 'VISA Card',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
    {
      name: 'Dameer Ahsan',
      number: '1010 XXXX XXXX 0011',
      type: 'VISA Card',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
  ];

  fromDataDetailsObj: any = {};
  creditCardDetailsObj: any = {};
  @Output() getProceedEmit = new EventEmitter<any>();
  setColumnWidth: boolean = true;
  shownSearchFlag: boolean = true;
  toCreditCardList: boolean = false;
  debitAccDetails: any;
  accountDetailsToDisplay: any;
  tableId: string = '';
  showCardDetails: boolean = false;
  selectedFromData: any;
  selectedCardData: any;
  isChecked: string = 'Outstanding';

  cardDetailsObj: any = {};
  from: any = [
    {
      name: 'Dameer Ahsan',
      number: 'SA1010 0100 1000 0000 0011',
      shortName: 'Dameer',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
  ];

  card: any = [
    {
      number: '1010 XXXX XXXX 0011',
      shortName: 'Dameer',
      type: 'MADA Card',
      status: 'Active',
      amount: '15,235.00',
      currency: 'SAR',
    },
  ];

  fromDataColumns: any = [
    'AccountNumber',
    'Nickname',
    'FullName',
    'Status',
    'Balance',
  ];
  cardDataColumns: any = [
    'cardNumber',
    'Nickname',
    'cardType',
    'Status',
    'balanceAmount',
  ];
  otherAmount: string = '';

  dailyLimitObj: any = {
    availPayLimit: '90000.00',
    baseCcy: 'SAR',
    maxIndTxnLimit: '100000.00',
  };
  showDailyLimit: boolean = false;
  constructor() {
    // this.rootScopeData.changeHeading = 'Review';
  }

  ngOnInit(): void {
    this.constructFromTable();
  }

  constructFromTable() {
    this.fromDataDetailsObj = {
      title: 'From',
      data: this.viewPinDetails,
      fieldDetails: [
        {
          dispKey: 'Account Number',
          dataKey: 'number',
        },
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'shortName',
        },
        {
          dispKey: 'Full Name',
          dataKey: 'name',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'status',
        },
        {
          dispKey: 'Balance',
          dataKey: 'amount',
          dataKeySupport: 'currency',
        },
      ],
    };
  }

  getDisplayStatus(event: any, type: string) {
    if (type === 'fromData') {
      this.selectedFromData = event;
      this.toCreditCardList = true;
      this.constructCreditTable();
      this.showDailyLimit = true;
      this.rootScopeData.dailyLimit = this.dailyLimitObj;
    }
    if (type === 'creditCard') {
      this.selectedCardData = event;
      this.showCardDetails = true;
    }
  }

  constructCreditTable() {
    this.creditCardDetailsObj = {
      title: 'LBL_CREDIT_CARD',
      subTitle: 'LBL_FROM',
      data: this.creditCardList,
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'number',
        },
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'name',
        },
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: 'type',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'status',
        },
        {
          dispKey: 'LBL_BALANCE_AMOUNT',
          dataKey: 'amount',
          dataKeySupport: 'currency',
        },
      ],
    };
  }

  toCancel() {
    this.toCreditCardList = false;
    this.showDailyLimit = false;
    this.constructFromTable();
  }

  onChangeLimit(card: any) {
    // let index = -1;
    // this.newLimitAddedList.map((val, i) => {
    //   if (val.tempId === card.tempId)
    //     index = i;
    // })
    // card.newLimit = parseInt(card.newLimit).toFixed(2);
    // if (card.newLimit && card.newLimit > 0 && index <= -1) {
    //   this.newLimitAddedList.push(card)
    // } else {
    //   this.newLimitAddedList.splice(index, 1);
    // }
    // if (this.newLimitAddedList.length > 0) this.showErrMsg = false;
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  displayContent(type: string) {
    if (type) {
      this.isChecked = type;
    }
  }

  toProceed() {
    const data = {
      canProceed: true,
      cardDetails: this.viewPinDetails,
    };
    this.getProceedEmit.emit(data);
  }

  selectedRow(rowData: any) {
    if (rowData == 'iconClick') {
      event?.stopPropagation();
      this.rootScopeData.sadadMoiFromRest = true;
    }
  }

  getDebitInfo() {
    this.cardDetailsObj = {
      title: 'Credit Card',
      data: [this.from],
      fromDetails: [
        {
          dispKey: 'Account Number',
          dataKey: 'number',
        },
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'name',
        },
        {
          dispKey: 'Full Name',
          dataKey: 'type',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'status',
        },
        {
          dispKey: 'Balance',
          dataKey: 'amount',
          dataKeySupport: 'currency',
        },
      ],

      secondTitle: 'Credit Card',
      details: [this.from],
      cardDetails: [
        {
          dispKey: 'Account Number',
          dataKey: 'number',
        },
        {
          dispKey: 'LBL_NICKNAME',
          dataKey: 'name',
        },
        {
          dispKey: 'Full Name',
          dataKey: 'type',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'status',
        },
        {
          dispKey: 'Balance',
          dataKey: 'amount',
          dataKeySupport: 'currency',
        },
      ],
    };
    this.accountDetailsToDisplay = Object.assign({}, this.cardDetailsObj);
  }
}
