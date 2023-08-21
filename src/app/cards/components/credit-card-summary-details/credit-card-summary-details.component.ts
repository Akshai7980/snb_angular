import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MaskCardNumberPipe } from 'src/app/pipes/mask-card-number.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-credit-card-summary-details',
  templateUrl: './credit-card-summary-details.component.html',
  styleUrls: ['./credit-card-summary-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('false', style({ height: '0px', minHeight: '0' })),
      state('true', style({ height: '*' })),
      transition('false <=> true', animate('.3s cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class CreditCardSummaryDetailsComponent implements OnInit {

  summaryDetails: any = {};
  cardDetails: any = {};
  isLoadingComplete: boolean = true;
  isShowCardDetails: string = 'true';
  activeTab: string = "recentTransactions";
  printSection: string = 'creditCardSummary';
  logo = 'assets/images/snb-logo-print.png';
  cardImage: any;

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private cardsService: CardsService, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    if (Object.keys(this.rootScopeData.creditCardListDetail).length <= 0) {
      this.router.navigate(['/cards/cardsInquiry']);
      return;
    }

    this.cardDetails = this.rootScopeData.creditCardListDetail;
    this.getCreditCardImage();
    this.getCardDetails();
  }

  getCreditCardImage() {
    this.isLoadingComplete = false;
    this.cardsService.getCreditCardImage().subscribe(async (res: any) => {
      this.isLoadingComplete = true;
      if (res.length > 0) {
        this.cardImage = {
          front: await this.sanitizer.bypassSecurityTrustUrl(`data:image/*;base64,${res[0].IMAGE_FRONT_CONTENT}`),
          back: await this.sanitizer.bypassSecurityTrustUrl(`data:image/*;base64,${res[0].IMAGE_BACK_CONTENT}`)
        };
      }
    }, () => {
      this.isLoadingComplete = true;
    })
  }

  getCardDetails() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
      cardId: this.cardDetails.cardId
    };
    this.cardsService.cardDetails(params).subscribe(
      (res: any) => {
        this.isLoadingComplete = true;
        if (res && res.dataValue && res.dataValue.CardDetails) {
          this.summaryDetails = res.dataValue.CardDetails;
          this.rootScopeData.accDetailsObject = res.dataValue.CardDetails;
          const maskCardNumber = new MaskCardNumberPipe();
          this.summaryDetails.maskedCardId = maskCardNumber.transform(
            this.summaryDetails.cardId
          );
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
  }

  returnToSummaryPage() {

  }

  showCardDetails() {
    this.isShowCardDetails = this.isShowCardDetails === "true" ? "false" : "true";
  }
  onClickBack() {
    this.router.navigate(['/cards/cardsInquiry'])
  }
}
