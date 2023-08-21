import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss'],
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
export class MarketPlaceComponent implements OnInit {
  marketPlaceData:any;
  marketPlaceMessage:any;
  marketPlaceTitle:any;
  markertPlaceTimer:any;
  marketPlaceIcon:any;
  carouselValue=0;
  isLoadingCompelete = true;
  marketPlaceURL:any;
  marketPlaceInternalURL:any;
  marketPlaceURLType:any;
  hidecarouselBtns = false;
  @Input() langDirection:any;
  rootScopeData:RootScopeDeclare=RootScopeData;
  constructor(private marketPlaceService: DashboardService, private domSanitizer: DomSanitizer,private router: Router) { }

  ngOnInit(): void {
// this.marketPlaceInfo()
  }

  ngOnChanges(){
    if(this.langDirection)
    {
      this.marketPlaceInfo()
    }
  }

  marketPlaceInfo(){
    this.isLoadingCompelete = false;
    this.marketPlaceService.getMarketPlaceInfo().subscribe((response:any)=>{
      this.isLoadingCompelete = true;
      if(response)
      {
        this.marketPlaceData = response;
        this.carouselbtn(this.carouselValue);
        this.hidecarouselBtns = true;
      }
      else{
        this.hidecarouselBtns = false;
      }
      
    }, error => {
      this.isLoadingCompelete = true;
    })
}
carouselbtn(data:any) {
  clearInterval(this.markertPlaceTimer);
  this.carouselValue = data

  this.marketPlaceMessage= this.marketPlaceData[this.carouselValue].TEXT_CONTENT;
  // this.marketPlaceTitle= this.marketPlaceData.DATA.ALL_RECORDS[this.carouselValue].TITLE;  
  this.marketPlaceURL = this.marketPlaceData[this.carouselValue].URL_CONTENT ? this.marketPlaceData[this.carouselValue].URL_CONTENT:"";
  this.marketPlaceURLType = this.marketPlaceData[this.carouselValue].URL_TYPE ? this.marketPlaceData[this.carouselValue].URL_TYPE : "";
  this.marketPlaceInternalURL = this.marketPlaceData[this.carouselValue].MENU_ID ?this.marketPlaceData[this.carouselValue].MENU_ID :"";
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

reloadCurrentRoute(route:any) {
  let currentUrl = route;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
      this.rootScopeData.currentUrl=route
  });
}
}
