import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { DigitalHubService } from '../../services/digital-hub.service';

@Component({
  selector: 'app-digital-hub',
  templateUrl: './digital-hub.component.html',
  styleUrls: ['./digital-hub.component.scss'],
})
export class DigitalHubComponent implements OnInit {
  isLoadingComplete: boolean = false;
  banners: any = [];

  constructor(
    private readonly digitalHubService: DigitalHubService,
    private readonly router: Router
  ) {}
  rootScopeData: RootScopeDeclare = RootScopeData;
  
  ngOnInit(): void {
    this.isLoadingComplete = false;
    this.digitalHubService.getBanners().subscribe(
      (banners) => {
        this.isLoadingComplete = true;
        if (
          banners &&
          banners.DATA.digitalHubProduct &&
          banners.DATA.digitalHubProduct.length
        ) {
          this.banners = banners.DATA.digitalHubProduct;
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  redirect(banner: any): void {
    if (banner.itemId && this.rootScopeData.urlMapping[banner.itemId]) {
      this.router.navigate([this.rootScopeData.urlMapping[banner.itemId]]);
    }
  }
}
