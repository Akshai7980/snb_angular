import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Location } from '@angular/common';
import { CardsService } from '../../services/cards.service';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';

@Component({
  selector: 'app-re-issue-credit-card-layout',
  templateUrl: './re-issue-credit-card-layout.component.html',
  styleUrls: ['./re-issue-credit-card-layout.component.scss'],
})
export class ReIssueCreditCardLayoutComponent implements OnInit {
  reIssueDetailsObj: any = {};

  rootScopeData: RootScopeDeclare = RootScopeData;
  @Output() getProceedEmit = new EventEmitter<any>();

  reIssueDetails: any = [];

  isLoadingCompelete: boolean = true;
  showCardDetails: boolean = false;

  constructor(
    private readonly location: Location,
    private readonly cardService: CardsService,
    private readonly router: Router
  ) {
    this.rootScopeData.changeHeading = 'Review';
  }

  ngOnInit(): void {
    if (JSON.stringify(this.rootScopeData.creditCardMoreActionList) === '{}') {
      this.router.navigate(['/cards/cardsInquiry']);
    }
    this.getCardDetails();
  }

  getCardDetails() {
    this.isLoadingCompelete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cardId: this.rootScopeData.creditCardMoreActionList.cardId
        ? this.rootScopeData.creditCardMoreActionList.cardId
        : '',
    };
    this.cardService.cardDetails(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res && res.dataValue && res.dataValue.CardDetails) {
          this.reIssueDetails = res.dataValue.CardDetails;
          this.reIssueDetails.maskedCardId =
            this.rootScopeData.creditCardListDetail.maskedCardId;
          const currencyPipe = new CurrencyFormatPipe();
          this.reIssueDetails.balance1 = currencyPipe.transform(
            this.reIssueDetails.balance.toString(),
            this.rootScopeData.creditCardListDetail.currency
          );
          this.reIssueDetails.currency =
            this.rootScopeData.creditCardListDetail.currency;
          this.rootScopeData.accDetailsObject = this.reIssueDetails;
          this.reIssueDetails = [this.reIssueDetails];
        }

        this.showCardDetails = true;
        this.constructReIssueTable(this.reIssueDetails);
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  constructReIssueTable(reIssueDetails: any) {
    this.reIssueDetailsObj = {
      title: 'LBL_CREDIT_CARD',
      data: reIssueDetails,
      fieldDetails: [
        {
          dispKey: 'LBL_CARD_NO',
          dataKey: 'maskedCardId',
        },
        {
          dispKey: 'LBL_CARD_NAME',
          dataKey: 'holderName',
        },
        {
          dispKey: 'LBL_CARD_TYPE',
          dataKey: 'cardType',
        },
        {
          dispKey: 'LBL_STATUS',
          dataKey: 'samaStatus',
        },
        {
          dispKey: 'LBL_BALANCE_AMOUNT',
          dataKey: 'balance1',
          dataKeySupport: 'currency', // need to integrate, as of now it is not in card summary API.
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
      cardDetails: this.reIssueDetails,
    };
    this.getProceedEmit.emit(data);
  }
}
