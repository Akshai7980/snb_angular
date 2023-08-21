import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':increment', [
        style({ opacity: 0.1 }),
        animate('2s ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ opacity: 0.1 }),
        animate('2s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class PromotionsComponent implements OnInit {
  isLoadingCompelete = true;
  marketPlaceData:any;
  marketPlaceMessage:any;
  marketPlaceTitle:any;
  markertPlaceTimer:any;
  marketPlaceIcon:any;
  carouselValue=0;
  isShownCarouselIndicator = false;
  @Input() langDirection:any;
  constructor(private promotionService: DashboardService, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // this.promotionsInfo()
  }

  ngOnChanges(){
    if(this.langDirection)
    {
      this.promotionsInfo()
    }
  }

  promotionsInfo(){
    this.isLoadingCompelete = false;
    this.promotionService.getPromotionsInfo().subscribe((response:any)=>{
      this.isLoadingCompelete = true;
      this.marketPlaceData = response;
      this.carouselbtn(this.carouselValue);
    }, error => {
      this.isLoadingCompelete = true;
    })
}
carouselbtn(data:any) {
  clearInterval(this.markertPlaceTimer);
  this.carouselValue = data
  this.marketPlaceMessage= this.marketPlaceData[this.carouselValue].TEXT_CONTENT;
  // this.marketPlaceTitle= this.marketPlaceData.DATA.ALL_RECORDS[this.carouselValue].TITLE;
  this.marketPlaceIcon= this.domSanitizer.bypassSecurityTrustUrl("data:image/png;base64, "+this.marketPlaceData[this.carouselValue].IMAGE_CONTENT);
  this.markertPlaceTimer = setInterval(() => { this.marketPlaceInterval() }, 5000)
}
marketPlaceInterval() {
  if (this.marketPlaceData.length - 1 == this.carouselValue) {
    this.carouselValue = 0;
  }
  else {
    this.carouselValue += 1;
  }
  this.carouselbtn(this.carouselValue)
}

}
