import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Location } from '@angular/common';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-credit-view-pin-layout',
  templateUrl: './credit-view-pin-layout.component.html',
  styleUrls: ['./credit-view-pin-layout.component.scss'],
})
export class CreditViewPinLayoutComponent implements OnInit {
  viewPinDetailsObj: any = {};

  @Output() getProceedEmit = new EventEmitter<any>();

  isLoadingComplete: boolean = true;
  @Input() cardDetails: any = {};

  constructor(private location: Location, private cardService: CardsService) {}

  ngOnInit(): void {
    this.viewPinDetailsObj = {
      title: 'LBL_CREDIT_CARD',
      data: [this.cardDetails],
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'maskedCardId',
        },
        {
          dispKey: 'LBL_CARD_NAME',
          dataKey: 'holderName'
        },
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: 'cardType',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'statusDescription',
        },
        {
          dispKey: 'LBL_BALANCE_AMOUNT',
          dataKey: 'balance',
          dataKeySupport: 'currency'
        },
      ],
    };
  }

  toCancel() {
    this.location.back();
  }

  toProceed() {
    const data = {
      canProceed: true,
    };
    this.getProceedEmit.emit(data);
  }
}
